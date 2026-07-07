import { createError, defineEventHandler, getRouterParam } from 'h3';
import { horsePatchBody } from '../../../utils/schemas';
import { readValidatedBodyZ } from '../../../utils/body';
import { getDataContext, requireUserKey } from '../../../utils/datasource';

/** PUT /api/horses/:id — patch top-level fields (care is replaced whole when present). */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id || id.length > 100) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid horse id' });
  }
  const patch = await readValidatedBodyZ(event, horsePatchBody);
  const ctx = await getDataContext(event);
  const userKey = requireUserKey(ctx);
  const $set = Object.fromEntries(
    Object.entries(patch).filter(([, v]) => v !== undefined),
  );
  if (Object.keys($set).length === 0) return { ok: true };
  const res = await ctx.db
    .collection('horses')
    .updateOne({ _id: `${userKey}:${id}` } as never, { $set } as never);
  if (res.matchedCount === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Unknown horse' });
  }
  return { ok: true };
});
