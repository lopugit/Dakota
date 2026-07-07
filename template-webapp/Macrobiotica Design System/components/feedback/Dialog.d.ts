import * as React from 'react';

/**
 * Modal dialog: blurred scrim, rising card, display-serif title.
 * Closes on Escape and scrim click.
 */
export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Action row, right-aligned. */
  footer?: React.ReactNode;
  /** Max width in px. Default 420. */
  width?: number;
}

export declare function Dialog(props: DialogProps): JSX.Element | null;
