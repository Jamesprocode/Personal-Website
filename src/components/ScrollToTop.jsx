import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Resets scroll to the top on every route change.
// If the URL has a hash (e.g. /#research-projects-top), it does nothing —
// the destination page is expected to handle scrolling to that anchor.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}

export default ScrollToTop;
