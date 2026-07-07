import { defineEventHandler } from 'h3';
import { logSessionBody } from '../../../utils/schemas';
import { readValidatedBodyZ } from '../../../utils/body';
import { getDataContext, requireUserKey } from '../../../utils/datasource';
import { pushToDay } from '../../../utils/userdocs';

export default defineEventHandler(async (event) => {
  const { date, ex, horse, t, mins, score, note } = await readValidatedBodyZ(
    event,
    logSessionBody,
  );
  const ctx = await getDataContext(event);
  await pushToDay(ctx.db, requireUserKey(ctx), date, 'sessions', {
    ex, horse, t, mins, score, note,
  });
  return { ok: true };
});
