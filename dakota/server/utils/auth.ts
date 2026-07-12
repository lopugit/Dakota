import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { deleteCookie, getCookie, getRequestHeader, setCookie, type H3Event } from 'h3';
import type { Db } from 'mongodb';
import type { AuthUser, DataSource } from '../../shared/types';
import { getDb } from './mongo';

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number },
) => Promise<Buffer>;

const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 };
export const SESSION_COOKIE = 'dk-session';
const SESSION_DAYS = 30;

/** Link to a Thingtime account; the captured JWT stays server-side only. */
export interface ThingtimeLink {
  userId: string;
  username: string;
  token: string;
  connectedAt: Date;
}

export interface UserDoc {
  _id: string;
  email: string;
  name: string;
  /** Empty for accounts that authenticate via Thingtime. */
  passwordHash: string;
  dataSource: DataSource;
  createdAt: Date;
  thingtime?: ThingtimeLink;
}

interface SessionDoc {
  _id: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
}

// Unique email + session TTL indexes, ensured once per process.
let indexesReady: Promise<unknown> | null = null;
function ensureIndexes(db: Db): Promise<unknown> {
  if (!indexesReady) {
    indexesReady = Promise.all([
      db.collection('users').createIndex({ email: 1 }, { unique: true }),
      db.collection('sessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    ]).catch((err) => {
      indexesReady = null;
      throw err;
    });
  }
  return indexesReady;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, SCRYPT.keylen, SCRYPT);
  return ['scrypt', SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString('hex'), key.toString('hex')].join(
    '$',
  );
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, N, r, p, saltHex, hashHex] = stored.split('$');
  if (algo !== 'scrypt') return false;
  const expected = Buffer.from(hashHex, 'hex');
  const key = await scrypt(password, Buffer.from(saltHex, 'hex'), expected.length, {
    N: Number(N),
    r: Number(r),
    p: Number(p),
  });
  return timingSafeEqual(key, expected);
}

export async function createUser(
  email: string,
  password: string,
  name: string,
): Promise<UserDoc> {
  const db = await getDb();
  await ensureIndexes(db);
  const user: UserDoc = {
    _id: 'u_' + randomBytes(12).toString('hex'),
    email,
    name,
    passwordHash: await hashPassword(password),
    // Fresh accounts keep their own practice; the Profile toggle can switch
    // back to the shared example data at any time.
    dataSource: 'prod',
    createdAt: new Date(),
  };
  await db.collection('users').insertOne(user as never);
  return user;
}

/**
 * Find-or-create the local account for a Thingtime identity. The id is
 * deterministic (`ttu_<thingtime user id>`) so every environment resolves the
 * same account — that's what makes Thingtime-hydrated docs line up.
 */
export async function upsertThingtimeUser(
  tt: { id: string; username: string; email?: string; displayName?: string },
  token: string,
): Promise<UserDoc> {
  const db = await getDb();
  await ensureIndexes(db);
  const users = db.collection('users');
  const _id = `ttu_${tt.id}`;
  const link: ThingtimeLink = {
    userId: tt.id,
    username: tt.username,
    token,
    connectedAt: new Date(),
  };

  const existing = (await users.findOne({ _id } as never)) as UserDoc | null;
  if (existing) {
    await users.updateOne({ _id } as never, { $set: { thingtime: link } } as never);
    return { ...existing, thingtime: link };
  }

  const user: UserDoc = {
    _id,
    email: (tt.email || `${tt.username}@thingtime`).toLowerCase(),
    name: tt.displayName || tt.username,
    passwordHash: '',
    dataSource: 'prod',
    createdAt: new Date(),
    thingtime: link,
  };
  try {
    await users.insertOne(user as never);
  } catch {
    // Email already used by a local password account — keep both accounts by
    // giving the Thingtime one a synthetic unique address.
    user.email = `${tt.username}+${tt.id.slice(-6)}@thingtime`.toLowerCase();
    await users.insertOne(user as never);
  }
  return user;
}

export async function startSession(event: H3Event, userId: string): Promise<void> {
  const db = await getDb();
  await ensureIndexes(db);
  const session: SessionDoc = {
    _id: randomBytes(32).toString('base64url'),
    userId,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + SESSION_DAYS * 86400_000),
  };
  await db.collection('sessions').insertOne(session as never);
  setCookie(event, SESSION_COOKIE, session._id, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DAYS * 86400,
    secure: getRequestHeader(event, 'x-forwarded-proto') === 'https',
  });
}

export async function endSession(event: H3Event): Promise<void> {
  const token = getCookie(event, SESSION_COOKIE);
  if (token) {
    const db = await getDb();
    await db.collection('sessions').deleteOne({ _id: token } as never);
  }
  deleteCookie(event, SESSION_COOKIE, { path: '/' });
}

/** The signed-in account for this request, or null. */
export async function getAuthUserDoc(event: H3Event): Promise<UserDoc | null> {
  const token = getCookie(event, SESSION_COOKIE);
  if (!token) return null;
  const db = await getDb();
  const session = (await db
    .collection('sessions')
    .findOne({ _id: token } as never)) as SessionDoc | null;
  if (!session || session.expiresAt.getTime() < Date.now()) return null;
  return (await db
    .collection('users')
    .findOne({ _id: session.userId } as never)) as UserDoc | null;
}

export const toAuthUser = (u: UserDoc): AuthUser => ({
  id: u._id,
  email: u.email,
  name: u.name,
  dataSource: u.dataSource,
  ...(u.thingtime ? { thingtime: { username: u.thingtime.username } } : {}),
});
