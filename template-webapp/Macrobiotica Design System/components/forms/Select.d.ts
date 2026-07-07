import * as React from 'react';

/**
 * Styled native select with optional label, hint and error.
 */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  /** Native <option> elements. */
  children?: React.ReactNode;
}

export declare function Select(props: SelectProps): JSX.Element;
