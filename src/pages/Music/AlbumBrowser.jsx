import { memo, useCallback, useRef, useState } from 'react';
import { motion as Motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import useIsMobile from '../../hooks/useIsMobile';
import SleeveBack from './SleeveBack';

const DEFAULT_MOBILE_ALBUM_ID = 'special';
const MOBILE_ALBUM_LABELS = {
  special: 'Special',
  'oxyjazz-a': 'Side A',
  'oxyjazz-b': 'Side B',
  electronics: 'Synth',
  'berret-yuffee': 'EP',
};

function AlbumThumb({ album, size = 56 }) {
  return (
    <div
      aria-hidden
      style={{
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: album.accentColor,
        boxShadow: '0 4px 8px -3px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(196,162,101,0.25)',
      }}
    >
      {album.coverImage ? (
        <img
          src={album.coverImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        <>
          <div
            style={{
              position: 'absolute',
              inset: '14%',
              borderRadius: 9999,
              background:
                'radial-gradient(circle at 50% 50%, rgba(20,15,10,0.85) 0%, rgba(20,15,10,0.4) 65%, rgba(20,15,10,0) 80%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: '40%',
              borderRadius: 9999,
              backgroundColor: '#c4a265',
              border: '1px solid rgba(20,15,10,0.45)',
            }}
          />
        </>
      )}
    </div>
  );
}

const TrackRow = memo(function TrackRow({ track, isActive, isPlaying, isBuffering, onClick }) {
  const isMobile = useIsMobile();
  const playable = Boolean(track.file);
  return (
    <button
      onClick={() => playable && onClick(track)}
      disabled={!playable}
      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a265]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1410] rounded-md"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? 12 : 10,
        width: '100%',
        padding: isMobile ? '11px 8px' : '8px 12px',
        background: isActive ? 'rgba(196,162,101,0.12)' : 'transparent',
        border: '1px solid',
        borderColor: isActive ? 'rgba(196,162,101,0.35)' : 'transparent',
        borderRadius: 6,
        cursor: playable ? 'pointer' : 'not-allowed',
        opacity: playable ? 1 : 0.45,
        textAlign: 'left',
        transition: 'background 0.18s ease-out, border-color 0.18s ease-out',
      }}
      aria-label={`${track.title}${track.composer ? `, composed by ${track.composer}` : ''}${playable ? '' : ' (mastering)'}`}
    >
      <span
        aria-hidden
        style={{
          width: 18,
          flexShrink: 0,
          textAlign: 'center',
          color: isActive ? '#c4a265' : 'var(--text-muted)',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 12,
          alignSelf: 'flex-start',
          marginTop: 2,
        }}
      >
        {isActive && isBuffering ? (
          <Motion.span
            aria-hidden
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, ease: 'linear', repeat: Infinity }}
            style={{
              display: 'inline-block',
              width: 11,
              height: 11,
              borderRadius: '50%',
              border: '2px solid transparent',
              borderTopColor: '#c4a265',
              borderRightColor: 'rgba(196,162,101,0.35)',
            }}
          />
        ) : isActive && isPlaying ? '♪' : isActive ? '▶' : '·'}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: 'block',
            fontFamily: 'Space Grotesk, system-ui, sans-serif',
            fontSize: '0.92rem',
            color: isActive ? 'var(--text-strong)' : 'var(--text)',
            fontWeight: isActive ? 500 : 400,
            overflow: isMobile ? 'visible' : 'hidden',
            textOverflow: isMobile ? 'clip' : 'ellipsis',
            whiteSpace: isMobile ? 'normal' : 'nowrap',
            overflowWrap: 'anywhere',
          }}
        >
          {track.title}
        </span>
        {track.composer && (
          <span
            style={{
              display: 'block',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
              marginTop: 1,
              overflow: isMobile ? 'visible' : 'hidden',
              textOverflow: isMobile ? 'clip' : 'ellipsis',
              whiteSpace: isMobile ? 'normal' : 'nowrap',
              overflowWrap: 'anywhere',
            }}
          >
            {track.composer}
          </span>
        )}
      </span>
      {!playable && (
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.6rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            flexShrink: 0,
            alignSelf: 'flex-start',
            marginTop: 4,
          }}
        >
          ...
        </span>
      )}
    </button>
  );
});

