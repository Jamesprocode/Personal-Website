import { useCallback, useSyncExternalStore } from 'react';

// Shared breakpoint hook. 760px matches the inline `@media (max-width: 760px)`
// rules already used across the site (ProjectShelf grid collapse, etc.) so
// JS-driven layout swaps stay in lockstep with the CSS ones.
export default function useIsMobile(query = '(max-width: 760px)') {
  const subscribe = useCallback((callback) => {
    const mql = window.matchMedia(query);
    mql.addEventListener('change', callback);
    return () => mql.removeEventListener('change', callback);
  }, [query]);

  const getSnapshot = useCallback(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
    [query]
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
