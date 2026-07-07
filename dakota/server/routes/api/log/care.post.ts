import { defineEventHandler } from 'h3';
import { logCareBody } from '../../../utils/schemas';
import { readValidatedBodyZ } from '../../../utils/body';
import { getDataContext, requireUserKey } from '../../../utils/datasource';
import { pushToDay } from '../../../utils/userdocs';

export default defineEventHandler(async (event) => {
  const { date, horse, type, t, note } = await readValidatedBodyZ(event, logCareBody);
  const ctx = await getDataContext(event);
  await pushToDay(ctx.db, requireUserKey(ctx), date, 'care', { horse, type, t, note });
  return { ok: true };
});
