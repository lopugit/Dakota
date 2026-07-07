# Behavior, state & data spec

## Data model (port from `design_files/mb-data.js`)
The prototype's seed module is production-shaped; turn each export into a table/collection:

- `FOODS` — { id, n(ame), cat, yy (−1…+1 yin/yang), note }. ~48 items, 7 categories.
- `COOK_METHODS` — { m(ethod), shift, note }. Preparation moves a food's value: `display = clamp(food.yy + shift, −1, 1)`.
- `MEALS` — { id, n, yy (whole-meal balance), time, season, desc, ingredients[{ n, ref→food id, amt, yy, note }], process[{ s(tep), e (energy effect, signed), note }], comments[{ who, t }] }. Net preparation effect = Σ process.e.
- `AILMENTS` — { id, n, system, pattern, signs[], eat[{ n, ref→meal id?, why }], remedies[{ n, how }], practices[→ids], avoid[], note }.
- `PRACTICES` — { id, n, icon (lucide name), tag, desc, steps[], why }.
- `COURSES` — { id, title, lessons[{ id, t, min, done }] }; `ARTICLES[lessonId]` — block array: { t: 'h'|'p'|'quote'|'list'|'aside', x }.
- `POSTS`, `FRIENDS` (with `trend`: last-7-day values), `ELEMENTS`, `CLOCK`, `ANIMALS` + `zodiacFor(year)`, `GLOSSARY`.

### Derived values
- **Day average** = mean of (all check-in values + logged meals' yy). Null when empty.
- **Value → color** (dots, bars): ≤−0.5 crown/violet · ≤−0.25 third-eye · <−0.05 throat · ±0.05 heart/green · ≤0.25 solar · ≤0.5 sacral · else root/red. Use the chakra tokens, never raw hex.
- **Value → label**: "Strongly yin — expansive and cooling" / "More yin — light and cooling" / "A little yin of centre" / "Near centre — balanced" / "A little yang of centre" / "More yang — warming and grounding" / "Strongly yang — contractive".
- **Number format**: sign always shown, U+2212 minus, 2 decimals ("+0.30", "−0.15", "±0.00").
- **Practice streak**: consecutive days (back from today, today optional) containing the practice id.
- **Suggested meals for a friend**: bal>0.1 → meals with yy<0; bal<−0.1 → yy>0.15; else |yy|<0.2. Take 3.

## User state (localStorage in prototype → DB in production)
| Key | Contents |
|---|---|
| `mb-theme` | 'light' \| 'dark' |
| `mb-tab` | last active screen |
| `mb-log-user` | { [YYYY-MM-DD]: { meals[{id,t}], checkins[{t,v,note}], practices[ids] } } — merged over seeded history |
| `mb-lessons` | { [lessonId]: true } |
| `mb-likes` | { [postId]: bool } |
| `mb-posts-user`, `mb-comments-user` | user's posts / comments per post |
| `mb-name`, `mb-birth-year`, `mb-settings` | profile fields |

Prototype seeds ~25 days of deterministic history (`seedLog`) so the calendar/trends read well — replace with real user data; keep a demo-seed path for empty accounts.

## Interactions
- **Check-in**: "Rate my balance now" → inline panel; slider updates label+value live; Save appends { time HH:MM, v, note } to today, recomputes day average, collapses panel. Multiple check-ins per day expected — timestamped list.
- **Meal logging**: from Today picker (search-as-you-type) or "Log this meal today" on meal detail (navigates back to Today). Timestamped now.
- **Navigation state**: active tab persisted; back buttons within Foods/Treatments/Learn/Care return to that screen's list state. Deep-links: week columns → Diary day; diary/today meal rows → meal detail; ingredient rows → food detail; ailment "Favour" rows → meal detail; ailment practice chips → Practices; feed meal panels → meal detail. In production use routes (`/foods/pumpkin-soup`) instead of ephemeral state.
- **Feed**: like toggles (+1, accent heart); comment appends under user's display name ("You" fallback); share requires text, attaches at most one meal chip, prepends post "Now".
- **Learn**: "Mark complete" fills lesson dot, advances course progress bar and "Continue" card; "Next:" navigates within course.
- **Theme**: toggle sets `data-theme` on `<html>` + persists. All tokens theme-aware; no component changes.
- **Responsive switch** at 900px (matchMedia in prototype; CSS/container queries fine in production).

## Motion
Calm only: 120/200/320ms ease-out. Screen enter: 8px rise 200ms (never animate opacity of whole screens). Balance marker glides 320ms. Progress bars 320ms width. Sheet: 200ms rise + scrim fade. Hover: translucent ink wash `--surface-hover`; press `--surface-active`; no scale/bounce. Respect `prefers-reduced-motion`.

## Accessibility
- Nav buttons: `aria-current="page"`; sheets: dialog semantics + focus trap + Esc (prototype omits — add).
- All rows are real `<button>`s ≥44px; slider is a labeled `<input type=range>`.
- Contrast: text tokens meet AA on both themes (from DS).

## Production notes
- Replace localStorage with per-user DB; keep optimistic UI (interactions feel instant in the prototype).
- Search is client-side substring; fine to keep client-side over the full catalog at this size.
- Zodiac (`zodiacFor`) is pure math — port as util. Guard years <1900/>2100 (renders nothing).
- Dates: prototype uses local timezone `YYYY-MM-DD` keys; keep timezone-local day bucketing.
