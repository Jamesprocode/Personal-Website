import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold tracking-tight hover:text-gray-300 transition-colors">
          James Wang
        </Link>

        <div className="flex gap-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              isActive('/') ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link
            to="/music"
            className={`text-sm font-medium transition-colors ${
              isActive('/music') ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Music
          </Link>
          <Link
            to="/code"
            className={`text-sm font-medium transition-colors ${
              isActive('/code') ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Code
          </Link>
          <Link
            to="/timeline"
            className={`text-sm font-medium transition-colors ${
              isActive('/timeline') ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Timeline
          </Link>
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            CV
          </a>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
