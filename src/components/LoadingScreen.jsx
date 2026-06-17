import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useIsMobile from '../hooks/useIsMobile';
import useTheme from '../hooks/useTheme';

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

const LIGHT_LOADER_COLORS = {
  bg: '#f4e8d1',
  bgAlt: '#f1e5cd',
  surface: '#fdf4dc',
  surface2: '#f3e7c8',
  labelBg: 'rgba(244, 232, 209, 0.82)',
  textStrong: '#5a3410',
  text: '#6b4a1e',
  textMuted: 'rgba(107, 74, 30, 0.7)',
  reel: '#4a3f35',
  reelCenter: '#5a3410',
  accent: '#c4a265',
  accentBright: '#d8b677',
  accentDeep: '#8c6e3b',
  border: 'rgba(160, 111, 29, 0.32)',
  shadow: '0 16px 42px rgba(90, 52, 16, 0.18)',
};

const DARK_LOADER_COLORS = {
  bg: '#1a130c',
  bgAlt: '#1e160e',
  surface: '#2a1f15',
  surface2: '#342718',
  labelBg: 'rgba(26, 19, 12, 0.7)',
  textStrong: '#f4e8d1',
  text: 'rgba(244, 232, 209, 0.88)',
  textMuted: 'rgba(244, 232, 209, 0.6)',
  reel: '#4a3f35',
  reelCenter: '#1a130c',
  accent: '#c4a265',
  accentBright: '#d8b677',
  accentDeep: '#8c6e3b',
  border: 'rgba(196, 162, 101, 0.35)',
  shadow: '0 18px 48px rgba(26, 20, 16, 0.42)',
};

