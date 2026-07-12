# Graph Report - thingtime-login-integration-d5b5fa  (2026-07-12)

## Corpus Check
- 285 files · ~788,090 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 276 nodes · 463 edges · 11 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f0365102`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_schemas.ts|schemas.ts]]
- [[_COMMUNITY_queries.ts|queries.ts]]
- [[_COMMUNITY_types.ts|types.ts]]
- [[_COMMUNITY_api.ts|api.ts]]
- [[_COMMUNITY_scripts|scripts]]
- [[_COMMUNITY_catalog.ts|catalog.ts]]
- [[_COMMUNITY_thingtime.ts|thingtime.ts]]
- [[_COMMUNITY_auth.ts|auth.ts]]
- [[_COMMUNITY_thingtime-provision.ts|thingtime-provision.ts]]
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_Dakota 🐴|Dakota 🐴]]

## God Nodes (most connected - your core abstractions)
1. `mirrorUserDoc()` - 16 edges
2. `scripts` - 12 edges
3. `useSignInGate()` - 11 edges
4. `Dakota 🐴` - 8 edges
5. `LocalState` - 8 edges
6. `ttFetch()` - 8 edges
7. `ttServiceToken()` - 7 edges
8. `expectOk()` - 7 edges
9. `ttPutThing()` - 7 edges
10. `encodeDoc()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `LocalState` --references--> `Horse`  [EXTRACTED]
  dakota/app/src/lib/api.ts → dakota/shared/types.ts
- `LocalState` --references--> `Paddocks`  [EXTRACTED]
  dakota/app/src/lib/api.ts → dakota/shared/types.ts
- `LocalState` --references--> `Profile`  [EXTRACTED]
  dakota/app/src/lib/api.ts → dakota/shared/types.ts
- `LocalState` --references--> `Ride`  [EXTRACTED]
  dakota/app/src/lib/api.ts → dakota/shared/types.ts
- `putChunks()` --calls--> `ttDeleteThing()`  [EXTRACTED]
  dakota/scripts/thingtime-sync-catalog.ts → dakota/server/utils/thingtime.ts

## Import Cycles
- None detected.

## Communities (11 total, 0 thin omitted)

### Community 0 - "schemas.ts"
Cohesion: 0.08
Nodes (33): careTypeSchema, checkinBody, dataSourceBody, dateKeySchema, feedCommentBody, feedLikeBody, feedPostBody, hhmmSchema (+25 more)

### Community 1 - "queries.ts"
Cohesion: 0.08
Nodes (26): Ctx, keys, useAddComment(), useAddHorse(), useAuthMutation(), useCompleteLesson(), useDayMutation(), useLogCare() (+18 more)

### Community 2 - "types.ts"
Cohesion: 0.05
Nodes (39): paddockMoveBody, AgeRow, Ailment, AilmentCare, ArticleBlock, ArticleBlockType, Breed, ConditionScore (+31 more)

### Community 3 - "api.ts"
Cohesion: 0.09
Nodes (25): api, buildInitial(), CATALOG, clone(), Comment, DEMO_PROFILE, load(), local (+17 more)

### Community 4 - "scripts"
Cohesion: 0.08
Nodes (24): dependencies, lucide-react, mongodb, react, react-dom, react-router, @tanstack/react-query, zod (+16 more)

### Community 5 - "catalog.ts"
Cohesion: 0.17
Nodes (16): main(), putChunks(), envPath, assembleCatalogFromMongo(), CatalogCache, fetchCatalogBundle(), g, getThingtimeCatalog() (+8 more)

### Community 6 - "thingtime.ts"
Cohesion: 0.24
Nodes (15): expectOk(), tokenFromCookies(), TT_BASE, ttDeleteThing(), TtError, ttFetch(), ttGetThing(), ttListThings() (+7 more)

### Community 7 - "auth.ts"
Cohesion: 0.20
Nodes (12): createUser(), ensureIndexes(), hashPassword(), scrypt, SessionDoc, startSession(), ThingtimeLink, toAuthUser() (+4 more)

### Community 8 - "thingtime-provision.ts"
Cohesion: 0.19
Nodes (12): BASE, EMAIL, emailCandidates(), env(), envPath, fileEnv, force, main() (+4 more)

### Community 9 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, concurrently, h3, nitropack, tsx, @types/node, @types/react, @types/react-dom (+3 more)

### Community 10 - "Dakota 🐴"
Cohesion: 0.18
Nodes (10): Accounts & data sources, Build & deploy (Vercel), Dakota 🐴, Development, PM2, Ports & URLs (project-specific — do not reuse elsewhere), Repo map, Stack (+2 more)

## Knowledge Gaps
- **118 isolated node(s):** `Stack`, `Ports & URLs (project-specific — do not reuse elsewhere)`, `PM2`, `Accounts & data sources`, `Thingtime integration` (+113 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `mirrorUserDoc()` connect `schemas.ts` to `types.ts`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `Horse` connect `schemas.ts` to `queries.ts`, `types.ts`, `api.ts`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `Ride` connect `schemas.ts` to `queries.ts`, `types.ts`, `api.ts`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `Stack`, `Ports & URLs (project-specific — do not reuse elsewhere)`, `PM2` to the rest of the system?**
  _118 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `schemas.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07624113475177305 - nodes in this community are weakly interconnected._
- **Should `queries.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07804878048780488 - nodes in this community are weakly interconnected._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._