// Derived values — pure helpers shared by the client and the seed script.
// The energy scale keeps the same thresholds everywhere: -1 flat … +1 hot.
import type { CareType, DayLog, Exercise, Horse, HorseCare, Urgency } from './types';

export const pad2 = (x: number): string => String(x).padStart(2, '0');

export const hhmm = (d: Date): string => pad2(d.getHours()) + ':' + pad2(d.getMinutes());

export const dateKey = (d: Date): string =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

/** Signed mono format: U+2212 minus, U+00B1 at zero, always 2 decimals ("+0.30", "−0.15", "±0.00"). */
export function signed(v: number): string {
  const r = Math.round(v * 100) / 100;
  return (r > 0 ? '+' : r < 0 ? '−' : '±') + Math.abs(r).toFixed(2);
}

/** Value → scale token (dots, bars). Violet toward flat, red toward hot, green at centre. */
export function valColor(v: number): string {
  if (v <= -0.5) return 'var(--scale-flat3)';
  if (v <= -0.25) return 'var(--scale-flat2)';
  if (v < -0.05) return 'var(--scale-flat1)';
  if (v <= 0.05) return 'var(--scale-centre)';
  if (v <= 0.25) return 'var(--scale-hot1)';
  if (v <= 0.5) return 'var(--scale-hot2)';
  return 'var(--scale-hot3)';
}

/** Energy label for a single reading. */
export function valNote(v: number): string {
  if (v <= -0.6) return 'Switched off — barely answering the leg';
  if (v <= -0.3) return 'Quiet — needs plenty of leg';
  if (v <= -0.1) return 'A little flat';
  if (v < 0.1) return 'Forward and relaxed';
  if (v < 0.3) return 'Fresh — plenty of spark';
  if (v < 0.6) return 'Sharp — busy in the mouth and body';
  return 'Hot — tight, rushing, hard to settle';
}

/** Day average = mean of all check-in values + session scores. Null when empty. */
export function dayAvg(day: DayLog): number | null {
  const vals: number[] = [];
  day.checkins.forEach((c) => vals.push(c.v));
  day.sessions.forEach((s) => vals.push(s.score));
  if (!vals.length) return null;
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100;
}

/** Energy label for a whole day; beyond ±0.25 it suggests gently. */
export function dayNote(v: number): string {
  if (v > 0.25) return 'Running hot — think long-and-low work and less heating feed';
  if (v < -0.25) return 'Running flat — shorter, brighter sessions and a health check may help';
  return valNote(v);
}

export const EMPTY_DAY: DayLog = { sessions: [], checkins: [], practices: [], care: [] };

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

/** Session day streak (Profile stat), same today-optional rule. */
export function sessionStreak(
  getDay: (key: string) => DayLog,
  keyFor: (d: Date) => string,
  now: Date,
): number {
  let streak = 0;
  for (let i = 0; i < 60; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    if (getDay(keyFor(d)).sessions.length > 0) streak++;
    else if (i === 0) continue;
    else break;
  }
  return streak;
}

/** Exercises that would suit a horse trending hot → calm, flat → forward, centred → progress. Take 3. */
export function suggestedExercises(bal: number, exercises: Exercise[]): Exercise[] {
  const calm = ['long', 'stretch', 'serpentine', 'spiral', 'walk', 'pole'];
  const wake = ['transition', 'pole', 'grid', 'trot', 'canter', 'rein-back'];
  const match = (ex: Exercise, words: string[]) =>
    words.some((w) => (ex.n + ' ' + ex.desc).toLowerCase().includes(w));
  return exercises
    .filter((ex) =>
      bal > 0.1 ? match(ex, calm) : bal < -0.1 ? match(ex, wake) : ex.level !== 'Advanced',
    )
    .slice(0, 3);
}

/** Ailment urgency → badge tone. */
export function urgencyTone(urgency: Urgency): 'root' | 'sacral' | 'solar' | 'neutral' {
  if (urgency === 'vet now') return 'root';
  if (urgency === 'vet soon') return 'sacral';
  if (urgency === 'monitor') return 'solar';
  return 'neutral';
}

// ---- horses ----

export function horseAge(born: string, now: Date): number {
  return Math.max(0, now.getFullYear() - Number(born));
}

/** "15.2 hh" — hands are base-4 decimals, so keep exactly one digit. */
export function handsLabel(hands: number): string {
  return hands.toFixed(1) + ' hh';
}

