import { useState, useEffect } from 'react';

// Shared breakpoint hook. 760px matches the inline `@media (max-width: 760px)`
// rules already used across the site (ProjectShelf grid collapse, etc.) so
// JS-driven layout swaps stay in lockstep with the CSS ones.
export default function useIsMobile(query = '(max-width: 760px)') {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setIsMobile(e.matches);
    // Sync once in case the viewport changed between render and effect.
    setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return isMobile;
}
