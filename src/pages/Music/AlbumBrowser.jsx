import { memo, useCallback, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import SleeveBack from './SleeveBack';

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

const TrackRow = memo(function TrackRow({ track, isActive, isPlaying, onClick }) {
  const playable = Boolean(track.file);
  return (
    <button
      onClick={() => playable && onClick(track)}
      disabled={!playable}
      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a265]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1410] rounded-md"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: '8px 12px',
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
          color: isActive ? '#c4a265' : 'rgba(196,162,101,0.45)',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 12,
          alignSelf: 'flex-start',
          marginTop: 2,
        }}
      >
        {isActive && isPlaying ? '♪' : isActive ? '▶' : '·'}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: 'block',
            fontFamily: 'Space Grotesk, system-ui, sans-serif',
            fontSize: '0.92rem',
            color: isActive ? '#f4e8d1' : 'rgba(244,232,209,0.85)',
            fontWeight: isActive ? 500 : 400,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
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
              color: 'rgba(196,162,101,0.55)',
              letterSpacing: '0.05em',
              marginTop: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
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
            color: 'rgba(196,162,101,0.5)',
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

const AlbumRow = memo(function AlbumRow({ album, isExpanded, isActiveAlbum, activeTrackId, isPlaying, onToggle, onSelectTrack, onOpenSleeve, reduceMotion }) {
  return (
    <div
      style={{
        borderBottom: '1px solid rgba(196,162,101,0.12)',
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
              color: '#f4e8d1',
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {album.title}
          </p>
          <p
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.7rem',
              color: 'rgba(196, 162, 101, 0.65)',
              letterSpacing: '0.14em',
              marginTop: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {album.year} &nbsp; {album.tracks.length} {album.tracks.length === 1 ? 'track' : 'tracks'}
          </p>
        </div>
        <span
          aria-hidden
          style={{
            color: 'rgba(196,162,101,0.6)',
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
          <motion.div
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '4px 12px 14px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
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
                    margin: '12px 12px 2px 12px',
                    padding: '6px 12px',
                    background: 'transparent',
                    border: '1px solid rgba(196,162,101,0.35)',
                    borderRadius: 4,
                    cursor: 'pointer',
                    color: 'rgba(196,162,101,0.85)',
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
                  Liner Notes
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

function AlbumBrowser({ albums, activeAlbumId, activeTrackId, isPlaying, onSelectTrack }) {
  const reduceMotion = useReducedMotion();
  const [expandedId, setExpandedId] = useState(activeAlbumId || albums[0]?.id || null);
  const [sleeveAlbum, setSleeveAlbum] = useState(null);

  // Stable handlers so memoized AlbumRow children don't re-render every tick.
  const handleToggleExpand = useCallback((id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);
  const handleCloseSleeve = useCallback(() => setSleeveAlbum(null), []);

  return (
    <>
      <div
        style={{
          background: 'linear-gradient(135deg, #2a1f15 0%, #1a130c 100%)',
          borderRadius: 16,
          border: '1px solid rgba(196, 162, 101, 0.18)',
          boxShadow: '0 15px 40px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid rgba(196,162,101,0.15)',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}
        >
          <p
            style={{
              fontFamily: 'Space Grotesk, system-ui, sans-serif',
              fontWeight: 600,
              fontSize: '1rem',
              color: '#f4e8d1',
              letterSpacing: '-0.005em',
            }}
          >
            Record Crate
          </p>
          <p
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.65rem',
              color: 'rgba(196,162,101,0.65)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            {albums.length} albums
          </p>
        </div>

        <div role="list" aria-label="Albums">
          {albums.map((album) => (
            <AlbumRow
              key={album.id}
              album={album}
              isExpanded={expandedId === album.id}
              isActiveAlbum={activeAlbumId === album.id}
              activeTrackId={activeTrackId}
              isPlaying={isPlaying}
              onToggle={handleToggleExpand}
              onSelectTrack={onSelectTrack}
              onOpenSleeve={setSleeveAlbum}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      </div>

      <SleeveBack album={sleeveAlbum} onClose={handleCloseSleeve} />
    </>
  );
}

export default AlbumBrowser;
