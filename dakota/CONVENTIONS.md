# Dakota — implementation conventions (read before touching a screen)

Dakota is a horse training, health and riding companion. The structure is
inherited from the Macrobiotica template (`../template-webapp/` — its screens
remain the living reference for layout recipes, paddings and list-row
patterns), but the visual identity is Dakota's own.

## Brand: the tack room

Warm oat-canvas neutrals (`--oat-*`), a saddle-leather accent (`--saddle-*`),
and brass hardware (`--brass`). Signature elements:

- **The strap** — the stitched-leather hairline at the very top of the app
  (`.dk-strap`, `var(--strap)`); it replaces any rainbow/gradient hairline.
- **Leather primary buttons** — `--primary-fill` leather gradient with a
  dashed stitch inset (`.dk-btn--primary::before`). Text is `--on-accent`.
- **Brass ring marker** on the energy meter (`.dk-balance__marker`), and
  brass `--focus-ring`.
- **Type**: Fraunces (`--font-display`) for headings/wordmark, Albert Sans
  (`--font-sans`) for UI, IBM Plex Mono (`--font-mono`) for data. Never
  hardcode family names in screens — always the tokens.
- Grass/pasture UI (paddock fills, lush badges) stays green via the scale
  tokens (`--scale-centre*`), never the leather accent.

## The energy scale (core concept)

Every session and check-in scores the horse on one axis:
**−1 flat/quiet (behind the leg) · 0 forward & relaxed (the ideal) · +1 hot/tense**.
Colors run violet (flat) → green (centre) → red (hot) via `valColor(v)`;
labels via `valNote(v)`; the day average via `dayAvg`/`useDayAvg`. Feed items
reuse the same meter for their `heat` (cooling ↔ heating).

## Layout & styling

- Inline `style={{ … }}` mirroring the template screens is the norm here.
  Shared visuals come from `.dk-*` classes (see `app/src/styles/components.css`).
- NEVER hardcode a hex that exists as a token — use `var(--…)`.
- Helper classes in `app/src/styles/app.css`:
  `.dk-screen` (screen wrapper: flex column, 16px gap, 8px rise animation),
  `.dk-row` (reset for list-row buttons), `.dk-hoverable` (ink-wash hover),
  `.dk-kicker` (11px caps label), `.dk-mono` (Spline Sans Mono), `.dk-slider`.
- Every screen's root element: `<div className="dk-screen">…</div>`.
- List rows are real `<button className="dk-row dk-hoverable">` (or `<Link>`)
  with the template's paddings and a `border-top: 1px solid var(--border-subtle)`.
- Font families inline when needed: `var(--font-display)` for display,
  `var(--font-mono)` for numbers/times. Kickers via `className="dk-kicker"`.

## Components (`@/components`)

- `<Icon name="chevron-right" size={16} color="var(--text-faint)" />` — lucide
  kebab-case names from the Icon.tsx REGISTRY, plus Dakota's custom `horse`
  (a horseshoe). Default stroke 1.75.
- `<Button variant="primary|secondary|ghost" size="sm|md|lg">` — primary is the quiet spectrum-ring button.
- `<IconButton aria-label="…">` + `<Icon …/>` child.
- `<Badge tone="green|root|sacral|solar|heart|throat|third-eye|crown|success|warning|danger|info">`,
  `<Tag active={…}>`, `<Card raised|flat>`, `<Input>`, `<Switch checked onChange(bool)>`.
- `<BalanceMeter value={-1…1} label="…" size="sm" showLabels={false} />` — the
  energy meter (labels read Flat/Hot). md for hero meters, sm (4px, no labels) for row minis.
- `<Avatar initials="DK" size={36} />`.
- `<ThemeToggle />` already in the shell — screens never render it except Profile's settings row.

## Data (`@/lib`)

- `useCatalog()` → `Catalog` (disciplines, levels, exercises, feedCats, feeds,
  ailmentSystems, ailments, practices, courses, articles, friends, breeds,
  gaits, markings, ages, signals, glossary, condition). Loaded once, `staleTime: Infinity`.
