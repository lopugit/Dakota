import * as React from 'react';

/**
 * Light/dark toggle — sets data-theme on <html> and persists to localStorage ('mb-theme').
 */
export interface ThemeToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** sm 30 / md 36 / lg 44px. Default 'md'. */
  size?: 'sm' | 'md' | 'lg';
}

export declare function ThemeToggle(props: ThemeToggleProps): JSX.Element;
