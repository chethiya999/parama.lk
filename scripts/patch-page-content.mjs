#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function write(file, html) {
  fs.writeFileSync(path.join(ROOT, file), html, 'utf8');
  console.log(`patched ${file}`);
}

const SKIP_LINK = `<a href="#main-content" class="skip-link">Skip to main content</a>`;

function patchIndex() {
  let html = read('index.html');

  if (!html.includes('class="skip-link"')) {
    html = html.replace(/<body>\s*/, `<body>\n    ${SKIP_LINK}\n\n    `);
  }

  if (!html.includes('<header class="navbar"')) {
    html = html.replace(
      '<!-- Navigation Bar -->\n    <div class="navbar">',
      '<!-- Navigation Bar -->\n    <header class="navbar" role="banner">'
    );
    html = html.replace(
      '<div id="primary-nav" class="nav-links',
      '<nav id="primary-nav" class="nav-links'
    );
    html = html.replace(
      /(<nav id="primary-nav" class="nav-links[^>]*)(>)/,
      '$1 aria-label="Primary navigation"$2'
    );
    html = html.replace(
      /class="quote-btn">Get a Quote<\/a>\s*<\/div>\s*\n(\s*<!-- Hero:)/,
      'class="quote-btn">Get a Quote</a>\n    </header>\n\n    <main id="main-content">\n$1'
    );
  }

  html = html.replace(/<h1>Our Subsidiary Companies<\/h1>/, '<h2 class="section-heading">Our Subsidiary Companies</h2>');

  const seoBlock = `    <section class="seo-intro-section reveal-on-scroll">
        <div class="container">
            <p class="seo-intro">Parama Group is a leading industrial group in Sri Lanka, delivering <strong>PVC pipes</strong>, <strong>plastic recycling</strong>, greenhouse and garden hose solutions, <strong>industrial machinery</strong>, and <strong>weighbridge services</strong>. From Kalutara, we support contractors, factories, and businesses nationwide with quality products and over 20 years of experience.</p>
        </div>
    </section>

`;
  if (!html.includes('seo-intro-section')) {
    html = html.replace(
      /(\s*<\/motion>\s*<\/motion>\s*\n)(<!-- Stats Section with Auto-playing Video -->)/,
      `$1${seoBlock}$2`
    );
    html = html.replace(
      /(\s*<\/div>\s*<\/div>\s*\n)(<!-- Stats Section with Auto-playing Video -->)/,
      `$1${seoBlock}$2`
    );
  }

  let i = 0;
  const coverAlts = [
    'Parama Group industrial facility Sri Lanka',
    'PVC pipe manufacturing and plastic recycling Sri Lanka',
    'Sustainable industrial solutions Parama Group Sri Lanka',
  ];
  html = html.replace(/alt="Parama Group — cover"/g, () => coverAlts[i++] || coverAlts[0]);

  html = html.replace('alt="PARAMA PVC Logo"', 'alt="PVC pipes manufacturing Sri Lanka — Parama Group"');
  html = html.replace('alt="PARAMA Alkathene Logo"', 'alt="Alkathene hose products Sri Lanka — Parama Group"');
  html = html.replace('alt="PARAMA Plastic Recycle Logo"', 'alt="Garden hose and greenhouse solutions Sri Lanka"');
  html = html.replace('alt="WAYBRIDGE PARAMA Logo"', 'alt="Weighbridge services Sri Lanka — Parama Group"');
  html = html.replace('alt="PARAMA Logistics Logo"', 'alt="Plastic recycling Sri Lanka — Parama Group"');

  if (!html.includes('</main>')) {
    html = html.replace('    <!-- Footer Section -->', '    </main>\n\n    <!-- Footer Section -->');
  }

  if (!html.includes('js/analytics.js')) {
    html = html.replace(
      '</body>',
      `    <a href="https://wa.me/94718393764?text=Hello%2C%20I%27d%20like%20to%20get%20a%20quote" class="whatsapp-float" aria-label="Chat on WhatsApp" title="Chat on WhatsApp"><i class="fab fa-whatsapp" aria-hidden="true"></i></a>
    <script src="js/analytics.js" defer></script>
    <script src="js/performance.js" defer></script>
</body>`
    );
  }

  write('index.html', html);
}

function patchContact() {
  let html = read('contact.html');
  const mapEmbed = `<motion class="map-embed">
          <iframe
            title="Parama Industries — Panapitiya, Waskaduwa, Kalutara, Sri Lanka"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.5!2d79.9526!3d6.6489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2440000000001%3A0x0!2sWaskaduwa!5e0!3m2!1sen!2slk!4v1710000000000!5m2!1sen!2slk"
            width="600"
            height="450"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>`.replace('<motion class="map-embed">', '<div class="map-embed">');

  if (!html.includes('map-embed')) {
    html = html.replace(
      /<div class="map-container">\s*<div class="map-placeholder">[\s\S]*?<\/div>\s*<\/div>/,
      `<div class="map-container">\n          ${mapEmbed}\n        </div>`
    );
  }

  html = html.replace(
    '<form class="contact-form" id="contactForm">',
    '<form class="contact-form" id="contactForm" method="post" action="#" aria-label="Contact Parama Group">'
  );

  if (!html.includes('js/analytics.js')) {
    html = html.replace(
      '</body>',
      `    <a href="https://wa.me/94718393764?text=Hello%2C%20I%27d%20like%20to%20get%20a%20quote" class="whatsapp-float" aria-label="Chat on WhatsApp" title="Chat on WhatsApp"><i class="fab fa-whatsapp" aria-hidden="true"></i></a>
    <script src="js/analytics.js" defer></script>
    <script src="js/performance.js" defer></script>
</body>`
    );
  }

  write('contact.html', html);
}

function patchMachinery() {
  let html = read('machinery.html');
  html = html.replace(/\s*<a href="#main-content" class="machinery-skip">Skip to main content<\/a>\s*/g, '\n');
  write('machinery.html', html);
}

function addSeoBlock(file, pattern, heading, paragraphs) {
  let html = read(file);
  if (html.includes('class="seo-content-block"')) {
    console.log(`skip ${file}`);
    return;
  }
  const block = `
    <section class="seo-content-block">
        <div class="container">
            <h2>${heading}</h2>
            ${paragraphs.map((p) => `<p>${p}</p>`).join('\n            ')}
        </div>
    </section>`;
  html = html.replace(pattern, `$1${block}`);
  write(file, html);
}

patchIndex();
patchContact();
patchMachinery();

addSeoBlock(
  'about.html',
  /(<section class="hero-section">[\s\S]*?<\/section>)/,
  'About Parama Group Sri Lanka',
  [
    'Parama Group has grown over two decades into one of Sri Lanka’s trusted names in PVC manufacturing, plastic recycling, and industrial services.',
    'Headquartered in Panapitiya, Waskaduwa, we combine modern machinery, skilled teams, and sustainable practices to help clients across Sri Lanka.',
  ]
);

addSeoBlock(
  'plastic-recycale.html',
  /(<section class="header">[\s\S]*?<\/section>)/,
  'Plastic Recycling in Sri Lanka',
  [
    'Parama Group provides professional plastic recycling services across Sri Lanka—from collection and sorting to processing and supply of recycled materials.',
    'We support PET, HDPE, PP, and industrial plastics with reliable pickup schedules and sustainability documentation.',
  ]
);
