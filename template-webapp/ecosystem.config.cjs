// PM2 dev servers — project-specific ports (see README):
//   macrobiotica-vite  → 127.0.0.1:4780 (SPA, proxies /api)
//   macrobiotica-nitro → 127.0.0.1:4781 (API)
module.exports = {
  apps: [
    {
      name: 'macrobiotica-vite',
      cwd: __dirname,
      script: 'pnpm',
      args: 'dev:client',
      interpreter: 'none',
      autorestart: true,
      max_restarts: 10,
    },
    {
      name: 'macrobiotica-nitro',
      cwd: __dirname,
      script: 'pnpm',
      args: 'dev:server',
      interpreter: 'none',
      autorestart: true,
      max_restarts: 10,
    },
  ],
};
