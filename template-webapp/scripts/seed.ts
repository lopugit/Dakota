// Seed MongoDB with the Macrobiotica catalog + ~25 days of demo diary history.
// Usage: pnpm seed  (MONGODB_URI / MONGODB_DB env override the local defaults)
import { MongoClient } from 'mongodb';
import {
  CATS, FOODS, COOK_METHODS, MEALS, AILMENT_SYSTEMS, AILMENTS, PRACTICES,
  COURSES, ARTICLES, POSTS, FRIENDS, ELEMENTS, CLOCK, ANIMALS, ZODIAC_ELEMENTS,
  GLOSSARY, seedLog,
} from '../shared/mb-data';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'macrobiotica';
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
    ['foods', withIds(FOODS)],
    ['meals', withIds(MEALS)],
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
        { _id: 'cats', data: CATS },
        { _id: 'cookMethods', data: COOK_METHODS },
        { _id: 'ailmentSystems', data: AILMENT_SYSTEMS },
        { _id: 'elements', data: ELEMENTS },
        { _id: 'clock', data: CLOCK },
        { _id: 'animals', data: ANIMALS },
        { _id: 'zodiacElements', data: ZODIAC_ELEMENTS },
        { _id: 'glossary', data: GLOSSARY },
      ],
    ],
  ];
  for (const [name, docs] of catalog) {
    await db.collection(name).drop().catch(() => {});
    if (docs.length) await db.collection(name).insertMany(docs as never[]);
    console.log(`  ${name}: ${docs.length}`);
  }

  // Demo diary history (~25 days, deterministic — same generator as the prototype).
  const log = seedLog(new Date());
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
    birthYear: '1992',
    settings: { reminders: true, publicProfile: false },
    lessonsDone: {},
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
