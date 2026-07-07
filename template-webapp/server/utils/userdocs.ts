import type { Db } from 'mongodb';
import type { DayLog, Profile } from '../../shared/types';

export const DEFAULT_PROFILE: Profile = {
  name: '',
  birthYear: '1992',
  settings: { reminders: true, publicProfile: false },
  lessonsDone: {},
  likes: {},
};

/**
 * Per-user profile in the given data db. `fallbackName` (the account's display
 * name) seeds fresh profiles so posts/comments are attributed sensibly.
 */
export async function getProfile(db: Db, userKey: string, fallbackName = ''): Promise<Profile> {
  const doc = await db.collection('profile').findOne({ _id: userKey } as never);
  if (!doc) return { ...DEFAULT_PROFILE, name: fallbackName };
  const { _id, ...rest } = doc as Record<string, unknown>;
  return { ...DEFAULT_PROFILE, name: fallbackName, ...(rest as Partial<Profile>) };
}

export const EMPTY_DAY: DayLog = { meals: [], checkins: [], practices: [] };

export const dayId = (userKey: string, date: string): string => `${userKey}:${date}`;

/**
 * Append an entry to a day's log doc (creates the day if missing).
 * Practices use set semantics — marking one done twice keeps a single entry,
 * matching the prototype's merge with `new Set(...)`.
 */
export async function pushToDay(
  db: Db,
  userKey: string,
  date: string,
  field: 'meals' | 'checkins' | 'practices',
  entry: unknown,
): Promise<void> {
  const op = field === 'practices' ? '$addToSet' : '$push';
  const empties: Record<string, DayLog[keyof DayLog]> = { meals: [], checkins: [], practices: [] };
  delete empties[field];
  await db.collection('log').updateOne(
    { _id: dayId(userKey, date) } as never,
    {
      [op]: { [field]: entry },
      $setOnInsert: { user: userKey, date, ...empties },
    } as never,
    { upsert: true },
  );
}

/** Upsert a dotted-path $set into the user's profile doc, seeding defaults on insert. */
export async function patchProfile(
  db: Db,
  userKey: string,
  $set: Record<string, unknown>,
): Promise<void> {
  const topLevel = new Set(Object.keys($set).map((k) => k.split('.')[0]));
  await db.collection('profile').updateOne(
    { _id: userKey } as never,
    {
      $set,
      $setOnInsert: Object.fromEntries(
        Object.entries(DEFAULT_PROFILE).filter(([k]) => !topLevel.has(k)),
      ),
    } as never,
    { upsert: true },
  );
}
