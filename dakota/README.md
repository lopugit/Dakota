# Dakota 🐴

The horse diary — an all-in-one app for horse training, health and riding:
arena schooling figures with route diagrams, session scores and notes, daily
energy check-ins, GPS ride tracking, care due-dates (farrier, worming, dental,
vaccinations), paddock rotation with gates, a health and feed-room reference,
horsemanship lessons, and a small social layer for the riders around you.

Built for a two-horse family yard, sized for any. Every session and check-in
scores the horse on one axis: **−1 flat/quiet · 0 forward & relaxed · +1
hot/tense** — the energy scale that runs through the whole app.

The structure is inherited from `../template-webapp/` (Macrobiotica), but the
identity is Dakota's own — **the tack room**: oat-canvas neutrals, a
saddle-leather accent with stitched detailing, brass hardware, Fraunces
display type, and a stitched-leather "strap" running along the top of the
app. See `CONVENTIONS.md` (Brand section) before touching a screen.

## Stack

- **Vite + React 19 + TypeScript** SPA — `app/`
- **React Router v7 (library mode)** — `createBrowserRouter` data mode
- **TanStack Query v5** — all mutations optimistic
- **Nitro** API server — `server/routes/api/**`, deployable with the `vercel` preset
- **MongoDB** (official driver) — dev: non-authed `mongodb://localhost:27017`, db `dakota`

## Development

```sh
pnpm install
pnpm seed   # seeds the catalog + the demo yard (2 horses, paddocks, rides, ~4 weeks of diary)
pnpm dev    # vite (4790) + nitro (4791) together
```

### Ports & URLs (project-specific — do not reuse elsewhere)

| What | Where |
| --- | --- |
| Vite SPA (dev) | http://127.0.0.1:4790 |
| Nitro API (dev) | http://127.0.0.1:4791 (proxied at `/api` via Vite) |
| Public dev URL (Tailscale Funnel) | https://lopus-macbook-pro-2.tail9606f9.ts.net:4790 |
| Production (Vercel) | see `VERCEL_DEPLOYMENTS.md` |

Both dev servers bind loopback only; the Funnel proxies the public hostname to
127.0.0.1:4790. That hostname is allow-listed in `vite.config.ts`
(`server.allowedHosts`) — update it there if the tailnet name changes.
Dev/preview tabs are title-prefixed `[LC]` / `[TS]` / `[VC]` by `app/index.html`.

### PM2

The dev servers run under PM2 via the repo-local `ecosystem.config.cjs`:

```sh
pm2 start ecosystem.config.cjs   # dakota-vite + dakota-nitro
pm2 save
```

## Accounts & data sources

Email + password accounts (`/auth`): scrypt-hashed passwords in a `users`
collection, opaque session tokens in a `sessions` collection (30-day TTL),
`dk-session` httpOnly cookie.

Every API request resolves a **data context**:

- **Signed out (default)** → the **live UGC db, read-only**: visitors see the
  real circle feed; personal screens start empty; any write returns 401 and
  the client lands on `/auth`.
- **Example data on** (Profile → Settings, available to everyone) → the shared
  demo yard (demo user in the primary db) — a writable sandbox with Dakota the
  stock-horse mare, Banjo the pony, paddocks, rides and diary history.
  Resettable with `pnpm seed`. Signed-out visitors keep the preference in a
  `dk-sample` cookie; accounts keep it on the account (`users.dataSource`).
- **Signed in, example off** (the default for new accounts) → the account's
  own yard in the **UGC db** (`MONGODB_DB_UGC`, default `dakota_ugc`):
  per-user horses, diary, rides, paddocks, profile, and a real multi-user feed.

The catalog (exercises, feeds, ailments, practices, courses, wisdom) always
comes from the primary db.

## What's inside (seeded catalog)

- **24 arena exercises** across Dressage, Pole work, Jumping, Groundwork and
  Western — each with an SVG route diagram (20×40 or 20×60 arena), aims,
  ride-it steps, common faults with fixes.
- **30 feeds** on the cooling↔heating scale · **16 ailments** with signs,
  first response and when-to-call-the-vet · **12 daily practices** ·
  **5 courses / 22 illustrated lessons** · breeds, gaits, markings, horse-age
  table, body-language signals, body-condition scores and a glossary.
- **The demo yard**: two horses with full lineage and ownership history, five
  paddocks with gates and rotation history, six GPS rides, and four weeks of
  believable diary.

## Build & deploy (Vercel)

```sh
pnpm build                 # vite build → dist/, then nitro build --preset vercel → .vercel/output
pnpm verify:vercel-output  # asserts the static SPA shell + filesystem routing are in the output
npx vercel deploy --prebuilt
```

**Serverless functions cannot reach localhost MongoDB**: set `MONGODB_URI` to
a hosted Mongo (e.g. Atlas) in the Vercel dashboard, then run `pnpm seed` once
with the same `MONGODB_URI` to populate it.

## Repo map

- `app/` — SPA (screens in `app/src/screens`, shell in `app/src/shell`, DS components in `app/src/components`)
- `app/src/styles/` — design tokens (energy-scale spectrum) + `components.css`
- `server/` — Nitro API routes + Mongo utils (client cached globally for serverless reuse)
- `shared/` — domain types, derived-value helpers (`derive.ts`), seed catalog (`data/*`, aggregated by `dk-data.ts`)
- `scripts/seed.ts` — `pnpm seed`
