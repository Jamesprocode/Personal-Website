import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// Musical symbols. Mixed eighth/quarter/sixteenth notes plus the
// accidentals — enough variety that the trail doesn't feel like one
// repeating glyph.
const SYMBOLS = ['♪', '♫', '♬', '♩', '♭', '♯'];

// Brass tones from the brand palette. Each spawned note picks one at
// random so the trail reads as different ink dabs, not a uniform color.
const BRASS = ['#a06f1d', '#c98b2c', '#d4a13d', '#7a4f15', '#b8862e'];

// Minimum cursor travel between spawns. Bumped from 36 → 56 because
// each spawned note triggers a React setState + a new motion.span with
// framer animations on five properties, which costs ~9 fps during scroll
// when the user moves the cursor rapidly.
const SPAWN_DISTANCE = 56;
// During active scroll, skip spawning entirely for SCROLL_SUPPRESS_MS to
// keep the trail from competing for paint time with the scroll-driven
// background transforms. 220 ms beats 120 — at 120 a fast-moving cursor
// during a slow scroll still leaks notes through. 220 covers a typical
// trackpad scroll gesture cleanly.
const SCROLL_SUPPRESS_MS = 220;
// Cap simultaneously-active notes so a fast cursor sweep over time can't
// pile up dozens of animated nodes.
const MAX_ACTIVE_NOTES = 14;

/**
 * Renders a trail of musical notes behind the cursor on desktop.
 *
 * Each note appears at the cursor position, floats up and slightly to the
 * side, fades over ~1.4s, then is removed from the DOM. The container is
 * `position: fixed` so notes track the viewport regardless of scroll, and
 * `pointer-events: none` so nothing here ever blocks interaction.
 *
 * Disabled under `prefers-reduced-motion` and on coarse pointers (touch).
 */
function CursorMusicTrail() {
  const reduceMotion = useReducedMotion();
  const [notes, setNotes] = useState([]);
  const lastPos = useRef({ x: -9999, y: -9999 });
  const idRef = useRef(0);
  const lastScrollAt = useRef(0);

  useEffect(() => {
    if (reduceMotion) return undefined;
    // Skip on touch devices — there's no persistent cursor to trail
    const isCoarse = window.matchMedia?.('(pointer: coarse)').matches;
    if (isCoarse) return undefined;

    // Spawn a single note at viewport (x, y). dirSign biases horizontal
    // drift direction; verticalBias (1 = drift down, -1 = drift up) lets
    // scroll-driven spawns rain in the direction the user is scrolling.
    function spawnNote(x, y, dirSign, verticalBias = -1) {
      const id = idRef.current++;
      const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      const color = BRASS[Math.floor(Math.random() * BRASS.length)];
      const rotation = (Math.random() - 0.5) * 28;
      const size = 18 + Math.floor(Math.random() * 14);
      const driftX = dirSign * (12 + Math.random() * 28);
      // Vertical drift magnitude is consistent; sign is the bias passed in.
      const driftY = verticalBias * (36 + Math.random() * 44);
      const swayX = driftX * (0.25 + Math.random() * 0.5);
      const duration = 1.3 + Math.random() * 0.7;
      const spin = (Math.random() - 0.5) * 22;

      setNotes((prev) => {
        const next = [...prev, { id, x, y, symbol, color, rotation, size, driftX, driftY, swayX, duration, spin }];
        // Cap active count — drop the oldest if we exceed the limit so
        // bursts during fast cursor sweeps can't pile up.
        return next.length > MAX_ACTIVE_NOTES ? next.slice(-MAX_ACTIVE_NOTES) : next;
      });
    }

    function onMove(e) {
      // Short-circuit during active scrolling: spawning a note triggers
      // setState + a fresh framer-motion span which compete for paint
      // with the section background's scroll transforms.
      if (performance.now() - lastScrollAt.current < SCROLL_SUPPRESS_MS) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.hypot(dx, dy);
      if (dist < SPAWN_DISTANCE) return;
      const dirSign = Math.sign(dx) || (Math.random() - 0.5 > 0 ? 1 : -1);
      spawnNote(e.clientX, e.clientY, dirSign, -1);
      lastPos.current = { x: e.clientX, y: e.clientY };
    }

    function onScroll() {
      lastScrollAt.current = performance.now();
    }

    // Cursor-only — scroll drives the painterly backgrounds, not new
    // notes, so the two channels don't fight for visual attention.
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, [reduceMotion]);

  function removeNote(id) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  // Skip rendering the wrapper entirely when no notes are active.
  // `position: fixed` + a persistent container forces a compositor layer
  // even when empty; returning null removes that idle GPU footprint.
  if (notes.length === 0) return null;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 60,
        overflow: 'hidden',
      }}
    >
      <AnimatePresence>
        {notes.map((note) => (
          <motion.span
            key={note.id}
            initial={{ opacity: 0, scale: 0.4, x: 0, y: 0, rotate: note.rotation }}
            animate={{
              // All four properties share `times: [0, 0.18, 0.6, 1]` so the
              // keyframes have to be 4-long. Quick fade-in, long hold, gentle
              // fade-out; the x/y arc takes most of the duration to settle.
              opacity: [0, 0.9, 0.85, 0],
              scale: [0.4, 1.05, 1, 0.92],
              x: [0, note.swayX * 0.4, note.swayX, note.driftX],
              y: [0, note.driftY * 0.18, note.driftY * 0.6, note.driftY],
              rotate: [
                note.rotation,
                note.rotation + note.spin * 0.3,
                note.rotation + note.spin * 0.7,
                note.rotation + note.spin,
              ],
            }}
            transition={{
              duration: note.duration,
              ease: [0.16, 1, 0.3, 1],
              times: [0, 0.18, 0.6, 1],
            }}
            onAnimationComplete={() => removeNote(note.id)}
            style={{
              position: 'absolute',
              left: note.x,
              top: note.y,
              fontSize: note.size,
              color: note.color,
              fontFamily: '"Noto Music", "Apple Symbols", "Segoe UI Symbol", serif',
              fontWeight: 600,
              userSelect: 'none',
              textShadow: '0 1px 0 rgba(244, 232, 209, 0.5)',
              transformOrigin: 'center center',
              willChange: 'transform, opacity',
              // Center the glyph on the cursor point
              translate: '-50% -50%',
            }}
          >
            {note.symbol}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default CursorMusicTrail;
