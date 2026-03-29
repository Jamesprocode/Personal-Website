import { motion } from 'framer-motion';

function VinylRecord({ track, onSelect, isSelected }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, x: 10 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(track)}
      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all
        ${
          isSelected
            ? 'bg-music-gold/30 border-2 border-music-gold'
            : 'bg-black/20 border-2 border-transparent hover:bg-black/30 hover:border-music-gold/30'
        }`}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center shrink-0
          shadow-lg text-2xl font-bold"
        style={{ backgroundColor: track.color || '#c4a265' }}
      >
        🎵
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-music-cream truncate">{track.title}</h4>
        <p className="text-sm text-music-gold/80 truncate">{track.album}</p>
        <p className="text-xs text-music-cream/50">{track.year}</p>
      </div>

      {!track.file && (
        <div className="text-xs text-music-cream/40 bg-black/30 px-2 py-1 rounded">
          Coming soon
        </div>
      )}
    </motion.div>
  );
}

export default VinylRecord;
