import * as React from 'react';

export interface TabItem {
  id: string;
  label: React.ReactNode;
}

/**
 * Horizontal tab row with an ink underline on the active tab.
 */
export interface TabsProps {
  items: TabItem[];
  /** id of the active tab. */
  value: string;
  onChange?: (id: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export declare function Tabs(props: TabsProps): JSX.Element;
