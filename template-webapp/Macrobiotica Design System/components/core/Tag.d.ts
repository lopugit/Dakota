import * as React from 'react';

/**
 * Selectable filter chip. Active state inverts to ink.
 */
export interface TagProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Selected state — inverts to ink background. */
  active?: boolean;
  /** When set, shows a small × that calls this instead of onClick. */
  onRemove?: () => void;
  children?: React.ReactNode;
}

export declare function Tag(props: TagProps): JSX.Element;
