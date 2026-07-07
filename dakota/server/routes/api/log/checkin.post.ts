import { defineEventHandler } from 'h3';
import { checkinBody } from '../../../utils/schemas';
import { readValidatedBodyZ } from '../../../utils/body';
import { getDataContext, requireUserKey } from '../../../utils/datasource';
import { pushToDay } from '../../../utils/userdocs';

export default defineEventHandler(async (event) => {
  const { date, horse, t, v, note } = await readValidatedBodyZ(event, checkinBody);
  const ctx = await getDataContext(event);
  await pushToDay(ctx.db, requireUserKey(ctx), date, 'checkins', { horse, t, v, note });
  return { ok: true };
});
