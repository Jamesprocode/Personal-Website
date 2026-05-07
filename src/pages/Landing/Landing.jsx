import PageTransition from '../../components/PageTransition';
import HeroSection from './HeroSection';
import ProjectsSection from './ProjectsSection';
import ContactSection from './ContactSection';

function Landing() {
  return (
    <PageTransition>
      <div style={{ background: 'linear-gradient(to bottom, #f4e8d1, #efe3c9, #f4e8d1)' }}>
        <HeroSection />
        <ProjectsSection />
        <ContactSection />
      </div>
    </PageTransition>
  );
}

export default Landing;
