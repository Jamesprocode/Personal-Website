import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageTransition from '../../components/PageTransition';
import HomeExperience from './HomeExperience';

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
        if (id === 'intro') {
          window.scrollTo({ top: el.offsetTop, left: 0, behavior: 'instant' });
          window.dispatchEvent(new CustomEvent('home-curtain-request', { detail: { destination: 'intro' } }));
        } else {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
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
      <main style={{ width: '100%', backgroundColor: 'var(--bg)' }}>
        <HomeExperience />
      </main>
    </PageTransition>
  );
}

export default Landing;
