// Local, offline-first data layer.
//
// The whole prototype runs from the bundled sample data (shared/dk-data),
// hydrated once into localStorage — no API server or database required. The
// method surface mirrors the old fetch-based client exactly, so queries.ts and
// every screen stay unchanged; only the transport moved from `/api/*` to a
// localStorage-backed store built the same way scripts/seed.ts seeds Mongo.
import type {
  AuthUser, CareType, Catalog, DataSource, Farm, FeedPost, Horse, Paddocks, Post,
  PostRide, Profile, Ride, UserLog, UserPost,
} from '@shared/types';
import {
  AGES, AILMENTS, AILMENT_SYSTEMS, ARTICLES, BREEDS, CONDITION, COURSES,
  DISCIPLINES, EXERCISES, FEEDS, FEED_CATS, FRIENDS, GAITS, GLOSSARY, LEVELS,
  MARKINGS, POSTS, PRACTICES, SIGNALS, demoHorses, demoPaddocks, demoRides,
  migratePaddocks, seedLog, starterFarm,
} from '@shared/dk-data';
import { dateKey } from '@shared/derive';

// ---------- store ----------

const STORAGE_KEY = 'dk-local-state-v1';
const hasStorage = typeof window !== 'undefined' && !!window.localStorage;
const clone = <T>(v: T): T =>
  typeof structuredClone === 'function' ? structuredClone(v) : JSON.parse(JSON.stringify(v));

interface Comment {
  postId: string;
  who: string;
  t: string;
}

interface LocalState {
  log: UserLog;
  profile: Profile;
  horses: Horse[];
  rides: Ride[];
  paddocks: Paddocks;
  userPosts: UserPost[];
  comments: Comment[];
  authUser: AuthUser | null;
}

// The demo yard's profile — matches scripts/seed.ts.
const DEMO_PROFILE: Profile = {
  name: '',
  yardName: 'Bramble Creek',
  since: '1998',
  settings: { reminders: true, publicProfile: false },
  lessonsDone: { 'ears-eyes-tail': true, 'energy-scale': true },
  likes: {},
};

// The catalog is immutable reference data — assembled once, never persisted.
const CATALOG: Catalog = {
  disciplines: DISCIPLINES,
  levels: LEVELS,
  exercises: EXERCISES,
  feedCats: FEED_CATS,
  feeds: FEEDS,
  ailmentSystems: AILMENT_SYSTEMS,
  ailments: AILMENTS,
  practices: PRACTICES,
  courses: COURSES,
  articles: ARTICLES,
  friends: FRIENDS,
  breeds: BREEDS,
  gaits: GAITS,
  markings: MARKINGS,
  ages: AGES,
  signals: SIGNALS,
  glossary: GLOSSARY,
  condition: CONDITION,
};

function buildInitial(): LocalState {
  const now = new Date();
  const horses = demoHorses(now);
  return {
    log: seedLog(now, EXERCISES, PRACTICES, horses),
    profile: clone(DEMO_PROFILE),
    horses,
    rides: demoRides(now).sort((a, b) => b.startedAt - a.startedAt),
    paddocks: demoPaddocks(now),
    userPosts: [],
    comments: [],
    authUser: null,
  };
}

function load(): LocalState {
  if (hasStorage) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as LocalState;
        // Saves from before multi-farm hold a single flat property — lift it.
        parsed.paddocks = migratePaddocks(parsed.paddocks);
        return parsed;
      }
    } catch {
      /* corrupt or unavailable — fall through to a fresh yard */
    }
  }
  const fresh = buildInitial();
  save(fresh);
  return fresh;
}

function save(next: LocalState = state): void {
  if (!hasStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* private mode / quota — stay in-memory for the session */
  }
}

let state: LocalState = load();

// Resolve on a microtask so callers keep their async, fetch-like ergonomics.
const reply = <T>(value: T): Promise<T> => Promise.resolve(clone(value));

function ensureDay(date: string) {
  const day = state.log[date] ?? { sessions: [], checkins: [], practices: [], care: [] };
  state.log[date] = day;
  return day;
}

function buildFeed(): FeedPost[] {
  const extra = new Map<string, Comment[]>();
  for (const c of state.comments) {
    const list = extra.get(c.postId) ?? [];
    list.push(c);
    extra.set(c.postId, list);
  }
  const all: Post[] = [...state.userPosts, ...POSTS];
  return all.map((p) => ({
    ...p,
    comments: [...(p.comments ?? []), ...(extra.get(p.id) ?? []).map(({ who, t }) => ({ who, t }))],
    liked: !!state.profile.likes[p.id],
  }));
}

const rid = (prefix: string): string =>
  prefix + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

// ---------- api ----------

