import { useParams, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion as Motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PageTransition from '../../components/PageTransition';
import TransportButton from '../../components/TransportButton';
import projects from '../../data/projects';
import { useTheme } from '../../hooks/useTheme';
import useIsMobile from '../../hooks/useIsMobile';

// Editorial palette. The cream "parlor" in light; wood + espresso in dark.
// Values are 6-digit hex on purpose: the blocks below append a 2-digit alpha
// (e.g. `${BRASS}1f`) to make 8-digit hex, so every entry must stay a bare
// hex string. BRASS is the shared brand thread — identical in both themes.
const LIGHT_PALETTE = {
  CREAM_BASE: '#f4e8d1',
  CREAM_LIGHT: '#fdf7e3',
  LINEN: '#c4b69c',
  BRASS: '#c4a265',
  INK_DEEP: '#2d2d2d',
  WALNUT: '#4a3f35',
  BRONZE: '#6c5c3b',
};
const DARK_PALETTE = {
  CREAM_BASE: '#1a130c',  // page base — espresso
  CREAM_LIGHT: '#2a1f15', // cards / table / image mats — wood
  LINEN: '#7a6a44',       // border + faint-fill base — muted brass-tan
  BRASS: '#c4a265',       // shared accent
  INK_DEEP: '#f4e8d1',    // headings — cream
  WALNUT: '#e7dcc4',      // body — warm off-white
  BRONZE: '#b8a47a',      // muted / captions — dim brass
};

function usePalette() {
  const { isDark } = useTheme();
  return isDark ? DARK_PALETTE : LIGHT_PALETTE;
}

const MEASURE_TEXT = 'min(82rem, 92vw)';
const MEASURE_MEDIA = 'min(82rem, 92vw)';

function Caption({ children }) {
  const { BRONZE } = usePalette();
  return (
    <figcaption
      className="mt-3 font-mono"
      style={{
        color: `${BRONZE}cc`,
        fontSize: 'clamp(0.7rem, 0.85vw, 0.8rem)',
        letterSpacing: '0.05em',
        lineHeight: 1.5,
        maxWidth: '60ch',
      }}
    >
      {children}
    </figcaption>
  );
}

function renderCitations(text, P = LIGHT_PALETTE) {
  const { BRASS, BRONZE } = P;
  if (text == null || typeof text !== 'string') return text;
  // Tokenize on numeric citations like [1] and markdown-style links like [label](url).
  const parts = text.split(/(\[\d+\]|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const cite = part.match(/^\[(\d+)\]$/);
    if (cite) {
      const id = cite[1];
      return (
        <a
          key={`cite-${i}-${id}`}
          href={`#ref-${id}`}
          onClick={(e) => {
            const el = document.getElementById(`ref-${id}`);
            if (el) {
              e.preventDefault();
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              el.classList.add('ref-pulse');
              window.setTimeout(() => el.classList.remove('ref-pulse'), 1400);
            }
          }}
          className="font-mono"
          aria-label={`Reference ${id}`}
          style={{
            color: BRONZE,
            fontWeight: 600,
            textDecoration: 'none',
            verticalAlign: 'super',
            fontSize: '0.7em',
            lineHeight: 1,
            margin: '0 0.1em',
            padding: '1px 4px',
            borderRadius: 4,
            backgroundColor: `${BRASS}1f`,
            letterSpacing: '0.02em',
          }}
        >
          {id}
        </a>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, url] = link;
      const external = /^https?:\/\//i.test(url);
      return (
        <a
          key={`link-${i}`}
          href={url}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          style={{
            color: 'inherit',
            textDecoration: 'underline',
            textDecorationColor: `${BRASS}99`,
            textDecorationThickness: '1px',
            textUnderlineOffset: '3px',
          }}
        >
          {label}
        </a>
      );
    }
    return part;
  });
}

function TextBlock({ content }) {
  const P = usePalette();
  const { WALNUT } = P;
  return (
    <div
      style={{
        width: '100%',
        maxWidth: MEASURE_TEXT,
        margin: '0 auto',
        padding: '0 clamp(1.5rem, 6vw, 5rem)',
      }}
    >
      <p
        style={{
          color: WALNUT,
          fontSize: 'clamp(1.05rem, 1.35vw, 1.2rem)',
          lineHeight: 1.75,
        }}
      >
        {renderCitations(content, P)}
      </p>
    </div>
  );
}

function ImageBlock({ src, alt, caption, onOpen, inline = false }) {
  const { t } = useTranslation();
  const { LINEN, CREAM_LIGHT } = usePalette();
  const wrapperStyle = inline
    ? { width: '100%' }
    : {
        width: '100%',
        maxWidth: MEASURE_MEDIA,
        margin: '0 auto',
        padding: '0 clamp(1.5rem, 6vw, 5rem)',
      };
  return (
    <figure style={wrapperStyle}>
      <button
        type="button"
        onClick={() => onOpen && onOpen({ src, alt })}
        className="group block w-full"
        aria-label={t('project.enlargeImage')}
        style={{
          padding: 0,
          margin: 0,
          background: 'transparent',
          border: 0,
          cursor: 'zoom-in',
          display: 'block',
        }}
      >
        <div
          className="relative overflow-hidden"
          style={{
            borderRadius: 12,
            border: `1px solid ${LINEN}66`,
            backgroundColor: CREAM_LIGHT,
          }}
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="block w-full h-auto transition-transform duration-300 ease-out group-hover:scale-[1.015]"
          />
          <span
            aria-hidden
            className="font-mono uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              padding: '4px 8px',
              backgroundColor: 'rgba(45,45,45,0.78)',
              color: '#fdf7e3',
              borderRadius: 9999,
              fontSize: '0.65rem',
              letterSpacing: '0.18em',
              pointerEvents: 'none',
            }}
          >
            Click to enlarge
          </span>
        </div>
      </button>
      {caption && <Caption>{caption}</Caption>}
    </figure>
  );
}

