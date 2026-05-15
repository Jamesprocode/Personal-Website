import { useParams, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import RewindButton from '../../components/RewindButton';
import projects from '../../data/projects';

const CREAM_BASE = '#f4e8d1';
const CREAM_LIGHT = '#fdf7e3';
const LINEN = '#c4b69c';
const BRASS = '#c4a265';
const INK_DEEP = '#2d2d2d';
const WALNUT = '#4a3f35';
const BRONZE = '#6c5c3b';

const MEASURE_TEXT = '46rem';
const MEASURE_MEDIA = '52rem';

function Caption({ children }) {
  return (
    <figcaption
      className="mt-3 font-mono"
      style={{
        color: `${BRONZE}cc`,
        fontSize: 'clamp(0.7rem, 0.85vw, 0.8rem)',
        letterSpacing: '0.05em',
        lineHeight: 1.5,
        maxWidth: '60ch',
      }}
    >
      {children}
    </figcaption>
  );
}

function TextBlock({ content }) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: MEASURE_TEXT,
        margin: '0 auto',
        padding: '0 clamp(1.5rem, 6vw, 5rem)',
      }}
    >
      <p
        style={{
          color: WALNUT,
          fontSize: 'clamp(1.05rem, 1.35vw, 1.2rem)',
          lineHeight: 1.75,
        }}
      >
        {content}
      </p>
    </div>
  );
}

function ImageBlock({ src, alt, caption }) {
  return (
    <figure
      style={{
        width: '100%',
        maxWidth: MEASURE_MEDIA,
        margin: '0 auto',
        padding: '0 clamp(1.5rem, 6vw, 5rem)',
      }}
    >
      <div
        className="overflow-hidden"
        style={{
          borderRadius: 12,
          border: `1px solid ${LINEN}66`,
          backgroundColor: CREAM_LIGHT,
        }}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="block w-full h-auto"
        />
      </div>
      {caption && <Caption>{caption}</Caption>}
    </figure>
  );
}

function AudioBlock({ src, caption }) {
  return (
    <figure
      style={{
        width: '100%',
        maxWidth: MEASURE_TEXT,
        margin: '0 auto',
        padding: '0 clamp(1.5rem, 6vw, 5rem)',
      }}
    >
      <audio
        controls
        preload="none"
        src={src}
        className="w-full"
        style={{ borderRadius: 9999 }}
      />
      {caption && <Caption>{caption}</Caption>}
    </figure>
  );
}

function BodyBlock({ block }) {
  if (block.kind === 'text') return <TextBlock content={block.content} />;
  if (block.kind === 'image') return <ImageBlock src={block.src} alt={block.alt} caption={block.caption} />;
  if (block.kind === 'audio') return <AudioBlock src={block.src} caption={block.caption} />;
  return null;
}

