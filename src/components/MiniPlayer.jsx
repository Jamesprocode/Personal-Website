import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  motion as Motion,
  AnimatePresence,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
} from 'framer-motion';
import useAudioPlayer from '../hooks/useAudioPlayer';
import { LoopButton, NextButton } from '../pages/Music/TransportButtons';

const DISC_SIZE = 92;
const CARD_PAD = 8;
const TRANSPORT_HEIGHT = 36;
const CARD_WIDTH = DISC_SIZE + CARD_PAD * 2;
const CARD_HEIGHT = DISC_SIZE + TRANSPORT_HEIGHT + CARD_PAD * 2;
const DOUBLE_TAP_MS = 280;

/**
 * Floating mini-player. A small rounded card with a spinning vinyl record
 * on top and Loop + Next transport buttons in a row at the bottom.
 *
 * Interactions on the disc itself:
 *   - Single click → toggle play / pause
 *   - Drag        → reposition the whole card anywhere on screen
 *   - Double click → open the full music page
 *   - X button    → close the floating card and stop playback
 *
 * Loop and Next buttons stop event propagation so they don't trigger the
 * disc's tap/drag handlers.
 *
 * Hidden on /music (the full turntable is already in view) and until the
 * user has played at least one track in this session.
 */
const NOTE_GLYPHS = ['♪', '♫', '♬', '𝄞'];