export const CARE_LABELS: Record<CareType, string> = {
  farrier: 'Farrier',
  vet: 'Vet',
  worming: 'Worming',
  vaccination: 'Vaccination',
  dental: 'Dental',
  physio: 'Physio',
  other: 'Care',
};

export interface CareDue {
  type: CareType;
  label: string;
  last?: string;
  due: string; // YYYY-MM-DD
  /** Days until due; negative = overdue. */
  inDays: number;
}

const addDays = (iso: string, days: number): Date => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d + days);
};

const addMonths = (iso: string, months: number): Date => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1 + months, d);
};

const diffDays = (a: Date, b: Date): number =>
  Math.round((a.getTime() - b.getTime()) / 86400_000);

/**
 * Routine care due dates for a horse, soonest first. Items with no last-done
 * date are skipped — the horse detail screen prompts to record a first one.
 */
export function careDue(care: HorseCare, now: Date): CareDue[] {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const rows: CareDue[] = [];
  const push = (type: CareType, last: string | undefined, due: Date | null) => {
    if (!last || !due) return;
    rows.push({
      type,
      label: CARE_LABELS[type],
      last,
      due: dateKey(due),
      inDays: diffDays(due, today),
    });
  };
  push('farrier', care.lastFarrier, care.lastFarrier ? addDays(care.lastFarrier, care.farrierWeeks * 7) : null);
  push('worming', care.lastWorming, care.lastWorming ? addDays(care.lastWorming, care.wormingWeeks * 7) : null);
  push('dental', care.lastDental, care.lastDental ? addMonths(care.lastDental, care.dentalMonths) : null);
  push('vaccination', care.lastVaccination, care.lastVaccination ? addMonths(care.lastVaccination, care.vaccinationMonths) : null);
  return rows.sort((a, b) => a.inDays - b.inDays);
}

/** Care items due within the window (or overdue) across all horses — the Today banner. */
export function careDueSoon(
  horses: Horse[],
  now: Date,
  windowDays = 7,
): Array<CareDue & { horse: Horse }> {
  return horses
    .flatMap((h) => careDue(h.care, now).map((d) => ({ ...d, horse: h })))
    .filter((d) => d.inDays <= windowDays)
    .sort((a, b) => a.inDays - b.inDays);
}

/** "due in 12 days" / "due tomorrow" / "3 days overdue" / "due today". */
export function dueLabel(inDays: number): string {
  if (inDays === 0) return 'due today';
  if (inDays === 1) return 'due tomorrow';
  if (inDays > 1) return `due in ${inDays} days`;
  if (inDays === -1) return '1 day overdue';
  return `${-inDays} days overdue`;
}

// ---- rides ----

/** Great-circle distance between two points, in km. */
export function haversineKm(la1: number, ln1: number, la2: number, ln2: number): number {
  const R = 6371;
  const rad = Math.PI / 180;
  const dLa = (la2 - la1) * rad;
  const dLn = (ln2 - ln1) * rad;
  const a =
    Math.sin(dLa / 2) ** 2 +
    Math.cos(la1 * rad) * Math.cos(la2 * rad) * Math.sin(dLn / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export interface RideStats {
  km: number;
  min: number;
  avgKmh: number;
  maxKmh: number;
}

/** Distance/pace from a GPS trace. Max speed uses a 3-point window to soften jitter. */
export function rideStats(points: Array<{ la: number; ln: number; t: number }>): RideStats {
  if (points.length < 2) return { km: 0, min: 0, avgKmh: 0, maxKmh: 0 };
  let km = 0;
  let maxKmh = 0;
  for (let i = 1; i < points.length; i++) {
    const seg = haversineKm(points[i - 1].la, points[i - 1].ln, points[i].la, points[i].ln);
    km += seg;
    const j = Math.max(0, i - 3);
    const winKm = haversineKm(points[j].la, points[j].ln, points[i].la, points[i].ln);
    const winH = (points[i].t - points[j].t) / 3600;
    if (winH > 0) maxKmh = Math.max(maxKmh, winKm / winH);
  }
  const min = (points[points.length - 1].t - points[0].t) / 60;
  const h = min / 60;
  return {
    km: Math.round(km * 100) / 100,
    min: Math.round(min),
    avgKmh: h > 0 ? Math.round((km / h) * 10) / 10 : 0,
    maxKmh: Math.round(maxKmh * 10) / 10,
  };
}
