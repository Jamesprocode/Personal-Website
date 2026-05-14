import PageTransition from '../../components/PageTransition';
import HeroSection from './HeroSection';
import ProjectsSection from './ProjectsSection';
import MusicPreview from './MusicPreview';
import TimelinePreview from './TimelinePreview';
import ContactSection from './ContactSection';

function Landing() {
  return (
    <PageTransition>
      <main style={{ width: '100%', backgroundColor: '#f4e8d1' }}>
        <HeroSection />
        <ProjectsSection />
        <MusicPreview />
        <TimelinePreview />
        <ContactSection />
      </main>
    </PageTransition>
  );
}

export default Landing;
