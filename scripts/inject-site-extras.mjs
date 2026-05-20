#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PAGES } from '../seo/site-config.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const SKIP = '<a href="#main-content" class="skip-link">Skip to main content</a>';


const WHATSAPP = `<a href="https://wa.me/94718393764?text=Hello%2C%20I%27d%20like%20to%20get%20a%20quote" class="whatsapp-float" aria-label="Chat on WhatsApp" title="Chat on WhatsApp"><i class="fab fa-whatsapp" aria-hidden="true"></i></a>`;

function prefix(file) {
  return file.includes('/') ? '../' : '';
}

function inject(file) {
  const fp = path.join(ROOT, file);
  let html = fs.readFileSync(fp, 'utf8');
  const p = prefix(file);

  if (!html.includes('class="skip-link"')) {
    html = html.replace(/<body([^>]*)>/i, `<body$1>\n    ${SKIP}\n`);
  }

  const scripts = `<script src="${p}js/analytics.js" defer></script>\n    <script src="${p}js/performance.js" defer></script>`;
  if (!html.includes('js/analytics.js')) {
    const beforeBody = html.includes('class="whatsapp-float"')
      ? scripts
      : `${WHATSAPP}\n    ${scripts}`;
    html = html.replace(/<\/body>/i, `    ${beforeBody}\n</body>`);
  }

  fs.writeFileSync(fp, html, 'utf8');
  console.log(`extras: ${file}`);
}

for (const page of PAGES) inject(page.file);
