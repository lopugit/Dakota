import { defineEventHandler } from 'h3';
import { farmBody } from '../../../utils/schemas';
import { readValidatedBodyZ } from '../../../utils/body';
import { getDataContext, requireUserKey } from '../../../utils/datasource';
import { loadFarms, saveFarms } from '../../../utils/farms';

/** PUT /api/paddocks/farm — replace one farm's whole layout (the painting save). */
export default defineEventHandler(async (event) => {
  const farm = await readValidatedBodyZ(event, farmBody);
  const ctx = await getDataContext(event);
  const userKey = requireUserKey(ctx);

  // Whole-farm saves still honour the invariants: residents must stand in a
  // paddock that exists here, and a horse grazes one farm at a time — a stale
  // client copy must not resurrect a horse another farm now holds.
  const valid = new Set(farm.paddocks.map((p) => p.id));
  farm.horses = Object.fromEntries(
    Object.entries(farm.horses).filter(([, pid]) => valid.has(pid)),
  );

  const state = await loadFarms(ctx, userKey);
  const i = state.farms.findIndex((f) => f.id === farm.id);
  if (i >= 0) state.farms[i] = farm;
  else state.farms.push(farm);
  for (const f of state.farms) {
    if (f.id === farm.id) continue;
    for (const horse of Object.keys(farm.horses)) delete f.horses[horse];
  }
  await saveFarms(ctx, userKey, state);
  return { ok: true };
});
