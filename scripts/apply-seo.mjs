#!/usr/bin/env node
/**
 * Inject shared SEO head block and JSON-LD into HTML pages.
 * Usage: node scripts/apply-seo.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PAGES, SITE, absoluteUrl, pageByFile } from '../seo/site-config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const MARKER_START = '<!-- parama-seo:start -->';
const MARKER_END = '<!-- parama-seo:end -->';
const LD_MARKER = '<!-- parama-jsonld -->';

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function assetPrefix(file) {
  return file.includes('/') ? '../' : '';
}

function buildSeoBlock(page, file) {
  const prefix = assetPrefix(file);
  const canonical = absoluteUrl(page.path);
  const ogImage = absoluteUrl(
    page.ogImage.startsWith('http') ? page.ogImage : page.ogImage
  );
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const keywords = escapeHtml(page.keywords);

  return `${MARKER_START}
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywords}">
    <meta name="author" content="${escapeHtml(SITE.name)}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <link rel="canonical" href="${canonical}">

    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${escapeHtml(SITE.name)}">
    <meta property="og:locale" content="${SITE.locale}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${ogImage}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${ogImage}">

    <link rel="icon" href="${prefix}images/logo/logo.png" type="image/png">
    <link rel="apple-touch-icon" href="${prefix}images/logo/logo.png">

    <meta name="google-site-verification" content="${escapeHtml(SITE.googleSiteVerification)}">
    <meta name="theme-color" content="#1a7a3a">

    <link rel="stylesheet" href="${prefix}css/seo-performance.css">
${MARKER_END}`;
}

function buildJsonLd(page) {
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE.url}/#localbusiness`,
    name: SITE.legalName,
    alternateName: SITE.name,
    url: SITE.url,
    logo: absoluteUrl(SITE.defaultOgImage),
    image: absoluteUrl(page.ogImage),
    description: page.description,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    areaServed: { '@type': 'Country', name: 'Sri Lanka' },
    sameAs: ['https://www.facebook.com/paramaindlk/'],
  };

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: absoluteUrl(SITE.defaultOgImage),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE.phone,
      contactType: 'sales',
      areaServed: 'LK',
      availableLanguage: ['English', 'Sinhala'],
    },
  };

  const graph = [localBusiness, organization];

  if (page.file === 'index.html') {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      name: SITE.name,
      url: SITE.url,
      publisher: { '@id': `${SITE.url}/#organization` },
      inLanguage: 'en-LK',
    });
  }

  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>`;
}

function stripLegacySeo(head) {
  let h = head;
  const markerRe = new RegExp(
    `${MARKER_START}[\\s\\S]*?${MARKER_END}\\s*`,
    'gi'
  );
  h = h.replace(markerRe, '');
  h = h.replace(/<title>[^<]*<\/title>\s*/gi, '');
  h = h.replace(/<meta name="description"[^>]*>\s*/gi, '');
  h = h.replace(/<meta name="keywords"[^>]*>\s*/gi, '');
  h = h.replace(/<meta name="author"[^>]*>\s*/gi, '');
  h = h.replace(/<meta name="robots"[^>]*>\s*/gi, '');
  h = h.replace(/<link rel="canonical"[^>]*>\s*/gi, '');
  h = h.replace(/<meta property="og:[^"]*"[^>]*>\s*/gi, '');
  h = h.replace(/<meta name="twitter:[^"]*"[^>]*>\s*/gi, '');
  h = h.replace(/<link rel="icon"[^>]*>\s*/gi, '');
  h = h.replace(/<link rel="apple-touch-icon"[^>]*>\s*/gi, '');
  h = h.replace(/<meta name="google-site-verification"[^>]*>\s*/gi, '');
  h = h.replace(/<meta name="theme-color"[^>]*>\s*/gi, '');
  h = h.replace(
    /<link rel="stylesheet" href="[^"]*seo-performance\.css"[^>]*>\s*/gi,
    ''
  );
  h = h.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi,
    ''
  );
  h = h.replace(new RegExp(`${LD_MARKER}\\s*`, 'g'), '');
  return h;
}

function injectSeo(html, file) {
  const page = pageByFile(file);
  const block = buildSeoBlock(page, file);
  const jsonLd = buildJsonLd(page);

  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) return html;

  let head = stripLegacySeo(headMatch[1]);

  head = head.replace(
    /(<meta name="viewport"[^>]*>\s*)/i,
    `$1${block}\n`
  );

  head = head.trimEnd() + `\n    ${jsonLd}\n    ${LD_MARKER}\n`;

  return html.replace(headMatch[0], `<head>${head}</head>`);
}

function main() {
  let updated = 0;
  for (const page of PAGES) {
    const filePath = path.join(ROOT, page.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`skip missing: ${page.file}`);
      continue;
    }
    const html = fs.readFileSync(filePath, 'utf8');
    const next = injectSeo(html, page.file);
    if (next !== html) {
      fs.writeFileSync(filePath, next, 'utf8');
      updated += 1;
      console.log(`updated ${page.file}`);
    } else {
      console.log(`unchanged ${page.file}`);
    }
  }
  console.log(`Done. ${updated} file(s) updated.`);
}

main();
