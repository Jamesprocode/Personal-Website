import { motion } from 'framer-motion';
import { useState } from 'react';

function TimelineCard({ entry, index, side }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const colorMap = {
    blue: 'border-tl-blue bg-tl-blue/10',
    green: 'border-tl-green bg-tl-green/10',
    purple: 'border-tl-purple bg-tl-purple/10',
    orange: 'border-tl-orange bg-tl-orange/10',
    gray: 'border-tl-gray bg-tl-gray/10',
  };

  const dotColorMap = {
    blue: 'bg-tl-blue',
    green: 'bg-tl-green',
    purple: 'bg-tl-purple',
    orange: 'bg-tl-orange',
    gray: 'bg-tl-gray',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`relative flex ${
        side === 'left' ? 'justify-end pr-[52%]' : 'justify-start pl-[52%]'
      } mb-8`}
    >
      {/* Connector dot */}
      <motion.div
        whileHover={{ scale: 1.3 }}
        className={`absolute top-6 left-1/2 w-4 h-4 rounded-full ${
          dotColorMap[entry.color]
        } border-2 border-tl-bg -translate-x-1/2 z-20`}
      />

      {/* Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`cursor-pointer border-2 ${
          colorMap[entry.color]
        } rounded-lg p-6 w-full transition-all duration-300`}
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-white">{entry.title}</h3>
          <span className="text-xs text-gray-400 ml-2 shrink-0">
            {entry.category}
          </span>
        </div>

        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          className="overflow-hidden"
        >
          <p className="text-gray-300 text-sm mt-3 leading-relaxed">
            {entry.description}
          </p>
        </motion.div>

        <div className="text-xs text-gray-500 mt-3">
          {isExpanded ? 'Click to collapse' : 'Click to expand'}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default TimelineCard;
