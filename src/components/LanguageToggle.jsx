import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';

/**
 * LanguageToggle
 * --------------
 * Minimal two-state language switch: EN | 中.
 * The active label carries a 1.5 px brass-gold underline — the cross-room
 * brass thread used as the only chrome. No bezels, no housings.
 *
 * The container reserves a fixed width so the navbar never reflows when
 * the user flips languages.
 *
 * Theme-aware (drives off the active theme, NOT the route, so the toggle
 * stays legible on the navbar in both modes):
 *   - Light (cream navbar): walnut active text, aged-bronze inactive.
 *   - Dark (espresso navbar): white active text, parchment-low inactive.
 */
function LanguageToggle({ variant = 'desktop' }) {
  const { i18n } = useTranslation();
  const { isDark } = useTheme();

  const isCream = !isDark;

  const currentLang = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('zh')
    ? 'zh'
    : 'en';

  const setLang = (lang) => {
    if (lang === currentLang) return;
    i18n.changeLanguage(lang);
    try {
      localStorage.setItem('lang', lang);
    } catch {
      /* localStorage may be unavailable; detector handles fallback */
    }
  };

  const toggle = () => setLang(currentLang === 'en' ? 'zh' : 'en');

  const ariaLabel =
    currentLang === 'en'
      ? 'Switch language to Chinese'
      : 'Switch language to English';

  const brass = '#c4a265';
  const activeColor = variant === 'mobile'
    ? 'var(--text-strong)'
    : isCream ? '#2d2d2d' : '#ffffff';
  const inactiveColor = variant === 'mobile'
    ? 'var(--text-muted)'
    : isCream ? 'rgba(108,92,59,0.6)' : 'rgba(255,255,255,0.45)';
  const dividerColor = variant === 'mobile'
    ? 'rgba(255,255,255,0.2)'
    : isCream ? 'rgba(108,92,59,0.3)' : 'rgba(255,255,255,0.22)';

  const monoFamily =
    '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace';
  const cjkFamily =
    '"Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';

  const labelStyle = (isActive, isCjk) => ({
    fontFamily: isCjk ? cjkFamily : monoFamily,
    fontSize: isCjk ? '0.85rem' : '0.72rem',
    fontWeight: 600,
    letterSpacing: isCjk ? '0.04em' : '0.18em',
    textTransform: isCjk ? 'none' : 'uppercase',
    color: isActive ? activeColor : inactiveColor,
    borderBottom: `1.5px solid ${isActive ? brass : 'transparent'}`,
    paddingBottom: 2,
    lineHeight: 1,
    transition: 'color 220ms ease, border-color 220ms ease',
  });

  if (variant === 'mobile') {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={ariaLabel}
        className="flex items-center justify-center gap-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a265]/70"
        style={{
          width: '100%',
          minHeight: 44,
          padding: '0 1rem',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: 'inset 0 1px 0 rgba(253,244,220,0.38)',
        }}
      >
        <span style={labelStyle(currentLang === 'en', false)}>EN</span>
        <span
          aria-hidden="true"
          style={{ color: 'var(--text-muted)', fontFamily: monoFamily, fontSize: '0.72rem' }}
        >
          /
        </span>
        <span style={labelStyle(currentLang === 'zh', true)}>中</span>
      </button>
    );
  }

  // Desktop: compact two-label switch with a visible slash divider.
  // Fixed width so the navbar never shifts on language change; height is
  // intrinsic so the toggle's vertical center lines up with sibling nav
  // links (parent flex uses items-center).
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={ariaLabel}
      className="relative inline-flex items-center justify-center rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a265]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      style={{
        width: '60px',
        gap: '5px',
        padding: '0 6px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      <span style={labelStyle(currentLang === 'en', false)}>EN</span>
      <span
        aria-hidden="true"
        style={{
          fontFamily: monoFamily,
          fontSize: '0.78rem',
          fontWeight: 400,
          color: dividerColor,
          lineHeight: 1,
        }}
      >
        /
      </span>
      <span style={labelStyle(currentLang === 'zh', true)}>中</span>
    </button>
  );
}

export default LanguageToggle;
