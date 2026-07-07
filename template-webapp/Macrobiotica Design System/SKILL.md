---
name: macrobiotica-design
description: Use this skill to generate well-branded interfaces and assets for Macrobiotica, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Quick orientation:
- Link `styles.css` for all tokens + `.mb-*` component classes; toggle dark with `data-theme="dark"` on `<html>`.
- React components live in `components/` (Button, IconButton, Badge, Tag, Card, Input, Select, Checkbox, Radio, Switch, Tabs, Dialog, Toast, Tooltip, Icon, ThemeToggle, BalanceMeter); each has a `.prompt.md` with usage.
- Full app screens: `ui_kits/app/`.
- Rules of thumb: greyscale first; primary actions are quiet — neutral fill (`--primary-fill`), ink text, 1px super-pastel spectrum ring + very dim glow (`--spectrum-pastel`); pastel green (`--accent`) marks state — checked controls, progress, focus, tints — never button fills; the saturated chakra rainbow only as the 2px spectrum hairline or balance-meter track; Newsreader for headlines, Hanken Grotesk for UI; pill buttons; sentence case; no emoji; no exclamation marks.
