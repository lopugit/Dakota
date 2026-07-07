// Asserts the Vercel build output actually contains the Vite static shell
// and sane routing, so a broken publicAssets path can't ship silently.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const out = '.vercel/output';
const fail = (msg) => {
  console.error(`verify:vercel-output FAILED — ${msg}`);
  process.exit(1);
};

const indexPath = join(out, 'static', 'index.html');
if (!existsSync(indexPath)) fail(`${indexPath} does not exist`);
const html = readFileSync(indexPath, 'utf8');
if (!html.includes('<div id="root"></div>')) fail('index.html is missing the Vite root div');
if (!/\/assets\/[^"']+\.js/.test(html)) fail('index.html references no built /assets/*.js bundle');

const configPath = join(out, 'config.json');
if (!existsSync(configPath)) fail(`${configPath} does not exist`);
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const routes = config.routes ?? [];
const fsIndex = routes.findIndex((r) => r.handle === 'filesystem');
if (fsIndex === -1) fail('config.json has no filesystem routing step');

console.log('verify:vercel-output OK — static shell present, filesystem routing in place.');