export const api = {
  catalog: () => reply(CATALOG),
  log: () => reply(state.log),
  profile: () => reply(state.profile),
  feed: () => reply(buildFeed()),
  horses: () => reply(state.horses),
  rides: () => reply(state.rides),
  paddocks: () => reply(state.paddocks),

  saveCheckin: (body: { date: string; horse: string; t: string; v: number; note: string }) => {
    const day = ensureDay(body.date);
    day.checkins.push({ horse: body.horse, t: body.t, v: body.v, note: body.note });
    save();
    return reply({ ok: true } as const);
  },
  logSession: (body: {
    date: string; ex: string; horse: string; t: string; mins: number; score: number; note: string;
  }) => {
    const day = ensureDay(body.date);
    day.sessions.push({
      ex: body.ex, horse: body.horse, t: body.t, mins: body.mins, score: body.score, note: body.note,
    });
    save();
    return reply({ ok: true } as const);
  },
  markPractice: (body: { date: string; id: string }) => {
    const day = ensureDay(body.date);
    if (!day.practices.includes(body.id)) day.practices.push(body.id);
    save();
    return reply({ ok: true } as const);
  },
  logCare: (body: { date: string; horse: string; type: CareType; t: string; note: string }) => {
    const day = ensureDay(body.date);
    day.care.push({ horse: body.horse, type: body.type, t: body.t, note: body.note });
    save();
    return reply({ ok: true } as const);
  },

  addHorse: (body: Omit<Horse, 'id'>) => {
    const horse: Horse = { id: rid('h_'), ...body };
    state.horses.push(horse);
    save();
    return reply(horse);
  },
  updateHorse: (id: string, patch: Partial<Omit<Horse, 'id'>>) => {
    state.horses = state.horses.map((h) =>
      h.id === id ? { ...h, ...patch, care: { ...h.care, ...(patch.care ?? {}) } } : h,
    );
    save();
    return reply({ ok: true } as const);
  },

  saveRide: (body: Omit<Ride, 'id'>) => {
    const ride: Ride = { id: rid('r_'), ...body };
    state.rides = [ride, ...state.rides].sort((a, b) => b.startedAt - a.startedAt);
    save();
    return reply(ride);
  },

  moveHorse: (body: { farm: string; horse: string; to: string }) => {
    const farm = state.paddocks.farms.find((f) => f.id === body.farm);
    if (farm && farm.paddocks.some((pd) => pd.id === body.to)) {
      // A horse grazes one farm at a time — pull it from wherever it was.
      const from =
        farm.horses[body.horse] ??
        state.paddocks.farms.find((f) => f.horses[body.horse])?.horses[body.horse] ??
        '';
      for (const f of state.paddocks.farms) delete f.horses[body.horse];
      farm.horses[body.horse] = body.to;
      farm.moves = [
        { horse: body.horse, from, to: body.to, at: dateKey(new Date()) },
        ...farm.moves,
      ].slice(0, 200);
      save();
    }
    return reply({ ok: true } as const);
  },

  addFarm: (body: { n: string }) => {
    const farm = starterFarm(rid('f_'), body.n);
    state.paddocks.farms.push(farm);
    save();
    return reply(farm);
  },
  saveFarm: (farm: Farm) => {
    // Whole-farm saves still honour the invariants: residents must stand in a
    // paddock that exists here, and a horse grazes one farm at a time. Copy
    // before fixing up — the caller's object also lives in the query cache.
    const valid = new Set(farm.paddocks.map((p) => p.id));
    const next: Farm = {
      ...farm,
      horses: Object.fromEntries(
        Object.entries(farm.horses).filter(([, pid]) => valid.has(pid)),
      ),
    };
    const farms = state.paddocks.farms;
    const i = farms.findIndex((f) => f.id === next.id);
    if (i >= 0) farms[i] = next;
    else farms.push(next);
    for (const f of farms) {
      if (f.id === next.id) continue;
      for (const horse of Object.keys(next.horses)) delete f.horses[horse];
    }
    save();
    return reply({ ok: true } as const);
  },
  deleteFarm: (body: { id: string }) => {
    state.paddocks.farms = state.paddocks.farms.filter((f) => f.id !== body.id);
    save();
    return reply({ ok: true } as const);
  },

  sharePost: (body: { text: string; ex?: string; ride?: PostRide }) => {
    const who = (state.profile.name || 'You').trim();
    const post: UserPost = {
      id: rid('u_'),
      who,
      initials: who.slice(0, 2).toUpperCase(),
      time: 'Now',
      text: body.text,
      ...(body.ex ? { ex: body.ex } : {}),
      ...(body.ride ? { ride: body.ride } : {}),
      likes: 0,
      comments: [],
      userGenerated: true,
      at: Date.now(),
    };
    state.userPosts = [post, ...state.userPosts];
    save();
    return reply({ ok: true } as const);
  },
  setLike: (body: { postId: string; liked: boolean }) => {
    if (body.liked) state.profile.likes[body.postId] = true;
    else delete state.profile.likes[body.postId];
    save();
    return reply({ ok: true } as const);
  },
  addComment: (body: { postId: string; t: string }) => {
    const who = (state.profile.name || 'You').trim();
    state.comments.push({ postId: body.postId, who, t: body.t });
    save();
    return reply({ ok: true } as const);
  },

  updateProfile: (patch: Partial<Pick<Profile, 'name' | 'yardName' | 'since' | 'settings'>>) => {
    state.profile = { ...state.profile, ...patch };
    save();
    return reply(state.profile);
  },
  completeLesson: (lessonId: string) => {
    state.profile.lessonsDone = { ...state.profile.lessonsDone, [lessonId]: true };
    save();
    return reply({ ok: true } as const);
  },

  // Auth is a light local session — sign-in is cosmetic (data is always the
  // demo yard), but it makes the Auth and Profile screens fully interactive.
  authMe: () => reply({ user: state.authUser }),
  signup: (body: { email: string; password: string; name: string }) => {
    const user: AuthUser = { id: 'local', email: body.email, name: body.name, dataSource: 'demo' };
    state.authUser = user;
    if (body.name) state.profile.name = body.name;
    save();
    return reply({ user });
  },
  login: (body: { email: string; password: string }) => {
    const name = state.profile.name || body.email.split('@')[0] || 'Rider';
    const user: AuthUser = { id: 'local', email: body.email, name, dataSource: 'demo' };
    state.authUser = user;
    save();
    return reply({ user });
  },
  logout: () => {
    state.authUser = null;
    save();
    return reply({ ok: true } as const);
  },
  setDataSource: (dataSource: DataSource) => {
    if (state.authUser) state.authUser.dataSource = dataSource;
    save();
    return reply({ ok: true as const, dataSource });
  },
};
