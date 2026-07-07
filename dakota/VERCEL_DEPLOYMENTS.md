# Vercel deployments — Dakota

Status: **not deployed yet** (local dev only so far).

When setting the project up:

1. Create a Vercel project connected to the private GitHub repo
   (`lopugit/Dakota`), root directory `dakota/`.
2. Build command `pnpm build`, output directory `.vercel/output`
   (prebuilt: `pnpm build && pnpm verify:vercel-output && npx vercel deploy --prebuilt`).
3. Set `MONGODB_URI` (hosted Mongo, e.g. Atlas — serverless cannot reach
   localhost), optional `MONGODB_DB` (default `dakota`) and `MONGODB_DB_UGC`
   (default `dakota_ugc`).
4. Seed the hosted db once: `MONGODB_URI=... pnpm seed`.
5. Record here: project/dashboard URL, production URL, preview URL pattern.

| What | URL |
| --- | --- |
| Vercel dashboard | _pending_ |
| Production | _pending_ |
| Preview pattern | _pending_ |
