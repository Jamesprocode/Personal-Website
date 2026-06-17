import { useEffect, useRef, useState } from 'react';
import { motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeroPortraitCarousel from './HeroPortraitCarousel';
import HeroPainterlyBackground from './HeroPainterlyBackground';
import useOffscreenPause from '../../hooks/useOffscreenPause';
import useIsMobile from '../../hooks/useIsMobile';

function HeroSection() {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const simplifyMotion = reduceMotion || isMobile;
  const { t } = useTranslation();
  const titleMiddle = t('hero.titleMiddle');
  const titleLast = t('hero.titleLast');
  const sectionRef = useRef(null);
  // Pauses the cream-bloom + amber-hot breath animations whenever the hero
  // scrolls out of view. Without this they keep compositing every frame
  // even while the user is reading Projects further down.
  useOffscreenPause(sectionRef);
  // `inView` mirrors the offscreen pause for the framer-motion `animate`
  // props on the painterly bg (framer drives those from JS rAF, so they
  // ignore CSS animation-play-state and need an explicit gate).
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '15% 0px 15% 0px', threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  // Tracks scroll from "hero top hits viewport top" to "hero bottom leaves
  // viewport top" — scrollYProgress runs 0 → 1 as you scroll through the hero.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Scroll-linked motion for the matted portrait. As the user scrolls, the
  // photo drifts gently upward and rotates a half-degree, like a polaroid
  // held in an unsteady hand. Title column drifts at a slightly different
  // rate so the two layers parallax against each other.
  const portraitY = useTransform(scrollYProgress, [0, 1], simplifyMotion ? [0, 0] : [0, -64]);
  const portraitRotate = useTransform(scrollYProgress, [0, 1], simplifyMotion ? [0, 0] : [0, -1.6]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], simplifyMotion ? [1, 1] : [1, 0.96]);
  const textY = useTransform(scrollYProgress, [0, 1], simplifyMotion ? [0, 0] : [0, -28]);

  return (
    <section
      ref={sectionRef}
      data-snap-section
      className="relative overflow-hidden"
      style={{
        width: '100%',
        // 100svh = small viewport height — accounts for mobile address
        // bar so the hero is exactly one screen on landing.
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 'clamp(7rem, 14vh, 11rem)',
        paddingBottom: 'clamp(3rem, 6vh, 5rem)',
        // Page base — cream in light, espresso in dark (theme token).
        background: 'var(--bg)',
      }}
    >
      <HeroPainterlyBackground reduceMotion={simplifyMotion} scrollYProgress={scrollYProgress} inView={inView} />

      <div
        className="relative z-10"
        style={{
          width: '100%',
          maxWidth: 'min(82rem, 92vw)',
          paddingLeft: 'clamp(1.5rem, 6vw, 5rem)',
          paddingRight: 'clamp(1.5rem, 6vw, 5rem)',
        }}
      >
        <Motion.div
          // Patient cinematic choreography for the Landing hero. The whole
          // grid is one orchestrated entrance: name → brass hairline sweep
          // → bio → CTAs. Photo materializes on its own beat. ease-out-expo
          // throughout; collapses to instant under prefers-reduced-motion.
          className="grid grid-cols-12 gap-x-[clamp(2rem,6vw,6rem)] gap-y-[clamp(4rem,7vh,6rem)] items-center"
          initial={reduceMotion ? false : 'hidden'}
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                delayChildren: 0.1,
                staggerChildren: 0.18,
              },
            },
          }}
        >
          {/* LEFT: type column — children share the parent's stagger, and
              the whole column drifts upward with scroll for parallax. */}
          <Motion.div
            className="col-span-12 lg:col-span-7 order-2 lg:order-1"
            style={{ y: textY }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.18,
                },
              },
            }}
          >
            <Motion.h1
              className="font-bold tracking-[-0.025em] leading-[1.04]"
              style={{ fontSize: 'clamp(2.25rem, 8vw, 7rem)', marginBottom: '0.25em', color: 'var(--text-strong)' }}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {t('hero.titleFirst')}
              {titleMiddle && (
                <span
                  className="font-normal"
                  style={{ fontSize: '0.5em', letterSpacing: '-0.01em', verticalAlign: '0.18em', color: 'var(--accent)' }}
                >
                  {' '}{titleMiddle}{' '}
                </span>
              )}
              {titleLast && <>{' '}{titleLast}</>}
            </Motion.h1>

            {/* Brass hairline — sweeps in from the left like a wipe. */}
            <Motion.div
              className="my-[clamp(4rem,8vh,6rem)]"
              data-prototype-hairline
              style={{
                height: '1px',
                width: 'clamp(60px, 8vw, 96px)',
                transformOrigin: 'left center',
                backgroundColor: 'var(--border-strong)',
              }}
              variants={{
                hidden: { opacity: 0, scaleX: 0 },
                show: {
                  opacity: 1,
                  scaleX: 1,
                  transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            />

            <Motion.p
              style={{
                fontSize: 'clamp(1rem, 1.35vw, 1.3rem)',
                lineHeight: 2,
                maxWidth: '52ch',
                fontWeight: 400,
                letterSpacing: '0.01em',
                color: 'var(--text)',
              }}
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {t('hero.bio')}
            </Motion.p>

            <Motion.div
              className="flex flex-wrap gap-[clamp(1.25rem,2vw,2rem)] mt-[clamp(4.5rem,9vh,6.5rem)] items-center"
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]"
                style={{
                  backgroundColor: 'var(--btn-bg)',
                  color: 'var(--btn-text)',
                  padding: 'clamp(0.75rem, 1.05vw, 0.95rem) clamp(1.5rem, 2.3vw, 2rem)',
                  fontSize: 'clamp(0.88rem, 1vw, 0.95rem)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 6px 16px -6px rgba(196,162,101,0.5)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--btn-bg-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--btn-bg)')}
              >
                {t('hero.downloadCv')}
              </a>
              <Link
                to="/music"
                className="inline-flex items-center gap-2 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]"
                style={{
                  color: 'var(--accent)',
                  padding: 'clamp(0.75rem, 1.05vw, 0.95rem) clamp(1.2rem, 1.8vw, 1.6rem)',
                  fontSize: 'clamp(0.88rem, 1vw, 0.95rem)',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-bright)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--accent)')}
              >
                {t('hero.listenToMusic')}
                <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]"
                style={{
                  color: 'var(--text-strong)',
                  border: '1px solid var(--border-strong)',
                  padding: 'clamp(0.75rem, 1.05vw, 0.95rem) clamp(1.2rem, 1.8vw, 1.6rem)',
                  fontSize: 'clamp(0.88rem, 1vw, 0.95rem)',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent-bright)';
                  e.currentTarget.style.borderColor = 'var(--accent-bright)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-strong)';
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                }}
              >
                {t('hero.contact')}
                <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">&darr;</span>
              </a>
            </Motion.div>
          </Motion.div>

          {/* RIGHT: photo — materializes like film coming into focus, on
              its own beat right after the H1 reveals. */}
          <Motion.div
            className="col-span-12 lg:col-span-5 order-1 lg:order-2 flex flex-col items-center lg:items-end"
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              show: {
                opacity: 1,
                scale: 1,
                transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            <Motion.div
              className="relative"
              style={{
                width: 'clamp(250px, 33vw, 460px)',
                y: portraitY,
                rotate: portraitRotate,
                scale: portraitScale,
                transformOrigin: '60% 80%',
                willChange: 'transform',
              }}
            >
              {/* Cream paper mat with a thin brass keyline. The photo sits
                  inside the mat so the hard rectangle dissolves into the
                  parlor's warmth instead of punching through it. */}
              <div
                className="relative"
                style={{
                  aspectRatio: '1 / 1',
                  padding: 'clamp(10px, 1.4vw, 16px)',
                  borderRadius: '22%',
                  backgroundColor: '#fdf4dc',
                  border: '1px solid rgba(160, 111, 29, 0.35)',
                  boxShadow: '0 30px 64px -22px rgba(120, 70, 20, 0.42), inset 0 1px 0 rgba(255, 247, 220, 0.8)',
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: '1 / 1', borderRadius: '16%' }}
                >
                  {/* Slide-tray of James at work: jazz sax, the control room,
                      the podium, the person. Cross-fades on its own slow beat,
                      swipe / arrow-key to move by hand. Replaces the single
                      matted portrait so the hero argues the multi-hyphenate
                      instead of asserting it. */}
                  <HeroPortraitCarousel reduceMotion={reduceMotion} />
                </div>
              </div>
            </Motion.div>
          </Motion.div>
        </Motion.div>

      </div>
    </section>
  );
}

export default HeroSection;
