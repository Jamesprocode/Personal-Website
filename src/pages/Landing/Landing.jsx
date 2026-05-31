import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageTransition from '../../components/PageTransition';
import HeroSection from './HeroSection';
import ProjectsSection from './ProjectsSection';
import MusicPreview from './MusicPreview';
import TimelinePreview from './TimelinePreview';
import ContactSection from './ContactSection';

function Landing() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace('#', '');
    let cancelled = false;
    const scroll = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    const t = window.setTimeout(scroll, 60);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [hash]);

  return (
    <PageTransition scene="landing">
      <main className="landing-snap" style={{ width: '100%', backgroundColor: 'var(--bg)' }}>
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
