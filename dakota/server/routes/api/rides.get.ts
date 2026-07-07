import { defineEventHandler } from 'h3';
import type { Ride } from '../../../shared/types';
import { getDataContext } from '../../utils/datasource';

const strip = (doc: unknown): Ride => {
  const { _id, user, ...rest } = doc as Record<string, unknown>;
  void _id;
  void user;
  return rest as unknown as Ride;
};

/** GET /api/rides — the caller's rides, newest first (points included). */
export default defineEventHandler(async (event): Promise<Ride[]> => {
  const ctx = await getDataContext(event);
  if (ctx.userKey == null) return [];
  const docs = await ctx.db
    .collection('rides')
    .find({ user: ctx.userKey }, { sort: { startedAt: -1 } })
    .toArray();
  return docs.map(strip);
});