const AlbumTracks = memo(function AlbumTracks({
  album,
  activeTrackId,
  isPlaying,
  isBuffering,
  onSelectTrack,
  onOpenSleeve,
}) {
  const { t } = useTranslation();
  const isMobile = useIsMobile('(max-width: 880px)');

  return (
    <div
      style={{
        padding: isMobile ? '6px 0 20px' : '4px 12px 14px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? 4 : 2,
      }}
    >
      {[...album.tracks]
        .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }))
        .map((track) => (
          <TrackRow
            key={track.id}
            track={track}
            isActive={activeTrackId === track.id}
            isPlaying={isPlaying && activeTrackId === track.id}
            isBuffering={isBuffering && activeTrackId === track.id}
            onClick={() => onSelectTrack(album, track)}
          />
        ))}
      {album.liner && (
        <button
          type="button"
          onClick={() => onOpenSleeve(album)}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a265]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1410]"
          style={{
            alignSelf: 'flex-start',
            margin: isMobile ? '16px 8px 2px' : '12px 12px 2px 12px',
            padding: '6px 12px',
            background: 'transparent',
            border: '1px solid rgba(196,162,101,0.35)',
            borderRadius: 4,
            cursor: 'pointer',
            color: 'var(--accent-deep)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            transition: 'background 0.18s ease-out, border-color 0.18s ease-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(196,162,101,0.08)';
            e.currentTarget.style.borderColor = 'rgba(196,162,101,0.55)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(196,162,101,0.35)';
          }}
        >
          {t('music.linerHeader')}
        </button>
      )}
    </div>
  );
});

const AlbumRow = memo(function AlbumRow({ album, isExpanded, isActiveAlbum, activeTrackId, isPlaying, isBuffering, onToggle, onSelectTrack, onOpenSleeve, reduceMotion }) {
  const isMobile = useIsMobile();
  return (
    <div
      style={{
        borderBottom: '1px solid var(--border)',
      }}
    >
      <button
        onClick={() => onToggle(album.id)}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a265]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1410] rounded-md"
        aria-expanded={isExpanded}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          width: '100%',
          padding: '14px 12px',
          background: isActiveAlbum ? 'rgba(196,162,101,0.08)' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background 0.18s ease-out',
        }}
      >
        <AlbumThumb album={album} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: 'Space Grotesk, system-ui, sans-serif',
              fontWeight: 600,
              fontSize: '0.98rem',
              color: 'var(--text-strong)',
              lineHeight: 1.3,
              overflow: isMobile ? 'visible' : 'hidden',
              textOverflow: isMobile ? 'clip' : 'ellipsis',
              whiteSpace: isMobile ? 'normal' : 'nowrap',
              overflowWrap: 'anywhere',
            }}
          >
            {album.title}
          </p>
          <p
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.14em',
              marginTop: 2,
              overflow: isMobile ? 'visible' : 'hidden',
              textOverflow: isMobile ? 'clip' : 'ellipsis',
              whiteSpace: isMobile ? 'normal' : 'nowrap',
              overflowWrap: 'anywhere',
            }}
          >
            {album.year} &nbsp; {album.tracks.length} {album.tracks.length === 1 ? 'track' : 'tracks'}
          </p>
        </div>
        <span
          aria-hidden
          style={{
            color: 'var(--text-muted)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 14,
            transform: `rotate(${isExpanded ? 90 : 0}deg)`,
            transition: 'transform 0.25s ease-out',
            flexShrink: 0,
          }}
        >
          ▸
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <Motion.div
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <AlbumTracks
              album={album}
              activeTrackId={activeTrackId}
              isPlaying={isPlaying}
              isBuffering={isBuffering}
              onSelectTrack={onSelectTrack}
              onOpenSleeve={onOpenSleeve}
            />
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

