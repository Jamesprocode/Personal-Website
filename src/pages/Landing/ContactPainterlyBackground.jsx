import { motion, useTransform } from 'framer-motion';

// Contact section painterly background. Smallest, quietest composition:
// a centered radial halo behind the email line, like a single overhead
// spotlight at the end of the page. Pulses softly with scroll as you
// reach the bottom of the page.
function ContactPainterlyBackground({ reduceMotion, scrollYProgress }) {
  const r = (range) => useTransform(scrollYProgress, [0, 1], reduceMotion ? [range[0], range[0]] : range);

  // Scroll-driven values are pushed wide so the halo visibly inflates
  // and the rings noticeably rotate as you arrive at the bottom of the
  // page. The halo "exhales" toward the email link.
  const haloScale = r([0.75, 1.28]);
  const haloOpacity = r([0.22, 1]);
  const haloY = r([30, -20]);
  const ringRotate = r([-12, 48]);
  const ringScale = r([0.9, 1.12]);

  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 1440 600"
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
        <radialGradient id="contact-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f4c878" stopOpacity="0.42" />
          <stop offset="40%" stopColor="#c4862e" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#7a4f15" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="contact-inner" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff2d4" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fff2d4" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer brass halo — inflates + brightens visibly with scroll */}
      <motion.g
        style={{
          scale: haloScale,
          y: haloY,
          opacity: haloOpacity,
          transformOrigin: '720px 300px',
          willChange: 'transform, opacity',
        }}
      >
        <ellipse cx="720" cy="300" rx="520" ry="260" fill="url(#contact-halo)" />
        <ellipse cx="720" cy="280" rx="240" ry="120" fill="url(#contact-inner)" />
      </motion.g>

      {/* Thin concentric brass rings — rotate visibly with scroll, like
          a turning dial pointing the reader to the email. */}
      <motion.g
        stroke="rgba(184, 134, 46, 0.18)"
        strokeWidth="0.6"
        fill="none"
        style={{
          rotate: ringRotate,
          scale: ringScale,
          transformOrigin: '720px 300px',
          willChange: 'transform',
        }}
      >
        <ellipse cx="720" cy="300" rx="320" ry="180" />
        <ellipse cx="720" cy="300" rx="380" ry="210" strokeOpacity="0.14" />
        <ellipse cx="720" cy="300" rx="440" ry="240" strokeOpacity="0.1" />
      </motion.g>
    </motion.svg>
  );
}

export default ContactPainterlyBackground;
