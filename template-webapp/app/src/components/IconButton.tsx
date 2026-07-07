import type { ComponentProps } from 'react';

export interface IconButtonProps extends ComponentProps<'button'> {
  variant?: 'default' | 'secondary' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  'aria-label': string;
}

/** 36px round icon button. */
export function IconButton({ variant = 'default', size = 'md', className = '', type = 'button', ...rest }: IconButtonProps) {
  const cls = [
    'mb-icon-btn',
    variant !== 'default' && `mb-icon-btn--${variant}`,
    size !== 'md' && `mb-icon-btn--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return <button type={type} className={cls} {...rest} />;
}
