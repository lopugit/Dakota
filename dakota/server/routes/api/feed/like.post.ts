import { defineEventHandler } from 'h3';
import type { Db } from 'mongodb';
import { feedLikeBody } from '../../../utils/schemas';
import { readValidatedBodyZ } from '../../../utils/body';
import { getDataContext, requireUserKey } from '../../../utils/datasource';
import { patchProfile } from '../../../utils/userdocs';

// One like per user per post in the UGC db.
let likesIndexReady: Promise<unknown> | null = null;
function ensureLikesIndex(db: Db): Promise<unknown> {
  if (!likesIndexReady) {
    likesIndexReady = db
      .collection('likes')
      .createIndex({ postId: 1, userId: 1 }, { unique: true })
      .catch((err) => {
        likesIndexReady = null;
        throw err;
      });
  }
  return likesIndexReady;
}

export default defineEventHandler(async (event) => {
  const { postId, liked } = await readValidatedBodyZ(event, feedLikeBody);
  const ctx = await getDataContext(event);
  const userKey = requireUserKey(ctx);

  if (ctx.demo) {
    // Prototype behavior: like state lives on the demo profile doc.
    await patchProfile(ctx.db, userKey, { [`likes.${postId}`]: liked });
    return { ok: true };
  }

  await ensureLikesIndex(ctx.db);
  if (liked) {
    await ctx.db.collection('likes').updateOne(
      { postId, userId: userKey },
      { $setOnInsert: { postId, userId: userKey, at: Date.now() } },
      { upsert: true },
    );
  } else {
    await ctx.db.collection('likes').deleteOne({ postId, userId: userKey });
  }
  return { ok: true };
});
