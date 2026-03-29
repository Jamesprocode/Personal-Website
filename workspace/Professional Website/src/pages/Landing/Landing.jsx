import PageTransition from '../../components/PageTransition';
import HeroSection from './HeroSection';
import MusicPreview from './MusicPreview';
import CodePreview from './CodePreview';
import TimelinePreview from './TimelinePreview';
import ContactSection from './ContactSection';

function Landing() {
  return (
    <PageTransition>
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <HeroSection />
        <MusicPreview />
        <CodePreview />
        <TimelinePreview />
        <ContactSection />
      </div>
    </PageTransition>
  );
}

export default Landing;
