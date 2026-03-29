import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function TimelinePreview() {
  return (
    <section className="h-screen flex items-center justify-center px-6 bg-tl-bg relative overflow-hidden">
      {/* Animated timeline line */}
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-tl-blue via-tl-green to-tl-purple opacity-20 origin-top"
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
            ⏱️
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Timeline
          </h2>

          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Journey through 30+ milestones spanning education, research, music, and industry.
            Filter by category and explore achievements from 2020 to present.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <div className="px-4 py-2 bg-tl-blue/20 rounded-lg border border-tl-blue">
              <span className="text-white text-sm">📚 Education</span>
            </div>
            <div className="px-4 py-2 bg-tl-green/20 rounded-lg border border-tl-green">
              <span className="text-white text-sm">🔬 Research</span>
            </div>
            <div className="px-4 py-2 bg-tl-purple/20 rounded-lg border border-tl-purple">
              <span className="text-white text-sm">💻 Music Software</span>
            </div>
            <div className="px-4 py-2 bg-tl-orange/20 rounded-lg border border-tl-orange">
              <span className="text-white text-sm">🎵 Music</span>
            </div>
            <div className="px-4 py-2 bg-tl-gray/20 rounded-lg border border-tl-gray">
              <span className="text-white text-sm">🏢 Industry</span>
            </div>
          </motion.div>

          <Link to="/timeline">
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 bg-gradient-to-r from-tl-blue via-tl-purple to-tl-orange
                text-white font-bold text-xl rounded-xl hover:shadow-2xl transition-all"
            >
              Explore Timeline →
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default TimelinePreview;