function MiniPlayer() {
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [bounds, setBounds] = useState({ top: -600, left: -1000, right: 0, bottom: 0 });
  // A small queue of music-note particles currently floating out of the
  // disc. Each entry is { id, glyph, drift } — drift = horizontal offset.
  const [notes, setNotes] = useState([]);
  const {
    selectedAlbum,
    isPlaying,
    isBuffering,
    hasEverPlayed,
    togglePlayPause,
    stop,
    loopMode,
    cycleLoopMode,
    playNext,
  } = useAudioPlayer();

  // Spawn a new note every ~700ms while playing. Each note auto-removes
  // after its animation completes so the array stays tiny.
  useEffect(() => {
    if (!isPlaying || reduceMotion) {
      return undefined;
    }
    const spawn = () => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const glyph = NOTE_GLYPHS[Math.floor(Math.random() * NOTE_GLYPHS.length)];
      const drift = -32 + Math.random() * 64;       // horizontal drift in px
      const tilt = -25 + Math.random() * 50;        // final rotation in deg
      setNotes((prev) => [...prev, { id, glyph, drift, tilt }]);
      window.setTimeout(() => {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }, 2400);
    };
    spawn(); // immediate first note so it feels alive right away
    const handle = window.setInterval(spawn, 700);
    return () => window.clearInterval(handle);
  }, [isPlaying, reduceMotion]);

  useEffect(() => {
    const update = () => {
      setBounds({
        top: -(window.innerHeight - CARD_HEIGHT - 24),
        left: -(window.innerWidth - CARD_WIDTH - 24),
        right: 0,
        bottom: 0,
      });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const rotation = useMotionValue(0);
  useAnimationFrame((_, deltaMs) => {
    if (isPlaying && !reduceMotion) {
      rotation.set(rotation.get() + deltaMs * 0.09);
    }
  });

  const onMusicPage = location.pathname === '/music';
  const shouldShow = hasEverPlayed && !onMusicPage;
  const activeNotes = isPlaying && !reduceMotion ? notes : [];

  const accent = selectedAlbum?.accentColor || '#c4a265';

  // Distinguish single vs double tap on the disc area.
  const tapTimerRef = useRef(null);
  const handleClose = (e) => {
    e.stopPropagation();
    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
      tapTimerRef.current = null;
    }
    setNotes([]);
    setHovered(false);
    stop();
  };

  const handleDiscTap = () => {
    if (isDragging) return;
    if (tapTimerRef.current !== null) {
      clearTimeout(tapTimerRef.current);
      tapTimerRef.current = null;
      navigate('/music');
      return;
    }
    tapTimerRef.current = setTimeout(() => {
      tapTimerRef.current = null;
      togglePlayPause();
    }, DOUBLE_TAP_MS);
  };
  useEffect(() => () => {
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
  }, []);

  return (
    <AnimatePresence>
      {shouldShow && (
        <Motion.div
          key="mini"
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.92 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          drag
          dragMomentum={false}
          dragElastic={0.15}
          dragConstraints={bounds}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => {
            setTimeout(() => setIsDragging(false), 0);
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          
          aria-label="Floating music player. Drag to reposition."
          style={{
            position: 'fixed',
            bottom: 'clamp(1rem, 3vh, 2rem)',
            right: 'clamp(1rem, 3vw, 2rem)',
            width: CARD_WIDTH,
            padding: CARD_PAD,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            cursor: isDragging ? 'grabbing' : 'grab',
            zIndex: 60,
            borderRadius: 18,
            background: 'linear-gradient(155deg, rgba(42,31,21,0.95), rgba(20,15,12,0.95))',
            border: '1px solid rgba(196,162,101,0.22)',
            boxShadow: '0 18px 40px -12px rgba(0,0,0,0.7), inset 0 1px 0 rgba(196,162,101,0.08)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            touchAction: 'none',
          }}
          className="focus-visible:ring-2 focus-visible:ring-[#c4a265]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
        >
          <button
            type="button"
            aria-label="Close floating music player and stop audio"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: -9,
              right: -9,
              width: 26,
              height: 26,
              borderRadius: '50%',
              border: '1px solid rgba(196,162,101,0.45)',
              background: 'rgba(20,15,12,0.96)',
              color: '#f4e8d1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 18px -10px rgba(0,0,0,0.8), inset 0 1px 0 rgba(244,232,209,0.08)',
              zIndex: 4,
            }}
          >
            <span
              aria-hidden
              style={{
                position: 'absolute',
                width: 13,
                height: 1.7,
                borderRadius: 9999,
                backgroundColor: 'currentColor',
                transform: 'rotate(45deg)',
              }}
            />
            <span
              aria-hidden
              style={{
                position: 'absolute',
                width: 13,
                height: 1.7,
                borderRadius: 9999,
                backgroundColor: 'currentColor',
                transform: 'rotate(-45deg)',
              }}
            />
          </button>

          {/* Disc + tap handler — onTap fires only when not dragging.
              We wrap the disc in its own motion element so it carries its
              own gestures separate from the parent card's drag. */}
          <Motion.div
            onTap={handleDiscTap}
            role="button"
            tabIndex={0}
            aria-label={`Play controls. ${isPlaying ? 'Now playing' : 'Paused'}. Click to toggle, double-click to open.`}
            style={{
              width: DISC_SIZE,
              height: DISC_SIZE,
              position: 'relative',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
          >
            {/* Music-note particles. Each one starts at the upper half of
                the disc and drifts up + outward while fading. */}
            <AnimatePresence>
              {activeNotes.map((note) => (
                <Motion.span
                  key={note.id}
                  aria-hidden
                  initial={{ opacity: 0, y: 0, x: 0, scale: 0.7, rotate: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: -80,
                    x: note.drift,
                    scale: 1.1,
                    rotate: note.tilt,
                  }}
                  transition={{ duration: 2.4, ease: 'easeOut', times: [0, 0.12, 0.72, 1] }}
                  style={{
                    position: 'absolute',
                    top: '20%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    fontFamily: 'Space Grotesk, system-ui, sans-serif',
                    fontSize: 16,
                    color: '#c4a265',
                    textShadow: '0 0 6px rgba(196,162,101,0.45)',
                    zIndex: 2,
                  }}
                >
                  {note.glyph}
                </Motion.span>
              ))}
            </AnimatePresence>

            {/* Spinning record */}
            <Motion.div
              style={{
                rotate: rotation,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                position: 'relative',
                background: 'radial-gradient(circle at 50% 50%, #2a2a2a 0%, #0a0a0a 70%, #050505 100%)',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.04), 0 0 0 1px rgba(196,162,101,0.22)',
              }}
            >
              {[0.92, 0.78, 0.64].map((scale) => (
                <div
                  key={scale}
                  aria-hidden
                  style={{
                    position: 'absolute',
                    inset: `${(1 - scale) * 50}%`,
                    borderRadius: '50%',
                    border: '0.5px solid rgba(120,120,120,0.18)',
                    pointerEvents: 'none',
                  }}
                />
              ))}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: '34%',
                  borderRadius: '50%',
                  backgroundColor: accent,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.45)',
                  border: '1px solid rgba(20,15,10,0.4)',
                }}
              />
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 7,
                  height: 7,
                  marginTop: -3.5,
                  marginLeft: -3.5,
                  borderRadius: '50%',
                  background: '#0a0806',
                  border: '1px solid rgba(196,162,101,0.5)',
                }}
              />
            </Motion.div>

            {/* Buffering ring: spins around the disc while the track is
                downloading so a slow start reads as "loading," matching the
                turntable's play-button spinner. */}
            {isBuffering && !reduceMotion && (
              <Motion.span
                aria-hidden
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, ease: 'linear', repeat: Infinity }}
                style={{
                  position: 'absolute',
                  inset: -3,
                  borderRadius: '50%',
                  border: '2px solid transparent',
                  borderTopColor: accent,
                  borderRightColor: 'rgba(196,162,101,0.3)',
                  pointerEvents: 'none',
                  zIndex: 3,
                }}
              />
            )}

            {/* Hover overlay: visual hint for play/pause state. */}
            <AnimatePresence>
              {hovered && (
                <Motion.span
                  key="overlay"
                  aria-hidden
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: 'rgba(8,5,3,0.72)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  {isPlaying ? (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="#f4e8d1" aria-hidden>
                      <rect x="6" y="5" width="4" height="14" rx="1" />
                      <rect x="14" y="5" width="4" height="14" rx="1" />
                    </svg>
                  ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#f4e8d1" aria-hidden>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </Motion.span>
              )}
            </AnimatePresence>
          </Motion.div>

          {/* Transport row */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              height: TRANSPORT_HEIGHT,
              borderTop: '1px solid rgba(196,162,101,0.15)',
              paddingTop: 4,
            }}
          >
            <LoopButton mode={loopMode} onClick={cycleLoopMode} size={20} />
            <NextButton onClick={playNext} size={20} />
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}

export default MiniPlayer;