function SideBySideBlock({ text, image, imageSide = 'right', onOpen }) {
  const P = usePalette();
  const { WALNUT } = P;
  const imageEl = (
    <div className="w-full md:flex-1" style={{ minWidth: 0 }}>
      <ImageBlock
        src={image.src}
        alt={image.alt}
        caption={image.caption}
        onOpen={onOpen}
        inline
      />
    </div>
  );
  const textEl = (
    <div className="w-full md:flex-1" style={{ minWidth: 0 }}>
      <p
        style={{
          color: WALNUT,
          fontSize: 'clamp(1.05rem, 1.35vw, 1.2rem)',
          lineHeight: 1.75,
          margin: 0,
        }}
      >
        {renderCitations(text, P)}
      </p>
    </div>
  );
  return (
    <div
      style={{
        width: '100%',
        maxWidth: MEASURE_MEDIA,
        margin: '0 auto',
        padding: '0 clamp(1.5rem, 6vw, 5rem)',
      }}
    >
      <div
        className="flex flex-col md:flex-row gap-6 md:gap-10"
        style={{ alignItems: 'flex-start' }}
      >
        {imageSide === 'left' ? imageEl : textEl}
        {imageSide === 'left' ? textEl : imageEl}
      </div>
    </div>
  );
}

function ListBlock({ intro, items, variant = 'default' }) {
  const { WALNUT, BRASS, LINEN, INK_DEEP } = usePalette();
  const highlight = variant === 'highlight';
  return (
    <div
      style={{
        width: '100%',
        maxWidth: MEASURE_TEXT,
        margin: '0 auto',
        padding: '0 clamp(1.5rem, 6vw, 5rem)',
      }}
    >
      {intro && (
        <p
          style={{
            color: WALNUT,
            fontSize: 'clamp(1.05rem, 1.35vw, 1.2rem)',
            lineHeight: 1.75,
            marginBottom: '1.25rem',
          }}
        >
          {intro}
        </p>
      )}
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: highlight ? '0.65rem' : '0.5rem',
        }}
      >
        {items.map((item, i) => {
          const label = typeof item === 'object' ? item.label : null;
          const body = typeof item === 'object' ? item.body : item;
          return (
            <li
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: label ? 'auto 1fr' : '1fr',
                columnGap: '1rem',
                rowGap: '0.15rem',
                alignItems: 'baseline',
                padding: highlight ? '0.7rem 1rem' : '0.35rem 0 0.35rem 1rem',
                backgroundColor: highlight ? `${BRASS}1f` : 'transparent',
                borderLeft: highlight
                  ? `3px solid ${BRASS}`
                  : `2px solid ${LINEN}99`,
                borderRadius: highlight ? 6 : 0,
              }}
            >
              {label && (
                <span
                  className="font-mono"
                  style={{
                    color: INK_DEEP,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    fontSize: 'clamp(0.85rem, 1.05vw, 0.95rem)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {label}
                </span>
              )}
              <span
                style={{
                  color: WALNUT,
                  fontSize: 'clamp(1rem, 1.2vw, 1.1rem)',
                  lineHeight: 1.65,
                }}
              >
                {body}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Lightbox({ image, onClose }) {
  const { t } = useTranslation();
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);
  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('project.enlargedImage')}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(20, 16, 12, 0.94)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 3vw, 2.5rem)',
        cursor: 'zoom-out',
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t('project.closeEnlarged')}
        className="font-mono uppercase"
        style={{
          position: 'absolute',
          top: 'clamp(1rem, 2.5vh, 1.75rem)',
          right: 'clamp(1rem, 2.5vw, 1.75rem)',
          backgroundColor: 'rgba(255, 240, 200, 0.08)',
          border: '1px solid rgba(255, 240, 200, 0.25)',
          color: '#f4e8d1',
          borderRadius: 9999,
          padding: '0.45rem 1rem',
          fontSize: '0.7rem',
          letterSpacing: '0.18em',
          cursor: 'pointer',
        }}
      >
        Close ✕
      </button>
      <Motion.img
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.96 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        src={image.src}
        alt={image.alt}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '95vw',
          maxHeight: '92vh',
          objectFit: 'contain',
          borderRadius: 6,
          boxShadow: '0 30px 60px -20px rgba(0,0,0,0.6)',
          cursor: 'default',
          backgroundColor: '#fff',
        }}
      />
    </Motion.div>
  );
}

function AudioBlock({ src, caption }) {
  return (
    <figure
      style={{
        width: '100%',
        maxWidth: MEASURE_TEXT,
        margin: '0 auto',
        padding: '0 clamp(1.5rem, 6vw, 5rem)',
      }}
    >
      <audio
        controls
        preload="none"
        src={src}
        className="w-full"
        style={{ borderRadius: 9999 }}
      />
      {caption && <Caption>{caption}</Caption>}
    </figure>
  );
}

