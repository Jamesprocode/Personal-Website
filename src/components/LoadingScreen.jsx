import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function LoadingScreen({ onLoadingComplete }) {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(() => onLoadingComplete(), 600);
          }, 400);
          return 100;
        }
        return prev + 2;
      });
    }, 35);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-amber-950 via-amber-900 to-orange-950 overflow-hidden"
        >
          {/* Subtle floating notes */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl"
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
                }}
                animate={{
                  y: -50,
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                }}
                transition={{
                  duration: 12 + Math.random() * 8,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: 'linear',
                }}
              >
                {['♪', '♫', '♬', '♩'][Math.floor(Math.random() * 4)]}
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center px-6">
            {/* Cassette */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12 relative"
            >
              <div className="relative w-80 sm:w-96 h-56 bg-gradient-to-br from-amber-200 to-amber-300 rounded-2xl shadow-2xl mx-auto border-4 border-amber-900">
                {/* Label Area */}
                <div className="absolute top-4 left-8 right-8 h-20 bg-white/80 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-900 tracking-widest">JAMES WANG</p>
                    <p className="text-xs text-amber-700 mt-1">PORTFOLIO &middot; SIDE A</p>
                  </div>
                </div>

                {/* Tape Reels - fixed size, just spinning */}
                <div className="absolute bottom-8 left-12 right-12 flex justify-between items-center">
                  {/* Left Reel */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 rounded-full bg-amber-900 border-4 border-amber-800 relative overflow-hidden"
                  >
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
                    className="w-16 h-16 rounded-full bg-amber-900 border-4 border-amber-800 relative overflow-hidden"
                  >
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
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-amber-100 mb-4">
                {t('loading.heading')}
              </h2>
              <p className="text-amber-300 text-lg mb-6">
                {progress < 30 && t('loading.status.tuning')}
                {progress >= 30 && progress < 60 && t('loading.status.setup')}
                {progress >= 60 && progress < 90 && t('loading.status.sound')}
                {progress >= 90 && t('loading.status.ready')}
              </p>

              {/* Progress Bar */}
              <div className="w-80 sm:w-96 mx-auto mb-12">
                <div className="h-3 bg-amber-950 rounded-full overflow-hidden border-2 border-amber-700">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-amber-300 text-sm mt-2 font-mono">{progress}%</p>
              </div>

              {/* Waveform */}
              <motion.div
                className="flex items-end gap-1 h-12 justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoadingScreen;
