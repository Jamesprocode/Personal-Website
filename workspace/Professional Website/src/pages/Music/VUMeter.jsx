import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function VUMeter({ isPlaying }) {
  const [level, setLevel] = useState(0);

  useEffect(() => {
    if (!isPlaying) {
      setLevel(0);
      return;
    }

    const interval = setInterval(() => {
      // Simulate audio levels with some randomness
      const newLevel = Math.random() * 0.7 + 0.3; // 30-100%
      setLevel(newLevel);
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const segments = 20;
  const activeSegments = Math.floor(level * segments);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-music-cream text-center mb-1">VU Meter</p>
      <div className="flex gap-1 h-8 items-end">
        {Array.from({ length: segments }).map((_, i) => {
          const isActive = i < activeSegments;
          const isRed = i >= segments * 0.8;
          const isYellow = i >= segments * 0.6;

          return (
            <motion.div
              key={i}
              animate={{
                scaleY: isActive ? 1 : 0.3,
                opacity: isActive ? 1 : 0.3,
              }}
              transition={{ duration: 0.1 }}
              className={`flex-1 rounded-sm origin-bottom ${
                isRed
                  ? 'bg-music-red'
                  : isYellow
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

export default VUMeter;
