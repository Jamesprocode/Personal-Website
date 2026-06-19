import { useEffect, useRef, useState } from 'react';
import { motion as Motion, useMotionValue, useMotionValueEvent, useAnimationFrame, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import useIsMobile from '../../hooks/useIsMobile';
import AnalogVUMeter from './AnalogVUMeter';
import Knob from './Knob';
import { LoopButton, NextButton } from './TransportButtons';

const fmtTime = (s) => {
  if (!Number.isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

// Time readout isolated into its own leaf so the live playback position only
// re-renders this tiny "m:ss / m:ss" node — and only when the whole-second
// changes — instead of the entire Turntable tree on every 'timeupdate'.
function TimeReadout({ currentTimeMV, duration }) {
  const [sec, setSec] = useState(0);
  useMotionValueEvent(currentTimeMV, 'change', (v) => {
    const s = Math.floor(v);
    setSec((prev) => (prev === s ? prev : s));
  });
  return (
    <>
      {fmtTime(sec)}
      <span style={{ color: 'rgba(196,162,101,0.3)', margin: '0 0.4em' }}>/</span>
      {fmtTime(duration)}
    </>
  );
}

function MobileSeekSlider({ currentTimeMV, duration, onSeek, accent }) {
  const [sec, setSec] = useState(0);
  const max = Math.max(0, Math.floor(duration || 0));

  useMotionValueEvent(currentTimeMV, 'change', (v) => {
    const s = Math.floor(v);
    setSec((prev) => (prev === s ? prev : s));
  });

  return (
    <input
      className="music-mobile-seek"
      type="range"
      min={0}
      max={max}
      value={Math.min(sec, max)}
      disabled={!max}
      aria-label="Seek"
      onChange={(event) => onSeek?.(Number(event.currentTarget.value))}
      style={{
        width: '100%',
        accentColor: accent,
        display: 'none',
      }}
    />
  );
}

// Tonearm sweeps along an arc that maps 1:1 to playback progress, matching
// a real turntable: the stylus drops on the outer groove at the start and
// spirals inward toward the label as the record plays. When nothing is
// playing the needle rests at the outer groove, queued up to start.
// Empirically calibrated against the rendered geometry (pivot at ~upper-right
// of the platter zone, tube length ~190px from pivot to stylus tip).
const ARM_OUTER = 78;   // progress=0 → stylus on outer groove (also the idle position)
const ARM_INNER = 128;  // progress=1 → stylus near label (record ends here)
const ARM_SWEEP = ARM_INNER - ARM_OUTER;

function Turntable({
  album,
  track,
  isPlaying,
  isBuffering = false,
  onPlayPause,
  volume,
  onVolumeChange,
  getLevel,
  currentTimeMV,
  duration = 0,
  onSeek,
  loopMode = 'album',
  onCycleLoop,
  onNext,
}) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const { isDark } = useTheme();
  const isMobile = useIsMobile();
  const simplifyMotion = reduceMotion || isMobile;
  const accent = album?.accentColor || '#c4a265';
  const hasTrack = Boolean(track && track.file);

  // The deck (plinth) flips with the theme: a light cream-wood chassis in
  // light mode, espresso in dark. The black vinyl platter, metal tonearm and
  // album label disc stay physical — a real turntable is a light-wood plinth
  // carrying a black platter, which reads correctly on either background.
  const deckBg = isDark
    ? 'linear-gradient(135deg, #2a1f15 0%, #1a130c 100%)'
    : 'linear-gradient(135deg, #efe3c9 0%, #ddc9a0 100%)';
  const deckBorder = isDark ? 'rgba(196, 162, 101, 0.18)' : 'rgba(160, 111, 29, 0.3)';
  const deckShadow = isDark
    ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    : '0 25px 50px -12px rgba(80, 55, 15, 0.28)';
  // Time readout: glowing brass on espresso, deeper walnut on cream.
  const timeColor = hasTrack
    ? (isDark ? '#c4a265' : '#6b4a1e')
    : (isDark ? 'rgba(196,162,101,0.35)' : 'rgba(107,74,30,0.4)');

  const platterRef = useRef(null);
  const pivotRef = useRef(null);
  const scrubRef = useRef(null);       // tonearm slider, for live aria-valuenow
  const lastAriaSecRef = useRef(-1);
  const rotation = useMotionValue(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [isScrubbingArm, setIsScrubbingArm] = useState(false);
  const dragStateRef = useRef(null); // platter drag
  const accumulatedDeltaRef = useRef(0);
  const armScrubRef = useRef(null); // { pivotX, pivotY } during needle scrub
  // Seek throttle: setting audio.currentTime back-to-back puts the element
  // into a perpetual "seeking" state and silences playback. The platter feels
  // best with rapid updates (audio "follows" the disc), the needle prefers
  // a calmer cadence so each preview snippet is long enough to register.
  const lastSeekAtRef = useRef(0);
  const pendingSeekRef = useRef(null);
  const PLATTER_SEEK_INTERVAL_MS = 10;  // ~100Hz: rotation drives audio nearly continuously
  const NEEDLE_SEEK_INTERVAL_MS = 50;   // 20Hz: preview snippets while sweeping the arm

  const throttledSeek = (time, intervalMs) => {
    if (!onSeek) return;
    pendingSeekRef.current = time;
    const now = performance.now();
    if (now - lastSeekAtRef.current >= intervalMs) {
      lastSeekAtRef.current = now;
      onSeek(time);
      pendingSeekRef.current = null;
    }
  };

  const flushSeek = () => {
    if (pendingSeekRef.current !== null && onSeek) {
      onSeek(pendingSeekRef.current);
      pendingSeekRef.current = null;
      lastSeekAtRef.current = performance.now();
    }
  };

  // Tonearm rotation: a separate motion value that follows playback progress
  // (or pointer position while the needle is being dragged).
  const armRotation = useMotionValue(ARM_OUTER);
  const armTargetRef = useRef(ARM_OUTER);

  useMotionValueEvent(currentTimeMV, 'change', (ct) => {
    if (!simplifyMotion) return;
    const engaged = hasTrack && (isPlaying || ct > 0);
    const target = engaged && duration > 0
      ? ARM_OUTER + ARM_SWEEP * Math.min(1, Math.max(0, ct / duration))
      : ARM_OUTER;
    armTargetRef.current = target;
    if (Math.abs(armRotation.get() - target) > 0.2) {
      armRotation.set(target);
    }

    const slider = scrubRef.current;
    if (slider) {
      const s = Math.floor(ct);
      if (s !== lastAriaSecRef.current) {
        lastAriaSecRef.current = s;
        slider.setAttribute('aria-valuenow', String(s));
      }
    }
  });

  // Drive the platter spin and the arm sweep from one animation frame. The
  // arm target is derived from the live playback position by READING the
  // MotionValue here (currentTimeMV.get()) rather than from a React state
  // prop — that's what keeps the 4x/sec 'timeupdate' from re-rendering this
  // whole component and starving this very loop on slow devices.
  useAnimationFrame((_, deltaMs) => {
    if (simplifyMotion) return;

    // Platter spin
    if (!isScrubbing && isPlaying) {
      rotation.set(rotation.get() + deltaMs * 0.12);
    }

    // Arm: snap immediately if scrubbing the needle, otherwise ease toward target.
    if (isScrubbingArm) {
      armRotation.set(armTargetRef.current);
      return;
    }

    const ct = currentTimeMV.get();
    const engaged = hasTrack && (isPlaying || ct > 0);
    armTargetRef.current = engaged && duration > 0
      ? ARM_OUTER + ARM_SWEEP * Math.min(1, Math.max(0, ct / duration))
      : ARM_OUTER;

    const cur = armRotation.get();
    const target = armTargetRef.current;
    const idleSettled =
      !isPlaying &&
      !isBuffering &&
      !isScrubbing &&
      Math.abs(cur - target) < 0.02;

    if (idleSettled) {
      if (cur !== target) armRotation.set(target);
      return;
    }

    // Keep the slider's aria-valuenow live without a render (whole-second granularity).
    const slider = scrubRef.current;
    if (slider) {
      const s = Math.floor(ct);
      if (s !== lastAriaSecRef.current) {
        lastAriaSecRef.current = s;
        slider.setAttribute('aria-valuenow', String(s));
      }
    }

    const diff = target - cur;
    if (Math.abs(diff) < 0.02) {
      if (cur !== target) armRotation.set(target);
      return;
    }
    // Big swings (rest ↔ playback) ease slowly; in-flight tracking is snappier.
    const tau = Math.abs(diff) > 6 ? 360 : 140;
    const step = diff * Math.min(1, deltaMs / tau);
    armRotation.set(cur + step);
  });

  // Helper: pointer angle relative to platter center, in degrees
  const angleFromCenter = (clientX, clientY) => {
    if (!platterRef.current) return 0;
    const rect = platterRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI;
  };

  const onPlatterPointerDown = (e) => {
    if (isMobile) return;
    if (!hasTrack || !duration) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const startAngle = angleFromCenter(e.clientX, e.clientY);
    dragStateRef.current = {
      startAngle,
      lastAngle: startAngle,
      startRotation: rotation.get(),
      startTime: currentTimeMV.get(),
    };
    accumulatedDeltaRef.current = 0;
    setIsScrubbing(true);
  };

  const onPlatterPointerMove = (e) => {
    const drag = dragStateRef.current;
    if (!drag) return;

    const currentAngle = angleFromCenter(e.clientX, e.clientY);
    // Compute delta since last frame, unwrapping the -180..180 boundary
    let frameDelta = currentAngle - drag.lastAngle;
    if (frameDelta > 180) frameDelta -= 360;
    if (frameDelta < -180) frameDelta += 360;
    drag.lastAngle = currentAngle;
    accumulatedDeltaRef.current += frameDelta;

    const totalDelta = accumulatedDeltaRef.current;
    rotation.set(drag.startRotation + totalDelta);

    // Map angle delta to seek delta. 360° = 1/12 of total duration (so ~12 rotations cover the track),
    // with a minimum of 5 seconds per rotation so very short tracks still scrub usefully.
    const secondsPerDegree = Math.max(duration / 12, 5) / 360;
    const newTime = Math.max(0, Math.min(duration, drag.startTime + totalDelta * secondsPerDegree));
    throttledSeek(newTime, PLATTER_SEEK_INTERVAL_MS);
  };

  const onPlatterPointerUp = (e) => {
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    dragStateRef.current = null;
    setIsScrubbing(false);
    flushSeek();
  };

  // Needle scrub: drag the tonearm headshell to seek.
  const onArmPointerDown = (e) => {
    if (isMobile) return;
    if (!hasTrack || !duration) return;
    const pivot = pivotRef.current;
    if (!pivot) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const r = pivot.getBoundingClientRect();
    armScrubRef.current = { px: r.left + r.width / 2, py: r.top + r.height / 2 };
    setIsScrubbingArm(true);
  };

  const onArmPointerMove = (e) => {
    const s = armScrubRef.current;
    if (!s) return;
    const dx = e.clientX - s.px;
    const dy = e.clientY - s.py;
    const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
    const clamped = Math.min(ARM_INNER, Math.max(ARM_OUTER, ang));
    armTargetRef.current = clamped;
    armRotation.set(clamped);
    if (duration) {
      const progress = (clamped - ARM_OUTER) / ARM_SWEEP;
      throttledSeek(progress * duration, NEEDLE_SEEK_INTERVAL_MS);
    }
  };

  const onArmPointerUp = (e) => {
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    armScrubRef.current = null;
    setIsScrubbingArm(false);
    flushSeek();
  };

  // Reset rotation when track changes
  useEffect(() => {
    rotation.set(0);
    accumulatedDeltaRef.current = 0;
  }, [track?.id, rotation]);

  return (
    <div
      className="music-deck relative"
      style={{
        background: deckBg,
        borderRadius: 24,
        padding: 'clamp(1.5rem, 3vw, 2.5rem)',
        border: `1px solid ${deckBorder}`,
        boxShadow: deckShadow,
      }}
    >
      {/* Mobile: center the controls strip in a single stacked column so the
          transport buttons, VU meter and instructions sit dead-center rather
          than splitting to opposite edges. Desktop keeps the two-column
          justify-between layout untouched. */}
      <style>{`
        @media (max-width: 760px) {
          .music-deck {
            border-radius: 18px !important;
            padding: 1rem !important;
          }
          .music-platter-zone {
            max-width: min(86vw, 420px) !important;
          }
          .music-controls {
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .music-controls__left {
            align-items: center;
            width: 100%;
          }
          .music-controls__time {
            text-align: center;
            width: 100%;
          }
          .music-mobile-seek {
            display: block !important;
            margin-top: 0.65rem;
          }
          .music-controls__buttons {
            justify-content: center;
            width: 100%;
            margin-bottom: 0 !important;
            flex-wrap: wrap;
            gap: 0.75rem !important;
          }
          .music-controls__right {
            align-items: center !important;
            width: 100%;
          }
          .music-controls__hint {
            text-align: center !important;
            white-space: normal !important;
          }
          .music-control-unit {
            height: 76px !important;
            min-width: 56px !important;
          }
          .music-control-label {
            font-size: 0.58rem !important;
            letter-spacing: 0.1em !important;
          }
        }
      `}</style>

      {/* Top trim hairline */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 24,
          right: 24,
          top: 0,
          height: 1,
          background: 'linear-gradient(to right, transparent, rgba(196,162,101,0.4), transparent)',
        }}
      />

      {/* Platter zone */}
      <div className="music-platter-zone relative" style={{ aspectRatio: '1 / 1', maxWidth: 560, margin: '0 auto' }}>
        {/* Platter */}
        <Motion.div
          ref={platterRef}
          onPointerDown={onPlatterPointerDown}
          onPointerMove={onPlatterPointerMove}
          onPointerUp={onPlatterPointerUp}
          onPointerCancel={onPlatterPointerUp}
          style={{
            rotate: rotation,
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at 50% 50%, #2a2a2a 0%, #0a0a0a 70%, #050505 100%)',
            boxShadow: 'inset 0 2px 24px rgba(0,0,0,0.6), 0 4px 18px rgba(0,0,0,0.5)',
            border: '2px solid rgba(64, 64, 64, 0.45)',
            cursor: !isMobile && hasTrack && duration ? (isScrubbing ? 'grabbing' : 'grab') : 'default',
            touchAction: isMobile ? 'pan-y' : 'none',
          }}
        >
          {/* Concentric vinyl grooves */}
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              aria-hidden
              className="absolute rounded-full"
              style={{
                width: `${95 - i * 5}%`,
                height: `${95 - i * 5}%`,
                border: `0.5px solid rgba(120, 120, 120, ${i % 2 === 0 ? 0.12 : 0.06})`,
              }}
            />
          ))}

          {/* Label disc (album cover or fallback) */}
          <div
            className="relative rounded-full flex items-center justify-center overflow-hidden"
            style={{
              width: '38%',
              height: '38%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
              backgroundColor: accent,
              border: '1px solid rgba(20,15,10,0.4)',
              pointerEvents: 'none',
            }}
          >
            {album?.coverImage ? (
              <img
                src={album.coverImage}
                alt={album.title}
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              // Title sits in the upper third; album + composer in the lower
              // third; the empty middle band leaves room for the spindle.
              <div
                className="absolute inset-0 flex flex-col items-center text-center"
                style={{
                  paddingTop: '18%',
                  paddingBottom: '18%',
                  paddingLeft: '14%',
                  paddingRight: '14%',
                  justifyContent: 'space-between',
                }}
              >
                {track ? (
                  <>
                    <p
                      style={{
                        fontFamily: 'Space Grotesk, system-ui, sans-serif',
                        fontWeight: 700,
                        fontSize: 'clamp(0.9rem, 1.55vw, 1.2rem)',
                        color: '#1a1410',
                        lineHeight: 1.1,
                        margin: 0,
                      }}
                    >
                      {track.title}
                    </p>
                    <p
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 'clamp(0.55rem, 0.8vw, 0.68rem)',
                        color: 'rgba(26,20,16,0.75)',
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        margin: 0,
                      }}
                    >
                      {album?.title || ''}
                    </p>
                  </>
                ) : (
                  // No track: anchor the hint slightly above the spindle.
                  <>
                    <p
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 'clamp(0.6rem, 0.8vw, 0.7rem)',
                        color: 'rgba(26,20,16,0.6)',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        margin: 0,
                        marginTop: '25%',
                      }}
                    >
                      {t('music.noTrack', { defaultValue: 'No track loaded' })}
                    </p>
                    <span />
                  </>
                )}
              </div>
            )}
          </div>

          {/* Center spindle */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              width: 16,
              height: 16,
              borderRadius: 9999,
              background: 'radial-gradient(circle, #2a2a2a, #0a0a0a)',
              border: '1px solid rgba(196,162,101,0.3)',
              boxShadow: 'inset 0 1px 2px rgba(196,162,101,0.2)',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          />
        </Motion.div>

        {/* Tonearm assembly */}
        <div
          className="absolute"
          style={{
            top: '6%',
            right: '4%',
            width: '38%',
            height: '46%',
            pointerEvents: 'none',
          }}
        >
          {/* Base / pivot housing */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 56,
              height: 56,
              borderRadius: 9999,
              background: 'radial-gradient(circle at 35% 30%, #4a3f35 0%, #1a130c 75%, #0a0806 100%)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.45), inset 0 1px 2px rgba(196,162,101,0.25)',
            }}
          />
          {/* Brass collar on pivot */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              width: 28,
              height: 28,
              borderRadius: 9999,
              background: 'radial-gradient(circle at 35% 30%, #d4b76e, #8c6e3b)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.4), inset 0 -1px 2px rgba(0,0,0,0.35)',
            }}
          />
          {/* Brass center cap (= pivot point that anchors the arm's rotation) */}
          <div
            ref={pivotRef}
            aria-hidden
            style={{
              position: 'absolute',
              top: 22,
              right: 22,
              width: 12,
              height: 12,
              borderRadius: 9999,
              background: '#1a1410',
              border: '1px solid #c4a265',
            }}
          />

          {/* Tonearm motion wrapper. Rotation is driven by playback progress
              (or the user's pointer while scrubbing the needle). */}
          <Motion.div
            style={{
              rotate: armRotation,
              position: 'absolute',
              top: 28,
              right: 28,
              transformOrigin: '0 0',
              width: 0,
              height: 0,
            }}
          >
            {/* Counterweight + tube */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: -7,
                left: -28,
                width: 28,
                height: 14,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #4a3f35, #1a130c)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
                border: '1px solid rgba(196,162,101,0.2)',
              }}
            />
            {/* Anti-skate knob */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: -4,
                left: -38,
                width: 8,
                height: 8,
                borderRadius: 9999,
                background: 'radial-gradient(circle at 30% 30%, #d4b76e, #8c6e3b)',
              }}
            />

            {/* Main tonearm tube */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: -3,
                left: 0,
                width: 168,
                height: 6,
                borderRadius: 4,
                background: 'linear-gradient(to bottom, #b8b8b8 0%, #6a6a6a 50%, #3a3a3a 100%)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.18)',
              }}
            />

            {/* Headshell */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: -10,
                left: 162,
                width: 26,
                height: 20,
                background: 'linear-gradient(135deg, #2a1f15, #1a130c)',
                borderRadius: '4px 8px 8px 4px',
                border: '1px solid rgba(196,162,101,0.35)',
                boxShadow: '0 3px 6px rgba(0,0,0,0.5)',
              }}
            />
            {/* Cartridge stylus */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: -1,
                left: 186,
                width: 4,
                height: 8,
                background: '#c70000',
                borderRadius: 1,
                boxShadow: '0 0 4px rgba(199,0,0,0.45)',
              }}
            />

            {/* Drag handle: invisible hit area over the headshell. Re-enables
                pointer events that the assembly disabled, so users can grab
                the needle to seek. */}
            <div
              ref={scrubRef}
              role="slider"
              aria-label={t('music.tonearm')}
              aria-valuemin={0}
              aria-valuemax={duration || 0}
              aria-valuenow={0}
              onPointerDown={onArmPointerDown}
              onPointerMove={onArmPointerMove}
              onPointerUp={onArmPointerUp}
              onPointerCancel={onArmPointerUp}
              style={{
                position: 'absolute',
                top: -18,
                left: 150,
                width: 56,
                height: 38,
                cursor: !isMobile && hasTrack && duration ? (isScrubbingArm ? 'grabbing' : 'grab') : 'default',
                touchAction: isMobile ? 'pan-y' : 'none',
                pointerEvents: !isMobile && hasTrack && duration ? 'auto' : 'none',
              }}
            />
          </Motion.div>
        </div>

        {/* Scrub hint (mono, visible only when scrubbing) */}
        {isScrubbing && (
          <div
            aria-hidden
            className="absolute font-mono uppercase pointer-events-none"
            style={{
              left: '50%',
              bottom: -8,
              transform: 'translateX(-50%)',
              color: isDark ? '#c4a265' : '#5a3410',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              background: isDark ? 'rgba(26,20,16,0.85)' : 'rgba(253,244,220,0.9)',
              padding: '4px 10px',
              borderRadius: 9999,
              border: isDark
                ? '1px solid rgba(196,162,101,0.4)'
                : '1px solid rgba(160,111,29,0.4)',
            }}
          >
            Scrub
          </div>
        )}
      </div>

      {/* Controls strip — two columns, mirrored stacks.
            Left:  Time (top)         → Play + Volume (bottom)
            Right: Instructions (top) → VU meter (bottom)
          `items-stretch` lets both columns share the taller column's height
          so the time readout sits flush under the divider line — aligned
          with the first line of the instructions text on the right. */}
      <div
        className="music-controls flex items-stretch justify-between flex-wrap"
        style={{
          marginTop: 'clamp(1.5rem, 3vh, 2.5rem)',
          paddingTop: 'clamp(0.75rem, 1.5vh, 1rem)',
          borderTop: '1px solid var(--border)',
          gap: 'clamp(1rem, 3vw, 2rem)',
        }}
      >
        {/* Left column */}
        <div className="music-controls__left flex flex-col" style={{ justifyContent: 'space-between', gap: 'clamp(0.6rem, 1.2vh, 0.9rem)' }}>
          <div
            className="music-controls__time font-mono"
            style={{
              color: timeColor,
              fontSize: 'clamp(0.82rem, 1vw, 0.95rem)',
              letterSpacing: '0.08em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            <TimeReadout currentTimeMV={currentTimeMV} duration={duration} />
            <MobileSeekSlider
              currentTimeMV={currentTimeMV}
              duration={duration}
              onSeek={onSeek}
              accent={accent}
            />
          </div>
          <div
            className="music-controls__buttons flex items-end"
            style={{
              gap: 'clamp(0.25rem, 0.6vw, 0.5rem)',
              marginBottom: 'clamp(1rem, 2.5vh, 1.75rem)',
            }}
          >
            {/* Loop / shuffle */}
            <div
              className="music-control-unit flex flex-col items-center"
              style={{ height: 88, minWidth: 64, justifyContent: 'space-between', alignItems: 'center' }}
            >
              <p
                className="music-control-label font-mono uppercase"
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.22em',
                  margin: 0,
                }}
              >
                {t(loopMode === 'shuffle' ? 'music.transport.shuffle' : loopMode === 'one' ? 'music.transport.loopOne' : 'music.transport.loop')}
              </p>
              <div style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LoopButton mode={loopMode} onClick={onCycleLoop} size={24} />
              </div>
            </div>

            {/* Play/Pause */}
            <div
              className="music-control-unit flex flex-col items-center"
              style={{ height: 88, minWidth: 64, justifyContent: 'space-between', alignItems: 'center' }}
            >
              <p
                className="music-control-label font-mono uppercase"
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.22em',
                  margin: 0,
                }}
              >
                {t(isBuffering ? 'music.transport.buffering' : isPlaying ? 'music.transport.pause' : 'music.transport.play')}
              </p>
              <Motion.button
                whileHover={!simplifyMotion && hasTrack ? { scale: 1.06 } : undefined}
                whileTap={hasTrack ? { scale: 0.96 } : undefined}
                onClick={onPlayPause}
                disabled={!hasTrack}
                aria-label={t(isBuffering ? 'music.transport.buffering' : isPlaying ? 'music.transport.pause' : 'music.transport.play')}
                aria-busy={isBuffering || undefined}
                className="rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a265]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]"
                style={{
                  position: 'relative',
                  width: 56,
                  height: 56,
                  backgroundColor: hasTrack
                    ? '#c4a265'
                    : (isDark ? 'rgba(196,162,101,0.25)' : 'rgba(140,110,59,0.22)'),
                  color: hasTrack ? '#1a1410' : 'var(--text-muted)',
                  cursor: hasTrack ? 'pointer' : 'not-allowed',
                  border: hasTrack || isDark ? 'none' : '1px solid rgba(160,111,29,0.3)',
                  boxShadow: hasTrack
                    ? '0 6px 14px -4px rgba(196,162,101,0.45), inset 0 1px 2px rgba(255,235,170,0.45)'
                    : 'none',
                }}
              >
                {/* Buffering ring: a thin arc that spins around the button
                    while the track downloads, so a slow start reads as
                    "loading" rather than a dead click. */}
                {isBuffering && !simplifyMotion && (
                  <Motion.span
                    aria-hidden
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, ease: 'linear', repeat: Infinity }}
                    style={{
                      position: 'absolute',
                      inset: -4,
                      borderRadius: '50%',
                      border: '2px solid transparent',
                      borderTopColor: '#1a1410',
                      borderRightColor: 'rgba(26,20,16,0.35)',
                    }}
                  />
                )}
                {isPlaying ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <rect x="6" y="5" width="4" height="14" rx="1" />
                    <rect x="14" y="5" width="4" height="14" rx="1" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </Motion.button>
            </div>

            {/* Next track */}
            <div
              className="music-control-unit flex flex-col items-center"
              style={{ height: 88, minWidth: 64, justifyContent: 'space-between', alignItems: 'center' }}
            >
              <p
                className="music-control-label font-mono uppercase"
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.22em',
                  margin: 0,
                }}
              >
                {t('music.transport.next')}
              </p>
              <div style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <NextButton onClick={onNext} size={24} disabled={!hasTrack} />
              </div>
            </div>

            {/* Volume */}
            <div
              className="music-control-unit flex flex-col items-center"
              style={{ height: 88, minWidth: 64, justifyContent: 'space-between', alignItems: 'center' }}
            >
              <p
                className="music-control-label font-mono uppercase"
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.22em',
                  margin: 0,
                }}
              >
                {t('music.transport.volume')}
              </p>
              <Knob value={volume} onChange={onVolumeChange} size={56} />
            </div>
          </div>
        </div>

        {/* Right column: instructions on top, VU meter directly below.
            Column sizes to fit the longest instruction line so each line
            stays on one row; both items right-align to the same edge. */}
        <div
          className="music-controls__right flex flex-col items-end"
          style={{ gap: 'clamp(0.6rem, 1.2vh, 0.9rem)', flex: '0 0 auto', justifyContent: 'space-between' }}
        >
          <p
            className="music-controls__hint font-mono uppercase"
            style={{
              color: 'var(--text-muted)',
              fontSize: 'clamp(0.6rem, 0.72vw, 0.68rem)',
              letterSpacing: '0.14em',
              lineHeight: 1.7,
              margin: 0,
              textAlign: 'right',
              whiteSpace: 'nowrap',
            }}
          >
            {t('music.hint.drag')}
            <br />
            {t('music.hint.spin')}
            <br />
            <kbd
              style={{
                display: 'inline-block',
                padding: '1px 6px',
                margin: '0 2px',
                backgroundColor: isDark ? 'rgba(0,0,0,0.35)' : 'rgba(160,111,29,0.12)',
                borderRadius: 3,
                border: isDark
                  ? '1px solid rgba(196,162,101,0.3)'
                  : '1px solid rgba(160,111,29,0.35)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.85em',
                color: isDark ? 'rgba(196,162,101,0.85)' : '#5a3410',
                letterSpacing: '0.05em',
              }}
            >
              Space
            </kbd>
            {t('music.hint.spaceSuffix')}
          </p>
          <AnalogVUMeter isPlaying={isPlaying} getLevel={getLevel} useVisualFallback={isMobile} />
        </div>
      </div>
    </div>
  );
}

export default Turntable;
