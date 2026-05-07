import { motion } from 'framer-motion';
import TimelineCard from './TimelineCard';

function TimelineTrack({ entries }) {
  const groupedByYear = entries.reduce((acc, entry) => {
    if (!acc[entry.year]) {
      acc[entry.year] = [];
    }
    acc[entry.year].push(entry);
    return acc;
  }, {});

  const years = Object.keys(groupedByYear).sort((a, b) => b - a);

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800 -translate-x-1/2" />

      {years.map((year) => (
        <div key={year} className="mb-14">
          {/* Year marker */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative flex justify-center mb-8"
          >
            <div className="bg-tl-bg px-5 py-1.5 border border-gray-700/50 rounded-full z-10
              shadow-lg shadow-black/20">
              <span className="text-xl font-bold text-white tracking-wide">{year}</span>
            </div>
          </motion.div>

          {groupedByYear[year].map((entry, index) => (
            <TimelineCard
              key={entry.id}
              entry={entry}
              index={index}
              side={index % 2 === 0 ? 'left' : 'right'}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default TimelineTrack;
