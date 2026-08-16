import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion as Motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import coverBigBand from '../../assets/hero/09-big-band-enhanced.webp';
import coverStudio from '../../assets/hero/02-studio-console-enhanced.webp';
import coverPiano from '../../assets/hero/08-piano-enhanced.webp';
import portraitGuitar from '../../assets/hero/06-guitar-enhanced.webp';
import portraitSax from '../../assets/hero/01-sax-solo-enhanced.webp';
import portraitConducting from '../../assets/hero/03-conducting-enhanced.webp';
import portraitDesert from '../../assets/hero/12-desert-guitar-enhanced.webp';
import HeroPainterlyBackground from './HeroPainterlyBackground';
import './HomeExperience.css';

const COVER_PHOTOS = [
  { src: coverBigBand, alt: 'James Wang performing with a jazz big band at dusk', position: '50% 50%' },
  { src: coverStudio, alt: 'James Wang at a recording studio mixing console', position: '58% 50%' },
  { src: coverPiano, alt: 'James Wang playing grand piano in a recital hall', position: '34% 50%' },
];

const PORTRAIT_PHOTOS = [
  { src: portraitGuitar, alt: 'James Wang playing acoustic guitar', position: '50% 38%' },
  { src: portraitSax, alt: 'James Wang playing tenor saxophone on stage', position: '50% 30%' },
  { src: portraitConducting, alt: 'James Wang conducting an orchestra', position: '50% 42%' },
  { src: portraitDesert, alt: 'James Wang playing guitar at desert sunset', position: '50% 58%' },
];

const MOBILE_COVER_PHOTOS = [
  { src: portraitGuitar, alt: 'James Wang playing acoustic guitar', position: '50% 48%' },
  { src: portraitSax, alt: 'James Wang playing tenor saxophone on stage', position: '50% 32%' },
  { src: portraitConducting, alt: 'James Wang conducting an orchestra', position: '50% 46%' },
  { src: portraitDesert, alt: 'James Wang playing guitar at desert sunset', position: '50% 55%' },
];

const WAVEFORM_LEVELS = [
  0.3, 0.52, 0.76, 0.44, 0.88, 0.61, 0.35, 0.72, 0.96, 0.48, 0.29,
  0.68, 0.82, 0.41, 0.58, 0.9, 0.64, 0.32, 0.71, 0.5, 0.86, 0.38,
];

function syncCurtainUrl(opening) {
  if (typeof window === 'undefined') return;
  const desiredHash = opening ? '#intro' : '';
  if (window.location.hash === desiredHash) return;
  const nextUrl = `${window.location.pathname}${window.location.search}${desiredHash}`;
  window.history.replaceState(window.history.state, '', nextUrl);
}

function useMediaQuery(query) {
  const getMatches = () => typeof window !== 'undefined' && window.matchMedia(query).matches;
  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const updateMatches = (event) => setMatches(event.matches);
    mediaQuery.addEventListener('change', updateMatches);
    return () => mediaQuery.removeEventListener('change', updateMatches);
  }, [query]);

  return matches;
}

function formatTimecode(elapsedMs) {
  const totalFrames = Math.floor((elapsedMs / 1000) * 24);
  const frames = totalFrames % 24;
  const totalSeconds = Math.floor(totalFrames / 24);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  const pad = (value) => String(value).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
}

function RecordingTimecode({ active }) {
  const reduceMotion = useReducedMotion();
  const timeRef = useRef(null);

  useEffect(() => {
    const timeElement = timeRef.current;
    if (!timeElement) return undefined;
    timeElement.textContent = formatTimecode(0);
    if (!active || reduceMotion) return undefined;

    const startedAt = performance.now();
    const timer = window.setInterval(() => {
      timeElement.textContent = formatTimecode(performance.now() - startedAt);
    }, 100);
    return () => window.clearInterval(timer);
  }, [active, reduceMotion]);

  return <time ref={timeRef}>{formatTimecode(0)}</time>;
}

