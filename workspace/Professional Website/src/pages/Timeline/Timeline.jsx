import { useState } from 'react';
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
      <div className="min-h-screen bg-tl-bg pt-20 px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Journey Through Time
            </h1>
            <p className="text-gray-400 text-lg">
              A chronological timeline of milestones, projects, and experiences
            </p>
          </div>

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
