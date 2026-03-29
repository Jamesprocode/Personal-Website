import { motion } from 'framer-motion';
import VUMeter from './VUMeter';
import Knob from './Knob';

function Turntable({ track, isPlaying, onPlayPause, volume, onVolumeChange, onSeek }) {
  return (
    <div className="bg-music-wood rounded-3xl p-8 shadow-2xl border-2 border-music-gold/20">
      {/* Turntable Base */}
      <div className="relative aspect-square max-w-lg mx-auto">
        {/* Platter */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{
              duration: 3,
              repeat: isPlaying ? Infinity : 0,
              ease: 'linear',
            }}
            className="w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-black
              shadow-inner border-4 border-gray-700 flex items-center justify-center"
          >
            {track ? (
              <div className="w-4/5 h-4/5 rounded-full flex items-center justify-center
                text-center p-8"
                style={{ backgroundColor: track.color || '#c4a265' }}
              >
                <div>
                  <p className="font-bold text-xl mb-2">{track.title}</p>
                  <p className="text-sm opacity-80">{track.album}</p>
                  <p className="text-xs opacity-60 mt-2">{track.year}</p>
                </div>
              </div>
            ) : (
              <div className="text-music-cream/30 text-center">
                <p className="text-sm">Drop a record here</p>
              </div>
            )}

            {/* Center spindle */}
            <div className="absolute w-8 h-8 rounded-full bg-gray-900 border-2 border-gray-700" />
          </motion.div>
        </div>

        {/* Tonearm */}
        <motion.div
          animate={{
            rotate: isPlaying ? -25 : 0,
            x: isPlaying ? 40 : 0,
          }}
          transition={{ duration: 0.8 }}
          className="absolute top-1/4 right-0 w-48 h-2 bg-gray-600 rounded-full
            origin-right transform translate-x-8 shadow-lg"
          style={{ transformOrigin: '90% 50%' }}
        >
          <div className="absolute left-0 w-4 h-4 bg-gray-800 rounded-full -translate-y-1" />
          <div className="absolute right-2 w-3 h-3 bg-red-900 rounded-full -translate-y-0.5" />
        </motion.div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          {/* Play/Pause Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlayPause}
            disabled={!track || !track.file}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl
              transition-all ${
                track && track.file
                  ? 'bg-music-gold hover:bg-music-gold/80 text-music-wood cursor-pointer'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
          >
            {isPlaying ? '⏸' : '▶'}
          </motion.button>

          {/* Volume Knob */}
          <div>
            <p className="text-xs text-music-cream mb-2 text-center">Volume</p>
            <Knob value={volume} onChange={onVolumeChange} />
          </div>
        </div>

        {/* VU Meter */}
        <div className="flex-1">
          <VUMeter isPlaying={isPlaying} />
        </div>
      </div>
    </div>
  );
}

export default Turntable;
