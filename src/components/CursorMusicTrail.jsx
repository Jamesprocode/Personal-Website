import { useEffect, useRef, useState } from 'react';
import {
  motion as Motion,
  AnimatePresence,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';

// Musical symbols. Mixed eighth/quarter/sixteenth notes plus the
// accidentals: enough variety that the trail doesn't feel like one
// repeating glyph.
const SYMBOLS = ['♪', '♫', '♬', '♩', '♭', '♯'];

// Brass tones from the brand palette. Each spawned note picks one at
// random so the trail reads as different ink dabs, not a uniform color.
const BRASS = ['#a06f1d', '#c98b2c', '#d4a13d', '#7a4f15', '#b8862e'];

// Minimum cursor travel between spawns. Each spawned note triggers a
// React setState plus a new motion span, so we keep this conservative.
const SPAWN_DISTANCE = 56;
// During active scroll, skip spawning entirely for SCROLL_SUPPRESS_MS so
// the trail does not compete with scroll-driven section backgrounds.
const SCROLL_SUPPRESS_MS = 220;
const MAX_ACTIVE_NOTES = 14;

// First-draft baton geometry, tightened: the bead is the aim point, and
// the shorter shaft/handle trail down with a slight rightward lean.
const BATON_TIP_X = 8;
const BATON_TIP_Y = 8;

const ACTION_SELECTOR = [
  'a',
  'button',
  'input',
  'textarea',
  'select',
  '[role="button"]',
  '[role="link"]',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');

/**
 * Renders a conductor baton cursor and musical note trail on desktop.
 *
 * This is the original baton draft: a visible tip bead with the baton
 * handle trailing diagonally away. Disabled under `prefers-reduced-motion`
 * and on coarse pointers.
 */
function CursorMusicTrail() {
  const reduceMotion = useReducedMotion();
  const [notes, setNotes] = useState([]);
  const [canUseCursor, setCanUseCursor] = useState(false);
  const [cursorReady, setCursorReady] = useState(false);
  const [isActionTarget, setIsActionTarget] = useState(false);
  const [isPointerPressed, setIsPointerPressed] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorRotate = useMotionValue(-18);
  const batonRotate = useSpring(cursorRotate, { stiffness: 420, damping: 34, mass: 0.4 });
  const lastPos = useRef({ x: -9999, y: -9999 });
  const cursorReadyRef = useRef(false);
  const lastActionTarget = useRef(false);
  const idRef = useRef(0);
  const lastScrollAt = useRef(0);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const pointerQuery = window.matchMedia?.('(pointer: fine)');
    const hoverQuery = window.matchMedia?.('(hover: hover)');

    function syncCursorCapability() {
      setCanUseCursor(Boolean(pointerQuery?.matches && hoverQuery?.matches));
    }

    syncCursorCapability();
    pointerQuery?.addEventListener('change', syncCursorCapability);
    hoverQuery?.addEventListener('change', syncCursorCapability);

    return () => {
      pointerQuery?.removeEventListener('change', syncCursorCapability);
      hoverQuery?.removeEventListener('change', syncCursorCapability);
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion || !canUseCursor) return undefined;

    function spawnNote(x, y, dirSign, verticalBias = -1) {
      const id = idRef.current++;
      const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      const color = BRASS[Math.floor(Math.random() * BRASS.length)];
      const rotation = (Math.random() - 0.5) * 28;
      const size = 18 + Math.floor(Math.random() * 14);
      const driftX = dirSign * (12 + Math.random() * 28);
      const driftY = verticalBias * (36 + Math.random() * 44);
      const swayX = driftX * (0.25 + Math.random() * 0.5);
      const duration = 1.3 + Math.random() * 0.7;
      const spin = (Math.random() - 0.5) * 22;

      setNotes((prev) => {
        const next = [...prev, { id, x, y, symbol, color, rotation, size, driftX, driftY, swayX, duration, spin }];
        return next.length > MAX_ACTIVE_NOTES ? next.slice(-MAX_ACTIVE_NOTES) : next;
      });
    }

    function onMove(e) {
      cursorX.set(e.clientX - BATON_TIP_X);
      cursorY.set(e.clientY - BATON_TIP_Y);
      if (!cursorReadyRef.current) {
        cursorReadyRef.current = true;
        setCursorReady(true);
      }

      const targetIsAction = e.target instanceof Element && Boolean(e.target.closest(ACTION_SELECTOR));
      if (targetIsAction !== lastActionTarget.current) {
        lastActionTarget.current = targetIsAction;
        setIsActionTarget(targetIsAction);
      }

      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      if (Number.isFinite(dx) && Number.isFinite(dy)) {
        const tilt = Math.max(-42, Math.min(26, -18 + dx * 0.38 + dy * 0.08));
        cursorRotate.set(tilt);
      }

      if (performance.now() - lastScrollAt.current < SCROLL_SUPPRESS_MS) {
        lastPos.current = { x: e.clientX, y: e.clientY };
        return;
      }

      const dist = Math.hypot(dx, dy);
      if (dist < SPAWN_DISTANCE) return;
      const dirSign = Math.sign(dx) || (Math.random() - 0.5 > 0 ? 1 : -1);
      spawnNote(e.clientX, e.clientY, dirSign, -1);
      lastPos.current = { x: e.clientX, y: e.clientY };
    }

    function onScroll() {
      lastScrollAt.current = performance.now();
    }

    function onPointerDown() {
      setIsPointerPressed(true);
    }

    function onPointerUp() {
      setIsPointerPressed(false);
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('scroll', onScroll);
    };
  }, [canUseCursor, cursorRotate, cursorX, cursorY, reduceMotion]);

  useEffect(() => {
    if (reduceMotion || !canUseCursor || !cursorReady) return undefined;
    document.documentElement.classList.add('conductor-cursor-active');
    return () => {
      document.documentElement.classList.remove('conductor-cursor-active');
    };
  }, [canUseCursor, cursorReady, reduceMotion]);

  function removeNote(id) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  if (!canUseCursor && notes.length === 0) return null;

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
          <Motion.span
            key={note.id}
            initial={{ opacity: 0, scale: 0.4, x: 0, y: 0, rotate: note.rotation }}
            animate={{
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
              translate: '-50% -50%',
            }}
          >
            {note.symbol}
          </Motion.span>
        ))}
      </AnimatePresence>
      {canUseCursor && (
        <Motion.svg
          aria-hidden
          data-conductor-cursor="baton"
          viewBox="-8 -8 54 58"
          initial={false}
          animate={{
            opacity: cursorReady ? 1 : 0,
            scale: isPointerPressed ? 0.94 : isActionTarget ? 1.04 : 1,
          }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: 54,
            height: 58,
            x: cursorX,
            y: cursorY,
            rotate: batonRotate,
            transformOrigin: `${BATON_TIP_X}px ${BATON_TIP_Y}px`,
            overflow: 'visible',
            filter: isActionTarget
              ? 'drop-shadow(0 3px 10px var(--cursor-shadow-active))'
              : 'drop-shadow(0 2px 7px var(--cursor-shadow))',
            willChange: 'transform, opacity',
          }}
        >
          {isActionTarget && (
            <Motion.circle
              cx="0"
              cy="0"
              r={isPointerPressed ? 5.2 : 6.7}
              fill="none"
              stroke="var(--cursor-click-ring)"
              strokeWidth="1"
              initial={false}
              animate={{ opacity: isPointerPressed ? 0.95 : 0.7 }}
              transition={{ duration: 0.12 }}
            />
          )}
          <line
            x1="0"
            y1="0"
            x2="19.2"
            y2="34.6"
            stroke="var(--cursor-shaft)"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <line
            x1="3.1"
            y1="5.6"
            x2="17.5"
            y2="31.6"
            stroke="var(--cursor-shaft-highlight)"
            strokeWidth="0.85"
            strokeLinecap="round"
          />
          <circle
            data-conductor-cursor-tip="true"
            cx="0"
            cy="0"
            r={isPointerPressed ? 2.4 : isActionTarget ? 3.2 : 2.7}
            fill="var(--cursor-tip-fill)"
            stroke="var(--cursor-tip-stroke)"
            strokeWidth="0.9"
          />
          <circle
            cx="0"
            cy="0"
            r={isPointerPressed ? 0.8 : 1.05}
            fill="var(--cursor-tip-core)"
          />
          <g transform="translate(19.2 34.6) rotate(61)">
            <rect
              x="0"
              y="-5.5"
              width="19"
              height="11.5"
              rx="5.75"
              fill="var(--cursor-handle-fill)"
              stroke="var(--cursor-handle-stroke)"
              strokeWidth="1.2"
            />
            <rect
              x="3.5"
              y="-2.8"
              width="12"
              height="2"
              rx="1"
              fill="var(--cursor-handle-highlight)"
            />
          </g>
        </Motion.svg>
      )}
    </div>
  );
}

export default CursorMusicTrail;
