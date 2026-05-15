# Parama.lk — Home page cover content kit

**Purpose:** One document that summarizes the current marketing site and supplies **copy blocks** you can drop into new home page hero slides, cover sections, or carousels. Pair each block with imagery from the paths noted.

**Site:** Static HTML/CSS/vanilla JS for **Parama Group** (PVC and hose manufacturing, plastic recycling, weighbridge, industrial machinery in Sri Lanka). Canonical examples use `https://parama.lk` where set in page meta.

**Primary CTAs sitewide:** About company (`about.html`), product and service pages, gallery, contact, WhatsApp quote `https://wa.me/94718393764`.

---

## 1. Brand snapshot (use on any cover)

| Role | Suggested copy (from live pages) |
|------|----------------------------------|
| **Browser title (home)** | Parama Group — Innovating for a Greener Tomorrow |
| **Hero headline** | “20 years hardware products supplier” (site uses straight quotes around this phrase) |
| **Hero subline** | PVC pipes, Alkathene hose manufacturing and plastic recycling |
| **Supporting paragraph** | Building a sustainable future through PVC and Alkathene manufacturing, plastic recycling, and gardening-related products. Commitment to quality, sustainability, and community development. |
| **Footer one-liner** | Building a sustainable future through innovative solutions in PVC manufacturing, plastic recycling, and gardening services. |

**Tone:** B2B industrial, sustainability-aware, Sri Lanka–focused operations.

---

## 2. Full site map (all HTML entry points)

| Page | File | What visitors get |
|------|------|-------------------|
| Home | `index.html` | Hero, stats video strip, animated counters, subsidiary cards, footer |
| About | `about.html` | Mission, vision, company story |
| Contact | `contact.html` | Contact layout; form UX in `js/contact.js` (front-end only unless wired) |
| Gallery | `gallery/gallery.html` | Event gallery, filters, lightbox; data in `gallery/gallery-data.js` |
| Machinery | `machinery.html` | Machinery import/resale: shredders, crushers, pipe lines, laser marking, blades; SEO meta + OG |
| Product — PVC | `product-pvc.html` | PVC irrigation / pipe range |
| Product — Conduit | `product-conduit.html` | Electrical conduit |
| Product — Alkathene | `product-alkathene.html` | Alkathene hose |
| Product — Garden hose | `product-Garden Hose.html` | Garden hose (URL may need `%20` for space) |
| Product — Pallets | `plastic-pallets.html` | Plastic pallets |
| Service — Recycling | `plastic-recycale.html` | Plastic recycling (nav label “Recycale”) |
| Service — Weighbridge | `weighbridge.html` | Weighbridge / WAYBRIDGE offering |

**Global nav (as on `index.html`):** Home; Product (dropdown); Service (dropdown); **Machinery** (dropdown to anchors on `machinery.html`); About us; Gallery; Contact Us; Get a Quote (WhatsApp).

---

## 3. Numbers and proof (home + machinery)

Use consistently after editorial sign-off (home stats section vs machinery page use different machine-delivery figures).

**From `index.html` (stats counters):**

- 5+ subsidiary companies  
- 2000+ products manufactured  
- 15+ countries served  
- 100+ expert team members  
- 20+ years of experience (counter target in markup is aligned with “20 years” messaging)

**From `machinery.html` (intro stat cards):**

- 20+ years experience  
- 500+ machines delivered  
- Islandwide service coverage  

**Media hooks for covers:** Hero image `images/bg/cover-page2.jpg`; stats background video `images/status-small.mp4` with poster `images/stats-image.jpg`.

---

## 4. Subsidiary / vertical cards (home grid — exact blurbs)

These match the subsidiary section on the home page; each is a natural **cover slide** theme.

| Vertical | Short description (site copy) | Primary link |
|----------|----------------------------------|--------------|
| **PARAMA PVC Manufacturing** | Premium PVC pipe manufacturing and outdoor watering solutions for commercial use. | `product-pvc.html` |
| **PARAMA Alkathene Manufacturing** | Premium Alkathene hose manufacturing and outdoor watering solutions for commercial use. | `product-alkathene.html` |
| **PARAMA Garden Hose** | Premium garden hose manufacturing and outdoor watering solutions for commercial use. | `product-Garden Hose.html` |
| **PARAMA WAYBRIDGE** | High quality and advanced bridge technology and infrastructure solutions for modern transportation. | `weighbridge.html` |
| **PARAMA Plastic Recycle** | High performance environmental plastic recycling and sustainable waste management solutions. | `plastic-recycale.html` |

