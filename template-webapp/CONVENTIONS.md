# Macrobiotica — implementation conventions (read before touching a screen)

The design handoff in `design_handoff_macrobiotica_app/` is the source of truth:
`SPEC-screens.md` (layout/copy), `SPEC-behavior.md` (state/derived values),
`SPEC-tokens.md` (tokens/recipes), and `design_files/Macrobiotica App.dc.html`
(the living reference — its inline styles are authoritative where specs are
ambiguous; screen markup is inside `<x-dc>`, one `sc-if` block per screen).

## Layout & styling
- Inline `style={{ … }}` mirroring the prototype's inline styles is the norm
  here (this repo intentionally matches the prototype structure). Shared
  visuals come from `.mb-*` classes (see `app/src/styles/components.css`).
- NEVER hardcode a hex that exists as a token — use `var(--…)`.
- Helper classes in `app/src/styles/app.css`:
  `.mb-screen` (screen wrapper: flex column, 16px gap, 8px rise animation),
  `.mb-row` (reset for list-row buttons), `.mb-hoverable` (ink-wash hover),
  `.mb-kicker` (11px caps label), `.mb-mono` (Spline Sans Mono), `.mb-slider`.
- Every screen's root element: `<div className="mb-screen">…</div>`.
- List rows are real `<button className="mb-row mb-hoverable">` (or `<Link>`)
  with the prototype's paddings and a `border-top: 1px solid var(--border-subtle)`.
- Font families inline when needed: `'Newsreader', Georgia, serif` for display,
  `var(--font-mono)` for numbers/times. Kickers via `className="mb-kicker"`.

## Components (`@/components`)
- `<Icon name="chevron-right" size={16} color="var(--text-faint)" />` — lucide kebab-case names, default stroke 1.75.
- `<Button variant="primary|secondary|ghost" size="sm|md|lg">` — primary is the quiet spectrum-ring button.
- `<IconButton aria-label="…">` + `<Icon …/>` child.
- `<Badge tone="green|root|crown|…">`, `<Tag active={…}>`, `<Card raised|flat>`, `<Input>`, `<Switch checked onChange(bool)>`.
- `<BalanceMeter value={-1…1} label="…" size="sm" showLabels={false} />` — md (8px track + labels) for hero meters, sm (4px, no labels) for row minis.
- `<Avatar initials="YK" size={36} />`.
- `<ThemeToggle />` already in the shell — screens never render it except Profile's settings row.

## Data (`@/lib`)
- `useCatalog()` → `Catalog` (foods, meals, ailments, practices, courses, articles, friends, elements, clock, animals, zodiacElements, glossary, cats, cookMethods, ailmentSystems). Loaded once, `staleTime: Infinity`.
- `useLog()` → `UserLog` (`Record<'YYYY-MM-DD', { meals, checkins, practices }>`), seeded ~25 days back.
- `useProfile()` → `{ name, birthYear, settings, lessonsDone, likes }`.
- `useFeed()` → `FeedPost[]` (user posts first, then circle posts; comments merged; `liked` flag).
- Mutations (all optimistic — the UI must feel instant):
  `useSaveCheckin()`, `useLogMeal()`, `useMarkPractice()`, `useToggleLike()`,
  `useAddComment(displayName)`, `useSharePost(displayName)`, `useUpdateProfile()`, `useCompleteLesson()`.
  Call like `mutate({ date: todayKey(), t: hhmm(new Date()), v, note })`.
- Day helpers in `@/lib/day`: `todayKey()`, `dateKey(d)`, `getDay(log, key)`, `useMealById()`, `useDayAvg()`.
- Derived helpers in `@shared/derive`: `signed(v)` ("+0.30"/"−0.15"/"±0.00", U+2212/U+00B1),
  `valColor(v)` (chakra token string), `valNote(v)` (balance label), `dayNote(v)`
  (adds the gentle suggestion beyond ±0.25), `practiceStreak`, `checkinStreak`,
  `suggestedMeals(bal, meals)`, `patternTone(pattern)` → Badge tone ('crown'|'root'|'neutral').
- `zodiacFor(year)` from `@shared/mb-data`.
- Lesson done = `lesson.done || !!profile.lessonsDone[lesson.id]`.
- Loading: hooks return `undefined` while fetching — render the screen skeleton
  (cards/headers) with empty lists, never a spinner. Guard with `?? []`.

## Navigation
- Routes: `/` Today · `/diary` · `/foods` · `/foods/:id` · `/meals/:id` ·
  `/treatments` · `/treatments/:id` · `/learn` · `/learn/:lessonId` ·
  `/practices` · `/wisdom` · `/feed` · `/care` · `/care/:id` · `/profile`.
- Use `useNavigate()` / `<Link>` from `react-router`. Back buttons are ghost
  buttons navigating to the list route (e.g. "← All foods" → `/foods`).
- Deep links per spec: week columns → `/diary?d=YYYY-MM-DD`; diary/today meal
  rows → `/meals/:id`; ingredient rows (with `ref`) → `/foods/:ref`; ailment
  "Favour" rows with `ref` → `/meals/:ref`; ailment practice chips →
  `/practices?open=:id`; feed meal panels → `/meals/:id`.
- Diary reads `?d=` for the selected day; Practices reads `?open=` to expand a card.
- List state (search text, active chips, wisdom sub-tab) persists across
  back-navigation via `useSticky(key, initial)` from `@/lib/useSticky` — use a
  distinct key per field, e.g. `useSticky('foods.q', '')`.

## Voice & format (hard rules)
- Copy verbatim from the prototype/spec. Sentence case; no exclamation marks; no emoji.
- Numbers: always `signed(v)` in `var(--font-mono)`. Dates written out.
- Screens must not add their own `<h1>` — the shell renders the screen title + subtitle.
- Judgment-free tone for any new string (there should be none — copy exists for everything).

## Accessibility
- Interactive rows ≥44px targets, real buttons/links, labelled inputs
  (`aria-label` where no visible label). Range slider: `aria-label="Balance right now"`.
- Motion: only 120/200/320ms ease-out via tokens; `prefers-reduced-motion` is
  globally handled in app.css.
