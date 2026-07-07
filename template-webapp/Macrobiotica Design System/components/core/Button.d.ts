import * as React from 'react';

/**
 * Pill-shaped action button. Primary is a quiet neutral fill with a dim spectrum ring & glow.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual emphasis. Default 'primary'. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Control height: sm 32 / md 40 / lg 48px. Default 'md'. */
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export declare function Button(props: ButtonProps): JSX.Element;
