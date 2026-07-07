import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// Dev ports (project-specific, keep unique across local projects):
//   4780 — Vite SPA (this config)
//   4781 — Nitro API (proxied under /api)
export default defineConfig({
  root: 'app',
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': fileURLToPath(new URL('./shared', import.meta.url)),
      '@': fileURLToPath(new URL('./app/src', import.meta.url)),
    },
  },
  server: {
    host: '127.0.0.1',
    // Durable project port is 4780 (PM2 + Tailscale funnel). Preview/secondary
    // instances get a port via the PORT env var and share the PM2 nitro API.
    port: Number(process.env.PORT) || 4780,
    strictPort: true,
    // Tailscale Funnel hostname (public dev URL) + local hosts only.
    allowedHosts: ['localhost', '127.0.0.1', 'lopus-macbook-pro-2.tail9606f9.ts.net'],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4781',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
