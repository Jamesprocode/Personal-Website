import { motion as Motion, useReducedMotion, useScroll } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ContactPainterlyBackground from './ContactPainterlyBackground';
import useOffscreenPause from '../../hooks/useOffscreenPause';

function ContactSection() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  // Pause Contact's halo + ring transforms when the section is off-screen.
  const inView = useOffscreenPause(sectionRef);

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
        backgroundColor: 'var(--bg)',
        paddingTop: 'clamp(4rem, 8vh, 6.5rem)',
        paddingBottom: 'clamp(7rem, 12vh, 10rem)',
        paddingLeft: 'clamp(1.5rem, 6vw, 5rem)',
        paddingRight: 'clamp(1.5rem, 6vw, 5rem)',
      }}
    >
      {inView && (
        <ContactPainterlyBackground reduceMotion={reduceMotion} scrollYProgress={scrollYProgress} />
      )}
      <Motion.div
        initial={reduceMotion ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.2, delayChildren: 0.05 } },
        }}
        className="relative z-10 text-center"
        style={{ width: '100%', maxWidth: '52ch' }}
      >
        <Motion.p
          style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.45rem)', lineHeight: 1.45, fontWeight: 500, color: 'var(--text-strong)' }}
          variants={{
            hidden: { opacity: 0, y: 16 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          {t('contact.lead')}
        </Motion.p>
        <Motion.a
          href="mailto:jameswangjiayi@gmail.com"
          className="inline-block mt-[clamp(0.75rem,1.5vh,1.25rem)] transition-colors duration-200 font-medium underline-offset-[6px]"
          style={{
            fontSize: 'clamp(1.05rem, 1.6vw, 1.45rem)',
            textDecoration: 'underline',
            color: 'var(--accent-deep)',
            textDecorationColor: 'var(--border-strong)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--accent-deep)')}
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          jameswangjiayi@gmail.com
        </Motion.a>
      </Motion.div>
    </section>
  );
}

export default ContactSection;
