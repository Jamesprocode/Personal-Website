import { motion as Motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import timeline from '../../data/timeline';
import CompanyIcon from '../../components/CompanyIcon';
import useIsMobile from '../../hooks/useIsMobile';

// Cream parlor palette — Timeline shares the brand surface with Landing
// and Project pages. The "digital" touch comes from the CD disc shape +
// the brief spin on hover, not a palette change.
// `labelKey` / `legendKey` map to flat i18n keys; the English labels stay
// as the source-of-truth `key` (data filter joins on these).
const TRACKS = [
  {
    key: 'Academic',
    labelKey: 'timeline.tracks.academic',
    legendKey: 'timeline.legend.academic',
    color: '#3b82f6',
  }, // cobalt
  {
    key: 'Internships',
    labelKey: 'timeline.tracks.internships',
    legendKey: 'timeline.legend.internships',
    color: '#6b7280',
  }, // slate
  {
    key: 'Music Performance',
    labelKey: 'timeline.tracks.performance',
    legendKey: 'timeline.legend.performance',
    color: '#f97316',
  }, // ember
];

const START_YEAR = 2020;
const END_YEAR = 2026;
const YEAR_SPAN = END_YEAR - START_YEAR;

const BAND_HEIGHT = 260;
const SPINE_Y = BAND_HEIGHT / 2;
const STEM_NEAR = 58;
const STEM_FAR = 98;
const LABEL_HEIGHT = 22;
const CD_REST = 44;
const CD_LIT = 60;
// Minimum horizontal spacing (as a fraction of chart width) between two
// label centers on the same row before we escalate to the other row or the
// far tier. 0.135 ≈ 140 px center-to-center on a 1050 px chart, leaving
// ~40 px breathing room around a clamp(82, 100, 104) label.
const MIN_LABEL_FRAC = 0.135;

// Track key → color lookup, shared by the desktop bands and the mobile stack.
const TRACK_COLOR = TRACKS.reduce((acc, tr) => {
  acc[tr.key] = tr.color;
  return acc;
}, {});

function ParallelTracks() {
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  // `pinned` is the entry whose tooltip is sticky after a click. Hover-only
  // tooltips disappear on mouseleave, but a click pins the card so the user
  // can take their cursor away to read.
  const [pinned, setPinned] = useState(null);
  // Hover state is lifted out of Entry so the tooltip can be rendered as a
  // band-level sibling AFTER all entries (DOM-last). Same z, DOM-later
  // means it paints on top of every disc/label without needing a portal
  // or a hover-driven z-bump on the entry wrapper.
  const [hoveredId, setHoveredId] = useState(null);
  const handleHoverChange = (id, isHovered) => {
    if (isHovered) setHoveredId(id);
    else setHoveredId((curr) => (curr === id ? null : curr));
  };

  const trackData = useMemo(() => {
    return TRACKS.map((track) => {
      const entries = timeline
        .filter((e) => e.category === track.key)
        .sort((a, b) => a.year - b.year);

      const byYear = {};
      entries.forEach((e) => {
        if (!byYear[e.year]) byYear[e.year] = [];
        byYear[e.year].push(e);
      });

      const placed = [];
      Object.keys(byYear).forEach((y) => {
        const group = byYear[y];
        const yearNum = Number(y);
        group.forEach((entry, idx) => {
          const within = group.length === 1 ? 0.5 : (idx + 0.5) / group.length;
          const xFrac = (yearNum - START_YEAR + within) / YEAR_SPAN;
          const above = idx % 2 === 0;
          placed.push({ ...entry, xFrac, above });
        });
      });

      // Assign a vertical row to each item so labels never crowd each other.
      // Four rows total: { above-near, below-near, above-far, below-far }.
      // Walk items left-to-right; for each, prefer its original above/below
      // at the near tier; if that row's last label is too close, try the
      // opposite side at near tier; finally escalate to the far tier on the
      // preferred side.
      const sorted = placed.slice().sort((a, b) => a.xFrac - b.xFrac);
      const lastByRow = {
        'above-near': -Infinity,
        'below-near': -Infinity,
        'above-far': -Infinity,
        'below-far': -Infinity,
      };
      sorted.forEach((item) => {
        // Per-entry override: if the data file specifies `forceRow`, honour
        // it verbatim — designer override beats spacing math. Still update
        // lastByRow so later entries see this slot as occupied.
        if (item.forceRow) {
          item.row = item.forceRow;
          lastByRow[item.forceRow] = item.xFrac;
          return;
        }
        const preferredNear = item.above ? 'above-near' : 'below-near';
        const otherNear = item.above ? 'below-near' : 'above-near';
        // When both near rows are full, escalate to BELOW-FAR first —
        // labels sink toward the year axis rather than fly above the spine.
        // above-far is the last resort.
        let chosen;
        if (item.xFrac - lastByRow[preferredNear] >= MIN_LABEL_FRAC) chosen = preferredNear;
        else if (item.xFrac - lastByRow[otherNear] >= MIN_LABEL_FRAC) chosen = otherNear;
        else if (item.xFrac - lastByRow['below-far'] >= MIN_LABEL_FRAC) chosen = 'below-far';
        else chosen = 'above-far';
        item.row = chosen;
        lastByRow[chosen] = item.xFrac;
      });

      return { ...track, items: placed };
    });
  }, []);

  // Mobile layout data: the parallel tracks rotate 90° into one vertical
  // spine. All entries merged, sorted by year, each carrying its track color.
  const stackItems = useMemo(
    () =>
      timeline
        .map((e) => ({ ...e, color: TRACK_COLOR[e.category] || '#6b7280' }))
        .sort((a, b) => a.year - b.year),
    []
  );

  useEffect(() => {
    if (!pinned) return undefined;
    const onKey = (e) => e.key === 'Escape' && setPinned(null);
    const onDocClick = (e) => {
      // Unpin if the click landed outside any entry or tooltip.
      if (!e.target.closest('[data-entry-id]')) setPinned(null);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onDocClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onDocClick);
    };
  }, [pinned]);

  return (
    <section
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 'clamp(0.5rem, 1.5vh, 1.25rem)',
        paddingBottom: 'clamp(3rem, 6vh, 5rem)',
      }}
      aria-label={t('timeline.rackAria')}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 'min(82rem, 92vw)',
          paddingLeft: 'clamp(1.5rem, 6vw, 5rem)',
          paddingRight: 'clamp(1.5rem, 6vw, 5rem)',
        }}
      >
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-[clamp(1rem,2vw,2.5rem)] gap-y-2 mb-[clamp(0.75rem,1.5vh,1.25rem)]">
          {TRACKS.map((track) => (
            <div key={track.key} className="flex items-center gap-2">
              <span
                style={{
                  display: 'inline-block',
                  width: 9,
                  height: 9,
                  borderRadius: 9999,
                  backgroundColor: track.color,
                }}
                aria-hidden
              />
              <span
                className="font-mono uppercase"
                style={{
                  color: 'var(--text-muted)',
                  fontSize: 'clamp(0.65rem, 0.78vw, 0.74rem)',
                  letterSpacing: '0.18em',
                }}
              >
                {t(track.legendKey)}
              </span>
            </div>
          ))}
        </div>

        {/* Bands (desktop) / Vertical CD stack (mobile) */}
        {isMobile ? (
          <VerticalStack items={stackItems} t={t} reduceMotion={reduceMotion} />
        ) : (
        <div className="relative">
          {trackData.map((track, trackIdx) => (
            <Motion.div
              key={track.key}
              initial={reduceMotion ? false : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: trackIdx * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative grid"
              style={{
                gridTemplateColumns: 'minmax(110px, 14ch) 1fr',
                gap: 'clamp(1rem, 2.5vw, 2.5rem)',
                paddingTop: 'clamp(0.5rem, 1vh, 0.75rem)',
                paddingBottom: 'clamp(0.5rem, 1vh, 0.75rem)',
                borderTop: trackIdx === 0 ? '1px solid var(--border)' : 'none',
                borderBottom: '1px solid var(--border)',
                alignItems: 'center',
              }}
            >
              <p
                className="font-medium"
                style={{
                  fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
                  color: track.color,
                  alignSelf: 'center',
                }}
              >
                {t(track.labelKey)}
              </p>

              <div className="relative" style={{ height: BAND_HEIGHT }}>
                {/* Spine */}
                <div
                  className="absolute left-0 right-0"
                  style={{
                    top: SPINE_Y,
                    height: 1,
                    background: `linear-gradient(90deg, transparent 0%, ${track.color}55 6%, ${track.color}55 94%, transparent 100%)`,
                  }}
                  aria-hidden
                />

                {track.items.map((item) => {
                  const isPinned = pinned && pinned.id === item.id;
                  const isHovered = hoveredId === item.id;
                  const dimOthers = pinned && !isPinned;
                  return (
                    <Entry
                      key={item.id}
                      item={item}
                      color={track.color}
                      isPinned={isPinned}
                      isHovered={isHovered}
                      dimOthers={dimOthers}
                      reduceMotion={reduceMotion}
                      t={t}
                      onTogglePin={() =>
                        setPinned((prev) => (prev?.id === item.id ? null : item))
                      }
                      onHoverChange={(h) => handleHoverChange(item.id, h)}
                    />
                  );
                })}

                {/* Active-entry tooltip — rendered as a band-level sibling
                    AFTER all entries so it paints on top in DOM order, no
                    matter which entry triggered it. */}
                {(() => {
                  const activeId = pinned?.id ?? hoveredId;
                  const active = track.items.find((i) => i.id === activeId);
                  if (!active) return null;
                  return (
                    <EntryTooltip
                      item={active}
                      color={track.color}
                      isPinned={!!pinned && pinned.id === active.id}
                      t={t}
                    />
                  );
                })()}
              </div>
            </Motion.div>
          ))}

          {/* Year axis */}
          <div
            className="grid mt-[clamp(0.75rem,1.5vh,1.25rem)]"
            style={{
              gridTemplateColumns: 'minmax(110px, 14ch) 1fr',
              gap: 'clamp(0.75rem, 2vw, 2rem)',
            }}
            aria-hidden
          >
            <div />
            <div className="relative" style={{ height: '1.5em' }}>
              {Array.from({ length: YEAR_SPAN + 1 }).map((_, i) => {
                const year = START_YEAR + i;
                const xFrac = i / YEAR_SPAN;
                return (
                  <span
                    key={year}
                    className="absolute top-0 font-mono"
                    style={{
                      left: `${xFrac * 100}%`,
                      transform: 'translateX(-50%)',
                      fontSize: 'clamp(0.7rem, 0.85vw, 0.8rem)',
                      letterSpacing: '0.05em',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {year}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        )}

        <p
          className="mt-[clamp(1.5rem,3vh,2.5rem)] text-center italic"
          style={{ fontSize: 'clamp(0.9rem, 1.1vw, 1rem)', color: 'var(--text-muted)' }}
        >
          {t('timeline.hint')}
        </p>
      </div>
    </section>
  );
}

// Mobile layout: the three horizontal tracks rotate 90° into a single
// vertical spine running top-to-bottom by year. Each entry is a tappable
// row — CD disc + year/category + title — that expands its details inline.
// This trades the crowded parallel-tracks chart (which needs horizontal room
// the phone doesn't have) for a scannable single column.
function VerticalStack({ items, t, reduceMotion }) {
  const [openId, setOpenId] = useState(null);
  const SPINE_X = 30; // px from the left edge — disc centers sit here

  return (
    <div style={{ position: 'relative', paddingLeft: 4 }}>
      {/* Continuous spine behind the discs */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: SPINE_X,
          top: 16,
          bottom: 16,
          width: 2,
          transform: 'translateX(-50%)',
          background:
            'linear-gradient(180deg, transparent 0%, var(--border-strong) 5%, var(--border-strong) 95%, transparent 100%)',
        }}
      />

      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        {items.map((item) => {
          const isOpen = openId === item.id;
          const titleTr = t(`timeline.entry.${item.id}.title`, {
            defaultValue: item.title,
          });
          const displayTitleTr = t(`timeline.entry.${item.id}.displayTitle`, {
            defaultValue: item.displayTitle || item.title,
          });
          const detailsTr = t(`timeline.entry.${item.id}.details`, {
            defaultValue: item.details || item.description,
          });
          return (
            <li key={item.id} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
                aria-expanded={isOpen}
                aria-label={`${titleTr}, ${item.year}`}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)] rounded-md"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  width: '100%',
                  textAlign: 'left',
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                }}
              >
                {/* CD disc anchored on the spine */}
                <span
                  style={{
                    position: 'relative',
                    width: CD_REST,
                    height: CD_REST,
                    flexShrink: 0,
                    marginLeft: SPINE_X - CD_REST / 2 - 4,
                  }}
                >
                  <CdDisc
                    size={CD_REST}
                    color={item.color}
                    spinning={isOpen && !reduceMotion}
                    isLit={isOpen}
                    reduceMotion={reduceMotion}
                  />
                </span>

                {/* Year/category + title */}
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span
                    className="font-mono uppercase"
                    style={{
                      display: 'block',
                      color: item.color,
                      fontSize: '0.64rem',
                      letterSpacing: '0.18em',
                      marginBottom: 3,
                    }}
                  >
                    {item.year} &middot; {item.category}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      color: isOpen ? 'var(--text-strong)' : 'var(--text)',
                      fontSize: '0.95rem',
                      fontWeight: isOpen ? 600 : 500,
                      lineHeight: 1.3,
                    }}
                  >
                    {displayTitleTr}
                  </span>
                </span>

                {/* Chevron affordance */}
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                    transition: reduceMotion ? 'none' : 'transform 200ms ease',
                  }}
                >
                  ▾
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <Motion.div
                    initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: 'hidden', marginLeft: SPINE_X + CD_REST / 2 - 4 }}
                  >
                    <p
                      style={{
                        color: 'var(--text)',
                        fontSize: '0.85rem',
                        lineHeight: 1.55,
                        paddingTop: 8,
                        paddingRight: 8,
                      }}
                    >
                      {titleTr !== displayTitleTr && (
                        <strong style={{ display: 'block', color: 'var(--text-strong)', marginBottom: 4 }}>
                          {titleTr}
                        </strong>
                      )}
                      {detailsTr}
                    </p>
                  </Motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Entry({
  item,
  color,
  isPinned,
  isHovered,
  dimOthers,
  reduceMotion,
  t,
  onTogglePin,
  onHoverChange,
}) {
  const row = item.row || (item.above ? 'above-near' : 'below-near');
  const above = row.startsWith('above');
  const stem = row.endsWith('-far') ? STEM_FAR : STEM_NEAR;
  const lit = isPinned || isHovered;
  const spinning = lit && !reduceMotion;
  const cdSize = lit ? CD_LIT : CD_REST;
  // Entry strings are translated against `timeline.entry.<id>.<field>` keys
  // in zh.json. English mode has no entry keys — `defaultValue` falls back
  // to the raw data string from `src/data/timeline.js`, which stays the
  // source of truth for English.
  const titleTr = t(`timeline.entry.${item.id}.title`, { defaultValue: item.title });
  const displayTitleTr = t(`timeline.entry.${item.id}.displayTitle`, {
    defaultValue: item.displayTitle || item.title,
  });

  return (
    <div
      data-entry-id={item.id}
      style={{
        position: 'absolute',
        left: `${item.xFrac * 100}%`,
        top: 0,
        height: '100%',
        width: 'clamp(82px, 7vw, 104px)',
        transform: 'translateX(-50%)',
        opacity: dimOthers ? 0.4 : 1,
        transition: reduceMotion ? 'none' : 'opacity 180ms ease',
        // Pinned card jumps to the top; everything else stays equal so the
        // DOM-later neighbor wins in any disc-overlap zone. Hover does NOT
        // bump z-index — otherwise the browser keeps targeting the old
        // hovered wrapper for one frame after mouseLeave, and the cursor
        // falls into a dead zone between adjacent discs.
        zIndex: isPinned ? 6 : 2,
        // Wrapper itself doesn't catch the mouse — only the disc-sized
        // button does, so hovering the label or stem region does not
        // trigger the tooltip.
        pointerEvents: 'none',
      }}
    >
      {/* Click + hover target — square at lit size, kept constant. A square
          hit area (not circle) avoids corner dead-zones where two adjacent
          discs' circular hit zones would leave a gap, causing the tooltip
          to flicker as the cursor crosses between them. */}
      <button
        type="button"
        onClick={onTogglePin}
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
        onFocus={() => onHoverChange(true)}
        onBlur={() => onHoverChange(false)}
        aria-label={`${titleTr}, ${item.year}`}
        aria-pressed={isPinned ? 'true' : 'false'}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)] rounded-sm"
        style={{
          position: 'absolute',
          top: SPINE_Y - CD_LIT / 2,
          left: '50%',
          width: CD_LIT,
          height: CD_LIT,
          transform: 'translateX(-50%)',
          cursor: 'pointer',
          background: 'transparent',
          border: 'none',
          padding: 0,
          pointerEvents: 'auto',
        }}
      />

      {/* Title — single line */}
      <span
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: above ? SPINE_Y - stem - LABEL_HEIGHT : SPINE_Y + stem + 4,
          width: '100%',
          height: LABEL_HEIGHT,
          color: lit ? 'var(--text-strong)' : 'var(--text)',
          fontSize: 'clamp(0.7rem, 0.8vw, 0.78rem)',
          lineHeight: `${LABEL_HEIGHT}px`,
          fontWeight: lit ? 600 : 500,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          padding: '0 2px',
          pointerEvents: 'none',
          transition: reduceMotion ? 'none' : 'color 150ms ease',
        }}
      >
        {displayTitleTr}
      </span>

      {/* Stem */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          left: '50%',
          top: above ? SPINE_Y - stem : SPINE_Y,
          width: 1,
          height: stem,
          transform: 'translateX(-50%)',
          background: lit ? color : `${color}55`,
          pointerEvents: 'none',
          transition: reduceMotion ? 'none' : 'background 150ms ease',
        }}
      />

      {/* CD disc on the spine */}
      <CdDisc
        size={cdSize}
        color={color}
        spinning={spinning}
        isLit={lit}
        reduceMotion={reduceMotion}
      />
    </div>
  );
}