**Note:** WAYBRIDGE card copy says “bridge technology”; the service page is weighbridge — align wording on covers if you refresh copy.

---

## 5. Machinery page — cover-ready headlines

Use for a dedicated home slide or section linking to `machinery.html`.

| Block | Title | Subline / body (condensed from page) |
|-------|-------|----------------------------------------|
| **Hero** | Industrial Machinery Solutions | Importing, supplying and reselling advanced PVC manufacturing and recycling machinery in Sri Lanka. |
| **Intro** | Engineering-Grade Supply for Modern Factories | Parama Machinery Import and Resale Division — PVC production machinery, recycling systems, industrial cutting equipment, factory automation. |
| **Portfolio** | Advanced Machinery Portfolio | In-page showcase of shredder, crusher, pipe extrusion, laser marking, blades (anchor IDs: `#machinery-shredder`, `#machinery-crusher`, `#machinery-pipe`, `#machinery-laser`, `#machinery-blades`). |
| **Trust** | Why Choose Parama Machinery | Use bullets from that section on the live page for specifics. |
| **CTA** | Looking for Industrial Machinery Solutions? | Pair with WhatsApp machinery quotation link as on `machinery.html`. |

**Imagery folder:** `images/machinery/` (hero shots per line: e.g. `shredder/hero.png`, `crusher/hero.png`, `pipe/hero.png`, `laser/hero.png`, `facility/hero.png`, blade heroes under `shredder-blades/`, `crusher-blades/`).

---

## 6. Suggested **new home cover slides** (carousel / full-bleed sections)

Each row is one slide: **title**, **subtitle**, **CTA label**, **href**, **image idea**.

1. **Group master** — *Two decades of industrial supply and manufacturing in Sri Lanka.* — About Company — `about.html` — facility or `cover-page2.jpg`  
2. **PVC & conduit** — *Irrigation pipe, conduit, and commercial-grade solutions.* — View PVC range — `product-pvc.html` — `images/pvc.jpg` or product art  
3. **Hoses** — *Alkathene and garden hose manufacturing.* — Explore hoses — `product-alkathene.html` / `product-Garden Hose.html` — alkathene / garden hose logos from home cards  
4. **Recycling** — *Environmental plastic recycling and waste management.* — Recycling services — `plastic-recycale.html` — recycle branding imagery  
5. **Weighbridge** — *Weighbridge services for transport and logistics.* — WAYBRIDGE — `weighbridge.html` — `images/bridge-yelow.png`  
6. **Machinery** — *Import, supply, and resale of PVC and recycling machinery.* — Machinery portfolio — `machinery.html` — `images/machinery/shredder/hero.png`  
7. **Pallets** — *Plastic pallet solutions.* — Plastic pallets — `plastic-pallets.html` — product page imagery  
8. **Events & trust** — *Photos from group events and operations.* — View gallery — `gallery/gallery.html` — `images/gallery/` event shots  
9. **Contact** — *Talk to the team or request a quote.* — Contact / WhatsApp — `contact.html` + WhatsApp — team or contact hero  

---

## 7. Technical and ops (short)

- **Stack:** Static HTML, multiple CSS files, vanilla JS; optional `node scripts/build-gallery.mjs` for gallery assets and `gallery-data.js`.  
- **CDN:** Animate.css, Font Awesome 6.  
- **Forms:** Subscribe (`#subscribe-form` on home) and contact forms are not wired to a backend in-repo unless you add one.  
- **Footer:** Copyright line references Netfortify Solutions; update year/entity as needed for 2026 production.

---

## 8. Copy consistency checklist (before publishing new covers)

- “Alkathine” vs “Alkathene” appears in different places — pick one spelling for covers.  
- “Recycale” vs “Recycle” — match nav or fix everywhere.  
- WAYBRIDGE / weighbridge / “bridge technology” — align customer-facing language.  
- Garden hose card uses an image alt that still says “Plastic Recycle Logo” in HTML — fix when you redesign covers.

---

*Generated for content and UX planning. For file-level technical inventory, see `WEBSITE-SUMMARY-REPORT.md`.*
