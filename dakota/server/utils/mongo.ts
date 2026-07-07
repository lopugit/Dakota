import { MongoClient, type Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'dakota';

// Cache the client across serverless invocations (Vercel reuses the module
// scope between warm invocations; globalThis survives dev HMR too).
type Cache = { promise: Promise<MongoClient> | null };
const g = globalThis as typeof globalThis & { __dkMongo?: Cache };
const cache: Cache = g.__dkMongo ?? (g.__dkMongo = { promise: null });

async function getClient(): Promise<MongoClient> {
  if (!cache.promise) {
    const client = new MongoClient(uri, { maxPoolSize: 5 });
    cache.promise = client.connect().catch((err) => {
      cache.promise = null;
      throw err;
    });
  }
  return cache.promise;
}

/** Primary db: catalog + the shared example ("demo") user state + accounts/sessions. */
export async function getDb(): Promise<Db> {
  return (await getClient()).db(dbName);
}

/** Real user-generated-content db — per-account diaries, posts, comments, likes. */
export async function getUgcDb(): Promise<Db> {
  return (await getClient()).db(process.env.MONGODB_DB_UGC || 'dakota_ugc');
}

/** The shared example user — all signed-out (and "example data") state hangs off this id. */
export const DEMO_USER = 'demo';
