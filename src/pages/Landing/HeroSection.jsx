import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import profileImg from '../../assets/me.JPG';
import HeroPainterlyBackground from './HeroPainterlyBackground';
import useOffscreenPause from '../../hooks/useOffscreenPause';

function HeroSection() {
  const reduceMotion = useReducedMotion();
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
  const portraitY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -64]);
  const portraitRotate = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -1.6]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1, 0.96]);
  const textY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -28]);

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
      }}
    >
      <HeroPainterlyBackground reduceMotion={reduceMotion} scrollYProgress={scrollYProgress} inView={inView} />

      <div
        className="relative z-10"
        style={{
          width: '100%',
          maxWidth: 'min(82rem, 92vw)',
          paddingLeft: 'clamp(1.5rem, 6vw, 5rem)',
          paddingRight: 'clamp(1.5rem, 6vw, 5rem)',
        }}
      >
        <motion.div
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
          <motion.div
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
            <motion.h1
              className="font-bold tracking-[-0.025em] text-amber-900 leading-[1.04]"
              style={{ fontSize: 'clamp(2.25rem, 8vw, 7rem)', marginBottom: '0.25em' }}
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
                  className="font-normal text-amber-900/55"
                  style={{ fontSize: '0.5em', letterSpacing: '-0.01em', verticalAlign: '0.18em' }}
                >
                  {' '}{titleMiddle}{' '}
                </span>
              )}
              {titleLast && <>{' '}{titleLast}</>}
            </motion.h1>

            {/* Brass hairline — sweeps in from the left like a wipe. */}
            <motion.div
              className="bg-amber-700/40 my-[clamp(4rem,8vh,6rem)]"
              style={{
                height: '1px',
                width: 'clamp(60px, 8vw, 96px)',
                transformOrigin: 'left center',
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

            <motion.p
              className="text-amber-900/85"
              style={{
                fontSize: 'clamp(1rem, 1.35vw, 1.3rem)',
                lineHeight: 2,
                maxWidth: '52ch',
                fontWeight: 400,
                letterSpacing: '0.01em',
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
            </motion.p>

            <motion.div
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
                className="rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a265]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4e8d1]"
                style={{
                  backgroundColor: '#4a3f35',
                  color: '#f4e8d1',
                  padding: 'clamp(0.75rem, 1.05vw, 0.95rem) clamp(1.5rem, 2.3vw, 2rem)',
                  fontSize: 'clamp(0.88rem, 1vw, 0.95rem)',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2d2d2d')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4a3f35')}
              >
                {t('hero.downloadCv')}
              </a>
              <Link
                to="/music"
                className="inline-flex items-center gap-2 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a265]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4e8d1]"
                style={{
                  color: '#4a3f35',
                  padding: 'clamp(0.75rem, 1.05vw, 0.95rem) clamp(1.2rem, 1.8vw, 1.6rem)',
                  fontSize: 'clamp(0.88rem, 1vw, 0.95rem)',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#2d2d2d')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#4a3f35')}
              >
                {t('hero.listenToMusic')}
                <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT: photo — materializes like film coming into focus, on
              its own beat right after the H1 reveals. */}
          <motion.div
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
            <motion.div
              className="relative"
              style={{
                width: 'clamp(220px, 28vw, 380px)',
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
                  <img
                    src={profileImg}
                    alt={t('nav.brand')}
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Cream "vignette" — softens the photo's edges into the
                      mat instead of cutting hard against it. */}
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      boxShadow: 'inset 0 0 28px rgba(253, 244, 220, 0.55)',
                      borderRadius: '16%',
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}

export default HeroSection;
