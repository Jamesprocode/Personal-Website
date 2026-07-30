import { motion as Motion, useTransform } from 'framer-motion';

// Painterly brass streak flowing from the upper-right corner. Two motion
// layers run together:
//
//   1. CONTINUOUS BREATH — cream blooms and the amber hot spot gently
//      pulse on long loops (6-9 s), so the page feels alive at rest.
//   2. SCROLL-DRIVEN FLOW — as the user scrolls, the brass pour expands
//      and rotates slightly, tendrils extend further left toward the
//      text column, and crackle veins darken in (ink drying as time
//      passes). Each layer parallaxes at its own rate.
//
// `inView` (driven by an IntersectionObserver on the hero <section>) pauses
// the continuous framer-motion `animate` keyframes when the hero scrolls
// off screen. Framer-motion drives those via JS rAF, which keeps firing
// regardless of visibility — without this gate the cream/amber breaths
// keep recomposing layers while the user is reading further down the page.
function HeroPainterlyBackground({
  reduceMotion,
  disableAmbient = false,
  scrollYProgress,
  inView = true,
}) {
  // Reduced-motion fallback: all scroll-driven transforms collapse to
  // identity so users who opt out get a static painterly.
  const useScrollRange = (range) =>
    useTransform(scrollYProgress, [0, 1], reduceMotion ? [range[0], range[0]] : range);

  // Scroll-driven motion — wider ranges than before so the flow is
  // visibly active during the hero's scroll window.
  const pourScale = useScrollRange([1, 1.18]);
  const pourRotate = useScrollRange([0, -4]);
  const pourY = useScrollRange([0, -36]);
  const coreY = useScrollRange([0, -64]);
  const coreScale = useScrollRange([1, 1.08]);
  const tendrilsY = useScrollRange([0, -110]);
  const tendrilsX = useScrollRange([0, -28]);
  const tendrilsOpacity = useScrollRange([0.55, 0.18]);
  // Crackle veins INCREASE in opacity with scroll — ink drying, cracks
  // becoming more visible as the brass ages on the page.
  const cracksOpacity = useScrollRange([0.45, 0.95]);

  return (
    <Motion.svg
      aria-hidden
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMaxYMid slice"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <defs>
        <radialGradient id="hero-pour-body" cx="68%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#d4a13d" stopOpacity="0.34" />
          <stop offset="45%" stopColor="#a06f1d" stopOpacity="0.22" />
          <stop offset="85%" stopColor="#754d12" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#754d12" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="hero-pour-core" cx="58%" cy="48%" r="68%">
          <stop offset="0%" stopColor="#c98b2c" stopOpacity="0.34" />
          <stop offset="60%" stopColor="#7a4f15" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#7a4f15" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="hero-cream-bloom" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff2d4" stopOpacity="0.30" />
          <stop offset="60%" stopColor="#fff2d4" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#fff2d4" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="hero-amber-hot" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8a843" stopOpacity="0.26" />
          <stop offset="55%" stopColor="#b8862e" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#b8862e" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="hero-deep-bronze" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5e3d10" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#5e3d10" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Main brass pour — scroll-driven scale + rotate around an anchor
          point near the photo, plus parallax drift. */}
      <Motion.g
        style={{
          scale: pourScale,
          y: pourY,
          rotate: pourRotate,
          transformOrigin: '1200px 450px',
        }}
      >
        <path
          d="
            M 1440,0
            C 1440,180 1390,300 1300,400
            C 1200,510 1060,580 940,680
            C 850,760 800,830 800,900
            L 1440,900
            Z
          "
          fill="url(#hero-pour-body)"
        />
      </Motion.g>

      {/* Inner denser core — slightly different parallax rate so the
          two layers separate as the user scrolls. */}
      <Motion.g style={{ y: coreY, scale: coreScale, transformOrigin: '1200px 500px' }}>
        <path
          d="
            M 1340,40
            C 1380,150 1340,260 1260,340
            C 1170,430 1080,500 1000,590
            C 940,660 900,750 900,860
            L 1100,900
            L 1440,900
            L 1440,200
            Z
          "
          fill="url(#hero-pour-core)"
          opacity="0.85"
        />
        {/* Deep bronze pocket — heavier shadow at base of the pour */}
        <ellipse cx="1340" cy="620" rx="160" ry="200" fill="url(#hero-deep-bronze)" />
      </Motion.g>

      {/* Cream "wet-edge" blooms — continuous BREATH. Slow scale +
          opacity loop on a 9-second cycle so the brass surface always
          feels lit, even when the user isn't scrolling. Gated by
          `inView` so framer doesn't keep ticking these once hero scrolls
          off screen — saves compositor work while reading Projects. */}
      <Motion.g
        animate={
          reduceMotion || disableAmbient || !inView
            ? undefined
            : {
                scale: [1, 1.06, 1],
                opacity: [0.85, 1, 0.85],
              }
        }
        transition={
          reduceMotion || disableAmbient || !inView
            ? undefined
            : { duration: 9, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{ transformOrigin: '1200px 450px' }}
      >
        <ellipse cx="1260" cy="180" rx="340" ry="240" fill="url(#hero-cream-bloom)" />
        <ellipse cx="1100" cy="780" rx="190" ry="130" fill="url(#hero-cream-bloom)" opacity="0.6" />
      </Motion.g>

      {/* Amber hot spot — its own continuous breath at a different
          period (7 s) so it doesn't sync with the cream blooms — gives
          the streak two slightly out-of-phase pulses for life. */}
      <Motion.g
        animate={
          reduceMotion || disableAmbient || !inView
            ? undefined
            : {
                scale: [1, 1.08, 1],
                opacity: [0.85, 1, 0.85],
              }
        }
        transition={
          reduceMotion || disableAmbient || !inView
            ? undefined
            : { duration: 7, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{ transformOrigin: '1180px 450px' }}
      >
        <ellipse cx="1200" cy="420" rx="360" ry="400" fill="url(#hero-amber-hot)" />
      </Motion.g>

      {/* Thin tendrils reaching toward the text column on the left. They
          drift fastest of all on scroll — extending further into the
          page and fading as you read further. */}
      <Motion.g style={{ y: tendrilsY, x: tendrilsX, opacity: tendrilsOpacity }}>
        <g opacity="0.5">
          <path
            d="M 1100,180 C 800,280 600,400 400,520 C 280,600 200,680 150,740"
            fill="none"
            stroke="rgba(184, 134, 46, 0.42)"
            strokeWidth="60"
            strokeLinecap="round"
          />
          <path
            d="M 980,260 C 800,360 620,470 480,560"
            fill="none"
            stroke="rgba(184, 134, 46, 0.5)"
            strokeWidth="30"
            strokeLinecap="round"
          />
          <path
            d="M 900,500 C 760,580 620,640 480,720"
            fill="none"
            stroke="rgba(160, 111, 29, 0.32)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 820,360 C 720,420 620,460 540,500"
            fill="none"
            stroke="rgba(160, 111, 29, 0.28)"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </g>
      </Motion.g>

      {/* Crackle veins — start subtle, INCREASE with scroll. Reads as
          "ink drying" or "brass aging" as the user reads further. */}
      <Motion.g fill="none" strokeLinecap="round" style={{ opacity: cracksOpacity }}>
        <path
          d="M 1200,90 C 1230,160 1210,220 1180,290 C 1160,340 1140,380 1130,440"
          stroke="rgba(74, 46, 10, 0.32)"
          strokeWidth="0.8"
        />
        <path
          d="M 1320,180 C 1310,240 1290,290 1265,340"
          stroke="rgba(74, 46, 10, 0.28)"
          strokeWidth="0.7"
        />
        <path
          d="M 1100,420 C 1110,490 1090,560 1060,640 C 1040,690 1010,730 980,790"
          stroke="rgba(74, 46, 10, 0.28)"
          strokeWidth="0.7"
        />
        <path
          d="M 1240,500 C 1250,560 1240,610 1220,680"
          stroke="rgba(74, 46, 10, 0.25)"
          strokeWidth="0.6"
        />
        <path
          d="M 1080,260 C 1100,330 1140,400 1180,460"
          stroke="rgba(74, 46, 10, 0.22)"
          strokeWidth="0.5"
        />
        <path
          d="M 1370,300 C 1380,360 1370,420 1350,490 C 1330,550 1300,620 1280,690"
          stroke="rgba(74, 46, 10, 0.26)"
          strokeWidth="0.6"
        />
        {/* Branching fissure */}
        <path
          d="M 1180,290 C 1220,330 1250,360 1280,400"
          stroke="rgba(74, 46, 10, 0.22)"
          strokeWidth="0.5"
        />
        <path
          d="M 1060,640 C 1020,680 980,710 940,740"
          stroke="rgba(74, 46, 10, 0.22)"
          strokeWidth="0.5"
        />
      </Motion.g>
    </Motion.svg>
  );
}

export default HeroPainterlyBackground;
