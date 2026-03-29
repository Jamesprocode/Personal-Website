import { motion } from 'framer-motion';

function CategoryFilter({ activeFilters, onToggleFilter }) {
  const categories = [
    { name: 'Education', color: 'bg-tl-blue', borderColor: 'border-tl-blue' },
    { name: 'Research', color: 'bg-tl-green', borderColor: 'border-tl-green' },
    { name: 'Music Software', color: 'bg-tl-purple', borderColor: 'border-tl-purple' },
    { name: 'Music', color: 'bg-tl-orange', borderColor: 'border-tl-orange' },
    { name: 'Industry', color: 'bg-tl-gray', borderColor: 'border-tl-gray' },
  ];

  return (
    <div className="mb-12 flex flex-wrap justify-center gap-3">
      {categories.map((category) => {
        const isActive = activeFilters.includes(category.name);

        return (
          <motion.button
            key={category.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggleFilter(category.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2
              ${
                isActive
                  ? `${category.color} ${category.borderColor} text-white`
                  : 'bg-transparent border-gray-600 text-gray-400 hover:border-gray-400'
              }`}
          >
            {category.name}
          </motion.button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;
