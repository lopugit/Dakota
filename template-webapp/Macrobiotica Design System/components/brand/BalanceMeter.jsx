import React from 'react';

export function BalanceMeter({ value = 0, label, showLabels = true, size = 'md', className = '', style }) {
  const clamped = Math.max(-1, Math.min(1, Number(value) || 0));
  const pct = ((clamped + 1) / 2) * 100;
  const cls = [
    'mb-balance',
    size === 'sm' && 'mb-balance--sm',
    className,
  ].filter(Boolean).join(' ');
  return (
    <div className={cls} style={style}>
      <div className="mb-balance__track">
        <div className="mb-balance__marker" style={{ left: pct + '%' }} />
      </div>
      {showLabels && (
        <div className="mb-balance__labels">
          <span>Yin 陰</span>
          {label && <span className="mb-balance__note">{label}</span>}
          <span>陽 Yang</span>
        </div>
      )}
    </div>
  );
}
