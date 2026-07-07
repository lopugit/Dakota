import * as React from 'react';

/**
 * Square pill button that holds a single icon. Requires aria-label.
 */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual emphasis. Default 'ghost'. */
  variant?: 'ghost' | 'secondary' | 'primary';
  /** sm 30 / md 36 / lg 44px. Default 'md'. */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible name — required, the icon alone is not a label. */
  'aria-label': string;
  /** The icon, e.g. <Icon name="plus" />. */
  children?: React.ReactNode;
}

export declare function IconButton(props: IconButtonProps): JSX.Element;
