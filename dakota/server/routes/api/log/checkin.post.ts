import { defineEventHandler } from 'h3';
import { checkinBody } from '../../../utils/schemas';
import { readValidatedBodyZ } from '../../../utils/body';
import { getDataContext, requireUserKey } from '../../../utils/datasource';
import { dayId, pushToDay } from '../../../utils/userdocs';
import { mirrorUserDoc } from '../../../utils/ttstore';

export default defineEventHandler(async (event) => {
  const { date, horse, t, v, note } = await readValidatedBodyZ(event, checkinBody);
  const ctx = await getDataContext(event);
  const userKey = requireUserKey(ctx);
  await pushToDay(ctx.db, userKey, date, 'checkins', { horse, t, v, note });
  await mirrorUserDoc(ctx, 'log', dayId(userKey, date));
  return { ok: true };
});
