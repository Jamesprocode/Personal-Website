import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import profileImg from '../../assets/me.JPG';

function HeroSection() {
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation();
  const titleMiddle = t('hero.titleMiddle');
  const titleLast = t('hero.titleLast');

  return (
    <section
      className="relative overflow-hidden"
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 'clamp(7rem, 14vh, 11rem)',
        paddingBottom: 'clamp(3rem, 6vh, 5rem)',
      }}
    >
      {/* Ambient warm orbs */}
      <motion.div
        aria-hidden
        animate={reduceMotion ? undefined : { scale: [1, 1.15, 1], opacity: [0.18, 0.28, 0.18] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[10vw] top-[12vh] w-[42vw] h-[42vw] max-w-[640px] max-h-[640px] rounded-full bg-amber-400/15 blur-3xl pointer-events-none"
      />
      <motion.div
        aria-hidden
        animate={reduceMotion ? undefined : { scale: [1.1, 1, 1.1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-[10vw] bottom-[8vh] w-[38vw] h-[38vw] max-w-[560px] max-h-[560px] rounded-full bg-orange-300/12 blur-3xl pointer-events-none"
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
        <div className="grid grid-cols-12 gap-x-[clamp(2rem,6vw,6rem)] gap-y-[clamp(4rem,7vh,6rem)] items-center">
          {/* LEFT: type column */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 lg:col-span-7 order-2 lg:order-1"
          >
            <h1
              className="font-bold tracking-[-0.025em] text-amber-900 leading-[1]"
              style={{ fontSize: 'clamp(2.75rem, 8vw, 7rem)', marginBottom: '0.25em' }}
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
            </h1>

            <div
              className="bg-amber-700/40 my-[clamp(4rem,8vh,6rem)]"
              style={{ height: '1px', width: 'clamp(60px, 8vw, 96px)' }}
            />

            <p
              className="text-amber-900/85"
              style={{
                fontSize: 'clamp(1rem, 1.35vw, 1.3rem)',
                lineHeight: 2,
                maxWidth: '52ch',
                fontWeight: 400,
                letterSpacing: '0.01em',
              }}
            >
              {t('hero.bio')}
            </p>

            <div className="flex flex-wrap gap-[clamp(1.25rem,2vw,2rem)] mt-[clamp(4.5rem,9vh,6.5rem)] items-center">
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
            </div>
          </motion.div>

          {/* RIGHT: photo */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 lg:col-span-5 order-1 lg:order-2 flex flex-col items-center lg:items-end"
          >
            <div className="relative" style={{ width: 'clamp(220px, 28vw, 380px)' }}>
              <div
                className="relative overflow-hidden rounded-[18%] border border-amber-200 shadow-[0_24px_60px_-20px_rgba(180,120,40,0.45)]"
                style={{ aspectRatio: '1 / 1' }}
              >
                <img
                  src={profileImg}
                  alt={t('nav.brand')}
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

export default HeroSection;
