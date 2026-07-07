import type { AuthUser, Catalog, DataSource, FeedPost, Profile, UserLog } from '@shared/types';

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

export const api = {
  catalog: () => request<Catalog>('/api/catalog'),
  log: () => request<UserLog>('/api/log'),
  profile: () => request<Profile>('/api/profile'),
  feed: () => request<FeedPost[]>('/api/feed'),

  saveCheckin: (body: { date: string; t: string; v: number; note: string }) =>
    post<{ ok: true }>('/api/log/checkin', body),
  logMeal: (body: { date: string; id: string; t: string }) =>
    post<{ ok: true }>('/api/log/meal', body),
  markPractice: (body: { date: string; id: string }) =>
    post<{ ok: true }>('/api/log/practice', body),

  sharePost: (body: { text: string; meal?: string }) =>
    post<{ ok: true }>('/api/feed/post', body),
  setLike: (body: { postId: string; liked: boolean }) =>
    post<{ ok: true }>('/api/feed/like', body),
  addComment: (body: { postId: string; t: string }) =>
    post<{ ok: true }>('/api/feed/comment', body),

  updateProfile: (patch: Partial<Pick<Profile, 'name' | 'birthYear' | 'settings'>>) =>
    request<Profile>('/api/profile', { method: 'PUT', body: JSON.stringify(patch) }),
  completeLesson: (lessonId: string) =>
    post<{ ok: true }>(`/api/lessons/${encodeURIComponent(lessonId)}/complete`, {}),

  authMe: () => request<{ user: AuthUser | null }>('/api/auth/me'),
  signup: (body: { email: string; password: string; name: string }) =>
    post<{ user: AuthUser }>('/api/auth/signup', body),
  login: (body: { email: string; password: string }) =>
    post<{ user: AuthUser }>('/api/auth/login', body),
  logout: () => post<{ ok: true }>('/api/auth/logout', {}),
  setDataSource: (dataSource: DataSource) =>
    post<{ ok: true; dataSource: DataSource }>('/api/auth/datasource', { dataSource }),
};