// Standalone tooltip rendered as a sibling of all Entry wrappers within a
// band, anchored to the active entry's xFrac. Default placement keeps the
// card inside the chart: left-half entries open right, right-half entries
// open left. Per-entry `tooltipSide` overrides the default where needed.
function EntryTooltip({ item, color, isPinned, t }) {
  const placeOnLeft = item.tooltipSide
    ? item.tooltipSide === 'left'
    : item.xFrac > 0.5;
  const sideStyle = placeOnLeft
    ? { right: `calc(${(1 - item.xFrac) * 100}% + 30px)` }
    : { left: `calc(${item.xFrac * 100}% + 30px)` };
  const titleTr = t(`timeline.entry.${item.id}.title`, { defaultValue: item.title });
  const detailsTr = t(`timeline.entry.${item.id}.details`, {
    defaultValue: item.details || item.description,
  });
  return (
    <div
      data-entry-id={item.id}
      role="dialog"
      aria-label={`${titleTr} details`}
      style={{
        position: 'absolute',
        top: SPINE_Y,
        ...sideStyle,
        transform: 'translateY(-50%)',
        width: 'min(clamp(240px, 22vw, 300px), calc(100vw - 2rem))',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${color}`,
        borderRadius: 8,
        padding: '12px 14px 14px',
        boxShadow: isPinned
          ? '0 18px 32px -14px rgba(0,0,0,0.4)'
          : '0 10px 22px -10px rgba(0,0,0,0.28)',
        zIndex: 50,
        // Catch clicks so they don't fall through to the page-level
        // click-outside handler and unpin us.
        pointerEvents: 'auto',
      }}
    >
      {/* Logo / brand mark — real raster logo if the entry has one,
          otherwise the inline SVG fallback (music note, data-science chip,
          etc.). Top-right so text flows around it. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {item.logo ? (
          <img
            src={item.logo}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        ) : (
          <CompanyIcon iconKey={item.iconKey} size={36} color="#8c6e3b" />
        )}
      </div>

      {/* Text content — right-padded so it doesn't run under the logo */}
      <div style={{ paddingRight: 44 }}>
        <p
          className="font-mono uppercase"
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.66rem',
            letterSpacing: '0.2em',
            marginBottom: 5,
          }}
        >
          {item.year} &middot; {item.category}
          {isPinned ? ` · ${t('timeline.tooltipPinned')}` : ''}
        </p>
        <h3
          style={{
            color: 'var(--text-strong)',
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.25,
            marginBottom: 6,
          }}
        >
          {titleTr}
        </h3>
        <p
          style={{
            color: 'var(--text)',
            fontSize: '0.85rem',
            lineHeight: 1.55,
            overflowWrap: 'anywhere',
          }}
        >
          {detailsTr}
        </p>
      </div>
    </div>
  );
}

// A categorical CD disc. Reads as a CD via the strong concentric data
// grooves; the category color is the printed face. Order matters — grooves
// sit above the colored base so the rings are the dominant signifier.
function CdDisc({ size, color, spinning, isLit, reduceMotion }) {
  const hubSize = Math.max(8, Math.round(size * 0.22));
  const clampSize = Math.max(hubSize + 5, Math.round(size * 0.36));
  const grooveStep = size >= 40 ? 1.6 : 1.3; // px between groove rings
  const pinhole = Math.max(2, Math.round(hubSize * 0.3));
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: size,
        height: size,
        transform: 'translate(-50%, -50%)',
        borderRadius: 9999,
        pointerEvents: 'none',
        transition: reduceMotion
          ? 'none'
          : 'width 200ms ease, height 200ms ease, filter 200ms ease',
        filter: isLit
          ? `drop-shadow(0 5px 12px ${color}55) drop-shadow(0 0 4px ${color}88)`
          : 'drop-shadow(0 2px 4px rgba(80,55,15,0.35))',
      }}
    >
      {/* Polycarbonate edge — thin dark ring + faint highlight */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 9999,
          boxShadow:
            'inset 0 0 0 0.5px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(0,0,0,0.2)',
          zIndex: 1,
        }}
      />

      {/* Data face — category-colored aluminum gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 1,
          borderRadius: 9999,
          background: `radial-gradient(circle at 32% 28%, ${color}ff 0%, ${color}ee 45%, ${color}c0 85%, ${color}99 100%)`,
        }}
      />

      {/* Concentric data grooves — the CD signifier. Spins with disc. */}
      <div
        style={{
          position: 'absolute',
          inset: 1,
          borderRadius: 9999,
          background:
            'repeating-radial-gradient(circle at 50% 50%, ' +
            'rgba(0,0,0,0) 0px, ' +
            `rgba(0,0,0,0) ${grooveStep - 0.6}px, ` +
            `rgba(0,0,0,0.45) ${grooveStep - 0.3}px, ` +
            `rgba(255,255,255,0.35) ${grooveStep}px, ` +
            `rgba(0,0,0,0) ${grooveStep + 0.3}px)`,
          animation: spinning ? 'cd-spin 2.2s linear infinite' : 'none',
          mixBlendMode: 'overlay',
          opacity: 0.95,
        }}
      />

      {/* Iridescent shimmer — subtle rainbow refraction across the grooves */}
      <div
        style={{
          position: 'absolute',
          inset: 1,
          borderRadius: 9999,
          background:
            'conic-gradient(from 0deg, ' +
            'rgba(255,255,255,0) 0deg, ' +
            'rgba(255,235,200,0.32) 30deg, ' +
            'rgba(255,255,255,0) 65deg, ' +
            'rgba(180,210,255,0.22) 110deg, ' +
            'rgba(255,255,255,0) 145deg, ' +
            'rgba(255,200,220,0.22) 200deg, ' +
            'rgba(255,255,255,0) 235deg, ' +
            'rgba(200,255,220,0.22) 280deg, ' +
            'rgba(255,255,255,0) 320deg, ' +
            'rgba(255,255,255,0) 360deg)',
          mixBlendMode: 'screen',
          animation: spinning ? 'cd-spin 2.2s linear infinite' : 'none',
          opacity: isLit ? 0.7 : 0.4,
          transition: reduceMotion ? 'none' : 'opacity 200ms ease',
        }}
      />

      {/* Fixed specular highlight — static light source, does NOT spin */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 9999,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.12) 100%)',
          zIndex: 2,
        }}
      />

      {/* Mirror clamp ring — silvery band around the hub, no data grooves here */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: clampSize,
          height: clampSize,
          transform: 'translate(-50%, -50%)',
          borderRadius: 9999,
          background:
            'radial-gradient(circle at 35% 30%, #f1ece0 0%, #d5cdb8 60%, #b3a98f 100%)',
          boxShadow:
            'inset 0 0 0 0.5px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(0,0,0,0.2)',
          zIndex: 3,
        }}
      />

      {/* Brass center hub — the cross-room brass thread literally embedded */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: hubSize,
          height: hubSize,
          borderRadius: 9999,
          background:
            'radial-gradient(circle at 35% 30%, #d4b76e 0%, #c4a265 60%, #8c6e3b 100%)',
          boxShadow:
            'inset 0 -1px 1px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,235,170,0.5), 0 0 0 0.5px rgba(0,0,0,0.35)',
          zIndex: 4,
        }}
      />

      {/* Spindle pinhole — dead center */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: pinhole,
          height: pinhole,
          borderRadius: 9999,
          backgroundColor: '#1a1410',
          zIndex: 5,
        }}
      />
    </div>
  );
}

export default ParallelTracks;
