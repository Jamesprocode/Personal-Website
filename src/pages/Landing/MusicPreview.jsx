import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function MusicPreview() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-br from-music-bg via-music-wood to-music-bg relative overflow-hidden">
      {/* Animated vinyl grooves */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.06, scale: 1 }}
            viewport={{ once: false }}
            animate={{ rotate: 360 }}
            transition={{ duration: 30 + i * 10, repeat: Infinity, ease: 'linear' }}
            className="absolute rounded-full border border-music-gold/30"
            style={{ width: `${300 + i * 150}px`, height: `${300 + i * 150}px` }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl w-full mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 80 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-music-gold/20 to-music-wood
              flex items-center justify-center mb-8 border border-music-gold/30"
          >
            <span className="text-5xl">🎵</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold text-music-cream mb-4 tracking-tight">
            Music
          </h2>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-music-gold to-transparent mb-6" />

          <p className="text-lg md:text-xl text-music-gold/80 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Step into a vintage vinyl listening room. Play tracks on an interactive turntable
            with authentic controls and real-time audio visualization.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {['VU Meters', 'Rotary Knobs', 'Keyboard Controls'].map((label) => (
              <div key={label} className="px-4 py-2 bg-music-gold/10 rounded-full border border-music-gold/20
                backdrop-blur-sm">
                <span className="text-music-cream/80 text-sm">{label}</span>
              </div>
            ))}
          </motion.div>

          <Link to="/music">
            <motion.button
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-4 bg-music-gold text-music-wood font-semibold text-lg rounded-full
                hover:bg-music-gold/90 transition-all duration-300 shadow-xl shadow-music-gold/20
                flex items-center gap-2"
            >
              Enter Listening Room
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default MusicPreview;
