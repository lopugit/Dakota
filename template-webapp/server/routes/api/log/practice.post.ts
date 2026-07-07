import { createError, defineEventHandler } from 'h3';
import { logPracticeBody } from '../../../utils/schemas';
import { readValidatedBodyZ } from '../../../utils/body';
import { getDb } from '../../../utils/mongo';
import { getDataContext, requireUserKey } from '../../../utils/datasource';
import { pushToDay } from '../../../utils/userdocs';

export default defineEventHandler(async (event) => {
  const { date, id } = await readValidatedBodyZ(event, logPracticeBody);
  const ctx = await getDataContext(event);
  const userKey = requireUserKey(ctx);
  const practice = await (await getDb()).collection('practices').findOne({ _id: id } as never);
  if (!practice) throw createError({ statusCode: 404, statusMessage: 'Unknown practice' });
  await pushToDay(ctx.db, userKey, date, 'practices', id);
  return { ok: true };
});
