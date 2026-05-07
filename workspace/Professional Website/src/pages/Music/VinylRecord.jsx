import { motion } from 'framer-motion';

function VinylRecord({ track, onSelect, isSelected }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(track)}
      className={`flex items-center gap-4 p-3.5 rounded-xl cursor-pointer transition-all duration-300
        ${
          isSelected
            ? 'bg-music-gold/20 border border-music-gold/50 shadow-lg shadow-music-gold/10'
            : 'bg-black/15 border border-transparent hover:bg-black/25 hover:border-music-gold/20'
        }`}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center shrink-0
          shadow-lg text-xl"
        style={{ backgroundColor: track.color || '#c4a265' }}
      >
        🎵
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-music-cream truncate text-sm">{track.title}</h4>
        <p className="text-xs text-music-gold/60 truncate">{track.album}</p>
        <p className="text-xs text-music-cream/30 mt-0.5">{track.year}</p>
      </div>

      {!track.file && (
        <div className="text-xs text-music-cream/30 bg-black/30 px-2 py-1 rounded-full">
          Soon
        </div>
      )}
    </motion.div>
  );
}

export default VinylRecord;
