import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Analog VU meter. Cream dial face with brass bezel and a swinging black
 * needle. The needle position is driven by the `getLevel()` callback (real
 * audio levels from useAudioPlayer's analyser) when `isPlaying` is true.
 *
 * The needle's `transform` is written directly to the SVG group via a ref
 * on every animation frame — keeping React out of the per-frame loop means
 * the meter doesn't compete with the other rAF loops on the page for
 * reconciliation time.
 *
 * Props:
 *   - isPlaying (bool)
 *   - getLevel ((): number 0..1) optional; if absent, falls back to a quiet
 *     simulated reading so the dial isn't dead between tracks.
 */
function AnalogVUMeter({ isPlaying, getLevel, label = 'VU' }) {
  const reduceMotion = useReducedMotion();
  const needleRef = useRef(null);

  // Smoothed level driving the needle. All per-frame state lives in refs so
  // the rAF loop never triggers a React render.
  const angleRef = useRef(-50);
  const targetRef = useRef(-50);

  useEffect(() => {
    const apply = (deg) => {
      if (needleRef.current) needleRef.current.style.transform = `rotate(${deg}deg)`;
    };

    if (reduceMotion) {
      apply(isPlaying ? -10 : -50);
      return undefined;
    }

    let raf = 0;
    const tick = () => {
      let level = 0;
      if (isPlaying) {
        if (typeof getLevel === 'function') {
          level = getLevel();
        } else {
          // Idle sim — quiet wobble around -30 to -15 dB region
          level = 0.18 + Math.random() * 0.18;
        }
      }
      // Map 0..1 level to -50°..+50° needle range (cube-root for VU feel)
      const shaped = Math.pow(level, 0.5);
      targetRef.current = -50 + shaped * 100;

      // Real VU meters are spec'd at a ~300ms integration time so the needle
      // shows average level, not transients. 0.06 per 60fps frame ≈ that.
      angleRef.current += (targetRef.current - angleRef.current) * 0.06;
      apply(angleRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying, getLevel, reduceMotion]);

  return (
    <div className="flex flex-col items-center" style={{ width: '100%', maxWidth: 220 }}>
      <svg
        viewBox="0 0 220 120"
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`${label} meter`}
      >
        <defs>
          <linearGradient id="vuBezel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a2e22" />
            <stop offset="100%" stopColor="#1a130c" />
          </linearGradient>
          <radialGradient id="vuFace" cx="50%" cy="60%" r="80%">
            <stop offset="0%" stopColor="#fdf7e3" />
            <stop offset="100%" stopColor="#e8d8b0" />
          </radialGradient>
          <linearGradient id="brassRim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4b76e" />
            <stop offset="100%" stopColor="#8c6e3b" />
          </linearGradient>
        </defs>

        {/* Bezel */}
        <rect x="2" y="2" width="216" height="116" rx="10" fill="url(#vuBezel)" />
        <rect x="2" y="2" width="216" height="116" rx="10" fill="none" stroke="url(#brassRim)" strokeWidth="1.2" />

        {/* Dial face — cream rectangle filling the entire bezel interior. */}
        <rect
          x="7"
          y="7"
          width="206"
          height="106"
          rx="7"
          fill="url(#vuFace)"
          stroke="#92400e"
          strokeOpacity="0.35"
          strokeWidth="1"
        />

        {/* Arc scale ticks and labels */}
        <g transform="translate(110 108)">
          {/* Green region (-20 to 0 dB) */}
          <path
            d="M -70 -59 A 92 92 0 0 1 16 -91"
            fill="none"
            stroke="#1a1410"
            strokeOpacity="0.65"
            strokeWidth="1.2"
          />
          {/* Red region (0 to +3 dB) */}
          <path
            d="M 16 -91 A 92 92 0 0 1 70 -59"
            fill="none"
            stroke="#c70000"
            strokeOpacity="0.85"
            strokeWidth="2"
          />

          {/* Tick marks */}
          {[-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const isMajor = deg % 20 === 0;
            const r1 = isMajor ? 74 : 82;
            const r2 = 92;
            const x1 = Math.sin(rad) * r1;
            const y1 = -Math.cos(rad) * r1;
            const x2 = Math.sin(rad) * r2;
            const y2 = -Math.cos(rad) * r2;
            const isRed = deg >= 20;
            return (
              <line
                key={deg}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isRed ? '#c70000' : '#1a1410'}
                strokeOpacity={isRed ? 0.85 : isMajor ? 0.85 : 0.45}
                strokeWidth={isMajor ? 1.4 : 0.9}
              />
            );
          })}

          {/* Numeric labels */}
          {[
            { deg: -50, label: '-20' },
            { deg: -30, label: '-10' },
            { deg: -10, label: '-3' },
            { deg: 10, label: '0' },
            { deg: 35, label: '+3' },
          ].map(({ deg, label: t }) => {
            const rad = (deg * Math.PI) / 180;
            const r = 62;
            const x = Math.sin(rad) * r;
            const y = -Math.cos(rad) * r;
            const isRed = deg >= 10;
            return (
              <text
                key={t}
                x={x}
                y={y + 3}
                textAnchor="middle"
                fontFamily="JetBrains Mono, monospace"
                fontSize="7"
                fill={isRed ? '#c70000' : '#1a1410'}
                fillOpacity={isRed ? 0.85 : 0.7}
              >
                {t}
              </text>
            );
          })}

          {/* "VU" badge */}
          <text
            x="0"
            y="-36"
            textAnchor="middle"
            fontFamily="Space Grotesk, system-ui, sans-serif"
            fontSize="9"
            fontWeight="700"
            fill="#1a1410"
            fillOpacity="0.6"
            letterSpacing="2"
          >
            {label}
          </text>

          {/* Needle — transform is mutated directly in the rAF loop */}
          <g
            ref={needleRef}
            style={{
              transform: 'rotate(-50deg)',
              transformOrigin: '0 0',
            }}
          >
            <line x1="0" y1="0" x2="0" y2="-88" stroke="#1a1410" strokeWidth="1.6" strokeLinecap="round" />
            <polygon points="0,-88 -2,-82 2,-82" fill="#1a1410" />
          </g>

          {/* Needle pivot (brass) */}
          <circle cx="0" cy="0" r="5.5" fill="url(#brassRim)" />
          <circle cx="0" cy="0" r="5.5" fill="none" stroke="#1a1410" strokeOpacity="0.5" strokeWidth="0.6" />
          <circle cx="0" cy="0" r="2" fill="#1a1410" />
        </g>
      </svg>
    </div>
  );
}

export default AnalogVUMeter;
