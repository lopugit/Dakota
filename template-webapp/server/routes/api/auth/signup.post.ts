import { createError, defineEventHandler } from 'h3';
import { signupBody } from '../../../utils/schemas';
import { readValidatedBodyZ } from '../../../utils/body';
import { getDb } from '../../../utils/mongo';
import { createUser, startSession, toAuthUser } from '../../../utils/auth';

export default defineEventHandler(async (event) => {
  const { email, password, name } = await readValidatedBodyZ(event, signupBody);
  const db = await getDb();
  const existing = await db.collection('users').findOne({ email });
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Account already exists' });
  }
  const user = await createUser(email, password, name);
  await startSession(event, user._id);
  return { user: toAuthUser(user) };
});
