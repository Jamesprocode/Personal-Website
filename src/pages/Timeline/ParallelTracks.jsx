import { motion, useReducedMotion } from 'framer-motion';
import { useState, useMemo } from 'react';
import timeline from '../../data/timeline';

const TRACKS = [
  { key: 'Research', label: 'Research', color: '#22c55e' },
  { key: 'Music Software', label: 'Music Software', color: '#a855f7' },
  { key: 'Music', label: 'Music', color: '#f97316' },
  { key: 'Industry', label: 'Industry', color: '#6b7280' },
];

const START_YEAR = 2020;
const END_YEAR = 2026;
const YEAR_SPAN = END_YEAR - START_YEAR;

function ParallelTracks() {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(null);

  const trackData = useMemo(() => {
    return TRACKS.map((track) => {
      const entries = timeline.filter((e) => e.category === track.key);
      const groupedByYear = {};
      entries.forEach((e) => {
        const k = e.year;
        if (!groupedByYear[k]) groupedByYear[k] = [];
        groupedByYear[k].push(e);
      });

      const placed = [];
      Object.keys(groupedByYear).forEach((y) => {
        const group = groupedByYear[y];
        const yearNum = Number(y);
        group.forEach((entry, idx) => {
          const offsetWithinYear = group.length === 1 ? 0.5 : (idx + 0.5) / group.length;
          const cellSpan = 0.7;
          const cellStart = (1 - cellSpan) / 2;
          const xFrac = (yearNum - START_YEAR + cellStart + offsetWithinYear * cellSpan) / YEAR_SPAN;
          placed.push({ ...entry, xFrac });
        });
      });
      return { ...track, dots: placed };
    });
  }, []);

  return (
    <section
      className="relative"
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 'clamp(2rem, 4vh, 3rem)',
        paddingBottom: 'clamp(3rem, 6vh, 5rem)',
      }}
      aria-label="Four parallel tracks: research, music software, music, industry, from 2020 to present"
    >
      <div
        style={{
          width: '100%',
          maxWidth: 'min(82rem, 92vw)',
          paddingLeft: 'clamp(1.5rem, 6vw, 5rem)',
          paddingRight: 'clamp(1.5rem, 6vw, 5rem)',
        }}
      >
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-[clamp(1rem,2vw,2rem)] gap-y-2 mb-[clamp(1.5rem,3vh,2.5rem)]">
          {TRACKS.map((t) => (
            <div key={t.key} className="flex items-center gap-2">
              <span
                className="rounded-full"
                style={{ width: 8, height: 8, backgroundColor: t.color }}
                aria-hidden
              />
              <span
                className="text-amber-900/75 font-mono uppercase"
                style={{ fontSize: 'clamp(0.65rem, 0.8vw, 0.75rem)', letterSpacing: '0.15em' }}
              >
                {t.label}
              </span>
            </div>
          ))}
        </div>

        {/* Bands */}
        <div className="relative" role="figure" aria-label="Career tracks running in parallel from 2020 to present">
          {trackData.map((track, trackIdx) => (
            <motion.div
              key={track.key}
              initial={reduceMotion ? false : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: trackIdx * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative grid items-center"
              style={{
                gridTemplateColumns: 'minmax(110px, 14ch) 1fr',
                gap: 'clamp(1rem, 2.5vw, 2.5rem)',
                paddingTop: 'clamp(1.25rem, 2.5vh, 2rem)',
                paddingBottom: 'clamp(1.25rem, 2.5vh, 2rem)',
                borderTop: trackIdx === 0 ? '1px solid rgba(108, 92, 59, 0.18)' : 'none',
                borderBottom: '1px solid rgba(108, 92, 59, 0.18)',
              }}
            >
              <p
                className="text-amber-900 font-medium"
                style={{ fontSize: 'clamp(0.85rem, 1.1vw, 1rem)' }}
              >
                {track.label}
              </p>

              <div className="relative" style={{ height: 'clamp(48px, 7vh, 72px)' }}>
                {/* Spine */}
                <div
                  className="absolute left-0 right-0 top-1/2 -translate-y-1/2"
                  style={{
                    height: '1px',
                    background: 'rgba(108, 92, 59, 0.2)',
                  }}
                  aria-hidden
                />

                {/* Dots */}
                {track.dots.map((dot) => {
                  const isActive = hovered && hovered.id === dot.id;
                  return (
                    <button
                      key={dot.id}
                      type="button"
                      onMouseEnter={() => setHovered(dot)}
                      onMouseLeave={() => setHovered((h) => (h && h.id === dot.id ? null : h))}
                      onFocus={() => setHovered(dot)}
                      onBlur={() => setHovered((h) => (h && h.id === dot.id ? null : h))}
                      className="absolute top-1/2 rounded-full transition-transform duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#efe3c9]"
                      style={{
                        left: `${dot.xFrac * 100}%`,
                        transform: `translate(-50%, -50%) scale(${isActive ? 1.6 : 1})`,
                        width: 'clamp(10px, 1vw, 14px)',
                        height: 'clamp(10px, 1vw, 14px)',
                        backgroundColor: track.color,
                        opacity: hovered && !isActive ? 0.35 : 0.92,
                        boxShadow: isActive ? `0 6px 18px ${track.color}66` : 'none',
                      }}
                      aria-label={`${dot.title}, ${dot.year}`}
                    />
                  );
                })}
              </div>
            </motion.div>
          ))}

          {/* Year axis */}
          <div
            className="grid mt-[clamp(0.75rem,1.5vh,1.25rem)]"
            style={{
              gridTemplateColumns: 'minmax(110px, 14ch) 1fr',
              gap: 'clamp(0.75rem, 2vw, 2rem)',
            }}
            aria-hidden
          >
            <div />
            <div className="relative" style={{ height: '1.5em' }}>
              {Array.from({ length: YEAR_SPAN + 1 }).map((_, i) => {
                const year = START_YEAR + i;
                const xFrac = i / YEAR_SPAN;
                return (
                  <span
                    key={year}
                    className="absolute top-0 font-mono text-amber-700/65"
                    style={{
                      left: `${xFrac * 100}%`,
                      transform: 'translateX(-50%)',
                      fontSize: 'clamp(0.7rem, 0.85vw, 0.8rem)',
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

        {/* Tooltip / readout */}
        <div
          className="mt-[clamp(1.5rem,3vh,2.5rem)] min-h-[3.5rem] text-center"
          aria-live="polite"
        >
          {hovered ? (
            <motion.div
              key={hovered.id}
              initial={reduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-baseline gap-3 flex-wrap justify-center"
            >
              <span
                className="font-mono uppercase tracking-[0.18em] text-amber-700/80"
                style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.8rem)' }}
              >
                {hovered.year} · {hovered.category}
              </span>
              <span
                className="text-amber-900 font-medium"
                style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)' }}
              >
                {hovered.title}
              </span>
            </motion.div>
          ) : (
            <p
              className="text-amber-700/55 italic"
              style={{ fontSize: 'clamp(0.9rem, 1.1vw, 1rem)' }}
            >
              Hover a mark to read its entry.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default ParallelTracks;