function VideoBlock({ src, poster, caption }) {
  const videoRef = useRef(null);
  const blobUrlRef = useRef(null);
  // True once we've kicked off the full-file download for this src. Guards
  // against duplicate fetches across repeated seeks.
  const blobFetchStartedRef = useRef(false);

  // Same reliable-seeking workaround as the audio player (see
  // useAudioPlayer's ensureFullDownload): Cloudflare's static-asset hosting
  // answers range requests with HTTP 200 (full body), not 206 Partial
  // Content, so the browser can't seek to un-buffered time over the network
  // and dragging the scrub bar stalls. The fix is to download the whole file
  // once and swap the element to a local blob URL where seeking is instant.
  //
  // Crucially this is deferred until the user actually SEEKS (not on mount,
  // and not on play). The old behavior fetched the whole 18-22MB file on
  // mount, in parallel with the <video> element's own streaming request for
  // the SAME asset — so every project page with a video downloaded it twice,
  // competing for bandwidth and stalling playback on slow / mobile
  // connections even when the user never pressed play. Triggering on play
  // would have the same effect during playback (stream + blob fetch racing),
  // so we wait for a scrub — the only moment the instant-seek blob helps.
  // Now scrolling past, or playing straight through, costs a single stream.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return undefined;
    blobFetchStartedRef.current = false;

    const ensureFullDownload = () => {
      if (blobFetchStartedRef.current) return; // already fetching / done
      blobFetchStartedRef.current = true;

      fetch(src)
        .then((res) => res.blob())
        .then((blob) => {
          const v = videoRef.current;
          if (!v) return;
          const blobUrl = URL.createObjectURL(blob);
          if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
          blobUrlRef.current = blobUrl;
          const resumeAt = v.currentTime;
          const wasPlaying = !v.paused && !v.ended;
          const onReady = () => {
            v.removeEventListener('loadedmetadata', onReady);
            try {
              v.currentTime = resumeAt;
            } catch {
              /* no-op */
            }
            if (wasPlaying) v.play().catch(() => {});
          };
          v.addEventListener('loadedmetadata', onReady);
          v.src = blobUrl;
          v.load();
        })
        .catch(() => {
          // Allow a later retry; keep streaming in the meantime.
          blobFetchStartedRef.current = false;
        });
    };

    video.addEventListener('seeking', ensureFullDownload);

    return () => {
      video.removeEventListener('seeking', ensureFullDownload);
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [src]);

  return (
    <figure
      style={{
        width: '100%',
        maxWidth: MEASURE_TEXT,
        margin: '0 auto',
        padding: '0 clamp(1.5rem, 6vw, 5rem)',
      }}
    >
      <video
        ref={videoRef}
        controls
        preload="metadata"
        playsInline
        src={src}
        poster={poster}
        className="w-full"
        style={{ borderRadius: 8, background: '#0a0a0a', maxHeight: '70vh' }}
      />
      {caption && <Caption>{caption}</Caption>}
    </figure>
  );
}

function HeadingBlock({ text, eyebrow }) {
  const { BRONZE, INK_DEEP, BRASS } = usePalette();
  return (
    <div
      style={{
        width: '100%',
        maxWidth: MEASURE_TEXT,
        margin: '0 auto',
        padding: '0 clamp(1.5rem, 6vw, 5rem)',
      }}
    >
      {eyebrow && (
        <p
          className="font-mono uppercase"
          style={{
            color: `${BRONZE}b3`,
            fontSize: 'clamp(0.65rem, 0.78vw, 0.72rem)',
            letterSpacing: '0.22em',
            marginBottom: '0.5rem',
          }}
        >
          {eyebrow}
        </p>
      )}
      <h2
        style={{
          color: INK_DEEP,
          fontSize: 'clamp(1.45rem, 2.1vw, 1.85rem)',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          lineHeight: 1.15,
          margin: 0,
        }}
      >
        {text}
      </h2>
      <div
        aria-hidden
        style={{
          marginTop: '0.85rem',
          height: '1px',
          width: '56px',
          backgroundColor: BRASS,
        }}
      />
    </div>
  );
}

