#!/usr/bin/env node
/**
 * Copy production static assets into public/ for Cloudflare Pages deploy.
 *
 * Usage (from repo root):
 *   node scripts/build-static.mjs
 *   npm run build
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public');

const MAX_BYTES = 24 * 1024 * 1024;

const COPY_DIRS = ['css', 'js', 'images', 'gallery', 'seo'];

const COPY_ROOT_FILES = [
  'robots.txt',
  'sitemap.xml',
  '_headers',
];

const SKIP_EXT = new Set(['.md', '.psd', '.ai', '.zip']);

const ASSETSIGNORE = `.git/
node_modules/
*.md
*copy*
*.psd
*.ai
.env
.DS_Store
`;

function shouldSkip(name) {
  const lower = name.toLowerCase();
  if (name.startsWith('.')) return true;
  if (lower.includes('copy')) return true;
  const ext = path.extname(name).toLowerCase();
  if (SKIP_EXT.has(ext)) return true;
  return false;
}

function rmDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function copyFile(src, dest) {
  const stat = fs.statSync(src);
  if (stat.size > MAX_BYTES) {
    const mib = (stat.size / (1024 * 1024)).toFixed(1);
    throw new Error(
      `File exceeds 24 MiB limit: ${path.relative(ROOT, src)} (${mib} MiB)`
    );
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  return stat.size;
}

function copyDir(srcDir, destDir) {
  let count = 0;
  let bytes = 0;

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (shouldSkip(entry.name)) continue;

    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      const sub = copyDir(src, dest);
      count += sub.count;
      bytes += sub.bytes;
    } else if (entry.isFile()) {
      bytes += copyFile(src, dest);
      count += 1;
    }
  }

  return { count, bytes };
}

function main() {
  rmDir(OUT_DIR);
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let fileCount = 0;
  let totalBytes = 0;

  for (const dir of COPY_DIRS) {
    const src = path.join(ROOT, dir);
    if (!fs.existsSync(src)) {
      console.warn(`skip missing directory: ${dir}/`);
      continue;
    }
    const { count, bytes } = copyDir(src, path.join(OUT_DIR, dir));
    fileCount += count;
    totalBytes += bytes;
  }

  for (const name of COPY_ROOT_FILES) {
    const src = path.join(ROOT, name);
    if (!fs.existsSync(src)) {
      console.warn(`skip missing root file: ${name}`);
      continue;
    }
    totalBytes += copyFile(src, path.join(OUT_DIR, name));
    fileCount += 1;
  }

  for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
    if (shouldSkip(entry.name)) continue;

    const src = path.join(ROOT, entry.name);
    const dest = path.join(OUT_DIR, entry.name);
    totalBytes += copyFile(src, dest);
    fileCount += 1;
  }

  fs.writeFileSync(path.join(OUT_DIR, '.assetsignore'), ASSETSIGNORE, 'utf8');
  fileCount += 1;

  const mib = (totalBytes / (1024 * 1024)).toFixed(1);
  console.log(`Built public/: ${fileCount} files, ${mib} MiB`);
}

main();
