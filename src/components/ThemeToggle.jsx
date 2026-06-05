import { motion as Motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import useTheme from '../hooks/useTheme';

/**
 * Sun / moon theme switch. Crossfades + rotates between a sun (light) and a
 * moon (dark) glyph so the flip feels like a physical toggle rather than an
 * icon swap. Colors come from theme tokens so the control itself recolors
 * with the rest of the chrome.
 */
function ThemeToggle({ variant = 'desktop' }) {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const isMobile = variant === 'mobile';
  const size = isMobile ? 26 : 20;

  return (
    <button
      type="button"
      onClick={toggleTheme}
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
