import { useCallback, useState } from 'react';

// Session-lifetime screen state (search text, filter chips, wisdom sub-tab …)
// so back-navigation returns to the list exactly as it was left.
const store = new Map<string, unknown>();

export function useSticky<T>(key: string, initial: T): [T, (next: T) => void] {
  const [value, setValue] = useState<T>(() =>
    store.has(key) ? (store.get(key) as T) : initial,
  );
  const set = useCallback(
    (next: T) => {
      store.set(key, next);
      setValue(next);
    },
    [key],
  );
  return [value, set];
}
