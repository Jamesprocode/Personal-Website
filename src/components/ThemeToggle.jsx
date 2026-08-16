import { useRef } from 'react';
import { flushSync } from 'react-dom';
import { motion as Motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import useTheme from '../hooks/useTheme';

/**
 * Sun / moon theme switch. Crossfades + rotates between a sun (light) and a
 * moon (dark) glyph so the flip feels like a physical toggle rather than an
 * icon swap. Colors come from theme tokens so the control itself recolors
 * with the rest of the chrome.
 */
function ThemeToggle({ variant = 'desktop' }) {
  const { isDark, setTheme } = useTheme();
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const transitionInFlight = useRef(false);
  const isMobile = variant === 'mobile';
  const size = isMobile ? 26 : 20;

  const commitTheme = (nextTheme) => {
    flushSync(() => setTheme(nextTheme));
    document.documentElement.setAttribute('data-theme', nextTheme);
    document.documentElement.style.colorScheme = nextTheme;
  };

  const runFallbackReveal = ({ nextTheme, originX, originY, startRadius, revealRadius }) => {
    if (typeof document.body.animate !== 'function') {
      commitTheme(nextTheme);
      return;
    }

    const reveal = document.createElement('span');
    reveal.className = `theme-reveal-fallback theme-reveal-fallback--${nextTheme}`;
    reveal.setAttribute('aria-hidden', 'true');
    document.body.appendChild(reveal);
    transitionInFlight.current = true;

    const circle = (radius) => `circle(${radius}px at ${originX}px ${originY}px)`;
    const expansion = reveal.animate(
      [
        { clipPath: circle(startRadius) },
        { clipPath: circle(revealRadius) },
      ],
      {
        duration: 460,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'forwards',
      },
    );

    expansion.finished
      .then(() => {
        commitTheme(nextTheme);
        return reveal.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: 110, easing: 'cubic-bezier(0.25, 1, 0.5, 1)', fill: 'forwards' },
        ).finished;
      })
      .catch(() => commitTheme(nextTheme))
      .finally(() => {
        reveal.remove();
        transitionInFlight.current = false;
      });
  };

  const handleThemeToggle = (event) => {
    const nextTheme = isDark ? 'light' : 'dark';
    if (transitionInFlight.current) return;

    if (reduceMotion) {
      setTheme(nextTheme);
      return;
    }

    const buttonBounds = event.currentTarget.getBoundingClientRect();
    const originX = buttonBounds.left + buttonBounds.width / 2;
    const originY = buttonBounds.top + buttonBounds.height / 2;
    const farthestX = Math.max(originX, window.innerWidth - originX);
    const farthestY = Math.max(originY, window.innerHeight - originY);
    const revealRadius = Math.hypot(farthestX, farthestY) + 2;
    const startRadius = Math.max(buttonBounds.width, buttonBounds.height) / 2;
    const root = document.documentElement;

    if (typeof document.startViewTransition !== 'function') {
      runFallbackReveal({ nextTheme, originX, originY, startRadius, revealRadius });
      return;
    }

    root.style.setProperty('--theme-transition-x', `${originX}px`);
    root.style.setProperty('--theme-transition-y', `${originY}px`);
    root.style.setProperty('--theme-transition-start-radius', `${startRadius}px`);
    root.style.setProperty('--theme-transition-radius', `${revealRadius}px`);
    root.classList.add('theme-transitioning');
    transitionInFlight.current = true;

    try {
      const transition = document.startViewTransition(() => {
        commitTheme(nextTheme);
      });

      transition.finished
        .catch(() => undefined)
        .finally(() => {
          transitionInFlight.current = false;
          root.classList.remove('theme-transitioning');
        });
    } catch {
      transitionInFlight.current = false;
      root.classList.remove('theme-transitioning');
      commitTheme(nextTheme);
    }
  };

  return (
    <button
      type="button"
      onClick={handleThemeToggle}
      aria-label={t(isDark ? 'theme.switchToLight' : 'theme.switchToDark')}
      title={t(isDark ? 'theme.switchToLight' : 'theme.switchToDark')}
      className="relative inline-flex items-center justify-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a265]/80"
      style={{
        width: isMobile ? 44 : 34,
        height: isMobile ? 44 : 34,
        // Gold reads well on the dark espresso navbar, but brass-on-tan in
        // light mode is near-invisible (~1.2:1). Use the strong text token
        // (walnut) in light so the glyph stays a legible control.
        color: isDark ? 'var(--accent)' : 'var(--text-strong)',
        background: isMobile ? 'var(--surface)' : 'transparent',
        border: isMobile ? '1px solid var(--border)' : 'none',
        boxShadow: isMobile ? 'inset 0 1px 0 rgba(253,244,220,0.38)' : 'none',
        cursor: 'pointer',
      }}
    >
      <Motion.span
        key={isDark ? 'moon' : 'sun'}
        initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'inline-flex' }}
      >
        {isDark ? (
          // Moon
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              fill="currentColor"
            />
          </svg>
        ) : (
          // Sun
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        )}
      </Motion.span>
    </button>
  );
}

export default ThemeToggle;
