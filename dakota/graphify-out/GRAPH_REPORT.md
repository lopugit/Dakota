# Graph Report - dakota  (2026-07-12)

## Corpus Check
- 110 files · ~66,827 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 622 nodes · 1690 edges · 28 communities (26 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.68)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0b42a41e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_router.tsx|router.tsx]]
- [[_COMMUNITY_schemas.ts|schemas.ts]]
- [[_COMMUNITY_derive.ts|derive.ts]]
- [[_COMMUNITY_queries.ts|queries.ts]]
- [[_COMMUNITY_types.ts|types.ts]]
- [[_COMMUNITY_index.ts|index.ts]]
- [[_COMMUNITY_scripts|scripts]]
- [[_COMMUNITY_dk-data.ts|dk-data.ts]]
- [[_COMMUNITY_Rides.tsx|Rides.tsx]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_demo.ts|demo.ts]]
- [[_COMMUNITY_Dakota — implementation conventions (read before touching a screen)|Dakota — implementation conventions (read before touching a screen)]]
- [[_COMMUNITY_Dakota 🐴|Dakota 🐴]]
- [[_COMMUNITY_verify-vercel-output.mjs|verify-vercel-output.mjs]]
- [[_COMMUNITY_feed.get.ts|feed.get.ts]]
- [[_COMMUNITY_practices.ts|practices.ts]]
- [[_COMMUNITY_VERCEL_DEPLOYMENTS|VERCEL_DEPLOYMENTS.md]]
- [[_COMMUNITY_thingtime.ts|thingtime.ts]]
- [[_COMMUNITY_Horses.tsx|Horses.tsx]]
- [[_COMMUNITY_api.ts|api.ts]]
- [[_COMMUNITY_thingtime-provision.ts|thingtime-provision.ts]]
- [[_COMMUNITY_Wisdom.tsx|Wisdom.tsx]]
- [[_COMMUNITY_Button|Button]]
- [[_COMMUNITY_Feed.tsx|Feed.tsx]]
- [[_COMMUNITY_Auth.tsx|Auth.tsx]]

## God Nodes (most connected - your core abstractions)
1. `useCatalog()` - 33 edges
2. `Icon()` - 26 edges
3. `Card()` - 24 edges
4. `getDataContext()` - 23 edges
5. `TodayScreen()` - 19 edges
6. `Button()` - 18 edges
7. `useHorses()` - 17 edges
8. `readValidatedBodyZ()` - 17 edges
9. `dateKey()` - 17 edges
10. `compilerOptions` - 17 edges

## Surprising Connections (you probably didn't know these)
- `sessionStreak()` --calls--> `getDay()`  [INFERRED]
  shared/derive.ts → app/src/lib/day.ts
- `LocalState` --references--> `AuthUser`  [EXTRACTED]
  app/src/lib/api.ts → shared/types.ts
- `LocalState` --references--> `Profile`  [EXTRACTED]
  app/src/lib/api.ts → shared/types.ts
- `LocalState` --references--> `UserPost`  [EXTRACTED]
  app/src/lib/api.ts → shared/types.ts
- `practiceStreak()` --calls--> `getDay()`  [INFERRED]
  shared/derive.ts → app/src/lib/day.ts

## Import Cycles
- None detected.

## Communities (28 total, 2 thin omitted)

### Community 0 - "router.tsx"
Cohesion: 0.16
Nodes (22): Card(), Icon(), Input(), Tag(), useCatalog(), store, useSticky(), AilmentDetailScreen() (+14 more)

### Community 1 - "schemas.ts"
Cohesion: 0.07
Nodes (62): createUser(), endSession(), ensureIndexes(), getAuthUserDoc(), hashPassword(), scrypt, SessionDoc, startSession() (+54 more)

### Community 2 - "derive.ts"
Cohesion: 0.08
Nodes (59): BalanceMeter(), getDay(), todayKey(), useDayAvg(), useExerciseById(), useHorseById(), useDayMutation(), useHorses() (+51 more)

### Community 3 - "queries.ts"
Cohesion: 0.16
Nodes (14): api, Ctx, keys, useAuth(), useLogout(), useSetDataSource(), useUpdateProfile(), sampleModeEnabled() (+6 more)

### Community 4 - "types.ts"
Cohesion: 0.08
Nodes (28): LocalState, COURSES, AgeRow, AilmentCare, ArticleBlock, ArticleBlockType, Breed, ConditionScore (+20 more)

### Community 5 - "index.ts"
Cohesion: 0.06
Nodes (44): BalanceMeterProps, ButtonProps, CardProps, CROP, FarmFieldFooter(), FarmScatter(), Motif(), MotifName (+36 more)

