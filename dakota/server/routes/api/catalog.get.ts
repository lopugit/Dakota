import { defineEventHandler } from 'h3';
import type { Catalog } from '../../../shared/types';
import { getDb } from '../../utils/mongo';

const strip = <T>(doc: unknown): T => {
  const { _id, order, ...rest } = doc as Record<string, unknown>;
  void _id;
  void order;
  return rest as T;
};

export default defineEventHandler(async (): Promise<Catalog> => {
  const db = await getDb();
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
});
