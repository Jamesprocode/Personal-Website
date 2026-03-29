import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function MusicPreview() {
  return (
    <section className="h-screen flex items-center justify-center px-6 bg-gradient-to-br from-music-bg via-music-wood to-music-bg relative overflow-hidden">
      {/* Animated vinyl record background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
        whileInView={{ opacity: 0.1, scale: 1, rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        viewport={{ once: false }}
        className="absolute w-96 h-96 rounded-full border-8 border-music-gold/30"
      />

      <div className="relative z-10 max-w-6xl w-full mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            className="text-8xl mb-8"
          >
            🎵
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-bold text-music-cream mb-6">
            Music
          </h2>

          <p className="text-xl md:text-2xl text-music-gold mb-8 max-w-3xl mx-auto">
            Step into a vintage vinyl listening room. Play tracks on an interactive turntable
            with authentic controls and real-time audio visualization.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <div className="px-4 py-2 bg-music-wood/50 rounded-lg border border-music-gold/30">
              <span className="text-music-cream text-sm">🎚️ VU Meters</span>
            </div>
            <div className="px-4 py-2 bg-music-wood/50 rounded-lg border border-music-gold/30">
              <span className="text-music-cream text-sm">🎛️ Rotary Knobs</span>
            </div>
            <div className="px-4 py-2 bg-music-wood/50 rounded-lg border border-music-gold/30">
              <span className="text-music-cream text-sm">⌨️ Keyboard Controls</span>
            </div>
          </motion.div>

          <Link to="/music">
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 bg-music-gold text-music-wood font-bold text-xl rounded-xl
                hover:bg-music-gold/90 transition-all shadow-2xl"
            >
              Enter Listening Room →
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default MusicPreview;
