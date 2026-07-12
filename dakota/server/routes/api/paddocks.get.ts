import { defineEventHandler } from 'h3';
import type { Paddocks } from '../../../shared/types';
import { migratePaddocks } from '../../../shared/data/demo';
import { getDataContext } from '../../utils/datasource';
import { loadFarms } from '../../utils/farms';

/** GET /api/paddocks — every farm the caller manages; a starter layout until saved. */
export default defineEventHandler(async (event): Promise<Paddocks> => {
  const ctx = await getDataContext(event);
  if (ctx.userKey == null) return migratePaddocks(null);
  return loadFarms(ctx, ctx.userKey);
});
