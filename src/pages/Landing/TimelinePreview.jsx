import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import timeline from '../../data/timeline';
import TimelinePainterlyBackground from './TimelinePainterlyBackground';
import useOffscreenPause from '../../hooks/useOffscreenPause';

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
  const sectionRef = useRef(null);
  // Active range: from when the section first appears at the bottom of
  // the viewport (playhead at 2020) to when it leaves the top (playhead
  // at 2026). Matches the other section painterlies.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  // Skip painting + pause descendant animations while off-screen so the
  // section doesn't compete with whichever section the user is reading.
  const inView = useOffscreenPause(sectionRef);

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
      ref={sectionRef}
      data-offscreen-skip
      data-isolate
      className="relative overflow-hidden"
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#efe3c9',
        paddingTop: 'clamp(8rem, 18vh, 14rem)',
        paddingBottom: 'clamp(8rem, 18vh, 14rem)',
      }}
    >
      {inView && (
        <TimelinePainterlyBackground reduceMotion={reduceMotion} scrollYProgress={scrollYProgress} />
      )}
      <motion.div
        initial={reduceMotion ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="relative z-10"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
        }}
        style={{
          width: '100%',
          maxWidth: 'min(72rem, 92vw)',
          paddingLeft: 'clamp(1.5rem, 6vw, 5rem)',
          paddingRight: 'clamp(1.5rem, 6vw, 5rem)',
        }}
      >
        <div className="grid grid-cols-12 gap-x-[clamp(2rem,5vw,5rem)] gap-y-[clamp(2rem,4vh,3rem)] items-center">
          {/* LEFT: framing copy + CTA cascade */}
          <motion.div
            className="col-span-12 lg:col-span-5"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.16 } },
            }}
          >
            <motion.h2
              className="font-bold tracking-tight text-amber-900"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', lineHeight: 1.05 }}
              variants={{
                hidden: { opacity: 0, y: 22 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {t('timelinePreview.heading')}
            </motion.h2>
            <motion.p
              className="mt-[clamp(1rem,2vh,1.5rem)] text-amber-900/70"
              style={{ fontSize: 'clamp(0.95rem, 1.15vw, 1.1rem)', maxWidth: '34ch', lineHeight: 1.55 }}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {t('timelinePreview.bio')}
            </motion.p>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              style={{ marginTop: 'clamp(1.5rem,3vh,2.25rem)' }}
            >
              <Link
                to="/timeline"
                className="inline-flex items-center gap-2 bg-amber-900 hover:bg-stone-900 text-amber-50 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#efe3c9]"
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
            </motion.div>
          </motion.div>

          {/* RIGHT: tracks draw left→right as one phrase. Tighter parent
              stagger (0.22 s) means the lines overlap their wipes rather
              than waiting their turn — reads as one continuous gesture
              instead of three sequential ones. Each line's wipe duration
              varies by track depth (deeper brass = slower/heavier). */}
          <motion.div
            className="col-span-12 lg:col-span-7"
            aria-hidden
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.22, delayChildren: 0.08 } },
            }}
          >
            <div className="relative">
              {trackData.map((track, trackIdx) => {
                // Track-indexed timing: index 0 is heavier brass (drawn
                // slower) and indexes 1/2 are lighter (drawn quicker), so
                // the three lines sweep in a rounded crescendo.
                const lineDuration = [1.05, 0.9, 0.78][trackIdx] ?? 0.9;
                const dotsDelay = [0.62, 0.5, 0.42][trackIdx] ?? 0.5;
                return (
                <motion.div
                  key={track.key}
                  className="relative"
                  style={{
                    height: 'clamp(32px, 5vh, 44px)',
                    borderTop: trackIdx === 0 ? '1px solid rgba(108, 92, 59, 0.16)' : 'none',
                    borderBottom: '1px solid rgba(108, 92, 59, 0.16)',
                  }}
                  variants={{
                    hidden: {},
                    show: {},
                  }}
                >
                  {/* Horizontal track line — wipes left to right */}
                  <motion.div
                    className="absolute left-0 right-0 top-1/2 -translate-y-1/2"
                    style={{
                      height: '1px',
                      background: 'rgba(108, 92, 59, 0.18)',
                      transformOrigin: 'left center',
                    }}
                    variants={{
                      hidden: { scaleX: 0, opacity: 0 },
                      show: {
                        scaleX: 1,
                        opacity: 1,
                        transition: { duration: lineDuration, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                  />
                  {/* Dots cluster — cascades in after the line wipes.
                      A small y-bloom (3 px → 0) makes each dot feel like
                      it lands on the line rather than fading in flat. */}
                  <motion.div
                    style={{ position: 'absolute', inset: 0 }}
                    variants={{
                      hidden: {},
                      show: {
                        transition: { staggerChildren: 0.045, delayChildren: dotsDelay },
                      },
                    }}
                  >
                    {track.dots.map((dot, dotIdx) => (
                      <motion.span
                        key={`${track.key}-${dot.id}-${dotIdx}`}
                        className="absolute top-1/2 rounded-full"
                        style={{
                          left: `${dot.xFrac * 100}%`,
                          width: 'clamp(10px, 1.5vw, 14px)',
                          height: 'clamp(10px, 1.5vw, 14px)',
                          backgroundColor: track.color,
                          boxShadow: '0 1px 2px rgba(74, 46, 10, 0.18)',
                        }}
                        variants={{
                          hidden: { opacity: 0, scale: 0.35, x: '-50%', y: 'calc(-50% - 3px)' },
                          show: {
                            opacity: 0.62,
                            scale: 1,
                            x: '-50%',
                            y: '-50%',
                            transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
                          },
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
                );
              })}

              {/* Year axis — fades in last, after the tracks have drawn */}
              <motion.div
                className="relative mt-[clamp(0.5rem,1vh,0.85rem)]"
                style={{ height: '1.4em' }}
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
              >
                {Array.from({ length: YEAR_SPAN + 1 }).map((_, i) => {
                  const year = START_YEAR + i;
                  const xFrac = i / YEAR_SPAN;
                  // Anchor the first label to its left edge and the last to
                  // its right edge so they don't overflow the track horizontally.
                  const tx = i === 0 ? '0%' : i === YEAR_SPAN ? '-100%' : '-50%';
                  return (
                    <span
                      key={year}
                      className="absolute top-0 font-mono text-amber-700/60"
                      style={{
                        left: `${xFrac * 100}%`,
                        transform: `translateX(${tx})`,
                        fontSize: 'clamp(0.7rem, 0.78vw, 0.85rem)',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {year}
                    </span>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default TimelinePreview;
