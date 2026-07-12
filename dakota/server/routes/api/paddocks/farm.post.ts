import { defineEventHandler } from 'h3';
import type { Farm } from '../../../../shared/types';
import { starterFarm } from '../../../../shared/data/demo';
import { farmCreateBody } from '../../../utils/schemas';
import { readValidatedBodyZ } from '../../../utils/body';
import { getDataContext, requireUserKey } from '../../../utils/datasource';
import { loadFarms, saveFarms } from '../../../utils/farms';

/** POST /api/paddocks/farm — add a farm with the starter layout, returning it. */
export default defineEventHandler(async (event): Promise<Farm> => {
  const { n } = await readValidatedBodyZ(event, farmCreateBody);
  const ctx = await getDataContext(event);
  const userKey = requireUserKey(ctx);

  const state = await loadFarms(ctx, userKey);
  const id = `f_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
  const farm = starterFarm(id, n);
  state.farms.push(farm);
  await saveFarms(ctx, userKey, state);
  return farm;
});
