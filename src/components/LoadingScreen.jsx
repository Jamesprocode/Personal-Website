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

const reelSize = 'clamp(2.35rem, 12vw, 4rem)';

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

function LoadingScreen({ onLoadingComplete = () => {}, holdUntilUnmount = false, variant = 'initial' }) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const colors = isDark ? DARK_LOADER_COLORS : LIGHT_LOADER_COLORS;
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const liteMotion = reduceMotion || isMobile;
  const animateLoader = !reduceMotion;
  const visibleWaveBars = liteMotion ? WAVEFORM_BARS.slice(0, 10) : WAVEFORM_BARS;
  const isRouteVariant = variant === 'route';
  const progressDurationMs = isRouteVariant ? 700 : 1800;
  const progressIntervalMs = 35;
  const finishDelay = reduceMotion ? 260 : 600;
  const completeDelay = reduceMotion ? 180 : 400;
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const loadingStatus = progress < 30
    ? t('loading.status.tuning')
    : progress < 60
      ? t('loading.status.setup')
      : progress < 90
        ? t('loading.status.sound')
        : t('loading.status.ready');

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
        setProgress(next);
        if (next >= 100) window.clearInterval(interval);
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

  if (isRouteVariant) {
    return (
      <AnimatePresence>
        {!isComplete && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.22 }}
            className="fixed inset-0 overflow-hidden"
            style={{
              zIndex: 70,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem',
              minHeight: '100dvh',
              background: `radial-gradient(circle at 50% 38%, ${colors.surface} 0%, ${colors.bg} 52%, ${colors.bgAlt} 100%)`,
              color: colors.text,
            }}
          >
            <Motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              transition={reduceMotion ? undefined : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: 'min(86vw, 22rem)',
                borderRadius: '1.35rem',
                border: `1px solid ${colors.border}`,
                background: `linear-gradient(145deg, ${colors.surface} 0%, ${colors.surface2} 100%)`,
                boxShadow: colors.shadow,
                padding: '1rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.9rem',
                }}
              >
                {[0, 1].map((side) => (
                  <div
                    key={side}
                    aria-hidden
                    style={{
                      width: 'clamp(2.15rem, 11vw, 3rem)',
                      height: 'clamp(2.15rem, 11vw, 3rem)',
                      borderRadius: '50%',
                      border: `3px solid ${colors.accentDeep}`,
                      backgroundColor: colors.reel,
                      position: 'relative',
                      overflow: 'hidden',
                      flexShrink: 0,
                      animation: animateLoader ? 'loading-reel-spin 1.35s linear infinite' : 'none',
                    }}
                  >
                    {[...Array(6)].map((_, i) => (
                      <span
                        key={i}
                        style={{
                          position: 'absolute',
                          width: 2,
                          height: '100%',
                          left: '50%',
                          top: 0,
                          backgroundColor: colors.accent,
                          transform: `rotate(${i * 60}deg)`,
                          transformOrigin: 'center',
                        }}
                      />
                    ))}
                    <span
                      style={{
                        position: 'absolute',
                        inset: '33%',
                        borderRadius: '50%',
                        backgroundColor: colors.reelCenter,
                      }}
                    />
                  </div>
                ))}
              </div>

              <div
                aria-hidden
                style={{
                  height: 6,
                  margin: '1rem 0 0.75rem',
                  borderRadius: 9999,
                  overflow: 'hidden',
                  backgroundColor: colors.accentDeep,
                }}
              >
                <Motion.div
                  style={{
                    width: `${progress}%`,
                    height: '100%',
                    borderRadius: 9999,
                    background: `linear-gradient(90deg, ${colors.accent}, ${colors.accentBright})`,
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem' }}>
                <p
                  style={{
                    margin: 0,
                    color: colors.textStrong,
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontSize: '0.72rem',
                  }}
                >
                  Loading Side B
                </p>
                <p
                  style={{
                    margin: 0,
                    color: colors.textMuted,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.8rem',
                  }}
                >
                  {progress}%
                </p>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {!isComplete && (
        <Motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: liteMotion ? 0.18 : 0.6 }}
          className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden"
          style={{
            zIndex: 70,
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
                style={{ marginBottom: isMobile ? '1.75rem' : undefined }}
              >
                <div
                  className="relative rounded-2xl mx-auto border-4"
                  style={{
                    width: isMobile ? 'min(68vw, 15.5rem)' : 'clamp(15.5rem, 78vw, 24rem)',
                    aspectRatio: '12 / 7',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.surface2} 100%)`,
                    borderColor: colors.accentDeep,
                    borderWidth: isMobile ? 3 : undefined,
                    boxShadow: colors.shadow,
                  }}
                >
                  {/* Label Area */}
                  <div
                    className="absolute top-4 rounded-lg flex items-center justify-center"
                    style={{
                      top: isMobile ? '0.75rem' : undefined,
                      left: isMobile ? '1.1rem' : 'clamp(1.25rem, 7vw, 2rem)',
                      right: isMobile ? '1.1rem' : 'clamp(1.25rem, 7vw, 2rem)',
                      height: isMobile ? '3.15rem' : 'clamp(4rem, 18vw, 5rem)',
                      backgroundColor: colors.labelBg,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <div className="text-center">
                      <p
                        className="font-bold tracking-widest"
                        style={{
                          color: colors.textStrong,
                          fontSize: isMobile ? '1rem' : 'clamp(1.35rem, 6.5vw, 1.5rem)',
                          letterSpacing: isMobile ? '0.12em' : undefined,
                        }}
                      >
                        JAMES WANG
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: colors.textMuted, fontSize: isMobile ? '0.58rem' : undefined }}
                      >
                        PORTFOLIO &middot; SIDE A
                      </p>
                    </div>
                  </div>

                  {/* Tape Reels - fixed size, just spinning */}
                  <div
                    className="absolute flex justify-between items-center"
                    style={{
                      left: isMobile ? '1.6rem' : 'clamp(2rem, 11vw, 3rem)',
                      right: isMobile ? '1.6rem' : 'clamp(2rem, 11vw, 3rem)',
                      bottom: isMobile ? '1rem' : 'clamp(1.5rem, 8vw, 2rem)',
                    }}
                  >
                    {/* Left Reel */}
                    <div
                      className="w-16 h-16 rounded-full border-4 relative overflow-hidden"
                      style={{
                        width: isMobile ? '2.1rem' : reelSize,
                        height: isMobile ? '2.1rem' : reelSize,
                        borderWidth: isMobile ? 3 : undefined,
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
                        width: isMobile ? '2.1rem' : reelSize,
                        height: isMobile ? '2.1rem' : reelSize,
                        borderWidth: isMobile ? 3 : undefined,
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
                      width: isMobile ? '4.75rem' : 'clamp(5.5rem, 30vw, 8rem)',
                      bottom: isMobile ? '1rem' : 'clamp(1.5rem, 8vw, 2rem)',
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
                    fontSize: isMobile ? '1.4rem' : 'clamp(1.9rem, 8vw, 2.25rem)',
                    lineHeight: 1.1,
                    marginBottom: isMobile ? '0.7rem' : undefined,
                  }}
                >
                  {t('loading.heading')}
                </h2>
                {isMobile ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <p style={{ color: colors.textMuted, fontSize: '0.86rem', margin: 0 }}>
                      {loadingStatus}
                    </p>
                    <p
                      style={{
                        color: colors.textMuted,
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.7rem',
                        margin: 0,
                      }}
                    >
                      {progress}%
                    </p>
                  </div>
                ) : (
                  <p className="text-lg mb-6" style={{ color: colors.textMuted }}>
                    {loadingStatus}
                  </p>
                )}

                {/* Progress Bar */}
                {!isMobile && (
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
                )}

                {/* Waveform */}
                {!isMobile && (
                  liteMotion ? (
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
                  )
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
