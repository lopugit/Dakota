export interface NavDef {
  id: string;
  icon: string;
  label: string;
  path: string;
}

export const NAV: NavDef[] = [
  { id: 'today', icon: 'sun', label: 'Today', path: '/' },
  { id: 'diary', icon: 'calendar-days', label: 'Diary', path: '/diary' },
  { id: 'foods', icon: 'carrot', label: 'Foods', path: '/foods' },
  { id: 'treatments', icon: 'leaf', label: 'Treatments', path: '/treatments' },
  { id: 'learn', icon: 'book-open', label: 'Learn', path: '/learn' },
  { id: 'practices', icon: 'sprout', label: 'Practices', path: '/practices' },
  { id: 'wisdom', icon: 'moon', label: 'Wisdom', path: '/wisdom' },
  { id: 'feed', icon: 'newspaper', label: 'Feed', path: '/feed' },
  { id: 'care', icon: 'heart', label: 'Care', path: '/care' },
  { id: 'profile', icon: 'user', label: 'Profile', path: '/profile' },
];

export const byId = Object.fromEntries(NAV.map((d) => [d.id, d])) as Record<string, NavDef>;

/** Rail groups: [Today, Diary] · Explore · Circle. */
export const RAIL_GROUPS: Array<{ h: string | null; items: string[] }> = [
  { h: null, items: ['today', 'diary'] },
  { h: 'Explore', items: ['foods', 'treatments', 'learn', 'practices', 'wisdom'] },
  { h: 'Circle', items: ['feed', 'care', 'profile'] },
];

export const BAR_IDS = ['today', 'diary', 'foods', 'feed'];
export const MORE_IDS = ['treatments', 'learn', 'practices', 'wisdom', 'care', 'profile'];

/** Active tab id for a pathname (meal/food details highlight Foods, like the prototype). */
export function activeTabFor(pathname: string): string {
  if (pathname === '/') return 'today';
  const seg = pathname.split('/')[1];
  if (seg === 'meals') return 'foods';
  return byId[seg] ? seg : 'today';
}

export function screenMeta(tab: string, now: Date): { title: string; sub: string } {
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const meta: Record<string, { title: string; sub: string }> = {
    today: { title: 'Today', sub: dateStr },
    diary: { title: 'Diary', sub: 'Every meal and check-in, day by day' },
    foods: { title: 'Foods', sub: 'The yin–yang compass for foods and whole meals' },
    treatments: { title: 'Treatments', sub: 'Gentle food-based support, by ailment' },
    learn: { title: 'Learn', sub: 'Philosophy, lessons, practice' },
    practices: { title: 'Practices', sub: 'Small daily disciplines that do the real work' },
    feed: { title: 'Feed', sub: 'What your circle is cooking and noticing' },
    care: { title: 'Care', sub: 'The people you cook for' },
    wisdom: { title: 'Wisdom', sub: 'Five elements, the organ clock, your chart' },
    profile: { title: 'Profile', sub: 'Your practice, at a glance' },
  };
  return meta[tab] ?? meta.today;
}
