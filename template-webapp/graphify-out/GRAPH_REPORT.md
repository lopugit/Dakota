# Graph Report - .  (2026-07-03)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 797 nodes · 1427 edges · 77 communities (60 shown, 17 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.57)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `66c3e4a4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_index.ts|index.ts]]
- [[_COMMUNITY_mb-data.ts|mb-data.ts]]
- [[_COMMUNITY_support.js|support.js]]
- [[_COMMUNITY_support.js|support.js]]
- [[_COMMUNITY_support.js|support.js]]
- [[_COMMUNITY_CareScreen.jsx|CareScreen.jsx]]
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_AppShell.tsx|AppShell.tsx]]
- [[_COMMUNITY_userdocs.ts|userdocs.ts]]
- [[_COMMUNITY__ds_bundle.js|_ds_bundle.js]]
- [[_COMMUNITY__ds_bundle.js|_ds_bundle.js]]
- [[_COMMUNITY__ds_bundle.js|_ds_bundle.js]]
- [[_COMMUNITY_mb-data.js|mb-data.js]]
- [[_COMMUNITY_mb-data.js|mb-data.js]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_Screens spec|Screens spec]]
- [[_COMMUNITY_Macrobiotica Design System|Macrobiotica Design System]]
- [[_COMMUNITY_Behavior, state & data spec|Behavior, state & data spec]]
- [[_COMMUNITY_Macrobiotica Design System|Macrobiotica Design System]]
- [[_COMMUNITY_Macrobiotica Design System|Macrobiotica Design System]]
- [[_COMMUNITY_Macrobiotica 🌱|Macrobiotica 🌱]]
- [[_COMMUNITY_Macrobiotica — implementation conventions (read before touching a screen)|Macrobiotica — implementation conventions (read before touching a screen)]]
- [[_COMMUNITY_Handoff Macrobiotica — mobile-first webapp|Handoff: Macrobiotica — mobile-first webapp]]
- [[_COMMUNITY_verify-vercel-output.mjs|verify-vercel-output.mjs]]
- [[_COMMUNITY_Stack (fixed — do not substitute)|Stack (fixed — do not substitute)]]
- [[_COMMUNITY_Macrobiotica app — UI kit|Macrobiotica app — UI kit]]
- [[_COMMUNITY_Vercel deployments — Macrobiotica|Vercel deployments — Macrobiotica]]
- [[_COMMUNITY_Tabs.d.ts|Tabs.d.ts]]
- [[_COMMUNITY_BalanceMeter.d.ts|BalanceMeter.d.ts]]
- [[_COMMUNITY_Icon.d.ts|Icon.d.ts]]
- [[_COMMUNITY_ThemeToggle.d.ts|ThemeToggle.d.ts]]
- [[_COMMUNITY_Badge.d.ts|Badge.d.ts]]
- [[_COMMUNITY_Button.d.ts|Button.d.ts]]
- [[_COMMUNITY_Card.d.ts|Card.d.ts]]
- [[_COMMUNITY_IconButton.d.ts|IconButton.d.ts]]
- [[_COMMUNITY_Tag.d.ts|Tag.d.ts]]
- [[_COMMUNITY_Dialog.d.ts|Dialog.d.ts]]
- [[_COMMUNITY_Toast.d.ts|Toast.d.ts]]
- [[_COMMUNITY_Tooltip.d.ts|Tooltip.d.ts]]
- [[_COMMUNITY_Checkbox.d.ts|Checkbox.d.ts]]
- [[_COMMUNITY_Input.d.ts|Input.d.ts]]
- [[_COMMUNITY_Radio.d.ts|Radio.d.ts]]
- [[_COMMUNITY_Select.d.ts|Select.d.ts]]
- [[_COMMUNITY_Switch.d.ts|Switch.d.ts]]

