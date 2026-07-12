import { randomBytes } from 'node:crypto';
import { defineEventHandler } from 'h3';
import type { Horse } from '../../../shared/types';
import { horseBody } from '../../utils/schemas';
import { readValidatedBodyZ } from '../../utils/body';
import { getDataContext, requireUserKey } from '../../utils/datasource';
import { mirrorUserDoc } from '../../utils/ttstore';

/** POST /api/horses — add a horse to the caller's herd. */
export default defineEventHandler(async (event): Promise<Horse> => {
  const body = await readValidatedBodyZ(event, horseBody);
  const ctx = await getDataContext(event);
  const userKey = requireUserKey(ctx);
  const count = await ctx.db.collection('horses').countDocuments({ user: userKey });
  const horse: Horse = { id: 'h_' + randomBytes(6).toString('hex'), ...body };
  await ctx.db.collection('horses').insertOne({
    _id: `${userKey}:${horse.id}`,
    user: userKey,
    order: 100 + count,
    ...horse,
  } as never);
  await mirrorUserDoc(ctx, 'horses', `${userKey}:${horse.id}`);
  return horse;
});
