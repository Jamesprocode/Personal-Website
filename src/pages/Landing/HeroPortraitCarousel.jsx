import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import proPhoto from '../../assets/me.webp';
import useIsMobile from '../../hooks/useIsMobile';
import { isMotionEffectDisabled } from '../../performance/motionDebug';

// All processed hero frames, ordered by their numeric filename prefix
// (01-…, 02-…). Vite fingerprints each URL so they cache well behind
// Cloudflare. import.meta.glob keeps this in sync if frames are added or
// removed; no manual import list to maintain.
const modules = import.meta.glob('../../assets/hero/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
});
const PERFORMANCE_FRAMES = Object.entries(modules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, url]) => ({ url, key: path.split('/').pop() }));

const PROFESSIONAL_FRAME = { url: proPhoto, key: '00-professional.webp' };
const INITIAL_FRAME_INDEX = 0;

// The professional portrait leads the set: the hero opens on a recognizable
// headshot, and the visitor clicks through to the performance frames behind
// it. Kept outside the glob so frame 0 is always the professional photo,
// regardless of how many performance images are added later.
const FRAMES = [PROFESSIONAL_FRAME, ...PERFORMANCE_FRAMES];

// Per-frame focal point for the 1:1 cover crop, plus an i18n alt key. The
// photos are mixed portrait/landscape, so object-position keeps the subject
// in frame instead of center-cropping heads off. altKey resolves through
// react-i18next with an English default, so the carousel is described for
// screen readers and stays translatable for the zh audience.
const META = {
  '00-professional.webp': { pos: '50% 26%', altKey: 'hero.photo.professional', alt: 'James Wang — professional portrait' },
  '01-sax-solo.webp': { pos: '50% 30%', altKey: 'hero.photo.saxSolo', alt: 'James Wang playing tenor saxophone on stage' },
  '02-studio-console.webp': { pos: '64% 50%', altKey: 'hero.photo.studio', alt: 'James Wang at a recording studio mixing console' },
  '03-conducting.webp': { pos: '50% 42%', altKey: 'hero.photo.conducting', alt: 'James Wang conducting an orchestra' },
  '04-singing-live.webp': { pos: '60% 45%', altKey: 'hero.photo.singing', alt: 'James Wang singing at an outdoor evening performance' },
  '05-tea-house.webp': { pos: '60% 50%', altKey: 'hero.photo.teaHouse', alt: 'James Wang at a tea house garden' },
  '06-guitar.webp': { pos: '50% 38%', altKey: 'hero.photo.guitar', alt: 'James Wang playing acoustic guitar' },
  '07-sax-stage.webp': { pos: '45% 38%', altKey: 'hero.photo.saxStage', alt: 'James Wang performing a saxophone solo for an audience' },
  '08-piano.webp': { pos: '30% 50%', altKey: 'hero.photo.piano', alt: 'James Wang playing grand piano in a recital hall' },
  '09-big-band.webp': { pos: '50% 45%', altKey: 'hero.photo.bigBand', alt: 'James Wang performing with a jazz big band at dusk' },
  '10-combo.webp': { pos: '55% 42%', altKey: 'hero.photo.combo', alt: 'James Wang performing in an outdoor combo' },
  '11-sax-section.webp': { pos: '42% 42%', altKey: 'hero.photo.saxSection', alt: 'James Wang in a jazz ensemble saxophone section' },
  '12-desert-guitar.webp': { pos: '50% 58%', altKey: 'hero.photo.desert', alt: 'James Wang playing guitar at desert sunset' },
  '13-tuba.webp': { pos: '60% 42%', altKey: 'hero.photo.tuba', alt: 'James Wang practicing tuba' },
};

// The carousel opens on the professional portrait, then gently auto-fades
// through the performance frames. Manual controls still pause the motion on
// hover/focus, and Save-Data / reduced-motion users keep deliberate browsing.
const AUTO_ADVANCE = true;
const DWELL_MS = 5200; // (only used when AUTO_ADVANCE) time each frame holds
const FADE_MS = 850; // cross-dissolve duration for deliberate manual browsing
const SWIPE_PX = 44; // horizontal travel that counts as a swipe
const TAP_PX = 8; // movement under this counts as a click/tap, not a drag
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const DOUBLE_TAP_ZOOM = 2.25;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getDistance(pointA, pointB) {
  return Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y);
}

