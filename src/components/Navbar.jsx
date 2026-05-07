import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLanding = location.pathname === '/';

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/music', label: 'Music' },
    { path: '/timeline', label: 'Timeline' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 shadow-md"
        style={{ backgroundColor: isLanding ? '#c4b69c' : '#1a1a1a' }}
      >
        <div className="w-full max-w-screen-2xl mx-auto flex justify-between items-center" style={{ padding: '1.25rem clamp(1.5rem, 4vw, 4rem)' }}>
          <Link
            to="/"
            className="text-lg font-bold tracking-tight transition-colors duration-300"
            style={{ color: isLanding ? '#2d2d2d' : '#ffffff' }}
          >
            James Wang
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-4 py-2 text-sm font-semibold transition-colors duration-300 rounded-full"
                style={{
                  color: isLanding
                    ? (isActive(link.path) ? '#2d2d2d' : '#6c5c3b')
                    : (isActive(link.path) ? '#ffffff' : 'rgba(255,255,255,0.6)')
                }}
              >
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: isLanding ? 'rgba(45,45,45,0.08)' : 'rgba(255,255,255,0.1)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-4 py-2 text-sm font-semibold transition-colors duration-300 rounded-full"
              style={{ color: isLanding ? '#6c5c3b' : 'rgba(255,255,255,0.6)' }}
            >
              CV
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
          >
            <motion.div
              animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              className="w-5 h-0.5 rounded-full"
              style={{ backgroundColor: isLanding ? '#2d2d2d' : '#ffffff' }}
            />
            <motion.div
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-5 h-0.5 rounded-full"
              style={{ backgroundColor: isLanding ? '#2d2d2d' : '#ffffff' }}
            />
            <motion.div
              animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
              className="w-5 h-0.5 rounded-full"
              style={{ backgroundColor: isLanding ? '#2d2d2d' : '#ffffff' }}
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
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 px-8 md:hidden"
          >
            <div className="flex flex-col gap-2">
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
                  CV
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
