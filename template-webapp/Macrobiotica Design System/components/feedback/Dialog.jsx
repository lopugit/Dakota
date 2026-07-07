import React from 'react';

export function Dialog({ open, onClose, title, children, footer, width = 420 }) {
  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape' && onClose) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="mb-dialog-overlay"
      onMouseDown={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
    >
      <div
        className="mb-dialog"
        role="dialog"
        aria-modal="true"
        style={{ width: `min(${width}px, calc(100vw - 32px))` }}
      >
        {title && <h2 className="mb-dialog__title">{title}</h2>}
        <div className="mb-dialog__body">{children}</div>
        {footer && <div className="mb-dialog__footer">{footer}</div>}
      </div>
    </div>
  );
}
