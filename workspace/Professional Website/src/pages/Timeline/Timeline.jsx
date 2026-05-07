import { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import TimelineTrack from './TimelineTrack';
import CategoryFilter from './CategoryFilter';
import timeline from '../../data/timeline';

function Timeline() {
  const [activeFilters, setActiveFilters] = useState([
    'Education',
    'Research',
    'Music Software',
    'Music',
    'Industry',
  ]);

  const filteredTimeline = timeline.filter((entry) =>
    activeFilters.includes(entry.category)
  );

  const toggleFilter = (category) => {
    setActiveFilters((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-tl-bg pt-24 px-6 pb-28 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-tl-blue/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-tl-purple/3 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
              Journey Through Time
            </h1>
            <div className="w-16 h-0.5 bg-gradient-to-r from-tl-blue via-tl-purple to-tl-orange mx-auto mb-4" />
            <p className="text-gray-500 text-base font-light">
              A chronological timeline of milestones, projects, and experiences
            </p>
          </motion.div>

          <CategoryFilter
            activeFilters={activeFilters}
            onToggleFilter={toggleFilter}
          />

          <TimelineTrack entries={filteredTimeline} />
        </div>
      </div>
    </PageTransition>
  );
}

export default Timeline;
