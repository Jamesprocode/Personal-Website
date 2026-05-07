import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function TimelinePreview() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 bg-tl-bg relative overflow-hidden">
      {/* Animated timeline line */}
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-tl-blue/20 to-transparent origin-top"
      />

      {/* Floating dots */}
      {[
        { top: '20%', left: '30%', color: 'bg-tl-blue', delay: 0 },
        { top: '40%', left: '70%', color: 'bg-tl-green', delay: 1 },
        { top: '60%', left: '25%', color: 'bg-tl-purple', delay: 2 },
        { top: '75%', left: '65%', color: 'bg-tl-orange', delay: 3 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.5, 1] }}
          transition={{ duration: 4, repeat: Infinity, delay: dot.delay }}
          className={`absolute w-2 h-2 rounded-full ${dot.color}`}
          style={{ top: dot.top, left: dot.left }}
        />
      ))}

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
            className="w-24 h-24 rounded-full bg-gradient-to-br from-tl-blue/10 to-tl-purple/10
              flex items-center justify-center mb-8 border border-white/10 backdrop-blur-sm"
          >
            <span className="text-5xl">⏱️</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Timeline
          </h2>

          <div className="w-16 h-0.5 bg-gradient-to-r from-tl-blue via-tl-purple to-tl-orange mb-6" />

          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Journey through 30+ milestones spanning education, research, music, and industry.
            Filter by category and explore achievements from 2020 to present.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {[
              { name: 'Education', color: 'border-tl-blue text-tl-blue bg-tl-blue/10' },
              { name: 'Research', color: 'border-tl-green text-tl-green bg-tl-green/10' },
              { name: 'Music Software', color: 'border-tl-purple text-tl-purple bg-tl-purple/10' },
              { name: 'Music', color: 'border-tl-orange text-tl-orange bg-tl-orange/10' },
              { name: 'Industry', color: 'border-tl-gray text-tl-gray bg-tl-gray/10' },
            ].map((cat) => (
              <div key={cat.name} className={`px-4 py-2 rounded-full border ${cat.color} text-sm`}>
                {cat.name}
              </div>
            ))}
          </motion.div>

          <Link to="/timeline">
            <motion.button
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-4 bg-gradient-to-r from-tl-blue via-tl-purple to-tl-orange
                text-white font-semibold text-lg rounded-full hover:shadow-xl hover:shadow-tl-purple/20
                transition-all duration-300 flex items-center gap-2"
            >
              Explore Timeline
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

export default TimelinePreview;
