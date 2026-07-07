# Graph Report - dakota  (2026-07-08)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 524 nodes · 1419 edges · 20 communities (18 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.68)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0574e16c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_UI Components|UI Components]]
- [[_COMMUNITY_Auth And Feed APIs|Auth And Feed APIs]]
- [[_COMMUNITY_Daily Horse Tracking|Daily Horse Tracking]]
- [[_COMMUNITY_React Query Hooks|React Query Hooks]]
- [[_COMMUNITY_API Client And Types|API Client And Types]]
- [[_COMMUNITY_Icons And Theme|Icons And Theme]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Seeded Catalog Data|Seeded Catalog Data]]
- [[_COMMUNITY_Ride Tracking|Ride Tracking]]
- [[_COMMUNITY_TypeScript Configuration|TypeScript Configuration]]
- [[_COMMUNITY_Demo Stable Data|Demo Stable Data]]
- [[_COMMUNITY_Implementation Conventions|Implementation Conventions]]
- [[_COMMUNITY_Project README|Project README]]
- [[_COMMUNITY_Vercel Output Verification|Vercel Output Verification]]
- [[_COMMUNITY_Social Feed Fixtures|Social Feed Fixtures]]
- [[_COMMUNITY_Practice Data|Practice Data]]
- [[_COMMUNITY_Vercel Deployment Notes|Vercel Deployment Notes]]

## God Nodes (most connected - your core abstractions)
1. `useCatalog()` - 33 edges
2. `Icon()` - 25 edges
3. `Card()` - 24 edges
4. `getDataContext()` - 23 edges
5. `TodayScreen()` - 19 edges
6. `Button()` - 18 edges
7. `useHorses()` - 17 edges
8. `compilerOptions` - 17 edges
9. `readValidatedBodyZ()` - 16 edges
10. `dateKey()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `practiceStreak()` --calls--> `getDay()`  [INFERRED]
  shared/derive.ts → app/src/lib/day.ts
- `sessionStreak()` --calls--> `getDay()`  [INFERRED]
  shared/derive.ts → app/src/lib/day.ts
- `ProfileScreen()` --calls--> `dateKey()`  [EXTRACTED]
  app/src/screens/Profile.tsx → shared/derive.ts
- `ProfileScreen()` --calls--> `sessionStreak()`  [EXTRACTED]
  app/src/screens/Profile.tsx → shared/derive.ts
- `RidesScreen()` --calls--> `rideStats`  [INFERRED]
  app/src/screens/Rides.tsx → shared/derive.ts

## Import Cycles
- None detected.

## Communities (20 total, 2 thin omitted)

### Community 0 - "UI Components"
Cohesion: 0.06
Nodes (56): Avatar(), AvatarProps, Badge(), BadgeProps, BadgeTone, BalanceMeterProps, ButtonProps, Card() (+48 more)

### Community 1 - "Auth And Feed APIs"
Cohesion: 0.08
Nodes (50): createUser(), endSession(), ensureIndexes(), getAuthUserDoc(), hashPassword(), scrypt, SessionDoc, startSession() (+42 more)

### Community 2 - "Daily Horse Tracking"
Cohesion: 0.07
Nodes (63): BalanceMeter(), Button(), getDay(), todayKey(), useDayAvg(), useHorseById(), useDayMutation(), useHorses() (+55 more)

### Community 3 - "React Query Hooks"
Cohesion: 0.08
Nodes (34): useExerciseById(), Ctx, keys, useAddComment(), useAuth(), useAuthMutation(), useCompleteLesson(), useFeed() (+26 more)

### Community 4 - "API Client And Types"
Cohesion: 0.07
Nodes (29): api, post(), request(), AilmentCare, ArticleBlockType, Catalog, DayLog, Discipline (+21 more)

### Community 5 - "Icons And Theme"
Cohesion: 0.10
Nodes (26): IconProps, REGISTRY, IconButton(), IconButtonProps, currentTheme(), listeners, setTheme(), subscribe() (+18 more)

### Community 6 - "Package Dependencies"
Cohesion: 0.06
Nodes (33): dependencies, lucide-react, mongodb, react, react-dom, react-router, @tanstack/react-query, zod (+25 more)

### Community 7 - "Seeded Catalog Data"
Cohesion: 0.14
Nodes (23): AILMENT_SYSTEMS, AILMENTS, ARTICLES, COURSES, DISCIPLINES, EXERCISES, LEVELS, FEED_CATS (+15 more)

### Community 8 - "Ride Tracking"
Cohesion: 0.17
Nodes (18): fmtClock(), fmtKm(), fmtKmh(), fmtMin(), TrackBox, trackToSvg(), useRides(), useSaveRide() (+10 more)

### Community 9 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (20): compilerOptions, esModuleInterop, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+12 more)

### Community 10 - "Demo Stable Data"
Cohesion: 0.18
Nodes (15): main(), CHECKIN_NOTES, daysAgo(), DEFAULT_PADDOCKS, demoHorses(), demoPaddocks(), demoRides(), prng() (+7 more)

### Community 11 - "Implementation Conventions"
Cohesion: 0.20
Nodes (9): Accessibility, Arena diagrams, Components (`@/components`), Dakota — implementation conventions (read before touching a screen), Data (`@/lib`), Layout & styling, Navigation, The energy scale (core concept) (+1 more)

### Community 12 - "Project README"
Cohesion: 0.20
Nodes (9): Accounts & data sources, Build & deploy (Vercel), Dakota 🐴, Development, PM2, Ports & URLs (project-specific — do not reuse elsewhere), Repo map, Stack (+1 more)

### Community 13 - "Vercel Output Verification"
Cohesion: 0.29
Nodes (5): config, configPath, fsIndex, html, indexPath

### Community 14 - "Social Feed Fixtures"
Cohesion: 0.50
Nodes (3): FRIENDS, POSTS, Friend

## Knowledge Gaps
- **153 isolated node(s):** `AvatarProps`, `BadgeProps`, `BalanceMeterProps`, `ButtonProps`, `CardProps` (+148 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Icon()` connect `UI Components` to `Ride Tracking`, `Daily Horse Tracking`, `React Query Hooks`, `Icons And Theme`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `dateKey()` connect `Daily Horse Tracking` to `Auth And Feed APIs`, `Demo Stable Data`, `React Query Hooks`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `useCatalog()` connect `UI Components` to `Daily Horse Tracking`, `React Query Hooks`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `AvatarProps`, `BadgeProps`, `BalanceMeterProps` to the rest of the system?**
  _153 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
- **Should `Auth And Feed APIs` be split into smaller, more focused modules?**
  _Cohesion score 0.07530022719896137 - nodes in this community are weakly interconnected._
- **Should `Daily Horse Tracking` be split into smaller, more focused modules?**
  _Cohesion score 0.07313738892686261 - nodes in this community are weakly interconnected._