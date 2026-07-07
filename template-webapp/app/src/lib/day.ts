// Client-side day helpers built on the shared derive module.
import { useMemo } from 'react';
import type { Catalog, DayLog, Meal, UserLog } from '@shared/types';
import { dateKey } from '@shared/mb-data';
import { EMPTY_DAY, dayAvg } from '@shared/derive';
import { useCatalog, useLog } from './queries';

export { dateKey };

export const todayKey = (): string => dateKey(new Date());

export function getDay(log: UserLog | undefined, key: string): DayLog {
  return log?.[key] ?? EMPTY_DAY;
}

export function useMealById(): (id: string) => Meal | undefined {
  const { data: catalog } = useCatalog();
  return useMemo(() => {
    const byId = new Map((catalog?.meals ?? []).map((m) => [m.id, m]));
    return (id: string) => byId.get(id);
  }, [catalog]);
}

/** Day average for a date key, or null when nothing is logged. */
export function useDayAvg(): (key: string) => number | null {
  const { data: log } = useLog();
  const mealById = useMealById();
  return useMemo(
    () => (key: string) => dayAvg(getDay(log, key), mealById),
    [log, mealById],
  );
}

export function useCatalogData(): Catalog | undefined {
  return useCatalog().data;
}
