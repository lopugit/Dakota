import { defineEventHandler } from 'h3';
import type { Profile } from '../../../shared/types';
import { profilePutBody } from '../../utils/schemas';
import { readValidatedBodyZ } from '../../utils/body';
import { getDataContext, requireUserKey } from '../../utils/datasource';
import { getProfile, patchProfile } from '../../utils/userdocs';

export default defineEventHandler(async (event): Promise<Profile> => {
  const patch = await readValidatedBodyZ(event, profilePutBody);
  const ctx = await getDataContext(event);
  const userKey = requireUserKey(ctx);
  const $set: Record<string, unknown> = {};
  if (patch.name !== undefined) $set.name = patch.name;
  if (patch.yardName !== undefined) $set.yardName = patch.yardName;
  if (patch.since !== undefined) $set.since = patch.since;
  if (patch.settings !== undefined) $set.settings = patch.settings;
  if (Object.keys($set).length > 0) {
    await patchProfile(ctx.db, userKey, $set);
  }
  return getProfile(ctx.db, userKey, ctx.user?.name);
});
