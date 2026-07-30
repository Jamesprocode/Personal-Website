import { useRef } from 'react';
import { motion as Motion, useReducedMotion, useScroll } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ProjectShelf from './ProjectShelf';
import ProjectsPainterlyBackground from './ProjectsPainterlyBackground';
import useOffscreenPause from '../../hooks/useOffscreenPause';
import useIsMobile from '../../hooks/useIsMobile';
import { isMotionEffectDisabled } from '../../performance/motionDebug';

function ProjectsSection() {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const simplifyMotion = reduceMotion || isMobile;
  const disableScroll = isMotionEffectDisabled('scroll');
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
      data-snap-section
      data-offscreen-skip
      data-isolate
      className="relative overflow-hidden"
      style={{
        width: '100%',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Feathered edges: the alternating ground melts into the page base
        // (var(--bg)) over the first/last ~260px instead of butting against
        // it with a hard horizontal seam. Combined with the now-barely-there
        // --bg/--bg-alt contrast, the boundary reads as a slow tonal swell
        // rather than a divider. No hairline border — the feather alone is
        // the transition, so there's no hard line to mark the seam.
        background:
          'linear-gradient(to bottom, var(--bg) 0%, var(--bg-alt) 260px, var(--bg-alt) calc(100% - 260px), var(--bg) 100%)',
        paddingTop: 'clamp(5.5rem, 10vh, 8rem)',
        paddingBottom: 'clamp(5.5rem, 10vh, 8rem)',
        scrollMarginTop: '4rem',
      }}
    >
      {inView && (
        <ProjectsPainterlyBackground
          reduceMotion={simplifyMotion || disableScroll}
          scrollYProgress={scrollYProgress}
        />
      )}
      <div className="relative z-10"
        style={{
          width: '100%',
          maxWidth: 'min(82rem, 92vw)',
          paddingLeft: 'clamp(1.5rem, 6vw, 5rem)',
          paddingRight: 'clamp(1.5rem, 6vw, 5rem)',
        }}
      >
        <Motion.div
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.18 } },
          }}
          className="grid grid-cols-12 gap-x-[clamp(2rem,5vw,5rem)] gap-y-4 items-center"
        >
          <Motion.h2
            className="col-span-12 lg:col-span-7 font-bold tracking-tight"
            style={{
              color: 'var(--text-strong)',
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
          </Motion.h2>
          <Motion.p
            className="col-span-12 lg:col-span-5"
            style={{
              color: 'var(--text)',
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
          </Motion.p>
        </Motion.div>

        <ProjectShelf />
        <div id="research-projects-bottom" aria-hidden style={{ scrollMarginBottom: '4rem' }} />
      </div>
    </section>
  );
}

export default ProjectsSection;
