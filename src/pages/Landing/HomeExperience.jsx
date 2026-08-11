import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion as Motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import coverBigBand from '../../assets/hero/09-big-band-enhanced.webp';
import coverStudio from '../../assets/hero/02-studio-console-enhanced.webp';
import coverPiano from '../../assets/hero/08-piano-enhanced.webp';
import portraitGuitar from '../../assets/hero/06-guitar-enhanced.webp';
import portraitSax from '../../assets/hero/01-sax-solo-enhanced.webp';
import portraitConducting from '../../assets/hero/03-conducting-enhanced.webp';
import portraitDesert from '../../assets/hero/12-desert-guitar-enhanced.webp';
import './HomeExperience.css';

const COVER_PHOTOS = [
  { src: coverBigBand, alt: 'James Wang performing with a jazz big band at dusk', position: '50% 50%' },
  { src: coverStudio, alt: 'James Wang at a recording studio mixing console', position: '58% 50%' },
  { src: coverPiano, alt: 'James Wang playing grand piano in a recital hall', position: '34% 50%' },
];

const PORTRAIT_PHOTOS = [
  { src: portraitGuitar, alt: 'James Wang playing acoustic guitar', position: '50% 38%' },
  { src: portraitSax, alt: 'James Wang playing tenor saxophone on stage', position: '50% 30%' },
  { src: portraitConducting, alt: 'James Wang conducting an orchestra', position: '50% 42%' },
  { src: portraitDesert, alt: 'James Wang playing guitar at desert sunset', position: '50% 58%' },
];

