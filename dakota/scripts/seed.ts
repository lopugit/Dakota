// Seed MongoDB with the Dakota catalog + the demo yard (horses, paddocks,
// rides and ~4 weeks of diary history).
// Usage: pnpm seed  (MONGODB_URI / MONGODB_DB env override the local defaults)
import { MongoClient } from 'mongodb';
import {
  AGES, AILMENTS, AILMENT_SYSTEMS, ARTICLES, BREEDS, CONDITION, COURSES,
  DISCIPLINES, EXERCISES, FEEDS, FEED_CATS, FRIENDS, GAITS, GLOSSARY, LEVELS,
  MARKINGS, POSTS, PRACTICES, SIGNALS, demoHorses, demoPaddocks, demoRides,
  seedLog,
} from '../shared/dk-data';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'dakota';
const DEMO_USER = 'demo';

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  console.log(`Seeding ${dbName} at ${uri.replace(/\/\/[^@]*@/, '//***@')} …`);

  const withIds = <T extends { id: string }>(rows: T[]) =>
    rows.map((row, order) => ({ _id: row.id, order, ...row }));

  // Catalog collections — dropped and re-inserted so ids stay stable.
  const catalog: Array<[string, object[]]> = [
    ['exercises', withIds(EXERCISES)],
    ['feeds', withIds(FEEDS)],
    ['ailments', withIds(AILMENTS)],
    ['practices', withIds(PRACTICES)],
    ['courses', withIds(COURSES)],
    ['posts', withIds(POSTS)],
    ['friends', withIds(FRIENDS)],
    [
      'articles',
      Object.entries(ARTICLES).map(([lessonId, blocks]) => ({ _id: lessonId, blocks })),
    ],
    [
      'wisdom',
      [
        { _id: 'disciplines', data: DISCIPLINES },
        { _id: 'levels', data: LEVELS },
        { _id: 'feedCats', data: FEED_CATS },
        { _id: 'ailmentSystems', data: AILMENT_SYSTEMS },
        { _id: 'breeds', data: BREEDS },
        { _id: 'gaits', data: GAITS },
        { _id: 'markings', data: MARKINGS },
        { _id: 'ages', data: AGES },
        { _id: 'signals', data: SIGNALS },
        { _id: 'glossary', data: GLOSSARY },
        { _id: 'condition', data: CONDITION },
      ],
    ],
  ];
  for (const [name, docs] of catalog) {
    await db.collection(name).drop().catch(() => {});
    if (docs.length) await db.collection(name).insertMany(docs as never[]);
    console.log(`  ${name}: ${docs.length}`);
  }

  const now = new Date();

  // The demo yard: horses, paddocks, rides.
  const horses = demoHorses(now);
  await db.collection('horses').drop().catch(() => {});
  await db.collection('horses').insertMany(
    horses.map((h, order) => ({ _id: `${DEMO_USER}:${h.id}`, user: DEMO_USER, order, ...h })) as never[],
  );
  console.log(`  horses: ${horses.length}`);

  const rides = demoRides(now);
  await db.collection('rides').drop().catch(() => {});
  await db.collection('rides').insertMany(
    rides.map((r) => ({ _id: `${DEMO_USER}:${r.id}`, user: DEMO_USER, ...r })) as never[],
  );
  console.log(`  rides: ${rides.length} (${rides.reduce((a, r) => a + r.points.length, 0)} GPS points)`);

  await db.collection('paddocks').drop().catch(() => {});
  await db.collection('paddocks').insertOne({ _id: DEMO_USER, ...demoPaddocks(now) } as never);
  console.log('  paddocks: demo property');

  // Demo diary history (~4 weeks, deterministic).
  const log = seedLog(now, EXERCISES, PRACTICES, horses);
  const logDocs = Object.entries(log).map(([date, day]) => ({
    _id: `${DEMO_USER}:${date}`,
    user: DEMO_USER,
    date,
    ...day,
  }));
  await db.collection('log').drop().catch(() => {});
  await db.collection('log').insertMany(logDocs as never[]);
  console.log(`  log: ${logDocs.length} days`);

  // User state — reset to a fresh demo profile.
  await db.collection('user_posts').drop().catch(() => {});
  await db.collection('comments').drop().catch(() => {});
  await db.collection('profile').drop().catch(() => {});
  await db.collection('profile').insertOne({
    _id: DEMO_USER,
    name: '',
    yardName: 'Bramble Creek',
    since: '1998',
    settings: { reminders: true, publicProfile: false },
    lessonsDone: { 'ears-eyes-tail': true, 'energy-scale': true },
    likes: {},
  } as never);
  console.log('  profile: reset');

  await client.close();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
