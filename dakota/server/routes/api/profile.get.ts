import { defineEventHandler } from 'h3';
import type { Profile } from '../../../shared/types';
import { getDataContext } from '../../utils/datasource';
import { DEFAULT_PROFILE, getProfile } from '../../utils/userdocs';

export default defineEventHandler(async (event): Promise<Profile> => {
  const ctx = await getDataContext(event);
  if (ctx.userKey == null) return { ...DEFAULT_PROFILE };
  return getProfile(ctx.db, ctx.userKey, ctx.user?.name);
});
