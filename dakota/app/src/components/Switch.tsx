import type { InputHTMLAttributes } from 'react';

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  'aria-label'?: string;
}

export function Switch({ checked, onChange, className = '', ...rest }: SwitchProps) {
  return (
    <input
      type="checkbox"
      role="switch"
      className={['dk-switch', className].filter(Boolean).join(' ')}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      {...rest}
    />
  );
}
