import React from 'react';

export function Tag({ active = false, onRemove, className = '', type = 'button', children, ...rest }) {
  const cls = ['mb-tag', active && 'mb-tag--active', className].filter(Boolean).join(' ');
  return (
    <button type={type} className={cls} aria-pressed={active} {...rest}>
      {children}
      {onRemove && (
        <span
          className="mb-tag__x"
          role="button"
          aria-label="Remove"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
        >
          ×
        </span>
      )}
    </button>
  );
}
