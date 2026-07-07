import * as React from 'react';

/**
 * Small status pill. Tones map to the chakra spectrum and semantic colors.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Default 'neutral'. Chakra tones: root…crown. Semantic: success/warning/danger/info. */
  tone?: 'neutral' | 'green' | 'success' | 'warning' | 'danger' | 'info'
    | 'root' | 'sacral' | 'solar' | 'heart' | 'throat' | 'third-eye' | 'crown';
  /** Leading 6px dot in the tone color. */
  dot?: boolean;
  children?: React.ReactNode;
}

export declare function Badge(props: BadgeProps): JSX.Element;
