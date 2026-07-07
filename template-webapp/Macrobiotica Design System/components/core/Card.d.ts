import * as React from 'react';

/**
 * Surface container: card background, hairline border, soft radius, low shadow.
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Slightly stronger shadow for overlays/featured content. */
  raised?: boolean;
  /** No shadow — for nesting inside other cards. */
  flat?: boolean;
  /** CSS padding, number = px. Default 20. */
  padding?: number | string;
  children?: React.ReactNode;
}

export declare function Card(props: CardProps): JSX.Element;
