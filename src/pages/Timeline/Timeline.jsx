import { motion, useReducedMotion } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import ParallelTracks from './ParallelTracks';

function Timeline() {
  const reduceMotion = useReducedMotion();

  return (
    <PageTransition>
      <main
        style={{
          width: '100%',
          backgroundColor: '#f4e8d1',
          // Footer is position:fixed at the viewport bottom (~72 px tall on
          // the Cream Parlor route). Leave space so the last band's labels
          // and the year axis can scroll above it instead of slipping under.
          paddingBottom: 'clamp(5rem, 9vh, 7rem)',
        }}
      >
        {/* Intro */}
        <section
          className="relative"
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: 'clamp(7rem, 14vh, 11rem)',
            paddingBottom: 'clamp(0.75rem, 2vh, 1.5rem)',
            paddingLeft: 'clamp(1.5rem, 6vw, 5rem)',
            paddingRight: 'clamp(1.5rem, 6vw, 5rem)',
          }}
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
            style={{ width: '100%', maxWidth: '68ch' }}
          >
            <p
              className="font-mono uppercase text-amber-700/70 mb-[clamp(0.75rem,1.5vh,1.25rem)]"
              style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.8rem)', letterSpacing: '0.22em' }}
            >
              Chronology &middot; 2020&ndash;2026
            </p>
            <h1
              className="font-bold tracking-tight text-amber-900"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: 1.05 }}
            >
              Where I&rsquo;ve been.
            </h1>
            <p
              className="mt-[clamp(0.75rem,1.5vh,1.25rem)] mx-auto text-amber-900/70"
              style={{ fontSize: 'clamp(1rem, 1.2vw, 1.15rem)', lineHeight: 1.6 }}
            >
              Five years across three lanes &mdash; degrees, internships, and music.
            </p>
          </motion.div>
        </section>

        <ParallelTracks />
      </main>
    </PageTransition>
  );
}

export default Timeline;
