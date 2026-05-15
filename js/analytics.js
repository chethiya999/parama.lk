/**
 * Google Analytics 4 — set measurement ID in seo/site-config.mjs (gaMeasurementId)
 * and run scripts/apply-seo.mjs, or replace G-XXXXXXXXXX below before deploy.
 */
(function () {
  var MEASUREMENT_ID = 'G-XXXXXXXXXX';

  if (!MEASUREMENT_ID || MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    return;
  }

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID, { anonymize_ip: true });
})();
