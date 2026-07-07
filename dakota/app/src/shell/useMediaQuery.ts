import { useSyncExternalStore } from 'react';

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useIsDesktop = (): boolean => useMediaQuery('(min-width: 900px)');
/** Wide enough that the content column has a real side gutter (for ambient art). */
export const useIsWide = (): boolean => useMediaQuery('(min-width: 1180px)');
