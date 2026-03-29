import { useState, useEffect } from 'react';
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

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only trigger if not typing in an input
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
      <div className="min-h-screen bg-music-bg pt-20 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-music-cream mb-4">
              Vinyl Listening Room
            </h1>
            <p className="text-music-gold text-lg">
              Click a record to play • Press <kbd className="px-2 py-1 bg-black/30 rounded border border-music-gold/30 text-sm font-mono">Space</kbd> to pause/play
            </p>
          </div>

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
