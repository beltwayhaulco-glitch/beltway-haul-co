/* ─────────────────────────────────────────────────────────────
   Ad tracking — Meta Pixel + Google Ads / Google tag
   Paste your IDs below. Anything left blank simply doesn't load,
   so this file is safe to publish before the accounts exist.
   ───────────────────────────────────────────────────────────── */
var TRACKING = {
  META_PIXEL_ID: '2148718842469062',   // "Beltway Haul Site" dataset in Meta Events Manager
  GOOGLE_TAG_ID: '',        // e.g. 'AW-1234567890'     (Google Ads → Goals → Conversions → Google tag)
  GOOGLE_CONVERSIONS: {     // conversion labels from each Google Ads conversion action
    call:  '',              // e.g. 'AbC-D_efG-h12_34-567'  → "Phone call click"
    text:  '',              //                             → "Text for quote click"
    email: ''               //                             → "Email click"
  }
};

(function () {
  var T = TRACKING;

  /* ── Meta Pixel ── */
  if (T.META_PIXEL_ID) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', T.META_PIXEL_ID);
    fbq('track', 'PageView');
  }

  /* ── Google tag ── */
  if (T.GOOGLE_TAG_ID) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + T.GOOGLE_TAG_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', T.GOOGLE_TAG_ID);
  }

  /* ── Lead events: every tel: / sms: / mailto: tap counts as a lead ── */
  function leadType(href) {
    if (href.indexOf('tel:') === 0) return 'call';
    if (href.indexOf('sms:') === 0) return 'text';
    if (href.indexOf('mailto:') === 0) return 'email';
    return null;
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var type = leadType(a.getAttribute('href'));
    if (!type) return;

    if (window.fbq) {
      fbq('track', type === 'text' ? 'Lead' : 'Contact', { method: type });
    }
    if (window.gtag) {
      var label = T.GOOGLE_CONVERSIONS[type];
      if (label) gtag('event', 'conversion', { send_to: T.GOOGLE_TAG_ID + '/' + label });
      gtag('event', 'generate_lead', { method: type });
    }
  }, true);
})();