- `useLog()` → `UserLog` (`Record<'YYYY-MM-DD', { sessions, checkins, practices, care }>`), seeded ~4 weeks back.
- `useHorses()` → `Horse[]` (the user's herd; demo user has Dakota and Banjo).
- `useRides()` → `Ride[]` newest-first, GPS points included.
- `usePaddocks()` → `Paddocks` (paddocks, gates, horse locations, move history).
- `useProfile()` → `{ name, yardName, since, settings, lessonsDone, likes }`.
- `useFeed()` → `FeedPost[]` (user posts first, then circle posts; `liked` flag).
- Mutations (all optimistic — the UI must feel instant):
  `useSaveCheckin()` (`{date, horse, t, v, note}`), `useLogSession()`
  (`{date, ex, horse, t, mins, score, note}`), `useMarkPractice()` (`{date, id}`),
  `useLogCare()` (`{date, horse, type, t, note}`), `useAddHorse()`,
  `useUpdateHorse()` (`{id, patch}`), `useSaveRide()`, `useMoveHorse()`
  (`{horse, to}`), `useToggleLike()`, `useAddComment(displayName)`,
  `useSharePost(displayName)` (`{text, ex?, ride?}`), `useUpdateProfile()`,
  `useCompleteLesson()`.
- Day helpers in `@/lib/day`: `todayKey()`, `dateKey(d)`, `getDay(log, key)`,
  `useExerciseById()`, `useHorseById()`, `useDayAvg()`.
- Ride helpers in `@/lib/geo`: `trackToSvg(points, w, h)` (self-contained SVG
  track — no map tiles), `rideStats(points)`, `fmtKm/fmtMin/fmtKmh/fmtClock`.
- Derived helpers in `@shared/derive`: `signed(v)` ("+0.30"/"−0.15"/"±0.00",
  U+2212/U+00B1), `valColor(v)` (scale token string), `valNote(v)` (energy
  label), `dayNote(v)`, `dayAvg(day)`, `practiceStreak`, `sessionStreak`,
  `suggestedExercises(bal, exercises)`, `urgencyTone(urgency)` (Badge tone),
  `careDue(care, now)` / `careDueSoon(horses, now)` / `dueLabel(inDays)`
  (farrier/worming/dental/vaccination due dates), `horseAge(born, now)`,
  `handsLabel(hands)`, `hhmm(d)`, `CARE_LABELS`.
- Lesson done = `lesson.done || !!profile.lessonsDone[lesson.id]`.
- Loading: hooks return `undefined` while fetching — render the screen skeleton
  (cards/headers) with empty lists, never a spinner. Guard with `?? []`.

## Arena diagrams

Exercises carry `arena` (`'20x40' | '20x60' | 'none'`) and `paths` (SVG path
strings). Draw in a `viewBox="0 0 200 400"` (or 200×600) with 10 units per
metre: sand fill `var(--surface-sunken)`, wall `var(--border-strong)`, letters
in `var(--text-faint)` 11px mono, route in `var(--accent-strong)` stroke 3 with
a small start dot and arrowhead. Letters (20x40): A(100,400) C(100,0) K(0,360)
F(200,360) E(0,200) B(200,200) H(0,40) M(200,40); centre line D/X/G. 20x60 adds
V(0,420) P(200,420) S(0,180) R(200,180) with E/B at y=300.

## Navigation

- Routes: `/` Today · `/diary` · `/horses` · `/horses/:id` · `/arena` ·
  `/arena/:id` · `/rides` · `/rides/:id` · `/paddocks` · `/health` ·
  `/health/:id` · `/feedroom` · `/feedroom/:id` · `/learn` · `/learn/:lessonId` ·
  `/practices` · `/wisdom` · `/feed` · `/circle` · `/circle/:id` · `/profile`.
- Use `useNavigate()` / `<Link>` from `react-router`. Back buttons are ghost
  buttons navigating to the list route (e.g. "← All exercises" → `/arena`).
- Deep links: week columns → `/diary?d=YYYY-MM-DD`; diary/today session rows →
  `/arena/:ex`; horse chips → `/horses/:id`; ride rows → `/rides/:id`; feed
  exercise panels → `/arena/:ex`; practices reads `?open=` to expand a card;
  diary reads `?d=` for the selected day.
- List state (search text, active chips, wisdom sub-tab) persists across
  back-navigation via `useSticky(key, initial)` from `@/lib/useSticky` — use a
  distinct key per field, e.g. `useSticky('arena.q', '')`.

## Voice & format (hard rules)

- Sentence case; no exclamation marks; no emoji. Warm, practical horsemanship
  language — an experienced instructor talking to a friend.
- Numbers: energy values always `signed(v)` in `var(--font-mono)`. Dates written out.
- Screens must not add their own `<h1>` — the shell renders the screen title + subtitle.
- Kind, judgment-free tone: a missed day or a hot horse is information, never failure.

## Accessibility

- Interactive rows ≥44px targets, real buttons/links, labelled inputs
  (`aria-label` where no visible label). Range slider: `aria-label="How did the horse feel"`.
- Motion: only 120/200/320ms ease-out via tokens; `prefers-reduced-motion` is
  globally handled in app.css.
