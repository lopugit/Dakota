/**
 * Thingtime API client — Dakota's bridge to https://thingtime.com.
 *
 * Two kinds of credentials flow through here:
 * - the service account bearer token (THINGTIME_SERVICE_TOKEN, provisioned
 *   with `pnpm thingtime:provision`) — owns the generic Dakota data
 *   (catalog + the shared demo yard);
 * - per-user JWTs captured from the tt_auth cookie when an account signs in
 *   with Thingtime — own that user's yard. Stored server-side on the user
 *   doc, never sent to the browser.
 *
 * Docs: https://thingtime.com/docs/api (every endpoint also serves JSON at
 * <endpoint>-docs).
 */

export const TT_BASE = (process.env.THINGTIME_BASE_URL || 'https://thingtime.com').replace(
  /\/+$/,
  '',
);

/** Bearer token of the Dakota service account, when provisioned. */
export const ttServiceToken = (): string | null =>
  process.env.THINGTIME_SERVICE_TOKEN?.trim() || null;

export class TtError extends Error {
  constructor(
    public status: number,
    message: string,
    public body: unknown = null,
  ) {
    super(message);
    this.name = 'TtError';
  }
}

export interface TtUser {
  id: string;
  username: string;
  email?: string;
  displayName?: string;
  emailVerified?: boolean;
  accountKind?: string;
}

export interface TtThing {
  id: string;
  thingtime: string[];
  crystal: Record<string, unknown>;
  acl?: string[];
  tags?: string[];
  targetId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface TtResponse {
  status: number;
  data: Record<string, unknown>;
  /** Raw Set-Cookie headers (login/register mint the tt_auth JWT here). */
  setCookies: string[];
}

async function ttFetch(
  path: string,
  opts: { method?: string; token?: string | null; body?: unknown; query?: Record<string, string> } = {},
): Promise<TtResponse> {
  const url = new URL(TT_BASE + path);
  for (const [k, v] of Object.entries(opts.query ?? {})) url.searchParams.set(k, v);
  const res = await fetch(url, {
    method: opts.method ?? 'GET',
    headers: {
      accept: 'application/json',
      ...(opts.body !== undefined ? { 'content-type': 'application/json' } : {}),
      ...(opts.token ? { authorization: `Bearer ${opts.token}` } : {}),
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    redirect: 'manual',
  });
  const text = await res.text();
  let data: Record<string, unknown> = {};
  try {
    data = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    data = { raw: text };
  }
  return { status: res.status, data, setCookies: res.headers.getSetCookie?.() ?? [] };
}

function expectOk(res: TtResponse, what: string): Record<string, unknown> {
  if (res.status >= 400 || res.data.ok === false) {
    const msg = typeof res.data.error === 'string' ? res.data.error : `${what} failed`;
    throw new TtError(res.status, msg, res.data);
  }
  return res.data;
}

/** The tt_auth cookie value is the account's JWT — usable as a Bearer token. */
function tokenFromCookies(setCookies: string[]): string | null {
  for (const c of setCookies) {
    const m = /^tt_auth=([^;]+)/.exec(c);
    if (m && m[1] && m[1] !== 'deleted') return decodeURIComponent(m[1]);
  }
  return null;
}

// ---- auth ----

export async function ttLogin(
  username: string,
  password: string,
): Promise<{ user: TtUser; token: string }> {
  const res = await ttFetch('/api/v1/login', { method: 'POST', body: { username, password } });
  const data = expectOk(res, 'Thingtime login');
  const token = tokenFromCookies(res.setCookies);
  if (!token) throw new TtError(502, 'Thingtime login returned no auth token');
  return { user: data.user as unknown as TtUser, token };
}

export async function ttRegister(input: {
  username: string;
  password: string;
  email: string;
  displayName?: string;
}): Promise<{ user: TtUser; token: string }> {
  const res = await ttFetch('/api/v1/auth/register', {
    method: 'POST',
    body: { ...input, meta: { source: 'dakota' } },
  });
  const data = expectOk(res, 'Thingtime signup');
  const token = tokenFromCookies(res.setCookies);
  if (!token) throw new TtError(502, 'Thingtime signup returned no auth token');
  return { user: data.user as unknown as TtUser, token };
}

export async function ttMe(token: string): Promise<TtUser | null> {
  const res = await ttFetch('/api/v1/auth/me', { token });
  if (res.status >= 400) return null;
  return (res.data.user as unknown as TtUser | null) ?? null;
}

// ---- things (the storage API) ----
// PUT is an idempotent upsert at a caller-chosen id — Dakota's sync primitive.

export async function ttPutThing(
  token: string,
  thing: { id: string; thingtime: string[]; crystal: Record<string, unknown>; acl?: string[]; tags?: string[] },
): Promise<TtThing> {
  const res = await ttFetch('/api/v1/things', { method: 'PUT', token, body: thing });
  const data = expectOk(res, 'Thingtime put');
  return (data.thing ?? data.post ?? thing) as TtThing;
}

export async function ttGetThing(token: string | null, id: string): Promise<TtThing | null> {
  const res = await ttFetch('/api/v1/things', { token, query: { id } });
  if (res.status === 404) return null;
  const data = expectOk(res, 'Thingtime get');
  return (data.thing ?? data.post ?? null) as TtThing | null;
}

export async function ttListThings(
  token: string,
  opts: { thingtime?: string; cursor?: string; limit?: number } = {},
): Promise<{ things: TtThing[]; nextCursor: string | null }> {
  const query: Record<string, string> = {};
  if (opts.thingtime) query.thingtime = opts.thingtime;
  if (opts.cursor) query.cursor = opts.cursor;
  if (opts.limit) query.limit = String(opts.limit);
  const res = await ttFetch('/api/v1/things', { token, query });
  const data = expectOk(res, 'Thingtime list');
  return {
    things: (data.things ?? data.posts ?? []) as TtThing[],
    nextCursor: (data.nextCursor as string | null) ?? null,
  };
}

export async function ttDeleteThing(token: string, id: string): Promise<void> {
  const res = await ttFetch('/api/v1/things', { method: 'DELETE', token, query: { id } });
  if (res.status === 404) return; // already gone — deletion is idempotent for us
  expectOk(res, 'Thingtime delete');
}
