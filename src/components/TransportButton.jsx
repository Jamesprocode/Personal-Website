import { Link } from 'react-router-dom';

// Tape-transport glyphs. SVG paths designed in a 24x24 viewBox.
const GLYPHS = {
  rew:  { d: 'M11 7 L4 12 L11 17 Z M19 7 L12 12 L19 17 Z', aria: 'Rewind' },
  ff:   { d: 'M5 7 L12 12 L5 17 Z M13 7 L20 12 L13 17 Z', aria: 'Fast forward' },
  prev: { d: 'M4 6 L6.5 6 L6.5 18 L4 18 Z M20 7 L20 17 L11 12 Z', aria: 'Previous track' },
  next: { d: 'M4 7 L4 17 L13 12 Z M17.5 6 L20 6 L20 18 L17.5 18 Z', aria: 'Next track' },
};

function TransportButton({
  to,
  variant = 'rew',
  size = 60,
  label,
  sublabel,
  ariaLabel,
  disabled = false,
}) {
  const glyph = GLYPHS[variant] || GLYPHS.rew;
  const inner = (
    <>
      <span
        className={
          'relative inline-flex items-center justify-center transition-transform duration-150' +
          (disabled
            ? ''
            : ' group-hover:translate-y-[1px] group-active:translate-y-[2px]')
        }
        style={{
          width: size,
          height: size,
          borderRadius: 9999,
          background:
            'radial-gradient(circle at 30% 28%, #efe3c9 0%, #c4b69c 65%, #6c5c3b 100%)',
          boxShadow:
            '0 6px 12px -4px rgba(80,55,15,0.35), inset 0 -2px 4px rgba(0,0,0,0.22), inset 0 2px 4px rgba(255,240,200,0.5)',
          opacity: disabled ? 0.42 : 1,
          filter: disabled ? 'saturate(0.55)' : undefined,
        }}
      >
        <span
          className={
            'absolute rounded-full flex items-center justify-center transition-shadow duration-150' +
            (disabled
              ? ''
              : ' group-hover:shadow-[inset_0_-1px_3px_rgba(0,0,0,0.35),_inset_0_1px_2px_rgba(255,235,170,0.4)]')
          }
          style={{
            inset: Math.max(4, Math.round(size * 0.1)),
            background:
              'radial-gradient(circle at 35% 30%, #d4b76e 0%, #c4a265 60%, #8c6e3b 100%)',
            boxShadow:
              'inset 0 -1px 2px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,235,170,0.5)',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={Math.round(size * 0.38)}
            height={Math.round(size * 0.38)}
            aria-hidden
          >
            <path d={glyph.d} fill="#1a1410" />
          </svg>
        </span>

        {!disabled && (
          <span
            aria-hidden
            className="absolute -top-[6px] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{
              width: 5,
              height: 5,
              borderRadius: 9999,
              backgroundColor: '#c4a265',
              boxShadow: '0 0 8px rgba(196,162,101,0.95)',
            }}
          />
        )}
      </span>

      {(label || sublabel) && (
        <span className="flex flex-col leading-tight">
          {label && (
            <span
              className="font-mono uppercase"
              style={{
                color: 'rgba(108, 92, 59, 0.85)',
                fontSize: 'clamp(0.7rem, 0.85vw, 0.8rem)',
                letterSpacing: '0.22em',
              }}
            >
              {label}
            </span>
          )}
          {sublabel && (
            <span
              className="font-mono"
              style={{
                color: 'rgba(108, 92, 59, 0.55)',
                fontSize: 'clamp(0.6rem, 0.72vw, 0.7rem)',
                letterSpacing: '0.12em',
                marginTop: 2,
              }}
            >
              {sublabel}
            </span>
          )}
        </span>
      )}
    </>
  );

  if (disabled || !to) {
    return (
      <span
        aria-label={ariaLabel || glyph.aria}
        aria-disabled={disabled ? 'true' : undefined}
        className="group inline-flex items-center gap-3 select-none"
        style={{ cursor: disabled ? 'not-allowed' : 'default' }}
      >
        {inner}
      </span>
    );
  }

  return (
    <Link
      to={to}
      aria-label={ariaLabel || glyph.aria}
      className="group inline-flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f4e8d1] rounded-full"
      style={{ textDecoration: 'none' }}
    >
      {inner}
    </Link>
  );
}

export default TransportButton;