### Community 6 - "scripts"
Cohesion: 0.06
Nodes (35): dependencies, lucide-react, mongodb, react, react-dom, react-router, @tanstack/react-query, zod (+27 more)

### Community 7 - "dk-data.ts"
Cohesion: 0.19
Nodes (18): AILMENT_SYSTEMS, AILMENTS, POSTS, ARTICLES, DISCIPLINES, EXERCISES, LEVELS, FEED_CATS (+10 more)

### Community 8 - "Rides.tsx"
Cohesion: 0.17
Nodes (18): fmtClock(), fmtKm(), fmtKmh(), fmtMin(), TrackBox, trackToSvg(), useRides(), useSaveRide() (+10 more)

### Community 9 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, esModuleInterop, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+12 more)

### Community 10 - "demo.ts"
Cohesion: 0.20
Nodes (15): buildInitial(), main(), CHECKIN_NOTES, daysAgo(), demoHorses(), demoPaddocks(), demoRides(), prng() (+7 more)

### Community 11 - "Dakota — implementation conventions (read before touching a screen)"
Cohesion: 0.18
Nodes (10): Accessibility, Arena diagrams, Brand: the tack room, Components (`@/components`), Dakota — implementation conventions (read before touching a screen), Data (`@/lib`), Layout & styling, Navigation (+2 more)

### Community 12 - "Dakota 🐴"
Cohesion: 0.18
Nodes (10): Accounts & data sources, Build & deploy (Vercel), Dakota 🐴, Development, PM2, Ports & URLs (project-specific — do not reuse elsewhere), Repo map, Stack (+2 more)

### Community 13 - "verify-vercel-output.mjs"
Cohesion: 0.29
Nodes (5): config, configPath, fsIndex, html, indexPath

### Community 14 - "feed.get.ts"
Cohesion: 0.24
Nodes (6): FRIENDS, FeedPost, Friend, Post, PostComment, UserPost

### Community 20 - "thingtime.ts"
Cohesion: 0.11
Nodes (32): main(), putChunks(), envPath, assembleCatalogFromMongo(), CatalogCache, fetchCatalogBundle(), g, getThingtimeCatalog() (+24 more)

### Community 21 - "Horses.tsx"
Cohesion: 0.10
Nodes (18): Avatar(), AvatarProps, Badge(), BadgeProps, BadgeTone, useAddHorse(), useMoveHorse(), usePaddocks() (+10 more)

### Community 22 - "api.ts"
Cohesion: 0.11
Nodes (16): CATALOG, clone(), Comment, DEMO_PROFILE, load(), local, pick(), post() (+8 more)

### Community 23 - "thingtime-provision.ts"
Cohesion: 0.19
Nodes (12): BASE, EMAIL, emailCandidates(), env(), envPath, fileEnv, force, main() (+4 more)

### Community 24 - "Wisdom.tsx"
Cohesion: 0.20
Nodes (10): groupBy(), introStyle, listCard, MARKING_KICKERS, mono, noteStyle, TABS, WisdomScreen() (+2 more)

### Community 25 - "Button"
Cohesion: 0.29
Nodes (7): Button(), useCompleteLesson(), useProfile(), LearnScreen(), mono, LessonScreen(), Lesson

### Community 26 - "Feed.tsx"
Cohesion: 0.42
Nodes (8): useAddComment(), useFeed(), useSharePost(), useSignInGate(), useToggleLike(), FeedScreen(), initialsOf(), mono

### Community 27 - "Auth.tsx"
Cohesion: 0.36
Nodes (7): useAuthMutation(), useLogin(), useSignup(), useThingtimeAuth(), AuthScreen(), Mode, Provider

## Knowledge Gaps
- **188 isolated node(s):** `AvatarProps`, `BadgeProps`, `BalanceMeterProps`, `ButtonProps`, `CardProps` (+183 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Icon()` connect `router.tsx` to `derive.ts`, `index.ts`, `Rides.tsx`, `Horses.tsx`, `Wisdom.tsx`, `Button`, `Feed.tsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `dateKey()` connect `derive.ts` to `schemas.ts`, `demo.ts`, `queries.ts`, `api.ts`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `useCatalog()` connect `router.tsx` to `Wisdom.tsx`, `Button`, `derive.ts`, `queries.ts`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `AvatarProps`, `BadgeProps`, `BalanceMeterProps` to the rest of the system?**
  _188 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `schemas.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06895745675549322 - nodes in this community are weakly interconnected._
- **Should `derive.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07785602503912363 - nodes in this community are weakly interconnected._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07575757575757576 - nodes in this community are weakly interconnected._