function RecordingOverlay({ active, take }) {
  return (
    <div className="home-recording-overlay" aria-hidden="true">
      <span className="home-viewfinder-corner home-viewfinder-corner--tl" />
      <span className="home-viewfinder-corner home-viewfinder-corner--tr" />
      <span className="home-viewfinder-corner home-viewfinder-corner--bl" />
      <span className="home-viewfinder-corner home-viewfinder-corner--br" />

      <div className="home-recording-status">
        <span className="home-recording-rec">
          <i />
          REC
        </span>
        <RecordingTimecode key={`${take}-${active ? 'active' : 'paused'}`} active={active} />
      </div>

      <div className="home-recording-waveform" key={`waveform-${take}`}>
        {WAVEFORM_LEVELS.map((level, barIndex) => {
          const shiftedLevel = WAVEFORM_LEVELS[(barIndex + take * 5) % WAVEFORM_LEVELS.length];
          return (
            <i
              key={`${barIndex}-${level}`}
              style={{
                '--wave-level': shiftedLevel,
                '--wave-delay': `${(barIndex % 7) * -0.11}s`,
                '--wave-duration': `${1.05 + (barIndex % 5) * 0.12}s`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function CrossfadeCarousel({ images, label, variant, interval = 6400, inactive = false }) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [exitingIndex, setExitingIndex] = useState(null);
  const [paused, setPaused] = useState(false);
  const indexRef = useRef(0);
  const exitTimer = useRef(0);
  const parallaxBounds = useRef(null);
  const parallaxFrame = useRef(0);

  const move = useCallback((direction) => {
    const current = indexRef.current;
    const next = (current + direction + images.length) % images.length;
    if (current === next) return;

    window.clearTimeout(exitTimer.current);
    setExitingIndex(current);
    indexRef.current = next;
    setIndex(next);
    exitTimer.current = window.setTimeout(() => setExitingIndex(null), 1180);
  }, [images.length]);

  useEffect(() => {
    if (reduceMotion || paused || inactive || images.length < 2) return undefined;
    const timer = window.setInterval(() => move(1), interval);
    return () => window.clearInterval(timer);
  }, [images.length, inactive, interval, move, paused, reduceMotion]);

  useEffect(() => () => {
    window.clearTimeout(exitTimer.current);
    window.cancelAnimationFrame(parallaxFrame.current);
  }, []);

  const moveCamera = (event) => {
    if (variant !== 'cover' || reduceMotion || event.pointerType === 'touch') return;
    const bounds = parallaxBounds.current ?? event.currentTarget.getBoundingClientRect();
    parallaxBounds.current = bounds;
    const horizontal = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
    const vertical = ((event.clientY - bounds.top) / bounds.height - 0.5) * 7;
    const carousel = event.currentTarget;
    window.cancelAnimationFrame(parallaxFrame.current);
    parallaxFrame.current = window.requestAnimationFrame(() => {
      carousel.style.setProperty('--camera-parallax-x', `${horizontal.toFixed(2)}px`);
      carousel.style.setProperty('--camera-parallax-y', `${vertical.toFixed(2)}px`);
    });
  };

  const resetCamera = (element) => {
    window.cancelAnimationFrame(parallaxFrame.current);
    parallaxBounds.current = null;
    element.style.setProperty('--camera-parallax-x', '0px');
    element.style.setProperty('--camera-parallax-y', '0px');
  };

  return (
    <div
      className={`home-carousel home-carousel--${variant}${inactive ? ' is-inactive' : ''}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => {
        if (variant !== 'cover') setPaused(true);
      }}
      onMouseLeave={(event) => {
        setPaused(false);
        resetCamera(event.currentTarget);
      }}
      onPointerMove={moveCamera}
      onPointerLeave={(event) => resetCamera(event.currentTarget)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className="home-carousel-frame" aria-live="off">
        {images.map((image, imageIndex) => {
          const active = imageIndex === index;
          const exiting = imageIndex === exitingIndex && !active;
          return (
            <img
              key={image.src}
              src={image.src}
              alt={active ? image.alt : ''}
              aria-hidden={!active}
              className={`home-carousel-image${active ? ' is-active' : ''}${exiting ? ' is-exiting' : ''}${variant === 'cover' ? ` home-camera-take home-camera-take--${(imageIndex % 3) + 1}` : ''}`}
              style={{ objectPosition: image.position }}
              loading={variant === 'cover' ? 'eager' : 'lazy'}
              fetchPriority={variant === 'cover' && imageIndex === 0 ? 'high' : 'auto'}
              decoding="async"
            />
          );
        })}
      </div>

      {variant === 'cover' && (
        <>
          <div
            className={`home-camera-atmosphere home-camera-atmosphere--take-${index + 1}`}
            key={`camera-atmosphere-${index}`}
            aria-hidden="true"
          >
            <span className="home-camera-exposure" />
            <span className="home-camera-light-leak" />
            <span className="home-camera-shutter" />
          </div>
          <RecordingOverlay active={!inactive} take={index} />
        </>
      )}

      <div className="home-carousel-controls">
        <button type="button" onClick={() => move(-1)} aria-label={t('home.photos.previous')}>
          <span aria-hidden="true">←</span>
        </button>
        <span className="home-carousel-count" aria-hidden="true">
          {variant === 'cover' && <b>TAKE</b>}
          {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </span>
        <button type="button" onClick={() => move(1)} aria-label={t('home.photos.next')}>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

function CassettePortal() {
  return (
    <svg viewBox="0 0 320 190" aria-hidden="true" focusable="false">
      <path className="portal-cassette-shell" d="M40 8h240l18 18v138l-18 18H40l-18-18V26z" />
      <rect className="portal-cassette-label" x="52" y="28" width="216" height="112" rx="12" />
      <path className="portal-cassette-line" d="M64 48h192M64 62h116" />
      <path className="portal-cassette-window" d="M78 74h164l-18 56H96z" />
      {[110, 210].map((cx) => (
        <g className="cassette-reel" key={cx}>
          <circle className="portal-reel-ring" cx={cx} cy="102" r="25" />
          <circle className="portal-reel-core" cx={cx} cy="102" r="9" />
          {[0, 60, 120].map((angle) => (
            <path
              key={angle}
              className="portal-reel-slot"
              d={`M${cx - 3} 78h6v14h-6zM${cx - 3} 112h6v14h-6z`}
              transform={`rotate(${angle} ${cx} 102)`}
            />
          ))}
        </g>
      ))}
      <path className="portal-cassette-base" d="M86 146h148l15 27H71z" />
    </svg>
  );
}

function VinylPortal() {
  return (
    <svg viewBox="0 0 240 240" aria-hidden="true" focusable="false">
      <g className="vinyl-disc">
        <circle className="portal-vinyl-disc" cx="120" cy="120" r="103" />
        {[91, 78, 65].map((radius) => (
          <circle className="portal-vinyl-groove" cx="120" cy="120" r={radius} key={radius} />
        ))}
        <circle className="portal-vinyl-label" cx="120" cy="120" r="38" />
        <path className="portal-vinyl-label-line" d="M97 108h46M97 118h31" />
        <circle className="portal-vinyl-hole" cx="120" cy="120" r="5" />
      </g>
    </svg>
  );
}

function CdPortal() {
  return (
    <svg viewBox="0 0 240 240" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="home-cd-face" cx="38%" cy="32%" r="78%">
          <stop offset="0" stopColor="var(--surface)" />
          <stop offset="0.48" stopColor="var(--accent-bright)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--accent-deep)" stopOpacity="0.86" />
        </radialGradient>
        <linearGradient id="home-cd-glint" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--surface)" stopOpacity="0" />
          <stop offset="0.5" stopColor="var(--surface)" stopOpacity="0.8" />
          <stop offset="1" stopColor="var(--surface)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="cd-disc">
        <circle cx="120" cy="120" r="103" fill="url(#home-cd-face)" className="portal-cd-disc" />
        <circle cx="120" cy="120" r="88" className="portal-cd-ring" />
        <path d="M54 45l137 137-22 22L38 66z" fill="url(#home-cd-glint)" className="portal-cd-glint" />
        <circle cx="120" cy="120" r="30" className="portal-cd-center" />
        <circle cx="120" cy="120" r="12" className="portal-cd-hole" />
      </g>
    </svg>
  );
}

const PORTALS = [
  { to: '/projects', labelKey: 'home.projects', hintKey: 'home.projectsHint', object: <CassettePortal /> },
  { to: '/music', labelKey: 'home.music', hintKey: 'home.musicHint', object: <VinylPortal /> },
  { to: '/timeline', labelKey: 'home.timeline', hintKey: 'home.timelineHint', object: <CdPortal /> },
];

function HomePortals() {
  const { t } = useTranslation();

  return (
    <Motion.nav
      className="home-portal-links"
      aria-label={t('home.explore')}
      variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
    >
      {PORTALS.map((portal) => {
        const label = t(portal.labelKey);
        const hint = t(portal.hintKey);
        return (
          <Link className="home-portal-link" to={portal.to} aria-label={`${label}: ${hint}`} key={portal.to}>
            <span className="home-portal-object">{portal.object}</span>
            <span className="home-portal-copy">
              <strong>{label}</strong>
              <small>{hint}</small>
            </span>
            <span className="home-portal-arrow" aria-hidden="true">↗</span>
          </Link>
        );
      })}
    </Motion.nav>
  );
}

function HomeExperience() {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const { hash } = useLocation();
  const reduceMotion = useReducedMotion();
  const introBackgroundProgress = useMotionValue(0);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const english = !i18n.language.toLowerCase().startsWith('zh');
  const [curtainOpen, setCurtainOpen] = useState(() => hash === '#intro');
  const [introRevealed, setIntroRevealed] = useState(() => hash === '#intro');
  const curtainLocked = useRef(false);
  const curtainTimer = useRef(0);

  const moveCurtain = useCallback((destination) => {
    if (curtainLocked.current) return;
    const opening = destination === 'intro';
    syncCurtainUrl(opening);
    if (opening === curtainOpen) {
      if (!opening) window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      return;
    }

    curtainLocked.current = true;
    window.clearTimeout(curtainTimer.current);

    if (opening) {
      setCurtainOpen(true);
      setIntroRevealed(true);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      setIntroRevealed(false);
      setCurtainOpen(false);
    }

    curtainTimer.current = window.setTimeout(() => {
      curtainLocked.current = false;
    }, reduceMotion ? 80 : 1040);
  }, [curtainOpen, reduceMotion]);

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    if (hash !== '#intro') window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, [hash]);

  useEffect(() => () => {
    window.clearTimeout(curtainTimer.current);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.homeCurtain = curtainOpen ? 'open' : 'closed';
    window.dispatchEvent(new CustomEvent('home-curtain-change', { detail: { open: curtainOpen } }));

    if (curtainOpen) return undefined;

    const root = document.documentElement;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const previousOverscroll = root.style.overscrollBehavior;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    root.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    root.style.overscrollBehavior = 'none';

    return () => {
      root.style.overflow = previousRootOverflow;
      document.body.style.overflow = previousBodyOverflow;
      root.style.overscrollBehavior = previousOverscroll;
    };
  }, [curtainOpen]);

  useEffect(() => {
    const onCurtainRequest = (event) => {
      moveCurtain(event.detail?.destination === 'cover' ? 'cover' : 'intro');
    };
    window.addEventListener('home-curtain-request', onCurtainRequest);
    return () => window.removeEventListener('home-curtain-request', onCurtainRequest);
  }, [moveCurtain]);

  useEffect(() => {
    let wheelDistance = 0;
    let touchStart = null;

    const onWheel = (event) => {
      if (curtainLocked.current && window.scrollY <= 2) {
        event.preventDefault();
        return;
      }

      const movingForward = !curtainOpen && event.deltaY > 0;
      const movingBack = curtainOpen && window.scrollY <= 2 && event.deltaY < 0;
      if (!movingForward && !movingBack) {
        wheelDistance = 0;
        return;
      }

      event.preventDefault();
      wheelDistance += Math.abs(event.deltaY);
      if (wheelDistance < 8) return;
      wheelDistance = 0;
      moveCurtain(movingForward ? 'intro' : 'cover');
    };

    const onTouchStart = (event) => {
      touchStart = {
        curtainOpen,
        atTop: window.scrollY <= 2,
        y: event.touches[0].clientY,
      };
    };

    const onTouchMove = (event) => {
      if (!touchStart || curtainLocked.current) return;
      const distance = touchStart.y - event.touches[0].clientY;
      const movingForward = !touchStart.curtainOpen && distance > 24;
      const movingBack = touchStart.curtainOpen && touchStart.atTop && distance < -24;
      if (!movingForward && !movingBack) return;
      event.preventDefault();
      moveCurtain(movingForward ? 'intro' : 'cover');
      touchStart = null;
    };

    const onTouchEnd = () => {
      touchStart = null;
    };

    const onKeyDown = (event) => {
      if (event.target instanceof HTMLElement && event.target.closest('a, button, input, textarea, select')) return;
      const forwardKeys = ['ArrowDown', 'PageDown', ' '];
      const backKeys = ['ArrowUp', 'PageUp'];
      if (!curtainOpen && forwardKeys.includes(event.key)) {
        event.preventDefault();
        moveCurtain('intro');
      } else if (curtainOpen && window.scrollY <= 2 && backKeys.includes(event.key)) {
        event.preventDefault();
        moveCurtain('cover');
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [curtainOpen, moveCurtain]);

  return (
    <>
      <Motion.section
        className={`home-cover${curtainOpen ? ' is-lifted' : ''}`}
        aria-label={t('home.coverPhotos')}
        aria-hidden={curtainOpen}
        inert={curtainOpen || undefined}
        initial={false}
        animate={{ y: curtainOpen ? '-100%' : '0%' }}
        transition={{ duration: reduceMotion ? 0 : 0.96, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="home-cover-stage">
          <div className="home-cover-media">
            <CrossfadeCarousel
              key={isMobile ? 'mobile-cover' : 'desktop-cover'}
              images={isMobile ? MOBILE_COVER_PHOTOS : COVER_PHOTOS}
              label={t('home.coverPhotos')}
              variant="cover"
              interval={6800}
              inactive={curtainOpen}
            />
            <div className="home-cover-scrim" aria-hidden="true" />
          </div>
          <Motion.div
            className="home-cover-copy"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            <button type="button" className="home-cover-scroll" onClick={() => moveCurtain('intro')}>
              <span>{t('home.scrollToEnter')}</span>
              <span className="home-scroll-arrows" aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </Motion.div>
        </div>
      </Motion.section>

      <section
        id="intro"
        className={`home-intro${introRevealed ? ' is-revealed' : ''}`}
        aria-labelledby="home-intro-title"
        aria-hidden={!introRevealed}
        inert={!introRevealed || undefined}
      >
        {isDark && (
          <div className="home-intro-painterly" aria-hidden="true">
            <HeroPainterlyBackground
              reduceMotion={reduceMotion}
              disableAmbient={isMobile}
              disableScroll
              scrollYProgress={introBackgroundProgress}
              inView={introRevealed}
            />
          </div>
        )}
        <Motion.div
          className="home-intro-inner"
          initial={false}
          animate={introRevealed ? 'show' : 'hidden'}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.15, delayChildren: reduceMotion ? 0 : 0.08 } },
          }}
        >
          <div className="home-intro-copy">
            <Motion.h2
              id="home-intro-title"
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              {english ? (
                <>{t('hero.titleFirst')} <em>{t('hero.titleMiddle')}</em> {t('hero.titleLast')}</>
              ) : t('hero.titleFirst')}
            </Motion.h2>
            <Motion.p
              className="home-intro-bio"
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              {t(isMobile ? 'home.bioMobile' : 'hero.bio')}
            </Motion.p>
            <HomePortals />
            <Motion.div
              className="home-intro-actions"
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            >
              <a className="home-cv-link" href="/cv.pdf" target="_blank" rel="noopener noreferrer">
                {t('hero.downloadCv')}
              </a>
              <a className="home-contact-link" href="mailto:jameswangjiayi@gmail.com">
                <span>{t('hero.contact')}</span>
                <small>jameswangjiayi@gmail.com</small>
              </a>
            </Motion.div>
          </div>

          {!isMobile && (
            <Motion.div
              className="home-portrait"
              variants={{
                hidden: { opacity: 0, y: 28, rotate: 1.5 },
                show: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <CrossfadeCarousel
                images={PORTRAIT_PHOTOS}
                label={t('home.portraitPhotos')}
                variant="portrait"
                interval={7200}
                inactive={!introRevealed}
              />
            </Motion.div>
          )}
        </Motion.div>
      </section>
    </>
  );
}

export default HomeExperience;
