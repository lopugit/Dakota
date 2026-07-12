/**
 * Publish the generic Dakota data to Thingtime under the service account.
 *
 *   pnpm seed             # make sure local Mongo holds the canonical data
 *   pnpm thingtime:sync
 *
 * Pushes two scopes, both owned by the Dakota service account:
 * - `dakota:catalog:*` — the assembled catalog bundle, public (acl tt:all);
 *   the API serves this to every visitor (see server/utils/catalog.ts);
 * - `dakota:demo:*`    — the shared demo yard (horses, rides, paddocks,
 *   profile, diary, posts), private to the service account; runtime writes
 *   to the sandbox mirror to the same things.
 */
import './tt-env';
import { MongoClient } from 'mongodb';
import { ttPutThing, ttDeleteThing, ttServiceToken } from '../server/utils/thingtime';
import { encodeDoc, type TtChunk } from '../server/utils/ttcodec';
import {
  assembleCatalogFromMongo, CATALOG_COLLECTION, CATALOG_DOC_ID, CATALOG_SCOPE,
} from '../server/utils/catalog';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'dakota';
const DEMO_USER = 'demo';

async function putChunks(token: string, chunks: TtChunk[], acl: string[]): Promise<void> {
  for (const chunk of chunks) {
    await ttPutThing(token, {
      id: chunk.id,
      thingtime: ['post'],
      crystal: { type: 'text', text: chunk.text },
      acl,
      tags: ['dakota'],
    });
  }
  // If the doc shrank since the last publish, clear the next stale chunk.
  await ttDeleteThing(token, `${chunks[0].id.replace(/:p\d+$/, '')}:p${chunks.length + 1}`).catch(
    () => {},
  );
}

async function main() {
  const token = ttServiceToken();
  if (!token) {
    console.error('THINGTIME_SERVICE_TOKEN is not set — run `pnpm thingtime:provision` first.');
    process.exitCode = 1;
    return;
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  // 1. The public catalog bundle.
  const catalog = await assembleCatalogFromMongo(db);
  if (catalog.exercises.length === 0) {
    console.error(`No catalog in ${dbName} — run \`pnpm seed\` first.`);
    process.exitCode = 1;
    await client.close();
    return;
  }
  const bundleChunks = encodeDoc(CATALOG_SCOPE, CATALOG_COLLECTION, CATALOG_DOC_ID, catalog);
  await putChunks(token, bundleChunks, ['tt:all']);
  console.log(`catalog: 1 bundle → ${bundleChunks.length} things (public)`);

  // 2. The demo yard, doc by doc, same shape the runtime mirror uses.
  const demoQueries: Array<[string, Record<string, unknown>]> = [
    ['horses', { user: DEMO_USER }],
    ['rides', { user: DEMO_USER }],
    ['log', { user: DEMO_USER }],
    ['user_posts', { user: DEMO_USER }],
    ['comments', { userId: DEMO_USER }],
    ['paddocks', { _id: DEMO_USER }],
    ['profile', { _id: DEMO_USER }],
  ];
  for (const [collection, query] of demoQueries) {
    const docs = await db.collection(collection).find(query).toArray();
    let things = 0;
    for (const doc of docs) {
      const chunks = encodeDoc('demo', collection, String(doc._id), doc);
      await putChunks(token, chunks, ['tt:user']);
      things += chunks.length;
    }
    console.log(`demo ${collection}: ${docs.length} docs → ${things} things`);
  }

  await client.close();
  console.log('Thingtime sync complete ✓');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
