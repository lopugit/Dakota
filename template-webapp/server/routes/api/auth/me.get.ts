import { defineEventHandler } from 'h3';
import type { AuthUser } from '../../../../shared/types';
import { getAuthUserDoc, toAuthUser } from '../../../utils/auth';

export default defineEventHandler(async (event): Promise<{ user: AuthUser | null }> => {
  const doc = await getAuthUserDoc(event);
  return { user: doc ? toAuthUser(doc) : null };
});
