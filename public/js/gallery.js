/**
 * Parama Events Gallery
 *
 * Loads images/gallery/gallery.json plus images/gallery/file-list.json so every file
 * in the folder can appear. Optional embedded entries below if the manifest is empty.
 *
 * Regenerate JSON after adding photos:
 *   node scripts/generate-gallery-manifest.mjs
 *
 * Image compression (offline example):
 *   cd images/gallery && mogrify -strip -quality 82 *.jpeg
 */
(function () {
  'use strict';

  const isFileProtocol = location.protocol === 'file:';
  const GALLERY_MANIFEST_URL = isFileProtocol
    ? 'images/gallery/gallery.json'
    : '/images/gallery/gallery.json';

  /**
   * Optional fallback entries (edit here or use gallery.json).
   * Supports either `src` or `image` (relative to site root or images/gallery/...).
   * @type {Array<{src?: string, image?: string, title?: string, description?: string, category?: string, alt?: string}>}
   */
  const GALLERY_IMAGES_EMBEDDED = [
    // Example (uncomment and adjust paths after you add files):
    // {
    //   image: 'images/gallery/event1.jpg',
    //   title: 'Annual Corporate Event',
    //   description: 'Leadership and teams celebrating milestones together.',
    //   category: 'Corporate Events',
    //   alt: 'Parama team at annual corporate event'
    // }
  ];

  /** Filter pills (order). First entry is the “show all” filter. */
  const FILTER_LABELS = [
    'All Events',
    'Corporate Events',
    'Team Activities',
    'Project Launches',
    'Exhibitions',
    'Celebrations',
    'Site Events'
  ];
  const CATEGORIES = FILTER_LABELS.filter(function (l) {
    return l !== 'All Events';
  });
  const DEFAULT_CATEGORY = 'Corporate Events';

  const SKELETON_COUNT = 12;

  function normalizeCategory(cat) {
    var s = String(cat || '').trim();
    if (CATEGORIES.indexOf(s) !== -1) return s;
    return DEFAULT_CATEGORY;
  }

  function toRootPath(src) {
    var s = String(src || '').trim();
    if (!s) return '';
    if (s.indexOf('http://') === 0 || s.indexOf('https://') === 0 || s.indexOf('data:') === 0) return s;
    if (s.charAt(0) === '/') return isFileProtocol ? s.slice(1) : s;
    return '/' + s.replace(/^\.?\//, '');
  }

  function encodeUrlPath(src) {
    if (!src || src.indexOf('http://') === 0 || src.indexOf('https://') === 0 || src.indexOf('data:') === 0) {
      return src;
    }
    return src.split('/').map(encodeURIComponent).join('/');
  }

  function relKeyFromSrc(src) {
    var s = String(src || '').trim().replace(/^\/+/, '');
    if (s.indexOf('images/gallery/') === 0) s = s.slice('images/gallery/'.length);
    try {
      return s
        .split('/')
        .map(function (p) {
          return decodeURIComponent(p);
        })
        .join('/');
    } catch (e) {
      return s;
    }
  }

  function dedupeSortGalleryItems(items) {
    var map = new Map();
    items.forEach(function (it) {
      var key = relKeyFromSrc(it.src);
      if (!key) return;
      if (!map.has(key)) map.set(key, it);
    });
    return Array.from(map.keys())
      .sort(function (a, b) {
        return a.localeCompare(b);
      })
      .map(function (k) {
        return map.get(k);
      });
  }

  /** Normalize one manifest / embedded row into a gallery item. */
  function normalizeGalleryRow(x) {
    var rawSrc = x.src != null ? x.src : x.image;
    var src = toRootPath(String(rawSrc || ''));
    var title = String(x.title != null ? x.title : x.caption || x.alt || 'Parama event').trim();
    var description = String(x.description != null ? x.description : '').trim();
    var alt = String(x.alt != null ? x.alt : title + (description ? '. ' + description : '')).trim();
    return {
      src: src,
      title: title || 'Parama event',
      description: description,
      alt: alt || 'Parama event photograph',
      category: normalizeCategory(x.category)
    };
  }

  function getFocusable(root) {
    var sel =
      'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.prototype.slice.call(root.querySelectorAll(sel)).filter(function (el) {
      if (el.getAttribute('aria-hidden') === 'true') return false;
      var r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var firstFallback = 'images/gallery/WhatsApp Image 2026-04-23 at 2.54.46 PM.jpeg';
    var fallbackItems = [
      normalizeGalleryRow({
        src: isFileProtocol ? firstFallback : '/images/gallery/WhatsApp Image 2026-04-23 at 2.54.46 PM.jpeg',
        title: 'Parama corporate event',
        description: 'A highlight from our company events calendar.',
        category: 'Corporate Events',
        alt: 'Parama corporate event photograph'
      })
    ];

    var grid = document.getElementById('galleryGrid');
    var filtersEl = document.getElementById('galleryFilters');
    var lightbox = document.getElementById('lightbox');
    var lightboxContent = document.getElementById('lightboxContent');
    var lightboxImage = document.getElementById('lightboxImage');
    var lightboxTitle = document.getElementById('lightboxTitle');
    var lightboxDesc = document.getElementById('lightboxDesc');
    var lightboxCat = document.getElementById('lightboxCat');
    var lightboxCounter = document.getElementById('lightboxCounter');
    var lightboxFigure = document.getElementById('lightboxFigure');
    var lightboxFs = document.getElementById('lightboxFullscreen');
    var lightboxShare = document.getElementById('lightboxShare');
    var prevBtn = document.querySelector('.lightbox-prev');
    var nextBtn = document.querySelector('.lightbox-next');

    if (!grid || !filtersEl || !lightbox || !lightboxImage || !lightboxCounter) return;
    if (!lightboxTitle || !lightboxDesc || !lightboxCat) return;

    var galleryItems = fallbackItems.slice();
    var activeCategory = 'All Events';
    var filtered = galleryItems.slice();
    var activeIndex = 0;
    var revealObserver = null;
    var lastFocusedOutside = null;
    var manifestLoadFailed = false;

    function showSkeletons() {
      grid.innerHTML = '';
      grid.classList.add('gallery-grid--skeleton');
      for (var i = 0; i < SKELETON_COUNT; i++) {
        var d = document.createElement('div');
        d.className = 'gallery-skeleton';
        d.setAttribute('aria-hidden', 'true');
        grid.appendChild(d);
      }
    }

    function countForCategory(cat) {
      if (cat === 'All Events') return galleryItems.length;
      return galleryItems.filter(function (i) {
        return i.category === cat;
      }).length;
    }

    async function mergeFileListInto(cleaned) {
      var fileListUrl = isFileProtocol ? 'images/gallery/file-list.json' : '/images/gallery/file-list.json';
      var existing = new Set();
      cleaned.forEach(function (item) {
        var k = relKeyFromSrc(item.src);
        if (k) existing.add(k);
      });
      try {
        var res = await fetch(fileListUrl, { cache: 'no-store' });
        if (!res.ok) return;
        var list = await res.json();
        if (!Array.isArray(list)) return;
        var n = cleaned.length;
        list.forEach(function (rel) {
          if (typeof rel !== 'string' || !rel.trim()) return;
          rel = rel.replace(/\\/g, '/').replace(/^\.\//, '');
          if (rel === 'gallery.json' || rel === 'file-list.json') return;
          if (existing.has(rel)) return;
          existing.add(rel);
          var cat = CATEGORIES[n % CATEGORIES.length];
          cleaned.push(
            normalizeGalleryRow({
              src: toRootPath('/images/gallery/' + rel),
              title: 'Parama event · ' + cat,
              description: 'Company event, function, or gathering — add details in gallery.json.',
              category: cat,
              alt: 'Parama ' + cat + ' event photograph'
            })
          );
          n++;
        });
      } catch (e) {
        console.warn('Gallery file-list.json merge skipped.', e);
      }
    }

    async function loadManifest() {
      manifestLoadFailed = false;
      var cleaned = [];
      try {
        var res = await fetch(GALLERY_MANIFEST_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error('Manifest fetch failed: ' + res.status);
        var json = await res.json();
        if (!Array.isArray(json)) throw new Error('Manifest is not an array');
        cleaned = json
          .filter(function (x) {
            return x && typeof x === 'object';
          })
          .map(normalizeGalleryRow)
          .filter(function (x) {
            return x.src.length > 0;
          });
      } catch (err) {
        console.warn('Gallery manifest load failed; will try file-list.json.', err);
        cleaned = [];
      }
      await mergeFileListInto(cleaned);
      cleaned = dedupeSortGalleryItems(cleaned);
      if (cleaned.length === 0 && GALLERY_IMAGES_EMBEDDED.length > 0) {
        cleaned = GALLERY_IMAGES_EMBEDDED.map(normalizeGalleryRow).filter(function (x) {
          return x.src.length > 0;
        });
      }
      cleaned = dedupeSortGalleryItems(cleaned);
      if (cleaned.length === 0) {
        manifestLoadFailed = true;
        galleryItems = fallbackItems.slice();
      } else {
        manifestLoadFailed = false;
        galleryItems = cleaned;
      }
      filtered = galleryItems.slice();
      activeCategory = 'All Events';
    }

    function renderFilters() {
      filtersEl.innerHTML = '';
      FILTER_LABELS.forEach(function (cat) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'gallery-filter' + (cat === activeCategory ? ' active' : '');
        btn.setAttribute('aria-pressed', cat === activeCategory ? 'true' : 'false');
        btn.appendChild(document.createTextNode(cat + ' '));
        var countSpan = document.createElement('span');
        countSpan.className = 'gallery-filter-count';
        countSpan.textContent = '(' + countForCategory(cat) + ')';
        btn.appendChild(countSpan);
        btn.addEventListener('click', function () {
          activeCategory = cat;
          filtered =
            cat === 'All Events'
              ? galleryItems.slice()
              : galleryItems.filter(function (i) {
                  return i.category === cat;
                });
          renderFilters();
          renderGrid();
        });
        filtersEl.appendChild(btn);
      });
    }

    function disconnectRevealObserver() {
      if (revealObserver) {
        revealObserver.disconnect();
        revealObserver = null;
      }
    }

    function setupRevealObserver() {
      disconnectRevealObserver();
      if (!('IntersectionObserver' in window)) {
        Array.prototype.forEach.call(grid.querySelectorAll('.gallery-card-reveal'), function (el) {
          el.classList.add('is-visible');
        });
        return;
      }
      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              en.target.classList.add('is-visible');
              revealObserver.unobserve(en.target);
            }
          });
        },
        { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
      );
      Array.prototype.forEach.call(grid.querySelectorAll('.gallery-card-reveal'), function (el) {
        revealObserver.observe(el);
      });
    }

    function createCard(item, index) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gallery-card';
      btn.setAttribute('data-category', item.category);
      btn.setAttribute('data-event-title', item.title);
      btn.setAttribute(
        'aria-label',
        item.title + (item.description ? '. ' + item.description : '') + '. Category: ' + item.category
      );

      var media = document.createElement('span');
      media.className = 'gallery-card-media';

      var img = document.createElement('img');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = encodeUrlPath(item.src);
      img.alt = item.alt;
      img.onerror = function () {
        btn.classList.add('is-broken');
        if (img.parentNode) img.remove();
        var fallback = document.createElement('div');
        fallback.className = 'gallery-fallback';
        fallback.textContent = 'Image not found';
        media.appendChild(fallback);
      };

      var overlay = document.createElement('span');
      overlay.className = 'gallery-card-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      var overlayCat = document.createElement('span');
      overlayCat.className = 'gallery-card-overlay-cat';
      overlayCat.textContent = item.category;
      var overlayTitle = document.createElement('span');
      overlayTitle.className = 'gallery-card-title';
      overlayTitle.textContent = item.title;
      overlay.appendChild(overlayCat);
      overlay.appendChild(overlayTitle);
      if (item.description) {
        var overlayDesc = document.createElement('span');
        overlayDesc.className = 'gallery-card-overlay-desc';
        overlayDesc.textContent = item.description;
        overlay.appendChild(overlayDesc);
      }

      var body = document.createElement('span');
      body.className = 'gallery-card-body';
      var chip = document.createElement('span');
      chip.className = 'gallery-card-chip';
      chip.textContent = item.category;
      var heading = document.createElement('span');
      heading.className = 'gallery-card-heading';
      heading.textContent = item.title;
      var descEl = document.createElement('span');
      descEl.className = 'gallery-card-desc';
      descEl.textContent = item.description || 'Parama company event.';
      body.appendChild(chip);
      body.appendChild(heading);
      body.appendChild(descEl);

      media.appendChild(img);
      media.appendChild(overlay);
      btn.appendChild(media);
      btn.appendChild(body);
      btn.addEventListener('click', function () {
        openLightbox(index);
      });
      return btn;
    }

    function renderGrid() {
      grid.classList.remove('gallery-grid--skeleton');
      disconnectRevealObserver();
      grid.innerHTML = '';

      if (filtered.length === 0) {
        var empty = document.createElement('div');
        empty.className = 'gallery-empty';
        empty.textContent = 'No events in this category yet.';
        grid.appendChild(empty);
        return;
      }

      filtered.forEach(function (item, index) {
        var wrap = document.createElement('div');
        wrap.className = 'gallery-card-reveal';
        wrap.appendChild(createCard(item, index));
        grid.appendChild(wrap);
      });
      setupRevealObserver();
    }

    function preloadAdjacent() {
      if (filtered.length === 0) return;
      var prevI = (activeIndex - 1 + filtered.length) % filtered.length;
      var nextI = (activeIndex + 1) % filtered.length;
      [filtered[prevI].src, filtered[nextI].src].forEach(function (src) {
        var im = new Image();
        im.decoding = 'async';
        im.src = encodeUrlPath(src);
      });
    }

    function updateLightbox() {
      var item = filtered[activeIndex];
      if (!item) return;
      lightboxImage.removeAttribute('fetchpriority');
      lightboxImage.src = encodeUrlPath(item.src);
      lightboxImage.alt = item.alt;
      lightboxImage.setAttribute('fetchpriority', 'high');
      lightboxTitle.textContent = item.title;
      lightboxDesc.textContent = item.description || '';
      lightboxDesc.style.display = item.description ? 'block' : 'none';
      lightboxCat.textContent = item.category;
      lightboxCounter.textContent = filtered.length ? activeIndex + 1 + ' / ' + filtered.length : '0 / 0';
      preloadAdjacent();
    }

    function openLightbox(index) {
      lastFocusedOutside = document.activeElement;
      activeIndex = index;
      updateLightbox();
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
      var toFocus = lightbox.querySelector('.lightbox-close') || getFocusable(lightbox)[0] || lightboxContent;
      window.setTimeout(function () {
        toFocus.focus();
      }, 0);
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
      lightboxImage.removeAttribute('fetchpriority');
      if (lastFocusedOutside && typeof lastFocusedOutside.focus === 'function') {
        window.setTimeout(function () {
          lastFocusedOutside.focus();
        }, 0);
      }
    }

    function prev() {
      if (filtered.length === 0) return;
      activeIndex = (activeIndex - 1 + filtered.length) % filtered.length;
      updateLightbox();
    }

    function next() {
      if (filtered.length === 0) return;
      activeIndex = (activeIndex + 1) % filtered.length;
      updateLightbox();
    }

    function onLightboxKeydown(e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
        return;
      }
      if (e.key !== 'Tab') return;
      var list = getFocusable(lightbox);
      if (list.length === 0) return;
      var first = list[0];
      var last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    lightbox.addEventListener('click', function (e) {
      var target = e.target;
      if (target && target instanceof HTMLElement && target.dataset.close === 'true') closeLightbox();
    });
    document.addEventListener('keydown', onLightboxKeydown);
    document.addEventListener('focusin', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (lightbox.contains(e.target)) return;
      var list = getFocusable(lightbox);
      if (list.length) window.setTimeout(function () { list[0].focus(); }, 0);
    });
    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    if (lightboxShare) {
      lightboxShare.addEventListener('click', function () {
        var url = window.location.href.split('#')[0];
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(function () {
            lightboxShare.setAttribute('title', 'Link copied');
            window.setTimeout(function () {
              lightboxShare.setAttribute('title', 'Copy gallery link');
            }, 2000);
          });
        } else {
          window.prompt('Copy gallery link:', url);
        }
      });
    }

    if (lightboxFs && lightboxFigure) {
      lightboxFs.addEventListener('click', function () {
        if (!document.fullscreenElement) {
          lightboxFigure.requestFullscreen().catch(function () {});
        } else {
          document.exitFullscreen().catch(function () {});
        }
      });
      document.addEventListener('fullscreenchange', function () {
        var icon = lightboxFs.querySelector('i');
        if (!icon) return;
        if (document.fullscreenElement) {
          icon.className = 'fas fa-compress';
          lightboxFs.setAttribute('aria-label', 'Exit fullscreen');
        } else {
          icon.className = 'fas fa-expand';
          lightboxFs.setAttribute('aria-label', 'Enter fullscreen');
        }
      });
    }

    showSkeletons();
    (async function init() {
      await loadManifest();
      if (isFileProtocol && manifestLoadFailed) {
        grid.classList.remove('gallery-grid--skeleton');
        grid.innerHTML = '';
        var note = document.createElement('div');
        note.className = 'gallery-empty';
        note.appendChild(
          document.createTextNode(
            'Gallery manifest could not load over file://. Run a local server (for example '
          )
        );
        var c1 = document.createElement('code');
        c1.textContent = 'python3 -m http.server';
        note.appendChild(c1);
        note.appendChild(document.createTextNode(') and open '));
        var c2 = document.createElement('code');
        c2.textContent = '/gallery.html';
        note.appendChild(c2);
        note.appendChild(document.createTextNode(' to view all images.'));
        grid.appendChild(note);
        renderFilters();
        return;
      }
      renderFilters();
      renderGrid();
      if (typeof AOS !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        AOS.init({ duration: 700, once: true, offset: 40 });
        window.setTimeout(function () {
          AOS.refresh();
        }, 100);
      }
    })();
  });
})();
