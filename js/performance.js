/**
 * Lazy-load images, defer non-critical resources, reduce CLS.
 */
(function () {
  'use strict';

  document.querySelectorAll('img:not([loading])').forEach(function (img) {
    if (img.classList.contains('hero-slide') && img.classList.contains('is-active')) {
      return;
    }
    if (img.closest('.hero-slideshow') && img.classList.contains('is-active')) {
      return;
    }
    if (img.getAttribute('fetchpriority') === 'high') {
      return;
    }
    img.loading = 'lazy';
    img.decoding = 'async';
  });

  document.querySelectorAll('img:not([width])').forEach(function (img) {
    if (img.naturalWidth && !img.getAttribute('width')) {
      img.setAttribute('width', String(img.naturalWidth));
      img.setAttribute('height', String(img.naturalHeight));
    }
  });

  var animateCss = document.querySelector('link[href*="animate.min.css"]');
  if (animateCss && !animateCss.media) {
    animateCss.media = 'print';
    animateCss.onload = function () {
      animateCss.media = 'all';
    };
  }
})();
