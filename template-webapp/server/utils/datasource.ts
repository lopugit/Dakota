import { createError, getCookie, type H3Event } from 'h3';
import type { Db } from 'mongodb';
import { DEMO_USER, getDb, getUgcDb } from './mongo';
import { getAuthUserDoc, type UserDoc } from './auth';

/** Device-level sample-data preference for signed-out visitors (set by the client). */
export const SAMPLE_COOKIE = 'mb-sample';

/**
 * Where this request's user state lives.
 * - Signed in, own practice → per-user state in the UGC db.
 * - Sample data on (account field when signed in, mb-sample cookie when not)
 *   → the shared demo user in the primary db, writable sandbox.
 * - Signed out, sample off (the default) → the live UGC db, read-only:
 *   `userKey` is null, so reads show the real circle and writes 401.
 * The catalog always comes from the primary db regardless.
 */
export interface DataContext {
  db: Db;
  userKey: string | null;
  demo: boolean;
  user: UserDoc | null;
}

export async function getDataContext(event: H3Event): Promise<DataContext> {
  const user = await getAuthUserDoc(event);
  if (user) {
    if (user.dataSource === 'demo') {
      return { db: await getDb(), userKey: DEMO_USER, demo: true, user };
    }
    return { db: await getUgcDb(), userKey: user._id, demo: false, user };
  }
  if (getCookie(event, SAMPLE_COOKIE) === '1') {
    return { db: await getDb(), userKey: DEMO_USER, demo: true, user: null };
  }
  return { db: await getUgcDb(), userKey: null, demo: false, user: null };
}

/** For writes: the sandbox is always writable; the live db needs an account. */
export function requireUserKey(ctx: DataContext): string {
  if (ctx.userKey == null) {
    throw createError({ statusCode: 401, statusMessage: 'Sign in first' });
  }
  return ctx.userKey;
}
