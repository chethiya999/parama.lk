#!/usr/bin/env node
/**
 * Parama gallery: rename images in images/gallery/ to event-gallery-NNN.jpg and
 * emit gallery/gallery-data.js with const galleryItems = [...]
 *
 * Usage (from repo root):
 *   node scripts/build-gallery.mjs
 *
 * This script MUTATES filenames on disk. Review git diff before committing.
 * Safe to re-run: if only event-gallery-*.jpg remain, it regenerates gallery-data.js only.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const GALLERY_DIR = path.join(ROOT, 'images', 'gallery');
const OUT_FILE = path.join(ROOT, 'gallery', 'gallery-data.js');

const IMAGE_EXT = new Set(['.jpeg', '.jpg', '.png']);
const SKIP_NAMES = new Set(['gallery.json', 'file-list.json']);

const TITLES = [
  'Corporate Event',
  'Team Building Session',
  'Industrial Operations',
  'Company Gathering',
  'Factory Visit',
  'Staff Meeting',
  'Product Showcase',
  'Business Conference',
  'CSR Activity',
  'Annual Celebration',
  'Corporate Networking',
  'Exhibition Program',
  'Industrial Event',
  'Management Meeting',
  'Team Activity',
  'Leadership Summit',
];

const CATEGORIES = [
  'Company Events',
  'Staff Activities',
  'Factory Operations',
  'CSR Programs',
  'Exhibitions',
  'Business Meetings',
  'Special Events',
];

function parseWhatsAppSortKey(filename) {
  const m = filename.match(
    /WhatsApp Image (\d{4}-\d{2}-\d{2}) at (\d+)\.(\d+)\.(\d+)\s+(AM|PM)/i
  );
  if (!m) return null;
  const dateStr = m[1];
  let h = parseInt(m[2], 10);
  const min = parseInt(m[3], 10);
  const sec = parseInt(m[4], 10);
  const ap = m[5].toUpperCase();
  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  const t = h * 3600 + min * 60 + sec;
  return { dateStr, t, filename };
}

function sortKeyForFile(name) {
  const parsed = parseWhatsAppSortKey(name);
  if (parsed) {
    return { primary: 0, dateStr: parsed.dateStr, t: parsed.t, name: parsed.filename };
  }
  const ev = name.match(/^event-gallery-(\d+)\.(jpg|jpeg|png)$/i);
  if (ev) {
    return { primary: 1, n: parseInt(ev[1], 10), name };
  }
  return { primary: 2, name };
}

function compareFiles(a, b) {
  const ka = sortKeyForFile(a);
  const kb = sortKeyForFile(b);
  if (ka.primary !== kb.primary) return ka.primary - kb.primary;
  if (ka.primary === 0 && kb.primary === 0) {
    if (ka.dateStr !== kb.dateStr) return ka.dateStr.localeCompare(kb.dateStr);
    if (ka.t !== kb.t) return ka.t - kb.t;
    return ka.name.localeCompare(kb.name);
  }
  if (ka.primary === 1 && kb.primary === 1) {
    if (ka.n !== kb.n) return ka.n - kb.n;
    return ka.name.localeCompare(kb.name);
  }
  return ka.name.localeCompare(kb.name);
}

function stableHash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function titleForIndex(i, basename) {
  const h = stableHash(String(i) + basename);
  return TITLES[h % TITLES.length];
}

function categoryForIndex(i, basename) {
  const h = stableHash('cat' + String(i) + basename);
  return CATEGORIES[h % CATEGORIES.length];
}

function isEventGalleryName(name) {
  return /^event-gallery-\d+\.(jpg|jpeg|png)$/i.test(name);
}

function listGalleryImageFiles() {
  if (!fs.existsSync(GALLERY_DIR)) {
    console.error('Missing directory:', GALLERY_DIR);
    process.exit(1);
  }
  return fs
    .readdirSync(GALLERY_DIR)
    .filter((name) => !SKIP_NAMES.has(name) && !name.startsWith('.'))
    .filter((name) => IMAGE_EXT.has(path.extname(name).toLowerCase()));
}

function needsRename(files) {
  return files.some((f) => !isEventGalleryName(f));
}

function renamePipeline(sortedOldNames) {
  const tmpPrefix = '__tmp_gallery_rename_';
  // Pass 1: to temp (keep original extension to avoid collisions)
  sortedOldNames.forEach((oldName, idx) => {
    const ext = path.extname(oldName);
    const tmp = `${tmpPrefix}${String(idx + 1).padStart(3, '0')}${ext}`;
    fs.renameSync(path.join(GALLERY_DIR, oldName), path.join(GALLERY_DIR, tmp));
  });
  // Pass 2: temp → event-gallery-NNN.jpg (binary unchanged; .jpg extension per spec)
  sortedOldNames.forEach((_, idx) => {
    const num = String(idx + 1).padStart(3, '0');
    const found = fs
      .readdirSync(GALLERY_DIR)
      .find((n) => n.startsWith(`${tmpPrefix}${num}`));
    if (!found) throw new Error('Temp rename file missing for index ' + (idx + 1));
    const tmpPath = path.join(GALLERY_DIR, found);
    const finalName = `event-gallery-${num}.jpg`;
    const finalPath = path.join(GALLERY_DIR, finalName);
    fs.renameSync(tmpPath, finalPath);
  });
}

function main() {
  let files = listGalleryImageFiles();

  if (files.length === 0) {
    console.warn('No images found in', GALLERY_DIR);
    writeGalleryDataJs([]);
    return;
  }

  if (needsRename(files)) {
    const toRename = files.filter((f) => !isEventGalleryName(f));
    const already = files.filter((f) => isEventGalleryName(f));
    if (already.length > 0) {
      console.error(
        'Mixed state: both event-gallery-* and other images exist. Move or rename manually, then re-run.'
      );
      process.exit(1);
    }
    toRename.sort(compareFiles);
    console.log('Renaming', toRename.length, 'files to event-gallery-NNN.jpg ...');
    renamePipeline(toRename);
    files = listGalleryImageFiles().filter((f) => isEventGalleryName(f));
  }

  files = files.filter((f) => isEventGalleryName(f)).sort(compareFiles);

  const items = files.map((filename, i) => {
    const id = i + 1;
    const title = titleForIndex(i, filename);
    const category = categoryForIndex(i, filename);
    const featured = id <= 6;
    const imagePath = `../images/gallery/${filename}`;
    return {
      id,
      image: imagePath,
      title,
      category,
      description: `Professional ${category.toLowerCase()} conducted by Parama.`,
      date: '2026',
      featured,
      alt: `${title} — ${category} at Parama`,
    };
  });

  writeGalleryDataJs(items);
  console.log('Wrote', OUT_FILE, 'with', items.length, 'items.');
}

function writeGalleryDataJs(items) {
  const lines = items.map((it) => {
    return (
      `  {\n` +
      `    id: ${it.id},\n` +
      `    image: ${JSON.stringify(it.image)},\n` +
      `    title: ${JSON.stringify(it.title)},\n` +
      `    category: ${JSON.stringify(it.category)},\n` +
      `    description: ${JSON.stringify(it.description)},\n` +
      `    date: ${JSON.stringify(it.date)},\n` +
      `    featured: ${it.featured ? 'true' : 'false'},\n` +
      `    alt: ${JSON.stringify(it.alt)}\n` +
      `  }`
    );
  });
  const body = `/**\n * Auto-generated by scripts/build-gallery.mjs — do not edit by hand.\n */\nconst galleryItems = [\n${lines.join(',\n')}\n];\n`;
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, body, 'utf8');
}

main();
