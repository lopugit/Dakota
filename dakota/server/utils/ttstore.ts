/**
 * Write-through of Dakota user state to Thingtime, and hydration back.
 *
 * Every mutation route mirrors the affected Mongo doc to Thingtime after the
 * local write: signed-in Thingtime accounts own their things (scope
 * `u:<thingtime user id>`, mirrored with their captured JWT), the shared demo
 * sandbox is owned by the Dakota service account (scope `demo`). Mirrors are
 * best-effort — a Thingtime outage never fails the user's write.
 *
 * On Thingtime login, `hydrateFromThingtime` pulls the account's things back
 * into the UGC db, so a fresh device (or a fresh database) starts in sync —
 * Thingtime is the durable copy of the yard.
 */
import type { Db } from 'mongodb';
import type { DataContext } from './datasource';
import { ttListThings, ttPutThing, ttServiceToken } from './thingtime';
import { decodeTexts, encodeDoc } from './ttcodec';

export interface TtCred {
  token: string;
  scope: string;
}

/** Which Thingtime identity owns this request's data, if any. */
export function ttCredForCtx(ctx: DataContext): TtCred | null {
  if (ctx.demo) {
    const token = ttServiceToken();
    return token ? { token, scope: 'demo' } : null;
  }
  const tt = ctx.user?.thingtime;
  return tt?.token ? { token: tt.token, scope: `u:${tt.userId}` } : null;
}

/** Collections that round-trip through Thingtime. */
const MIRRORED = new Set([
  'horses',
  'rides',
  'log',
  'paddocks',
  'profile',
  'user_posts',
  'comments',
  'likes',
]);

async function putDoc(cred: TtCred, collection: string, docId: string, value: unknown) {
  for (const chunk of encodeDoc(cred.scope, collection, docId, value)) {
    await ttPutThing(cred.token, {
      id: chunk.id,
      thingtime: ['post'],
      crystal: { type: 'text', text: chunk.text },
      acl: ['tt:user'],
      tags: ['dakota'],
    });
  }
}

/**
 * Mirror one Mongo doc (by _id) to Thingtime — call after the local write.
 * Never throws; the local db already has the truth for this session.
 */
export async function mirrorUserDoc(
  ctx: DataContext,
  collection: string,
  mongoId: string,
): Promise<void> {
  const cred = ttCredForCtx(ctx);
  if (!cred || !MIRRORED.has(collection)) return;
  try {
    const doc = await ctx.db.collection(collection).findOne({ _id: mongoId } as never);
    if (!doc) return;
    await putDoc(cred, collection, mongoId, doc);
  } catch (err) {
    console.warn(`[thingtime] mirror ${collection}/${mongoId} failed:`, err);
  }
}

/** Mirror a value that has no stable Mongo _id (the like toggle). */
export async function mirrorValue(
  ctx: DataContext,
  collection: string,
  docId: string,
  value: unknown,
): Promise<void> {
  const cred = ttCredForCtx(ctx);
  if (!cred || !MIRRORED.has(collection)) return;
  try {
    await putDoc(cred, collection, docId, value);
  } catch (err) {
    console.warn(`[thingtime] mirror ${collection}/${docId} failed:`, err);
  }
}

interface LikeMirror {
  postId: string;
  userId: string;
  liked: boolean;
  at: number;
}

/**
 * Pull every Dakota thing the account owns back into the given db.
 * Docs are stored with deterministic ids (`ttu_<thingtime id>`-scoped), so a
 * literal replace-upsert reproduces the yard on any environment.
 */
export async function hydrateFromThingtime(db: Db, cred: TtCred): Promise<number> {
  const prefix = `dakota:${cred.scope}:`;
  const texts: string[] = [];
  let cursor: string | undefined;
  // Page through the account's own things; hard cap well above any real yard.
  for (let page = 0; page < 100; page++) {
    const res = await ttListThings(cred.token, { thingtime: 'post', limit: 100, cursor });
    for (const thing of res.things) {
      const text = (thing.crystal as { text?: unknown } | undefined)?.text;
      if (thing.id?.startsWith(prefix) && typeof text === 'string') texts.push(text);
    }
    if (!res.nextCursor) break;
    cursor = res.nextCursor;
  }

  let applied = 0;
  for (const { col, value } of decodeTexts(texts)) {
    if (!MIRRORED.has(col)) continue;
    if (col === 'likes') {
      const like = value as LikeMirror;
      if (!like?.postId || !like.userId) continue;
      if (like.liked) {
        await db
          .collection('likes')
          .updateOne(
            { postId: like.postId, userId: like.userId },
            { $set: { postId: like.postId, userId: like.userId, at: like.at ?? 0 } },
            { upsert: true },
          );
      } else {
        await db.collection('likes').deleteMany({ postId: like.postId, userId: like.userId });
      }
      applied++;
      continue;
    }
    const doc = value as { _id?: unknown } & Record<string, unknown>;
    if (typeof doc?._id !== 'string') continue;
    const { _id, ...rest } = doc;
    await db.collection(col).replaceOne({ _id } as never, rest as never, { upsert: true });
    applied++;
  }
  return applied;
}
