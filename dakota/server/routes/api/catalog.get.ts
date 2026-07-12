import { defineEventHandler } from 'h3';
import type { Catalog } from '../../../shared/types';
import { getDb } from '../../utils/mongo';
import { assembleCatalogFromMongo, getThingtimeCatalog } from '../../utils/catalog';

/** GET /api/catalog — the Thingtime-published bundle, seeded Mongo as fallback. */
export default defineEventHandler(async (): Promise<Catalog> => {
  const fromThingtime = await getThingtimeCatalog();
  if (fromThingtime) return fromThingtime;
  return assembleCatalogFromMongo(await getDb());
});
