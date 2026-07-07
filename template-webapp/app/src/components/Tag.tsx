import type { ComponentProps } from 'react';

export interface TagProps extends ComponentProps<'button'> {
  active?: boolean;
}

/** Filter chip — active inverts to ink. */
export function Tag({ active = false, className = '', type = 'button', ...rest }: TagProps) {
  const cls = ['mb-tag', active && 'mb-tag--active', className].filter(Boolean).join(' ');
  return <button type={type} className={cls} aria-pressed={active} {...rest} />;
}