function NotFound() {
  return (
    <PageTransition>
      <main
        style={{
          minHeight: '100vh',
          backgroundColor: CREAM_BASE,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8rem 1.5rem',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '32ch' }}>
          <p
            className="font-mono uppercase mb-3"
            style={{
              fontSize: 'clamp(0.7rem, 0.85vw, 0.8rem)',
              letterSpacing: '0.22em',
              color: `${BRONZE}b3`,
            }}
          >
            404 &middot; Project not found
          </p>
          <p style={{ fontSize: '1.15rem', color: INK_DEEP, marginBottom: '1.5rem' }}>
            We can&rsquo;t find that project. Try the projects list.
          </p>
          <Link
            to="/"
            className="inline-block rounded-full transition-colors duration-200"
            style={{
              backgroundColor: '#92400e',
              color: '#fffbeb',
              padding: '0.7rem 1.5rem',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}
          >
            All projects
          </Link>
        </div>
      </main>
    </PageTransition>
  );
}

function ProjectDetail() {
  const { id } = useParams();
  const reduceMotion = useReducedMotion();
  const project = projects.find((p) => p.id === parseInt(id, 10));

  if (!project) return <NotFound />;

  const currentIndex = projects.findIndex((p) => p.id === project.id);
  const prevProject = projects[currentIndex - 1] || null;
  const nextProject = projects[currentIndex + 1] || null;
  const body = project.body || [];
  const links = project.links || [];

  return (
    <PageTransition>
      <main
        style={{
          width: '100%',
          backgroundColor: CREAM_BASE,
          minHeight: '100vh',
        }}
      >
        {/* Back affordance — REW button */}
        <div
          style={{
            width: '100%',
            maxWidth: MEASURE_MEDIA,
            margin: '0 auto',
            padding: 'clamp(6.5rem, 12vh, 9rem) clamp(1.5rem, 6vw, 5rem) 0',
          }}
        >
          <RewindButton to="/" label="Rewind" />
        </div>

        {/* Editorial header */}
        <section
          style={{
            width: '100%',
            maxWidth: MEASURE_MEDIA,
            margin: '0 auto',
            padding: 'clamp(2rem, 4vh, 3rem) clamp(1.5rem, 6vw, 5rem) clamp(2.5rem, 5vh, 4rem)',
          }}
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="font-mono uppercase"
              style={{
                color: `${BRONZE}b3`,
                fontSize: 'clamp(0.7rem, 0.85vw, 0.8rem)',
                letterSpacing: '0.22em',
                marginBottom: 'clamp(0.75rem, 1.5vh, 1.25rem)',
              }}
            >
              {project.category} &middot; {project.period}
            </p>
            <h1
              className="font-bold"
              style={{
                color: INK_DEEP,
                fontSize: 'clamp(2.25rem, 5.5vw, 4rem)',
                lineHeight: 1.02,
                letterSpacing: '-0.02em',
              }}
            >
              {project.title}
            </h1>
            <p
              style={{
                color: `${WALNUT}d9`,
                fontSize: 'clamp(1.05rem, 1.5vw, 1.35rem)',
                lineHeight: 1.55,
                maxWidth: '60ch',
                marginTop: 'clamp(1.25rem, 2.5vh, 1.75rem)',
              }}
            >
              {project.description}
            </p>

            {/* Brass hairline — the cross-room thread */}
            <div
              aria-hidden
              style={{
                marginTop: 'clamp(2rem, 4vh, 3rem)',
                marginBottom: 'clamp(1.5rem, 3vh, 2rem)',
                height: '1px',
                width: '96px',
                backgroundColor: BRASS,
              }}
            />

            {/* Meta row: tags + outward links */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono uppercase"
                  style={{
                    backgroundColor: `${LINEN}33`,
                    border: `1px solid ${LINEN}`,
                    color: WALNUT,
                    borderRadius: 9999,
                    padding: '4px 12px',
                    fontSize: 'clamp(0.65rem, 0.78vw, 0.72rem)',
                    letterSpacing: '0.1em',
                  }}
                >
                  {tag}
                </span>
              ))}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono uppercase transition-colors duration-200 inline-flex items-center gap-1"
                  style={{
                    backgroundColor: 'transparent',
                    border: `1px solid ${BRASS}`,
                    color: WALNUT,
                    borderRadius: 9999,
                    padding: '4px 12px',
                    fontSize: 'clamp(0.65rem, 0.78vw, 0.72rem)',
                    letterSpacing: '0.1em',
                    textDecoration: 'none',
                  }}
                >
                  GitHub <span aria-hidden>&#8599;</span>
                </a>
              )}
              {links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono uppercase transition-colors duration-200 inline-flex items-center gap-1"
                  style={{
                    backgroundColor: 'transparent',
                    border: `1px solid ${BRASS}`,
                    color: WALNUT,
                    borderRadius: 9999,
                    padding: '4px 12px',
                    fontSize: 'clamp(0.65rem, 0.78vw, 0.72rem)',
                    letterSpacing: '0.1em',
                    textDecoration: 'none',
                  }}
                >
                  {link.label} <span aria-hidden>&#8599;</span>
                </a>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Body — interleaved blocks */}
        {body.length > 0 && (
          <section style={{ width: '100%' }}>
            {body.map((block, i) => (
              <motion.div
                key={i}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  marginTop:
                    i === 0
                      ? 0
                      : block.kind === 'text'
                      ? 'clamp(1.5rem, 3vh, 2.25rem)'
                      : 'clamp(2rem, 4vh, 3.25rem)',
                }}
              >
                <BodyBlock block={block} />
              </motion.div>
            ))}
          </section>
        )}

        {/* Prev / Next nav */}
        <section
          style={{
            width: '100%',
            maxWidth: MEASURE_MEDIA,
            margin: '0 auto',
            padding: 'clamp(4rem, 8vh, 6rem) clamp(1.5rem, 6vw, 5rem) clamp(7rem, 12vh, 10rem)',
          }}
        >
          <div
            style={{
              borderTop: `1px solid ${LINEN}66`,
              paddingTop: 'clamp(1.5rem, 3vh, 2.5rem)',
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              gap: 'clamp(1rem, 2vw, 2rem)',
            }}
          >
            <div>
              {prevProject && (
                <Link
                  to={`/projects/${prevProject.id}`}
                  className="group inline-flex items-baseline gap-2"
                  style={{ textDecoration: 'none' }}
                  aria-label={`Previous project: ${prevProject.title}`}
                >
                  <span
                    className="font-mono uppercase"
                    style={{
                      color: `${BRONZE}cc`,
                      fontSize: 'clamp(0.65rem, 0.78vw, 0.72rem)',
                      letterSpacing: '0.22em',
                    }}
                  >
                    &larr; Prev
                  </span>
                  <span
                    style={{
                      color: INK_DEEP,
                      fontSize: 'clamp(0.9rem, 1.1vw, 1rem)',
                      fontWeight: 500,
                    }}
                    className="group-hover:underline"
                  >
                    {prevProject.shortTitle}
                  </span>
                </Link>
              )}
            </div>

            <Link
              to="/"
              className="font-mono uppercase transition-colors duration-200 rounded-full"
              style={{
                color: WALNUT,
                border: `1px solid ${LINEN}`,
                padding: '0.55rem 1.1rem',
                fontSize: 'clamp(0.65rem, 0.78vw, 0.72rem)',
                letterSpacing: '0.18em',
                whiteSpace: 'nowrap',
              }}
            >
              All projects
            </Link>

            <div style={{ textAlign: 'right' }}>
              {nextProject && (
                <Link
                  to={`/projects/${nextProject.id}`}
                  className="group inline-flex items-baseline gap-2 justify-end"
                  style={{ textDecoration: 'none' }}
                  aria-label={`Next project: ${nextProject.title}`}
                >
                  <span
                    style={{
                      color: INK_DEEP,
                      fontSize: 'clamp(0.9rem, 1.1vw, 1rem)',
                      fontWeight: 500,
                    }}
                    className="group-hover:underline"
                  >
                    {nextProject.shortTitle}
                  </span>
                  <span
                    className="font-mono uppercase"
                    style={{
                      color: `${BRONZE}cc`,
                      fontSize: 'clamp(0.65rem, 0.78vw, 0.72rem)',
                      letterSpacing: '0.22em',
                    }}
                  >
                    Next &rarr;
                  </span>
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}

export default ProjectDetail;
