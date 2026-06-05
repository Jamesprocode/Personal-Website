/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motionValue } from 'framer-motion';

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
  // True while the element is fetching/buffering audio and can't yet produce
  // sound — the gap between "user pressed play" and "audio is actually
  // playing." Surfaced in the UI as a loading indicator. On slow / mobile
  // connections (and especially for the largest track) this window can be
  // several seconds, which is exactly when the user thinks "I clicked but
  // nothing happened."
  const [isBuffering, setIsBuffering] = useState(false);
  const [volume, setVolume] = useState(70);
  const [duration, setDuration] = useState(0);
  // Playback position is a MotionValue, not React state, on purpose. The
  // <audio> element fires 'timeupdate' ~4x/sec; pushing that through useState
  // re-rendered the entire (heavy) Turntable tree 4x/sec, and on low-end /
  // mobile CPUs each reconciliation was long enough to starve the platter &
  // VU rAF loops — the disc visibly stuttered or froze. A MotionValue updates
  // subscribers without a React render, so the animation loop keeps a clean
  // frame budget. Stable across re-renders via a ref.
  const [currentTimeMV] = useState(() => motionValue(0));
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
  // The user's *intent*: did they ask for playback? Media events are the
  // source of truth for whether sound is actually coming out, but the browser
  // can pause us for buffering ('waiting') and resume later ('playing'). We
  // keep the intent here so a buffering pause doesn't get mistaken for the
  // user pausing, and so we can auto-resume once enough has buffered.
  const wantPlayingRef = useRef(false);
  // Latest seek target that arrived while the element was still resolving a
  // previous seek. Applied on the 'seeked' event so we never thrash.
  const pendingSeekRef = useRef(null);
  // Object URL of the fully-downloaded current track (see ensureFullDownload).
  // Kept so we can revoke it when switching tracks / unmounting.
  const blobUrlRef = useRef(null);
  // The trackFile we've already kicked off a full-file download for. Used to
  // run the download at most once per track, and only on demand (first seek).
  const blobFetchStartedRef = useRef(null);

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

  // Reliable seeking workaround, run ON DEMAND (first seek) rather than at
  // play() time. Cloudflare's static-asset hosting answers range requests with
  // HTTP 200 (not 206 Partial Content), so the browser can't seek to
  // un-buffered audio over the network and scrubbing stalls playback. The fix
  // is to download the whole file once and swap the element to a local blob
  // URL where seeking is instant.
  //
  // Crucially this is deferred: while the user is just listening, only the
  // <audio> element's own progressive stream is in flight. Kicking off a second
  // full-file fetch in parallel (the old behavior) doubled bandwidth use on the
  // same asset and starved the streaming download on slow / mobile connections,
  // so playback kept stalling — the platter and VU meter went unresponsive
  // "waiting for the song to download." We only pay that cost if/when the user
  // actually seeks, which is the only moment the blob buys us anything.
  const ensureFullDownload = useCallback((trackFile) => {
    if (!trackFile) return;
    if (blobFetchStartedRef.current === trackFile) return; // already fetching / done
    blobFetchStartedRef.current = trackFile;

    fetch(trackFile)
      .then((res) => res.blob())
      .then((blob) => {
        if (currentTrackRef.current !== trackFile) return; // track changed mid-download
        const a = audioRef.current;
        if (!a) return;
        const blobUrl = URL.createObjectURL(blob);
        if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = blobUrl;
        const resumeAt = a.currentTime;
        const wasPlaying = !a.paused;
        const onReady = () => {
          a.removeEventListener('loadedmetadata', onReady);
          try { a.currentTime = resumeAt; } catch { /* no-op */ }
          if (wasPlaying) a.play().catch(() => {});
        };
        a.addEventListener('loadedmetadata', onReady);
        a.src = blobUrl;
        a.load();
      })
      .catch(() => {
        // Allow a later retry; keep streaming in the meantime.
        if (blobFetchStartedRef.current === trackFile) blobFetchStartedRef.current = null;
      });
  }, []);

  // The `ended` listener is attached when the audio element is created and
  // can't see updated state directly. Route it through a ref that the latest
  // effect keeps in sync so loopMode / shuffle decisions stay fresh.
  const onEndedRef = useRef(() => {});

  const play = useCallback((trackFile) => {
    if (!trackFile) return;

    // The user wants playback as of now. Set this BEFORE touching the old
    // element so the soon-to-fire 'pause' on it isn't mistaken for a user
    // pause.
    wantPlayingRef.current = true;

    if (trackFile !== currentTrackRef.current) {
      // Fully retire the previous element. Just calling pause() isn't enough:
      // if the user switches tracks while the first is still downloading, the
      // old element keeps its in-flight network request AND its event
      // listeners alive. Those stale listeners would fire into the now-shared
      // isPlaying / isBuffering state (and a late 'canplay' could even resume
      // the wrong track). Detaching src + load() aborts the old download and
      // frees the connection — important on slow links where the two streams
      // would otherwise compete for bandwidth.
      const prev = audioRef.current;
      if (prev) {
        prev.pause();
        prev.removeAttribute('src');
        try { prev.load(); } catch { /* no-op */ }
      }

      const audio = new Audio(trackFile);
      audio.crossOrigin = 'anonymous';
      audio.preload = 'auto';
      audio.volume = volume / 100;
      audioRef.current = audio;
      currentTrackRef.current = trackFile;
      currentTimeMV.set(0); // reset position for the new track
      // A brand-new element has no buffer yet, so we're buffering until the
      // first 'playing' event fires.
      setIsBuffering(true);
      // New element streams the network URL; the full-file blob (for instant
      // seeking) is fetched lazily on the first seek, not now.
      blobFetchStartedRef.current = null;

      // Every listener bails if this element is no longer the active one, so
      // a slow track that gets superseded mid-load can never touch shared
      // state or resume itself after the user moved on.
      const isCurrent = () => audioRef.current === audio;

      audio.addEventListener('loadedmetadata', () => {
        if (!isCurrent()) return;
        setDuration(audio.duration);
      });
      audio.addEventListener('timeupdate', () => {
        if (!isCurrent()) return;
        currentTimeMV.set(audio.currentTime);
      });
      audio.addEventListener('ended', () => {
        if (!isCurrent()) return;
        onEndedRef.current();
      });
      // --- Truth-driven playback state ---------------------------------
      // The browser, not our optimistic setIsPlaying, decides when sound is
      // actually playing. These listeners keep isPlaying / isBuffering honest
      // on slow networks so the UI never claims "playing" while silent, and
      // so a buffering stall auto-recovers instead of looking like a dead
      // click.
      audio.addEventListener('waiting', () => {
        if (!isCurrent()) return;
        if (wantPlayingRef.current) setIsBuffering(true);
      });
      audio.addEventListener('stalled', () => {
        if (!isCurrent()) return;
        if (wantPlayingRef.current) setIsBuffering(true);
      });
      audio.addEventListener('playing', () => {
        if (!isCurrent()) return;
        setIsBuffering(false);
        setIsPlaying(true);
      });
      audio.addEventListener('canplay', () => {
        if (!isCurrent()) return;
        // Enough buffered to start. If the user still wants playback but the
        // element is paused (e.g. it paused itself to buffer), resume.
        if (wantPlayingRef.current && audio.paused) {
          audio.play().catch(() => {});
        }
      });
      audio.addEventListener('pause', () => {
        if (!isCurrent()) return;
        // Only treat as a real pause if the user actually wanted to stop.
        // Buffering pauses keep wantPlaying true, so we ignore those here.
        if (!wantPlayingRef.current) {
          setIsPlaying(false);
          setIsBuffering(false);
        }
      });
      audio.addEventListener('error', () => {
        if (!isCurrent()) return;
        setIsBuffering(false);
      });
      // When a seek finishes, chase the most recent pending target (if any).
      // This serializes rapid scrub seeks so the element never gets stuck in
      // a perpetual "seeking" state that silences playback.
      audio.addEventListener('seeked', () => {
        if (!isCurrent()) return;
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
      // Don't optimistically flip isPlaying here — the 'playing' event does
      // that once sound is actually out. We do show the buffering indicator
      // immediately so the click feels acknowledged.
      if (audioRef.current.paused) setIsBuffering(true);
      audioRef.current.play().catch(() => {
        // Autoplay rejection or an aborted load. Drop the intent so the UI
        // doesn't get stuck showing a spinner forever.
        wantPlayingRef.current = false;
        setIsBuffering(false);
        setIsPlaying(false);
      });
      setHasEverPlayed(true);
    }
  }, [volume, ensureAnalyser, currentTimeMV]);

  const pause = useCallback(() => {
    // Record intent first so the element's 'pause' listener knows this was a
    // deliberate stop (not a buffering hiccup) and clears state.
    wantPlayingRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsBuffering(false);
    }
  }, []);

  const stop = useCallback(() => {
    wantPlayingRef.current = false;
    pendingSeekRef.current = null;

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute('src');
      try { audio.load(); } catch { /* no-op */ }
    }

    audioRef.current = null;
    currentTrackRef.current = null;
    blobFetchStartedRef.current = null;

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    if (sourceRef.current) {
      try { sourceRef.current.disconnect(); } catch { /* no-op */ }
      sourceRef.current = null;
    }

    setIsPlaying(false);
    setIsBuffering(false);
    setDuration(0);
    setHasEverPlayed(false);
    currentTimeMV.set(0);
  }, [currentTimeMV]);

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
        wantPlayingRef.current = false;
        setIsPlaying(false);
        setIsBuffering(false);
        currentTimeMV.set(0);
        return;
      }
      const next = pickNext(playlist, selectedTrack, loopMode);
      if (next && next.file) {
        setSelectedTrack(next);
        currentTrackRef.current = null;
        play(next.file);
      } else {
        wantPlayingRef.current = false;
        setIsPlaying(false);
        setIsBuffering(false);
        currentTimeMV.set(0);
      }
    };
  }, [selectedAlbum, selectedTrack, loopMode, play, currentTimeMV]);

  // Serialize seeks instead of time-throttling them. Setting currentTime
  // again while the element is still resolving the previous seek (common
  // when streaming MP3s over the network, and slower for VBR files) thrashes
  // it into a perpetual "seeking" state and silences playback — which feels
  // like scrubbing "stops" the track. We apply one seek at a time and stash
  // the latest target; the 'seeked' listener flushes it when ready.
  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio) return;
    // The user is scrubbing — now it's worth downloading the whole file so
    // seeks land instantly (and future seeks never stall). No-ops after the
    // first call per track. Until the blob is ready, seeks run against the
    // streaming element and may briefly stall on un-buffered regions.
    ensureFullDownload(currentTrackRef.current);
    // Immediate UI feedback; 'timeupdate' reconciles the exact value.
    currentTimeMV.set(time);
    if (audio.seeking) {
      pendingSeekRef.current = time;
      return;
    }
    audio.currentTime = time;
  }, [ensureFullDownload, currentTimeMV]);

  // Clean up the audio context on unmount of the provider (i.e., app unload)
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Memoized so the context value identity only changes when real control
  // state does (play state, track, volume, duration…), NOT on every playback
  // tick — position now flows through the `currentTimeMV` MotionValue, which
  // never triggers a re-render. currentTimeMV / setVolume / the callbacks are
  // all referentially stable, so they don't need to be in the dep list, but
  // including them keeps lint happy and is harmless.
  const value = useMemo(
    () => ({
      isPlaying,
      isBuffering,
      volume,
      currentTimeMV,
      duration,
      selectedAlbum,
      selectedTrack,
      hasEverPlayed,
      loopMode,
      setVolume,
      play,
      pause,
      stop,
      togglePlayPause,
      selectTrack,
      playNext,
      cycleLoopMode,
      seek,
      getLevel,
    }),
    [
      isPlaying,
      isBuffering,
      volume,
      currentTimeMV,
      duration,
      selectedAlbum,
      selectedTrack,
      hasEverPlayed,
      loopMode,
      play,
      pause,
      stop,
      togglePlayPause,
      selectTrack,
      playNext,
      cycleLoopMode,
      seek,
      getLevel,
    ]
  );

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>;
}

function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayer must be used inside <AudioPlayerProvider>');
  return ctx;
}

export default useAudioPlayer;
