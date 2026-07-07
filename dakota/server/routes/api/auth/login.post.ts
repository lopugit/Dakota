import { createError, defineEventHandler } from 'h3';
import { loginBody } from '../../../utils/schemas';
import { readValidatedBodyZ } from '../../../utils/body';
import { getDb } from '../../../utils/mongo';
import { startSession, toAuthUser, verifyPassword, type UserDoc } from '../../../utils/auth';

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBodyZ(event, loginBody);
  const db = await getDb();
  const user = (await db.collection('users').findOne({ email })) as UserDoc | null;
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' });
  }
  await startSession(event, user._id);
  return { user: toAuthUser(user) };
});
