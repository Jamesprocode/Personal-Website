import { motion } from 'framer-motion';
import VinylRecord from './VinylRecord';

function RecordCrate({ tracks, onSelectTrack, selectedTrack }) {
  return (
    <div className="bg-music-wood rounded-2xl p-6 shadow-xl border-2 border-music-gold/20">
      <h3 className="text-2xl font-bold text-music-cream mb-6 text-center">
        Record Collection
      </h3>

      <div className="space-y-4">
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

      <div className="mt-8 p-4 bg-black/20 rounded-lg">
        <p className="text-xs text-music-cream/60 text-center">
          Click a record to start playing • Use controls below to adjust volume
        </p>
      </div>
    </div>
  );
}

export default RecordCrate;
