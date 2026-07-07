import * as React from 'react';

/**
 * Radio option with label and optional description. Group via shared `name`.
 */
export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Smaller muted line under the label. */
  description?: string;
}

export declare function Radio(props: RadioProps): JSX.Element;
