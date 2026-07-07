import type { HTMLAttributes } from 'react';

export type BadgeTone =
  | 'neutral'
  | 'green'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'root'
  | 'sacral'
  | 'solar'
  | 'heart'
  | 'throat'
  | 'third-eye'
  | 'crown';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  dot?: boolean;
}

/** Small tinted label pill. */
export function Badge({ tone = 'neutral', dot = false, className = '', children, ...rest }: BadgeProps) {
  const cls = ['dk-badge', tone !== 'neutral' && `dk-badge--${tone}`, className]
    .filter(Boolean)
    .join(' ');
  return (
    <span className={cls} {...rest}>
      {dot && <span className="dk-badge__dot" />}
      {children}
    </span>
  );
}
