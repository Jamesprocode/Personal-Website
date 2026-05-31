import { useRef } from 'react';
import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ProjectShelf from './ProjectShelf';
import ProjectsPainterlyBackground from './ProjectsPainterlyBackground';
import useOffscreenPause from '../../hooks/useOffscreenPause';

const INK_DEEP = '#2d2d2d';
const WALNUT = '#4a3f35';

function ProjectsSection() {
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  // Pauses the halo / corner / track-pulse CSS animations the moment the
  // section scrolls off screen, and gates whether the painterly bg even
  // mounts. The painterly SVG carries ~40 elements; not rendering it
  // while offscreen drops idle DOM weight and lets the React tree go
  // smaller for offscreen sections.
  const inView = useOffscreenPause(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="research-projects-top"
      data-offscreen-skip
      data-isolate
      className="relative overflow-hidden"
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#efe3c9',
        borderTop: '1px solid rgba(108, 92, 59, 0.16)',
        paddingTop: 'clamp(2.5rem, 5vh, 4rem)',
        paddingBottom: 'clamp(7rem, 14vh, 12rem)',
        scrollMarginTop: '4rem',
      }}
    >
      {inView && (
        <ProjectsPainterlyBackground reduceMotion={reduceMotion} scrollYProgress={scrollYProgress} />
      )}
      <div className="relative z-10"
        style={{
          width: '100%',
          maxWidth: 'min(82rem, 92vw)',
          paddingLeft: 'clamp(1.5rem, 6vw, 5rem)',
          paddingRight: 'clamp(1.5rem, 6vw, 5rem)',
        }}
      >
        <motion.div
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.18 } },
          }}
          className="grid grid-cols-12 gap-x-[clamp(2rem,5vw,5rem)] gap-y-4 items-center"
        >
          <motion.h2
            className="col-span-12 lg:col-span-7 font-bold tracking-tight"
            style={{
              color: INK_DEEP,
              fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
              lineHeight: 1.05,
              margin: 0,
            }}
            variants={{
              hidden: { opacity: 0, y: 22 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            {t('projects.heading')}
          </motion.h2>
          <motion.p
            className="col-span-12 lg:col-span-5"
            style={{
              color: `${WALNUT}b3`,
              fontSize: 'clamp(0.95rem, 1.15vw, 1.15rem)',
              lineHeight: 1.55,
              maxWidth: '42ch',
              margin: 0,
            }}
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            {t('projects.subtitle')}
          </motion.p>
        </motion.div>

        <ProjectShelf />
        <div id="research-projects-bottom" aria-hidden style={{ scrollMarginBottom: '4rem' }} />
      </div>
    </section>
  );
}

export default ProjectsSection;
