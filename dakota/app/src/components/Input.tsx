import type { InputHTMLAttributes } from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

/** 10px-radius input, strong border; focus = green border + tint glow. */
export function Input({ className = '', ...rest }: InputProps) {
  return <input className={['dk-input', className].filter(Boolean).join(' ')} {...rest} />;
}
