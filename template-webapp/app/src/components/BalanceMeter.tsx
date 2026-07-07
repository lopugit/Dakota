import type { CSSProperties } from 'react';

export interface BalanceMeterProps {
  /** −1 (most yin) … +1 (most yang) */
  value?: number;
  label?: string;
  showLabels?: boolean;
  size?: 'md' | 'sm';
  className?: string;
  style?: CSSProperties;
}

/**
 * The signature yin↔yang visualization: chakra-spectrum track with an
 * ink-bordered marker at (value+1)/2 that glides 320ms ease-out.
 */
export function BalanceMeter({
  value = 0,
  label,
  showLabels = true,
  size = 'md',
  className = '',
  style,
}: BalanceMeterProps) {
  const clamped = Math.max(-1, Math.min(1, Number(value) || 0));
  const pct = ((clamped + 1) / 2) * 100;
  const cls = ['mb-balance', size === 'sm' && 'mb-balance--sm', className]
    .filter(Boolean)
    .join(' ');
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
