import type { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  raised?: boolean;
  flat?: boolean;
}

/** Surface card: 1px subtle border, radius 14, low shadow. */
export function Card({ raised = false, flat = false, className = '', ...rest }: CardProps) {
  const cls = ['dk-card', raised && 'dk-card--raised', flat && 'dk-card--flat', className]
    .filter(Boolean)
    .join(' ');
  return <div className={cls} {...rest} />;
}
