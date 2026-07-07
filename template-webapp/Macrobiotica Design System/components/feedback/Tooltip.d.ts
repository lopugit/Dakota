import * as React from 'react';

/**
 * Ink tooltip shown on hover/focus of the wrapped element.
 */
export interface TooltipProps {
  /** Tooltip text. */
  label: React.ReactNode;
  /** Default 'top'. */
  side?: 'top' | 'bottom';
  /** The trigger element. */
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export declare function Tooltip(props: TooltipProps): JSX.Element;
