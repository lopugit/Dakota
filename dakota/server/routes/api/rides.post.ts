import { randomBytes } from 'node:crypto';
import { defineEventHandler } from 'h3';
import type { Ride } from '../../../shared/types';
import { rideBody } from '../../utils/schemas';
import { readValidatedBodyZ } from '../../utils/body';
import { getDataContext, requireUserKey } from '../../utils/datasource';
import { mirrorUserDoc } from '../../utils/ttstore';

/** POST /api/rides — save a finished (or manually entered) ride. */
export default defineEventHandler(async (event): Promise<Ride> => {
  const body = await readValidatedBodyZ(event, rideBody);
  const ctx = await getDataContext(event);
  const userKey = requireUserKey(ctx);
  const ride: Ride = { id: 'r_' + randomBytes(6).toString('hex'), ...body };
  await ctx.db.collection('rides').insertOne({
    _id: `${userKey}:${ride.id}`,
    user: userKey,
    ...ride,
  } as never);
  await mirrorUserDoc(ctx, 'rides', `${userKey}:${ride.id}`);
  return ride;
});
