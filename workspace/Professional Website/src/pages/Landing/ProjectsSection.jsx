import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import projects from '../../data/projects';

function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/projects/${project.id}`}>
        <div className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-shadow duration-300">
          {/* Background */}
          <div
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundColor: '#e8dcc8' }}
          />

          {/* Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl opacity-40 group-hover:opacity-20 transition-opacity duration-300">
              {project.icon}
            </span>
          </div>

          {/* Hover overlay with title */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-5"
            style={{ backgroundColor: 'rgba(196,182,156,0.95)' }}
          >
            <h3 className="font-bold text-center text-base leading-tight mb-2" style={{ color: '#2d2d2d' }}>
              {project.title}
            </h3>
            <p className="text-sm text-center line-clamp-3" style={{ color: '#6c5c3b' }}>
              {project.description}
            </p>
            <span className="mt-3 text-sm font-medium" style={{ color: '#6c5c3b' }}>
              View details →
            </span>
          </div>

          {/* Bottom title strip (hides on hover) */}
          <div
            className="absolute bottom-0 left-0 right-0 px-4 py-3 transition-opacity duration-300 group-hover:opacity-0"
            style={{ backgroundColor: 'rgba(196,182,156,0.7)', backdropFilter: 'blur(4px)' }}
          >
            <p className="text-sm font-semibold truncate text-center" style={{ color: '#2d2d2d' }}>{project.shortTitle}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ProjectsSection() {
  return (
    <section className="px-6 sm:px-10 xl:px-16 py-24 xl:py-32 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-screen-2xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl xl:text-4xl font-bold mb-4" style={{ color: '#2d2d2d' }}>Projects</h2>
          <p className="text-sm xl:text-base" style={{ color: '#6c5c3b' }}>Research, development, and creative work — click to explore</p>
        </motion.div>

        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 sm:gap-5 xl:gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;
