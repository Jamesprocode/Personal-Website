import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageToggle from './LanguageToggle';

function Navbar() {
  const location = useLocation();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLanding = location.pathname === '/';
  const isTimeline = location.pathname === '/timeline';
  const isCream = isLanding || isTimeline;

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/music', label: t('nav.music') },
    { path: '/timeline', label: t('nav.timeline') },
  ];

  const surfaceBg = isCream ? '#c4b69c' : '#1a1a1a';
  const brandColor = isCream ? '#2d2d2d' : '#ffffff';
  const activeColor = isCream ? '#2d2d2d' : '#ffffff';
  const restColor = isCream ? '#6c5c3b' : 'rgba(255,255,255,0.6)';
  const hamburgerColor = isCream ? '#2d2d2d' : '#ffffff';

  // Brass-gold cross-room thread — the only chrome the navbar permits.
  // Active nav item gets a small brass LED dot; the navbar's bottom edge
  // is finished with a 1 px brass hairline that runs the full width.
  const brass = '#c4a265';
  const brassLight = '#d4b76e';
  const brassDark = '#8c6e3b';

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 shadow-md"
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
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            aria-label={t(mobileOpen ? 'nav.closeMenu' : 'nav.openMenu')}
            aria-expanded={mobileOpen}
          >
            <motion.div
              animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              className="w-5 h-0.5 rounded-full"
              style={{ backgroundColor: hamburgerColor }}
            />
            <motion.div
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-5 h-0.5 rounded-full"
              style={{ backgroundColor: hamburgerColor }}
            />
            <motion.div
              animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
              className="w-5 h-0.5 rounded-full"
              style={{ backgroundColor: hamburgerColor }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-xl pt-24 px-8 md:hidden"
          >
            <div className="flex flex-col gap-2">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="mb-4"
              >
                <LanguageToggle variant="mobile" />
              </motion.div>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className={`block px-4 py-4 text-2xl font-medium rounded-xl transition-colors ${
                      isActive(link.path)
                        ? 'text-white bg-white/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
              >
                <a
                  href="/cv.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-4 text-2xl font-medium text-gray-400
                    hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  {t('nav.cv')}
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
