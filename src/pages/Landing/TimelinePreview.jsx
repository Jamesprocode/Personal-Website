import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import timeline from '../../data/timeline';

const TRACKS = [
  { key: 'Academic', color: '#3b82f6' },
  { key: 'Internships', color: '#6b7280' },
  { key: 'Music Performance', color: '#f97316' },
];

const START_YEAR = 2020;
const END_YEAR = 2026;
const YEAR_SPAN = END_YEAR - START_YEAR;

function TimelinePreview() {
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation();

  const trackData = useMemo(() => {
    return TRACKS.map((track) => {
      const entries = timeline.filter((e) => e.category === track.key);
      const grouped = {};
      entries.forEach((e) => {
        if (!grouped[e.year]) grouped[e.year] = [];
        grouped[e.year].push(e);
      });

      const dots = [];
      Object.keys(grouped).forEach((y) => {
        const group = grouped[y];
        const yearNum = Number(y);
        group.forEach((entry, idx) => {
          const offsetWithinYear = group.length === 1 ? 0.5 : (idx + 0.5) / group.length;
          const cellSpan = 0.7;
          const cellStart = (1 - cellSpan) / 2;
          const xFrac = (yearNum - START_YEAR + cellStart + offsetWithinYear * cellSpan) / YEAR_SPAN;
          dots.push({ id: entry.id, xFrac });
        });
      });

      return { ...track, dots };
    });
  }, []);

  return (
    <section
      className="relative"
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#efe3c9',
        paddingTop: 'clamp(6rem, 12vh, 10rem)',
        paddingBottom: 'clamp(6rem, 12vh, 10rem)',
      }}
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%',
          maxWidth: 'min(72rem, 92vw)',
          paddingLeft: 'clamp(1.5rem, 6vw, 5rem)',
          paddingRight: 'clamp(1.5rem, 6vw, 5rem)',
        }}
      >
        <div className="grid grid-cols-12 gap-x-[clamp(2rem,5vw,5rem)] gap-y-[clamp(2rem,4vh,3rem)] items-center">
          {/* LEFT: framing copy + CTA */}
          <div className="col-span-12 lg:col-span-5">
            <h2
              className="font-bold tracking-tight text-amber-900"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', lineHeight: 1.05 }}
            >
              {t('timelinePreview.heading')}
            </h2>
            <p
              className="mt-[clamp(1rem,2vh,1.5rem)] text-amber-900/70"
              style={{ fontSize: 'clamp(0.95rem, 1.15vw, 1.1rem)', maxWidth: '34ch', lineHeight: 1.55 }}
            >
              {t('timelinePreview.bio')}
            </p>
            <Link
              to="/timeline"
              className="inline-flex items-center gap-2 mt-[clamp(1.5rem,3vh,2.25rem)] bg-amber-900 hover:bg-stone-900 text-amber-50 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#efe3c9]"
              style={{
                padding: 'clamp(0.65rem, 1vw, 0.9rem) clamp(1.4rem, 2.2vw, 2rem)',
                fontSize: 'clamp(0.85rem, 1vw, 0.95rem)',
                fontWeight: 500,
                letterSpacing: '0.02em',
              }}
            >
              {t('timelinePreview.cta')}
              <span aria-hidden>&rarr;</span>
            </Link>
          </div>

          {/* RIGHT: faint preview of the four tracks */}
          <div
            className="col-span-12 lg:col-span-7"
            aria-hidden
          >
            <div className="relative">
              {trackData.map((track, trackIdx) => (
                <div
                  key={track.key}
                  className="relative"
                  style={{
                    height: 'clamp(32px, 5vh, 44px)',
                    borderTop: trackIdx === 0 ? '1px solid rgba(108, 92, 59, 0.16)' : 'none',
                    borderBottom: '1px solid rgba(108, 92, 59, 0.16)',
                  }}
                >
                  <div
                    className="absolute left-0 right-0 top-1/2 -translate-y-1/2"
                    style={{ height: '1px', background: 'rgba(108, 92, 59, 0.18)' }}
                  />
                  {track.dots.map((dot, dotIdx) => (
                    <span
                      key={`${track.key}-${dot.id}-${dotIdx}`}
                      className="absolute top-1/2 rounded-full"
                      style={{
                        left: `${dot.xFrac * 100}%`,
                        transform: 'translate(-50%, -50%)',
                        width: 'clamp(8px, 0.85vw, 11px)',
                        height: 'clamp(8px, 0.85vw, 11px)',
                        backgroundColor: track.color,
                        opacity: 0.55,
                      }}
                    />
                  ))}
                </div>
              ))}

              {/* Year axis */}
              <div className="relative mt-[clamp(0.5rem,1vh,0.85rem)]" style={{ height: '1.4em' }}>
                {Array.from({ length: YEAR_SPAN + 1 }).map((_, i) => {
                  const year = START_YEAR + i;
                  const xFrac = i / YEAR_SPAN;
                  return (
                    <span
                      key={year}
                      className="absolute top-0 font-mono text-amber-700/60"
                      style={{
                        left: `${xFrac * 100}%`,
                        transform: 'translateX(-50%)',
                        fontSize: 'clamp(0.65rem, 0.78vw, 0.78rem)',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {year}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default TimelinePreview;
