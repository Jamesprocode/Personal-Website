import { motion as Motion, useTransform } from 'framer-motion';

// 3-point input/output keyframes (e.g. pulse: 0 → 0.9 → 0). Honors reduced-motion.
function useKeyframe(progress, inputs, outputs, reduceMotion) {
  return useTransform(progress, inputs, reduceMotion ? outputs.map(() => outputs[0]) : outputs);
}

// Music preview background. The section is dark espresso (#1a1410), so the
// painterly here is INVERTED from hero/projects: warm gold glow radiating
// from behind the spinning vinyl on the right, like stage light spilling
// onto a record. A second cooler glow on the left answers it. Both pulse
// gently with scroll, and a soft horizontal "needle of light" sweeps
// across as you move past.
function MusicPainterlyBackground({ reduceMotion, disableScroll = false, scrollYProgress }) {
  const reduceScrollMotion = reduceMotion || disableScroll;
  const useScrollRange = (range) =>
    useTransform(scrollYProgress, [0, 1], reduceScrollMotion ? [range[0], range[0]] : range);

  // Scroll-driven motion is stronger now: the stage glow swings wider,
  // the moon answers with its own drift, and the dust motes drift the
  // length of the section. The needle remains the section's signature
  // gesture, sweeping the full width of the scroll range.
  const stageX = useScrollRange([60, -80]);
  const stageY = useScrollRange([-20, 30]);
  const stageScale = useScrollRange([0.88, 1.18]);
  const stageOpacity = useScrollRange([0.55, 1]);
  const moonX = useScrollRange([-30, 60]);
  const moonY = useScrollRange([20, -40]);
  const moonScale = useScrollRange([0.85, 1.12]);
  const moonOpacity = useScrollRange([0.25, 0.95]);
  const needleX = useScrollRange([-80, 1560]);
  const needleOpacity = useKeyframe(scrollYProgress, [0, 0.5, 1], [0, 0.95, 0], reduceScrollMotion);
  const dustY = useScrollRange([40, -120]);
  const dustOpacity = useScrollRange([0.6, 0.15]);

  return (
    <Motion.svg
      aria-hidden
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <defs>
        <radialGradient id="music-stage-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f4c878" stopOpacity="0.34" />
          <stop offset="40%" stopColor="#c4862e" stopOpacity="0.18" />
          <stop offset="75%" stopColor="#7a4f15" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#7a4f15" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="music-stage-hot" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff0c0" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#fff0c0" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#fff0c0" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="music-moon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d4a13d" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#7a4f15" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#7a4f15" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="music-needle" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#f4c878" stopOpacity="0" />
          <stop offset="50%" stopColor="#f4c878" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#f4c878" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Right-side STAGE GLOW: large warm hot spot behind the vinyl disc.
          Swings + scales noticeably as you scroll — the stage lamp panning.
          `will-change` promotes to its own compositor layer so iGPUs
          don't re-rasterize the whole section on each scroll frame. */}
      <Motion.g
        style={{
          x: stageX,
          y: stageY,
          scale: stageScale,
          opacity: stageOpacity,
          transformOrigin: '1100px 450px',
          willChange: 'transform, opacity',
        }}
      >
        <ellipse cx="1100" cy="450" rx="500" ry="380" fill="url(#music-stage-glow)" />
        <ellipse cx="1140" cy="430" rx="180" ry="140" fill="url(#music-stage-hot)" />
      </Motion.g>

      {/* Left-side COOLER GLOW: answers the stage with a drift in the
          opposite direction. */}
      <Motion.g
        style={{
          x: moonX,
          y: moonY,
          scale: moonScale,
          opacity: moonOpacity,
          transformOrigin: '200px 500px',
          willChange: 'transform, opacity',
        }}
      >
        <ellipse cx="200" cy="500" rx="320" ry="280" fill="url(#music-moon)" />
      </Motion.g>

      {/* Needle of light — sweeps horizontally across the section */}
      <Motion.g style={{ x: needleX, opacity: needleOpacity, willChange: 'transform, opacity' }}>
        <rect x="-200" y="0" width="400" height="900" fill="url(#music-needle)" />
      </Motion.g>

      {/* Atmospheric dust motes — drift up gently, like specks in a beam */}
      <Motion.g style={{ y: dustY, opacity: dustOpacity }} fill="rgba(244, 200, 120, 0.5)">
        <circle cx="280" cy="200" r="1.2" />
        <circle cx="420" cy="350" r="0.9" />
        <circle cx="560" cy="240" r="1.4" />
        <circle cx="700" cy="180" r="1" />
        <circle cx="380" cy="500" r="1.1" />
        <circle cx="520" cy="620" r="0.8" />
        <circle cx="660" cy="780" r="1" />
        <circle cx="240" cy="700" r="0.9" />
        <circle cx="380" cy="820" r="1.2" />
        <circle cx="820" cy="320" r="0.7" />
        <circle cx="960" cy="170" r="1" />
        <circle cx="1240" cy="800" r="1.1" />
        <circle cx="1340" cy="220" r="0.9" />
        <circle cx="320" cy="380" r="0.8" />
        <circle cx="180" cy="560" r="0.7" />
      </Motion.g>
    </Motion.svg>
  );
}

export default MusicPainterlyBackground;
