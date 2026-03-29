import { motion } from 'framer-motion';

function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group"
    >
      <div
        className="relative bg-black/40 backdrop-blur-md border-2 border-code-green/30
        hover:border-code-cyan hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]
        rounded-xl p-6 transition-all duration-300 h-full"
      >
        {/* Scanline effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10
          bg-gradient-to-b from-transparent via-code-green to-transparent
          animate-pulse rounded-xl"
        />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-code-green font-mono group-hover:text-code-cyan
              transition-colors">
              {project.title}
            </h3>
            <span className="text-xs text-gray-500 font-mono whitespace-nowrap ml-2">
              #{project.id.toString().padStart(2, '0')}
            </span>
          </div>

          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-mono bg-code-dim text-code-green
                  border border-code-green/30 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
            <span className="text-xs text-gray-500 font-mono">{project.period}</span>

            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-code-cyan hover:text-code-green
                  transition-colors text-sm font-mono"
              >
                <span>View Code</span>
                <span>→</span>
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProjectCard;
