import { motion, useReducedMotion } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import ParallelTracks from './ParallelTracks';
import Credits from './Credits';

function Timeline() {
  const reduceMotion = useReducedMotion();

  return (
    <PageTransition>
      <main style={{ width: '100%', backgroundColor: '#f4e8d1' }}>
        {/* Intro */}
        <section
          className="relative"
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: 'clamp(7rem, 14vh, 11rem)',
            paddingBottom: 'clamp(2.5rem, 5vh, 4rem)',
            paddingLeft: 'clamp(1.5rem, 6vw, 5rem)',
            paddingRight: 'clamp(1.5rem, 6vw, 5rem)',
          }}
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
            style={{ width: '100%', maxWidth: '60ch' }}
          >
            <p
              className="font-mono uppercase text-amber-700/70 mb-[clamp(1rem,2vh,1.5rem)]"
              style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.8rem)', letterSpacing: '0.22em' }}
            >
              Chronology &middot; 2020&ndash;2026
            </p>
            <h1
              className="font-bold tracking-tight text-amber-900"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: 1.05 }}
            >
              Four things, in parallel.
            </h1>
            <p
              className="mt-[clamp(1rem,2vh,1.5rem)] mx-auto text-amber-900/70"
              style={{ fontSize: 'clamp(1rem, 1.2vw, 1.15rem)', lineHeight: 1.6, maxWidth: '48ch' }}
            >
              Research, music software, performance, industry. Hover a mark for
              the entry. Below: publications, recordings, and performances
              &mdash; the liner notes.
            </p>
          </motion.div>
        </section>

        <ParallelTracks />

        {/* Divider between chart and credits */}
        <div
          className="mx-auto"
          style={{
            width: 'min(82rem, 92vw)',
            paddingLeft: 'clamp(1.5rem, 6vw, 5rem)',
            paddingRight: 'clamp(1.5rem, 6vw, 5rem)',
          }}
          aria-hidden
        >
          <div style={{ height: '1px', background: 'rgba(108, 92, 59, 0.18)' }} />
        </div>

        <Credits />
      </main>
    </PageTransition>
  );
}

export default Timeline;
