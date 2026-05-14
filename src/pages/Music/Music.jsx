import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition';
import Turntable from './Turntable';
import RecordCrate from './RecordCrate';
import tracks from '../../data/tracks';
import useAudioPlayer from '../../hooks/useAudioPlayer';

function Music() {
  const [selectedTrack, setSelectedTrack] = useState(null);
  const { isPlaying, volume, setVolume, play, pause, seek } = useAudioPlayer();

  const handleSelectTrack = (track) => {
    setSelectedTrack(track);
    if (track.file) {
      play(track.file);
    }
  };

  const handlePlayPause = () => {
    if (!selectedTrack || !selectedTrack.file) return;

    if (isPlaying) {
      pause();
    } else {
      play(selectedTrack.file);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedTrack, isPlaying]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-music-bg pt-24 px-6 pb-24 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-music-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-music-gold/3 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-14"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-music-cream mb-3 tracking-tight">
              Vinyl Listening Room
            </h1>
            <div className="w-16 h-0.5 bg-gradient-to-r from-music-gold to-transparent mb-4" />
            <p className="text-music-gold/60 text-base">
              Click a record to play &middot; Press{' '}
              <kbd className="px-2 py-0.5 bg-black/30 rounded-md border border-music-gold/20 text-xs font-mono text-music-gold/80">
                Space
              </kbd>{' '}
              to pause/play
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <Turntable
                track={selectedTrack}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                volume={volume}
                onVolumeChange={setVolume}
                onSeek={seek}
              />
            </div>

            <div>
              <RecordCrate
                tracks={tracks}
                onSelectTrack={handleSelectTrack}
                selectedTrack={selectedTrack}
              />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Music;
