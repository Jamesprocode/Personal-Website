import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import projects from '../../data/projects';

const CATEGORY_COLORS = {
  'Musical Interaction': '#f59e0b',          // amber — GEMS, Shimon × AMT
  'Music Information Retrieval': '#06b6d4',  // cyan — F0, HMM, stem-separation
  'Music Theory': '#ec4899',                 // pink — rock harmony, harmonic divorce
  'Computer Vision': '#8b5cf6',              // violet — OMR
  'Music Software': '#a855f7',               // purple — Super Awesome
  // Legacy fallbacks (in case any project still uses the old buckets)
  'Machine Learning': '#3b82f6',
  Research: '#22c55e',
};

const categoryColor = (category) => CATEGORY_COLORS[category] || '#6b7280';

const extractYear = (period) => {
  const match = period.match(/(20\d{2})/);
  return match ? match[1] : '';
};

function SpinningReel({ cx, cy, r, duration = 4, reduceMotion }) {
  return (
    <motion.g
      animate={reduceMotion ? undefined : { rotate: 360 }}
      transition={reduceMotion ? undefined : { duration, repeat: Infinity, ease: 'linear' }}
      style={{ transformBox: 'fill-box', transformOrigin: `${cx}px ${cy}px` }}
    >
      <circle cx={cx} cy={cy} r={r} fill="#7c2d12" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#451a03" strokeWidth={Math.max(2, r * 0.22)} />
      <circle cx={cx} cy={cy} r={r * 0.32} fill="#451a03" />
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i * 60 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(a) * r * 0.8}
            y2={cy + Math.sin(a) * r * 0.8}
            stroke="#92400e"
            strokeWidth={Math.max(1, r * 0.14)}
            strokeLinecap="round"
          />
        );
      })}
    </motion.g>
  );
}

function CassetteRow({ project, isSelected, onClick, reduceMotion }) {
  const dotColor = categoryColor(project.category);
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 4, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
      whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
      animate={{ x: isSelected ? 6 : 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'block',
        width: '100%',
        padding: 0,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        outline: 'none',
      }}
      aria-label={`${project.title}${isSelected ? ', selected' : ''}`}
      aria-pressed={isSelected}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          backgroundColor: '#fde68a',
          border: '4px solid #78350f',
          borderRadius: 12,
          boxShadow: isSelected
            ? '0 10px 22px -8px rgba(120, 60, 0, 0.4), inset 0 0 0 2px #c4a265'
            : '0 6px 14px -8px rgba(120, 60, 0, 0.28)',
          transition: 'box-shadow 0.25s ease-out',
        }}
      >
        {/* Left reel */}
        <svg width="36" height="36" viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
          <SpinningReel cx={20} cy={20} r={14} duration={5} reduceMotion={reduceMotion} />
        </svg>

        {/* Label area */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            backgroundColor: '#fffbeb',
            border: '1px solid rgba(146, 64, 14, 0.25)',
            borderRadius: 4,
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 8,
              height: 8,
              borderRadius: 9999,
              backgroundColor: dotColor,
              flexShrink: 0,
              boxShadow: `0 0 0 3px ${dotColor}33`,
            }}
          />
          <span
            style={{
              fontFamily: 'Space Grotesk, system-ui, sans-serif',
              fontSize: 'clamp(0.92rem, 1.05vw, 1.05rem)',
              fontWeight: 600,
              color: '#451a03',
              letterSpacing: '-0.005em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
            }}
          >
            {project.shortTitle}
          </span>
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.7rem',
              color: 'rgba(146, 64, 14, 0.7)',
              letterSpacing: '0.12em',
              flexShrink: 0,
            }}
          >
            {extractYear(project.period)}
          </span>
        </div>

        {/* Right reel */}
        <svg width="36" height="36" viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
          <SpinningReel cx={20} cy={20} r={14} duration={5} reduceMotion={reduceMotion} />
        </svg>
      </div>
    </motion.button>
  );
}

