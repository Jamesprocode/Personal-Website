import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import albums from '../../data/albums';

const tracks = albums.flatMap((a) => a.tracks);

function VinylDisc({ hovered, reduceMotion }) {
  return (
    <motion.div
      animate={reduceMotion ? undefined : { rotate: 360 }}
      transition={
        reduceMotion
          ? undefined
          : {
              duration: hovered ? 6 : 14,
              repeat: Infinity,
              ease: 'linear',
            }
      }
      style={{
        width: '100%',
        aspectRatio: '1 / 1',
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
    </motion.div>
  );
}

function MusicPreview() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const albumCount = albums.length;
  const trackCount = tracks.length;

  return (
    <section
      className="relative overflow-hidden"
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#1a1410',
        paddingTop: 'clamp(7rem, 14vh, 12rem)',
        paddingBottom: 'clamp(7rem, 14vh, 12rem)',
      }}
    >
      <div
        aria-hidden
        className="absolute right-[8vw] top-1/2 -translate-y-1/2 rounded-full blur-3xl pointer-events-none"
        style={{
          width: 'clamp(280px, 36vw, 560px)',
          aspectRatio: '1 / 1',
          backgroundColor: 'rgba(196, 162, 101, 0.10)',
        }}
      />

      <div
        className="relative z-10"
        style={{
          width: '100%',
          maxWidth: 'min(82rem, 92vw)',
          paddingLeft: 'clamp(1.5rem, 6vw, 5rem)',
          paddingRight: 'clamp(1.5rem, 6vw, 5rem)',
        }}
      >
        <div className="grid grid-cols-12 gap-x-[clamp(2rem,5vw,5rem)] gap-y-[clamp(3rem,6vh,5rem)] items-center">
          {/* LEFT: framing copy + CTA */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 lg:col-span-6 order-2 lg:order-1"
          >
            <h2
              className="font-bold tracking-tight"
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
                lineHeight: 1.05,
                color: '#f4e8d1',
              }}
            >
              {t('musicPreview.heading')}
            </h2>
            <p
              className="mt-[clamp(1rem,2vh,1.5rem)] leading-[1.55]"
              style={{
                fontSize: 'clamp(1rem, 1.2vw, 1.15rem)',
                color: 'rgba(244, 232, 209, 0.7)',
                maxWidth: '50ch',
              }}
            >
              {t('musicPreview.bio')}
            </p>

            <div
              className="mt-[clamp(1.5rem,3vh,2rem)] flex items-baseline gap-[clamp(1.5rem,3vw,2.5rem)] flex-wrap"
            >
              <div>
                <p
                  className="font-mono uppercase mb-1"
                  style={{
                    fontSize: 'clamp(0.6rem, 0.7vw, 0.7rem)',
                    letterSpacing: '0.18em',
                    color: 'rgba(196, 162, 101, 0.6)',
                  }}
                >
                  {t('musicPreview.albumsLabel')}
                </p>
                <p style={{ fontSize: 'clamp(1.5rem, 2vw, 2rem)', color: '#f4e8d1', fontWeight: 600 }}>
                  {albumCount}
                </p>
              </div>
              <div>
                <p
                  className="font-mono uppercase mb-1"
                  style={{
                    fontSize: 'clamp(0.6rem, 0.7vw, 0.7rem)',
                    letterSpacing: '0.18em',
                    color: 'rgba(196, 162, 101, 0.6)',
                  }}
                >
                  {t('musicPreview.tracksLabel')}
                </p>
                <p style={{ fontSize: 'clamp(1.5rem, 2vw, 2rem)', color: '#f4e8d1', fontWeight: 600 }}>
                  {trackCount}
                </p>
              </div>
            </div>

            <Link
              to="/music"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onFocus={() => setHovered(true)}
              onBlur={() => setHovered(false)}
              className="inline-flex items-center gap-2 mt-[clamp(2rem,4vh,2.5rem)] rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1410]"
              style={{
                color: '#1a1410',
                backgroundColor: '#c4a265',
                padding: 'clamp(0.7rem, 1vw, 0.95rem) clamp(1.5rem, 2.4vw, 2.2rem)',
                fontSize: 'clamp(0.85rem, 1vw, 0.95rem)',
                fontWeight: 500,
                letterSpacing: '0.04em',
              }}
            >
              {t('musicPreview.cta')}
              <span aria-hidden>→</span>
            </Link>
          </motion.div>

          {/* RIGHT: spinning vinyl */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 lg:col-span-6 order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <Link
              to="/music"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="block relative focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#1a1410] rounded-full"
              style={{
                width: 'clamp(220px, 30vw, 420px)',
              }}
              aria-label={t('musicPreview.cta')}
            >
              <VinylDisc hovered={hovered} reduceMotion={reduceMotion} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default MusicPreview;
