import { useState, useRef, useEffect } from 'react';

function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const currentTrackRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const play = (trackFile) => {
    if (trackFile && trackFile !== currentTrackRef.current) {
      // New track
      if (audioRef.current) {
        audioRef.current.pause();
      }

      audioRef.current = new Audio(trackFile);
      audioRef.current.volume = volume / 100;
      currentTrackRef.current = trackFile;

      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current.duration);
      });

      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current.currentTime);
      });

      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
    }

    if (audioRef.current && trackFile) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return {
    isPlaying,
    volume,
    currentTime,
    duration,
    setVolume,
    play,
    pause,
    seek,
  };
}

export default useAudioPlayer;
