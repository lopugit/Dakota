import * as React from 'react';

/**
 * Toggle switch. With a label it renders as a settings row (label left, switch right).
 */
export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Smaller muted line under the label. */
  description?: string;
}

export declare function Switch(props: SwitchProps): JSX.Element;
