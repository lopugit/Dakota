import { createError, defineEventHandler, getRouterParam } from 'h3';
import { getDb } from '../../../../utils/mongo';
import { getDataContext, requireUserKey } from '../../../../utils/datasource';
import { patchProfile } from '../../../../utils/userdocs';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id || id.length > 100) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid lesson id' });
  }
  const ctx = await getDataContext(event);
  const userKey = requireUserKey(ctx);
  const course = await (await getDb()).collection('courses').findOne({ 'lessons.id': id });
  if (!course) throw createError({ statusCode: 404, statusMessage: 'Unknown lesson' });
  await patchProfile(ctx.db, userKey, { [`lessonsDone.${id}`]: true });
  return { ok: true };
});
