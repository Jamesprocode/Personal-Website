import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import profileImg from '../../assets/me.JPG';

function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 xl:px-16 pt-20 relative overflow-hidden">
      {/* Subtle animated gradient orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-amber-400/20 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-orange-400/15 blur-3xl"
      />

      <div className="w-full max-w-3xl xl:max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          {/* Profile picture */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-6"
          >
            <img
              src={profileImg}
              alt="James Wang"
              className="w-32 h-32 rounded-full object-cover border-4 border-amber-200 shadow-lg shadow-amber-200/30"
            />
          </motion.div>

          {/* Name */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-amber-900">
            James Wang
          </h1>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mb-8"
          />

          {/* Title */}
          <p className="text-lg md:text-xl text-amber-700/80 mb-10 font-light tracking-wide">
            Music Technology Researcher &middot; Audio Engineer &middot; Developer &middot; Jazz Saxophonist
          </p>

          {/* Description */}
          <p className="text-amber-800/70 mb-12">
            M.S. Music Technology @ Georgia Tech
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center items-center gap-3 mb-4">
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 text-sm font-medium text-amber-50 bg-amber-800 rounded-full
                hover:bg-amber-900 transition-all duration-200"
            >
              Download CV
            </a>
            <Link
              to="/music"
              className="px-6 py-2.5 text-sm text-amber-800 bg-white/50 backdrop-blur-sm border border-amber-200
                rounded-full hover:bg-white/70 hover:border-amber-400 transition-all duration-200"
            >
              Listen to my music &rarr;
            </Link>
          </div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 flex flex-col items-center"
          >
            <p className="text-amber-500/50 text-xs tracking-widest uppercase mb-3">Projects below</p>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="text-amber-500/40 text-xl"
            >
              ↓
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