function AlbumBrowser({
  albums,
  activeAlbumId,
  activeTrackId,
  isPlaying,
  isBuffering,
  onSelectTrack,
  defaultOpenFirstAlbum = false,
}) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const { isDark } = useTheme();
  const isMobile = useIsMobile('(max-width: 880px)');
  const mobileTracksRef = useRef(null);
  // Start with every album collapsed by default. The one exception: if a
  // track is already playing when this view (re)mounts — e.g. the visitor
  // navigated away with the floating record still spinning and came back —
  // open the album that track belongs to so they land on what's playing.
  const [manualExpandedId, setManualExpandedId] = useState(undefined);
  const defaultAlbumId = albums.some((album) => album.id === DEFAULT_MOBILE_ALBUM_ID)
    ? DEFAULT_MOBILE_ALBUM_ID
    : albums[0]?.id;
  const expandedId = manualExpandedId !== undefined
    ? manualExpandedId
    : (activeAlbumId || ((isMobile || defaultOpenFirstAlbum) ? defaultAlbumId : null));
  const [sleeveAlbum, setSleeveAlbum] = useState(null);
  const mobileAlbum = albums.find((album) => album.id === expandedId) || albums[0];

  // Crate body matches the turntable deck: light cream-wood in light mode,
  // espresso in dark. They sit side by side, so they stay a matched pair.
  const crateBg = isDark
    ? 'linear-gradient(135deg, #2a1f15 0%, #1a130c 100%)'
    : 'linear-gradient(135deg, #efe3c9 0%, #ddc9a0 100%)';
  const crateBorder = isDark ? 'rgba(196, 162, 101, 0.18)' : 'rgba(160, 111, 29, 0.3)';
  const crateShadow = isDark
    ? '0 15px 40px -12px rgba(0, 0, 0, 0.5)'
    : '0 15px 40px -12px rgba(80, 55, 15, 0.28)';

  // Stable handlers so memoized AlbumRow children don't re-render every tick.
  const handleToggleExpand = useCallback((id) => {
    setManualExpandedId(isMobile ? id : (expandedId === id ? null : id));
  }, [expandedId, isMobile]);
  const handleMobileAlbumSelect = useCallback((id) => {
    if (id === expandedId) return;
    setManualExpandedId(id);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        mobileTracksRef.current?.scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      });
    });
  }, [expandedId, reduceMotion]);
  const handleCloseSleeve = useCallback(() => setSleeveAlbum(null), []);

  return (
    <>
      <div
        style={{
          background: isMobile ? 'transparent' : crateBg,
          borderRadius: 16,
          border: isMobile ? 'none' : `1px solid ${crateBorder}`,
          boxShadow: isMobile ? 'none' : crateShadow,
          overflow: isMobile ? 'visible' : 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border)',
            display: isMobile ? 'none' : 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}
        >
          <p
            style={{
              fontFamily: 'Space Grotesk, system-ui, sans-serif',
              fontWeight: 600,
              fontSize: '1rem',
              color: 'var(--text-strong)',
              letterSpacing: '-0.005em',
            }}
          >
            {t('music.recordCrate', { defaultValue: 'Record Crate' })}
          </p>
          <p
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            {albums.length} {t('music.albumsLabel', { defaultValue: 'albums' })}
          </p>
        </div>

        {isMobile ? (
          <>
            <div
              role="tablist"
              aria-label={t('music.albumsList')}
              style={{
                position: 'sticky',
                top: 'calc(5.25rem + env(safe-area-inset-top, 0px))',
                zIndex: 12,
                display: 'grid',
                gridTemplateColumns: `repeat(${albums.length}, minmax(0, 1fr))`,
                gap: 6,
                padding: '10px 8px',
                background: crateBg,
                border: `1px solid ${crateBorder}`,
                borderRadius: 14,
                boxShadow: isDark
                  ? '0 12px 28px -18px rgba(0,0,0,0.9)'
                  : '0 12px 28px -18px rgba(80,55,15,0.5)',
              }}
            >
              {albums.map((album) => {
                const isSelected = album.id === mobileAlbum?.id;
                return (
                  <button
                    key={album.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    aria-controls={`mobile-album-${album.id}`}
                    aria-label={album.title}
                    onClick={() => handleMobileAlbumSelect(album.id)}
                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a265]/80"
                    style={{
                      minWidth: 0,
                      minHeight: 68,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 7,
                      padding: '7px 3px',
                      borderRadius: 8,
                      border: `1px solid ${isSelected ? 'rgba(196,162,101,0.55)' : 'transparent'}`,
                      background: isSelected ? 'rgba(196,162,101,0.12)' : 'transparent',
                      color: isSelected ? 'var(--text-strong)' : 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    <AlbumThumb album={album} size={27} />
                    <span
                      style={{
                        width: '100%',
                        minWidth: 0,
                        fontFamily: 'Space Grotesk, system-ui, sans-serif',
                        fontSize: '0.64rem',
                        fontWeight: isSelected ? 600 : 500,
                        lineHeight: 1.15,
                        textAlign: 'center',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {MOBILE_ALBUM_LABELS[album.id] || album.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {mobileAlbum && (
              <div
                ref={mobileTracksRef}
                id={`mobile-album-${mobileAlbum.id}`}
                role="tabpanel"
                style={{
                  scrollMarginTop: '10.75rem',
                  paddingTop: 28,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '0 8px 16px',
                  }}
                >
                  <p
                    style={{
                      minWidth: 0,
                      color: 'var(--text-strong)',
                      fontFamily: 'Space Grotesk, system-ui, sans-serif',
                      fontSize: '1rem',
                      fontWeight: 600,
                      lineHeight: 1.25,
                    }}
                  >
                    {mobileAlbum.title}
                  </p>
                  <p
                    style={{
                      flexShrink: 0,
                      color: 'var(--text-muted)',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.62rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {mobileAlbum.year} · {mobileAlbum.tracks.length}
                  </p>
                </div>
                <AlbumTracks
                  album={mobileAlbum}
                  activeTrackId={activeTrackId}
                  isPlaying={isPlaying}
                  isBuffering={isBuffering}
                  onSelectTrack={onSelectTrack}
                  onOpenSleeve={setSleeveAlbum}
                />
              </div>
            )}
          </>
        ) : (
          <div role="list" aria-label={t('music.albumsList')}>
            {albums.map((album) => (
              <div role="listitem" key={album.id}>
                <AlbumRow
                  album={album}
                  isExpanded={expandedId === album.id}
                  isActiveAlbum={activeAlbumId === album.id}
                  activeTrackId={activeTrackId}
                  isPlaying={isPlaying}
                  isBuffering={isBuffering}
                  onToggle={handleToggleExpand}
                  onSelectTrack={onSelectTrack}
                  onOpenSleeve={setSleeveAlbum}
                  reduceMotion={reduceMotion}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <SleeveBack album={sleeveAlbum} onClose={handleCloseSleeve} />
    </>
  );
}

export default AlbumBrowser;
