import { defineEventHandler } from 'h3';
import { feedPostBody } from '../../../utils/schemas';
import { readValidatedBodyZ } from '../../../utils/body';
import { getDataContext, requireUserKey } from '../../../utils/datasource';
import { getProfile } from '../../../utils/userdocs';

export default defineEventHandler(async (event) => {
  const { text, ex, ride } = await readValidatedBodyZ(event, feedPostBody);
  const ctx = await getDataContext(event);
  const userKey = requireUserKey(ctx);
  const profile = await getProfile(ctx.db, userKey, ctx.user?.name);
  const name = (profile.name || 'You').trim();
  const at = Date.now();
  const post = {
    id: 'u' + at + '-' + userKey,
    who: name,
    initials: name.slice(0, 2).toUpperCase(),
    time: 'Now',
    text,
    ...(ex ? { ex } : {}),
    ...(ride ? { ride } : {}),
    likes: 0,
    comments: [],
    userGenerated: true as const,
    user: userKey,
    at,
  };
  await ctx.db.collection('user_posts').insertOne({ _id: post.id, ...post } as never);
  return { ok: true, post };
});
