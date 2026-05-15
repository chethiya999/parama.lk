(function () {
    'use strict';

    var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function qs(sel, ctx) {
        return (ctx || document).querySelector(sel);
    }

    function qsa(sel, ctx) {
        return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
    }

    function createCtaParticles(container, count) {
        if (!container || prefersReduced) return;
        var frag = document.createDocumentFragment();
        var i;
        for (i = 0; i < count; i++) {
            var p = document.createElement('span');
            p.className = 'machinery-particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            p.style.animationDuration = 8 + Math.random() * 12 + 's';
            p.style.animationDelay = Math.random() * 5 + 's';
            frag.appendChild(p);
        }
        container.appendChild(frag);
    }

    function initScrollReveal() {
        var els = qsa('.machinery-reveal');
        if (!els.length) return;
        if (prefersReduced) {
            els.forEach(function (el) {
                el.classList.add('is-visible');
            });
            return;
        }
        var obs = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                });
            },
            { root: null, threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
        );
        els.forEach(function (el) {
            obs.observe(el);
        });
    }

    function animateCounter(el, target, duration) {
        if (duration <= 0) {
            el.textContent = target;
            return;
        }
        var startTime = null;

        function step(ts) {
            if (!startTime) startTime = ts;
            var p = Math.min((ts - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(eased * target);
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target;
        }

        requestAnimationFrame(step);
    }

    function initCounters() {
        var counters = qsa('.machinery-counter');
        if (!counters.length) return;

        var obs = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    var el = entry.target;
                    var numTarget = parseInt(el.getAttribute('data-target'), 10);
                    if (isNaN(numTarget)) return;
                    animateCounter(el, numTarget, prefersReduced ? 0 : 1600);
                    obs.unobserve(el);
                });
            },
            { threshold: 0.4 }
        );

        counters.forEach(function (c) {
            obs.observe(c);
        });
    }

    function initProductGalleries() {
        qsa('.machinery-product-gallery').forEach(function (root) {
            var mainImg = qs('.machinery-product-gallery__img', root);
            var thumbs = qsa('.machinery-product-gallery__thumb', root);
            if (!mainImg || !thumbs.length) return;
            thumbs.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var src = btn.getAttribute('data-src');
                    if (!src) return;
                    mainImg.src = src;
                    thumbs.forEach(function (b) {
                        b.classList.remove('is-active');
                        b.setAttribute('aria-selected', 'false');
                    });
                    btn.classList.add('is-active');
                    btn.setAttribute('aria-selected', 'true');
                });
            });
        });
    }

    function initLightbox() {
        var root = qs('#machineryLightbox');
        var img = qs('#machineryLightboxImg');
        var cap = qs('#machineryLightboxCaption');
        var closeBtn = qs('#machineryLightboxClose');
        if (!root || !img || !cap) return;

        function open(src, title) {
            img.src = src;
            img.alt = title || '';
            cap.textContent = title || '';
            root.hidden = false;
            root.classList.add('is-open');
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        }

        function close() {
            root.classList.remove('is-open');
            document.body.style.overflow = '';
            img.src = '';
            root.hidden = true;
        }

        qsa('[data-lightbox]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                open(btn.getAttribute('data-lightbox'), btn.getAttribute('data-title'));
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', close);
        }

        root.addEventListener('click', function (e) {
            if (e.target === root) close();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && root.classList.contains('is-open')) close();
        });
    }

    function scrollToHash() {
        var hash = window.location.hash;
        if (!hash || hash.length < 2) return;
        var el = document.querySelector(hash);
        if (!el) return;
        setTimeout(function () {
            var y = el.getBoundingClientRect().top + window.scrollY - 88;
            window.scrollTo({ top: y, behavior: prefersReduced ? 'auto' : 'smooth' });
        }, 450);
    }

    document.addEventListener('DOMContentLoaded', function () {
        createCtaParticles(qs('#ctaParticles'), 22);
        initScrollReveal();
        initCounters();
        initProductGalleries();
        initLightbox();
        scrollToHash();
    });
})();
