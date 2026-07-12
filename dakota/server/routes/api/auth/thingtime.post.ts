import { createError, defineEventHandler } from 'h3';
import { thingtimeAuthBody } from '../../../utils/schemas';
import { readValidatedBodyZ } from '../../../utils/body';
import { getUgcDb } from '../../../utils/mongo';
import { startSession, toAuthUser, upsertThingtimeUser } from '../../../utils/auth';
import { TtError, ttLogin, ttMe, ttRegister } from '../../../utils/thingtime';
import { hydrateFromThingtime } from '../../../utils/ttstore';

/**
 * POST /api/auth/thingtime — sign in (or sign up) with a Thingtime account.
 *
 * Credentials are exchanged directly with Thingtime; Dakota keeps only the
 * minted JWT (server-side, on the user doc) and its own dk-session cookie.
 * After auth, the account's Dakota things are hydrated from Thingtime into
 * the UGC db so this environment starts in sync with the durable copy.
 */
export default defineEventHandler(async (event) => {
  const body = await readValidatedBodyZ(event, thingtimeAuthBody);

  let auth: Awaited<ReturnType<typeof ttLogin>>;
  try {
    auth =
      body.mode === 'signup'
        ? await ttRegister({
            username: body.username,
            password: body.password,
            email: body.email!,
            displayName: body.name || undefined,
          })
        : await ttLogin(body.username, body.password);
  } catch (err) {
    if (err instanceof TtError) {
      throw createError({
        statusCode: err.status >= 500 ? 502 : err.status,
        statusMessage: err.message,
      });
    }
    throw createError({ statusCode: 502, statusMessage: 'Thingtime is unreachable right now' });
  }

  // login returns a minimal user — /auth/me fills in email + display name.
  const me = await ttMe(auth.token).catch(() => null);
  const user = await upsertThingtimeUser(
    {
      id: auth.user.id,
      username: auth.user.username,
      email: me?.email,
      displayName: me?.displayName,
    },
    auth.token,
  );

  try {
    const applied = await hydrateFromThingtime(await getUgcDb(), {
      token: auth.token,
      scope: `u:${auth.user.id}`,
    });
    if (applied) console.log(`[thingtime] hydrated ${applied} docs for ${auth.user.username}`);
  } catch (err) {
    console.warn('[thingtime] hydration failed (continuing with local data):', err);
  }

  await startSession(event, user._id);
  return { user: toAuthUser(user) };
});
