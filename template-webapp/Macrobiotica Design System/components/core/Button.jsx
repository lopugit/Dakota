import React from 'react';

export function Button({ variant = 'primary', size = 'md', type = 'button', className = '', children, ...rest }) {
  const cls = [
    'mb-btn',
    `mb-btn--${variant}`,
    size !== 'md' && `mb-btn--${size}`,
    className,
  ].filter(Boolean).join(' ');
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}
