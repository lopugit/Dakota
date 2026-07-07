import * as React from 'react';

/**
 * Quiet confirmation card with a tone dot. Position it yourself (usually fixed bottom-center).
 */
export interface ToastProps {
  /** Dot color. Default 'neutral'. */
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Shows a × dismiss button. */
  onDismiss?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export declare function Toast(props: ToastProps): JSX.Element;
