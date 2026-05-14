import { motion, useReducedMotion } from 'framer-motion';

const PUBLICATIONS = [
  {
    year: '2025',
    title: '"Harmonic Divorce or Not?"',
    note: 'Music Theory Online',
  },
  {
    year: '2024',
    title: 'Reference-free Stem Separation Metrics',
    note: 'CS Senior Thesis, Occidental',
  },
  {
    year: '2024',
    title: 'Rock Harmony Evolution',
    note: 'Music Senior Thesis, Occidental',
  },
];

const RECORDINGS = [
  {
    year: '2024',
    title: 'Senior Comprehensive Project Album',
    note: 'Player + Mix/Master, 11 songs',
  },
  {
    year: '2024',
    title: 'Occidental Chamber Jazz Album',
    note: 'Player + Engineer, 11 songs',
  },
  {
    year: '2024',
    title: "Berret Yuffee's EP",
    note: 'Recording + Mix/Master, 3 songs',
  },
  {
    year: '2023',
    title: 'Occidental Chamber Jazz Album',
    note: 'Player + Engineer, 10 songs',
  },
  {
    year: '2022',
    title: 'Occidental Music YouTube',
    note: 'A/V Editor, 15 performances',
  },
];

const PERFORMANCES = [
  {
    year: '2024',
    title: 'Bowers Museum',
    note: 'Tenor sax + live electronics',
  },
  {
    year: '2023–25',
    title: 'Occidental Jazz Ensemble',
    note: 'Tenor sax, 10 performances',
  },
  {
    year: '2021–25',
    title: 'Occidental Chamber Jazz',
    note: 'Alto sax, 20 performances',
  },
  {
    year: '2021–23',
    title: 'Occidental Symphony Orchestra',
    note: 'Tuba, 6 performances',
  },
  {
    year: '2021–23',
    title: 'Chouby (rock band)',
    note: 'Guitar / drums, 4 performances',
  },
];

function Column({ label, items, reduceMotion, delay = 0 }) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <p
        className="font-mono uppercase text-amber-700/70 mb-[clamp(1.25rem,2.5vh,2rem)] text-center"
        style={{ fontSize: 'clamp(0.7rem, 0.85vw, 0.8rem)', letterSpacing: '0.22em' }}
      >
        {label}
      </p>
      <ul className="space-y-0">
        {items.map((item, i) => (
          <li
            key={`${item.year}-${item.title}`}
            className="grid items-baseline"
            style={{
              gridTemplateColumns: 'clamp(56px, 8ch, 96px) 1fr',
              gap: 'clamp(0.75rem, 1.2vw, 1.25rem)',
              paddingTop: 'clamp(1rem, 2vh, 1.5rem)',
              paddingBottom: 'clamp(1rem, 2vh, 1.5rem)',
              borderTop: i === 0 ? '1px solid rgba(108, 92, 59, 0.18)' : 'none',
              borderBottom: '1px solid rgba(108, 92, 59, 0.18)',
            }}
          >
            <span
              className="font-mono text-amber-700/70"
              style={{
                fontSize: 'clamp(0.75rem, 0.9vw, 0.9rem)',
                letterSpacing: '0.05em',
              }}
            >
              {item.year}
            </span>
            <div>
              <p
                className="text-amber-900 leading-snug"
                style={{ fontSize: 'clamp(0.95rem, 1.1vw, 1.05rem)', fontWeight: 500 }}
              >
                {item.title}
              </p>
              <p
                className="text-amber-800/65 mt-1 leading-snug"
                style={{ fontSize: 'clamp(0.8rem, 0.95vw, 0.9rem)' }}
              >
                {item.note}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function Credits() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative"
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 'clamp(3rem, 6vh, 5rem)',
        paddingBottom: 'clamp(7rem, 12vh, 10rem)',
      }}
      aria-label="Publications, recordings, and performances"
    >
      <div
        style={{
          width: '100%',
          maxWidth: 'min(82rem, 92vw)',
          paddingLeft: 'clamp(1.5rem, 6vw, 5rem)',
          paddingRight: 'clamp(1.5rem, 6vw, 5rem)',
        }}
      >
        <div
          className="grid grid-cols-1 lg:grid-cols-3"
          style={{
            gap: 'clamp(2.5rem, 5vw, 4.5rem)',
          }}
        >
          <Column label="Publications" items={PUBLICATIONS} reduceMotion={reduceMotion} delay={0} />
          <Column label="Recordings" items={RECORDINGS} reduceMotion={reduceMotion} delay={0.1} />
          <Column label="Performances" items={PERFORMANCES} reduceMotion={reduceMotion} delay={0.2} />
        </div>
      </div>
    </section>
  );
}

export default Credits;
