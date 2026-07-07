import { createError, defineEventHandler } from 'h3';
import { dataSourceBody } from '../../../utils/schemas';
import { readValidatedBodyZ } from '../../../utils/body';
import { getDb } from '../../../utils/mongo';
import { getAuthUserDoc } from '../../../utils/auth';

/** Flip the account between the shared example data and its own practice (UGC db). */
export default defineEventHandler(async (event) => {
  const { dataSource } = await readValidatedBodyZ(event, dataSourceBody);
  const user = await getAuthUserDoc(event);
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Sign in first' });
  const db = await getDb();
  await db.collection('users').updateOne({ _id: user._id } as never, { $set: { dataSource } });
  return { ok: true, dataSource };
});
