import { motion } from 'framer-motion';
import VinylRecord from './VinylRecord';

function RecordCrate({ tracks, onSelectTrack, selectedTrack }) {
  return (
    <div className="bg-gradient-to-br from-music-wood to-music-wood/80 rounded-3xl p-6 shadow-2xl
      border border-music-gold/15">
      <h3 className="text-xl font-bold text-music-cream mb-2 text-center tracking-tight">
        Record Collection
      </h3>
      <div className="w-10 h-0.5 bg-gradient-to-r from-transparent via-music-gold/50 to-transparent mx-auto mb-6" />

      <div className="space-y-3">
        {tracks.map((track, index) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <VinylRecord
              track={track}
              onSelect={onSelectTrack}
              isSelected={selectedTrack?.id === track.id}
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-3 bg-black/20 rounded-xl">
        <p className="text-xs text-music-cream/40 text-center font-light">
          Click a record to start playing
        </p>
      </div>
    </div>
  );
}

export default RecordCrate;
