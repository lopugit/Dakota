import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Icon, IconButton, ThemeToggle } from '@/components';
import { MORE_IDS, byId } from './nav';

/**
 * Bottom sheet for the More tab — dialog semantics, focus trap, Esc to close.
 * Scrim: 45% ink + 3px blur; sheet rises 200ms.
 */
export function MoreSheet({
  activeTab,
  onClose,
}: {
  activeTab: string;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !sheetRef.current) return;
      const focusables = sheetRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 90,
          background: 'rgb(31 33 29 / 0.45)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          animation: 'mbFadeIn var(--duration-base) var(--ease-out)',
        }}
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="More"
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 91,
          maxWidth: 680,
          margin: '0 auto',
          background: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderBottom: 'none',
          borderRadius: '20px 20px 0 0',
          boxShadow: 'var(--shadow-lg)',
          padding: '18px 18px calc(18px + env(safe-area-inset-bottom))',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          animation: 'mbSheetIn var(--duration-base) var(--ease-out)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="mb-wordmark" style={{ fontSize: 18 }}>
            More
          </span>
          <IconButton ref={closeRef} aria-label="Close" onClick={onClose}>
            <Icon name="x" size={18} />
          </IconButton>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {MORE_IDS.map((id) => {
            const d = byId[id];
            const active = id === activeTab;
            return (
              <button
                key={id}
                type="button"
                className="mb-hoverable"
                onClick={() => {
                  onClose();
                  navigate(d.path);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 6px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 14,
                  background: active ? 'var(--surface-sunken)' : 'transparent',
                  color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontFamily: 'inherit',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                <Icon name={d.icon} size={20} />
                <span>{d.label}</span>
              </button>
            );
          })}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 6px 0',
          }}
        >
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}
