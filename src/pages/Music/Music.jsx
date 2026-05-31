import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import PageTransition from '../../components/PageTransition';
import Turntable from './Turntable';
import AlbumBrowser from './AlbumBrowser';
import albums from '../../data/albums';
import useAudioPlayer from '../../hooks/useAudioPlayer';

function Music() {
  const { t } = useTranslation();
  const {
    isPlaying,
    volume,
    setVolume,
    getLevel,
    currentTime,
    duration,
    seek,
    selectedAlbum,
    selectedTrack,
    selectTrack: handleSelectTrack,
    togglePlayPause: handlePlayPause,
    loopMode,
    cycleLoopMode,
    playNext,
  } = useAudioPlayer();

  // Keyboard: Space toggles playback
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handlePlayPause]);

  return (
    <PageTransition scene="music">
      <div
        className="min-h-screen bg-music-bg relative overflow-hidden"
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 'clamp(6rem, 12vh, 9rem)',
          paddingBottom: 'clamp(6rem, 12vh, 9rem)',
          paddingLeft: 'clamp(1.5rem, 4vw, 4rem)',
          paddingRight: 'clamp(1.5rem, 4vw, 4rem)',
        }}
      >
        {/* Ambient warm orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-music-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-music-gold/3 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10" style={{ width: '100%', maxWidth: 'min(82rem, 96vw)' }}>
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              marginBottom: 'clamp(1.25rem, 2.5vh, 2rem)',
              textAlign: 'center',
            }}
          >
            <h1
              className="font-bold tracking-tight text-music-cream"
              style={{
                fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                lineHeight: 1.05,
              }}
            >
              {t('music.heading')}
            </h1>
            <div
              style={{
                marginTop: 14,
                marginBottom: 14,
                marginLeft: 'auto',
                marginRight: 'auto',
                height: 1,
                width: 96,
                background: 'linear-gradient(to right, transparent, #c4a265, transparent)',
              }}
            />
            <p
              style={{
                color: 'rgba(196,162,101,0.7)',
                fontSize: 'clamp(0.95rem, 1.1vw, 1.1rem)',
                lineHeight: 1.55,
                maxWidth: '64ch',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {t('music.intro')}
            </p>
          </motion.div>

          {/* Turntable centered with album browser anchored to its right */}
          <div
            className="music-layout"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: 'clamp(2rem, 3.5vw, 3.5rem)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                flex: '1 1 480px',
                maxWidth: 640,
                minWidth: 0,
              }}
            >
              <Turntable
                album={selectedAlbum}
                track={selectedTrack}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                volume={volume}
                onVolumeChange={setVolume}
                getLevel={getLevel}
                currentTime={currentTime}
                duration={duration}
                onSeek={seek}
                loopMode={loopMode}
                onCycleLoop={cycleLoopMode}
                onNext={playNext}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{
                flex: '0 1 360px',
                minWidth: 300,
                maxWidth: 400,
                position: 'sticky',
                top: 'clamp(6rem, 10vh, 9rem)',
                maxHeight: 'calc(100vh - 12rem)',
                overflowY: 'auto',
              }}
            >
              <AlbumBrowser
                albums={albums}
                activeAlbumId={selectedAlbum?.id}
                activeTrackId={selectedTrack?.id}
                isPlaying={isPlaying}
                onSelectTrack={handleSelectTrack}
              />
            </motion.div>
          </div>

          <style>{`
            @media (max-width: 880px) {
              .music-layout > div:last-child {
                position: relative !important;
                top: 0 !important;
                max-height: none !important;
                overflow: visible !important;
                flex: 1 1 100% !important;
                max-width: none !important;
              }
            }
          `}</style>

          {/* Streaming-only releases: not playable here, just point at the
              published versions on Spotify / Apple Music. */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              marginTop: 'clamp(3rem, 6vh, 5rem)',
              paddingTop: 'clamp(1.5rem, 3vh, 2.25rem)',
              borderTop: '1px solid rgba(196, 162, 101, 0.2)',
            }}
          >
            <p
              className="font-mono uppercase"
              style={{
                color: 'rgba(196,162,101,0.7)',
                fontSize: '0.7rem',
                letterSpacing: '0.22em',
                marginBottom: 'clamp(0.75rem, 1.5vh, 1.25rem)',
              }}
            >
              {t('music.streaming.kicker')}
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'clamp(1.25rem, 2.5vw, 2rem)',
                alignItems: 'center',
              }}
            >
              <div style={{ flex: '1 1 280px', minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: 'Space Grotesk, system-ui, sans-serif',
                    fontWeight: 600,
                    fontSize: 'clamp(1.15rem, 1.6vw, 1.4rem)',
                    color: '#f4e8d1',
                    margin: 0,
                  }}
                >
                  {t('music.streaming.album')}
                </p>
                <p
                  style={{
                    color: 'rgba(244,232,209,0.6)',
                    fontSize: 'clamp(0.88rem, 1vw, 0.98rem)',
                    lineHeight: 1.55,
                    marginTop: 6,
                  }}
                >
                  {t('music.streaming.body')}
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                }}
              >
                <a
                  href="https://open.spotify.com/album/31sDZcw3rrgHrUB6Ylad5Q?si=6vjebhBbQcqVKMPdL1kHng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a265]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1410]"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    borderRadius: 9999,
                    border: '1px solid rgba(196,162,101,0.4)',
                    background: 'rgba(196,162,101,0.06)',
                    color: '#f4e8d1',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.78rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    transition: 'background 0.18s ease-out, border-color 0.18s ease-out',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(196,162,101,0.14)';
                    e.currentTarget.style.borderColor = 'rgba(196,162,101,0.7)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(196,162,101,0.06)';
                    e.currentTarget.style.borderColor = 'rgba(196,162,101,0.4)';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.62 14.42a.62.62 0 0 1-.86.21c-2.35-1.43-5.3-1.76-8.78-.96a.625.625 0 1 1-.28-1.22c3.8-.87 7.07-.5 9.7 1.11.3.18.4.57.22.86Zm1.24-2.76a.78.78 0 0 1-1.07.26c-2.69-1.65-6.78-2.13-9.95-1.17a.78.78 0 0 1-.45-1.5c3.62-1.1 8.13-.56 11.21 1.34.36.22.48.7.26 1.07Zm.1-2.87C14.74 8.9 9.32 8.74 6.27 9.66a.94.94 0 1 1-.54-1.79c3.5-1.06 9.49-.86 13.23 1.37a.94.94 0 1 1-.96 1.62Z" />
                  </svg>
                  Spotify
                </a>
                <a
                  href="https://music.apple.com/us/album/oxy-jazz-23/1817646373"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a265]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1410]"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    borderRadius: 9999,
                    border: '1px solid rgba(196,162,101,0.4)',
                    background: 'rgba(196,162,101,0.06)',
                    color: '#f4e8d1',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.78rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    transition: 'background 0.18s ease-out, border-color 0.18s ease-out',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(196,162,101,0.14)';
                    e.currentTarget.style.borderColor = 'rgba(196,162,101,0.7)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(196,162,101,0.06)';
                    e.currentTarget.style.borderColor = 'rgba(196,162,101,0.4)';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M17.05 12.04c-.03-2.36 1.93-3.49 2.02-3.55-1.1-1.61-2.81-1.83-3.42-1.86-1.46-.15-2.84.86-3.58.86-.74 0-1.88-.84-3.09-.82-1.59.02-3.06.92-3.88 2.35-1.65 2.87-.42 7.11 1.19 9.43.79 1.13 1.74 2.4 2.99 2.36 1.2-.05 1.65-.78 3.1-.78 1.45 0 1.85.78 3.12.75 1.29-.02 2.11-1.16 2.9-2.3.91-1.31 1.29-2.59 1.31-2.66-.03-.01-2.51-.97-2.66-3.78zM14.77 5.65c.66-.8 1.1-1.91.98-3.01-.95.04-2.09.63-2.77 1.43-.61.7-1.15 1.83-1 2.91 1.06.08 2.14-.54 2.79-1.33z" />
                  </svg>
                  Apple Music
                </a>
              </div>
            </div>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              marginTop: 'clamp(3rem, 6vh, 5rem)',
              paddingTop: 'clamp(1.5rem, 3vh, 2.25rem)',
              borderTop: '1px solid rgba(196, 162, 101, 0.2)',
            }}
          >
            <p
              className="font-mono uppercase"
              style={{
                color: 'rgba(196,162,101,0.7)',
                fontSize: '0.7rem',
                letterSpacing: '0.22em',
                marginBottom: 'clamp(0.75rem, 1.5vh, 1.25rem)',
              }}
            >
              {t('music.disclaimer.kicker')}
            </p>
            <p
              style={{
                color: 'rgba(244, 232, 209, 0.7)',
                fontSize: 'clamp(0.88rem, 1vw, 0.98rem)',
                lineHeight: 1.65,
                marginBottom: 'clamp(0.75rem, 1.5vh, 1.2rem)',
              }}
            >
              {t('music.disclaimer.body1')}
            </p>
            <p
              style={{
                color: 'rgba(244, 232, 209, 0.6)',
                fontSize: 'clamp(0.82rem, 0.95vw, 0.92rem)',
                lineHeight: 1.6,
              }}
            >
              <Trans
                i18nKey="music.disclaimer.body2"
                values={{ email: 'jameswangjiayi@gmail.com' }}
                components={{
                  1: (
                    <a
                      href="mailto:jameswangjiayi@gmail.com"
                      style={{ color: '#c4a265', textDecoration: 'underline', textDecorationColor: 'rgba(196,162,101,0.5)' }}
                    />
                  ),
                }}
              />
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Music;
