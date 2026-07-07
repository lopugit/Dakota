# Design tokens & component recipes

**Authoritative source: `design_files/_ds/macrobiotica-design-system-…/tokens/*.css`** — port these files as your global theme (they're clean CSS custom properties, light on `:root`, dark on `[data-theme="dark"]`). `components/components.css` holds the `.mb-*` component classes. Key values below for quick reference.

## Color (light theme; dark equivalents in colors.css)
- Greyscale ramp with faint leaf-grey warmth: `--grey-0 #FFFFFF … --grey-950 #141613`. Page `#F5F6F3`, card `#FFFFFF`, sunken `#ECEEE9`.
- Text: primary `#1F211D` · secondary `#4B4F47` · muted `#878C83` · faint `#ABB0A7`.
- Borders: subtle `#E0E3DC` · strong `#CDD1C9`.
- Accent green: `--accent #B5D8AD` (green-300); strong `#456C3F`; checked controls `#5A8A52`; focus ring `#77A96E`; tint `#E3EFDF`.
- Chakra spectrum (earthy, = yin→yang scale, violet→red): crown `#7D5798` · third-eye `#5A5F99` · throat `#47708E` · heart `#55804E` · solar `#9C7F2E` · sacral `#B06A2F` · root `#A5493F` (+ `-soft` tints; dark theme uses lifted variants).
- Semantic maps onto chakra: danger←root, warning←sacral, success←heart, info←throat.
- `--spectrum-gradient`: 90° crown→third-eye→throat→heart→solar→sacral→root (the 2px app hairline + BalanceMeter track).
- Primary buttons: **quiet** — `--primary-fill` (`#ECEEE9` light / `#272B24` dark) + ink text + 1px `--spectrum-pastel` gradient ring + very dim spectrum glow. Never a solid color fill.

## Type
- Newsreader (serif, 500) — headlines/screen titles/dialog titles/italic asides; tracking −0.01…−0.015em at display sizes.
- Hanken Grotesk — all UI text.
- Spline Sans Mono — numbers, timestamps, token-ish metadata.
- Scale ≈1.25: 11, 12, 13.5–14 (body UI), 15, 18, 20, 22, 26, 30, 32… Kickers: 11px/600/0.08em/uppercase.
- All Google Fonts (substitutes; no binaries).

## Layout & shape
- Spacing: 4px base scale; 20px page gutters; 16px between cards; content column max 680px.
- Radii: 6 tooltip · 10 inputs/inline panels · 14 cards · 20 dialogs/sheets · full pills for buttons/tags/badges.
- Shadows: `--shadow-sm/md/lg`, low and diffuse; dark theme leans on borders.
- Hairlines everywhere: 1px `--border-subtle` (cards, row dividers), `--border-strong` (inputs).

## Component classes (from components.css — reuse, don't reinvent)
- `.mb-btn` + `--primary` / `--secondary` / `--ghost` / `--sm` — pill buttons; primary = quiet fill + spectrum ring/glow.
- `.mb-icon-btn` — 36px round icon button.
- `.mb-badge` + `--green`/`--root`/`--crown`… — small tinted labels.
- `.mb-tag` (+ `--active` inverts to ink) — filter chips.
- `.mb-input` — 10px radius, strong border; focus = green border + 3px tint glow.
- `.mb-card` (+ `--raised`, `--flat`).
- React components in the bundle (reference for behavior): Button, IconButton, Badge, Tag, Card, Input, Select, Checkbox, Radio, Switch, Tabs, Dialog, Toast, Tooltip, Icon (Lucide wrapper), ThemeToggle, **BalanceMeter**.

## BalanceMeter (signature — rebuild faithfully)
Track: `--spectrum-gradient`, full-radius, 8px (`sm`, no labels) or ~12px with 陰/陽 end labels + caption label; marker: ink-bordered dot positioned at `(value+1)/2 * 100%`, glides 320ms ease-out. Props in prototype: `value` (−1…+1), `label`, `size`, `showLabels`.

## Iconography
Lucide only (`lucide-react`), 1.75px stroke (2px active), 16–22px, monochrome. Names used: sun, calendar-days, carrot, newspaper, menu, leaf, book-open, sprout, moon, heart, user, soup, message-circle, chevron-right/left/up/down, x, wheat, droplets, flame, scale, plus, search.

## Voice (copy rules for any new strings)
Calm, plain-spoken, judgment-free; "you", never "I"; sentence case everywhere; no exclamation marks; no emoji; Japanese terms sparingly (explained on first lesson use); 陰/陽 kanji as quiet decoration only; numbers signed mono; dates written out.
