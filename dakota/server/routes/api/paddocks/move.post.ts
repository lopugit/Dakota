import { createError, defineEventHandler } from 'h3';
import { paddockMoveBody } from '../../../utils/schemas';
import { readValidatedBodyZ } from '../../../utils/body';
import { getDataContext, requireUserKey } from '../../../utils/datasource';
import { loadFarms, saveFarms } from '../../../utils/farms';
import { dateKey } from '../../../../shared/derive';

/** POST /api/paddocks/move — move a horse to a paddock on a farm, logging the rotation. */
export default defineEventHandler(async (event) => {
  const { farm: farmId, horse, to } = await readValidatedBodyZ(event, paddockMoveBody);
  const ctx = await getDataContext(event);
  const userKey = requireUserKey(ctx);

  const state = await loadFarms(ctx, userKey);
  const farm = state.farms.find((f) => f.id === farmId);
  if (!farm) throw createError({ statusCode: 400, statusMessage: 'Unknown farm' });
  if (!farm.paddocks.some((p) => p.id === to)) {
    throw createError({ statusCode: 400, statusMessage: 'Unknown paddock' });
  }

  // A horse grazes one farm at a time — pull it from wherever it was.
  const from =
    farm.horses[horse] ?? state.farms.find((f) => f.horses[horse])?.horses[horse] ?? '';
  for (const f of state.farms) delete f.horses[horse];
  farm.horses[horse] = to;
  farm.moves = [{ horse, from, to, at: dateKey(new Date()) }, ...farm.moves].slice(0, 200);

  await saveFarms(ctx, userKey, state);
  return { ok: true };
});
