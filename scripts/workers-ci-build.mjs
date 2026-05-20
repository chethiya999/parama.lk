#!/usr/bin/env node
/**
 * Cloudflare Pages CI build: SEO + sitemap + copy static files into public/.
 * Images are served from R2 URLs in HTML; no local images/ directory is required.
 *
 * Dashboard build command:
 *   bun install && node scripts/workers-ci-build.mjs
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

console.log('[pages] Building static site into public/ …');

execSync(
  'node scripts/apply-seo.mjs && node scripts/generate-sitemap.mjs && node scripts/build-static.mjs',
  { cwd: ROOT, stdio: 'inherit', shell: true }
);
