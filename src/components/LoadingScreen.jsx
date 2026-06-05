import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useIsMobile from '../hooks/useIsMobile';

const FLOATING_NOTES = Array.from({ length: 12 }, (_, i) => ({
  note: ['♪', '♫', '♬', '♩'][i % 4],
  startX: `${(i * 23 + 11) % 100}vw`,
  endX: `${(i * 31 + 37) % 100}vw`,
  duration: 12 + (i % 5) * 1.6,
  delay: (i % 6) * 0.45,
}));

const WAVEFORM_BARS = Array.from({ length: 20 }, (_, i) => ({
  heights: [
    12 + ((i * 7) % 28),
    8 + ((i * 11) % 34),
    12 + ((i * 5) % 28),
  ],
}));

const reelSize = 'clamp(3rem, 15vw, 4rem)';

function LoadingScreen({ onLoadingComplete }) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const liteMotion = reduceMotion || isMobile;
  const visibleWaveBars = liteMotion ? WAVEFORM_BARS.slice(0, 10) : WAVEFORM_BARS;
  const progressStep = isMobile ? 4 : 2;
  const progressIntervalMs = isMobile ? 55 : 35;
  const finishDelay = liteMotion ? 260 : 600;
  const completeDelay = liteMotion ? 180 : 400;
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let completeTimer;
    let finishTimer;

    const interval = window.setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + progressStep);
        if (next >= 100) {
          window.clearInterval(interval);
          completeTimer = window.setTimeout(() => {
            setIsComplete(true);
            finishTimer = window.setTimeout(() => onLoadingComplete(), finishDelay);
          }, completeDelay);
          return 100;
        }
        return next;
      });
    }, progressIntervalMs);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(completeTimer);
      window.clearTimeout(finishTimer);
    };
  }, [completeDelay, finishDelay, onLoadingComplete, progressIntervalMs, progressStep]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <Motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-amber-950 via-amber-900 to-orange-950"
          style={{ minHeight: '100dvh' }}
        >
          {/* Subtle floating notes. Desktop only: the mobile loader keeps the
              cassette identity but skips decorative JS-driven drift. */}
          {!liteMotion && (
            <div className="absolute inset-0 pointer-events-none opacity-10">
              {FLOATING_NOTES.map((item, i) => (
                <Motion.div
                  key={i}
                  className="absolute text-4xl"
                  initial={{
                    x: item.startX,
                    y: 'calc(100dvh + 50px)',
                  }}
                  animate={{
                    y: -50,
                    x: item.endX,
                  }}
                  transition={{
                    duration: item.duration,
                    repeat: Infinity,
                    delay: item.delay,
                    ease: 'linear',
                  }}
                >
                  {item.note}
                </Motion.div>
              ))}
            </div>
          )}

          {/* Main content uses dynamic viewport height and responsive fixed-format
              pieces, so the cassette stays centered on narrow mobile screens. */}
          <div
            className="relative z-10 flex items-center justify-center px-5 py-8 sm:px-6 sm:py-10"
            style={{ minHeight: '100dvh', width: '100%' }}
          >
            <div className="text-center" style={{ width: 'min(100%, 24rem)' }}>
            {/* Cassette */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 sm:mb-12 relative"
            >
              <div
                className="relative bg-gradient-to-br from-amber-200 to-amber-300 rounded-2xl shadow-2xl mx-auto border-4 border-amber-900"
                style={{ width: 'min(100%, 24rem)', height: 'clamp(12rem, 56vw, 14rem)' }}
              >
                {/* Label Area */}
                <div
                  className="absolute top-4 bg-white/80 rounded-lg flex items-center justify-center"
                  style={{
                    left: 'clamp(1.25rem, 7vw, 2rem)',
                    right: 'clamp(1.25rem, 7vw, 2rem)',
                    height: 'clamp(4rem, 18vw, 5rem)',
                  }}
                >
                  <div className="text-center">
                    <p
                      className="font-bold text-amber-900 tracking-widest"
                      style={{ fontSize: 'clamp(1.35rem, 6.5vw, 1.5rem)' }}
                    >
                      JAMES WANG
                    </p>
                    <p className="text-xs text-amber-700 mt-1">PORTFOLIO &middot; SIDE A</p>
                  </div>
                </div>

                {/* Tape Reels - fixed size, just spinning */}
                <div
                  className="absolute flex justify-between items-center"
                  style={{
                    left: 'clamp(2rem, 11vw, 3rem)',
                    right: 'clamp(2rem, 11vw, 3rem)',
                    bottom: 'clamp(1.5rem, 8vw, 2rem)',
                  }}
                >
                  {/* Left Reel */}
                  <div
                    className="w-16 h-16 rounded-full bg-amber-900 border-4 border-amber-800 relative overflow-hidden"
                    style={{
                      width: reelSize,
                      height: reelSize,
                      animation: reduceMotion ? 'none' : 'loading-reel-spin 2.4s linear infinite',
                    }}
                  >
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-full bg-amber-700 left-1/2 top-0"
                        style={{ transform: `rotate(${i * 45}deg)`, transformOrigin: 'center' }}
                      />
                    ))}
                    <div className="absolute inset-3 rounded-full bg-amber-950" />
                  </div>

                  {/* Right Reel */}
                  <div
                    className="w-16 h-16 rounded-full bg-amber-900 border-4 border-amber-800 relative overflow-hidden"
                    style={{
                      width: reelSize,
                      height: reelSize,
                      animation: reduceMotion ? 'none' : 'loading-reel-spin 2.4s linear infinite',
                    }}
                  >
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-full bg-amber-700 left-1/2 top-0"
                        style={{ transform: `rotate(${i * 45}deg)`, transformOrigin: 'center' }}
                      />
                    ))}
                    <div className="absolute inset-3 rounded-full bg-amber-950" />
                  </div>
                </div>

                {/* Tape Window */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 h-1 bg-amber-800 rounded-full"
                  style={{ width: 'clamp(5.5rem, 30vw, 8rem)', bottom: 'clamp(1.5rem, 8vw, 2rem)' }}
                >
                  <Motion.div
                    className="h-full bg-amber-950 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </Motion.div>

            {/* Loading Text */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className="font-bold text-amber-100 mb-4"
                style={{ fontSize: 'clamp(1.9rem, 8vw, 2.25rem)', lineHeight: 1.1 }}
              >
                {t('loading.heading')}
              </h2>
              <p className="text-amber-300 text-lg mb-6">
                {progress < 30 && t('loading.status.tuning')}
                {progress >= 30 && progress < 60 && t('loading.status.setup')}
                {progress >= 60 && progress < 90 && t('loading.status.sound')}
                {progress >= 90 && t('loading.status.ready')}
              </p>

              {/* Progress Bar */}
              <div className="mx-auto mb-8 sm:mb-12" style={{ width: 'min(100%, 24rem)' }}>
                <div className="h-3 bg-amber-950 rounded-full overflow-hidden border-2 border-amber-700">
                  <Motion.div
                    className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-amber-300 text-sm mt-2 font-mono">{progress}%</p>
              </div>

              {/* Waveform */}
              {liteMotion ? (
                <div className="flex items-end gap-1 h-12 justify-center" aria-hidden>
                  {visibleWaveBars.map((bar, i) => (
                    <div
                      key={i}
                      className="w-2 bg-amber-400 rounded-full"
                      style={{ height: bar.heights[0] }}
                    />
                  ))}
                </div>
              ) : (
                <Motion.div
                  className="flex items-end gap-1 h-12 justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  {visibleWaveBars.map((bar, i) => (
                    <Motion.div
                      key={i}
                      className="w-2 bg-amber-400 rounded-full"
                      animate={{
                        height: bar.heights
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </Motion.div>
              )}
            </Motion.div>
            </div>
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoadingScreen;
