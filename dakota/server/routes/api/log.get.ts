import { defineEventHandler, getQuery } from 'h3';
import type { UserLog, DayLog } from '../../../shared/types';
import { getDataContext } from '../../utils/datasource';

/** GET /api/log?from=YYYY-MM-DD&to=YYYY-MM-DD — day docs keyed by date. Omitted bounds return everything. */
export default defineEventHandler(async (event): Promise<UserLog> => {
  const ctx = await getDataContext(event);
  // Signed-out live browsing has no diary of its own.
  if (ctx.userKey == null) return {};
  const { from, to } = getQuery(event) as { from?: string; to?: string };
  const filter: Record<string, unknown> = { user: ctx.userKey };
  if (from || to) {
    filter.date = {
      ...(from ? { $gte: from } : {}),
      ...(to ? { $lte: to } : {}),
    };
  }
  const docs = await ctx.db.collection('log').find(filter).toArray();
  const out: UserLog = {};
  for (const doc of docs) {
    const d = doc as unknown as { date: string } & DayLog;
    out[d.date] = {
      sessions: d.sessions ?? [],
      checkins: d.checkins ?? [],
      practices: d.practices ?? [],
      care: d.care ?? [],
    };
  }
  return out;
});
