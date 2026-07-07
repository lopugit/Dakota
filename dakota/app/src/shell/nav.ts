export interface NavDef {
  id: string;
  icon: string;
  label: string;
  path: string;
}

export const NAV: NavDef[] = [
  { id: 'today', icon: 'sun', label: 'Today', path: '/' },
  { id: 'diary', icon: 'calendar-days', label: 'Diary', path: '/diary' },
  { id: 'horses', icon: 'horse', label: 'Horses', path: '/horses' },
  { id: 'arena', icon: 'target', label: 'Arena', path: '/arena' },
  { id: 'rides', icon: 'map-pin', label: 'Rides', path: '/rides' },
  { id: 'paddocks', icon: 'fence', label: 'Paddocks', path: '/paddocks' },
  { id: 'health', icon: 'stethoscope', label: 'Health', path: '/health' },
  { id: 'feedroom', icon: 'wheat', label: 'Feed room', path: '/feedroom' },
  { id: 'learn', icon: 'book-open', label: 'Learn', path: '/learn' },
  { id: 'practices', icon: 'sprout', label: 'Practices', path: '/practices' },
  { id: 'wisdom', icon: 'moon', label: 'Wisdom', path: '/wisdom' },
  { id: 'feed', icon: 'newspaper', label: 'Feed', path: '/feed' },
  { id: 'circle', icon: 'users', label: 'Circle', path: '/circle' },
  { id: 'profile', icon: 'user', label: 'Profile', path: '/profile' },
];

export const byId = Object.fromEntries(NAV.map((d) => [d.id, d])) as Record<string, NavDef>;

/** Rail groups: [Today, Diary] · Stable · Training · Reference · Circle. */
export const RAIL_GROUPS: Array<{ h: string | null; items: string[] }> = [
  { h: null, items: ['today', 'diary'] },
  { h: 'Stable', items: ['horses', 'paddocks', 'rides'] },
  { h: 'Training', items: ['arena', 'practices', 'learn'] },
  { h: 'Reference', items: ['health', 'feedroom', 'wisdom'] },
  { h: 'Circle', items: ['feed', 'circle', 'profile'] },
];

export const BAR_IDS = ['today', 'horses', 'arena', 'rides'];
export const MORE_IDS = [
  'diary', 'paddocks', 'health', 'feedroom', 'learn', 'practices', 'wisdom', 'feed', 'circle', 'profile',
];

/** Active tab id for a pathname (detail routes highlight their list tab). */
export function activeTabFor(pathname: string): string {
  if (pathname === '/') return 'today';
  const seg = pathname.split('/')[1];
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
    diary: { title: 'Diary', sub: 'Every session, check-in and care note, day by day' },
    horses: { title: 'Horses', sub: 'Your herd — profiles, lineage and care' },
    arena: { title: 'Arena', sub: 'Schooling figures to ride, and how each one went' },
    rides: { title: 'Rides', sub: 'GPS tracks of every hack, trail and training ride' },
    paddocks: { title: 'Paddocks', sub: 'Who is where, and when the grass needs a spell' },
    health: { title: 'Health', sub: 'Signs, first response, and when to call the vet' },
    feedroom: { title: 'Feed room', sub: 'The heating–cooling compass for what goes in the bin' },
    learn: { title: 'Learn', sub: 'Horsemanship, lesson by lesson' },
    practices: { title: 'Practices', sub: 'Small daily disciplines that keep horses sound' },
    wisdom: { title: 'Wisdom', sub: 'Breeds, gaits, markings and the language of horses' },
    feed: { title: 'Feed', sub: 'What your circle is riding and noticing' },
    circle: { title: 'Circle', sub: 'The riders around you' },
    profile: { title: 'Profile', sub: 'Your riding life, at a glance' },
  };
  return meta[tab] ?? meta.today;
}
