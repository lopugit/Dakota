import { defineEventHandler } from 'h3';
import type { Paddocks } from '../../../shared/types';
import { DEFAULT_PADDOCKS } from '../../../shared/data/demo';
import { getDataContext } from '../../utils/datasource';

/** GET /api/paddocks — the caller's property map; a starter layout until saved. */
export default defineEventHandler(async (event): Promise<Paddocks> => {
  const ctx = await getDataContext(event);
  if (ctx.userKey == null) return { ...DEFAULT_PADDOCKS };
  const doc = await ctx.db.collection('paddocks').findOne({ _id: ctx.userKey } as never);
  if (!doc) return { ...DEFAULT_PADDOCKS };
  const { _id, ...rest } = doc as Record<string, unknown>;
  void _id;
  return rest as unknown as Paddocks;
});