function LoadingScreen({ onLoadingComplete = () => {}, holdUntilUnmount = false }) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const colors = isDark ? DARK_LOADER_COLORS : LIGHT_LOADER_COLORS;
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const liteMotion = reduceMotion || isMobile;
  const animateLoader = !reduceMotion;
  const visibleWaveBars = liteMotion ? WAVEFORM_BARS.slice(0, 10) : WAVEFORM_BARS;
  const progressDurationMs = 1800;
  const progressIntervalMs = 35;
  const finishDelay = reduceMotion ? 260 : 600;
  const completeDelay = reduceMotion ? 180 : 400;
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let completeTimer;
    let finishTimer;
    let completed = false;
    const startedAt = Date.now();

    const complete = () => {
      if (completed) return;
      completed = true;
      setProgress(100);
      completeTimer = window.setTimeout(() => {
        setIsComplete(true);
        finishTimer = window.setTimeout(() => onLoadingComplete(), finishDelay);
      }, completeDelay);
    };

    const tick = () => {
      const elapsed = Date.now() - startedAt;
      const next = Math.min(100, Math.floor((elapsed / progressDurationMs) * 100));
      if (holdUntilUnmount) {
        setProgress(Math.min(96, next));
        if (next >= 96) window.clearInterval(interval);
        return;
      }
      if (next >= 100) {
        window.clearInterval(interval);
        complete();
        return;
      }
      setProgress(next);
    };

    const interval = window.setInterval(tick, progressIntervalMs);
    document.addEventListener('visibilitychange', tick);
    tick();

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(completeTimer);
      window.clearTimeout(finishTimer);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [completeDelay, finishDelay, holdUntilUnmount, onLoadingComplete, progressDurationMs, progressIntervalMs]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <Motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: liteMotion ? 0.18 : 0.6 }}
          className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden"
          style={{
            minHeight: '100dvh',
            background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.bg} 46%, ${colors.bgAlt} 100%)`,
            color: colors.text,
          }}
        >
          {/* Subtle floating notes. Desktop only: the mobile loader keeps the
              cassette identity but skips decorative JS-driven drift. */}
          {!liteMotion && (
            <div className="absolute inset-0 pointer-events-none" style={{ color: colors.accent, opacity: 0.18 }}>
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
                initial={liteMotion ? false : { opacity: 0, y: 20 }}
                animate={liteMotion ? undefined : { opacity: 1, y: 0 }}
                transition={liteMotion ? undefined : { duration: 0.6 }}
                className="mb-8 sm:mb-12 relative"
              >
                <div
                  className="relative rounded-2xl mx-auto border-4"
                  style={{
                    width: 'min(100%, 24rem)',
                    height: 'clamp(12rem, 56vw, 14rem)',
                    background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.surface2} 100%)`,
                    borderColor: colors.accentDeep,
                    boxShadow: colors.shadow,
                  }}
                >
                  {/* Label Area */}
                  <div
                    className="absolute top-4 rounded-lg flex items-center justify-center"
                    style={{
                      left: 'clamp(1.25rem, 7vw, 2rem)',
                      right: 'clamp(1.25rem, 7vw, 2rem)',
                      height: 'clamp(4rem, 18vw, 5rem)',
                      backgroundColor: colors.labelBg,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <div className="text-center">
                      <p
                        className="font-bold tracking-widest"
                        style={{
                          color: colors.textStrong,
                          fontSize: 'clamp(1.35rem, 6.5vw, 1.5rem)',
                        }}
                      >
                        JAMES WANG
                      </p>
                      <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
                        PORTFOLIO &middot; SIDE A
                      </p>
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
                      className="w-16 h-16 rounded-full border-4 relative overflow-hidden"
                      style={{
                        width: reelSize,
                        height: reelSize,
                        animation: animateLoader ? 'loading-reel-spin 2.4s linear infinite' : 'none',
                        backgroundColor: colors.reel,
                        borderColor: colors.accentDeep,
                      }}
                    >
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-full left-1/2 top-0"
                          style={{
                            backgroundColor: colors.accent,
                            transform: `rotate(${i * 45}deg)`,
                            transformOrigin: 'center',
                          }}
                        />
                      ))}
                      <div
                        className="absolute inset-3 rounded-full"
                        style={{ backgroundColor: colors.reelCenter }}
                      />
                    </div>

                    {/* Right Reel */}
                    <div
                      className="w-16 h-16 rounded-full border-4 relative overflow-hidden"
                      style={{
                        width: reelSize,
                        height: reelSize,
                        animation: animateLoader ? 'loading-reel-spin 2.4s linear infinite' : 'none',
                        backgroundColor: colors.reel,
                        borderColor: colors.accentDeep,
                      }}
                    >
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-full left-1/2 top-0"
                          style={{
                            backgroundColor: colors.accent,
                            transform: `rotate(${i * 45}deg)`,
                            transformOrigin: 'center',
                          }}
                        />
                      ))}
                      <div
                        className="absolute inset-3 rounded-full"
                        style={{ backgroundColor: colors.reelCenter }}
                      />
                    </div>
                  </div>

                  {/* Tape Window */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 h-1 rounded-full"
                    style={{
                      width: 'clamp(5.5rem, 30vw, 8rem)',
                      bottom: 'clamp(1.5rem, 8vw, 2rem)',
                      backgroundColor: colors.accentDeep,
                    }}
                  >
                    <Motion.div
                      className="h-full rounded-full"
                      style={{ width: `${progress}%`, backgroundColor: colors.textStrong }}
                    />
                  </div>
                </div>
              </Motion.div>

              {/* Loading Text */}
              <Motion.div
                initial={liteMotion ? false : { opacity: 0, y: 20 }}
                animate={liteMotion ? undefined : { opacity: 1, y: 0 }}
                transition={liteMotion ? undefined : { duration: 0.6 }}
              >
                <h2
                  className="font-bold mb-4"
                  style={{
                    color: colors.textStrong,
                    fontSize: 'clamp(1.9rem, 8vw, 2.25rem)',
                    lineHeight: 1.1,
                  }}
                >
                  {t('loading.heading')}
                </h2>
                <p className="text-lg mb-6" style={{ color: colors.textMuted }}>
                  {progress < 30 && t('loading.status.tuning')}
                  {progress >= 30 && progress < 60 && t('loading.status.setup')}
                  {progress >= 60 && progress < 90 && t('loading.status.sound')}
                  {progress >= 90 && t('loading.status.ready')}
                </p>

                {/* Progress Bar */}
                <div className="mx-auto mb-8 sm:mb-12" style={{ width: 'min(100%, 24rem)' }}>
                  <div
                    className="h-3 rounded-full overflow-hidden border-2"
                    style={{ backgroundColor: colors.surface2, borderColor: colors.border }}
                  >
                    <Motion.div
                      className="h-full"
                      style={{
                        width: `${progress}%`,
                        background: `linear-gradient(90deg, ${colors.accentDeep}, ${colors.accent}, ${colors.accentBright})`,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-sm mt-2 font-mono" style={{ color: colors.textMuted }}>
                    {progress}%
                  </p>
                </div>

                {/* Waveform */}
                {liteMotion ? (
                  <div className="flex items-end gap-1 h-12 justify-center" aria-hidden>
                    {visibleWaveBars.map((bar, i) => (
                      <div
                        key={i}
                        className="w-2 rounded-full"
                        style={{ height: bar.heights[0], backgroundColor: colors.accent }}
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
                        className="w-2 rounded-full"
                        animate={{
                          height: bar.heights,
                        }}
                        style={{ backgroundColor: colors.accent }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          repeatType: 'reverse',
                          delay: i * 0.1,
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
