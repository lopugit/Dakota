import { createError, defineEventHandler, setResponseHeader } from 'h3';
import { useStorage } from 'nitropack/runtime';

/**
 * SPA fallback: any non-/api GET that reached the server (i.e. no static asset
 * matched) gets the Vite index.html so React Router owns the path.
 * On Vercel the CDN serves real static files first; this only sees deep links.
 */
export default defineEventHandler(async (event) => {
  const path = event.path || '/';
  if (path.startsWith('/api')) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' });
  }
  const html = await useStorage('assets:spa').getItemRaw('index.html');
  if (!html) {
    throw createError({
      statusCode: 503,
      statusMessage: 'SPA shell not built — run `pnpm build:client` (dev uses Vite on :4780)',
    });
  }
  setResponseHeader(event, 'content-type', 'text/html; charset=utf-8');
  setResponseHeader(event, 'cache-control', 'no-cache');
  return html;
});
