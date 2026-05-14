import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import projects from '../../data/projects';

const FEATURED_ID = 1;

const CREAM_DEEP = '#efe3c9';
const CREAM_SHADOW = '#e8dcc8';
const LINEN = '#c4b69c';
const BRASS = '#c4a265';
const INK_DEEP = '#2d2d2d';
const WALNUT = '#4a3f35';
const BRONZE = '#6c5c3b';

function FeaturedTile({ project, reduceMotion }) {
  const img = project.tileImage;
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="md:col-span-2 md:row-span-3"
    >
      <Link
        to={`/projects/${project.id}`}
        className="group relative block w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f4e8d1]"
        style={{ borderRadius: 'clamp(16px, 1.5vw, 28px)' }}
      >
        <div
          className="relative overflow-hidden h-full"
          style={{
            borderRadius: 'clamp(16px, 1.5vw, 28px)',
            backgroundColor: img ? '#1a1410' : CREAM_SHADOW,
            border: `1px solid ${LINEN}66`,
            minHeight: 'clamp(360px, 50vh, 560px)',
            boxShadow: '0 6px 18px -8px rgba(80,55,15,0.18)',
          }}
        >
          {img && (
            <img
              src={img}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              style={{ filter: 'saturate(0.85)' }}
            />
          )}
          {/* Bottom cream gradient overlay for text contrast */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0"
            style={{
              height: '70%',
              background: img
                ? 'linear-gradient(to top, rgba(244,232,209,0.97) 0%, rgba(244,232,209,0.88) 30%, rgba(244,232,209,0.55) 60%, rgba(244,232,209,0) 100%)'
                : 'none',
            }}
          />
          {/* Brass hairline at top, thin */}
          <div
            aria-hidden
            className="absolute top-0 left-0"
            style={{
              height: '2px',
              width: 'clamp(60px, 6vw, 96px)',
              backgroundColor: BRASS,
            }}
          />

          <div
            className="relative h-full flex flex-col justify-end"
            style={{ padding: 'clamp(1.5rem, 2.5vw, 2.5rem)' }}
          >
            <p
              className="font-mono uppercase mb-2"
              style={{
                color: `${BRONZE}cc`,
                fontSize: 'clamp(0.65rem, 0.8vw, 0.75rem)',
                letterSpacing: '0.18em',
              }}
            >
              {project.category} &middot; {project.period}
            </p>
            <h3
              className="font-bold"
              style={{
                color: INK_DEEP,
                fontSize: 'clamp(1.5rem, 2.4vw, 2.5rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.015em',
              }}
            >
              {project.title}
            </h3>
            <p
              style={{
                color: `${WALNUT}d9`,
                fontSize: 'clamp(0.95rem, 1.05vw, 1.1rem)',
                lineHeight: 1.55,
                maxWidth: '52ch',
                marginTop: 'clamp(0.5rem, 1vh, 0.85rem)',
              }}
            >
              {project.description}
            </p>
            <span
              className="inline-flex items-center gap-2 font-medium"
              style={{
                color: INK_DEEP,
                fontSize: 'clamp(0.85rem, 1vw, 0.95rem)',
                marginTop: 'clamp(0.85rem, 1.75vh, 1.25rem)',
              }}
            >
              Read the project
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function SupportingTile({ project, index, reduceMotion }) {
  const img = project.tileImage;
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: 0.06 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/projects/${project.id}`}
        className="group relative block w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f4e8d1]"
        style={{ borderRadius: 'clamp(12px, 1.2vw, 20px)' }}
      >
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: '1 / 1',
            borderRadius: 'clamp(12px, 1.2vw, 20px)',
            backgroundColor: img ? '#1a1410' : CREAM_SHADOW,
            border: `1px solid ${LINEN}66`,
            boxShadow: '0 4px 10px -6px rgba(80,55,15,0.15)',
          }}
        >
          {img && (
            <img
              src={img}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              style={{ filter: 'saturate(0.85)' }}
            />
          )}
          {/* Bottom cream overlay */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0"
            style={{
              height: '60%',
              background: img
                ? 'linear-gradient(to top, rgba(244,232,209,0.96) 0%, rgba(244,232,209,0.82) 35%, rgba(244,232,209,0) 100%)'
                : 'none',
            }}
          />

          <div
            className="absolute inset-x-0 bottom-0"
            style={{ padding: 'clamp(0.85rem, 1.4vw, 1.25rem)' }}
          >
            <p
              className="font-mono uppercase mb-1"
              style={{
                color: `${BRONZE}cc`,
                fontSize: 'clamp(0.55rem, 0.65vw, 0.7rem)',
                letterSpacing: '0.15em',
              }}
            >
              {project.category}
            </p>
            <p
              className="font-semibold leading-tight"
              style={{
                color: INK_DEEP,
                fontSize: 'clamp(0.95rem, 1.15vw, 1.15rem)',
              }}
            >
              {project.shortTitle}
            </p>
          </div>

          {/* Hover overlay with description peek */}
          <div
            className="absolute inset-0 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              padding: 'clamp(0.85rem, 1.4vw, 1.25rem)',
              backgroundColor: 'rgba(244,232,209,0.96)',
            }}
          >
            <p
              className="font-mono uppercase mb-1"
              style={{
                color: `${BRONZE}cc`,
                fontSize: 'clamp(0.55rem, 0.65vw, 0.7rem)',
                letterSpacing: '0.15em',
              }}
            >
              {project.period}
            </p>
            <p
              className="font-semibold leading-tight"
              style={{
                color: INK_DEEP,
                fontSize: 'clamp(0.95rem, 1.1vw, 1.05rem)',
              }}
            >
              {project.title}
            </p>
            <p
              className="leading-snug mt-2"
              style={{
                color: `${WALNUT}cc`,
                fontSize: 'clamp(0.78rem, 0.85vw, 0.85rem)',
              }}
            >
              {project.description}
            </p>
            <span
              className="inline-flex items-center gap-1 font-medium mt-3"
              style={{
                color: INK_DEEP,
                fontSize: 'clamp(0.78rem, 0.85vw, 0.85rem)',
              }}
            >
              View &rarr;
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ProjectsSection() {
  const reduceMotion = useReducedMotion();

  const featured = projects.find((p) => p.id === FEATURED_ID);
  const supporting = projects.filter((p) => p.id !== FEATURED_ID);

  return (
    <section
      className="relative"
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#f4e8d1',
        paddingTop: 'clamp(7rem, 14vh, 12rem)',
        paddingBottom: 'clamp(7rem, 14vh, 12rem)',
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
          className="mb-[clamp(3rem,6vh,5rem)] grid grid-cols-12 gap-x-[clamp(2rem,5vw,5rem)] gap-y-4 items-end"
        >
          <div className="col-span-12 lg:col-span-7">
            <h2
              className="font-bold tracking-tight"
              style={{
                color: INK_DEEP,
                fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
                lineHeight: 1.05,
              }}
            >
              A few projects,<br className="hidden sm:block" /> in research and music.
            </h2>
          </div>
          <p
            className="col-span-12 lg:col-span-5"
            style={{
              color: `${WALNUT}b3`,
              fontSize: 'clamp(0.9rem, 1.05vw, 1.05rem)',
              maxWidth: '40ch',
            }}
          >
            Click any tile for the full write-up; the rest of the chronology is on the CV.
          </p>
        </motion.div>

        {/* 4-col grid; featured spans 2x3, six supporting fill the right 2 cols */}
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{
            gridAutoRows: '1fr',
            gap: 'clamp(1.25rem, 2.5vw, 2.25rem)',
          }}
        >
          <FeaturedTile project={featured} reduceMotion={reduceMotion} />
          {supporting.map((p, i) => (
            <SupportingTile key={p.id} project={p} index={i} reduceMotion={reduceMotion} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;
