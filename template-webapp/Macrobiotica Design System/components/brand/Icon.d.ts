import * as React from 'react';

/**
 * Lucide icon (loaded once from CDN). 1.75px stroke matches the brand's line weight.
 */
export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Lucide icon name in kebab-case, e.g. "book-open", "wheat", "moon". */
  name: string;
  /** Square size in px. Default 18. */
  size?: number;
  /** Default 1.75. */
  strokeWidth?: number;
  /** CSS color. Default 'currentColor'. */
  color?: string;
}

export declare function Icon(props: IconProps): JSX.Element;
