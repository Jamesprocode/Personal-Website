import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import projects from '../../data/projects';

function ProjectDetail() {
  const { id } = useParams();
  const project = projects.find(p => p.id === parseInt(id));

  if (!project) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center pt-20" style={{ background: 'linear-gradient(to bottom, #f4e8d1, #efe3c9)' }}>
          <div className="text-center">
            <p className="text-xl mb-4" style={{ color: '#6c5c3b' }}>Project not found.</p>
            <Link to="/" className="text-sm underline" style={{ color: '#2d2d2d' }}>← Back home</Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Find prev/next projects
  const currentIndex = projects.findIndex(p => p.id === project.id);
  const prevProject = projects[currentIndex - 1] || null;
  const nextProject = projects[currentIndex + 1] || null;

  return (
    <PageTransition>
      <div className="min-h-screen pb-28" style={{ background: 'linear-gradient(to bottom, #f4e8d1, #efe3c9, #f4e8d1)' }}>
        {/* Hero banner */}
        <div className={`relative h-80 md:h-[26rem] bg-gradient-to-br ${project.gradient} pt-20`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-9xl opacity-20">{project.icon}</span>
          </div>
          <div className="absolute inset-0 bg-black/20" />

          <div className="relative z-10 h-full flex flex-col justify-between px-6 md:px-10 xl:px-16 py-8 max-w-6xl xl:max-w-7xl mx-auto w-full">
            <div />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block px-3 py-1 text-xs font-medium text-white/80 bg-black/20 rounded-full backdrop-blur-sm mb-4">
                {project.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-3">
                {project.title}
              </h1>
              <p className="text-white/60 text-sm">{project.period}</p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 md:px-10 xl:px-16 py-16 xl:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 xl:gap-16">
            {/* Main description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2"
            >
              <h2 className="text-lg font-bold mb-4" style={{ color: '#2d2d2d' }}>About this project</h2>
              <div className="space-y-6">
                {project.longDescription.split('\n\n').map((para, i) => (
                  <p key={i} className="leading-relaxed" style={{ color: '#4a3f35' }}>
                    {para}
                  </p>
                ))}
              </div>

              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-80"
                  style={{ backgroundColor: '#2d2d2d' }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View on GitHub
                </a>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              {/* Tags */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: '#6c5c3b' }}>
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs rounded-full border"
                      style={{ color: '#4a3f35', backgroundColor: 'rgba(196,182,156,0.2)', borderColor: '#c4b69c' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Period */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: '#6c5c3b' }}>
                  Period
                </h3>
                <p className="text-sm" style={{ color: '#4a3f35' }}>{project.period}</p>
              </div>

              {/* Category */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: '#6c5c3b' }}>
                  Category
                </h3>
                <p className="text-sm" style={{ color: '#4a3f35' }}>{project.category}</p>
              </div>
            </motion.div>
          </div>

          {/* Prev / Next navigation */}
          <div className="mt-16 xl:mt-20 pt-8 border-t flex justify-between items-center" style={{ borderColor: '#c4b69c' }}>
            {prevProject ? (
              <Link
                to={`/projects/${prevProject.id}`}
                className="group flex items-center gap-3"
              >
                <span className="text-lg" style={{ color: '#6c5c3b' }}>←</span>
                <div>
                  <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: '#6c5c3b' }}>Previous</p>
                  <p className="text-sm font-medium group-hover:underline" style={{ color: '#2d2d2d' }}>{prevProject.shortTitle}</p>
                </div>
              </Link>
            ) : <div />}

            <Link
              to="/"
              className="text-sm px-4 py-2 rounded-full border transition-colors"
              style={{ color: '#2d2d2d', borderColor: '#c4b69c' }}
            >
              All Projects
            </Link>

            {nextProject ? (
              <Link
                to={`/projects/${nextProject.id}`}
                className="group flex items-center gap-3 text-right"
              >
                <div>
                  <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: '#6c5c3b' }}>Next</p>
                  <p className="text-sm font-medium group-hover:underline" style={{ color: '#2d2d2d' }}>{nextProject.shortTitle}</p>
                </div>
                <span className="text-lg" style={{ color: '#6c5c3b' }}>→</span>
              </Link>
            ) : <div />}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default ProjectDetail;
