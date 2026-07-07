# Claude Code prompt — Macrobiotica implementation

Paste everything below into Claude Code from the repo root (with this handoff folder committed at `design_handoff_macrobiotica_app/`).

---

Implement the **Macrobiotica** web app from the design handoff in `design_handoff_macrobiotica_app/`.

**Read first, in order:**
1. `README.md` — what this is and the non-negotiables
2. `SPEC-screens.md` — all 10 screens: layout, components, exact copy
3. `SPEC-behavior.md` — interactions, state, data model, derived values
4. `SPEC-tokens.md` — design tokens, component recipes, voice rules
5. Open `design_files/Macrobiotica App.dc.html` in a browser — the living reference for every screen and interaction. Its inline styles are authoritative where specs are ambiguous. `screenshots/` (if present) shows expected rendering.

## Stack (fixed — do not substitute)
- **Vite + React + TypeScript** SPA.
- **React Router in library mode** (`react-router` v7+, `createBrowserRouter` + `RouterProvider` data mode). Explicitly NOT framework mode — no `@react-router/dev` plugin, no file-based routes, no loaders-with-SSR.
- **Nitro** (nitropack) as the API server — file-based `server/routes/api/**` handlers, `defineEventHandler`.
- **MongoDB** via the official `mongodb` Node driver. Dev connection: `mongodb://localhost:27017` (non-authed, running locally), db name `macrobiotica`. Read from `MONGODB_URI` env var with that localhost default.
- **Vercel** hosting: Nitro `preset: 'vercel'`; the Vite build ships as Nitro public assets with an SPA fallback so React Router owns all non-`/api` paths.

### Architecture
- Single repo: `app/` (Vite SPA) + `server/` (Nitro) + `scripts/seed.ts`, or Nitro at root with the SPA in `app/` — your call, keep it simple.
- Dev: two processes (`vite` + `nitro dev`) with a Vite `server.proxy` sending `/api` → Nitro. One `pnpm dev` script runs both.
- Build: `vite build` output copied into Nitro's `publicAssets`; `nitro build --preset vercel` emits `.vercel/output` (static SPA + serverless API). Include `vercel.json`/docs so `vercel deploy` works from the repo.
- ⚠️ On Vercel, serverless functions cannot reach localhost MongoDB — read `MONGODB_URI` from env in prod (Atlas or another hosted Mongo) and document setting it in the Vercel dashboard. Cache the Mongo client across invocations (global singleton) for serverless reuse.

### Data
- Port `design_files/mb-data.js` into typed collections and write `scripts/seed.ts` (`pnpm seed`): `foods`, `meals`, `ailments`, `practices`, `courses` (+ articles), `posts`, `friends`, `wisdom` (elements/clock/glossary). Keep ids stable. Also seed ~25 days of demo diary history via the ported `seedLog`.
- User state lives in Mongo too (single demo user is fine): `log` (day docs: meals/checkins/practices), `lessons_done`, `likes`, `user_posts`, `comments`, `profile` (name, birth year, settings). Replaces the prototype's localStorage keys in `SPEC-behavior.md`.
- API (Nitro): `GET /api/catalog` (foods+meals+ailments+practices+courses+wisdom, cacheable), `GET /api/log?from&to`, `POST /api/log/checkin | /api/log/meal | /api/log/practice`, `GET /api/feed`, `POST /api/feed/post | /api/feed/like | /api/feed/comment`, `GET/PUT /api/profile`, `POST /api/lessons/:id/complete`. Zod-validate bodies.
- Client: TanStack Query over these endpoints; optimistic updates so interactions feel as instant as the prototype. Theme + active tab may stay in localStorage (`mb-theme`, `mb-tab`).

### UI
- Port `design_files/_ds/…/tokens/*.css` verbatim as the global theme (`[data-theme="dark"]` for dark). Never hardcode a hex that exists as a token.
- Build the component library first: Button (quiet primary w/ spectrum ring), Badge, Tag, Input, Switch, Card, Icon (lucide-react), ThemeToggle, **BalanceMeter** — per `SPEC-tokens.md` and `design_files/_ds/…/components/components.css`.
- Then the shell (bottom tab bar <900px w/ More-sheet; left rail ≥900px; 2px spectrum hairline; 680px content column), then the 10 screens per `SPEC-screens.md`.
- Routes: `/` (today), `/diary`, `/foods`, `/foods/:id`, `/meals/:id`, `/treatments`, `/treatments/:id`, `/learn`, `/learn/:lessonId`, `/practices`, `/wisdom`, `/feed`, `/care`, `/care/:id`, `/profile`.
- Motion: 120/200/320ms ease-out only; 8px screen rise; gliding balance marker; respect `prefers-reduced-motion`.
- Accessibility: `aria-current` nav, dialog semantics + focus trap on the More sheet, labeled slider, ≥44px targets, keyboard operable.

**Definition of done:** with Mongo seeded, side-by-side with the prototype in both themes at 390px and 1280px the screens are visually indistinguishable; every interaction in `SPEC-behavior.md` works against the API; `pumpkin soup` is findable in Foods search; a check-in saved on Today appears in Diary with the correct dot color after a hard refresh (i.e. persisted, not just client state); `vercel build` succeeds.

**Do not:** use React Router framework mode or Next.js; invent colors/spacing outside the tokens; use solid-color primary buttons; add emoji or exclamation marks to copy; add features not in the specs without asking.
