import { motion, useReducedMotion } from 'framer-motion';

function Reel({ cx, cy, r, reduceMotion, duration = 2.5 }) {
  return (
    <motion.g
      animate={reduceMotion ? undefined : { rotate: 360 }}
      transition={reduceMotion ? undefined : { duration, repeat: Infinity, ease: 'linear' }}
      style={{ transformBox: 'fill-box', transformOrigin: `${cx}px ${cy}px` }}
    >
      {/* Hub / outer ring */}
      <circle cx={cx} cy={cy} r={r} fill="#7c2d12" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#451a03" strokeWidth="3" />

      {/* Spokes (8) */}
      <g stroke="#92400e" strokeWidth={r * 0.18} strokeLinecap="butt">
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const x = cx + Math.cos(angle) * r * 0.85;
          const y = cy + Math.sin(angle) * r * 0.85;
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} />;
        })}
      </g>

      {/* Inner well */}
      <circle cx={cx} cy={cy} r={r * 0.38} fill="#451a03" />
      <circle cx={cx} cy={cy} r={r * 0.38} fill="none" stroke="#7c2d12" strokeWidth="0.6" />
    </motion.g>
  );
}

/**
 * Cassette tape — same vocabulary as the LoadingScreen cassette
 * (cream/amber shell, dark border, two reels at the bottom, tape window).
 */
function CassetteGraphic({ className, style }) {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 800 500"
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-hidden
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id="cassetteShell" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#fcd34d" />
        </linearGradient>
      </defs>

      {/* Shell */}
      <rect
        x="20"
        y="20"
        width="760"
        height="460"
        rx="32"
        fill="url(#cassetteShell)"
      />
      <rect
        x="20"
        y="20"
        width="760"
        height="460"
        rx="32"
        fill="none"
        stroke="#78350f"
        strokeWidth="16"
      />

      {/* Label panel (top half) */}
      <rect
        x="80"
        y="60"
        width="640"
        height="160"
        rx="14"
        fill="#fffbeb"
        fillOpacity="0.85"
      />
      <rect
        x="80"
        y="60"
        width="640"
        height="160"
        rx="14"
        fill="none"
        stroke="#92400e"
        strokeOpacity="0.25"
        strokeWidth="1.5"
      />
      {/* Decorative hash marks (suggest a written label without text) */}
      <g stroke="#92400e" strokeOpacity="0.32" strokeWidth="3" strokeLinecap="round">
        <line x1="120" y1="110" x2="380" y2="110" />
        <line x1="120" y1="140" x2="320" y2="140" />
        <line x1="120" y1="170" x2="400" y2="170" />
      </g>
      {/* "Side A" stamp on the right side of label */}
      <text
        x="660"
        y="178"
        textAnchor="end"
        fontFamily="JetBrains Mono, monospace"
        fontSize="20"
        fill="#92400e"
        fillOpacity="0.55"
        letterSpacing="3"
        fontWeight="500"
      >
        A
      </text>

      {/* Reels area */}
      <Reel cx={250} cy={360} r={75} reduceMotion={reduceMotion} duration={2.5} />
      <Reel cx={550} cy={360} r={75} reduceMotion={reduceMotion} duration={2.5} />

      {/* Tape window (between reels, bottom area) */}
      <rect
        x="340"
        y="430"
        width="120"
        height="6"
        rx="3"
        fill="#92400e"
        fillOpacity="0.45"
      />
      <rect
        x="340"
        y="430"
        width="120"
        height="6"
        rx="3"
        fill="none"
        stroke="#451a03"
        strokeOpacity="0.4"
        strokeWidth="0.6"
      />

      {/* Two small head holes between the reels (where the playback heads engage) */}
      <circle cx="400" cy="360" r="6" fill="#451a03" />
      <circle cx="400" cy="360" r="6" fill="none" stroke="#7c2d12" strokeOpacity="0.6" strokeWidth="0.6" />
    </svg>
  );
}

// Backwards-compat alias for any imports still using the old name
const TapeMachineGraphic = CassetteGraphic;

export { CassetteGraphic, TapeMachineGraphic };
export default CassetteGraphic;
