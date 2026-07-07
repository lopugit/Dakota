# Macrobiotica Design System

**Macrobiotica** is an all-in-one app for learning and maintaining macrobiotics — in general, in your own life, and for the lives of the people you cook and care for. The product teaches the philosophy (yin/yang, food energetics, seasonal cooking), tracks daily practice (meals, balance, chewing), and extends that care to others (family, clients).

## Sources
- Local folder `macrobiotica/` was attached but contained no files; the user confirmed there is no existing repo. **Everything here is authored from scratch** against the brief: *mainly greyscale, light/dark theme toggle, light pastel green accent, and rainbow chakra / macrobiotic yin-yang principle colors.*
- No logo, font binaries, imagery, or prior product copy were provided. **There is no drawn logo** — wherever a mark would go, set the brand name in type (`.mb-wordmark`, Newsreader Medium). Do not invent a logo.

## Content fundamentals
Defined here (no prior copy existed):

- **Voice**: calm, plain-spoken, encouraging — a steady teacher, never a preachy guru, never a drill sergeant. "Practice, not perfection."
- **Person**: speak to the user as "you"; the app never says "I".
- **Casing**: sentence case everywhere — headings, buttons, tabs, labels. Uppercase only for the 11px caps kicker/section labels.
- **Punctuation**: no exclamation marks. Full sentences end with periods; fragments and button labels don't.
- **Emoji**: never in product UI. The sprout feeling is carried by the pastel green, not 🌱.
- **Japanese terms**: used naturally and sparingly (miso, kinpira, nishime, umeboshi); explain on first lesson use. The kanji 陰 (yin) and 陽 (yang) may accompany the words as quiet decoration, e.g. on the balance meter.
- **Judgment-free framing**: describe state, suggest gently. Say "A little more yang than usual — grounding foods may help", not "Warning! Your diet is unbalanced".
- **Numbers**: yin/yang values in mono, signed and small ("+0.3", "−0.1"). Days/dates written out ("Thursday, July 2").

## Visual foundations
- **Color**: 90% of any screen is greyscale (a near-neutral with faint leaf-grey warmth). Primary actions are **quiet**: a neutral fill one step off the surface (`--primary-fill`), ink text, a 1px super-pastel spectrum ring, and a very dim spectrum glow (`--spectrum-pastel`, tuned per theme — deeper stops on light so it reads, paler on dark). Never a solid color fill on buttons — flat pastel fills read as disabled. The pastel green (`--accent`, green-300 `#B5D8AD`) remains the working accent: checked controls, progress fills, focus rings, tints and badges. The 7 chakra colors are earthy and desaturated; they double as the macrobiotic yin→yang scale (crown/violet = most yin → root/red = most yang) and supply the semantic tones (success←heart, warning←sacral, danger←root, info←throat). The rainbow appears only as the 2px `--spectrum-gradient` hairline and the balance-meter track — the display gradient follows the theme's chakra palette (earthy on light, lifted on dark).
- **Theming**: light = yang (day), dark = yin (night). Toggle by setting `data-theme="dark"` on `<html>` (or any subtree). Persist to localStorage key `mb-theme`. All tokens are theme-aware; components need no changes.
- **Type**: Newsreader (display serif) for headlines, screen titles, dialog titles, and italic asides; Hanken Grotesk for all UI; Spline Sans Mono for data/tokens/timestamps. Scale ≈1.25 from 11→48px (`--text-2xs`…`--text-5xl`). Display sizes get `--tracking-tight`; caps labels get `--tracking-wide`.
- **Spacing**: 4px base scale (`--space-1`…`--space-12`). Screens breathe: 20px page gutters, 16px between cards.
- **Backgrounds**: flat token surfaces only — no gradients (except the spectrum hairline), no textures, no full-bleed imagery (none was provided; use `<image-slot>`-style placeholders and ask for real photography — if added, it should be natural-light, warm, unfiltered food/kitchen imagery).
- **Borders**: 1px hairlines everywhere (`--border-subtle` on cards and row dividers; `--border-strong` on inputs and secondary buttons).
- **Radii**: sm 6 (tooltips) · md 10 (inputs) · lg 14 (cards) · xl 20 (dialogs) · full pills for all buttons, tags, badges.
- **Elevation**: low and diffuse (`--shadow-sm/md/lg`); dark theme leans on borders, shadows go darker not larger. Never harsh or colored shadows.
- **Cards**: `--surface-card` + 1px `--border-subtle` + radius 14 + `--shadow-sm`; raised = md shadow; flat for nesting. Lists live inside cards as rows with hairline dividers.
- **Motion**: calm. Fades and gentle 8px rises, `--ease-out`, 120/200/320ms. The balance marker glides (320ms). No bounces, no infinite loops. Reduced-motion is respected.
- **Hover**: translucent ink wash (`--surface-hover`); on primary buttons the wash plus a slightly brighter glow. **Press**: a deeper wash (`--surface-active`) — no shrinking. **Focus**: 2px green ring, 2px offset; inputs get a green border + 3px `--accent-tint` glow.
- **Transparency & blur**: only two places — dialog scrim (45% ink + 3px blur) and the app tab bar (86% card + 12px blur).
- **Signature elements**: the yin↔yang balance meter (marker on the spectrum), the 2px spectrum hairline at the top of the app, and the dim spectrum ring + glow on primary buttons. Active filter chips invert to ink. Green marks state (checked, progress, focus); ink underline marks selected tabs.

