// Client-side day/lookup helpers built on the shared derive module.
import { useMemo } from 'react';
import type { DayLog, Exercise, Horse, UserLog } from '@shared/types';
import { EMPTY_DAY, dateKey, dayAvg } from '@shared/derive';
import { useCatalog, useHorses, useLog } from './queries';

export { dateKey };

export const todayKey = (): string => dateKey(new Date());

export function getDay(log: UserLog | undefined, key: string): DayLog {
  return log?.[key] ?? EMPTY_DAY;
}

export function useExerciseById(): (id: string) => Exercise | undefined {
  const { data: catalog } = useCatalog();
  return useMemo(() => {
    const byId = new Map((catalog?.exercises ?? []).map((e) => [e.id, e]));
    return (id: string) => byId.get(id);
  }, [catalog]);
}

export function useHorseById(): (id: string) => Horse | undefined {
  const { data: horses } = useHorses();
  return useMemo(() => {
    const byId = new Map((horses ?? []).map((h) => [h.id, h]));
    return (id: string) => byId.get(id);
  }, [horses]);
}

/** Day energy average for a date key, or null when nothing is logged. */
export function useDayAvg(): (key: string) => number | null {
  const { data: log } = useLog();
  return useMemo(() => (key: string) => dayAvg(getDay(log, key)), [log]);
}
