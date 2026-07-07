# Macrobiotica 🌱

All-in-one app for learning and keeping a macrobiotic practice — yin/yang food
energetics, daily balance check-ins, meal and practice tracking, food/treatment
reference, lessons, and a small social layer.

Built from the design handoff in `design_handoff_macrobiotica_app/` (10-screen
high-fidelity prototype + full design system). The prototype's inline styles,
copy, and behavior are the source of truth — see `CONVENTIONS.md`.

## Stack

- **Vite + React 19 + TypeScript** SPA — `app/`
- **React Router v7 (library mode)** — `createBrowserRouter` data mode, no framework mode
- **TanStack Query v5** — all mutations optimistic
- **Nitro** API server — `server/routes/api/**`, deployed with the `vercel` preset
- **MongoDB** (official driver) — dev: non-authed `mongodb://localhost:27017`, db `macrobiotica`

## Development

```sh
pnpm install
pnpm seed   # seeds catalog + ~25 days of demo diary history into local Mongo
pnpm dev    # vite (4780) + nitro (4781) together
```

### Ports & URLs (project-specific — do not reuse elsewhere)

| What | Where |
| --- | --- |
| Vite SPA (dev) | http://127.0.0.1:4780 |
| Nitro API (dev) | http://127.0.0.1:4781 (proxied at `/api` via Vite) |
| Public dev URL (Tailscale Funnel) | https://lopus-macbook-pro-2.tail9606f9.ts.net:4780 |
| Production (Vercel) | see `VERCEL_DEPLOYMENTS.md` |

Both dev servers bind loopback only; the Funnel proxies the public hostname to
127.0.0.1:4780. That hostname is allow-listed in `vite.config.ts`
(`server.allowedHosts`) — update it there if the tailnet name changes.
Dev/preview tabs are title-prefixed `[LC]` / `[TS]` / `[VC]` by `app/index.html`.

### PM2

The dev servers run under PM2 via the repo-local `ecosystem.config.cjs`:

```sh
pm2 start ecosystem.config.cjs   # macrobiotica-vite + macrobiotica-nitro
pm2 save
```

## Accounts & data sources

Email + password accounts (`/auth`): scrypt-hashed passwords in a `users`
collection, opaque session tokens in a `sessions` collection (30-day TTL),
`mb-session` httpOnly cookie.

Every API request resolves a **data context**:

- **Signed out (default)** → the **live UGC db, read-only**: visitors see the
  real circle feed; personal screens start empty; any write returns 401 and
  the client lands on `/auth`.
- **Sample data on** (Profile → Settings, available to everyone) → the shared
  example data (demo user in the primary db) — writable sandbox for tutorials
  and previews, resettable with `pnpm seed`. Signed-out visitors keep the
  preference in an `mb-sample` cookie; accounts keep it on the account
  (`users.dataSource`), which is mirrored to the cookie so signing out keeps
  the same view.
- **Signed in, sample off** (the default for new accounts) → the account's own
  state in the **UGC db** (`MONGODB_DB_UGC`, default `macrobiotica_ugc`):
  per-user diary/profile/lessons, a real multi-user feed (posts from all
  accounts, per-user likes in a `likes` collection).

The catalog (foods, meals, ailments, courses, wisdom) always comes from the
primary db.

## Environment

Copy `.env.example`. `MONGODB_URI` defaults to `mongodb://localhost:27017`
(non-authed local Mongo), db name `macrobiotica` (`MONGODB_DB`), UGC db name
`macrobiotica_ugc` (`MONGODB_DB_UGC`).

## Build & deploy (Vercel)

```sh
pnpm build                 # vite build → dist/, then nitro build --preset vercel → .vercel/output
pnpm verify:vercel-output  # asserts the static SPA shell + filesystem routing are in the output
npx vercel deploy --prebuilt
```

The Vercel project is connected to the private GitHub repo
(`lopugit/macrobiotica`) — pushes build automatically. **Serverless functions
cannot reach localhost MongoDB**: set `MONGODB_URI` to a hosted Mongo (e.g.
Atlas) in the Vercel dashboard (Settings → Environment Variables), then run
`pnpm seed` once with the same `MONGODB_URI` to populate it. Until then the
static app loads but `/api/*` fails at runtime.

## Repo map

- `app/` — SPA (screens in `app/src/screens`, shell in `app/src/shell`, DS components in `app/src/components`)
- `app/src/styles/` — design tokens ported verbatim from the handoff + `components.css`
- `server/` — Nitro API routes + Mongo utils (client cached globally for serverless reuse)
- `shared/` — typed port of `mb-data.js` (ids stable) + derived-value helpers
- `scripts/seed.ts` — `pnpm seed`
- `design_handoff_macrobiotica_app/` — the design handoff (specs, prototype, screenshots)
