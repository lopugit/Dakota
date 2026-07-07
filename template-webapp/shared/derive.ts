// Derived values — ports of the prototype's pure helpers
// (design_files/Macrobiotica App.dc.html logic block). Keep exact thresholds.
import type { DayLog, Meal } from './types';
import { valNote } from './mb-data';

export const pad2 = (x: number): string => String(x).padStart(2, '0');

export const hhmm = (d: Date): string => pad2(d.getHours()) + ':' + pad2(d.getMinutes());

/** Signed mono format: U+2212 minus, U+00B1 at zero, always 2 decimals ("+0.30", "−0.15", "±0.00"). */
export function signed(v: number): string {
  const r = Math.round(v * 100) / 100;
  return (r > 0 ? '+' : r < 0 ? '−' : '±') + Math.abs(r).toFixed(2);
}

/** Value → chakra token (dots, bars). Violet toward yin, red toward yang, green at centre. */
export function valColor(v: number): string {
  if (v <= -0.5) return 'var(--chakra-crown)';
  if (v <= -0.25) return 'var(--chakra-third-eye)';
  if (v < -0.05) return 'var(--chakra-throat)';
  if (v <= 0.05) return 'var(--chakra-heart)';
  if (v <= 0.25) return 'var(--chakra-solar)';
  if (v <= 0.5) return 'var(--chakra-sacral)';
  return 'var(--chakra-root)';
}

export { valNote };

/** Day average = mean of all check-in values + logged meals' yy. Null when empty. */
export function dayAvg(day: DayLog, mealById: (id: string) => Meal | undefined): number | null {
  const vals: number[] = [];
  day.checkins.forEach((c) => vals.push(c.v));
  day.meals.forEach((m) => {
    const meal = mealById(m.id);
    if (meal) vals.push(meal.yy);
  });
  if (!vals.length) return null;
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100;
}

/** Balance label for a whole day; beyond ±0.25 it suggests gently. */
export function dayNote(v: number): string {
  if (v > 0.25) return 'More yang than usual — lighter, fresher foods may help';
  if (v < -0.25) return 'More yin than usual — grounding, warming foods may help';
  return valNote(v);
}

export const EMPTY_DAY: DayLog = { meals: [], checkins: [], practices: [] };

/**
 * Practice streak: consecutive days containing the practice id, counting back
 * from today; today itself is optional (a missing today doesn't break it).
 */
export function practiceStreak(
  practiceId: string,
  getDay: (key: string) => DayLog,
  keyFor: (d: Date) => string,
  now: Date,
): number {
  let streak = 0;
  for (let i = 0; i < 60; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const has = getDay(keyFor(d)).practices.indexOf(practiceId) !== -1;
    if (has) streak++;
    else if (i === 0) continue;
    else break;
  }
  return streak;
}

/** Check-in day streak (Profile stat), same today-optional rule. */
export function checkinStreak(
  getDay: (key: string) => DayLog,
  keyFor: (d: Date) => string,
  now: Date,
): number {
  let streak = 0;
  for (let i = 0; i < 60; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    if (getDay(keyFor(d)).checkins.length > 0) streak++;
    else if (i === 0) continue;
    else break;
  }
  return streak;
}

/** Meals that would suit a friend this week: lean-yang → cooling, lean-yin → grounding, centred → near centre. Take 3. */
export function suggestedMeals(bal: number, meals: Meal[]): Meal[] {
  return meals
    .filter((m) => (bal > 0.1 ? m.yy < 0 : bal < -0.1 ? m.yy > 0.15 : Math.abs(m.yy) < 0.2))
    .slice(0, 3);
}

/** Ailment pattern → badge tone: yin-only → crown (violet), yang-only → root (red), mixed → neutral. */
export function patternTone(pattern: string): 'crown' | 'root' | 'neutral' {
  const p = pattern.toLowerCase();
  if (p.includes('yin') && !p.includes('yang')) return 'crown';
  if (p.includes('yang') && !p.includes('yin')) return 'root';
  return 'neutral';
}
