import PageTransition from '../../components/PageTransition';
import ProjectsSection from '../Landing/ProjectsSection';

function Projects() {
  return (
    <PageTransition scene="projects">
      <main style={{ width: '100%', minHeight: '100svh', backgroundColor: 'var(--bg)' }}>
        <ProjectsSection />
      </main>
    </PageTransition>
  );
}

export default Projects;
