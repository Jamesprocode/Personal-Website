import { motion, useTransform } from 'framer-motion';

// Timeline background: a large CD partially off the right edge with a
// brass-toned iridescent surface, slowly rotating with scroll. Below the
// existing three timeline tracks, a red LASER beam + dot tracks the
// current scroll position across the years 2020 → 2026 — the laser
// reading the CD groove. CDs are the medium between cassette tapes
// (projects above) and digital, which fits "chronology".

function CDDisc({ rotateMV }) {
  return (
    <motion.div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        rotate: rotateMV,
        // Smoother brass-spectrum iridescence — many narrow stops give a
        // shimmer instead of chunky chevrons. All warm gold, no rainbow.
        background:
          'conic-gradient(from 20deg, #c98b2c 0deg, #d4a13d 24deg, #f4c878 48deg, #fff2d4 72deg, #f4c878 96deg, #d4a13d 120deg, #a06f1d 144deg, #7a4f15 168deg, #a06f1d 192deg, #d4a13d 216deg, #f4c878 240deg, #fff2d4 264deg, #f4c878 288deg, #d4a13d 312deg, #c98b2c 336deg, #c98b2c 360deg)',
        boxShadow:
          '0 22px 60px -18px rgba(74, 46, 10, 0.55), inset 0 0 0 1px rgba(28, 18, 8, 0.45)',
      }}
    >
      {/* Inner shading overlay — darker toward center, slight rim falloff */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255, 242, 212, 0.04) 0%, rgba(212, 161, 61, 0.12) 28%, rgba(122, 79, 21, 0.28) 60%, rgba(58, 36, 12, 0.5) 95%)',
        }}
      />
      {/* Groove rings — many fine concentric circles */}
      <svg
        viewBox="-220 -220 440 440"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        aria-hidden
      >
        {Array.from({ length: 70 }).map((_, i) => {
          const r = 64 + i * 2.05;
          const op = i % 6 === 0 ? 0.22 : 0.09;
          return (
            <circle
              key={i}
              cx="0"
              cy="0"
              r={r}
              fill="none"
              stroke="rgba(28, 18, 8, 1)"
              strokeWidth="0.4"
              opacity={op}
            />
          );
        })}
      </svg>
      {/* Inner CD label area — warm hot-print tint reads as a real
          printed CD label, not a flat cream sticker. */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '24%',
          height: '24%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 38% 32%, #f4e2b8 0%, #e8c878 55%, #c9a35a 100%)',
          boxShadow:
            'inset 0 0 0 1px rgba(74, 46, 10, 0.45), inset 0 0 12px rgba(122, 79, 21, 0.28), 0 0 0 2px rgba(28, 18, 8, 0.3)',
        }}
      />
      {/* Center hole — drilled look: brass keyline outside + inset shadow
          inside so it reads as a punched hole, not a painted-on dot. */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '8%',
          height: '8%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: '#efe3c9',
          boxShadow:
            'inset 0 0 0 1px rgba(74, 46, 10, 0.75), inset 0 2px 4px rgba(28, 18, 8, 0.5), 0 0 0 2px rgba(212, 161, 61, 0.55)',
        }}
      />
    </motion.div>
  );
}

function TimelinePainterlyBackground({ reduceMotion, scrollYProgress }) {
  // Timeline is the last scrollable section; the user can't reach
  // progress > ~0.6 before the page ends. Mapping rotation to
  // [0.25, 0.6] lets the user see the full 150° sweep within the
  // reachable scroll range. CD visibly completes its turn.
  const cdRotate = useTransform(
    scrollYProgress, [0.25, 0.6],
    reduceMotion ? [0, 0] : [-40, 110]
  );
  return (
    <div
      className="timeline-painterly-bg"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <style>{`
        /* Hide the CD on narrow viewports — it overlaps the timeline
           tracks at the 2023-2026 mark, making both unreadable. */
        @media (max-width: 767px) {
          .timeline-painterly-bg { display: none; }
        }
      `}</style>

      {/* The CD, partially off the right edge. Pulled slightly more
          into the viewport so the warm hot-print label + drilled
          center hole are visible on common laptop viewports (1366,
          1440), not just on wider screens. `will-change` promotes the
          rotating disc to its own compositor layer. */}
      <div
        style={{
          position: 'absolute',
          right: 'clamp(-300px, -18%, -200px)',
          top: '50%',
          width: 'clamp(360px, 38vw, 540px)',
          height: 'clamp(360px, 38vw, 540px)',
          transform: 'translateY(-50%)',
          opacity: 0.82,
          willChange: 'transform',
        }}
      >
        <CDDisc rotateMV={cdRotate} />
      </div>

      {/* Soft amber halo behind the CD — gives it lift off the cream paper */}
      <div
        style={{
          position: 'absolute',
          right: 'clamp(-360px, -22%, -260px)',
          top: '50%',
          width: 'clamp(440px, 46vw, 640px)',
          height: 'clamp(440px, 46vw, 640px)',
          transform: 'translateY(-50%)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(232, 168, 67, 0.18) 0%, rgba(212, 161, 61, 0.08) 40%, transparent 70%)',
          zIndex: -1,
        }}
      />

    </div>
  );
}

export default TimelinePainterlyBackground;
