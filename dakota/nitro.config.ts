import { defineNitroConfig } from 'nitropack/config';

// Vite's build output (repo-root dist/) ships as Nitro public assets.
// Absolute path so the vercel preset copies it into .vercel/output/static
// regardless of srcDir (see scripts/verify-vercel-output.mjs).
const publicDir = new URL('./dist', import.meta.url).pathname;

export default defineNitroConfig({
  srcDir: 'server',
  compatibilityDate: '2026-07-03',
  imports: false,
  publicAssets: [
    {
      dir: publicDir,
      baseURL: '/',
      maxAge: 0,
    },
  ],
  // index.html also bundled into the server so the catch-all route can
  // serve the SPA fallback for client-side routes like /foods/pumpkin-soup.
  serverAssets: [
    {
      baseName: 'spa',
      dir: publicDir,
    },
  ],
  routeRules: {
    '/assets/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/api/catalog': { headers: { 'cache-control': 'public, max-age=300, stale-while-revalidate=3600' } },
  },
});
