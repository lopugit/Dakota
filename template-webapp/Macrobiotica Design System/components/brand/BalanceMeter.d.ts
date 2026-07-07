import * as React from 'react';

/**
 * The signature yin↔yang meter: a marker on the chakra spectrum.
 * −1 = most yin (violet end), +1 = most yang (red end), 0 = balanced.
 */
export interface BalanceMeterProps {
  /** −1 (yin) … +1 (yang). Default 0. */
  value?: number;
  /** Optional italic note shown between the Yin/Yang labels. */
  label?: React.ReactNode;
  /** Hide the Yin/Yang caption row. Default true. */
  showLabels?: boolean;
  /** 'sm' = 4px hairline track for inline/list use. Default 'md'. */
  size?: 'md' | 'sm';
  className?: string;
  style?: React.CSSProperties;
}

export declare function BalanceMeter(props: BalanceMeterProps): JSX.Element;
