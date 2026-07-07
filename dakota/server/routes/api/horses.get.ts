import { defineEventHandler } from 'h3';
import type { Horse } from '../../../shared/types';
import { getDataContext } from '../../utils/datasource';

const strip = (doc: unknown): Horse => {
  const { _id, user, order, ...rest } = doc as Record<string, unknown>;
  void _id;
  void user;
  void order;
  return rest as unknown as Horse;
};

/** GET /api/horses — the caller's herd, seed order first. */
export default defineEventHandler(async (event): Promise<Horse[]> => {
  const ctx = await getDataContext(event);
  if (ctx.userKey == null) return [];
  const docs = await ctx.db
    .collection('horses')
    .find({ user: ctx.userKey }, { sort: { order: 1 } })
    .toArray();
  return docs.map(strip);
});
