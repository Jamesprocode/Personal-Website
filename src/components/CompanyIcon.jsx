// Inline SVG icon marks for timeline entries.
// Designed as small monogram / pictogram marks, not real company logos.
// Pass a `logo` URL on the timeline entry to override with an actual image.

function CompanyIcon({ iconKey, size = 36, color = '#2d2d2d' }) {
  const props = { size, color };
  switch (iconKey) {
    case 'oxy':
      return <OxyMark {...props} />;
    case 'gt':
      return <GTMark {...props} />;
    case 'ey':
      return <EYMark {...props} />;
    case 'mic':
      return <MicIcon {...props} />;
    case 'music':
      return <MusicNoteIcon {...props} />;
    case 'audio-interface':
      return <AudioInterfaceIcon {...props} />;
    case 'finance':
      return <FinanceIcon {...props} />;
    case 'tech':
      return <TechIcon {...props} />;
    case 'museum':
      return <MuseumIcon {...props} />;
    case 'consulting':
      return <ConsultingIcon {...props} />;
    case 'research':
      return <ResearchIcon {...props} />;
    case 'edu':
    default:
      return <GraduationIcon {...props} />;
  }
}

function frame(size, color, children) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 9999,
        backgroundColor: `${color}10`,
        border: `1px solid ${color}33`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color,
      }}
    >
      {children}
    </span>
  );
}

function OxyMark({ size, color }) {
  return frame(
    size,
    color,
    <span
      style={{
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontStyle: 'italic',
        fontWeight: 700,
        fontSize: size * 0.42,
        letterSpacing: '-0.02em',
        color,
        lineHeight: 1,
      }}
    >
      Oxy
    </span>,
  );
}

function GTMark({ size, color }) {
  return frame(
    size,
    color,
    <span
      style={{
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontWeight: 800,
        fontSize: size * 0.4,
        color,
        lineHeight: 1,
      }}
    >
      GT
    </span>,
  );
}

function EYMark({ size, color }) {
  return frame(
    size,
    color,
    <span
      style={{
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontWeight: 800,
        fontStyle: 'italic',
        fontSize: size * 0.42,
        color,
        lineHeight: 1,
      }}
    >
      EY
    </span>,
  );
}

function MicIcon({ size, color }) {
  return frame(
    size,
    color,
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>,
  );
}

function MusicNoteIcon({ size, color }) {
  return frame(
    size,
    color,
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="18" r="3" />
      <circle cx="17" cy="16" r="3" />
      <path d="M9 18V5l11-2v13" />
    </svg>,
  );
}

function AudioInterfaceIcon({ size, color }) {
  return frame(
    size,
    color,
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="8" cy="12" r="2" />
      <circle cx="14" cy="12" r="2" />
      <line x1="19" y1="10" x2="19" y2="14" />
    </svg>,
  );
}

function FinanceIcon({ size, color }) {
  return frame(
    size,
    color,
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="20" x2="20" y2="20" />
      <rect x="6" y="12" width="3" height="8" />
      <rect x="11" y="8" width="3" height="12" />
      <rect x="16" y="4" width="3" height="16" />
    </svg>,
  );
}

function TechIcon({ size, color }) {
  return frame(
    size,
    color,
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="6" width="12" height="12" rx="1.5" />
      <line x1="9" y1="4" x2="9" y2="6" />
      <line x1="12" y1="4" x2="12" y2="6" />
      <line x1="15" y1="4" x2="15" y2="6" />
      <line x1="9" y1="18" x2="9" y2="20" />
      <line x1="12" y1="18" x2="12" y2="20" />
      <line x1="15" y1="18" x2="15" y2="20" />
      <line x1="4" y1="9" x2="6" y2="9" />
      <line x1="4" y1="12" x2="6" y2="12" />
      <line x1="4" y1="15" x2="6" y2="15" />
      <line x1="18" y1="9" x2="20" y2="9" />
      <line x1="18" y1="12" x2="20" y2="12" />
      <line x1="18" y1="15" x2="20" y2="15" />
    </svg>,
  );
}

function MuseumIcon({ size, color }) {
  return frame(
    size,
    color,
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3,9 12,4 21,9" />
      <line x1="6" y1="10" x2="6" y2="18" />
      <line x1="10" y1="10" x2="10" y2="18" />
      <line x1="14" y1="10" x2="14" y2="18" />
      <line x1="18" y1="10" x2="18" y2="18" />
      <line x1="3" y1="20" x2="21" y2="20" />
    </svg>,
  );
}

function ConsultingIcon({ size, color }) {
  return frame(
    size,
    color,
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="12" rx="1.5" />
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="12" y1="13" x2="12" y2="16" />
    </svg>,
  );
}

function ResearchIcon({ size, color }) {
  return frame(
    size,
    color,
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3v6L4 19a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3L15 9V3" />
      <line x1="8" y1="3" x2="16" y2="3" />
      <line x1="7.5" y1="14" x2="16.5" y2="14" />
    </svg>,
  );
}

function GraduationIcon({ size, color }) {
  return frame(
    size,
    color,
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 10 L12 5 L22 10 L12 15 Z" />
      <path d="M6 12v4c0 1 3 2 6 2s6-1 6-2v-4" />
    </svg>,
  );
}

export default CompanyIcon;
