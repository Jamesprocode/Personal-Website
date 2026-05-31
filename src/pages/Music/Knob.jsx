import { useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';

/**
 * Skeuomorphic volume knob. Drag up to increase, down to decrease. Scroll
 * wheel and arrow keys both work. Accumulates by total drag distance from
 * the press point so the value never jumps from delta-based math.
 */
function Knob({ value = 70, onChange, min = 0, max = 100, size = 64 }) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const dragStartRef = useRef(null); // { y, startValue }
  const [isDragging, setIsDragging] = useState(false);
  const knobRef = useRef(null);

  const clamp = useCallback(
    (v) => Math.max(min, Math.min(max, v)),
    [min, max],
  );

  const onPointerDown = useCallback(
    (e) => {
      e.preventDefault();
      const target = e.currentTarget;
      target.setPointerCapture?.(e.pointerId);
      dragStartRef.current = { y: e.clientY, startValue: value };
      setIsDragging(true);
    },
    [value],
  );

  const onPointerMove = useCallback(
    (e) => {
      const start = dragStartRef.current;
      if (!start) return;
      const dy = start.y - e.clientY; // up is positive
      const pixelsPerUnit = 2; // 2 px = 1 unit
      const next = clamp(start.startValue + dy / pixelsPerUnit);
      onChange(next);
    },
    [clamp, onChange],
  );

  const onPointerUp = useCallback(
    (e) => {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
      dragStartRef.current = null;
      setIsDragging(false);
    },
    [],
  );

  const onWheel = useCallback(
    (e) => {
      e.preventDefault();
      const dir = e.deltaY > 0 ? -1 : 1;
      const step = e.shiftKey ? 10 : 2;
      onChange(clamp(value + dir * step));
    },
    [value, clamp, onChange],
  );

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
        e.preventDefault();
        onChange(clamp(value + (e.shiftKey ? 10 : 1)));
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        e.preventDefault();
        onChange(clamp(value - (e.shiftKey ? 10 : 1)));
      } else if (e.key === 'Home') {
        e.preventDefault();
        onChange(min);
      } else if (e.key === 'End') {
        e.preventDefault();
        onChange(max);
      }
    },
    [value, clamp, onChange, min, max],
  );

  const onDoubleClick = useCallback(() => {
    onChange(70); // reset to default
  }, [onChange]);

  // Map value to rotation: -135° at min, +135° at max
  const ratio = (value - min) / (max - min);
  const rotation = ratio * 270 - 135;

  // Brass knob in light mode (matches the brass label disc + cream deck);
  // espresso in dark. The indicator notch stays warm brass in dark but
  // turns dark walnut in light so it reads against the brass face.
  const face = isDark
    ? {
        outerBg:
          'radial-gradient(circle at 30% 28%, #5a4a3a 0%, #2a1f15 70%, #1a130c 100%)',
        outerShadow:
          '0 6px 16px -4px rgba(0,0,0,0.5), inset 0 -2px 4px rgba(0,0,0,0.45), inset 0 2px 3px rgba(196,162,101,0.32)',
        innerBg:
          'radial-gradient(circle at 35% 30%, #3a2e22 0%, #1a130c 70%, #0a0806 100%)',
        innerShadow:
          'inset 0 -1px 3px rgba(0,0,0,0.5), inset 0 1px 2px rgba(196,162,101,0.2)',
        notch: '#c4a265',
        notchGlow: '0 0 4px rgba(196,162,101,0.5)',
        spindle: '#0a0806',
        spindleShadow: 'inset 0 1px 1px rgba(196,162,101,0.2)',
      }
    : {
        outerBg:
          'radial-gradient(circle at 30% 28%, #d8b677 0%, #b08a3e 70%, #8c6e3b 100%)',
        outerShadow:
          '0 6px 16px -4px rgba(80,55,15,0.32), inset 0 -2px 4px rgba(80,55,15,0.35), inset 0 2px 3px rgba(255,244,220,0.55)',
        innerBg:
          'radial-gradient(circle at 35% 30%, #c4a265 0%, #9c7a36 70%, #7a5e2c 100%)',
        innerShadow:
          'inset 0 -1px 3px rgba(80,55,15,0.4), inset 0 1px 2px rgba(255,244,220,0.4)',
        notch: '#3a2410',
        notchGlow: '0 0 3px rgba(58,36,16,0.4)',
        spindle: '#5a3410',
        spindleShadow: 'inset 0 1px 1px rgba(255,244,220,0.25)',
      };

  return (
    <div className="flex flex-col items-center" style={{ userSelect: 'none' }}>
      <div
        ref={knobRef}
        role="slider"
        tabIndex={0}
        aria-label={t('music.volume')}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Math.round(value)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onKeyDown={onKeyDown}
        onDoubleClick={onDoubleClick}
        className="relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a265]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]"
        style={{
          width: size,
          height: size,
          background: face.outerBg,
          boxShadow: face.outerShadow,
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
      >
        {/* Inner face (rotates) */}
        <div
          style={{
            position: 'absolute',
            inset: 6,
            borderRadius: 9999,
            background: face.innerBg,
            transform: `rotate(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.18s cubic-bezier(0.22, 1, 0.36, 1)',
            boxShadow: face.innerShadow,
          }}
        >
          {/* Indicator notch (brass-gold) */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: 3,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 3,
              height: size * 0.28,
              borderRadius: 2,
              backgroundColor: face.notch,
              boxShadow: face.notchGlow,
            }}
          />
        </div>

        {/* Center spindle */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: size * 0.18,
            height: size * 0.18,
            borderRadius: 9999,
            background: face.spindle,
            boxShadow: face.spindleShadow,
          }}
        />
      </div>
    </div>
  );
}

export default Knob;
