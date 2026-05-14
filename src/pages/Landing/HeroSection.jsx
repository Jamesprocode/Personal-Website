import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import VUMeter from '../Music/VUMeter';
import profileImg from '../../assets/me.JPG';

const REACTIVITY_RADIUS = 320;

function HeroSection() {
  const reduceMotion = useReducedMotion();
  const photoRef = useRef(null);
  const [vuLevel, setVuLevel] = useState(0.18);

  useEffect(() => {
    if (reduceMotion) {
      setVuLevel(0.5);
      return;
    }

    let frame = 0;
    let cursorBoost = 0;
    let cursorTarget = 0;

    const handleMove = (e) => {
      const node = photoRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      cursorTarget = Math.max(0, 1 - dist / REACTIVITY_RADIUS);
    };

    const handleLeave = () => {
      cursorTarget = 0;
    };

    const tick = () => {
      frame += 1;
      cursorBoost += (cursorTarget - cursorBoost) * 0.08;
      const idle = 0.18 + Math.sin(frame / 22) * 0.06 + Math.sin(frame / 9) * 0.04;
      const wobble = Math.random() * 0.12 * (0.4 + cursorBoost);
      const next = Math.min(0.95, idle + cursorBoost * 0.55 + wobble);
      setVuLevel(next);
      raf = requestAnimationFrame(tick);
    };

    let raf = requestAnimationFrame(tick);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseleave', handleLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
    };
  }, [reduceMotion]);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        minHeight: 'min(100vh, 1100px)',
        paddingTop: 'clamp(8rem, 17vh, 13rem)',
        paddingBottom: 'clamp(8rem, 17vh, 13rem)',
      }}
    >
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
              className="font-bold tracking-[-0.025em] text-amber-900 leading-[0.95]"
              style={{ fontSize: 'clamp(2.75rem, 8vw, 7rem)' }}
            >
              James{' '}
              <span
                className="font-normal text-amber-900/55"
                style={{ fontSize: '0.5em', letterSpacing: '-0.01em', verticalAlign: '0.18em' }}
              >
                (Jiayi)
              </span>{' '}
              Wang
            </h1>

            <div
              className="bg-amber-700/40 my-[clamp(2.75rem,5.5vh,4rem)]"
              style={{ height: '1px', width: 'clamp(60px, 8vw, 96px)' }}
            />

            <p
              className="text-amber-900/85 leading-[1.8]"
              style={{
                fontSize: 'clamp(1rem, 1.35vw, 1.3rem)',
                maxWidth: '52ch',
                fontWeight: 400,
              }}
            >
              I’m currently a master’s student in Music Technology at Georgia Institute of Technology, where I work on optical music recognition, audio content analysis, and music AI systems. I graduated from Occidental College with a double major in Music and Computer Science, where I trained as a jazz saxophonist while developing an interest in music technology and audio engineering.
            </p>

            <div className="flex flex-wrap gap-[clamp(0.75rem,1.2vw,1.25rem)] mt-[clamp(3rem,6vh,4.5rem)] items-center">
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-900 text-amber-50 hover:bg-stone-900 transition-colors duration-200 rounded-full font-medium tracking-wide"
                style={{
                  padding: 'clamp(0.65rem, 1vw, 0.9rem) clamp(1.4rem, 2.2vw, 2rem)',
                  fontSize: 'clamp(0.85rem, 1vw, 0.95rem)',
                }}
              >
                Download CV
              </a>
              <Link
                to="/music"
                className="bg-white/55 hover:bg-white/75 backdrop-blur-sm border border-amber-200 hover:border-amber-400 text-amber-900 transition-colors duration-200 rounded-full"
                style={{
                  padding: 'clamp(0.65rem, 1vw, 0.9rem) clamp(1.4rem, 2.2vw, 2rem)',
                  fontSize: 'clamp(0.85rem, 1vw, 0.95rem)',
                }}
              >
                Listen to my music →
              </Link>
            </div>
          </motion.div>

          {/* RIGHT: photo + VU column */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 lg:col-span-5 order-1 lg:order-2 flex flex-col items-center lg:items-end"
          >
            <div className="relative" style={{ width: 'clamp(200px, 26vw, 360px)' }}>
              <div
                ref={photoRef}
                className="relative overflow-hidden rounded-[18%] border border-amber-200 shadow-[0_24px_60px_-20px_rgba(180,120,40,0.45)]"
                style={{ aspectRatio: '1 / 1' }}
              >
                <img
                  src={profileImg}
                  alt="James Wang"
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              <div className="mt-[clamp(0.75rem,1.5vh,1.25rem)] flex items-end justify-between gap-3">
                <div>
                  <p
                    className="font-mono uppercase text-amber-700/70"
                    style={{ fontSize: 'clamp(0.6rem, 0.7vw, 0.7rem)', letterSpacing: '0.18em' }}
                  >
                    M.S. · Music Tech
                  </p>
                  <p className="text-amber-900/80" style={{ fontSize: 'clamp(0.85rem, 1vw, 0.95rem)' }}>
                    Georgia Tech, 2025–2027
                  </p>
                </div>
                <div style={{ width: 'clamp(110px, 14vw, 170px)' }}>
                  <VUMeter level={vuLevel} segments={16} tone="mono" label="Lvl" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {!reduceMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-[clamp(1.5rem,4vh,3rem)] flex flex-col items-center pointer-events-none"
          >
            <p
              className="font-mono uppercase text-amber-700/55 mb-2"
              style={{ fontSize: 'clamp(0.6rem, 0.7vw, 0.7rem)', letterSpacing: '0.22em' }}
            >
              Projects below
            </p>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="text-amber-700/45 text-lg"
              aria-hidden
            >
              ↓
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default HeroSection;