function CassetteFront({ project, onClose, reduceMotion }) {
  return (
    <motion.div
      role="dialog"
      aria-modal="false"
      aria-label={`${project.title} preview`}
      initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'relative', width: '100%' }}
    >
      <svg
        viewBox="0 0 800 500"
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-hidden
        style={{ filter: 'drop-shadow(0 20px 36px rgba(120, 60, 0, 0.28))' }}
      >
        <defs>
          <clipPath id={`cassette-thumb-${project.id}`}>
            <rect x="540" y="68" width="160" height="160" rx="10" />
          </clipPath>
        </defs>

        {/* Shell */}
        <rect x="20" y="20" width="760" height="460" rx="32" fill="#fde68a" />
        <rect x="20" y="20" width="760" height="460" rx="32" fill="none" stroke="#78350f" strokeWidth="14" />

        {/* Label panel */}
        <rect x="72" y="56" width="656" height="184" rx="14" fill="#fffbeb" />
        <rect x="72" y="56" width="656" height="184" rx="14" fill="none" stroke="#92400e" strokeOpacity="0.28" strokeWidth="1.5" />

        {/* Category dot + kicker */}
        <circle cx="112" cy="98" r="7" fill={categoryColor(project.category)} />
        <text
          x="132"
          y="103"
          fontFamily="JetBrains Mono, monospace"
          fontSize="13"
          fill="#92400e"
          fillOpacity="0.85"
          letterSpacing="3"
        >
          {project.category.toUpperCase()}
        </text>

        {/* Title */}
        <text
          x="112"
          y="162"
          fontFamily="Space Grotesk, system-ui, sans-serif"
          fontSize="34"
          fontWeight="700"
          fill="#451a03"
          letterSpacing="-1"
        >
          {project.shortTitle}
        </text>

        {/* Period */}
        <text
          x="112"
          y="204"
          fontFamily="JetBrains Mono, monospace"
          fontSize="13"
          fill="#92400e"
          fillOpacity="0.7"
          letterSpacing="2"
        >
          {project.period.toUpperCase()}
        </text>

        {/* Project photo (right side of the label) */}
        {project.tileImage && (
          <g>
            <image
              href={project.tileImage}
              x="540"
              y="68"
              width="160"
              height="160"
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#cassette-thumb-${project.id})`}
            />
            <rect
              x="540"
              y="68"
              width="160"
              height="160"
              rx="10"
              fill="none"
              stroke="#92400e"
              strokeOpacity="0.35"
              strokeWidth="1.5"
            />
          </g>
        )}

        {/* Reels */}
        <SpinningReel cx={220} cy={360} r={62} duration={2.5} reduceMotion={reduceMotion} />
        <SpinningReel cx={580} cy={360} r={62} duration={2.5} reduceMotion={reduceMotion} />

        {/* Tape window */}
        <rect x="320" y="425" width="160" height="6" rx="3" fill="#92400e" fillOpacity="0.5" />

        {/* Head holes between reels */}
        <circle cx="400" cy="360" r="6" fill="#451a03" />
      </svg>

      {/* PLAY button */}
      <Link
        to={`/projects/${project.id}`}
        className="absolute inline-flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a265]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fde68a]"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#c4a265',
          color: '#1a1410',
          padding: '0.85rem 1.7rem',
          fontSize: '0.85rem',
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          boxShadow:
            '0 10px 22px -6px rgba(120, 60, 0, 0.45), inset 0 1px 1px rgba(255,235,170,0.6)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d4b76e')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#c4a265')}
        aria-label={`Open ${project.title}`}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
        Play
      </Link>

      {/* Close × */}
      <button
        onClick={onClose}
        aria-label="Close preview"
        className="absolute focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a265]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fde68a]"
        style={{
          right: 18,
          top: 18,
          width: 32,
          height: 32,
          borderRadius: 9999,
          backgroundColor: 'rgba(255,251,235,0.85)',
          border: '1px solid rgba(146,64,14,0.35)',
          color: '#451a03',
          cursor: 'pointer',
          fontSize: 16,
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </motion.div>
  );
}

function ProjectShelf() {
  const reduceMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState(null);
  const selectedProject = projects.find((p) => p.id === selectedId) || null;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 1fr) minmax(0, 1.4fr)',
        gap: 'clamp(2rem, 4vw, 4rem)',
        alignItems: 'start',
        marginTop: 'clamp(2.5rem, 5vh, 4rem)',
      }}
      className="project-shelf-grid"
    >
      {/* LEFT: vertical list of horizontal cassettes */}
      <div
        role="list"
        aria-label="Project tapes"
        style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.6rem, 1vh, 1rem)' }}
      >
        {projects.map((p) => (
          <CassetteRow
            key={p.id}
            project={p}
            isSelected={selectedId === p.id}
            onClick={() => setSelectedId(p.id === selectedId ? null : p.id)}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>

      {/* RIGHT: active cassette panel */}
      <div
        style={{
          minHeight: 360,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'sticky',
          top: 'clamp(7rem, 10vh, 10rem)',
        }}
      >
        <AnimatePresence mode="wait">
          {selectedProject ? (
            <CassetteFront
              key={selectedProject.id}
              project={selectedProject}
              onClose={() => setSelectedId(null)}
              reduceMotion={reduceMotion}
            />
          ) : (
            <motion.div
              key="placeholder"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                textAlign: 'center',
                padding: '2rem',
                maxWidth: 360,
              }}
            >
              <p
                className="font-mono uppercase"
                style={{
                  color: 'rgba(146, 64, 14, 0.65)',
                  fontSize: 'clamp(0.7rem, 0.85vw, 0.8rem)',
                  letterSpacing: '0.22em',
                  marginBottom: 12,
                }}
              >
                Pick a tape
              </p>
              <p
                style={{
                  color: 'rgba(74, 63, 53, 0.7)',
                  fontSize: 'clamp(0.92rem, 1.05vw, 1.05rem)',
                  lineHeight: 1.55,
                }}
              >
                Click any tape on the shelf to see what is on it. Press play to open the project.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .project-shelf-grid {
            grid-template-columns: 1fr !important;
          }
          .project-shelf-grid > div:last-child {
            position: relative !important;
            top: 0 !important;
            min-height: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ProjectShelf;
