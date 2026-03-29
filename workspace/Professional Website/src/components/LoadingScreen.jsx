import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

function LoadingScreen({ onLoadingComplete }) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(() => onLoadingComplete(), 800);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-amber-900 via-orange-800 to-amber-950 overflow-hidden"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-20">
            {/* Floating Notes */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-6xl"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 100,
                  rotate: 0
                }}
                animate={{
                  y: -100,
                  rotate: 360,
                  x: Math.random() * window.innerWidth
                }}
                transition={{
                  duration: 10 + Math.random() * 10,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: 'linear'
                }}
              >
                {['♪', '♫', '♬', '♩'][Math.floor(Math.random() * 4)]}
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center">
            {/* Tape Machine */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, type: 'spring', stiffness: 100 }}
              className="mb-8 relative"
            >
              {/* Cassette Body */}
              <div className="relative w-96 h-56 bg-gradient-to-br from-amber-200 to-amber-300 rounded-2xl shadow-2xl mx-auto border-4 border-amber-900">
                {/* Label Area */}
                <div className="absolute top-4 left-8 right-8 h-20 bg-white/80 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-900 tracking-widest">JAMES WANG</p>
                    <p className="text-xs text-amber-700 mt-1">PORTFOLIO • SIDE A</p>
                  </div>
                </div>

                {/* Tape Reels */}
                <div className="absolute bottom-8 left-12 right-12 flex justify-between">
                  {/* Left Reel */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-20 h-20 rounded-full bg-amber-900 border-4 border-amber-800 relative overflow-hidden"
                    style={{ width: `${80 - progress * 0.3}px`, height: `${80 - progress * 0.3}px` }}
                  >
                    {/* Reel Spokes */}
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-full bg-amber-700 left-1/2 top-0"
                        style={{ transform: `rotate(${i * 45}deg)`, transformOrigin: 'center' }}
                      />
                    ))}
                    <div className="absolute inset-3 rounded-full bg-amber-950" />
                  </motion.div>

                  {/* Right Reel */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-20 h-20 rounded-full bg-amber-900 border-4 border-amber-800 relative overflow-hidden"
                    style={{ width: `${50 + progress * 0.3}px`, height: `${50 + progress * 0.3}px` }}
                  >
                    {/* Reel Spokes */}
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-full bg-amber-700 left-1/2 top-0"
                        style={{ transform: `rotate(${i * 45}deg)`, transformOrigin: 'center' }}
                      />
                    ))}
                    <div className="absolute inset-3 rounded-full bg-amber-950" />
                  </motion.div>
                </div>

                {/* Tape Window */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-1 bg-amber-800 rounded-full">
                  <motion.div
                    className="h-full bg-amber-950 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

            </motion.div>

            {/* Loading Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-24 text-center"
            >
              <h2 className="text-4xl font-bold text-amber-100 mb-4">
                Loading Experience...
              </h2>
              <p className="text-amber-300 text-lg mb-6">
                {progress < 30 && "Tuning the instruments..."}
                {progress >= 30 && progress < 60 && "Setting up the stage..."}
                {progress >= 60 && progress < 90 && "Sound check in progress..."}
                {progress >= 90 && "Ready to perform!"}
              </p>

              {/* Progress Bar */}
              <div className="w-96 mx-auto mb-16">
                <div className="h-3 bg-amber-950 rounded-full overflow-hidden border-2 border-amber-700">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-amber-300 text-sm mt-2 font-mono">{progress}%</p>
              </div>

              {/* Waveform Visualization Below Progress Bar */}
              <motion.div
                className="flex items-end gap-1 h-12 justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 bg-amber-400 rounded-full"
                    animate={{
                      height: [
                        Math.random() * 30 + 10,
                        Math.random() * 40 + 5,
                        Math.random() * 30 + 10
                      ]
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      delay: i * 0.1
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>

            {/* Spinning Vinyl Decoration */}
            <motion.div
              className="absolute -right-20 top-0 w-64 h-64 rounded-full bg-gradient-to-br from-black to-gray-800 border-8 border-amber-900 opacity-30"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute inset-0 rounded-full border-t-2 border-amber-700" />
              <div className="absolute inset-8 rounded-full border-t-2 border-amber-700" />
              <div className="absolute inset-16 rounded-full border-t-2 border-amber-700" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-amber-900" />
              </div>
            </motion.div>

            <motion.div
              className="absolute -left-20 bottom-0 w-64 h-64 rounded-full bg-gradient-to-br from-black to-gray-800 border-8 border-amber-900 opacity-30"
              animate={{ rotate: -360 }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute inset-0 rounded-full border-t-2 border-amber-700" />
              <div className="absolute inset-8 rounded-full border-t-2 border-amber-700" />
              <div className="absolute inset-16 rounded-full border-t-2 border-amber-700" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-amber-900" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoadingScreen;
