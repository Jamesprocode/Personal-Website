/**
 * Shared Loop and Next icon buttons used by both the main Turntable
 * controls strip and the floating MiniPlayer. Keeping them in one place
 * means the icons and the loop-mode glyph stay in sync.
 */
import { useTranslation } from 'react-i18next';

const ACCENT = '#c4a265';
const DIM = 'rgba(196,162,101,0.55)';

function NextIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 5l11 7-11 7V5z" />
      <rect x="17.5" y="5" width="2.2" height="14" rx="0.7" />
    </svg>
  );
}

function LoopAlbumIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 014-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 01-4 4H3" />
    </svg>
  );
}

function LoopOneIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 014-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 01-4 4H3" />
      <text x="12" y="14.5" fontFamily="JetBrains Mono, monospace" fontSize="6.5" fontWeight="700" stroke="none" fill="currentColor" textAnchor="middle">1</text>
    </svg>
  );
}

function ShuffleIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  );
}

export function LoopButton({ mode, onClick, size = 22, hint = false }) {
  const Icon = mode === 'shuffle' ? ShuffleIcon : mode === 'one' ? LoopOneIcon : LoopAlbumIcon;
  const label = mode === 'shuffle' ? 'Shuffle' : mode === 'one' ? 'Loop one track' : 'Loop album';
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerDown={(e) => e.stopPropagation()}
      aria-label={label}
      title={label}
      style={{
        background: 'transparent',
        border: 'none',
        padding: 6,
        cursor: 'pointer',
        color: ACCENT,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        transition: 'background 0.15s ease-out, color 0.15s ease-out',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(196,162,101,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <Icon size={size} />
      {hint && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            transform: 'translate(18px, -10px)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 8,
            color: DIM,
            letterSpacing: '0.1em',
            pointerEvents: 'none',
          }}
        >
          {mode === 'shuffle' ? 'SHF' : mode === 'one' ? '×1' : 'ALB'}
        </span>
      )}
    </button>
  );
}

export function NextButton({ onClick, size = 22, disabled = false }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerDown={(e) => e.stopPropagation()}
      disabled={disabled}
      aria-label={t('music.nextTrack')}
      title={t('music.nextTrack')}
      style={{
        background: 'transparent',
        border: 'none',
        padding: 6,
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? 'rgba(196,162,101,0.3)' : ACCENT,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        transition: 'background 0.15s ease-out, color 0.15s ease-out',
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = 'rgba(196,162,101,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <NextIcon size={size} />
    </button>
  );
}