## God Nodes (most connected - your core abstractions)
1. `useCatalog()` - 32 edges
2. `Card()` - 17 edges
3. `compilerOptions` - 17 edges
4. `TodayScreen()` - 16 edges
5. `Icon()` - 14 edges
6. `_extends()` - 13 edges
7. `_extends()` - 13 edges
8. `Button()` - 13 edges
9. `useLog()` - 13 edges
10. `_extends()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `checkinStreak()` --calls--> `getDay()`  [INFERRED]
  shared/derive.ts → app/src/lib/day.ts
- `practiceStreak()` --calls--> `getDay()`  [INFERRED]
  shared/derive.ts → app/src/lib/day.ts
- `todayKey()` --calls--> `dateKey()`  [EXTRACTED]
  app/src/lib/day.ts → shared/mb-data.ts
- `DiaryScreen()` --calls--> `signed()`  [EXTRACTED]
  app/src/screens/Diary.tsx → shared/derive.ts
- `DiaryScreen()` --calls--> `valColor()`  [EXTRACTED]
  app/src/screens/Diary.tsx → shared/derive.ts

## Import Cycles
- None detected.

## Communities (77 total, 17 thin omitted)

### Community 0 - "index.ts"
Cohesion: 0.06
Nodes (87): Avatar(), AvatarProps, Badge(), BadgeProps, BadgeTone, BalanceMeter(), BalanceMeterProps, Button() (+79 more)

### Community 1 - "mb-data.ts"
Cohesion: 0.06
Nodes (51): api, post(), request(), FALLBACK_BLOCKS, main(), AILMENT_SYSTEMS, AILMENTS, ANIMALS (+43 more)

### Community 2 - "support.js"
Cohesion: 0.07
Nodes (41): boot(), collectProps(), compileAttr(), compileTemplate(), contentKey(), createComponentFactory(), createExternalModules(), createHelmetManager() (+33 more)

### Community 3 - "support.js"
Cohesion: 0.07
Nodes (41): boot(), collectProps(), compileAttr(), compileTemplate(), contentKey(), createComponentFactory(), createExternalModules(), createHelmetManager() (+33 more)

### Community 4 - "support.js"
Cohesion: 0.07
Nodes (41): boot(), collectProps(), compileAttr(), compileTemplate(), contentKey(), createComponentFactory(), createExternalModules(), createHelmetManager() (+33 more)

### Community 5 - "CareScreen.jsx"
Cohesion: 0.09
Nodes (14): BalanceMeter(), Icon(), currentTheme(), ThemeToggle(), Button(), Card(), IconButton(), Tag() (+6 more)

### Community 6 - "devDependencies"
Cohesion: 0.06
Nodes (33): dependencies, lucide-react, mongodb, react, react-dom, react-router, @tanstack/react-query, zod (+25 more)

### Community 7 - "AppShell.tsx"
Cohesion: 0.12
Nodes (24): IconProps, REGISTRY, currentTheme(), listeners, setTheme(), subscribe(), Theme, ThemeToggle() (+16 more)

### Community 8 - "userdocs.ts"
Cohesion: 0.18
Nodes (19): readValidatedBodyZ(), Cache, g, getDb(), checkinBody, dateKeySchema, feedCommentBody, feedLikeBody (+11 more)

### Community 9 - "_ds_bundle.js"
Cohesion: 0.11
Nodes (14): Badge(), Button(), Card(), Checkbox(), currentTheme(), _extends(), Icon(), IconButton() (+6 more)

### Community 10 - "_ds_bundle.js"
Cohesion: 0.11
Nodes (14): Badge(), Button(), Card(), Checkbox(), currentTheme(), _extends(), Icon(), IconButton() (+6 more)

### Community 11 - "_ds_bundle.js"
Cohesion: 0.11
Nodes (14): Badge(), Button(), Card(), Checkbox(), currentTheme(), _extends(), Icon(), IconButton() (+6 more)

### Community 12 - "mb-data.js"
Cohesion: 0.10
Nodes (18): AILMENT_SYSTEMS, AILMENTS, ANIMALS, ARTICLES, CATS, CLOCK, COOK_METHODS, COURSES (+10 more)

### Community 13 - "mb-data.js"
Cohesion: 0.10
Nodes (18): AILMENT_SYSTEMS, AILMENTS, ANIMALS, ARTICLES, CATS, CLOCK, COOK_METHODS, COURSES (+10 more)

### Community 14 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, esModuleInterop, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+12 more)

### Community 15 - "Screens spec"
Cohesion: 0.15
Nodes (12): 10 · Profile, 1 · Today, 2 · Diary, 3 · Foods (search + browse + two detail views), 4 · Treatments, 5 · Learn, 6 · Practices, 7 · Feed (+4 more)

### Community 16 - "Macrobiotica Design System"
Cohesion: 0.22
Nodes (8): Caveats, Components, Content fundamentals, Iconography, Index, Macrobiotica Design System, Sources, Visual foundations

### Community 17 - "Behavior, state & data spec"
Cohesion: 0.22
Nodes (8): Accessibility, Behavior, state & data spec, Data model (port from `design_files/mb-data.js`), Derived values, Interactions, Motion, Production notes, User state (localStorage in prototype → DB in production)

### Community 18 - "Macrobiotica Design System"
Cohesion: 0.22
Nodes (8): Caveats, Components, Content fundamentals, Iconography, Index, Macrobiotica Design System, Sources, Visual foundations

### Community 19 - "Macrobiotica Design System"
Cohesion: 0.22
Nodes (8): Caveats, Components, Content fundamentals, Iconography, Index, Macrobiotica Design System, Sources, Visual foundations

### Community 20 - "Macrobiotica 🌱"
Cohesion: 0.22
Nodes (8): Build & deploy (Vercel), Development, Environment, Macrobiotica 🌱, PM2, Ports & URLs (project-specific — do not reuse elsewhere), Repo map, Stack

### Community 21 - "Macrobiotica — implementation conventions (read before touching a screen)"
Cohesion: 0.25
Nodes (7): Accessibility, Components (`@/components`), Data (`@/lib`), Layout & styling, Macrobiotica — implementation conventions (read before touching a screen), Navigation, Voice & format (hard rules)

### Community 22 - "Handoff: Macrobiotica — mobile-first webapp"
Cohesion: 0.25
Nodes (7): About the design files, Fidelity, Handoff: Macrobiotica — mobile-first webapp, Non-negotiables (summary), Overview, Package contents, Stack (chosen)

### Community 23 - "verify-vercel-output.mjs"
Cohesion: 0.29
Nodes (5): config, configPath, fsIndex, html, indexPath

### Community 24 - "Stack (fixed — do not substitute)"
Cohesion: 0.33
Nodes (5): Architecture, Claude Code prompt — Macrobiotica implementation, Data, Stack (fixed — do not substitute), UI

### Community 25 - "Macrobiotica app — UI kit"
Cohesion: 0.40
Nodes (4): Conventions shown, Entry points, Macrobiotica app — UI kit, Screens

### Community 26 - "Vercel deployments — Macrobiotica"
Cohesion: 0.50
Nodes (3): Notes, Required environment, Vercel deployments — Macrobiotica

## Knowledge Gaps
- **216 isolated node(s):** `BalanceMeterProps`, `IconProps`, `ThemeToggleProps`, `BadgeProps`, `ButtonProps` (+211 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Icon()` connect `index.ts` to `AppShell.tsx`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **Why does `useCatalog()` connect `index.ts` to `mb-data.ts`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **Why does `DayLog` connect `mb-data.ts` to `index.ts`, `userdocs.ts`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **What connects `BalanceMeterProps`, `IconProps`, `ThemeToggleProps` to the rest of the system?**
  _216 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05938375350140056 - nodes in this community are weakly interconnected._
- **Should `mb-data.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05764145954521417 - nodes in this community are weakly interconnected._
- **Should `support.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06734006734006734 - nodes in this community are weakly interconnected._