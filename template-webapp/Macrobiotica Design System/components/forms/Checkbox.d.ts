import * as React from 'react';

/**
 * Checkbox with label and optional description.
 */
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Smaller muted line under the label. */
  description?: string;
}

export declare function Checkbox(props: CheckboxProps): JSX.Element;
