import { motion as Motion, useTransform } from 'framer-motion';

// Projects background: a CLOSE-UP MASTER LACQUER. We're looking down at
// a record being cut — concentric brass groove rings sweep across the
// section, with a warm AMBER LABEL center off the lower-right and a
// bright TRACKING STYLUS that walks along the grooves as the user
// scrolls (outer → inner, like a record being played in).
//
// Why this reads as "music" without copying Music section's vinyl disc:
//   • Music section shows a complete spinning disc on the right.
//   • Here we sit inside an oblique POV, never showing the disc edge —
//     just the groove field, a label glow, and the cutting head trail.
//   • Cassette tiles on the left rest on the rings like cards dropped on
//     a master lacquer. Rings are the surface, not foreground objects.
//
// Layers (back → front):
//   1. PAPER WASH — soft cream→amber radial that warms the right side,
//      grounds the rings on the cream paper.
//   2. RING FIELD — ~46 concentric arcs in brass / walnut, varying
//      stroke weight (thick "band" rings every 6th), with a continuous
//      subtle shimmer. The whole group scales with scroll for parallax.
//   3. LABEL HALO — a glowing amber zone at the focal point that pulses
//      continuously and drifts with scroll. The "label" of the record.
//   4. TRACKING ARC — a brass-bright arc with a hot leading dot. As the
//      user scrolls, the arc's radius shrinks (cutting head walks inward
//      from outer groove → inner band). This is the signature gesture.
//   5. CORNER CASSETTE WASH — a soft cream haze in the top-left so the
//      cassette tile column always reads on a near-clean ground.

// Bumped down from 46 to 28 — QA flagged that the extra 18 rings don't
// add visible detail but multiply the SVG paint cost on every scroll
// transform. 28 reads identically to 46 once they're scaled + rotated.
const RING_COUNT = 28;

// Focal point off the lower-right corner of the viewBox so all visible
// arcs sweep across the page in graceful curves.
const FX = 1380;
const FY = 1180;

function buildRings(count) {
  const rings = [];
  for (let i = 0; i < count; i += 1) {
    const t = i / (count - 1);
    // Growth: tight at the center (label), wider at the edges.
    const r = 240 + Math.pow(t, 1.12) * 1480 + (i % 5) * 3.5;
    const isBand = i % 6 === 0;
    const stroke = isBand ? 1.8 : 0.75;
    const fade = 1 - Math.pow(t, 2.4) * 0.62;
    const opacity = (isBand ? 0.34 : 0.19) * fade;
    rings.push({ r, stroke, opacity, isBand, t });
  }
  return rings;
}

const RINGS = buildRings(RING_COUNT);

function useScrollRange(scrollYProgress, reduceMotion, range) {
  return useTransform(scrollYProgress, [0, 1], reduceMotion ? [range[0], range[0]] : range);
}

