import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Sort key: last whitespace-delimited token of a name, lowercased.
// Works for "Haowen Luo" → "luo", "Ben Langer Weida" → "weida".
// Group credits (e.g. "Occidental College Chamber Jazz Ensemble") sort by
// their final token too, which is good enough here.
const lastName = (name) => {
  const parts = String(name).trim().split(/\s+/);
  return parts[parts.length - 1].toLowerCase();
};

/**
 * SleeveBack — a modal styled like the back of a vinyl record sleeve.
 * Shows liner notes + structured credits for an album. Closes via the X
 * button, clicking the backdrop, or Esc.
 *
 * Renders via a portal to document.body so it escapes the stacking context
 * created by the album browser's `position: sticky` parent — otherwise the
 * track-row bullet icons bleed through the backdrop.
 */
function SleeveBack({ album, onClose }) {
  const { t } = useTranslation();
  // Esc to close
  useEffect(() => {
    if (!album) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [album, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!album) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [album]);

  return createPortal(
    <AnimatePresence>
      {album ? (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 6, 4, 0.78)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(1rem, 3vw, 2rem)',
          }}
          role="dialog"
          aria-modal="true"
          aria-label={t('music.sleeveAria', { title: album.title })}
        >
          <motion.div
            key="sleeve"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 640,
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 'clamp(1.5rem, 4vw, 2.75rem)',
              borderRadius: 6,
              // Warm cream paper backdrop with subtle radial vignette,
              // overlaid by a tinted noise grain to read as printed cardstock.
              background:
                'radial-gradient(ellipse at 50% 0%, #f3e2bc 0%, #ead0a0 60%, #d8b67e 100%)',
              boxShadow:
                '0 35px 80px -20px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(72,46,18,0.25), inset 0 0 60px rgba(120,72,30,0.18)',
              color: '#1c1208',
              fontFamily: 'Space Grotesk, system-ui, sans-serif',
            }}
          >
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              aria-label={t('music.closeLiner')}
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                width: 32,
                height: 32,
                borderRadius: 9999,
                border: '1px solid rgba(72,46,18,0.3)',
                background: 'rgba(255,247,225,0.55)',
                color: '#3a230a',
                cursor: 'pointer',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 16,
                lineHeight: '30px',
                padding: 0,
                zIndex: 2,
              }}
            >
              ×
            </button>

            {/* Title block */}
            <div style={{ position: 'relative' }}>
              <p
                className="font-mono uppercase"
                style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.28em',
                  color: 'rgba(60,38,14,0.6)',
                  margin: 0,
                }}
              >
                {t('music.linerHeader')}
              </p>
              <h2
                style={{
                  fontFamily: 'Space Grotesk, system-ui, sans-serif',
                  fontWeight: 700,
                  fontSize: 'clamp(1.7rem, 3.4vw, 2.4rem)',
                  lineHeight: 1.05,
                  margin: '6px 0 0 0',
                  color: '#1c1208',
                }}
              >
                {album.title}
              </h2>
            </div>

            {/* Liner notes prose — Chinese mode pulls from the per-album
                t() key; English mode falls back to the raw notes string. */}
            {album.liner?.notes && (
              <p
                style={{
                  fontSize: 'clamp(0.95rem, 1.1vw, 1.05rem)',
                  lineHeight: 1.65,
                  color: 'rgba(28,18,8,0.85)',
                  margin: 0,
                  marginTop: 22,
                  marginBottom: 26,
                  maxWidth: '60ch',
                }}
              >
                {t(`music.album.${album.id}.notes`, { defaultValue: album.liner.notes })}
              </p>
            )}

            {/* Credits grid */}
            {album.liner?.credits?.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '18px 28px',
                  borderTop: '1px solid rgba(72,46,18,0.25)',
                  paddingTop: 22,
                }}
              >
                {album.liner.credits.map(({ role, names }) => (
                  <div key={role}>
                    <p
                      className="font-mono uppercase"
                      style={{
                        fontSize: '0.62rem',
                        letterSpacing: '0.22em',
                        color: 'rgba(72,46,18,0.7)',
                        margin: 0,
                        marginBottom: 4,
                      }}
                    >
                      {t(`music.role.${role}`, { defaultValue: role })}
                    </p>
                    <p
                      style={{
                        fontSize: 'clamp(0.9rem, 1.05vw, 1rem)',
                        lineHeight: 1.45,
                        color: '#1c1208',
                        margin: 0,
                      }}
                    >
                      {[...names].sort((a, b) => lastName(a).localeCompare(lastName(b))).join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Footer hairline */}
            <div
              aria-hidden
              style={{
                marginTop: 28,
                paddingTop: 14,
                borderTop: '1px solid rgba(72,46,18,0.2)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.62rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(72,46,18,0.5)',
                display: 'flex',
                justifyContent: 'space-between',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <span>{album.year}</span>
              <span>{t('nav.brand')} · jameswangjiayi@gmail.com</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

export default SleeveBack;
