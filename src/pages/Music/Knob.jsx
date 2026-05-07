import { motion } from 'framer-motion';
import { useState } from 'react';

function Knob({ value = 70, onChange }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const handleMouseMove = (moveEvent) => {
      const delta = moveEvent.movementY * -1;
      const newValue = Math.max(0, Math.min(100, value + delta));
      onChange(newValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const rotation = (value / 100) * 270 - 135; // -135° to +135°

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className="relative w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900
          shadow-lg cursor-pointer border-4 border-gray-800"
        onMouseDown={handleMouseDown}
        whileHover={{ scale: 1.05 }}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <motion.div
          className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-600 to-gray-800
            shadow-inner"
          animate={{ rotate: rotation }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="absolute top-1 left-1/2 w-1 h-4 bg-music-gold rounded-full -translate-x-1/2" />
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-gray-900" />
        </div>
      </motion.div>

      <div className="text-xs text-music-cream font-mono">
        {Math.round(value)}
      </div>
    </div>
  );
}

export default Knob;