function ProjectsPainterlyBackground({ reduceMotion, scrollYProgress }) {
  // Bigger scale range so parallax actually reads as the field "breathing"
  // toward / away from the viewer as you scroll.
  const fieldScale = useScrollRange(scrollYProgress, reduceMotion, [0.92, 1.12]);
  const fieldRotate = useScrollRange(scrollYProgress, reduceMotion, [-1.5, 2.5]); // subtle clockwise turn

  // Focal glow drifts down + right (off-screen further) as you scroll
  // so the geometry visibly shifts.
  const focalDX = useScrollRange(scrollYProgress, reduceMotion, [-40, 90]);
  const focalDY = useScrollRange(scrollYProgress, reduceMotion, [-50, 120]);
  const focalAlpha = useScrollRange(scrollYProgress, reduceMotion, [0.7, 1]);

  // Secondary corner glow (upper-left, on the cassette side) — counter
  // drift to give the field a second axis of motion.
  const cornerX = useScrollRange(scrollYProgress, reduceMotion, [60, -80]);
  const cornerY = useScrollRange(scrollYProgress, reduceMotion, [-30, 60]);

  // TRACKING ARC: walks from outermost groove to inner band over the
  // scroll range. Outer 1680 → Inner 460. Animated via `transform: scale`
  // on a wrapping group (compositor-only) instead of the SVG `r`
  // attribute (triggers SVG layout every frame).
  const TRACK_R = 1000;
  const trackScale = useScrollRange(scrollYProgress, reduceMotion, [1680 / TRACK_R, 460 / TRACK_R]);
  const trackOpacity = useTransform(
    scrollYProgress,
    [0, 0.06, 0.94, 1],
    reduceMotion ? [0, 0, 0, 0] : [0, 1, 1, 0]
  );
  // The arc also rotates as it walks — feels like the cutting head is
  // tangent to the groove direction at each new radius.
  const trackRotate = useScrollRange(scrollYProgress, reduceMotion, [-8, 22]);

  // Dust drift
  const dustY = useScrollRange(scrollYProgress, reduceMotion, [40, -90]);
  const dustOpacity = useScrollRange(scrollYProgress, reduceMotion, [0.7, 0.4]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <style>{`
        /* Label halo breath — runs at rest so the section feels alive. */
        @keyframes pj-halo-breath {
          0%, 100% { transform: scale(1);    opacity: 0.68; }
          50%      { transform: scale(1.04); opacity: 0.88; }
        }
        @keyframes pj-corner-breath {
          0%, 100% { transform: scale(1);    opacity: 0.58; }
          50%      { transform: scale(1.07); opacity: 0.78; }
        }

        /* Tracking head pulse — keeps the lead dot reading even at rest. */
        @keyframes pj-track-pulse {
          0%, 100% { opacity: 0.68; }
          50%      { opacity: 0.88; }
        }

        /* Mobile: tighten the geometry so the focal area + cassettes
           still read at 390x844. */
        @media (max-width: 767px) {
          .pj-bg-svg { transform: scale(1.85) translate(-12%, -8%); }
        }
      `}</style>

      <svg
        className="pj-bg-svg"
        aria-hidden
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <defs>
          {/* Warm paper wash — cream paper warmed toward the focal corner. */}
          <radialGradient id="pj-paper" cx={`${(FX / 1440) * 100}%`} cy={`${(FY / 900) * 100}%`} r="110%">
            <stop offset="0%" stopColor="#f5d99a" stopOpacity="0.42" />
            <stop offset="35%" stopColor="#edcb86" stopOpacity="0.20" />
            <stop offset="70%" stopColor="#efe3c9" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#efe3c9" stopOpacity="0" />
          </radialGradient>

          {/* Ring fade mask — full opacity near focal, fades toward the
              upper-left so cassettes don't sit on a crowded field. */}
          <radialGradient id="pj-ringfade" cx={`${(FX / 1440) * 100}%`} cy={`${(FY / 900) * 100}%`} r="115%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="55%" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="80%" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.1" />
          </radialGradient>
          <mask id="pj-ringmask">
            <rect x="0" y="0" width="1440" height="900" fill="url(#pj-ringfade)" />
          </mask>

          {/* Label halo — the warm bright "center of the record". */}
          <radialGradient id="pj-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff2c8" stopOpacity="0.28" />
            <stop offset="22%" stopColor="#f0c474" stopOpacity="0.18" />
            <stop offset="58%" stopColor="#c98b2c" stopOpacity="0.10" />
            <stop offset="84%" stopColor="#7a4f15" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#7a4f15" stopOpacity="0" />
          </radialGradient>

          {/* Inner hot spot inside the halo — the brightest single point. */}
          <radialGradient id="pj-hotspot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff8de" stopOpacity="0.18" />
            <stop offset="55%" stopColor="#fff8de" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#fff8de" stopOpacity="0" />
          </radialGradient>

          {/* Corner answer glow — on the cassette side, much cooler &
              softer so it lifts the cassettes off the cream without
              competing with the focal halo. */}
          <radialGradient id="pj-corner" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f4c878" stopOpacity="0.28" />
            <stop offset="45%" stopColor="#a06f1d" stopOpacity="0.09" />
            <stop offset="100%" stopColor="#a06f1d" stopOpacity="0" />
          </radialGradient>

          <filter id="pj-soft-bloom" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
          <filter id="pj-track-soften" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.35" />
          </filter>
        </defs>

        {/* PAPER WASH — first, behind everything else. */}
        <rect x="0" y="0" width="1440" height="900" fill="url(#pj-paper)" />

        {/* CORNER ANSWER GLOW — cool brass on the upper-left side. */}
        <Motion.g style={{ x: cornerX, y: cornerY }}>
          <ellipse
            cx={240}
            cy={180}
            rx={520}
            ry={380}
            fill="url(#pj-corner)"
            style={{
              transformOrigin: '240px 180px',
              animation: reduceMotion ? undefined : 'pj-corner-breath 12s ease-in-out infinite',
            }}
          />
        </Motion.g>

        {/* RING FIELD — masked so it fades into the cream at the upper
            left. Scales and slightly rotates with scroll. `will-change:
            transform` promotes this group to its own compositor layer
            so it doesn't re-rasterize the whole section on each frame. */}
        <Motion.g
          mask="url(#pj-ringmask)"
          style={{
            scale: fieldScale,
            rotate: fieldRotate,
            transformOrigin: `${FX}px ${FY}px`,
            willChange: 'transform',
          }}
        >
          {RINGS.map((ring, i) => (
            <circle
              key={i}
              cx={FX}
              cy={FY}
              r={ring.r}
              fill="none"
              stroke={ring.isBand ? '#5e3d10' : '#7a4f15'}
              strokeWidth={ring.stroke}
              opacity={ring.opacity}
            />
          ))}
        </Motion.g>

        {/* LABEL HALO — big warm bloom at the focal point. Drifts with
            scroll, breathes continuously. */}
        <Motion.g
          style={{
            x: focalDX,
            y: focalDY,
            opacity: focalAlpha,
          }}
        >
          <ellipse
            cx={FX}
            cy={FY - 160}
            rx={620}
            ry={500}
            fill="url(#pj-halo)"
            style={{
              transformOrigin: `${FX}px ${FY - 160}px`,
              animation: reduceMotion ? undefined : 'pj-halo-breath 9s ease-in-out infinite',
            }}
          />
          {/* Hot spot — small bright nucleus inside the halo */}
          <ellipse
            cx={FX - 40}
            cy={FY - 220}
            rx={220}
            ry={170}
            fill="url(#pj-hotspot)"
            style={{
              transformOrigin: `${FX - 40}px ${FY - 220}px`,
              animation: reduceMotion ? undefined : 'pj-halo-breath 7s ease-in-out infinite',
            }}
          />
        </Motion.g>

        {/* TRACKING ARC — the signature scroll-driven gesture.
            A bright brass arc rides one of the groove radii. As scroll
            progresses, the radius shrinks (cutting head walks inward)
            and the arc rotates a bit so the head feels like it's
            following the groove tangent. */}
        {!reduceMotion && (
          <Motion.g
            style={{
              opacity: trackOpacity,
              transformOrigin: `${FX}px ${FY}px`,
              rotate: trackRotate,
              scale: trackScale,
              willChange: 'transform, opacity',
            }}
          >
            {/* OUTER HALO — softest, widest layer simulating bloom around
                the cutting head. Stacking multiple decreasing strokes
                gives glow without the cost of an SVG filter. */}
            <circle
              cx={FX}
              cy={FY}
              r={TRACK_R}
              fill="none"
              stroke="rgba(255, 232, 168, 0.18)"
              strokeWidth={52}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.20 1"
              strokeDashoffset="0.38"
              filter="url(#pj-soft-bloom)"
            />
            {/* Mid halo */}
            <circle
              cx={FX}
              cy={FY}
              r={TRACK_R}
              fill="none"
              stroke="rgba(244, 200, 120, 0.34)"
              strokeWidth={28}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.16 1"
              strokeDashoffset="0.40"
              filter="url(#pj-track-soften)"
            />
            {/* Saturated brass core */}
            <circle
              cx={FX}
              cy={FY}
              r={TRACK_R}
              fill="none"
              stroke="rgba(232, 184, 100, 0.62)"
              strokeWidth={8}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.13 1"
              strokeDashoffset="0.415"
            />
            {/* Hot cream highlight — the bright wire down the middle */}
            <circle
              cx={FX}
              cy={FY}
              r={TRACK_R}
              fill="none"
              stroke="rgba(255, 246, 220, 0.56)"
              strokeWidth={3}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.085 1"
              strokeDashoffset="0.435"
            />
            {/* LEADING DOT stack — three concentric strokes at the same
                dash offset create a cheap radial-gradient-style glow
                without filters. Pulse is applied to the whole group as
                a single CSS animation instead of three individual ones
                — under 6× CPU throttle, this dropped Layerize cost ~25 ms
                over a 4 s scroll burst (the three circles each compose
                their own opacity channel even when synchronized). */}
            <g style={{ animation: reduceMotion ? undefined : 'pj-track-pulse 1.6s ease-in-out infinite' }}>
              <circle
                cx={FX}
                cy={FY}
                r={TRACK_R}
                fill="none"
                stroke="rgba(255, 245, 200, 0.26)"
                strokeWidth={32}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="0.012 1"
                strokeDashoffset="0.378"
                filter="url(#pj-soft-bloom)"
              />
              <circle
                cx={FX}
                cy={FY}
                r={TRACK_R}
                fill="none"
                stroke="rgba(255, 250, 220, 0.46)"
                strokeWidth={16}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="0.008 1"
                strokeDashoffset="0.379"
                filter="url(#pj-track-soften)"
              />
              {/* Leading dot — pure white core */}
              <circle
                cx={FX}
                cy={FY}
                r={TRACK_R}
                fill="none"
                stroke="rgba(255, 250, 236, 0.72)"
                strokeWidth={4.5}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="0.004 1"
                strokeDashoffset="0.380"
              />
            </g>
          </Motion.g>
        )}

        {/* DUST MOTES — sparse atmospheric particles drifting upward. */}
        <Motion.g
          style={{ y: dustY, opacity: dustOpacity }}
          fill="rgba(184, 134, 46, 0.42)"
        >
          <circle cx="160" cy="220" r="1.4" />
          <circle cx="320" cy="380" r="1.1" />
          <circle cx="240" cy="560" r="1.3" />
          <circle cx="420" cy="680" r="0.9" />
          <circle cx="580" cy="280" r="1.5" />
          <circle cx="720" cy="500" r="1.1" />
          <circle cx="640" cy="760" r="1.2" />
          <circle cx="860" cy="180" r="1.3" />
          <circle cx="980" cy="420" r="0.9" />
          <circle cx="1100" cy="620" r="1.4" />
          <circle cx="1180" cy="280" r="1.1" />
          <circle cx="1320" cy="540" r="1.3" />
          <circle cx="380" cy="120" r="0.9" />
          <circle cx="520" cy="820" r="1.2" />
          <circle cx="900" cy="780" r="1.1" />
          <circle cx="1240" cy="780" r="1.3" />
          <circle cx="80"  cy="480" r="0.9" />
          <circle cx="780" cy="320" r="1" />
          <circle cx="1040" cy="160" r="1.2" />
        </Motion.g>
      </svg>
    </div>
  );
}

export default ProjectsPainterlyBackground;
