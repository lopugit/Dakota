import { defineEventHandler } from 'h3';
import { logSessionBody } from '../../../utils/schemas';
import { readValidatedBodyZ } from '../../../utils/body';
import { getDataContext, requireUserKey } from '../../../utils/datasource';
import { dayId, pushToDay } from '../../../utils/userdocs';
import { mirrorUserDoc } from '../../../utils/ttstore';

export default defineEventHandler(async (event) => {
  const { date, ex, horse, t, mins, score, note } = await readValidatedBodyZ(
    event,
    logSessionBody,
  );
  const ctx = await getDataContext(event);
  const userKey = requireUserKey(ctx);
  await pushToDay(ctx.db, userKey, date, 'sessions', {
    ex, horse, t, mins, score, note,
  });
  await mirrorUserDoc(ctx, 'log', dayId(userKey, date));
  return { ok: true };
});
