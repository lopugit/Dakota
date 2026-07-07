import { defineEventHandler } from 'h3';
import type { FeedPost, Post, PostComment, UserPost } from '../../../shared/types';
import { getDataContext } from '../../utils/datasource';
import { getProfile } from '../../utils/userdocs';

const groupComments = (rows: unknown[]): Map<string, PostComment[]> => {
  const byPost = new Map<string, PostComment[]>();
  for (const c of rows) {
    const doc = c as { postId: string; who: string; t: string };
    const list = byPost.get(doc.postId) ?? [];
    list.push({ who: doc.who, t: doc.t });
    byPost.set(doc.postId, list);
  }
  return byPost;
};

const stripPost = (raw: unknown): Post => {
  const { _id, order, at, user, userGenerated, ...rest } = raw as Record<string, unknown>;
  void _id;
  void order;
  void at;
  void user;
  void userGenerated;
  return rest as unknown as Post;
};

/**
 * GET /api/feed.
 * Example data: the seeded circle posts behind the shared demo user's own
 * posts, likes kept on the demo profile — the prototype behavior exactly.
 * Own practice (UGC db): every account's real posts, newest first, with real
 * per-user likes from the `likes` collection.
 * Both modes return `likes` EXCLUDING the caller's own like — the client adds
 * `+1` when `liked`, one code path for both modes.
 */
export default defineEventHandler(async (event): Promise<FeedPost[]> => {
  const ctx = await getDataContext(event);

  if (ctx.demo && ctx.userKey != null) {
    const [seedPosts, userPosts, comments, profile] = await Promise.all([
      ctx.db.collection('posts').find({}, { sort: { order: 1 } }).toArray(),
      ctx.db.collection('user_posts').find({}, { sort: { at: -1 } }).toArray(),
      ctx.db.collection('comments').find({}, { sort: { at: 1 } }).toArray(),
      getProfile(ctx.db, ctx.userKey),
    ]);
    const extra = groupComments(comments);
    return [...(userPosts as unknown as UserPost[]), ...(seedPosts as unknown as Post[])].map(
      (raw) => {
        const post = stripPost(raw);
        return {
          ...post,
          comments: [...(post.comments ?? []), ...(extra.get(post.id) ?? [])],
          liked: !!profile.likes[post.id],
        };
      },
    );
  }

  const [posts, comments, likes] = await Promise.all([
    ctx.db.collection('user_posts').find({}, { sort: { at: -1 } }).toArray(),
    ctx.db.collection('comments').find({}, { sort: { at: 1 } }).toArray(),
    ctx.db.collection('likes').find().toArray(),
  ]);
  const extra = groupComments(comments);
  const counts = new Map<string, number>();
  const mine = new Set<string>();
  for (const l of likes) {
    const doc = l as unknown as { postId: string; userId: string };
    counts.set(doc.postId, (counts.get(doc.postId) ?? 0) + 1);
    if (ctx.userKey != null && doc.userId === ctx.userKey) mine.add(doc.postId);
  }
  return (posts as unknown as UserPost[]).map((raw) => {
    const post = stripPost(raw);
    const liked = mine.has(post.id);
    return {
      ...post,
      comments: [...(post.comments ?? []), ...(extra.get(post.id) ?? [])],
      likes: (counts.get(post.id) ?? 0) - (liked ? 1 : 0),
      liked,
    };
  });
});
