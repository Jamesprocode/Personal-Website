import { motion } from 'framer-motion';

function CategoryFilter({ activeFilters, onToggleFilter }) {
  const categories = [
    { name: 'Education', color: 'bg-tl-blue', borderColor: 'border-tl-blue', textColor: 'text-tl-blue' },
    { name: 'Research', color: 'bg-tl-green', borderColor: 'border-tl-green', textColor: 'text-tl-green' },
    { name: 'Music Software', color: 'bg-tl-purple', borderColor: 'border-tl-purple', textColor: 'text-tl-purple' },
    { name: 'Music', color: 'bg-tl-orange', borderColor: 'border-tl-orange', textColor: 'text-tl-orange' },
    { name: 'Industry', color: 'bg-tl-gray', borderColor: 'border-tl-gray', textColor: 'text-tl-gray' },
  ];

  return (
    <div className="mb-12 flex flex-wrap justify-center gap-2">
      {categories.map((category) => {
        const isActive = activeFilters.includes(category.name);

        return (
          <motion.button
            key={category.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggleFilter(category.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border
              ${
                isActive
                  ? `${category.color} ${category.borderColor} text-white shadow-lg`
                  : `bg-transparent border-gray-700 ${category.textColor} opacity-50 hover:opacity-80`
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