## Iconography
- **System**: [Lucide](https://lucide.dev), linked from CDN (`lucide@0.469.0`) — no icon binaries were provided, so none are vendored. In React use the `Icon` component (loads the CDN script once); in plain HTML use `<i data-lucide="...">` + `lucide.createIcons()`.
- **Style**: 1.75px stroke (2px when active in the tab bar), 18–22px, always monochrome ink/muted; the sprout icon may take the accent. Never multicolor, never filled, never emoji, no hand-rolled SVGs.
- **Common names**: wheat, leaf, soup, carrot, book-open, heart, sun, moon, sprout, flame, droplets, scale, plus, search, chevron-right.
- Unicode: 陰/陽 kanji and signed mono numbers are the only "character icons" in use.

## Components
All exported from the compiled bundle — `const { Button } = window.MacrobioticaDesignSystem_d67ea7`. Each has a sibling `.d.ts` (props) and `.prompt.md` (usage).

- `components/core/` — **Button**, **IconButton**, **Badge**, **Tag**, **Card**
- `components/forms/` — **Input**, **Select**, **Checkbox**, **Radio**, **Switch**
- `components/navigation/` — **Tabs**
- `components/feedback/` — **Dialog**, **Toast**, **Tooltip**
- `components/brand/` — **Icon**, **ThemeToggle**, **BalanceMeter**

**Intentional additions** (no source defined an inventory, so a standard set was authored; these three are brand-specific):
- **Icon** — wrapper for the CDN Lucide set at brand stroke weight.
- **ThemeToggle** — light/dark is a core yin/yang brand behavior.
- **BalanceMeter** — the signature yin↔yang visualization; nothing standard expresses it.

UI-kit screens are also bundled: **TodayScreen**, **LearnScreen**, **FoodsScreen**, **CareScreen** (see `ui_kits/app/`).

## Index
- `styles.css` — global entry (imports everything below).
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `layout.css`, `base.css`.
- `components/` — React primitives by concern + `components.css` (the `.mb-*` classes) + one `@dsCard` specimen per directory.
- `ui_kits/app/` — the mobile app recreation: `index.html` (interactive), 4 screen JSX files, `app.css` (kit-only chrome), `README.md`.
- `templates/today/Today.dc.html` — consumable "Today screen" template.
- `guidelines/` — foundation specimen cards (type, colors, spacing, brand).
- `SKILL.md` — agent-skill entry point.

## Caveats
- **Fonts are Google-Fonts substitutes** (Newsreader, Hanken Grotesk, Spline Sans Mono) loaded via `@import` in `tokens/fonts.css` — no binaries are vendored. If brand fonts exist, replace that file with real `@font-face` rules + font files.
- No logo/imagery assets exist (see Sources). The app product is a from-scratch design, not a recreation — there was no existing UI to copy.
