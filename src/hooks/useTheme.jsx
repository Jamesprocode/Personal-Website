/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'theme'; // 'light' | 'dark' — absent means "follow system"

/**
 * Site-wide light/dark theme.
 *
 * - Default is "follow system": with no stored preference we resolve the
 *   active theme from `prefers-color-scheme` and keep tracking OS changes.
 * - Once the user flips the toggle we persist an explicit 'light' / 'dark'
 *   in localStorage and stop following the system.
 *
 * The resolved theme is mirrored onto `<html data-theme="…">` so plain CSS
 * (the `[data-theme="dark"]` token overrides in index.css) can switch every
 * page's palette without each component subscribing to React state. The
 * `theme` value is still exposed for the handful of components that paint
 * with JS-driven colors (SVG painterly backgrounds, canvas, etc.).
 */
const getSystemTheme = () =>
  window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* localStorage may be unavailable (private mode) — fall through */
  }
  return getSystemTheme();
};

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);
  // Whether we're still following the OS (no explicit choice stored).
  const [followSystem, setFollowSystem] = useState(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return !(stored === 'light' || stored === 'dark');
    } catch {
      return true;
    }
  });

  // Reflect the resolved theme onto <html> for the CSS token system.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  // While following the system, react to OS theme changes live.
  useEffect(() => {
    if (!followSystem || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => setThemeState(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [followSystem]);

  const setTheme = useCallback((next) => {
    setThemeState(next);
    setFollowSystem(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore persistence failures */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const value = useMemo(
    () => ({ theme, isDark: theme === 'dark', followSystem, setTheme, toggleTheme }),
    [theme, followSystem, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}

export default useTheme;
