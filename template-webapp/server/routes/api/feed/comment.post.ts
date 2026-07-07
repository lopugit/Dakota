import { defineEventHandler } from 'h3';
import { feedCommentBody } from '../../../utils/schemas';
import { readValidatedBodyZ } from '../../../utils/body';
import { getDataContext, requireUserKey } from '../../../utils/datasource';
import { getProfile } from '../../../utils/userdocs';

export default defineEventHandler(async (event) => {
  const { postId, t } = await readValidatedBodyZ(event, feedCommentBody);
  const ctx = await getDataContext(event);
  const userKey = requireUserKey(ctx);
  const profile = await getProfile(ctx.db, userKey, ctx.user?.name);
  const who = (profile.name || 'You').trim();
  const at = Date.now();
  await ctx.db.collection('comments').insertOne({ postId, who, userId: userKey, t, at } as never);
  return { ok: true, comment: { who, t } };
});
