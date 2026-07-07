# Handoff: Macrobiotica — mobile-first webapp

## Overview
Macrobiotica is an all-in-one app for learning and maintaining macrobiotics — philosophy (yin/yang food energetics), daily practice tracking (meals, balance check-ins, practices), reference (foods, treatments, TCM wisdom), and a small social layer (feed, friends you cook for).

This package contains a complete high-fidelity interactive prototype (10 screens) plus the full Macrobiotica Design System, and specs to rebuild it as a production app.

## About the design files
Files in `design_files/` are **design references created in HTML** — they show intended look and behavior. They are NOT production code to copy directly. The task is to **recreate these designs in a real codebase**. No codebase exists yet; recommended stack below.

- `design_files/Macrobiotica App.dc.html` — the full prototype (open in a browser; all 10 screens). Markup is inside `<x-dc>`; logic is a React-style class in the `data-dc-script` block. Inline styles are the source of truth for spacing/sizing.
- `design_files/mb-data.js` — the seed database (foods, meals, ailments, courses, articles, practices, posts, friends, five elements, organ clock, zodiac, glossary) + pure helpers. **Port this file nearly as-is** — it is clean ES module data.
- `design_files/_ds/` — compiled design system: tokens (CSS custom properties), component CSS (`.mb-*` classes), React components. Port tokens directly as your theme.

## Fidelity
**High-fidelity.** Colors, type, spacing, radii, copy, and interactions are final design intent. Recreate pixel-perfectly using the design tokens. All copy in the prototype is final voice ("calm teacher"; sentence case; no exclamation marks; no emoji in UI).

## Stack (chosen)
- **Vite + React + TypeScript** SPA with **React Router in library mode** (data router; NOT framework mode).
- **Nitro** API server (`server/routes/api/**`), deployed to **Vercel** via Nitro's `vercel` preset; the SPA ships as Nitro public assets with SPA fallback.
- **MongoDB** (official driver): dev = non-authed `mongodb://localhost:27017`, db `macrobiotica`; prod = `MONGODB_URI` env (Vercel can't reach localhost — use Atlas or similar).
- Map ALL styling to the CSS custom properties from `_ds/tokens/*.css` — do not hardcode hex.
- Fonts: Google Fonts — Newsreader (display serif), Hanken Grotesk (UI), Spline Sans Mono (data/timestamps).
- Icons: lucide-react, 1.75px stroke (2px active), 16–22px, monochrome only.
See `PROMPT.md` for the full architecture, seed script, and API surface.

## Package contents
- `README.md` — this file
- `PROMPT.md` — paste-ready Claude Code prompt
- `SPEC-screens.md` — every screen: layout, components, copy
- `SPEC-behavior.md` — interactions, state, data model, persistence keys
- `SPEC-tokens.md` — design tokens + component recipes
- `design_files/` — runnable prototype + design system

## Non-negotiables (summary)
1. Mobile-first: bottom tab bar <900px (Today, Diary, Foods, Feed, More-sheet), left rail ≥900px; content column max 680px.
2. 2px `--spectrum-gradient` hairline fixed at the very top of the app, always.
3. Light/dark theme via `data-theme="dark"` on `<html>`, persisted (`mb-theme`); light = yang, dark = yin.
4. The BalanceMeter (yin↔yang marker on a chakra-spectrum track) is the signature visualization — used for whole days, meals, single foods, ingredients, friends.
5. Yin/yang numbers always in mono, signed: "+0.30", "−0.15"; scale −1…+1.
6. Judgment-free copy: describe, suggest gently; never warnings/alarms.
7. Medical disclaimer footer on Treatments screens ("Kitchen support, not a diagnosis…").
