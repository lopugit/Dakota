import React from 'react';

export function Toast({ tone = 'neutral', title, description, onDismiss, className = '', style }) {
  const cls = [
    'mb-toast',
    tone !== 'neutral' && `mb-toast--${tone}`,
    className,
  ].filter(Boolean).join(' ');
  return (
    <div className={cls} style={style} role="status">
      <span className="mb-toast__dot" />
      <div>
        {title && <div className="mb-toast__title">{title}</div>}
        {description && <div className="mb-toast__desc">{description}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="mb-icon-btn mb-icon-btn--sm mb-toast__close"
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          ×
        </button>
      )}
    </div>
  );
}
