import { createError, defineEventHandler } from 'h3';
import { logMealBody } from '../../../utils/schemas';
import { readValidatedBodyZ } from '../../../utils/body';
import { getDb } from '../../../utils/mongo';
import { getDataContext, requireUserKey } from '../../../utils/datasource';
import { pushToDay } from '../../../utils/userdocs';

export default defineEventHandler(async (event) => {
  const { date, id, t } = await readValidatedBodyZ(event, logMealBody);
  const ctx = await getDataContext(event);
  const userKey = requireUserKey(ctx);
  // Catalog is always in the primary db, whichever data source is active.
  const meal = await (await getDb()).collection('meals').findOne({ _id: id } as never);
  if (!meal) throw createError({ statusCode: 404, statusMessage: 'Unknown meal' });
  await pushToDay(ctx.db, userKey, date, 'meals', { id, t });
  return { ok: true };
});
