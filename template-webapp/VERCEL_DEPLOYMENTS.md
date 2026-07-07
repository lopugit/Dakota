# Vercel deployments — Macrobiotica

- **Project**: `macrobiotica` (id `prj_3NfaoXAXXXKIaxsnMEpwpJeiKxNA`, account `lopugit`)
- **Dashboard**: https://vercel.com/lopugit/macrobiotica
- **Production URL**: https://macrobiotica.vercel.app (assigned after the first successful production deploy)
- **Preview URLs**: `https://macrobiotica-git-<branch>-lopugit.vercel.app` per branch; every push to the private GitHub repo `lopugit/macrobiotica` builds automatically
- **Build**: `pnpm build` → Build Output API v3 (`.vercel/output`: static SPA + `__fallback` serverless function serving `/api/**` and the SPA fallback)

## Required environment

| Variable | Notes |
| --- | --- |
| `MONGODB_URI` | **Must be set in the Vercel dashboard** (Settings → Environment Variables) to a hosted MongoDB (e.g. Atlas). Serverless functions cannot reach localhost Mongo. Run `MONGODB_URI=... pnpm seed` once against the same cluster to populate it. |
| `MONGODB_DB` | Optional, defaults to `macrobiotica`. |
| `MONGODB_DB_UGC` | Optional, defaults to `macrobiotica_ugc` — the real user-generated-content db for signed-in accounts with "Example data" off. |

Until `MONGODB_URI` is configured, deployments serve the static app fine but
`/api/*` fails at runtime — the UI will show empty data.

## Notes

- `pnpm verify:vercel-output` guards against the empty-static-output failure
  mode (checks `index.html` shell + filesystem routing in `config.json`).
- If a live URL ever returns Nitro JSON `Cannot find any route matching /`,
  inspect `.vercel/output/static` and the public-assets path in
  `nitro.config.ts` before suspecting routing.
