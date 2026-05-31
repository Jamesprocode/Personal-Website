import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const AudioPlayerContext = createContext(null);
const LOOP_MODES = ['album', 'one', 'shuffle'];

// Tracks render in alphabetical order in the UI; use the same order for
// next-track navigation so the playback queue matches what the user sees.
const getPlaylist = (album) => {
  if (!album?.tracks) return [];
  return [...album.tracks]
    .filter((t) => Boolean(t.file))
    .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
};

const pickNext = (playlist, current, mode) => {
  if (!playlist || playlist.length === 0) return null;
  if (mode === 'one') return current;
  if (mode === 'shuffle') {
    if (playlist.length === 1) return playlist[0];
    let candidate;
    do {
      candidate = playlist[Math.floor(Math.random() * playlist.length)];
    } while (candidate.id === current?.id);
    return candidate;
  }
  // 'album': next track, wrap to top after the last
  const idx = playlist.findIndex((t) => t.id === current?.id);
  return playlist[(idx + 1) % playlist.length];
};

export function AudioPlayerProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // Track + album live in the provider so the mini-player and the main
  // turntable share the same source of truth.
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  // Used to decide whether the persistent mini-player should appear.
  const [hasEverPlayed, setHasEverPlayed] = useState(false);
  // Loop / shuffle mode for auto-advance and the Next button.
  const [loopMode, setLoopMode] = useState('album');

  const audioRef = useRef(null);
  const currentTrackRef = useRef(null);
  // Latest seek target that arrived while the element was still resolving a
  // previous seek. Applied on the 'seeked' event so we never thrash.
  const pendingSeekRef = useRef(null);

  // Web Audio analyzer chain
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const dataArrayRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const ensureAnalyser = useCallback((mediaEl) => {
    try {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        audioCtxRef.current = new Ctx();
        analyserRef.current = audioCtxRef.current.createAnalyser();
        analyserRef.current.fftSize = 1024;
        analyserRef.current.smoothingTimeConstant = 0.85;
        dataArrayRef.current = new Uint8Array(analyserRef.current.fftSize);
      }

      if (sourceRef.current && sourceRef.current.mediaElement !== mediaEl) {
        try {
          sourceRef.current.disconnect();
        } catch {
          /* no-op */
        }
        sourceRef.current = null;
      }

      if (!sourceRef.current) {
        sourceRef.current = audioCtxRef.current.createMediaElementSource(mediaEl);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioCtxRef.current.destination);
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    } catch {
      /* Analyser is best-effort. */
    }
  }, []);

  const getLevel = useCallback(() => {
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    if (!analyser || !dataArray || !isPlaying) return 0;

    analyser.getByteTimeDomainData(dataArray);
    let sumSquares = 0;
    for (let i = 0; i < dataArray.length; i += 1) {
      const x = (dataArray[i] - 128) / 128;
      sumSquares += x * x;
    }
    const rms = Math.sqrt(sumSquares / dataArray.length);
    return Math.min(1, rms * 2.2);
  }, [isPlaying]);

  // The `ended` listener is attached when the audio element is created and
  // can't see updated state directly. Route it through a ref that the latest
  // effect keeps in sync so loopMode / shuffle decisions stay fresh.
  const onEndedRef = useRef(() => {});

  const play = useCallback((trackFile) => {
    if (!trackFile) return;

    if (trackFile !== currentTrackRef.current) {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(trackFile);
      audio.crossOrigin = 'anonymous';
      audio.volume = volume / 100;
      audioRef.current = audio;
      currentTrackRef.current = trackFile;

      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
      audio.addEventListener('ended', () => {
        onEndedRef.current();
      });
      // When a seek finishes, chase the most recent pending target (if any).
      // This serializes rapid scrub seeks so the element never gets stuck in
      // a perpetual "seeking" state that silences playback.
      audio.addEventListener('seeked', () => {
        if (pendingSeekRef.current !== null) {
          const next = pendingSeekRef.current;
          pendingSeekRef.current = null;
          if (Math.abs(audio.currentTime - next) > 0.05) {
            audio.currentTime = next;
          }
        }
      });
    }

    if (audioRef.current) {
      ensureAnalyser(audioRef.current);
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
      setHasEverPlayed(true);
    }
  }, [volume, ensureAnalyser]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const selectTrack = useCallback((album, track) => {
    setSelectedAlbum(album);
    setSelectedTrack(track);
    if (track?.file) {
      play(track.file);
    }
  }, [play]);

  const togglePlayPause = useCallback(() => {
    if (!selectedTrack || !selectedTrack.file) return;
    if (isPlaying) {
      pause();
    } else {
      play(selectedTrack.file);
    }
  }, [selectedTrack, isPlaying, play, pause]);

  // Advance to the next track in the active album, respecting loop mode.
  const playNext = useCallback(() => {
    const playlist = getPlaylist(selectedAlbum);
    if (!playlist.length || !selectedTrack) return;
    // For the Next button, "loop one" still advances — repeating the same
    // track on a manual press isn't useful. Only auto-advance honors 'one'.
    const mode = loopMode === 'one' ? 'album' : loopMode;
    const next = pickNext(playlist, selectedTrack, mode);
    if (!next || !next.file) return;
    setSelectedTrack(next);
    // Force the audio element to recreate even if the file path repeats.
    currentTrackRef.current = null;
    play(next.file);
  }, [selectedAlbum, selectedTrack, loopMode, play]);

  const cycleLoopMode = useCallback(() => {
    setLoopMode((current) => {
      const idx = LOOP_MODES.indexOf(current);
      return LOOP_MODES[(idx + 1) % LOOP_MODES.length];
    });
  }, []);

  // Keep onEndedRef in sync with the latest state so auto-advance honors
  // the current loop mode and album.
  useEffect(() => {
    onEndedRef.current = () => {
      const playlist = getPlaylist(selectedAlbum);
      if (!playlist.length || !selectedTrack) {
        setIsPlaying(false);
        setCurrentTime(0);
        return;
      }
      const next = pickNext(playlist, selectedTrack, loopMode);
      if (next && next.file) {
        setSelectedTrack(next);
        currentTrackRef.current = null;
        play(next.file);
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };
  }, [selectedAlbum, selectedTrack, loopMode, play]);

  // Serialize seeks instead of time-throttling them. Setting currentTime
  // again while the element is still resolving the previous seek (common
  // when streaming MP3s over the network, and slower for VBR files) thrashes
  // it into a perpetual "seeking" state and silences playback — which feels
  // like scrubbing "stops" the track. We apply one seek at a time and stash
  // the latest target; the 'seeked' listener flushes it when ready.
  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio) return;
    // Immediate UI feedback; 'timeupdate' reconciles the exact value.
    setCurrentTime(time);
    if (audio.seeking) {
      pendingSeekRef.current = time;
      return;
    }
    audio.currentTime = time;
  }, []);

  // Clean up the audio context on unmount of the provider (i.e., app unload)
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const value = {
    isPlaying,
    volume,
    currentTime,
    duration,
    selectedAlbum,
    selectedTrack,
    hasEverPlayed,
    loopMode,
    setVolume,
    play,
    pause,
    togglePlayPause,
    selectTrack,
    playNext,
    cycleLoopMode,
    seek,
    getLevel,
  };

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>;
}

function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayer must be used inside <AudioPlayerProvider>');
  return ctx;
}

export default useAudioPlayer;
