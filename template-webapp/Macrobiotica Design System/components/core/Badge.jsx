import React from 'react';

export function Badge({ tone = 'neutral', dot = false, className = '', children, ...rest }) {
  const cls = [
    'mb-badge',
    tone !== 'neutral' && `mb-badge--${tone}`,
    className,
  ].filter(Boolean).join(' ');
  return (
    <span className={cls} {...rest}>
      {dot && <span className="mb-badge__dot" />}
      {children}
    </span>
  );
}
