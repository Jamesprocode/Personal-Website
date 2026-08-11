import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const REVEAL_POINT = 0.72;

function readVisibility(pathname) {
  if (pathname !== '/') return true;
  if (typeof window === 'undefined') return false;
  return window.scrollY >= window.innerHeight * REVEAL_POINT;
}

/**
 * The Home cover deliberately keeps the site chrome quiet until the image
 * curtain has nearly left the viewport. The wordmark remains visible; callers
 * use this hook for the rest of the navigation and the fixed footer.
 */
export default function useHomeContentVisible() {
  const { pathname, hash } = useLocation();
  const [visible, setVisible] = useState(() => {
    if (pathname === '/' && hash === '#intro') return true;
    return readVisibility(pathname);
  });

  useEffect(() => {
    if (pathname !== '/') {
      return undefined;
    }

    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setVisible(readVisibility(pathname));
      });
    };

    // A Home nav link targets the intro directly. Keep chrome visible while
    // Landing resolves that anchor, then let scroll position take over so an
    // upward scroll can still bring the cover back.
    let anchorTimer;
    if (hash === '#intro') {
      frame = window.requestAnimationFrame(() => setVisible(true));
      anchorTimer = window.setTimeout(update, 140);
    } else {
      update();
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(anchorTimer);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [pathname, hash]);

  return pathname !== '/' ? true : visible;
}
