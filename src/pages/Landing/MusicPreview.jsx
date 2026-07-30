import { motion as Motion, useReducedMotion, useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import albums from '../../data/albums';
import MusicPainterlyBackground from './MusicPainterlyBackground';
import useOffscreenPause from '../../hooks/useOffscreenPause';
import useIsMobile from '../../hooks/useIsMobile';
import { isMotionEffectDisabled } from '../../performance/motionDebug';

const tracks = albums.flatMap((a) => a.tracks);

function VinylDisc({ hovered, reduceMotion }) {
  // Using CSS animation directly instead of framer-motion's animate prop —
  // a nested motion.div inside the section's whileInView parent was
  // having its transform reset to identity. Pure CSS keyframes are
  // reliable here, and `prefers-reduced-motion` plus the inline
  // condition both gate the spin off appropriately.
  const spinDuration = hovered ? '6s' : '10s';
  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '1 / 1',
        animation: reduceMotion ? 'none' : `vinyl-spin ${spinDuration} linear infinite`,
      }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden>
        <defs>
          <radialGradient id="vinyl-disc" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a1410" />
            <stop offset="60%" stopColor="#0e0a08" />
            <stop offset="100%" stopColor="#1a1410" />
          </radialGradient>
          <radialGradient id="vinyl-label" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d4a868" />
            <stop offset="100%" stopColor="#a07530" />
          </radialGradient>
        </defs>

        <circle cx="100" cy="100" r="98" fill="url(#vinyl-disc)" />

        {Array.from({ length: 22 }).map((_, i) => (
          <circle
            key={i}
            cx="100"
            cy="100"
            r={36 + i * 2.6}
            fill="none"
            stroke="rgba(255, 220, 170, 0.05)"
            strokeWidth="0.4"
          />
        ))}

        <path
          d="M 30 80 A 80 80 0 0 1 110 22"
          fill="none"
          stroke="rgba(255, 220, 170, 0.12)"
          strokeWidth="1"
          strokeLinecap="round"
        />

        <circle cx="100" cy="100" r="34" fill="url(#vinyl-label)" />
        <circle cx="100" cy="100" r="34" fill="none" stroke="rgba(20,15,10,0.4)" strokeWidth="0.6" />

        <text
          x="100"
          y="92"
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontSize="6"
          fill="#1a1410"
          letterSpacing="0.2"
          fontWeight="600"
        >
          JAMES WANG
        </text>
        <text
          x="100"
          y="103"
          textAnchor="middle"
          fontFamily="Space Grotesk, sans-serif"
          fontSize="9"
          fontWeight="700"
          fill="#1a1410"
        >
          Side A
        </text>
        <text
          x="100"
          y="114"
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontSize="4.5"
          fill="rgba(26,20,16,0.7)"
          letterSpacing="0.3"
        >
          33⅓ RPM
        </text>

        <circle cx="100" cy="100" r="2.2" fill="#0a0806" />
      </svg>
    </div>
  );
}

function MusicPreview() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const simplifyMotion = reduceMotion || isMobile;
  const disableAmbient = isMotionEffectDisabled('ambient');
  const disableScroll = isMotionEffectDisabled('scroll');
  const [hovered, setHovered] = useState(false);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  // Pauses the vinyl-spin keyframe when the music section scrolls off
  // screen. The 10 s linear rotation was racking up Layerize cost during
  // Projects scrolling because the disc was still composited every frame.
  const inView = useOffscreenPause(sectionRef);

  const albumCount = albums.length;
  const trackCount = tracks.length;

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
        paddingTop: 'clamp(7rem, 14vh, 12rem)',
        paddingBottom: 'clamp(7rem, 14vh, 12rem)',
      }}
    >
      {inView && (
        <MusicPainterlyBackground
          reduceMotion={simplifyMotion}
          disableScroll={disableScroll}
          scrollYProgress={scrollYProgress}
        />
      )}

      <div
        className="relative z-10"
        style={{
          width: '100%',
          maxWidth: 'min(82rem, 92vw)',
          paddingLeft: 'clamp(1.5rem, 6vw, 5rem)',
          paddingRight: 'clamp(1.5rem, 6vw, 5rem)',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-[clamp(2rem,5vw,5rem)] gap-y-[clamp(3rem,6vh,5rem)] items-center">
          {/* LEFT: framing copy + CTA cascade in */}
          <Motion.div
            initial={reduceMotion ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.16, delayChildren: 0.05 } },
            }}
            className="col-span-1 lg:col-span-6 order-2 lg:order-1"
          >
            <Motion.h2
              className="font-bold tracking-tight"
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
                lineHeight: 1.05,
                color: 'var(--text-strong)',
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
              {t('musicPreview.heading')}
            </Motion.h2>
            <Motion.p
              className="mt-[clamp(1rem,2vh,1.5rem)] leading-[1.55]"
              style={{
                fontSize: 'clamp(1rem, 1.2vw, 1.15rem)',
                color: 'var(--text)',
                maxWidth: '50ch',
              }}
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {t('musicPreview.bio')}
            </Motion.p>

            <Motion.div
              className="mt-[clamp(1.5rem,3vh,2rem)] flex items-baseline gap-[clamp(1.5rem,3vw,2.5rem)] flex-wrap"
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              <div>
                <p
                  className="font-mono uppercase mb-1"
                  style={{
                    fontSize: 'clamp(0.6rem, 0.7vw, 0.7rem)',
                    letterSpacing: '0.18em',
                    color: 'var(--accent-deep)',
                  }}
                >
                  {t('musicPreview.albumsLabel')}
                </p>
                <p style={{ fontSize: 'clamp(1.5rem, 2vw, 2rem)', color: 'var(--text-strong)', fontWeight: 600 }}>
                  {albumCount}
                </p>
              </div>
              <div>
                <p
                  className="font-mono uppercase mb-1"
                  style={{
                    fontSize: 'clamp(0.6rem, 0.7vw, 0.7rem)',
                    letterSpacing: '0.18em',
                    color: 'var(--accent-deep)',
                  }}
                >
                  {t('musicPreview.tracksLabel')}
                </p>
                <p style={{ fontSize: 'clamp(1.5rem, 2vw, 2rem)', color: 'var(--text-strong)', fontWeight: 600 }}>
                  {trackCount}
                </p>
              </div>
            </Motion.div>

            <Motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              style={{ marginTop: 'clamp(2rem,4vh,2.5rem)' }}
            >
              <Link
                to="/music"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onFocus={() => setHovered(true)}
                onBlur={() => setHovered(false)}
                className="inline-flex items-center gap-2 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]"
                style={{
                  color: 'var(--btn-text)',
                  backgroundColor: 'var(--btn-bg)',
                  padding: 'clamp(0.7rem, 1vw, 0.95rem) clamp(1.5rem, 2.4vw, 2.2rem)',
                  fontSize: 'clamp(0.85rem, 1vw, 0.95rem)',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                }}
              >
                {t('musicPreview.cta')}
                <span aria-hidden>→</span>
              </Link>
            </Motion.div>
          </Motion.div>

          {/* RIGHT: vinyl materializes on its own beat — slower, like film
              coming into focus, paired with the heading reveal. */}
          <Motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-1 lg:col-span-6 order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <Link
              to="/music"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="block relative focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--ring-offset)] rounded-full"
              style={{
                width: 'clamp(220px, 30vw, 420px)',
              }}
              aria-label={t('musicPreview.cta')}
            >
              <VinylDisc hovered={hovered} reduceMotion={reduceMotion || disableAmbient} />
            </Link>
          </Motion.div>
        </div>
      </div>
    </section>
  );
}

export default MusicPreview;
