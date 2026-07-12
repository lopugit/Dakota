import { createError, defineEventHandler } from 'h3';
import type { Paddocks } from '../../../../shared/types';
import { DEFAULT_PADDOCKS } from '../../../../shared/data/demo';
import { paddockMoveBody } from '../../../utils/schemas';
import { readValidatedBodyZ } from '../../../utils/body';
import { getDataContext, requireUserKey } from '../../../utils/datasource';
import { dateKey } from '../../../../shared/derive';
import { mirrorUserDoc } from '../../../utils/ttstore';

/** POST /api/paddocks/move — move a horse to another paddock, logging the rotation. */
export default defineEventHandler(async (event) => {
  const { horse, to } = await readValidatedBodyZ(event, paddockMoveBody);
  const ctx = await getDataContext(event);
  const userKey = requireUserKey(ctx);

  const doc = await ctx.db.collection('paddocks').findOne({ _id: userKey } as never);
  const state: Paddocks = doc
    ? (({ _id, ...rest }) => rest as unknown as Paddocks)(doc as Record<string, unknown>)
    : { ...DEFAULT_PADDOCKS };

  if (!state.paddocks.some((p) => p.id === to)) {
    throw createError({ statusCode: 400, statusMessage: 'Unknown paddock' });
  }
  const from = state.horses[horse] ?? '';
  const next: Paddocks = {
    ...state,
    horses: { ...state.horses, [horse]: to },
    moves: [{ horse, from, to, at: dateKey(new Date()) }, ...state.moves].slice(0, 200),
  };
  await ctx.db
    .collection('paddocks')
    .updateOne({ _id: userKey } as never, { $set: next } as never, { upsert: true });
  await mirrorUserDoc(ctx, 'paddocks', userKey);
  return { ok: true };
});
