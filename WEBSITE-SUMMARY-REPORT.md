# Parama.lk — Website Summary Report

**Report purpose:** High-level documentation of the Parama Group marketing site in this repository: structure, pages, technologies, and maintenance hooks.

**Repository path:** `/home/chethiya/Desktop/parama.lk`  
**Site positioning:** Corporate web presence for **Parama Group** — PVC and hose manufacturing, plastic recycling, weighbridge services, and related industrial products (Sri Lanka; canonical references use `https://parama.lk` on the gallery page).

---

## 1. Executive overview

The project is a **static, multi-page website**: hand-authored HTML, modular CSS, and vanilla JavaScript. There is **no `package.json`**; the site is deployable as plain files on any static host (Apache, Nginx, GitHub Pages, S3, etc.). One **optional Node.js script** (`scripts/build-gallery.mjs`) renames gallery source images and regenerates `gallery/gallery-data.js`.

**Primary audiences:** Prospective B2B customers, partners, and job seekers learning about subsidiaries, products, services, company story, events gallery, and contact channels.

**Notable integrations (external):**

- [Animate.css](https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css) — entrance animations  
- [Font Awesome 6](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css) — icons  
- **WhatsApp “Get a Quote”** — `https://wa.me/94718393764` with a prefilled message (used from the main navigation)

---

## 2. Information architecture (site map)

| Route | File | Role |
|--------|------|------|
| Home | `index.html` | Hero, stats/video, subsidiary cards, footer |
| About | `about.html` | Mission, vision, company narrative |
| Contact | `contact.html` | Contact layout, form UX (`js/contact.js`) |
| Gallery | `gallery/gallery.html` | Event gallery, filters, lightbox-style UX (`gallery.js` + `gallery-data.js`) |
| Product: PVC | `product-pvc.html` | PVC irrigation / pipe product page |
| Product: Conduit | `product-conduit.html` | Electrical conduit |
| Product: Alkathene | `product-alkathene.html` | Alkathene hose |
| Product: Garden hose | `product-Garden Hose.html` | Garden hose (filename contains a space) |
| Product: Plastic pallets | `plastic-pallets.html` | Plastic pallets |
| Service: Plastic recycling | `plastic-recycale.html` | Recycling services (spelling “Recycale” in UI) |
| Service: Weighbridge | `weighbridge.html` | Weighbridge offering |
| Machinery | `machinery.html` | Industrial machinery import, supply, and resale (PVC, recycling, blades, laser marking) |

**Global navigation pattern (repeated across pages):**

- **Home** → `index.html`  
- **Product** (dropdown): PVC Pipes, Electrical Conduit, Alkathene Hose, Garden Hose, Plastic Pallets  
- **Service** (dropdown): Plastic Recycale, Weighbridge  
- **Machinery** (dropdown): anchor links on `machinery.html` (shredder, crusher, pipe, laser, blades)  
- **About us**, **Gallery** (`gallery/gallery.html` from root; `../` paths from gallery folder), **Contact Us**  
- **Get a Quote** → WhatsApp deep link  

Root pages link to the gallery as `gallery/gallery.html`. The gallery page links back with `../` prefixes for consistency when hosted under the same origin.

---

## 3. Content themes (by page group)

### 3.1 Home (`index.html`)

- **Positioning:** ~20 years as a hardware supplier; PVC, Alkathene, recycling, sustainability.  
- **Hero:** Headline, supporting copy, CTA to About, hero image with graceful fallback.  
- **Stats strip:** Background video (`images/status-small.mp4`) with poster/fallback; animated counters (subsidiaries, products manufactured, countries, team size, years of experience).  
- **Subsidiaries section:** Cards for PARAMA PVC, Alkathene, Garden Hose, WAYBRIDGE (weighbridge), Plastic Recycle — each with “Visit Products” / service navigation via `visitCompany()` in `js/subindustries.js`.  
- **Footer:** Brand blurb, menu, newsletter-style subscribe form (`#subscribe-form`), placeholder blog links, copyright line, Terms/Privacy anchors.

### 3.2 About (`about.html`)

- Extended **mission / vision** and supporting sections (team, values, timeline-style content as implemented in the full file).  
- Styles: `css/styles-use-nav.css`, `css/about-styles.css`.  
- Scripts: `js/about.js`, `js/script.js`, `js/footer-script.js`.

### 3.3 Contact (`contact.html`)

- Contact hero and structured contact UI.  
- **Form behavior:** Client-side validation and simulated submit success in `js/contact.js` (no backend endpoint in-repo; suitable for later wiring to email/API).

### 3.4 Gallery (`gallery/`)

- **SEO / social:** Meta description, keywords, canonical `https://parama.lk/gallery/gallery.html`, Open Graph and Twitter card tags referencing gallery imagery.  
- **UX:** Preloader, hero slides, category filters, testimonials block, reduced-motion support (`prefers-reduced-motion`).  
- **Data:** `gallery/gallery-data.js` exports `galleryItems` (generated or maintained alongside images under `images/gallery/`).

### 3.5 Product pages

Shared traits: product-specific CSS (`css/product-styles.css`, conduit/alkathene variants where linked), shared nav from `css/styles-use-nav.css`, page-specific scripts for tabs, galleries, or calculators as applicable (e.g. `js/conduit-script.js`, `js/alkathene-script.js`, `js/garden-hose-script.js`, `js/plastic-pallets.js`, `js/plsatic-pallests-script.js`).

### 3.6 Service pages

