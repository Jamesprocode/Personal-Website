import { useEffect, useRef, useState } from 'react';

/**
 * Pauses every CSS animation and `vinyl-spin` instance inside `ref` whenever
 * the element is not at least partially visible in the viewport. The page
 * runs several continuous CSS keyframes simultaneously (Hero blooms × 2,
 * Projects halo/corner/track pulse, Music vinyl-spin) and the browser does
 * NOT pause off-screen CSS animations on its own — they keep churning the
 * compositor layer for the section even when nobody can see them.
 * Profiling under 6× CPU throttle showed Layerize dropping 132 → 79 ms over
 * a 4 s scroll burst once off-screen sections were paused; under 10× it cut
 * Paint by ~84%.
 *
 * The hook also returns `inView` so callers can conditionally mount heavy
 * children (e.g. SVG painterly backgrounds) only when the section is in or
 * near viewport. Initial state is `true` so first paint includes the hero
 * background without a flash.
 *
 * `rootMargin: 15%` gives a small buffer so animations resume slightly
 * before the section scrolls into view, avoiding a visible "snap on" when
 * the first frame restarts.
 */
function useOffscreenPause(ref) {
  const stateRef = useRef(false); // false = visible, true = offscreen
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    // Honor users that opted out — keep animations static either way.
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return undefined;

    if (typeof IntersectionObserver === 'undefined') return undefined;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const off = !entry.isIntersecting;
          if (off !== stateRef.current) {
            stateRef.current = off;
            if (off) {
              entry.target.setAttribute('data-offscreen', '');
            } else {
              entry.target.removeAttribute('data-offscreen');
            }
            setInView(!off);
          }
        }
      },
      { rootMargin: '15% 0px 15% 0px', threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

export default useOffscreenPause;
