#!/usr/bin/env node
/**
 * Generate sitemap.xml from seo/site-config.mjs
 * Usage: node scripts/generate-sitemap.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PAGES, SITE, absoluteUrl } from '../seo/site-config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'sitemap.xml');
const lastmod = new Date().toISOString().slice(0, 10);

const priorities = {
  '/': '1.0',
  '/about': '0.8',
  '/contact': '0.9',
  '/machinery': '0.9',
  '/plastic-recycling': '0.9',
  '/weighbridge': '0.8',
  '/pvc-pipes': '0.9',
  '/gallery': '0.7',
};

const urls = PAGES.map((p) => {
  const loc = absoluteUrl(p.path);
  const priority = priorities[p.path] || '0.7';
  const changefreq = p.path === '/' ? 'weekly' : 'monthly';
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

fs.writeFileSync(OUT, xml, 'utf8');
console.log(`Wrote ${OUT} (${PAGES.length} URLs)`);
