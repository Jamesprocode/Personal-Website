import { motion, useReducedMotion } from 'framer-motion';
import ProjectShelf from './ProjectShelf';

const INK_DEEP = '#2d2d2d';
const WALNUT = '#4a3f35';

function ProjectsSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="research-projects-top"
      className="relative"
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#efe3c9',
        borderTop: '1px solid rgba(108, 92, 59, 0.16)',
        paddingTop: 'clamp(2.5rem, 5vh, 4rem)',
        paddingBottom: 'clamp(7rem, 14vh, 12rem)',
        scrollMarginTop: '4rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 'min(82rem, 92vw)',
          paddingLeft: 'clamp(1.5rem, 6vw, 5rem)',
          paddingRight: 'clamp(1.5rem, 6vw, 5rem)',
        }}
      >
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-12 gap-x-[clamp(2rem,5vw,5rem)] gap-y-4 items-center"
        >
          <h2
            className="col-span-12 lg:col-span-7 font-bold tracking-tight"
            style={{
              color: INK_DEEP,
              fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            Research Projects
          </h2>
          <p
            className="col-span-12 lg:col-span-5"
            style={{
              color: `${WALNUT}b3`,
              fontSize: 'clamp(0.95rem, 1.15vw, 1.15rem)',
              lineHeight: 1.55,
              maxWidth: '42ch',
              margin: 0,
            }}
          >
            Each tape is one project. Pick one off the shelf to play.
          </p>
        </motion.div>

        <ProjectShelf />
        <div id="research-projects-bottom" aria-hidden style={{ scrollMarginBottom: '4rem' }} />
      </div>
    </section>
  );
}

export default ProjectsSection;
