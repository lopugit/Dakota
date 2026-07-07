import React from 'react';

export function Tooltip({ label, side = 'top', children, className = '', style }) {
  return (
    <span className={['mb-tooltip', className].filter(Boolean).join(' ')} style={style}>
      {children}
      <span
        className={'mb-tooltip__bubble' + (side === 'bottom' ? ' mb-tooltip__bubble--bottom' : '')}
        role="tooltip"
      >
        {label}
      </span>
    </span>
  );
}
