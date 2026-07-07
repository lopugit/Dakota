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
  const [foods, meals, ailments, practices, courses, articles, friends, wisdom] =
    await Promise.all([
      db.collection('foods').find({}, bySeedOrder).toArray(),
      db.collection('meals').find({}, bySeedOrder).toArray(),
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
    cats: (wisdomByKey.cats as Catalog['cats']) ?? [],
    cookMethods: (wisdomByKey.cookMethods as Catalog['cookMethods']) ?? [],
    ailmentSystems: (wisdomByKey.ailmentSystems as Catalog['ailmentSystems']) ?? [],
    elements: (wisdomByKey.elements as Catalog['elements']) ?? [],
    clock: (wisdomByKey.clock as Catalog['clock']) ?? [],
    animals: (wisdomByKey.animals as Catalog['animals']) ?? [],
    zodiacElements: (wisdomByKey.zodiacElements as Catalog['zodiacElements']) ?? [],
    glossary: (wisdomByKey.glossary as Catalog['glossary']) ?? [],
    foods: foods.map((d) => strip<Catalog['foods'][number]>(d)),
    meals: meals.map((d) => strip<Catalog['meals'][number]>(d)),
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
