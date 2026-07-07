import { defineEventHandler } from 'h3';
import { logPracticeBody } from '../../../utils/schemas';
import { readValidatedBodyZ } from '../../../utils/body';
import { getDataContext, requireUserKey } from '../../../utils/datasource';
import { pushToDay } from '../../../utils/userdocs';

export default defineEventHandler(async (event) => {
  const { date, id } = await readValidatedBodyZ(event, logPracticeBody);
  const ctx = await getDataContext(event);
  await pushToDay(ctx.db, requireUserKey(ctx), date, 'practices', id);
  return { ok: true };
});
