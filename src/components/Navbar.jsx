import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';

function Navbar() {
  const location = useLocation();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Only play the slide-in entrance once the tab is actually visible. The
  // navbar's RESTING style (no `.navbar-enter` class) is the visible
  // position, so a tab that loads in the background never gets stuck with
  // the bar — and the theme/lang toggles — parked off-screen. When the user
  // focuses the tab the class is added and the slide-in plays normally.
  const [entered, setEntered] = useState(
    () => typeof document === 'undefined' || document.visibilityState === 'visible'
  );

  useEffect(() => {
    if (entered) return undefined;
    const onVis = () => {
      if (document.visibilityState === 'visible') setEntered(true);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [entered]);

  useEffect(() => {
    const id = window.setTimeout(() => setMobileOpen(false), 0);
    return () => window.clearTimeout(id);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/music', label: t('nav.music') },
    { path: '/timeline', label: t('nav.timeline') },
  ];

  // Colors now come from theme tokens so the navbar flips with the global
  // light/dark toggle instead of being keyed to the route.
  const surfaceBg = 'var(--nav-bg)';
  const brandColor = 'var(--text-strong)';
  const activeColor = 'var(--text-strong)';
  const restColor = 'var(--text-muted)';
  const hamburgerColor = 'var(--text-strong)';

  // Brass-gold cross-room thread — the only chrome the navbar permits.
  // Active nav item gets a small brass LED dot; the navbar's bottom edge
  // is finished with a 1 px brass hairline that runs the full width.
  const brass = '#c4a265';

  return (
    <>
      <nav
        className={`${entered ? 'navbar-enter ' : ''}fixed top-0 left-0 right-0 z-50 shadow-md`}
        style={{
          backgroundColor: surfaceBg,
          // Single brass hairline along the bottom — the cross-room thread
          // running through the navbar. The only chrome the header carries.
          borderBottom: `1px solid ${brass}40`,
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{
            width: '100%',
            maxWidth: 'min(82rem, 96vw)',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '1.25rem clamp(1.5rem, 4vw, 4rem)',
          }}
        >
          <Link
            to="/"
            className="text-lg font-bold tracking-tight transition-colors duration-300"
            style={{
              color: brandColor,
              // Reserve enough room for the wider English wordmark so the
              // toggle and nav don't shift when the brand becomes 王嘉毅.
              minWidth: '7.5rem',
              display: 'inline-block',
            }}
          >
            {t('nav.brand')}
          </Link>

          {/* Desktop nav — clean text with a single brass LED dot next to
              the active link. Each slot has a fixed min-width so EN/ZH
              never shift the layout. */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <LanguageToggle />
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative inline-flex items-center justify-center gap-2 text-sm font-medium transition-colors duration-200"
                  style={{
                    color: active ? activeColor : restColor,
                    minWidth: link.path === '/timeline' ? '4.5rem' : '3.5rem',
                  }}
                >
                  {/* Brass LED — lit amber jewel with a glow halo. Hot
                      center so it reads as a status light against either
                      cream or espresso surfaces. */}
                  <span
                    aria-hidden="true"
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 9999,
                      background: active
                        ? 'radial-gradient(circle at 35% 30%, #fff3c2 0%, #f5b942 40%, #b07a18 100%)'
                        : 'transparent',
                      boxShadow: active
                        ? '0 0 6px rgba(245,185,66,0.75), 0 0 2px rgba(176,122,24,0.9)'
                        : 'none',
                      transition: 'background 220ms ease, box-shadow 220ms ease',
                    }}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center text-sm font-medium transition-colors duration-200"
              style={{ color: restColor, minWidth: '2.5rem' }}
            >
              {t('nav.cv')}
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col items-center justify-center gap-1.5 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a265]/80"
            aria-label={t(mobileOpen ? 'nav.closeMenu' : 'nav.openMenu')}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
            style={{
              width: 44,
              height: 44,
              border: `1px solid ${brass}55`,
              backgroundColor: mobileOpen ? 'var(--hover-bg)' : 'rgba(196,162,101,0.08)',
              boxShadow: mobileOpen
                ? 'inset 0 0 0 1px rgba(196,162,101,0.22)'
                : 'inset 0 1px 0 rgba(253,244,220,0.18)',
            }}
          >
            <Motion.div
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="w-5 h-0.5 rounded-full"
              style={{ backgroundColor: hamburgerColor }}
            />
            <Motion.div
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.16 }}
              className="w-5 h-0.5 rounded-full"
              style={{ backgroundColor: hamburgerColor }}
            />
            <Motion.div
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="w-5 h-0.5 rounded-full"
              style={{ backgroundColor: hamburgerColor }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <Motion.div
            id="mobile-nav-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 md:hidden"
            style={{
              // Match the cream parlor instead of the dark espresso. The
              // tinted backdrop keeps focus on the menu without a hard
              // theme swap. Padding set inline because the universal
              // reset zeroes Tailwind padding utilities.
              backgroundColor: 'var(--overlay-bg)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              paddingTop: 'clamp(6rem, 12vh, 7rem)',
              paddingLeft: 'clamp(1rem, 6vw, 2rem)',
              paddingRight: 'clamp(1rem, 6vw, 2rem)',
            }}
          >
            <div className="flex flex-col" style={{ gap: '0.5rem', maxWidth: 440, margin: '0 auto' }}>
              <Motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  marginBottom: '1.1rem',
                  display: 'grid',
                  gridTemplateColumns: '44px minmax(0, 1fr)',
                  alignItems: 'center',
                  gap: '0.7rem',
                }}
              >
                <ThemeToggle variant="mobile" />
                <LanguageToggle variant="mobile" />
              </Motion.div>
              {navLinks.map((link, i) => (
                <Motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className="block text-2xl font-medium rounded-xl transition-colors"
                    style={{
                      color: isActive(link.path) ? 'var(--text-strong)' : 'var(--text-muted)',
                      backgroundColor: isActive(link.path) ? 'var(--hover-bg)' : 'transparent',
                      padding: '1rem',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive(link.path)) {
                        e.currentTarget.style.color = 'var(--text-strong)';
                        e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(link.path)) {
                        e.currentTarget.style.color = 'var(--text-muted)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                </Motion.div>
              ))}
              <Motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
              >
                <a
                  href="/cv.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-2xl font-medium rounded-xl transition-colors"
                  style={{ color: 'var(--text-muted)', padding: '1rem' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-strong)';
                    e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {t('nav.cv')}
                </a>
              </Motion.div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
