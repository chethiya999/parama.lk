/**
 * Parama.lk — Corporate event gallery (expects global galleryItems from gallery-data.js)
 */
(function () {
  'use strict';

  const FILTER_LABELS = [
    'All',
    'Company Events',
    'Staff Activities',
    'Factory Operations',
    'CSR Programs',
    'Exhibitions',
    'Business Meetings',
    'Special Events',
  ];

  const TESTIMONIALS = [
    {
      quote:
        'Parama has been a dependable industrial partner. Their professionalism on site and commitment to quality shows in every engagement.',
      name: 'Operations Director',
      org: 'Regional manufacturing client',
    },
    {
      quote:
        'From recycling initiatives to logistics support, the team communicates clearly and delivers on schedule. Highly recommended.',
      name: 'Supply Chain Lead',
      org: 'Distribution partner',
    },
    {
      quote:
        'We value the transparency and technical depth Parama brings to complex projects. A true long-term collaborator.',
      name: 'Project Manager',
      org: 'Infrastructure contractor',
    },
  ];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.documentElement.classList.add('pg-reduced-motion');
  }

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function debounce(fn, ms) {
    var t;
    return function () {
      var ctx = this;
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(ctx, args);
      }, ms);
    };
  }

  function getItems() {
    if (typeof galleryItems === 'undefined' || !Array.isArray(galleryItems)) {
      console.warn('galleryItems missing; gallery grid empty.');
      return [];
    }
    return galleryItems;
  }

  /* ---------- Preloader ---------- */
  function initPreloader() {
    var el = $('#preloader');
    if (!el) return;
    var skip = false;
    try {
      skip = sessionStorage.getItem('paramaGallerySkipPreloader') === '1';
    } catch (e) {}
    if (skip) {
      el.classList.add('pg-preloader--hide');
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('aria-busy', 'false');
      return;
    }
    var start = Date.now();
    var minMs = 900;
    function hide() {
      el.classList.add('pg-preloader--hide');
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('aria-busy', 'false');
      try {
        sessionStorage.setItem('paramaGallerySkipPreloader', '1');
      } catch (e) {}
    }
    function done() {
      var elapsed = Date.now() - start;
      var wait = Math.max(0, minMs - elapsed);
      setTimeout(hide, wait);
    }
    if (document.readyState === 'complete') done();
    else window.addEventListener('load', done);
  }

  /* ---------- Scroll progress + back to top ---------- */
  function initScrollChrome() {
    var bar = $('#scrollProgress');
    var topBtn = $('#backToTop');
    function onScroll() {
      var doc = document.documentElement;
      var scrollTop = window.scrollY || doc.scrollTop;
      var max = (doc.scrollHeight || document.body.scrollHeight) - window.innerHeight;
      var p = max > 0 ? scrollTop / max : 0;
      if (bar) bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, p)) + ')';
      if (topBtn) {
        if (scrollTop > 480) topBtn.classList.add('pg-visible');
        else topBtn.classList.remove('pg-visible');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (topBtn) {
      topBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      });
    }
  }

  /* In-page scroll (avoids marking non-nav # links active via script.js) */
  function initGalleryScroll() {
    $$('.js-gallery-scroll').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-gallery-scroll');
        var el = id ? document.getElementById(id) : null;
        if (!el) return;
        var offset = 80;
        var y = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: Math.max(0, y), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      });
    });
  }

  /* ---------- Hero slideshow + particles + parallax ---------- */
  function initHero(items) {
    var wrap = $('#heroSlides');
    if (!wrap || !items.length) return;
    var featured = items.filter(function (x) {
      return x.featured;
    });
    var slides = (featured.length ? featured : items.slice(0, 6)).slice(0, 6);
    slides.forEach(function (it, i) {
      var div = document.createElement('div');
      div.className = 'pg-hero-slide';
      div.style.backgroundImage = 'url("' + it.image.replace(/"/g, '\\"') + '")';
      div.style.opacity = i === 0 ? '1' : '0';
      div.setAttribute('role', 'img');
      div.setAttribute('aria-label', it.alt || it.title);
      wrap.appendChild(div);
    });
    var particleRoot = $('#heroParticles');
    if (particleRoot && !prefersReducedMotion) {
      for (var p = 0; p < 28; p++) {
        var d = document.createElement('span');
        d.className = 'pg-particle';
        var size = 4 + Math.random() * 8;
        d.style.width = d.style.height = size + 'px';
        d.style.left = Math.random() * 100 + '%';
        d.style.top = Math.random() * 100 + '%';
        d.style.animationDelay = Math.random() * 6 + 's';
        particleRoot.appendChild(d);
      }
    }
    var slideEls = $$('.pg-hero-slide', wrap);
    if (slideEls.length < 2 || prefersReducedMotion) return;
    var cur = 0;
    setInterval(function () {
      slideEls[cur].style.opacity = '0';
      cur = (cur + 1) % slideEls.length;
      slideEls[cur].style.opacity = '1';
    }, 5500);

    var hero = $('#heroSection');
    if (hero && !prefersReducedMotion) {
      window.addEventListener(
        'scroll',
        function () {
          var y = window.scrollY;
          var t = Math.min(1, y / 500);
          hero.style.setProperty('--pg-parallax', (t * 36).toFixed(1) + 'px');
          wrap.style.transform = 'translateY(' + (t * 36).toFixed(1) + 'px)';
        },
        { passive: true }
      );
    }
  }

  /* ---------- Lightbox ---------- */
  function initLightbox(allItems) {
    var lb = $('#lightbox');
    var figure = $('#lightboxFigure');
    var imgEl = $('#lightboxImage');
    var titleEl = $('#lightboxTitle');
    var catEl = $('#lightboxCat');
    var descEl = $('#lightboxDesc');
    var counterEl = $('#lightboxCounter');
    var btnClose = $('#lightboxClose');
    var btnPrev = $('#lightboxPrev');
    var btnNext = $('#lightboxNext');
    var btnFs = $('#lightboxFs');
    var btnDl = $('#lightboxDownload');
    if (!lb || !imgEl || !figure) return;

    var filtered = [];
    var idx = 0;
    var touchStartX = null;

    function syncFiltered() {
      var activeCategory = window.__galleryActiveCategory || 'All';
      var searchQ = (window.__gallerySearchQ || '').toLowerCase();
      filtered = allItems.filter(function (it) {
        var catOk = activeCategory === 'All' || it.category === activeCategory;
        if (!catOk) return false;
        if (!searchQ) return true;
        return (
          (it.title && it.title.toLowerCase().indexOf(searchQ) !== -1) ||
          (it.description && it.description.toLowerCase().indexOf(searchQ) !== -1) ||
          (it.category && it.category.toLowerCase().indexOf(searchQ) !== -1)
        );
      });
    }

    function renderLb() {
      if (!filtered.length) return;
      var it = filtered[idx];
      imgEl.src = it.image;
      imgEl.alt = it.alt || it.title;
      if (titleEl) titleEl.textContent = it.title;
      if (catEl) catEl.textContent = it.category;
      if (descEl) descEl.textContent = it.description || '';
      if (counterEl) counterEl.textContent = idx + 1 + ' / ' + filtered.length;
      if (btnDl) {
        btnDl.href = it.image;
        btnDl.setAttribute('download', 'parama-' + it.id + '.jpg');
      }
    }

    function open(i) {
      syncFiltered();
      if (i < 0 || i >= filtered.length) return;
      idx = i;
      lb.hidden = false;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          lb.classList.add('pg-lightbox--open');
        });
      });
      document.body.classList.add('overflow-hidden');
      renderLb();
      if (btnClose) btnClose.focus();
    }

    function close() {
      lb.classList.remove('pg-lightbox--open');
      document.body.classList.remove('overflow-hidden');
      window.setTimeout(function () {
        lb.hidden = true;
      }, 300);
    }

    function prev() {
      idx = (idx - 1 + filtered.length) % filtered.length;
      renderLb();
    }

    function next() {
      idx = (idx + 1) % filtered.length;
      renderLb();
    }

    window.__galleryOpenLightbox = function (i) {
      open(i);
    };

    btnClose &&
      btnClose.addEventListener('click', close);
    btnPrev && btnPrev.addEventListener('click', prev);
    btnNext && btnNext.addEventListener('click', next);

    lb.addEventListener('click', function (e) {
      if (e.target === lb) close();
    });

    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });

    figure.addEventListener(
      'touchstart',
      function (e) {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );
    figure.addEventListener(
      'touchend',
      function (e) {
        if (touchStartX == null) return;
        var dx = e.changedTouches[0].screenX - touchStartX;
        touchStartX = null;
        if (dx > 60) prev();
        else if (dx < -60) next();
      },
      { passive: true }
    );

    if (btnFs) {
      btnFs.addEventListener('click', function () {
        if (!document.fullscreenElement) figure.requestFullscreen().catch(function () {});
        else document.exitFullscreen().catch(function () {});
      });
    }
  }

  /* ---------- Stats counters ---------- */
  function initStats() {
    var section = $('#statsSection');
    if (!section) return;
    var targets = $$('[data-counter-target]', section);
    var started = false;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && !started) {
            started = true;
            targets.forEach(function (el) {
              var target = parseInt(el.getAttribute('data-counter-target'), 10);
              var suffix = el.getAttribute('data-counter-suffix') || '';
              var dur = prefersReducedMotion ? 0 : 1400;
              if (dur === 0) {
                el.textContent = target + suffix;
                return;
              }
              var start = 0;
              var t0 = null;
              function frame(ts) {
                if (!t0) t0 = ts;
                var p = Math.min(1, (ts - t0) / dur);
                var val = Math.floor(start + (target - start) * (1 - Math.pow(1 - p, 3)));
                el.textContent = val + suffix;
                if (p < 1) requestAnimationFrame(frame);
              }
              requestAnimationFrame(frame);
            });
          }
        });
      },
      { threshold: 0.35 }
    );
    io.observe(section);
  }

  /* ---------- Featured slider ---------- */
  function initFeaturedSlider(items) {
    var track = $('#featuredTrack');
    var dots = $('#featuredDots');
    var prev = $('#featuredPrev');
    var next = $('#featuredNext');
    if (!track) return;
    var slides = items.filter(function (x) {
      return x.featured;
    });
    if (!slides.length) slides = items.slice(0, 6);
    if (!slides.length) return;
    function escapeHtml(s) {
      var d = document.createElement('div');
      d.textContent = s;
      return d.innerHTML;
    }
    slides.forEach(function (it) {
      var slide = document.createElement('article');
      slide.className = 'pg-slider-slide';
      slide.innerHTML =
        '<div class="gallery-feature-card">' +
        '<div class="gallery-feature-media" style="background-image:url(\'' +
        it.image.replace(/'/g, "\\'") +
        '\')"></div>' +
        '<div class="gallery-feature-body">' +
        '<p class="gallery-feature-label">Featured</p>' +
        '<h3>' +
        escapeHtml(it.title) +
        '</h3>' +
        '<p>' +
        escapeHtml(it.description) +
        '</p>' +
        '<p class="gallery-feature-meta">' +
        escapeHtml(it.category) +
        ' · ' +
        escapeHtml(it.date) +
        '</p></div></div>';
      track.appendChild(slide);
    });

    var parent = track.parentElement;
    var n = slides.length;
    var i = 0;
    function slidePx() {
      return parent && parent.clientWidth ? parent.clientWidth : 0;
    }
    function layoutSlides() {
      var width = slidePx();
      if (!width || !n) return;
      track.style.display = 'flex';
      track.style.transition = prefersReducedMotion
        ? 'none'
        : 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
      Array.from(track.children).forEach(function (sl) {
        sl.style.flex = '0 0 ' + width + 'px';
        sl.style.width = width + 'px';
        sl.style.maxWidth = width + 'px';
        sl.style.boxSizing = 'border-box';
      });
      track.style.width = n * width + 'px';
      applyTransform();
    }
    function applyTransform() {
      var width = slidePx();
      if (!width) return;
      track.style.transform = 'translateX(-' + i * width + 'px)';
    }
    function go(to) {
      i = (to + n) % n;
      applyTransform();
      if (dots) {
        $$('.gallery-dot', dots).forEach(function (d, di) {
          d.classList.toggle('is-active', di === i);
        });
      }
    }
    if (parent && typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(function () {
        layoutSlides();
      });
      ro.observe(parent);
    }
    requestAnimationFrame(function () {
      layoutSlides();
      if (dots) {
        for (var d = 0; d < n; d++) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'gallery-dot';
          b.setAttribute('aria-label', 'Slide ' + (d + 1));
          (function (di) {
            b.addEventListener('click', function () {
              go(di);
            });
          })(d);
          dots.appendChild(b);
        }
      }
      go(0);
    });
    prev && prev.addEventListener('click', function () { go(i - 1); });
    next && next.addEventListener('click', function () { go(i + 1); });

    var timer = null;
    function arm() {
      clearInterval(timer);
      if (prefersReducedMotion || n < 2) return;
      timer = setInterval(function () {
        go(i + 1);
      }, 7000);
    }
    arm();
    var root = $('#featuredSection');
    if (root) {
      root.addEventListener('mouseenter', function () { clearInterval(timer); });
      root.addEventListener('mouseleave', arm);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clearInterval(timer);
      else arm();
    });
  }

  /* ---------- Testimonials ---------- */
  function initTestimonials() {
    var track = $('#testimonialTrack');
    var dots = $('#testimonialDots');
    var prev = $('#testimonialPrev');
    var next = $('#testimonialNext');
    if (!track) return;
    function escapeHtml(s) {
      var d = document.createElement('div');
      d.textContent = s;
      return d.innerHTML;
    }
    TESTIMONIALS.forEach(function (t) {
      var slide = document.createElement('div');
      slide.className = 'pg-slider-slide';
      slide.innerHTML =
        '<div class="gallery-testimonial-card">' +
        '<blockquote><p class="quote">“' +
        escapeHtml(t.quote) +
        '”</p>' +
        '<footer><strong>' +
        escapeHtml(t.name) +
        '</strong> — ' +
        escapeHtml(t.org) +
        '</footer></blockquote></div>';
      track.appendChild(slide);
    });
    var parent = track.parentElement;
    var n = TESTIMONIALS.length;
    var i = 0;
    function slidePx() {
      return parent && parent.clientWidth ? parent.clientWidth : 0;
    }
    function layoutSlides() {
      var width = slidePx();
      if (!width || !n) return;
      track.style.display = 'flex';
      track.style.transition = prefersReducedMotion
        ? 'none'
        : 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
      Array.from(track.children).forEach(function (sl) {
        sl.style.flex = '0 0 ' + width + 'px';
        sl.style.width = width + 'px';
        sl.style.maxWidth = width + 'px';
        sl.style.boxSizing = 'border-box';
      });
      track.style.width = n * width + 'px';
      applyTransform();
    }
    function applyTransform() {
      var width = slidePx();
      if (!width) return;
      track.style.transform = 'translateX(-' + i * width + 'px)';
    }
    function go(to) {
      i = (to + n) % n;
      applyTransform();
      if (dots) {
        $$('.gallery-dot', dots).forEach(function (d, di) {
          d.classList.toggle('is-active', di === i);
        });
      }
    }
    if (parent && typeof ResizeObserver !== 'undefined') {
      var roT = new ResizeObserver(function () {
        layoutSlides();
      });
      roT.observe(parent);
    }
    requestAnimationFrame(function () {
      layoutSlides();
      if (dots) {
        for (var d = 0; d < n; d++) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'gallery-dot';
          b.setAttribute('aria-label', 'Testimonial ' + (d + 1));
          (function (di) {
            b.addEventListener('click', function () { go(di); });
          })(d);
          dots.appendChild(b);
        }
      }
      go(0);
    });
    prev && prev.addEventListener('click', function () { go(i - 1); });
    next && next.addEventListener('click', function () { go(i + 1); });
  }

  /* ---------- Patch gallery section to sync lightbox ---------- */
  function initGallerySectionPatched(allItems) {
    var grid = $('#galleryGrid');
    var filtersEl = $('#galleryFilters');
    var searchInput = $('#gallerySearch');
    if (!grid || !filtersEl) return;

    var activeCategory = 'All';
    var searchQ = '';
    var filtered = allItems.slice();

    window.__galleryActiveCategory = 'All';
    window.__gallerySearchQ = '';

    function matchesSearch(it) {
      if (!searchQ) return true;
      var q = searchQ.toLowerCase();
      return (
        (it.title && it.title.toLowerCase().indexOf(q) !== -1) ||
        (it.description && it.description.toLowerCase().indexOf(q) !== -1) ||
        (it.category && it.category.toLowerCase().indexOf(q) !== -1)
      );
    }

    function applyFilter() {
      filtered = allItems.filter(function (it) {
        var catOk = activeCategory === 'All' || it.category === activeCategory;
        return catOk && matchesSearch(it);
      });
      window.__galleryActiveCategory = activeCategory;
      window.__gallerySearchQ = searchQ;
      renderFilters();
      renderGrid();
    }

    function countFor(cat) {
      if (cat === 'All')
        return allItems.filter(function (it) {
          return matchesSearch(it);
        }).length;
      return allItems.filter(function (it) {
        return it.category === cat && matchesSearch(it);
      }).length;
    }

    function renderFilters() {
      filtersEl.innerHTML = '';
      FILTER_LABELS.forEach(function (label) {
        var c = countFor(label);
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className =
          'gallery-filter-btn' + (activeCategory === label ? ' is-active' : '');
        btn.setAttribute('aria-pressed', activeCategory === label ? 'true' : 'false');
        btn.textContent = label + ' (' + c + ')';
        btn.addEventListener('click', function () {
          activeCategory = label;
          applyFilter();
        });
        filtersEl.appendChild(btn);
      });
    }

    function escapeHtml(s) {
      var d = document.createElement('div');
      d.textContent = s;
      return d.innerHTML;
    }

    function renderGrid() {
      grid.innerHTML = '';
      if (!filtered.length) {
        var empty = document.createElement('p');
        empty.className = 'gallery-empty';
        empty.textContent = 'No images match your filters or search.';
        grid.appendChild(empty);
        return;
      }
      filtered.forEach(function (it, idx) {
        var card = document.createElement('button');
        card.type = 'button';
        card.className = 'gallery-grid-card gallery-card';
        var img = document.createElement('img');
        img.src = it.image;
        img.alt = it.alt || it.title;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.className = 'pg-img-loading';
        img.style.aspectRatio = '4/3';
        img.addEventListener('load', function () {
          img.classList.remove('pg-img-loading');
          img.classList.add('pg-img-ready');
        });
        var overlay = document.createElement('div');
        overlay.className = 'gallery-card-overlay';
        var meta = document.createElement('div');
        meta.className = 'gallery-card-meta';
        meta.innerHTML =
          '<span class="gallery-card-badge">' +
          escapeHtml(it.category) +
          '</span>' +
          '<h3>' +
          escapeHtml(it.title) +
          '</h3>' +
          '<p class="gallery-card-date">' +
          escapeHtml(it.date) +
          '</p>';
        card.appendChild(img);
        card.appendChild(overlay);
        card.appendChild(meta);
        card.addEventListener('click', function () {
          if (typeof window.__galleryOpenLightbox === 'function') {
            window.__galleryOpenLightbox(idx);
          }
        });
        grid.appendChild(card);
      });
    }

    var debounced = debounce(function () {
      searchQ = searchInput && searchInput.value ? searchInput.value.trim() : '';
      applyFilter();
    }, 200);
    if (searchInput) searchInput.addEventListener('input', debounced);

    renderFilters();
    renderGrid();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var items = getItems();
    initPreloader();
    initScrollChrome();
    initGalleryScroll();
    initHero(items);
    initLightbox(items);
    initGallerySectionPatched(items);
    initStats();
    initFeaturedSlider(items);
    initTestimonials();
  });
})();
