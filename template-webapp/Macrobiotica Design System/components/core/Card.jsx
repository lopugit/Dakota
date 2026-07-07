import React from 'react';

export function Card({ raised = false, flat = false, padding = 20, className = '', style, children, ...rest }) {
  const cls = [
    'mb-card',
    raised && 'mb-card--raised',
    flat && 'mb-card--flat',
    className,
  ].filter(Boolean).join(' ');
  return (
    <div className={cls} style={{ padding, ...style }} {...rest}>
      {children}
    </div>
  );
}
