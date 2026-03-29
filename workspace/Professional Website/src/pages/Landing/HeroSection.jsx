import { motion } from 'framer-motion';

function HeroSection() {
  return (
    <section className="h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight text-amber-900 text-center"
          >
            James Wang
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-amber-700 mb-8 font-light text-center"
          >
            Jazz Saxophonist / Music Tech Researcher / Audio Engineer / Developer
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full text-center mb-12"
          >
            <p className="mb-4 text-center text-amber-800">
              M.S. Music Technology @ Georgia Tech
            </p>
            <p className="text-center text-amber-800 leading-relaxed max-w-2xl mx-auto px-4">
              Building the future of music through AI, audio engineering, and creative code.
              From deep learning for music transcription to gesture-controlled improvisation systems.
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center items-center gap-4 mb-8 mx-auto"
          >
            <motion.a
              href="https://github.com/Jamesprocode"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-3 bg-amber-100 border-2 border-amber-300
                rounded-lg hover:bg-amber-200 hover:border-amber-400 transition-all shadow-md"
            >
              <svg className="w-5 h-5 text-amber-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="text-sm font-semibold text-amber-900">GitHub</span>
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/in/jiayi-wang-166b271a9/?locale=en_US"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-3 bg-amber-100 border-2 border-amber-300
                rounded-lg hover:bg-amber-200 hover:border-amber-400 transition-all shadow-md"
            >
              <svg className="w-5 h-5 text-amber-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span className="text-sm font-semibold text-amber-900">LinkedIn</span>
            </motion.a>

            <motion.a
              href="https://scholar.google.com/citations?user=GeNyFXAAAAAJ&hl=en"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2  px-5 py-3 bg-amber-100 border-2 border-amber-300
                rounded-lg hover:bg-amber-200 hover:border-amber-400 transition-all shadow-md"
            >
              <svg className="w-5 h-5 text-amber-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10zm-1-17h2v2h-2v-2zm0 4h2v8h-2v-8z"/>
              </svg>
              <span className="text-sm font-semibold text-amber-900">Scholar</span>
            </motion.a>

            <motion.a
              href="mailto:jameswangjiayi@gmail.com"
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-3 bg-amber-100 border-2 border-amber-300
                rounded-lg hover:bg-amber-200 hover:border-amber-400 transition-all shadow-md"
            >
              <svg className="w-5 h-5 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-semibold text-amber-900">Email</span>
            </motion.a>

            <motion.a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-3 bg-amber-800 text-amber-50 border-2 border-amber-800
                rounded-lg hover:bg-amber-900 transition-all shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-semibold">CV</span>
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center"
          >
            <p className="text-amber-600 text-sm text-center">Scroll to explore</p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-2xl mt-2 text-amber-700 text-center mx-auto"
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
