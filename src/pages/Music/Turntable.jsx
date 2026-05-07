import { motion } from 'framer-motion';
import VUMeter from './VUMeter';
import Knob from './Knob';

function Turntable({ track, isPlaying, onPlayPause, volume, onVolumeChange, onSeek }) {
  return (
    <div className="bg-gradient-to-br from-music-wood to-music-wood/80 rounded-3xl p-8 shadow-2xl
      border border-music-gold/15 backdrop-blur-sm">
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
              shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)] border-2 border-gray-700/50
              flex items-center justify-center"
          >
            {/* Vinyl grooves */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-gray-700/20"
                style={{
                  width: `${90 - i * 10}%`,
                  height: `${90 - i * 10}%`,
                }}
              />
            ))}

            {track ? (
              <div
                className="w-3/5 h-3/5 rounded-full flex items-center justify-center
                  text-center p-6 shadow-lg relative z-10"
                style={{ backgroundColor: track.color || '#c4a265' }}
              >
                <div>
                  <p className="font-bold text-lg mb-1 leading-tight">{track.title}</p>
                  <p className="text-sm opacity-70">{track.album}</p>
                  <p className="text-xs opacity-50 mt-1">{track.year}</p>
                </div>
              </div>
            ) : (
              <div className="text-music-cream/20 text-center relative z-10">
                <p className="text-sm font-light">Select a record</p>
              </div>
            )}

            {/* Center spindle */}
            <div className="absolute w-6 h-6 rounded-full bg-gray-900 border border-gray-600 z-20" />
          </motion.div>
        </div>

        {/* Tonearm */}
        <motion.div
          animate={{
            rotate: isPlaying ? -25 : 0,
            x: isPlaying ? 40 : 0,
          }}
          transition={{ duration: 0.8 }}
          className="absolute top-1/4 right-0 w-48 h-1.5 bg-gradient-to-r from-gray-500 to-gray-600
            rounded-full origin-right transform translate-x-8 shadow-lg"
          style={{ transformOrigin: '90% 50%' }}
        >
          <div className="absolute left-0 w-3 h-3 bg-gray-700 rounded-full -translate-y-0.5" />
          <div className="absolute right-2 w-2.5 h-2.5 bg-red-900/80 rounded-full -translate-y-0.5" />
        </motion.div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          {/* Play/Pause Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlayPause}
            disabled={!track || !track.file}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-xl
              transition-all duration-300 shadow-lg ${
                track && track.file
                  ? 'bg-music-gold hover:bg-music-gold/80 text-music-wood cursor-pointer shadow-music-gold/20'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
          >
            {isPlaying ? '⏸' : '▶'}
          </motion.button>

          {/* Volume Knob */}
          <div>
            <p className="text-xs text-music-cream/50 mb-2 text-center tracking-wider uppercase">Volume</p>
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
