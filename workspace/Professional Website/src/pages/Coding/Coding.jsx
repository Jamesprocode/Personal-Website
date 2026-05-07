import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import MatrixRain from './MatrixRain';
import ProjectCard from './ProjectCard';
import projects from '../../data/projects';

function Coding() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-code-bg relative overflow-hidden">
        <MatrixRain />

        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-code-green/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-code-cyan/3 rounded-full blur-3xl" />

        <div className="relative z-10 pt-28 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-code-green mb-3 font-mono tracking-tight">
                {'// PROJECTS_'}
              </h1>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-code-green to-transparent mx-auto mb-4" />
              <p className="text-code-cyan/50 text-base font-light">
                Research &middot; Development &middot; Innovation
              </p>
            </motion.div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Coding;