function TableBlock({ headers, rows, caption, footnote }) {
  const { t } = useTranslation();
  const { LINEN, CREAM_LIGHT, BRONZE, BRASS, INK_DEEP, WALNUT } = usePalette();
  return (
    <figure
      style={{
        width: '100%',
        maxWidth: MEASURE_TEXT,
        margin: '0 auto',
        padding: '0 clamp(1.5rem, 6vw, 5rem)',
      }}
    >
      <div
        tabIndex={0}
        role="region"
        aria-label={t('project.tableLabel', { defaultValue: 'Data table' })}
        style={{
          overflowX: 'auto',
          border: `1px solid ${LINEN}66`,
          borderRadius: 8,
          backgroundColor: CREAM_LIGHT,
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 'clamp(0.85rem, 1.05vw, 0.95rem)',
          }}
        >
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="font-mono uppercase"
                  style={{
                    textAlign: i === 0 ? 'left' : 'right',
                    fontWeight: 600,
                    color: BRONZE,
                    padding: '0.7rem 1rem',
                    borderBottom: `1.5px solid ${BRASS}99`,
                    fontSize: 'clamp(0.62rem, 0.75vw, 0.7rem)',
                    letterSpacing: '0.16em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => {
              const isHighlight = row.highlight;
              const isDivider = row.divider;
              return (
                <tr
                  key={ri}
                  style={{
                    borderTop: isDivider ? `1px solid ${BRONZE}55` : undefined,
                    backgroundColor: isHighlight ? `${BRASS}1f` : 'transparent',
                  }}
                >
                  {row.cells.map((cell, ci) => (
                    <td
                      key={ci}
                      style={{
                        textAlign: ci === 0 ? 'left' : 'right',
                        padding: '0.55rem 1rem',
                        fontFamily:
                          ci === 0 ? 'inherit' : "'IBM Plex Mono', ui-monospace, monospace",
                        color: isHighlight ? INK_DEEP : WALNUT,
                        fontWeight: isHighlight ? 600 : 400,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {caption && <Caption>{caption}</Caption>}
      {footnote && (
        <p
          className="font-mono"
          style={{
            marginTop: '0.4rem',
            color: `${BRONZE}99`,
            fontSize: 'clamp(0.65rem, 0.78vw, 0.72rem)',
            letterSpacing: '0.04em',
            lineHeight: 1.5,
          }}
        >
          {footnote}
        </p>
      )}
    </figure>
  );
}

function ReferenceBlock({ items }) {
  const { WALNUT, INK_DEEP, BRONZE, BRASS } = usePalette();
  return (
    <div
      style={{
        width: '100%',
        maxWidth: MEASURE_TEXT,
        margin: '0 auto',
        padding: '0 clamp(1.5rem, 6vw, 5rem)',
      }}
    >
      <ol
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(1rem, 2vh, 1.4rem)',
          counterReset: 'ref',
        }}
      >
        {items.map((ref, i) => {
          const inner = (
            <>
              <p
                style={{
                  color: WALNUT,
                  fontSize: 'clamp(0.95rem, 1.15vw, 1.05rem)',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                <span style={{ color: INK_DEEP, fontWeight: 600 }}>
                  {ref.authors}
                </span>
                {' '}
                <span style={{ color: `${BRONZE}cc` }}>({ref.year})</span>.
                {' '}
                <em style={{ color: INK_DEEP, fontStyle: 'italic' }}>{ref.title}</em>.
                {' '}
                <span style={{ color: `${WALNUT}cc` }}>{ref.venue}</span>.
              </p>
              {ref.note && (
                <p
                  style={{
                    marginTop: '0.4rem',
                    color: `${BRONZE}cc`,
                    fontSize: 'clamp(0.85rem, 1vw, 0.95rem)',
                    lineHeight: 1.55,
                  }}
                >
                  {ref.note}
                </p>
              )}
              {ref.url && (
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono uppercase"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    marginTop: '0.55rem',
                    color: BRONZE,
                    fontSize: 'clamp(0.65rem, 0.78vw, 0.72rem)',
                    letterSpacing: '0.16em',
                    textDecoration: 'none',
                    borderBottom: `1px solid ${BRASS}55`,
                    paddingBottom: '1px',
                    width: 'fit-content',
                  }}
                >
                  {ref.url.replace(/^https?:\/\//, '').replace(/\/$/, '')} <span aria-hidden>&#8599;</span>
                </a>
              )}
            </>
          );
          const refId = ref.id || String(i + 1);
          return (
            <li
              key={refId}
              id={`ref-${refId}`}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                columnGap: '1rem',
                alignItems: 'baseline',
                scrollMarginTop: '6rem',
                padding: '0.75rem 0.85rem',
                margin: '-0.75rem -0.85rem',
                borderRadius: 8,
                transition: 'background-color 600ms ease',
              }}
            >
              <span
                className="font-mono"
                style={{
                  color: `${BRONZE}b3`,
                  fontSize: 'clamp(0.85rem, 1.05vw, 0.95rem)',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
              >
                [{refId}]
              </span>
              <div>{inner}</div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function CtaBlock({ text, label, url }) {
  const P = usePalette();
  const { WALNUT, BRASS } = P;
  return (
    <div
      style={{
        width: '100%',
        maxWidth: MEASURE_TEXT,
        margin: '0 auto',
        padding: '0 clamp(1.5rem, 6vw, 5rem)',
      }}
    >
      {text && (
        <p
          style={{
            color: WALNUT,
            fontSize: 'clamp(1.05rem, 1.35vw, 1.2rem)',
            lineHeight: 1.7,
            marginBottom: '1rem',
          }}
        >
          {renderCitations(text, P)}
        </p>
      )}
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono uppercase inline-flex items-center gap-2 transition-colors duration-200"
          style={{
            backgroundColor: 'transparent',
            border: `1px solid ${BRASS}`,
            color: WALNUT,
            borderRadius: 9999,
            padding: '0.55rem 1.1rem',
            fontSize: 'clamp(0.7rem, 0.85vw, 0.8rem)',
            letterSpacing: '0.18em',
            textDecoration: 'none',
          }}
        >
          {label || 'Read more'} <span aria-hidden>&#8599;</span>
        </a>
      )}
    </div>
  );
}

function AbstractBlock({ content, label = 'Abstract' }) {
  const P = usePalette();
  const { LINEN, BRASS, BRONZE, WALNUT } = P;
  return (
    <div
      style={{
        width: '100%',
        maxWidth: MEASURE_TEXT,
        margin: '0 auto',
        padding: '0 clamp(1.5rem, 6vw, 5rem)',
      }}
    >
      <div
        style={{
          backgroundColor: `${LINEN}1f`,
          border: `1px solid ${LINEN}66`,
          borderLeft: `3px solid ${BRASS}`,
          borderRadius: 8,
          padding: 'clamp(1.25rem, 2.5vh, 1.75rem) clamp(1.5rem, 3vw, 2rem)',
        }}
      >
        <p
          className="font-mono uppercase"
          style={{
            color: `${BRONZE}cc`,
            fontSize: 'clamp(0.65rem, 0.78vw, 0.72rem)',
            letterSpacing: '0.22em',
            marginBottom: '0.65rem',
          }}
        >
          {label}
        </p>
        <p
          style={{
            color: WALNUT,
            fontSize: 'clamp(1.05rem, 1.35vw, 1.2rem)',
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {renderCitations(content, P)}
        </p>
      </div>
    </div>
  );
}

// Build a localized clone of a body block by wrapping every translatable string
// with `t('project.<slug>.body.<i>.<path>', { defaultValue: original })`. URLs,
// src paths, kind, ids, and structural flags pass through untouched.
function localizeBlock(slug, i, block, t) {
  const base = `project.${slug}.body.${i}`;
  const tr = (suffix, value) =>
    value == null ? value : t(`${base}.${suffix}`, { defaultValue: value });

  switch (block.kind) {
    case 'text':
      return { ...block, content: tr('text', block.content) };
    case 'image':
      return {
        ...block,
        alt: tr('alt', block.alt),
        caption: tr('caption', block.caption),
      };
    case 'audio':
      return { ...block, caption: tr('caption', block.caption) };
    case 'video':
      return { ...block, caption: tr('caption', block.caption) };
    case 'heading':
      return {
        ...block,
        text: tr('heading', block.text),
        eyebrow: tr('eyebrow', block.eyebrow),
      };
    case 'abstract':
    case 'tldr':
      return {
        ...block,
        content: tr('text', block.content),
        label: tr('label', block.label),
      };
    case 'sideBySide': {
      // Translator emitted sideBySide image alt/caption at body.<i>.alt and
      // body.<i>.caption (alongside text at body.<i>.text). Try those first;
      // fall back to body.<i>.image.alt / .image.caption.
      const localizedImage = block.image
        ? {
            ...block.image,
            alt:
              block.image.alt == null
                ? block.image.alt
                : t(`${base}.alt`, {
                    defaultValue: t(`${base}.image.alt`, {
                      defaultValue: block.image.alt,
                    }),
                  }),
            caption:
              block.image.caption == null
                ? block.image.caption
                : t(`${base}.caption`, {
                    defaultValue: t(`${base}.image.caption`, {
                      defaultValue: block.image.caption,
                    }),
                  }),
          }
        : block.image;
      return {
        ...block,
        text: tr('text', block.text),
        image: localizedImage,
      };
    }
    case 'list':
      return {
        ...block,
        intro: tr('intro', block.intro),
        items: (block.items || []).map((item, j) => {
          if (typeof item === 'string') {
            return t(`${base}.items.${j}.body`, { defaultValue: item });
          }
          if (!item || typeof item !== 'object') return item;
          const out = { ...item };
          if (item.label != null)
            out.label = t(`${base}.items.${j}.label`, { defaultValue: item.label });
          if (item.text != null)
            out.text = t(`${base}.items.${j}.text`, { defaultValue: item.text });
          if (item.body != null)
            out.body = t(`${base}.items.${j}.body`, { defaultValue: item.body });
          if (item.note != null)
            out.note = t(`${base}.items.${j}.note`, { defaultValue: item.note });
          return out;
        }),
      };
    case 'references':
      return {
        ...block,
        items: (block.items || []).map((item, j) => {
          if (!item || typeof item !== 'object') return item;
          const out = { ...item };
          if (item.title != null)
            out.title = t(`${base}.items.${j}.title`, { defaultValue: item.title });
          if (item.venue != null)
            out.venue = t(`${base}.items.${j}.venue`, { defaultValue: item.venue });
          if (item.note != null)
            out.note = t(`${base}.items.${j}.note`, { defaultValue: item.note });
          return out;
        }),
      };
    case 'cta':
      return {
        ...block,
        text: tr('text', block.text),
        label: tr('label', block.label),
      };
    case 'table':
      return {
        ...block,
        headers: (block.headers || []).map((h, k) =>
          h == null ? h : t(`${base}.headers.${k}`, { defaultValue: h }),
        ),
        rows: (block.rows || []).map((row, k) => {
          if (!row || typeof row !== 'object') return row;
          return {
            ...row,
            cells: (row.cells || []).map((cell, m) =>
              cell == null
                ? cell
                : t(`${base}.rows.${k}.cells.${m}`, { defaultValue: cell }),
            ),
          };
        }),
        caption: tr('caption', block.caption),
        footnote: tr('footnote', block.footnote),
      };
    default:
      return block;
  }
}

function BodyBlock({ block, onOpenImage }) {
  if (block.kind === 'text') return <TextBlock content={block.content} />;
  if (block.kind === 'image')
    return (
      <ImageBlock
        src={block.src}
        alt={block.alt}
        caption={block.caption}
        onOpen={onOpenImage}
      />
    );
  if (block.kind === 'audio') return <AudioBlock src={block.src} caption={block.caption} />;
  if (block.kind === 'video') return <VideoBlock src={block.src} poster={block.poster} caption={block.caption} />;
  if (block.kind === 'heading') return <HeadingBlock text={block.text} eyebrow={block.eyebrow} />;
  if (block.kind === 'abstract' || block.kind === 'tldr')
    return <AbstractBlock content={block.content} label={block.label} />;
  if (block.kind === 'sideBySide')
    return (
      <SideBySideBlock
        text={block.text}
        image={block.image}
        imageSide={block.imageSide}
        onOpen={onOpenImage}
      />
    );
  if (block.kind === 'list')
    return <ListBlock intro={block.intro} items={block.items} variant={block.variant} />;
  if (block.kind === 'references') return <ReferenceBlock items={block.items} />;
  if (block.kind === 'cta')
    return <CtaBlock text={block.text} label={block.label} url={block.url} />;
  if (block.kind === 'table')
    return (
      <TableBlock
        headers={block.headers}
        rows={block.rows}
        caption={block.caption}
        footnote={block.footnote}
      />
    );
  return null;
}

function NotFound() {
  const { t } = useTranslation();
  const { CREAM_BASE, BRONZE, INK_DEEP } = usePalette();
  return (
    <PageTransition scene="project">
      <main
        style={{
          minHeight: '100vh',
          backgroundColor: CREAM_BASE,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8rem 1.5rem',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '32ch' }}>
          <p
            className="font-mono uppercase mb-3"
            style={{
              fontSize: 'clamp(0.7rem, 0.85vw, 0.8rem)',
              letterSpacing: '0.22em',
              color: `${BRONZE}b3`,
            }}
          >
            {t('project.404.eyebrow')}
          </p>
          <p style={{ fontSize: '1.15rem', color: INK_DEEP, marginBottom: '1.5rem' }}>
            {t('project.404.body')}
          </p>
          <Link
            to="/projects"
            className="inline-block rounded-full transition-colors duration-200"
            style={{
              backgroundColor: '#92400e',
              color: '#fffbeb',
              padding: '0.7rem 1.5rem',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}
          >
            {t('project.allProjects')}
          </Link>
        </div>
      </main>
    </PageTransition>
  );
}

function ProjectDetail() {
  const { id } = useParams();
  const reduceMotion = useReducedMotion();
  const isMobileChrome = useIsMobile('(max-width: 767px)');
  const simplifyMotion = reduceMotion || isMobileChrome;
  const { t } = useTranslation();
  const P = usePalette();
  const { CREAM_BASE, LINEN, BRONZE, INK_DEEP, BRASS, WALNUT } = P;
  // All hooks must run before any early return so the hook order stays
  // stable when navigating between a valid project and a missing id.
  const [lightbox, setLightbox] = useState(null);
  const project = projects.find((p) => p.id === parseInt(id, 10));

  if (!project) return <NotFound />;

  const currentIndex = projects.findIndex((p) => p.id === project.id);
  const prevProject = projects[currentIndex - 1] || null;
  const nextProject = projects[currentIndex + 1] || null;
  const body = project.body || [];
  const links = project.links || [];
  const comingSoon = project.comingSoon || [];

  // Localized meta — defaultValue falls through to the English source when no zh key exists.
  const title = t(`project.${project.slug}.title`, { defaultValue: project.title });
  const period = t(`project.${project.slug}.period`, { defaultValue: project.period });
  const subtitle = t(`project.${project.slug}.subtitle`, {
    defaultValue: project.venue,
  });
  const category = t(`project.${project.slug}.category`, {
    defaultValue: project.category,
  });
  const description = t(`project.${project.slug}.description`, {
    defaultValue: project.description,
  });
  const localizedTags = (project.tags || []).map((tag, i) =>
    t(`project.${project.slug}.tags.${i}`, { defaultValue: tag }),
  );
  const prevShortTitle = prevProject
    ? t(`project.${prevProject.slug}.shortTitle`, { defaultValue: prevProject.shortTitle })
    : null;
  const nextShortTitle = nextProject
    ? t(`project.${nextProject.slug}.shortTitle`, { defaultValue: nextProject.shortTitle })
    : null;
  const prevTitle = prevProject
    ? t(`project.${prevProject.slug}.title`, { defaultValue: prevProject.title })
    : null;
  const nextTitle = nextProject
    ? t(`project.${nextProject.slug}.title`, { defaultValue: nextProject.title })
    : null;
  const projectPager = (
    <div
      className="project-pager"
      style={{
        position: 'fixed',
        bottom: isMobileChrome ? 'env(safe-area-inset-bottom, 0px)' : 64,
        left: 0,
        right: 0,
        zIndex: 49,
        width: '100%',
        marginTop: 0,
        backgroundColor: 'var(--overlay-bg)',
        backdropFilter: isMobileChrome ? undefined : 'blur(10px)',
        WebkitBackdropFilter: isMobileChrome ? undefined : 'blur(10px)',
        borderTop: `1px solid ${LINEN}66`,
        borderBottom: isMobileChrome ? 0 : `1px solid ${LINEN}44`,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: MEASURE_MEDIA,
          margin: '0 auto',
          padding: isMobileChrome
            ? '1rem clamp(1.5rem, 6vw, 5rem) clamp(1.25rem, 4vh, 1.75rem)'
            : 'clamp(0.7rem, 1.2vw, 1rem) clamp(1.5rem, 6vw, 5rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: isMobileChrome ? '0.75rem' : '1rem',
        }}
      >
        <div style={{ minWidth: 0, flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <TransportButton
            to={prevProject ? `/projects/${prevProject.id}` : undefined}
            variant="prev"
            size={isMobileChrome ? 34 : 38}
            disabled={!prevProject}
            ariaLabel={prevProject ? `Previous project: ${prevTitle}` : 'No previous project'}
          />
          {prevProject && (
            <Link
              to={`/projects/${prevProject.id}`}
              style={{
                color: INK_DEEP,
                fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
                fontWeight: 500,
                lineHeight: 1.25,
                textDecoration: 'none',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: isMobileChrome ? 'normal' : 'nowrap',
                display: isMobileChrome ? '-webkit-box' : 'block',
                WebkitLineClamp: isMobileChrome ? 2 : undefined,
                WebkitBoxOrient: isMobileChrome ? 'vertical' : undefined,
                minWidth: 0,
              }}
              className="hover:underline"
            >
              {prevShortTitle}
            </Link>
          )}
        </div>

        <div style={{ minWidth: 0, flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-end' }}>
          {nextProject && (
            <Link
              to={`/projects/${nextProject.id}`}
              style={{
                color: INK_DEEP,
                fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
                fontWeight: 500,
                lineHeight: 1.25,
                textDecoration: 'none',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: 'right',
                whiteSpace: isMobileChrome ? 'normal' : 'nowrap',
                display: isMobileChrome ? '-webkit-box' : 'block',
                WebkitLineClamp: isMobileChrome ? 2 : undefined,
                WebkitBoxOrient: isMobileChrome ? 'vertical' : undefined,
                minWidth: 0,
              }}
              className="hover:underline"
            >
              {nextShortTitle}
            </Link>
          )}
          <TransportButton
            to={nextProject ? `/projects/${nextProject.id}` : undefined}
            variant="next"
            size={isMobileChrome ? 34 : 38}
            disabled={!nextProject}
            ariaLabel={nextProject ? `Next project: ${nextTitle}` : 'No next project'}
          />
        </div>
      </div>
    </div>
  );

  return (
    <PageTransition scene="project">
      <main
        style={{
          width: '100%',
          backgroundColor: CREAM_BASE,
          minHeight: '100vh',
          paddingTop: isMobileChrome ? '5.25rem' : 'clamp(5rem, 8vh, 6.5rem)',
        }}
      >
        {/* Transport bar — sticky header with REW (back to projects) + PREV/NEXT */}
        <div
          className="project-transport-bar"
          style={{
            position: 'sticky',
            top: isMobileChrome
              ? 'calc(5.25rem + env(safe-area-inset-top, 0px))'
              : 'clamp(3.5rem, 5vw, 4.25rem)',
            zIndex: isMobileChrome ? 45 : 30,
            width: '100%',
            backgroundColor: 'var(--overlay-bg)',
            backdropFilter: isMobileChrome ? undefined : 'blur(10px)',
            WebkitBackdropFilter: isMobileChrome ? undefined : 'blur(10px)',
            borderBottom: `1px solid ${LINEN}44`,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: MEASURE_MEDIA,
              margin: '0 auto',
              padding: 'clamp(0.65rem, 1.2vw, 0.9rem) clamp(1.5rem, 6vw, 5rem)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <TransportButton
              to="/projects"
              variant="rew"
              size={isMobileChrome ? 44 : 52}
              label={t('project.rewind')}
              sublabel={t('project.backToParlor', { defaultValue: 'back to parlor' })}
            />
          </div>
        </div>

        {/* Editorial header */}
        <section
          style={{
            width: '100%',
            maxWidth: MEASURE_MEDIA,
            margin: '0 auto',
            padding: 'clamp(2.5rem, 5vh, 4rem) clamp(1.5rem, 6vw, 5rem) clamp(2.5rem, 5vh, 4rem)',
          }}
        >
          <Motion.div
            initial={simplifyMotion ? false : { opacity: 0, y: 16 }}
            animate={simplifyMotion ? undefined : { opacity: 1, y: 0 }}
            transition={simplifyMotion ? undefined : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="font-mono uppercase"
              style={{
                color: `${BRONZE}b3`,
                fontSize: 'clamp(0.7rem, 0.85vw, 0.8rem)',
                letterSpacing: '0.22em',
                marginBottom: 'clamp(0.75rem, 1.5vh, 1.25rem)',
              }}
            >
              {category} &middot; {period}
            </p>
            <h1
              className="font-bold"
              style={{
                color: INK_DEEP,
                fontSize: 'clamp(2.5rem, 6vw, 4.75rem)',
                lineHeight: 1.04,
                letterSpacing: '-0.02em',
                textWrap: 'balance',
                WebkitTextWrap: 'balance',
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                style={{
                  color: BRONZE,
                  fontSize: 'clamp(0.95rem, 1.15vw, 1.05rem)',
                  fontStyle: 'italic',
                  letterSpacing: '0.01em',
                  marginTop: 'clamp(0.85rem, 1.6vh, 1.1rem)',
                }}
              >
                {subtitle}
              </p>
            )}
            <p
              style={{
                color: `${WALNUT}d9`,
                fontSize: 'clamp(1.05rem, 1.5vw, 1.35rem)',
                lineHeight: 1.6,
                maxWidth: '78ch',
                marginTop: subtitle
                  ? 'clamp(0.85rem, 1.6vh, 1.1rem)'
                  : 'clamp(1.25rem, 2.5vh, 1.75rem)',
              }}
            >
              {renderCitations(description, P)}
            </p>

            {/* Brass hairline — the cross-room thread */}
            <div
              aria-hidden
              style={{
                marginTop: 'clamp(2rem, 4vh, 3rem)',
                marginBottom: 'clamp(1.5rem, 3vh, 2rem)',
                height: '1px',
                width: '96px',
                backgroundColor: BRASS,
              }}
            />

            {/* Meta row: tags + outward links */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              {localizedTags.map((tag, idx) => (
                <span
                  key={`${idx}-${tag}`}
                  className="font-mono uppercase"
                  style={{
                    backgroundColor: `${LINEN}33`,
                    border: `1px solid ${LINEN}`,
                    color: WALNUT,
                    borderRadius: 9999,
                    padding: '4px 12px',
                    fontSize: 'clamp(0.65rem, 0.78vw, 0.72rem)',
                    letterSpacing: '0.1em',
                  }}
                >
                  {tag}
                </span>
              ))}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono uppercase transition-colors duration-200 inline-flex items-center gap-1"
                  style={{
                    backgroundColor: 'transparent',
                    border: `1px solid ${BRASS}`,
                    color: WALNUT,
                    borderRadius: 9999,
                    padding: '4px 12px',
                    fontSize: 'clamp(0.65rem, 0.78vw, 0.72rem)',
                    letterSpacing: '0.1em',
                    textDecoration: 'none',
                  }}
                >
                  GitHub <span aria-hidden>&#8599;</span>
                </a>
              )}
              {links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono uppercase transition-colors duration-200 inline-flex items-center gap-1"
                  style={{
                    backgroundColor: 'transparent',
                    border: `1px solid ${BRASS}`,
                    color: WALNUT,
                    borderRadius: 9999,
                    padding: '4px 12px',
                    fontSize: 'clamp(0.65rem, 0.78vw, 0.72rem)',
                    letterSpacing: '0.1em',
                    textDecoration: 'none',
                  }}
                >
                  {link.label} <span aria-hidden>&#8599;</span>
                </a>
              ))}
              {comingSoon.map((label) => (
                <span
                  key={`coming-${label}`}
                  className="font-mono uppercase inline-flex items-center gap-1"
                  aria-disabled="true"
                  title={t('project.comingSoon')}
                  style={{
                    backgroundColor: 'transparent',
                    border: `1px dashed ${LINEN}`,
                    color: `${BRONZE}b3`,
                    borderRadius: 9999,
                    padding: '4px 12px',
                    fontSize: 'clamp(0.65rem, 0.78vw, 0.72rem)',
                    letterSpacing: '0.1em',
                    cursor: 'not-allowed',
                  }}
                >
                  {label} <span style={{ opacity: 0.7 }}>(coming soon)</span>
                </span>
              ))}
            </div>
          </Motion.div>
        </section>

        {/* Body — interleaved blocks */}
        {body.length > 0 && (
          <section style={{ width: '100%' }}>
            {body.map((block, i) => {
              const localized = localizeBlock(project.slug, i, block, t);
              const revealProps = simplifyMotion
                ? {}
                : {
                    initial: { opacity: 0, y: 16 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, margin: '-80px' },
                    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                  };
              return (
                <Motion.div
                  key={i}
                  {...revealProps}
                  style={{
                    marginTop:
                      i === 0
                        ? 0
                        : block.kind === 'heading'
                        ? 'clamp(3rem, 6vh, 4.5rem)'
                        : block.kind === 'abstract' || block.kind === 'tldr'
                        ? 'clamp(2rem, 4vh, 3rem)'
                        : block.kind === 'table'
                        ? 'clamp(1.75rem, 3.5vh, 2.5rem)'
                        : block.kind === 'list'
                        ? 'clamp(1.25rem, 2.5vh, 2rem)'
                        : block.kind === 'references'
                        ? 'clamp(1.5rem, 3vh, 2.25rem)'
                        : block.kind === 'sideBySide'
                        ? 'clamp(1.75rem, 3.5vh, 2.5rem)'
                        : block.kind === 'text'
                        ? 'clamp(1.5rem, 3vh, 2.25rem)'
                        : 'clamp(2rem, 4vh, 3.25rem)',
                  }}
                >
                  <BodyBlock block={localized} onOpenImage={setLightbox} />
                </Motion.div>
              );
            })}
          </section>
        )}

        <div
          style={{
            width: '100%',
            paddingBottom: isMobileChrome ? 'clamp(7rem, 16vh, 9rem)' : 'clamp(10rem, 20vh, 14rem)',
          }}
        />

        {createPortal(projectPager, document.body)}

        <AnimatePresence>
          {lightbox && (
            <Lightbox image={lightbox} onClose={() => setLightbox(null)} />
          )}
        </AnimatePresence>
      </main>
    </PageTransition>
  );
}

export default ProjectDetail;
