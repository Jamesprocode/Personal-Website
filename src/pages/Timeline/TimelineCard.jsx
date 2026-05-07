import { motion } from 'framer-motion';
import { useState } from 'react';

function TimelineCard({ entry, index, side }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const colorMap = {
    blue: 'border-tl-blue/30 bg-tl-blue/5 hover:border-tl-blue/50',
    green: 'border-tl-green/30 bg-tl-green/5 hover:border-tl-green/50',
    purple: 'border-tl-purple/30 bg-tl-purple/5 hover:border-tl-purple/50',
    orange: 'border-tl-orange/30 bg-tl-orange/5 hover:border-tl-orange/50',
    gray: 'border-tl-gray/30 bg-tl-gray/5 hover:border-tl-gray/50',
  };

  const dotColorMap = {
    blue: 'bg-tl-blue shadow-tl-blue/30',
    green: 'bg-tl-green shadow-tl-green/30',
    purple: 'bg-tl-purple shadow-tl-purple/30',
    orange: 'bg-tl-orange shadow-tl-orange/30',
    gray: 'bg-tl-gray shadow-tl-gray/30',
  };

  const categoryColorMap = {
    blue: 'text-tl-blue',
    green: 'text-tl-green',
    purple: 'text-tl-purple',
    orange: 'text-tl-orange',
    gray: 'text-tl-gray',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className={`relative flex ${
        side === 'left' ? 'justify-end pr-[52%]' : 'justify-start pl-[52%]'
      } mb-6`}
    >
      {/* Connector dot */}
      <motion.div
        whileHover={{ scale: 1.5 }}
        className={`absolute top-6 left-1/2 w-3 h-3 rounded-full ${
          dotColorMap[entry.color]
        } border-2 border-tl-bg -translate-x-1/2 z-20 shadow-lg`}
      />

      {/* Card */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`cursor-pointer border ${
          colorMap[entry.color]
        } rounded-xl p-5 w-full transition-all duration-300 backdrop-blur-sm`}
      >
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-base font-semibold text-white leading-tight pr-2">{entry.title}</h3>
          <span className={`text-xs ${categoryColorMap[entry.color]} ml-2 shrink-0 font-medium`}>
            {entry.category}
          </span>
        </div>

        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          className="overflow-hidden"
        >
          <p className="text-gray-400 text-sm mt-3 leading-relaxed font-light">
            {entry.description}
          </p>
        </motion.div>

        <div className="text-xs text-gray-600 mt-2">
          {isExpanded ? 'Click to collapse' : 'Click to expand'}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default TimelineCard;