- **Plastic recycling:** `plastic-recycale.html` + `css/plastic-recycale.css` + `js/plastic-recycale.js`.  
- **Weighbridge:** `weighbridge.html` + `css/weighbridge.css` + `js/weighbridge.js`.

---

## 4. Technical stack

| Layer | Technology |
|--------|------------|
| Markup | HTML5 (`lang="en"`), semantic sections where used |
| Styling | Plain CSS, multiple feature-specific stylesheets |
| Behavior | Vanilla ES5-style IIFEs and `DOMContentLoaded` handlers |
| Fonts / icons | Font Awesome 6 (CDN) |
| Animation | Animate.css (CDN); custom CSS transitions |
| Build | None required for browsing; optional `node scripts/build-gallery.mjs` for gallery assets |

**No frameworks** (no React, Vue, or build-step bundler) detected in the tracked HTML/CSS/JS set.

---

## 5. JavaScript modules (inventory)

| File | Typical responsibility |
|------|-------------------------|
| `js/script.js` | Mobile menu, navbar scroll class, stats/counter observers, shared utilities used on many pages |
| `js/subindustries.js` | Subsidiary card navigation (`visitCompany`) on home |
| `js/footer-script.js` | Footer interactions where included |
| `js/about.js` | About-page behaviors |
| `js/contact.js` | Contact form validation and UX |
| `js/plastic-recycale.js` | Recycling page interactions |
| `js/weighbridge.js` | Weighbridge page interactions |
| `js/conduit-script.js` | Conduit product page |
| `js/alkathene-script.js` | Alkathene product page |
| `js/garden-hose-script.js` | Garden hose product page |
| `js/plastic-pallets.js` / `js/plsatic-pallests-script.js` | Plastic pallets (note: filename typo on second script) |
| `js/product-manager.js` | Shared product logic if referenced from pages |
| `gallery/gallery.js` | Gallery filters, modal/lightbox, hero, accessibility touches |
| `gallery/gallery-data.js` | Gallery item definitions (often build-generated) |

---

## 6. CSS architecture (high level)

| Stylesheet | Scope |
|------------|--------|
| `css/styles.css` | Global layout, home-specific components |
| `css/styles-use-nav.css` | Shared navigation styling for inner pages |
| `css/subindustries.css` | Home subsidiaries grid |
| `css/about-styles.css` | About page |
| `css/contact.css` | Contact page |
| `css/footer-styles.css` | Footer (where linked) |
| `css/product-styles.css` (+ variants) | Product templates |
| `css/plastic-recycale.css`, `css/weighbridge.css`, `css/plastic-pallets.css` | Service / product verticals |
| `css/conduit-styles.css`, `css/alkathene-styles.css` | Product-specific |
| `gallery/gallery-theme.css` | Gallery-only theme |

There is a duplicate-style file name pattern (`plastic-pallets copy.css`) in the tree from exploration; confirm which file pages import before deleting duplicates.

---

## 7. Media and assets

- **`images/`** — Logos (`images/logo/`), hero and background imagery, product photos, stats poster, video (`images/status-small.mp4`), and **`images/gallery/`** for numbered event assets (`event-gallery-*.jpg` when normalized by the build script).  
- **`images/gallary/`** (alternate spelling) — Legacy or WhatsApp-sourced JPEGs and `gallery.json` may coexist; the build script documents renaming into `images/gallery/`.  
- **Favicon:** Not called out explicitly in the sampled `index.html` head; add if production requires branding in browser tabs.

---

## 8. Operational / maintenance notes

1. **Gallery pipeline:** Run from repo root:  
   `node scripts/build-gallery.mjs`  
   The script **renames files on disk** under `images/gallery/` and writes `gallery/gallery-data.js`. Review git diffs before committing.

2. **Deployment:** Upload the full directory preserving relative paths (`css/`, `js/`, `images/`, `gallery/`). Spaces in `product-Garden Hose.html` work on most servers but URL-encoding is required in some contexts (the gallery already uses `product-Garden%20Hose.html` in one link).

3. **Forms:** Subscribe and contact flows are **front-end only** unless you add a backend or third-party form service.

4. **Copyright / metadata:** Footer shows “Copyright © Netfortify Solutions - 2025”; align year and legal entity with business requirements (e.g. 2026).

5. **Copy consistency:** “Recycale” vs “Recycle”, “WAYBRIDGE” vs “Weighbridge”, and occasional nav label typos (e.g. “Electronic Conduit” on one page) are worth a single editorial pass for production polish.

---

## 9. Quick file counts (approximate)

From the current project layout:

- **HTML pages:** ~12 primary entry HTML files (root + `gallery/gallery.html`).  
- **CSS:** ~20 stylesheets (including duplicates/alternate names).  
- **JS:** ~15+ scripts under `js/` plus `gallery/*.js` and `scripts/build-gallery.mjs`.

Exact counts change as files are added or removed; use `find` or your IDE for a live inventory before releases.

---

## 10. Suggested next steps (optional, not implemented here)

- Add a root **`README.md`** with local preview instructions (`python -m http.server` or similar).  
- Unify **active** nav state per page (several pages mark “Home” as active regardless of URL).  
- Add **favicon** and consistent **meta description** on all pages for SEO parity with the gallery.  
- Wire **contact/subscribe** to a real endpoint or SaaS form provider.

---

*This report describes the repository as of the generation date and reflects static analysis of the file tree and representative sources. It is not a legal or accessibility audit.*
