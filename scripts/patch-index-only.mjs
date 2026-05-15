#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const fp = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'index.html');
let h = fs.readFileSync(fp, 'utf8');

if (!h.includes('class="skip-link"')) {
  h = h.replace(
    '<body>',
    `<body>
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <div class="local-business-bar" role="region" aria-label="Contact information">
        <div class="container">
            <span><i class="fas fa-map-marker-alt" aria-hidden="true"></i> Panapitiya, Waskaduwa, Kalutara, Sri Lanka</span>
            <a href="tel:+94718393764"><i class="fas fa-phone" aria-hidden="true"></i> +94 71 839 3764</a>
            <a href="https://wa.me/94718393764"><i class="fab fa-whatsapp" aria-hidden="true"></i> WhatsApp</a>
            <span><i class="fas fa-clock" aria-hidden="true"></i> Mon–Sun 8:00 AM – 6:00 PM</span>
        </div>
    </div>

`
  );
}

if (!h.includes('<header class="navbar"')) {
  h = h.replace(
    '<!-- Navigation Bar -->\n    <div class="navbar">',
    '<!-- Navigation Bar -->\n    <header class="navbar" role="banner">'
  );
  h = h.replace(
    '<motion id="primary-nav" class="nav-links animate__animated animate__fadeIn">',
    '<nav id="primary-nav" class="nav-links animate__animated animate__fadeIn" aria-label="Primary navigation">'
  );
  h = h.replace(
    '<div id="primary-nav" class="nav-links animate__animated animate__fadeIn">',
    '<nav id="primary-nav" class="nav-links animate__animated animate__fadeIn" aria-label="Primary navigation">'
  );
  h = h.replace(
    '            <a href="contact.html">Contact Us</a>\n        </div>\n\n        <a href="https://wa.me',
    '            <a href="contact.html">Contact Us</a>\n        </nav>\n\n        <a href="https://wa.me'
  );
  h = h.replace(
    '        <a href="https://wa.me/94718393764?text=Hello%2C%20I%27d%20like%20to%20get%20a%20quote" class="quote-btn">Get a Quote</a>\n    </div>\n    \n    <!-- Hero: full-width cover slideshow -->',
    '        <a href="https://wa.me/94718393764?text=Hello%2C%20I%27d%20like%20to%20get%20a%20quote" class="quote-btn">Get a Quote</a>\n    </header>\n\n    <main id="main-content">\n    <!-- Hero: full-width cover slideshow -->'
  );
}

h = h.replace(
  /<h1>Our Subsidiary Companies<\/h1>/,
  '<h2 class="section-heading">Our Subsidiary Companies</h2>'
);

const seo = `    <section class="seo-intro-section reveal-on-scroll">
        <div class="container">
            <p class="seo-intro">Parama Group is a leading industrial group in Sri Lanka, delivering <strong>PVC pipes</strong>, <strong>plastic recycling</strong>, greenhouse and garden hose solutions, <strong>industrial machinery</strong>, and <strong>weighbridge services</strong>. From Kalutara, we support businesses nationwide with over 20 years of experience.</p>
        </div>
    </section>

`;

if (!h.includes('seo-intro-section')) {
  h = h.replace(
    '    </div>\n\n<!-- Stats Section with Auto-playing Video -->',
    `    </div>\n\n${seo}<!-- Stats Section with Auto-playing Video -->`
  );
}

const alts = [
  'Parama Group industrial facility Sri Lanka',
  'PVC manufacturing and plastic recycling Sri Lanka',
  'Sustainable industrial solutions Parama Group Sri Lanka',
];
let ai = 0;
h = h.replace(/alt="Parama Group — cover"/g, () => alts[ai++] || alts[0]);

h = h.replace('alt="PARAMA PVC Logo"', 'alt="PVC pipes manufacturing Sri Lanka — Parama Group"');
h = h.replace('alt="PARAMA Alkathene Logo"', 'alt="Alkathene hose products Sri Lanka — Parama Group"');
h = h.replace('alt="PARAMA Plastic Recycle Logo"', 'alt="Garden hose and greenhouse solutions Sri Lanka"');
h = h.replace('alt="WAYBRIDGE PARAMA Logo"', 'alt="Weighbridge services Sri Lanka — Parama Group"');
h = h.replace('alt="PARAMA Logistics Logo"', 'alt="Plastic recycling Sri Lanka — Parama Group"');

if (!h.includes('</main>')) {
  h = h.replace('    <!-- Footer Section -->', '    </main>\n\n    <!-- Footer Section -->');
}

if (!h.includes('js/analytics.js')) {
  h = h.replace(
    '</body>',
    `    <a href="https://wa.me/94718393764?text=Hello%2C%20I%27d%20like%20to%20get%20a%20quote" class="whatsapp-float" aria-label="Chat on WhatsApp" title="Chat on WhatsApp"><i class="fab fa-whatsapp" aria-hidden="true"></i></a>
    <script src="js/analytics.js" defer></script>
    <script src="js/performance.js" defer></script>
</body>`
  );
}

fs.writeFileSync(fp, h);
const ok =
  h.includes('skip-link') &&
  h.includes('</header>') &&
  h.includes('<main id="main-content">') &&
  h.includes('hero hero--cover-full') &&
  h.includes('</footer>');
console.log(ok ? 'index.html OK' : 'index.html CHECK FAILED', {
  skip: h.includes('skip-link'),
  header: h.includes('</header>'),
  main: h.includes('<main id="main-content">'),
  hero: (h.match(/hero hero--cover-full/g) || []).length,
});
