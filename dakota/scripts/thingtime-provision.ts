/**
 * Provision the Dakota service account on Thingtime.
 *
 *   pnpm thingtime:provision [--force]
 *
 * POSTs /api/v1/auth/service-account (public self-service endpoint) and
 * stores the returned non-expiring bearer token in dakota/.env as
 * THINGTIME_SERVICE_TOKEN. The token is an API key — .env is gitignored and
 * the token is never printed in full. Idempotent: refuses to overwrite an
 * existing token unless --force is passed (each run creates a brand-new
 * account; the old token keeps working until rotated away).
 *
 * The account must verify its email within seven days — Thingtime sends the
 * link to THINGTIME_SERVICE_EMAIL.
 */
import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = join(root, '.env');

/** Minimal .env reader — enough for KEY=value lines, no expansion. */
function readEnvFile(): Record<string, string> {
  if (!existsSync(envPath)) return {};
  const out: Record<string, string> = {};
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (m) out[m[1]] = m[2];
  }
  return out;
}

/** Upsert KEY=value lines into .env, preserving everything else. */
function patchEnvFile(values: Record<string, string>): void {
  let text = existsSync(envPath) ? readFileSync(envPath, 'utf8') : '';
  for (const [key, value] of Object.entries(values)) {
    const line = `${key}=${value}`;
    const re = new RegExp(`^${key}=.*$`, 'm');
    text = re.test(text) ? text.replace(re, line) : text + (text.endsWith('\n') || !text ? '' : '\n') + line + '\n';
  }
  writeFileSync(envPath, text, { mode: 0o600 });
}

const fileEnv = readEnvFile();
const env = (key: string, fallback = ''): string =>
  process.env[key]?.trim() || fileEnv[key]?.trim() || fallback;

const BASE = env('THINGTIME_BASE_URL', 'https://thingtime.com').replace(/\/+$/, '');
const EMAIL = env('THINGTIME_SERVICE_EMAIL', 'lopudesigns+dakota@gmail.com');
const USERNAME = env('THINGTIME_SERVICE_USERNAME', 'dakota-app');
const force = process.argv.includes('--force');

/** Plus-addressed fallbacks keep verification mail in the same inbox. */
function emailCandidates(email: string): string[] {
  const m = /^([^+@]+)(\+[^@]*)?@(.+)$/.exec(email);
  if (!m) return [email];
  const [, local, , domain] = m;
  return [
    email,
    `${local}+dakota@${domain}`,
    `${local}+dakota-${randomBytes(2).toString('hex')}@${domain}`,
  ].filter((e, i, all) => all.indexOf(e) === i);
}

async function provision(username: string, email: string) {
  const res = await fetch(`${BASE}/api/v1/auth/service-account`, {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify({
      serviceName: 'Dakota',
      username,
      email,
      displayName: 'Dakota — the horse diary',
      meta: { app: 'dakota' },
    }),
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { status: res.status, data };
}

async function main() {
  if (env('THINGTIME_SERVICE_TOKEN') && !force) {
    console.log('THINGTIME_SERVICE_TOKEN already set — nothing to do (use --force to rotate).');
    return;
  }

  let username = USERNAME;
  let email = EMAIL;
  let { status, data } = await provision(username, email);

  // Emails and usernames are global on Thingtime — walk the fallbacks on conflict.
  for (const candidate of emailCandidates(EMAIL).slice(1)) {
    if (!(status === 409 || /email already/i.test(String(data.error ?? '')))) break;
    email = candidate;
    console.log(`Email "${EMAIL}" already registered — retrying as "${email}".`);
    ({ status, data } = await provision(username, email));
  }
  if (status >= 400 && /username|taken|exists|in use/i.test(String(data.error ?? ''))) {
    username = `${USERNAME}-${randomBytes(2).toString('hex')}`;
    console.log(`Username "${USERNAME}" unavailable — retrying as "${username}".`);
    ({ status, data } = await provision(username, email));
  }

  if (status >= 400 || data.ok === false || typeof data.accessToken !== 'string') {
    console.error(`Provisioning failed (HTTP ${status}): ${String(data.error ?? 'unknown error')}`);
    process.exitCode = 1;
    return;
  }

  patchEnvFile({
    THINGTIME_BASE_URL: BASE,
    THINGTIME_SERVICE_TOKEN: data.accessToken,
    THINGTIME_SERVICE_USERNAME: username,
    THINGTIME_SERVICE_EMAIL: email,
  });

  const token = data.accessToken;
  console.log('Service account provisioned ✓');
  console.log(`  base:      ${BASE}`);
  console.log(`  username:  ${username}`);
  console.log(`  email:     ${email}`);
  console.log(`  token:     ${token.slice(0, 8)}…${token.slice(-4)} → saved to dakota/.env`);
  console.log(`  storage:   ${String(data.storageAllowanceBytes ?? 'unknown')} bytes allowed`);
  if (data.verificationRequiredBy) {
    console.log(
      `  ⚠ verify the email sent to ${email} before ${String(data.verificationRequiredBy)}`,
    );
  }
  console.log('For Vercel, add THINGTIME_SERVICE_TOKEN + THINGTIME_BASE_URL to the project env.');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
