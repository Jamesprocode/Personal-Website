import { memo, useCallback, useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import projects from '../../data/projects';
import useIsMobile from '../../hooks/useIsMobile';

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

// Cassette reel — wraps the SVG in a CSS-driven rotating div so the
// rotation runs on the compositor and is paused automatically when the
// cassette's parent section is `data-offscreen`. Previously this used
// framer-motion's `animate` prop on a `<Motion.g>`; with 16 cassettes ×
// 2 reels = 32 simultaneous JS rAF callbacks, that was the dominant
// scroll-jank source on the projects shelf under CPU throttle (a 4 s
// scroll burst at 6× lost ~22% of compositor time to the reels; at 10×,
// ~27%). The div wrapper avoids the SVG `transform-box: fill-box` layout
// thrash that pure-SVG CSS rotation triggers in Blink.
function SpinningReel({ size, reduceMotion, duration = 4 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        animation: reduceMotion ? undefined : `reel-spin ${duration}s linear infinite`,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
        <circle cx={20} cy={20} r={14} fill="#7c2d12" />
        <circle cx={20} cy={20} r={14} fill="none" stroke="#451a03" strokeWidth={3.1} />
        <circle cx={20} cy={20} r={4.5} fill="#451a03" />
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i * 60 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={20}
              y1={20}
              x2={20 + Math.cos(a) * 11.2}
              y2={20 + Math.sin(a) * 11.2}
              stroke="#92400e"
              strokeWidth={2}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </div>
  );
}

// SVG inline variant — used inside the opened cassette preview where the
// reel has to live inside a parent SVG coordinate system. Only ~2 of these
// exist at a time (the preview opens for one selected project) so the
// framer-motion JS cost is negligible. Keeps the original API.
function SpinningReelSvg({ cx, cy, r, duration = 4, reduceMotion }) {
  return (
    <Motion.g
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
    </Motion.g>
  );
}

function CassetteRow({ project, isSelected, onClick, reduceMotion }) {
  const { t } = useTranslation();
  const dotColor = categoryColor(project.category);
  const shortTitle = t(`project.${project.slug}.shortTitle`, {
    defaultValue: project.shortTitle,
  });
  const title = t(`project.${project.slug}.title`, { defaultValue: project.title });
  return (
    <Motion.button
      onClick={() => onClick(project.id)}
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
      aria-label={t(isSelected ? 'shelf.tapeAriaSelected' : 'shelf.tapeAria', { title })}
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
        <div style={{ flexShrink: 0 }}>
          <SpinningReel size={36} duration={5} reduceMotion={reduceMotion} />
        </div>

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
            {shortTitle}
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
        <div style={{ flexShrink: 0 }}>
          <SpinningReel size={36} duration={5} reduceMotion={reduceMotion} />
        </div>
      </div>
    </Motion.button>
  );
}

// Memoize: when one cassette is selected, only that cassette's row +
// the previously-selected row need to re-render (their `isSelected`
// changed). The other 14 don't — but without memo they all re-render
// on every parent state change, recomputing motion variants + animate
// targets each time. Memo cuts that.
const MemoCassetteRow = memo(CassetteRow);

function CassetteFront({ project, onClose, reduceMotion }) {
  const { t } = useTranslation();
  const title = t(`project.${project.slug}.title`, { defaultValue: project.title });
  const shortTitle = t(`project.${project.slug}.shortTitle`, {
    defaultValue: project.shortTitle,
  });
  const period = t(`project.${project.slug}.period`, { defaultValue: project.period });
  const category = t(`project.${project.slug}.category`, {
    defaultValue: project.category,
  });
  return (
    <Motion.div
      role="dialog"
      aria-modal="false"
      aria-label={t('shelf.previewAria', { title })}
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
          {category.toUpperCase()}
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
          {shortTitle}
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
          {period.toUpperCase()}
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
        <SpinningReelSvg cx={220} cy={360} r={62} duration={2.5} reduceMotion={reduceMotion} />
        <SpinningReelSvg cx={580} cy={360} r={62} duration={2.5} reduceMotion={reduceMotion} />

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
        aria-label={t('shelf.openProject', { title })}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
        {t('shelf.play')}
      </Link>

      {/* Close × */}
      <button
        onClick={onClose}
        aria-label={t('shelf.closePreview')}
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
    </Motion.div>
  );
}

function ProjectShelf() {
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const simplifyMotion = reduceMotion || isMobile;
  const [selectedId, setSelectedId] = useState(null);
  const selectedProject = projects.find((p) => p.id === selectedId) || null;

  // On mobile the shelf and the opened cassette swap places instead of
  // stacking: picking a tape hides the whole rack and shows just the
  // enlarged cassette + PLAY (no scrolling past 15 tapes to reach it);
  // closing it brings the rack back. Desktop keeps both columns side by side.
  const showList = !isMobile || !selectedProject;
  const showPanel = !isMobile || !!selectedProject;

  // The right panel mounts on demand on mobile (only when a tape is open).
  // Relying on the parent grid's whileInView="show" to propagate to a child
  // that mounts AFTER the gesture already fired (viewport once:true) is
  // unreliable — the child can stay stuck at the "hidden" opacity:0, so the
  // enlarged tape silently never appears (the intermittent "doesn't show up"
  // bug). On mobile, drive the panel's own fade so it always animates in;
  // desktop keeps the inherited staggered reveal alongside the cascade.
  const panelAnim = isMobile
    ? {
        initial: simplifyMotion ? false : { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
      }
    : {
        variants: {
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
        },
      };

  // Stable click handler so memoized cassettes don't re-render on every
  // parent render just because the callback identity changed.
  const handleSelect = useCallback((id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <Motion.div
      initial={simplifyMotion ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
      }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 1fr) minmax(0, 1.4fr)',
        gap: 'clamp(2rem, 4vw, 4rem)',
        alignItems: 'start',
        marginTop: 'clamp(2.5rem, 5vh, 4rem)',
      }}
      className="project-shelf-grid"
    >
      {/* LEFT: cassettes are slotted onto the rack as a single vertical
          column. Each tape slides in from the left with a small angular
          kick — reads as physical handling, not opacity fade. */}
      {showList && (
      <Motion.div
        role="list"
        aria-label={t('shelf.rackLabel')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(0.5rem, 1vh, 0.85rem)',
          minWidth: 0,
        }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06 } },
        }}
      >
        {projects.map((p) => (
          <Motion.div
            key={p.id}
            role="listitem"
            style={{ minWidth: 0, transformOrigin: 'left center' }}
            variants={{
              hidden: { opacity: 0, x: -22, y: -6, rotate: -1.4 },
              show: {
                opacity: 1,
                x: 0,
                y: 0,
                rotate: 0,
                transition: { duration: 0.62, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            <MemoCassetteRow
              project={p}
              isSelected={selectedId === p.id}
              onClick={handleSelect}
              reduceMotion={simplifyMotion}
            />
          </Motion.div>
        ))}
      </Motion.div>
      )}

      {/* RIGHT: active cassette panel — fades in alongside the cascade */}
      {showPanel && (
      <Motion.div
        {...panelAnim}
        style={{
          minHeight: 360,
          minWidth: 0,
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
              reduceMotion={simplifyMotion}
            />
          ) : (
            <Motion.div
              key="placeholder"
              initial={simplifyMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={simplifyMotion ? undefined : { opacity: 0 }}
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
                  color: 'var(--accent-deep)',
                  fontSize: 'clamp(0.7rem, 0.85vw, 0.8rem)',
                  letterSpacing: '0.22em',
                  marginBottom: 12,
                }}
              >
                {t('shelf.pickATape')}
              </p>
              <p
                style={{
                  color: 'var(--text)',
                  fontSize: 'clamp(0.92rem, 1.05vw, 1.05rem)',
                  lineHeight: 1.55,
                }}
              >
                {t('shelf.placeholder')}
              </p>
            </Motion.div>
          )}
        </AnimatePresence>
      </Motion.div>
      )}

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
    </Motion.div>
  );
}

export default ProjectShelf;
