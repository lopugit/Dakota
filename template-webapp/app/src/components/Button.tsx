import type { ComponentProps } from 'react';

export interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

/** Pill button. Primary is the quiet fill + spectrum ring/glow — never a solid color. */
export function Button({ variant = 'secondary', size = 'md', className = '', type = 'button', ...rest }: ButtonProps) {
  const cls = [
    'mb-btn',
    `mb-btn--${variant}`,
    size !== 'md' && `mb-btn--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return <button type={type} className={cls} {...rest} />;
}
