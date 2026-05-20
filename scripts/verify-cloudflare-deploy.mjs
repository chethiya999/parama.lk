#!/usr/bin/env node
/**
 * Verify Cloudflare Pages CI setup before/after dashboard changes.
 * Run: node scripts/verify-cloudflare-deploy.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const errors = [];

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const scripts = Object.values(pkg.scripts || {}).join(' ');
if (scripts.includes('wrangler deploy') && !scripts.includes('wrangler pages deploy')) {
  errors.push('package.json scripts must use "wrangler pages deploy", not "wrangler deploy"');
}

const wranglerPath = path.join(ROOT, 'wrangler.jsonc');
const wrangler = fs.readFileSync(wranglerPath, 'utf8');
if (!wrangler.includes('pages_build_output_dir')) {
  errors.push('wrangler.jsonc must set pages_build_output_dir');
}
if (!/"name"\s*:\s*"parama"/.test(wrangler)) {
  errors.push('wrangler.jsonc must set "name": "parama" (Pages project name)');
}
if (/\"main\"\s*:/.test(wrangler) || /\"assets\"\s*:/.test(wrangler)) {
  errors.push('wrangler.jsonc must not set main or assets (Pages static site)');
}

const publicIndex = path.join(ROOT, 'public', 'index.html');
if (!fs.existsSync(publicIndex)) {
  errors.push('public/index.html missing — run: node scripts/workers-ci-build.mjs');
}

const cloudflareMd = fs.readFileSync(path.join(ROOT, 'CLOUDFLARE.md'), 'utf8');
const deployRow = cloudflareMd.match(/\|\s*\*\*Deploy command\*\*\s*\|\s*`([^`]+)`/);
if (!deployRow || !deployRow[1].includes('wrangler pages deploy')) {
  errors.push('CLOUDFLARE.md Deploy command row must use wrangler pages deploy');
}
if (deployRow?.[1].includes('wrangler deploy') && !deployRow[1].includes('pages deploy')) {
  errors.push('CLOUDFLARE.md Deploy command must not be wrangler deploy');
}

if (errors.length) {
  console.error('[verify:cf] FAILED:\n');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log('[verify:cf] OK — Pages build output and deploy commands are configured correctly.');
console.log('[verify:cf] Dashboard: Build = node scripts/workers-ci-build.mjs | Output = public');
console.log('[verify:cf] Dashboard: Deploy = npx wrangler pages deploy public --project-name=parama');
console.log('[verify:cf] (Do not use npx wrangler deploy)');
