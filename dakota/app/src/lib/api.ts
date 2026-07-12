// Local, offline-first data layer.
//
// The whole prototype runs from the bundled sample data (shared/dk-data),
// hydrated once into localStorage — no API server or database required. The
// method surface mirrors the old fetch-based client exactly, so queries.ts and
// every screen stay unchanged; only the transport moved from `/api/*` to a
// localStorage-backed store built the same way scripts/seed.ts seeds Mongo.
import type {
  AuthUser, CareType, Catalog, DataSource, FeedPost, Horse, Paddocks, Post,
  PostRide, Profile, Ride, UserLog, UserPost,
} from '@shared/types';
import {
  AGES, AILMENTS, AILMENT_SYSTEMS, ARTICLES, BREEDS, CONDITION, COURSES,
  DISCIPLINES, EXERCISES, FEEDS, FEED_CATS, FRIENDS, GAITS, GLOSSARY, LEVELS,
  MARKINGS, POSTS, PRACTICES, SIGNALS, demoHorses, demoPaddocks, demoRides, seedLog,
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
      if (raw) return JSON.parse(raw) as LocalState;
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

// ---------- local transport ----------

const local = {
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

  moveHorse: (body: { horse: string; to: string }) => {
    const p = state.paddocks;
    if (p.paddocks.some((pd) => pd.id === body.to)) {
      const from = p.horses[body.horse] ?? '';
      p.horses[body.horse] = body.to;
      p.moves = [{ horse: body.horse, from, to: body.to, at: dateKey(new Date()) }, ...p.moves].slice(0, 200);
      save();
    }
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

// ---------- remote transport (Nitro API → MongoDB + Thingtime) ----------
//
// Signing in with Thingtime flips the client onto the real API: the server
// authenticates against thingtime.com, hydrates the account's yard from its
// Thingtime things, and mirrors every write back to Thingtime. The flag
// survives reloads; logging out returns to the local offline store.

const REMOTE_FLAG = 'dk-remote';
const remoteActive = (): boolean =>
  hasStorage && window.localStorage.getItem(REMOTE_FLAG) === '1';
const setRemoteActive = (on: boolean): void => {
  if (!hasStorage) return;
  try {
    if (on) window.localStorage.setItem(REMOTE_FLAG, '1');
    else window.localStorage.removeItem(REMOTE_FLAG);
  } catch {
    /* private mode — the session simply won't survive a reload */
  }
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: init?.body ? { 'content-type': 'application/json' } : undefined,
    ...init,
  });
  if (!res.ok) {
    throw new Error(`${init?.method ?? 'GET'} ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

const post = <T>(path: string, body: unknown): Promise<T> =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body) });

const remote: typeof local = {
  catalog: () => request<Catalog>('/api/catalog'),
  log: () => request<UserLog>('/api/log'),
  profile: () => request<Profile>('/api/profile'),
  feed: () => request<FeedPost[]>('/api/feed'),
  horses: () => request<Horse[]>('/api/horses'),
  rides: () => request<Ride[]>('/api/rides'),
  paddocks: () => request<Paddocks>('/api/paddocks'),

  saveCheckin: (body) => post('/api/log/checkin', body),
  logSession: (body) => post('/api/log/session', body),
  markPractice: (body) => post('/api/log/practice', body),
  logCare: (body) => post('/api/log/care', body),

  addHorse: (body) => post<Horse>('/api/horses', body),
  updateHorse: (id, patch) =>
    request(`/api/horses/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(patch),
    }),

  saveRide: (body) => post<Ride>('/api/rides', body),

  moveHorse: (body) => post('/api/paddocks/move', body),

  sharePost: (body) => post('/api/feed/post', body),
  setLike: (body) => post('/api/feed/like', body),
  addComment: (body) => post('/api/feed/comment', body),

  updateProfile: (patch) =>
    request<Profile>('/api/profile', { method: 'PUT', body: JSON.stringify(patch) }),
  completeLesson: (lessonId) =>
    post(`/api/lessons/${encodeURIComponent(lessonId)}/complete`, {}),

  authMe: () => request<{ user: AuthUser | null }>('/api/auth/me'),
  signup: (body) => post<{ user: AuthUser }>('/api/auth/signup', body),
  login: (body) => post<{ user: AuthUser }>('/api/auth/login', body),
  logout: () => post<{ ok: true }>('/api/auth/logout', {}),
  setDataSource: (dataSource) =>
    post<{ ok: true; dataSource: DataSource }>('/api/auth/datasource', { dataSource }),
};

// ---------- api (transport dispatcher) ----------

export interface ThingtimeAuthBody {
  mode: 'signin' | 'signup';
  username: string;
  password: string;
  email?: string;
  name?: string;
}

const pick = (): typeof local => (remoteActive() ? remote : local);

export const api: typeof local & {
  thingtimeAuth: (body: ThingtimeAuthBody) => Promise<{ user: AuthUser }>;
} = {
  catalog: () => pick().catalog(),
  log: () => pick().log(),
  profile: () => pick().profile(),
  feed: () => pick().feed(),
  horses: () => pick().horses(),
  rides: () => pick().rides(),
  paddocks: () => pick().paddocks(),

  saveCheckin: (body) => pick().saveCheckin(body),
  logSession: (body) => pick().logSession(body),
  markPractice: (body) => pick().markPractice(body),
  logCare: (body) => pick().logCare(body),

  addHorse: (body) => pick().addHorse(body),
  updateHorse: (id, patch) => pick().updateHorse(id, patch),

  saveRide: (body) => pick().saveRide(body),
  moveHorse: (body) => pick().moveHorse(body),

  sharePost: (body) => pick().sharePost(body),
  setLike: (body) => pick().setLike(body),
  addComment: (body) => pick().addComment(body),

  updateProfile: (patch) => pick().updateProfile(patch),
  completeLesson: (lessonId) => pick().completeLesson(lessonId),

  authMe: () => pick().authMe(),
  signup: (body) => pick().signup(body),
  login: (body) => pick().login(body),
  logout: async () => {
    const res = await pick().logout();
    setRemoteActive(false);
    return res;
  },
  setDataSource: (dataSource) => pick().setDataSource(dataSource),

  /** Sign in (or up) with Thingtime — always talks to the real API. */
  thingtimeAuth: async (body) => {
    const res = await post<{ user: AuthUser }>('/api/auth/thingtime', body);
    setRemoteActive(true);
    return res;
  },
};
