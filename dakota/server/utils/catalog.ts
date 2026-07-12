/**
 * Catalog assembly. The generic Dakota data (exercises, feeds, ailments,
 * practices, courses, articles, friends, wisdom) is owned by the Dakota
 * service account on Thingtime — `pnpm thingtime:sync` publishes it as a
 * chunked public bundle. Reads prefer that bundle (cached in module scope);
 * the seeded Mongo collections remain the assembly source and the fallback.
 */
import type { Db } from 'mongodb';
import type { Catalog } from '../../shared/types';
import { ttGetThing, ttServiceToken } from './thingtime';
import { decodeTexts, headThingId } from './ttcodec';

export const CATALOG_SCOPE = 'catalog';
export const CATALOG_COLLECTION = 'bundle';
export const CATALOG_DOC_ID = 'v1';

const strip = <T>(doc: unknown): T => {
  const { _id, order, ...rest } = doc as Record<string, unknown>;
  void _id;
  void order;
  return rest as T;
};

export async function assembleCatalogFromMongo(db: Db): Promise<Catalog> {
  const bySeedOrder = { sort: { order: 1 } } as const;
  const [exercises, feeds, ailments, practices, courses, articles, friends, wisdom] =
    await Promise.all([
      db.collection('exercises').find({}, bySeedOrder).toArray(),
      db.collection('feeds').find({}, bySeedOrder).toArray(),
      db.collection('ailments').find({}, bySeedOrder).toArray(),
      db.collection('practices').find({}, bySeedOrder).toArray(),
      db.collection('courses').find({}, bySeedOrder).toArray(),
      db.collection('articles').find().toArray(),
      db.collection('friends').find({}, bySeedOrder).toArray(),
      db.collection('wisdom').find().toArray(),
    ]);

  const wisdomByKey = Object.fromEntries(
    wisdom.map((w) => {
      const doc = w as unknown as { _id: string; data: unknown };
      return [doc._id, doc.data];
    }),
  ) as Record<string, unknown>;

  return {
    disciplines: (wisdomByKey.disciplines as Catalog['disciplines']) ?? [],
    levels: (wisdomByKey.levels as Catalog['levels']) ?? [],
    feedCats: (wisdomByKey.feedCats as Catalog['feedCats']) ?? [],
    ailmentSystems: (wisdomByKey.ailmentSystems as Catalog['ailmentSystems']) ?? [],
    breeds: (wisdomByKey.breeds as Catalog['breeds']) ?? [],
    gaits: (wisdomByKey.gaits as Catalog['gaits']) ?? [],
    markings: (wisdomByKey.markings as Catalog['markings']) ?? [],
    ages: (wisdomByKey.ages as Catalog['ages']) ?? [],
    signals: (wisdomByKey.signals as Catalog['signals']) ?? [],
    glossary: (wisdomByKey.glossary as Catalog['glossary']) ?? [],
    condition: (wisdomByKey.condition as Catalog['condition']) ?? [],
    exercises: exercises.map((d) => strip<Catalog['exercises'][number]>(d)),
    feeds: feeds.map((d) => strip<Catalog['feeds'][number]>(d)),
    ailments: ailments.map((d) => strip<Catalog['ailments'][number]>(d)),
    practices: practices.map((d) => strip<Catalog['practices'][number]>(d)),
    courses: courses.map((d) => strip<Catalog['courses'][number]>(d)),
    articles: Object.fromEntries(
      articles.map((a) => {
        const doc = a as unknown as { _id: string; blocks: unknown };
        return [doc._id, doc.blocks];
      }),
    ) as Catalog['articles'],
    friends: friends.map((d) => strip<Catalog['friends'][number]>(d)),
  };
}

// Module-scope cache — one bundle fetch per warm process per TTL window.
const TTL_HIT = 5 * 60_000;
const TTL_MISS = 60_000;
type CatalogCache = { value: Catalog | null; at: number };
const g = globalThis as typeof globalThis & { __dkTtCatalog?: CatalogCache };

/** The published catalog bundle from Thingtime, or null when unavailable. */
export async function getThingtimeCatalog(): Promise<Catalog | null> {
  const cache = g.__dkTtCatalog;
  const now = Date.now();
  if (cache && now - cache.at < (cache.value ? TTL_HIT : TTL_MISS)) return cache.value;

  const value = await fetchCatalogBundle().catch((err) => {
    console.warn('[thingtime] catalog fetch failed (falling back to Mongo):', err);
    return null;
  });
  g.__dkTtCatalog = { value, at: now };
  return value;
}

async function fetchCatalogBundle(): Promise<Catalog | null> {
  // The bundle is public (acl tt:all); the service token just keeps reads
  // attributed when present.
  const token = ttServiceToken();
  const headId = headThingId(CATALOG_SCOPE, CATALOG_COLLECTION, CATALOG_DOC_ID);
  const head = await ttGetThing(token, headId);
  const headText = (head?.crystal as { text?: unknown } | undefined)?.text;
  if (typeof headText !== 'string') return null;

  let of = 1;
  try {
    of = Math.max(1, Number((JSON.parse(headText) as { of?: number }).of) || 1);
  } catch {
    return null;
  }

  const parts = await Promise.all(
    Array.from({ length: of - 1 }, (_, i) => ttGetThing(token, `${headId}:p${i + 2}`)),
  );
  const texts = [headText];
  for (const part of parts) {
    const text = (part?.crystal as { text?: unknown } | undefined)?.text;
    if (typeof text !== 'string') return null;
    texts.push(text);
  }

  const [doc] = decodeTexts(texts);
  const catalog = doc?.value as Catalog | undefined;
  // Sanity: a bundle without exercises is not a catalog.
  if (!catalog || !Array.isArray(catalog.exercises) || catalog.exercises.length === 0) return null;
  return catalog;
}