function getMidpoint(pointA, pointB) {
  return {
    x: (pointA.x + pointB.x) / 2,
    y: (pointA.y + pointB.y) / 2,
  };
}

function prefersSaveData() {
  if (typeof navigator === 'undefined') return false;
  const c = navigator.connection;
  // Honor explicit Save-Data and very slow effective connections. Many of
  // the site's visitors reach it over VPNs from China on constrained links;
  // for them we never auto-cycle (which would pull every frame), only load
  // more when they deliberately swipe.
  return Boolean(c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || '')));
}

const navButtonBase = {
  position: 'absolute',
  top: '50%',
  zIndex: 2,
  width: 'clamp(2rem, 3vw, 2.4rem)',
  height: 'clamp(2rem, 3vw, 2.4rem)',
  padding: 0,
  border: '1px solid rgba(253, 244, 220, 0.82)',
  borderRadius: 9999,
  color: '#4a3f35',
  backgroundColor: 'rgba(253, 244, 220, 0.82)',
  boxShadow: '0 7px 20px rgba(60, 35, 10, 0.26)',
  cursor: 'pointer',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.35rem',
  lineHeight: 1,
  transition:
    'opacity 260ms ease, transform 320ms cubic-bezier(0.16,1,0.3,1), background-color 260ms ease, border-color 260ms ease',
};

