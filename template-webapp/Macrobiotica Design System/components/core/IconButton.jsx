import React from 'react';

export function IconButton({ variant = 'ghost', size = 'md', className = '', type = 'button', children, ...rest }) {
  const cls = [
    'mb-icon-btn',
    variant !== 'ghost' && `mb-icon-btn--${variant}`,
    size !== 'md' && `mb-icon-btn--${size}`,
    className,
  ].filter(Boolean).join(' ');
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}
