import { useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import MatrixRain from './MatrixRain';
import ProjectCard from './ProjectCard';
import projects from '../../data/projects';

function Coding() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-code-bg relative overflow-hidden">
        <MatrixRain />

        <div className="relative z-10 pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-code-green mb-4 font-mono">
                {'// PROJECTS_'}
              </h1>
              <p className="text-code-cyan text-lg">
                Research • Development • Innovation
              </p>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
