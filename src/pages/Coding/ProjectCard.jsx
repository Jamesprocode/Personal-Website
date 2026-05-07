import { motion } from 'framer-motion';

function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div
        className="relative bg-black/30 backdrop-blur-md border border-code-green/15
        hover:border-code-cyan/40 hover:shadow-[0_0_30px_rgba(0,255,65,0.08)]
        rounded-2xl p-6 transition-all duration-500 h-full"
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-code-green/30 to-transparent
          group-hover:via-code-cyan/50 transition-all duration-500" />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-code-green/90 font-mono group-hover:text-code-cyan
              transition-colors duration-300 leading-tight pr-4">
              {project.title}
            </h3>
            <span className="text-xs text-gray-600 font-mono whitespace-nowrap mt-1">
              #{project.id.toString().padStart(2, '0')}
            </span>
          </div>

          <p className="text-gray-400 text-sm mb-4 leading-relaxed font-light">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs font-mono bg-code-dim/40 text-code-green/70
                  border border-code-green/10 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
            <span className="text-xs text-gray-500 font-mono">{project.period}</span>

            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 text-code-cyan/60 hover:text-code-green
                  transition-colors duration-300 text-sm font-mono"
              >
                <span>View Code</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProjectCard;
