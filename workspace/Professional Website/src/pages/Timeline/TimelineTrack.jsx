import { motion } from 'framer-motion';
import TimelineCard from './TimelineCard';

function TimelineTrack({ entries }) {
  // Group entries by year
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
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-700 -translate-x-1/2" />

      {years.map((year, yearIndex) => (
        <div key={year} className="mb-16">
          {/* Year marker */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative flex justify-center mb-8"
          >
            <div className="bg-tl-bg px-6 py-2 border-2 border-gray-700 rounded-full z-10">
              <span className="text-2xl font-bold text-white">{year}</span>
            </div>
          </motion.div>

          {/* Timeline cards for this year */}
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