function CrossfadeCarousel({ images, label, variant, interval = 6400, inactive = false }) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduceMotion || paused || inactive || images.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [images.length, inactive, interval, paused, reduceMotion]);

  const move = (direction) => {
    setIndex((current) => (current + direction + images.length) % images.length);
  };

  return (
    <div
      className={`home-carousel home-carousel--${variant}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className="home-carousel-frame" aria-live="off">
        {images.map((image, imageIndex) => {
          const active = imageIndex === index;
          return (
            <img
              key={image.src}
              src={image.src}
              alt={active ? image.alt : ''}
              aria-hidden={!active}
              className={`home-carousel-image${active ? ' is-active' : ''}`}
              style={{ objectPosition: image.position }}
              loading={variant === 'cover' && imageIndex === 0 ? 'eager' : 'lazy'}
              fetchPriority={variant === 'cover' && imageIndex === 0 ? 'high' : 'auto'}
            />
          );
        })}
      </div>

      <div className="home-carousel-controls">
        <button type="button" onClick={() => move(-1)} aria-label={t('home.photos.previous')}>
          <span aria-hidden="true">←</span>
        </button>
        <span className="home-carousel-count" aria-hidden="true">
          {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </span>
        <button type="button" onClick={() => move(1)} aria-label={t('home.photos.next')}>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

function CassettePortal() {
  return (
    <svg viewBox="0 0 320 190" aria-hidden="true" focusable="false">
      <path className="portal-cassette-shell" d="M40 8h240l18 18v138l-18 18H40l-18-18V26z" />
      <rect className="portal-cassette-label" x="52" y="28" width="216" height="112" rx="12" />
      <path className="portal-cassette-line" d="M64 48h192M64 62h116" />
      <path className="portal-cassette-window" d="M78 74h164l-18 56H96z" />
      {[110, 210].map((cx) => (
        <g className="cassette-reel" key={cx}>
          <circle className="portal-reel-ring" cx={cx} cy="102" r="25" />
          <circle className="portal-reel-core" cx={cx} cy="102" r="9" />
          {[0, 60, 120].map((angle) => (
            <path
              key={angle}
              className="portal-reel-slot"
              d={`M${cx - 3} 78h6v14h-6zM${cx - 3} 112h6v14h-6z`}
              transform={`rotate(${angle} ${cx} 102)`}
            />
          ))}
        </g>
      ))}
      <path className="portal-cassette-base" d="M86 146h148l15 27H71z" />
    </svg>
  );
}

function VinylPortal() {
  return (
    <svg viewBox="0 0 240 240" aria-hidden="true" focusable="false">
      <g className="vinyl-disc">
        <circle className="portal-vinyl-disc" cx="120" cy="120" r="103" />
        {[91, 78, 65].map((radius) => (
          <circle className="portal-vinyl-groove" cx="120" cy="120" r={radius} key={radius} />
        ))}
        <circle className="portal-vinyl-label" cx="120" cy="120" r="38" />
        <path className="portal-vinyl-label-line" d="M97 108h46M97 118h31" />
        <circle className="portal-vinyl-hole" cx="120" cy="120" r="5" />
      </g>
    </svg>
  );
}

function CdPortal() {
  return (
    <svg viewBox="0 0 240 240" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="home-cd-face" cx="38%" cy="32%" r="78%">
          <stop offset="0" stopColor="var(--surface)" />
          <stop offset="0.48" stopColor="var(--accent-bright)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--accent-deep)" stopOpacity="0.86" />
        </radialGradient>
        <linearGradient id="home-cd-glint" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--surface)" stopOpacity="0" />
          <stop offset="0.5" stopColor="var(--surface)" stopOpacity="0.8" />
          <stop offset="1" stopColor="var(--surface)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="cd-disc">
        <circle cx="120" cy="120" r="103" fill="url(#home-cd-face)" className="portal-cd-disc" />
        <circle cx="120" cy="120" r="88" className="portal-cd-ring" />
        <path d="M54 45l137 137-22 22L38 66z" fill="url(#home-cd-glint)" className="portal-cd-glint" />
        <circle cx="120" cy="120" r="30" className="portal-cd-center" />
        <circle cx="120" cy="120" r="12" className="portal-cd-hole" />
      </g>
    </svg>
  );
}

const PORTALS = [
  { to: '/projects', labelKey: 'home.projects', hintKey: 'home.projectsHint', object: <CassettePortal /> },
  { to: '/music', labelKey: 'home.music', hintKey: 'home.musicHint', object: <VinylPortal /> },
  { to: '/timeline', labelKey: 'home.timeline', hintKey: 'home.timelineHint', object: <CdPortal /> },
];

function HomePortals() {
  const { t } = useTranslation();

  return (
    <Motion.nav
      className="home-portal-links"
      aria-label={t('home.explore')}
      variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
    >
      {PORTALS.map((portal) => {
        const label = t(portal.labelKey);
        const hint = t(portal.hintKey);
        return (
          <Link className="home-portal-link" to={portal.to} aria-label={`${label}: ${hint}`} key={portal.to}>
            <span className="home-portal-object">{portal.object}</span>
            <span className="home-portal-copy">
              <strong>{label}</strong>
              <small>{hint}</small>
            </span>
            <span className="home-portal-arrow" aria-hidden="true">↗</span>
          </Link>
        );
      })}
    </Motion.nav>
  );
}

function HomeExperience() {
  const { t, i18n } = useTranslation();
  const { hash } = useLocation();
  const reduceMotion = useReducedMotion();
  const english = !i18n.language.toLowerCase().startsWith('zh');
  const [curtainOpen, setCurtainOpen] = useState(() => hash === '#intro');
  const [introRevealed, setIntroRevealed] = useState(() => hash === '#intro');
  const curtainLocked = useRef(false);
  const curtainTimer = useRef(0);

  const moveCurtain = useCallback((destination) => {
    if (curtainLocked.current) return;
    const opening = destination === 'intro';
    if (opening === curtainOpen) {
      if (!opening) window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      return;
    }

    curtainLocked.current = true;
    window.clearTimeout(curtainTimer.current);

    if (opening) {
      setCurtainOpen(true);
      setIntroRevealed(true);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      setIntroRevealed(false);
      setCurtainOpen(false);
    }

    curtainTimer.current = window.setTimeout(() => {
      curtainLocked.current = false;
    }, reduceMotion ? 80 : 1040);
  }, [curtainOpen, reduceMotion]);

  useEffect(() => () => {
    window.clearTimeout(curtainTimer.current);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.homeCurtain = curtainOpen ? 'open' : 'closed';
    window.dispatchEvent(new CustomEvent('home-curtain-change', { detail: { open: curtainOpen } }));

    if (curtainOpen) return undefined;

    const root = document.documentElement;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const previousOverscroll = root.style.overscrollBehavior;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    root.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    root.style.overscrollBehavior = 'none';

    return () => {
      root.style.overflow = previousRootOverflow;
      document.body.style.overflow = previousBodyOverflow;
      root.style.overscrollBehavior = previousOverscroll;
    };
  }, [curtainOpen]);

  useEffect(() => {
    const onCurtainRequest = (event) => {
      moveCurtain(event.detail?.destination === 'cover' ? 'cover' : 'intro');
    };
    window.addEventListener('home-curtain-request', onCurtainRequest);
    return () => window.removeEventListener('home-curtain-request', onCurtainRequest);
  }, [moveCurtain]);

  useEffect(() => {
    let wheelDistance = 0;
    let touchStart = null;

    const onWheel = (event) => {
      if (curtainLocked.current && window.scrollY <= 2) {
        event.preventDefault();
        return;
      }

      const movingForward = !curtainOpen && event.deltaY > 0;
      const movingBack = curtainOpen && window.scrollY <= 2 && event.deltaY < 0;
      if (!movingForward && !movingBack) {
        wheelDistance = 0;
        return;
      }

      event.preventDefault();
      wheelDistance += Math.abs(event.deltaY);
      if (wheelDistance < 8) return;
      wheelDistance = 0;
      moveCurtain(movingForward ? 'intro' : 'cover');
    };

    const onTouchStart = (event) => {
      touchStart = {
        curtainOpen,
        atTop: window.scrollY <= 2,
        y: event.touches[0].clientY,
      };
    };

    const onTouchMove = (event) => {
      if (!touchStart || curtainLocked.current) return;
      const distance = touchStart.y - event.touches[0].clientY;
      const movingForward = !touchStart.curtainOpen && distance > 24;
      const movingBack = touchStart.curtainOpen && touchStart.atTop && distance < -24;
      if (!movingForward && !movingBack) return;
      event.preventDefault();
      moveCurtain(movingForward ? 'intro' : 'cover');
      touchStart = null;
    };

    const onTouchEnd = () => {
      touchStart = null;
    };

    const onKeyDown = (event) => {
      if (event.target instanceof HTMLElement && event.target.closest('a, button, input, textarea, select')) return;
      const forwardKeys = ['ArrowDown', 'PageDown', ' '];
      const backKeys = ['ArrowUp', 'PageUp'];
      if (!curtainOpen && forwardKeys.includes(event.key)) {
        event.preventDefault();
        moveCurtain('intro');
      } else if (curtainOpen && window.scrollY <= 2 && backKeys.includes(event.key)) {
        event.preventDefault();
        moveCurtain('cover');
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [curtainOpen, moveCurtain]);

  return (
    <>
      <Motion.section
        className={`home-cover${curtainOpen ? ' is-lifted' : ''}`}
        aria-label={t('home.coverPhotos')}
        aria-hidden={curtainOpen}
        inert={curtainOpen || undefined}
        initial={false}
        animate={{ y: curtainOpen ? '-100%' : '0%' }}
        transition={{ duration: reduceMotion ? 0 : 0.96, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="home-cover-stage">
          <div className="home-cover-media">
            <CrossfadeCarousel
              images={COVER_PHOTOS}
              label={t('home.coverPhotos')}
              variant="cover"
              interval={6800}
              inactive={curtainOpen}
            />
            <div className="home-cover-scrim" aria-hidden="true" />
          </div>
          <Motion.div
            className="home-cover-copy"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            <button type="button" className="home-cover-scroll" onClick={() => moveCurtain('intro')}>
              <span>{t('home.scrollToEnter')}</span>
              <span className="home-scroll-arrows" aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </Motion.div>
        </div>
      </Motion.section>

      <section
        id="intro"
        className={`home-intro${introRevealed ? ' is-revealed' : ''}`}
        aria-labelledby="home-intro-title"
        aria-hidden={!introRevealed}
        inert={!introRevealed || undefined}
      >
        <Motion.div
          className="home-intro-inner"
          initial={false}
          animate={introRevealed ? 'show' : 'hidden'}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.15, delayChildren: reduceMotion ? 0 : 0.08 } },
          }}
        >
          <div className="home-intro-copy">
            <Motion.h2
              id="home-intro-title"
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              {english ? (
                <>{t('hero.titleFirst')} <em>{t('hero.titleMiddle')}</em> {t('hero.titleLast')}</>
              ) : t('hero.titleFirst')}
            </Motion.h2>
            <Motion.p
              className="home-intro-bio"
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              {t('hero.bio')}
            </Motion.p>
            <HomePortals />
            <Motion.div
              className="home-intro-actions"
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            >
              <a className="home-cv-link" href="/cv.pdf" target="_blank" rel="noopener noreferrer">
                {t('hero.downloadCv')}
              </a>
              <a className="home-contact-link" href="mailto:jameswangjiayi@gmail.com">
                <span>{t('hero.contact')}</span>
                <small>jameswangjiayi@gmail.com</small>
              </a>
            </Motion.div>
          </div>

          <Motion.div
            className="home-portrait"
            variants={{
              hidden: { opacity: 0, y: 28, rotate: 1.5 },
              show: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            <CrossfadeCarousel
              images={PORTRAIT_PHOTOS}
              label={t('home.portraitPhotos')}
              variant="portrait"
              interval={7200}
              inactive={!introRevealed}
            />
          </Motion.div>
        </Motion.div>
      </section>
    </>
  );
}

export default HomeExperience;