function HeroPortraitCarousel({ reduceMotion }) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const count = FRAMES.length;
  const [index, setIndex] = useState(INITIAL_FRAME_INDEX);
  // Which frames have been mounted (and therefore fetched). We start with ONLY
  // the portrait (frame 0). There's no opening cross-fade anymore (auto-advance
  // is off and it rests on the portrait), so the second frame is prefetched
  // during browser idle instead of competing with the portrait's LCP fetch —
  // the initial paint costs exactly one image for the bandwidth-sensitive
  // (China/VPN) audience. Each later frame is pulled in just before it's needed.
  const [mounted, setMounted] = useState(() => new Set([INITIAL_FRAME_INDEX]));
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(MIN_ZOOM);
  const [zoomPan, setZoomPan] = useState({ x: 0, y: 0 });
  const [zoomInteracting, setZoomInteracting] = useState(false);

  const rootRef = useRef(null);
  const pointerStart = useRef(null);
  const zoomPointersRef = useRef(new Map());
  const zoomGestureRef = useRef(null);
  const zoomLastTapRef = useRef(0);
  const zoomLastToggleRef = useRef(0);
  const zoomStateRef = useRef({ scale: MIN_ZOOM, pan: { x: 0, y: 0 } });
  // Mirrors `index` so the imperative handlers (swipe, arrow keys, the
  // auto-advance timeout) can read the current frame without re-subscribing.
  const indexRef = useRef(INITIAL_FRAME_INDEX);
  // Computed once at mount (the connection's Save-Data flag doesn't change
  // mid-session in practice). State, not a ref, so it can be read in render.
  const [saveData] = useState(prefersSaveData);
  const disableCarousel = isMotionEffectDisabled('carousel');

  const autoOk = !reduceMotion && !saveData && !disableCarousel;
  const activeFrame = FRAMES[index];
  const activeMeta = META[activeFrame?.key] || {};

  const setZoomTransform = useCallback((nextScale, nextPan) => {
    const scale = clamp(nextScale, MIN_ZOOM, MAX_ZOOM);
    const pan = scale <= MIN_ZOOM + 0.01 ? { x: 0, y: 0 } : nextPan;
    zoomStateRef.current = { scale, pan };
    setZoomScale(scale);
    setZoomPan(pan);
  }, []);

  const resetZoom = useCallback(() => {
    zoomPointersRef.current.clear();
    zoomGestureRef.current = null;
    zoomLastTapRef.current = 0;
    zoomLastToggleRef.current = 0;
    setZoomInteracting(false);
    setZoomTransform(MIN_ZOOM, { x: 0, y: 0 });
  }, [setZoomTransform]);

  const getZoomPoints = () => Array.from(zoomPointersRef.current.values());

  const startZoomPan = (point) => {
    zoomGestureRef.current = {
      type: 'pan',
      startPointer: point,
      startPan: zoomStateRef.current.pan,
    };
  };

  const startZoomPinch = (points) => {
    const [firstPoint, secondPoint] = points;
    zoomGestureRef.current = {
      type: 'pinch',
      startDistance: Math.max(getDistance(firstPoint, secondPoint), 1),
      startMidpoint: getMidpoint(firstPoint, secondPoint),
      startScale: zoomStateRef.current.scale,
      startPan: zoomStateRef.current.pan,
    };
  };

  // Single entry point for changing frame: moves the index and mounts the
  // target (plus the next one) in the same pass. Called only from event
  // handlers and the auto-advance timeout, never synchronously in an effect,
  // so the lazy-mount stays a side effect of interaction rather than render.
  const goTo = useCallback(
    (target) => {
      if (zoomOpen) resetZoom();
      const next = ((target % count) + count) % count;
      indexRef.current = next;
      setIndex(next);
      setMounted((prev) => {
        const after = (next + 1) % count;
        if (prev.has(next) && prev.has(after)) return prev;
        const s = new Set(prev);
        s.add(next);
        s.add(after);
        return s;
      });
    },
    [count, resetZoom, zoomOpen],
  );

  const go = useCallback(
    (dir) => {
      if (dir < 0 && indexRef.current === INITIAL_FRAME_INDEX) return;
      goTo(indexRef.current + dir);
    },
    [goTo],
  );

  // Auto-advance. Restarts whenever index/pause/visibility changes so a
  // manual swipe gives a full dwell before the next automatic move.
  useEffect(() => {
    if (!AUTO_ADVANCE || !autoOk || paused || !inView || count < 2) return undefined;
    const id = window.setTimeout(() => go(1), DWELL_MS);
    return () => window.clearTimeout(id);
  }, [autoOk, paused, inView, index, count, go]);

  // Prefetch the second frame once the browser is idle, so the first
  // click/tap cross-fades instantly without a blank flash — but only after
  // the portrait (LCP) has had the bandwidth to itself. Skipped on Save-Data /
  // 2G so constrained links pull frame 2 only on a deliberate interaction.
  useEffect(() => {
    if (count < 2 || saveData || disableCarousel) return undefined;
    const schedule = window.requestIdleCallback || ((fn) => window.setTimeout(fn, 1500));
    const cancel = window.cancelIdleCallback || window.clearTimeout;
    const id = schedule(() =>
      setMounted((prev) => {
        if (prev.has(1)) return prev;
        const s = new Set(prev);
        s.add(1);
        return s;
      }),
    );
    return () => cancel(id);
  }, [count, disableCarousel, saveData]);

  // Pause when the hero scrolls offscreen or the tab is hidden — no point
  // cross-fading (or fetching frames) the visitor cannot see.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.2,
    });
    obs.observe(el);
    const onVis = () => setInView(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      obs.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  useEffect(() => {
    if (!zoomOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setZoomOpen(false);
      if (event.key === 'ArrowRight') go(1);
      if (event.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [go, zoomOpen]);

  // Pointer swipe + tap (covers touch + mouse via Pointer Events).
  const onPointerDown = (e) => {
    pointerStart.current = { x: e.clientX, y: e.clientY, button: e.button };
    // Touch has no hover, so reveal the dot tray on first contact — otherwise
    // the dots stay pointerEvents:none and every tap (even one aimed at a dot)
    // falls through to the photo's advance handler. Revealing here makes the
    // dots directly tappable from the next interaction on.
    reveal();
  };
  const onPointerUp = (e) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
    } else if (
      start.button === 0 && // primary button / touch only — ignore right/middle-click
      Math.abs(dx) < TAP_PX &&
      Math.abs(dy) < TAP_PX &&
      !(e.target instanceof Element && e.target.closest('button'))
    ) {
      if (isMobile) {
        setPaused(true);
        resetZoom();
        setZoomOpen(true);
      } else {
        // Desktop keeps the original "click to change photo" interaction.
        go(1);
      }
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      // Keyboard equivalent of clicking the photo to change it.
      e.preventDefault();
      go(1);
    }
  };

  const reveal = () => setShowControls(true);
  const hide = () => setShowControls(false);

  const onZoomPointerDown = (event) => {
    event.preventDefault();
    if (event.currentTarget.setPointerCapture) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const point = { x: event.clientX, y: event.clientY };
    zoomPointersRef.current.set(event.pointerId, point);
    const points = getZoomPoints();
    setZoomInteracting(true);
    if (points.length >= 2) {
      startZoomPinch(points.slice(0, 2));
    } else {
      startZoomPan(point);
    }
  };

  const onZoomPointerMove = (event) => {
    if (!zoomPointersRef.current.has(event.pointerId)) return;
    event.preventDefault();
    zoomPointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = getZoomPoints();

    if (points.length >= 2) {
      if (!zoomGestureRef.current || zoomGestureRef.current.type !== 'pinch') {
        startZoomPinch(points.slice(0, 2));
      }
      const gesture = zoomGestureRef.current;
      const [firstPoint, secondPoint] = points;
      const currentDistance = Math.max(getDistance(firstPoint, secondPoint), 1);
      const currentMidpoint = getMidpoint(firstPoint, secondPoint);
      const nextScale = gesture.startScale * (currentDistance / gesture.startDistance);
      setZoomTransform(nextScale, {
        x: gesture.startPan.x + currentMidpoint.x - gesture.startMidpoint.x,
        y: gesture.startPan.y + currentMidpoint.y - gesture.startMidpoint.y,
      });
      return;
    }

    const [point] = points;
    if (!point) return;
    if (!zoomGestureRef.current || zoomGestureRef.current.type !== 'pan') {
      startZoomPan(point);
    }
    if (zoomStateRef.current.scale <= MIN_ZOOM + 0.01) return;
    const gesture = zoomGestureRef.current;
    setZoomTransform(zoomStateRef.current.scale, {
      x: gesture.startPan.x + point.x - gesture.startPointer.x,
      y: gesture.startPan.y + point.y - gesture.startPointer.y,
    });
  };

  const onZoomPointerEnd = (event) => {
    if (event.currentTarget.releasePointerCapture && event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    zoomPointersRef.current.delete(event.pointerId);
    const points = getZoomPoints();
    if (points.length >= 2) {
      startZoomPinch(points.slice(0, 2));
      return;
    }
    if (points.length === 1) {
      startZoomPan(points[0]);
      return;
    }
    zoomGestureRef.current = null;
    setZoomInteracting(false);
    if (zoomStateRef.current.scale < MIN_ZOOM + 0.04) {
      setZoomTransform(MIN_ZOOM, { x: 0, y: 0 });
    }
  };

  const toggleZoom = (timestamp) => {
    zoomLastToggleRef.current = timestamp;
    if (zoomStateRef.current.scale > MIN_ZOOM + 0.01) {
      setZoomTransform(MIN_ZOOM, { x: 0, y: 0 });
    } else {
      setZoomTransform(DOUBLE_TAP_ZOOM, { x: 0, y: 0 });
    }
  };

  const onZoomDoubleTap = (event) => {
    event.preventDefault();
    const now = event.timeStamp;
    if (now - zoomLastTapRef.current < 300) {
      toggleZoom(now);
      zoomLastTapRef.current = 0;
      return;
    }
    zoomLastTapRef.current = now;
  };

  const onZoomDoubleClick = (event) => {
    event.preventDefault();
    const now = event.timeStamp;
    if (now - zoomLastToggleRef.current < 80) return;
    toggleZoom(now);
  };

  const activeAlt = (() => {
    return activeMeta.altKey ? t(activeMeta.altKey, { defaultValue: activeMeta.alt }) : t('nav.brand');
  })();
  const getNavButtonStyle = (side, disabled = false) => {
    const active = showControls || hoveredNav === side;
    const slide = hoveredNav === side ? (side === 'previous' ? ' translateX(-2px)' : ' translateX(2px)') : '';
    return {
      ...navButtonBase,
      [side === 'previous' ? 'left' : 'right']: 'clamp(0.55rem, 1.3vw, 0.85rem)',
      opacity: showControls ? (disabled ? 0.42 : active ? 1 : 0.74) : 0,
      transform: `translateY(-50%)${slide}`,
      pointerEvents: showControls ? 'auto' : 'none',
      cursor: disabled ? 'default' : 'pointer',
      backgroundColor: active ? 'rgba(253, 244, 220, 0.94)' : 'rgba(253, 244, 220, 0.82)',
      borderColor: active ? 'rgba(196, 162, 101, 0.86)' : 'rgba(253, 244, 220, 0.82)',
    };
  };

  return (
    <>
      <div
        ref={rootRef}
        className="absolute inset-0"
        role="group"
        aria-roledescription={t('hero.photo.carousel', { defaultValue: 'image carousel' })}
        aria-label={t('hero.photo.groupLabel', { defaultValue: 'Photos of James Wang' })}
        aria-keyshortcuts="ArrowLeft ArrowRight Enter"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (pointerStart.current = null)}
        onMouseEnter={() => {
          setPaused(true);
          reveal();
        }}
        onMouseLeave={() => {
          setPaused(false);
          hide();
        }}
        onFocus={reveal}
        onBlur={hide}
        style={{
          cursor: count > 1 ? 'pointer' : 'default',
          touchAction: 'pan-y',
          outline: 'none',
          userSelect: 'none',
          overflow: 'hidden',
          borderRadius: '16%',
        }}
      >
      {/* Live region announces the current frame for screen readers without
          a visible caption. */}
      <span
        aria-live="polite"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
        }}
      >
        {activeAlt}
      </span>

      {FRAMES.map((frame, i) => {
        if (!mounted.has(i)) return null;
        const m = META[frame.key] || {};
        const isActive = i === index;
        return (
          <img
            key={frame.key}
            src={frame.url}
            alt={isActive ? t(m.altKey, { defaultValue: m.alt || '' }) : ''}
            aria-hidden={isActive ? undefined : true}
            draggable={false}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'auto'}
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              objectPosition: m.pos || 'center',
              opacity: isActive ? 1 : 0,
              transition: reduceMotion ? 'none' : `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
              willChange: 'opacity',
            }}
          />
        );
      })}

      {/* Cream vignette — softens the photo edges into the paper mat.
          Sits above the images, below the controls. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: '16%',
          boxShadow: 'inset 0 0 28px rgba(253, 244, 220, 0.55)',
        }}
      />

      {/* Controls layer: desktop arrows stay legible at rest; the counter gives
          orientation without asking visitors to parse fourteen tiny dots. */}
      {count > 1 && (
        <>
          <button
            type="button"
            className="hidden sm:flex"
            aria-label={t('hero.photo.previous', { defaultValue: 'Show previous photo' })}
            disabled={index === INITIAL_FRAME_INDEX}
            onClick={() => go(-1)}
            style={getNavButtonStyle('previous', index === INITIAL_FRAME_INDEX)}
            onMouseEnter={() => {
              setHoveredNav('previous');
              reveal();
            }}
            onMouseLeave={() => setHoveredNav(null)}
          >
            {'<'}
          </button>
          <button
            type="button"
            className="hidden sm:flex"
            aria-label={t('hero.photo.next', { defaultValue: 'Show next photo' })}
            onClick={() => go(1)}
            style={getNavButtonStyle('next')}
            onMouseEnter={() => {
              setHoveredNav('next');
              reveal();
            }}
            onMouseLeave={() => setHoveredNav(null)}
          >
            {'>'}
          </button>

          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 0 clamp(0.55rem, 1.4vw, 0.85rem)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                minWidth: 'clamp(5.9rem, 10vw, 7.5rem)',
                padding: '0.34rem 0.55rem',
                borderRadius: 9999,
                border: '1px solid rgba(253, 244, 220, 0.62)',
                backgroundColor: 'rgba(74, 63, 53, 0.46)',
                color: '#fdf4dc',
                fontSize: '0.72rem',
                fontWeight: 600,
                lineHeight: 1,
                boxShadow: '0 5px 16px rgba(60, 35, 10, 0.24)',
                opacity: showControls ? 1 : 0,
                transition: reduceMotion ? 'none' : 'opacity 260ms ease',
              }}
            >
              <span aria-hidden style={{ minWidth: '2.4rem', textAlign: 'center' }}>
                {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
              </span>
              <span
                aria-hidden
                style={{
                  position: 'relative',
                  flex: 1,
                  height: 3,
                  overflow: 'hidden',
                  borderRadius: 9999,
                  backgroundColor: 'rgba(253, 244, 220, 0.34)',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 9999,
                    backgroundColor: '#c4a265',
                    transform: `scaleX(${(index + 1) / count})`,
                    transformOrigin: 'left center',
                    transition: reduceMotion ? 'none' : 'transform 420ms cubic-bezier(0.16,1,0.3,1)',
                  }}
                />
              </span>
            </div>
          </div>

          <div
            aria-hidden={!showControls}
            className="absolute inset-x-0 bottom-0 pointer-events-none hidden sm:flex"
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.42rem',
              padding: '0 0 clamp(2.25rem, 4vw, 2.75rem)',
              opacity: showControls ? 1 : 0,
              transition: reduceMotion ? 'none' : 'opacity 280ms ease',
            }}
          >
            {FRAMES.map((frame, i) => (
            <button
              key={frame.key}
              type="button"
              tabIndex={showControls ? 0 : -1}
              aria-label={t('hero.photo.goTo', {
                defaultValue: 'Show photo {{n}} of {{total}}',
                n: i + 1,
                total: count,
              })}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => goTo(i)}
              style={{
                pointerEvents: showControls ? 'auto' : 'none',
                width: 18,
                height: 7,
                padding: 0,
                border: 0,
                borderRadius: 9999,
                cursor: 'pointer',
                backgroundColor: i === index ? '#c4a265' : 'rgba(253, 244, 220, 0.65)',
                boxShadow: '0 1px 3px rgba(60, 35, 10, 0.45)',
                transform: i === index ? 'scaleX(1)' : 'scaleX(0.39)',
                transition: 'transform 320ms cubic-bezier(0.16,1,0.3,1), background-color 320ms ease',
              }}
            />
            ))}
          </div>
        </>
      )}
      </div>

      {zoomOpen &&
        activeFrame &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
          role="dialog"
          aria-modal="true"
          aria-label={t('hero.photo.zoomLabel', { defaultValue: 'Expanded photo viewer' })}
          className="fixed inset-0 z-[120] bg-black/72 backdrop-blur-[3px]"
          onClick={(event) => {
            if (event.target === event.currentTarget) setZoomOpen(false);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding:
              'calc(env(safe-area-inset-top, 0px) + 1rem) 1rem calc(env(safe-area-inset-bottom, 0px) + 1rem)',
            touchAction: 'none',
          }}
        >
          <div
            className="bg-[rgba(20,15,12,0.96)] border border-[rgba(253,244,220,0.18)] shadow-[0_24px_80px_rgba(0,0,0,0.62)]"
            style={{
              width:
                'min(92vw, calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 2rem), 34rem)',
              aspectRatio: '1 / 1',
              borderRadius: '1.35rem',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                padding: '0.75rem 0.8rem 1.4rem',
                color: '#fdf4dc',
                background: 'linear-gradient(180deg, rgba(20, 15, 12, 0.88), rgba(20, 15, 12, 0))',
              }}
            >
              <p
                style={{
                  margin: 0,
                  minWidth: 0,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.7rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(253, 244, 220, 0.72)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')} · pinch / drag
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={resetZoom}
                  style={{
                    height: 38,
                    padding: '0 0.8rem',
                    borderRadius: 9999,
                    border: '1px solid rgba(253, 244, 220, 0.28)',
                    background: 'rgba(253, 244, 220, 0.08)',
                    color: '#fdf4dc',
                    fontSize: '0.72rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  Reset
                </button>
                <button
                  type="button"
                  aria-label={t('common.close', { defaultValue: 'Close' })}
                  onClick={() => setZoomOpen(false)}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 9999,
                    border: '1px solid rgba(253, 244, 220, 0.35)',
                    background: 'rgba(253, 244, 220, 0.08)',
                    color: '#fdf4dc',
                    fontSize: '1.45rem',
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            <div
              aria-label={t('hero.photo.zoomInstructions', {
                defaultValue: 'Pinch to zoom. Drag while zoomed. Double tap to toggle zoom.',
              })}
              onPointerDown={onZoomPointerDown}
              onPointerMove={onZoomPointerMove}
              onPointerUp={onZoomPointerEnd}
              onPointerCancel={onZoomPointerEnd}
              onLostPointerCapture={onZoomPointerEnd}
              onClick={onZoomDoubleTap}
              onDoubleClick={onZoomDoubleClick}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                touchAction: 'none',
                cursor: zoomScale > MIN_ZOOM + 0.01 ? 'grab' : 'zoom-in',
              }}
            >
              <img
                src={activeFrame.url}
                alt={activeAlt}
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: activeMeta.pos || 'center',
                  transform: `translate3d(${zoomPan.x}px, ${zoomPan.y}px, 0) scale(${zoomScale})`,
                  transformOrigin: 'center center',
                  transition: zoomInteracting || reduceMotion ? 'none' : 'transform 180ms ease-out',
                  touchAction: 'none',
                  userSelect: 'none',
                }}
              />
            </div>
          </div>
          </div>,
          document.body,
        )}
    </>
  );
}

export default HeroPortraitCarousel;
