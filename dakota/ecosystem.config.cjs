// PM2 dev servers — project-specific ports (see README):
//   dakota-vite  → 127.0.0.1:4790 (SPA, proxies /api)
//   dakota-nitro → 127.0.0.1:4791 (API)
module.exports = {
  apps: [
    {
      name: 'dakota-vite',
      cwd: __dirname,
      script: 'pnpm',
      args: 'dev:client',
      interpreter: 'none',
      autorestart: true,
      max_restarts: 10,
    },
    {
      name: 'dakota-nitro',
      cwd: __dirname,
      script: 'pnpm',
      args: 'dev:server',
      interpreter: 'none',
      autorestart: true,
      max_restarts: 10,
    },
  ],
};
