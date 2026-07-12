import { defineEventHandler } from 'h3';
import { farmDeleteBody } from '../../../utils/schemas';
import { readValidatedBodyZ } from '../../../utils/body';
import { getDataContext, requireUserKey } from '../../../utils/datasource';
import { loadFarms, saveFarms } from '../../../utils/farms';

/** DELETE /api/paddocks/farm — remove a farm and everything painted on it. */
export default defineEventHandler(async (event) => {
  const { id } = await readValidatedBodyZ(event, farmDeleteBody);
  const ctx = await getDataContext(event);
  const userKey = requireUserKey(ctx);

  const state = await loadFarms(ctx, userKey);
  state.farms = state.farms.filter((f) => f.id !== id);
  await saveFarms(ctx, userKey, state);
  return { ok: true };
});
