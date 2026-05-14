import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function VUMeter({ isPlaying, level: levelOverride, segments = 20, tone = 'traffic-light', label = 'VU' }) {
  const [level, setLevel] = useState(0);

  useEffect(() => {
    if (typeof levelOverride === 'number') return;

    if (!isPlaying) {
      setLevel(0);
      return;
    }

    const interval = setInterval(() => {
      const newLevel = Math.random() * 0.7 + 0.3;
      setLevel(newLevel);
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, levelOverride]);

  const effectiveLevel = typeof levelOverride === 'number' ? levelOverride : level;
  const activeSegments = Math.floor(effectiveLevel * segments);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <p
          className={`text-[0.65rem] tracking-[0.18em] uppercase text-center mb-1 ${
            tone === 'mono' ? 'text-amber-700/60' : 'text-music-cream/60'
          }`}
        >
          {label}
        </p>
      )}
      <div className="flex gap-1 h-8 items-end">
        {Array.from({ length: segments }).map((_, i) => {
          const isActive = i < activeSegments;
          const isRed = i >= segments * 0.8;
          const isYellow = i >= segments * 0.6;

          let barClass;
          if (tone === 'mono') {
            barClass = 'bg-amber-700';
          } else {
            barClass = isRed ? 'bg-music-red' : isYellow ? 'bg-yellow-500' : 'bg-green-500';
          }

          return (
            <motion.div
              key={i}
              animate={{
                scaleY: isActive ? 1 : 0.18,
                opacity: isActive ? 1 : 0.25,
              }}
              transition={{ duration: 0.1 }}
              className={`flex-1 rounded-sm origin-bottom ${barClass}`}
            />
          );
        })}
      </div>
    </div>
  );
}

export default VUMeter;
