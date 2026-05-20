#!/usr/bin/env node
/**
 * Run production build on Cloudflare CI only (after bun/npm install).
 * Ensures public/ exists before `wrangler deploy` when the dashboard
 * build command is empty but deploy runs `npx wrangler deploy`.
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const isCloudflareCI =
  process.env.WORKERS_CI === '1' ||
  process.env.CI === 'true' ||
  process.env.CF_PAGES === '1';

if (!isCloudflareCI) {
  process.exit(0);
}

console.log('[ci] Building static site into public/ …');

execSync(
  'node scripts/apply-seo.mjs && node scripts/generate-sitemap.mjs && node scripts/build-static.mjs',
  { cwd: ROOT, stdio: 'inherit', shell: true }
);
