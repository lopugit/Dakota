import type { CSSProperties } from 'react';

export interface BalanceMeterProps {
  /** −1 (flat) … +1 (hot/tense) */
  value?: number;
  label?: string;
  showLabels?: boolean;
  size?: 'md' | 'sm';
  className?: string;
  style?: CSSProperties;
}

/**
 * The signature energy-scale visualization: spectrum track with an
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
  const cls = ['dk-balance', size === 'sm' && 'dk-balance--sm', className]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} style={style}>
      <div className="dk-balance__track">
        <div className="dk-balance__marker" style={{ left: pct + '%' }} />
      </div>
      {showLabels && (
        <div className="dk-balance__labels">
          <span>Flat</span>
          {label && <span className="dk-balance__note">{label}</span>}
          <span>Hot</span>
        </div>
      )}
    </div>
  );
}
