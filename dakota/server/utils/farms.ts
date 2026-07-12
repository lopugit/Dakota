import type { Paddocks } from '../../shared/types';
import { migratePaddocks } from '../../shared/data/demo';
import type { DataContext } from './datasource';

/**
 * The caller's farms, lifted to the multi-farm shape (older docs stored a
 * single flat property). Falls back to the starter layout for new accounts.
 */
export async function loadFarms(ctx: DataContext, userKey: string): Promise<Paddocks> {
  const doc = await ctx.db.collection('paddocks').findOne({ _id: userKey } as never);
  if (!doc) return migratePaddocks(null);
  const { _id, ...rest } = doc as Record<string, unknown>;
  void _id;
  return migratePaddocks(rest);
}

export async function saveFarms(ctx: DataContext, userKey: string, next: Paddocks): Promise<void> {
  await ctx.db
    .collection('paddocks')
    .updateOne(
      { _id: userKey } as never,
      // Replace wholesale — $set would leave legacy flat fields behind.
      { $set: { farms: next.farms }, $unset: { paddocks: '', gates: '', horses: '', moves: '' } } as never,
      { upsert: true },
    );
}
