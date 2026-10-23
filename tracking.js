/* Google Ads conversion tracking + cookie consent (Google Consent Mode v2).
   Load this in <head> as a normal (non-async) script so consent defaults are
   set before any Google tag runs. */
(function () {
  var CONFIG = {
  "adsId": "AW-949343302",
  "labels": {
    "form": "1edNCKjq9aYdEMao18QD",
    "phone": "J7eKCK7q9aYdEMao18QD",
    "whatsapp": "n6gjCLHq9aYdEMao18QD"
  },
  "message": "I use cookies to see which adverts bring families to this site, so I can spend less on ads that don’t work. Is that OK?",
  "theme": {
    "bg": "#1e1330",
    "text": "#ffffff",
    "accent": "#f97316",
    "accentText": "#1e1330",
    "radius": "18px",
    "btnRadius": "999px",
    "font": "'Outfit',system-ui,sans-serif"
  }
};
  var KEY = 'cookie_consent_v1';

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  // 1. Everything off until the visitor chooses.
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', true);

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved === 'granted') applyConsent('granted');

  function applyConsent(state) {
    gtag('consent', 'update', {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state
    });
  }

  // 2. Load the Google Ads tag.
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.adsId;
  document.head.appendChild(s);
  gtag('js', new Date());
  gtag('config', CONFIG.adsId);

  function convert(label) {
    gtag('event', 'conversion', { send_to: CONFIG.adsId + '/' + label });
  }

  // 3. Thank-you page = enquiry form conversion.
  if (document.documentElement.hasAttribute('data-form-conversion')) {
    convert(CONFIG.labels.form);
  }

  // 4. Phone and WhatsApp clicks.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('tel:') === 0) convert(CONFIG.labels.phone);
    else if (/wa\.me|api\.whatsapp\.com|whatsapp:/i.test(href)) convert(CONFIG.labels.whatsapp);
  }, true);

  // 5. Cookie banner.
  function banner() {
    if (document.getElementById('cc-banner')) return;
    var c = CONFIG.theme;
    var css = '#cc-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;' +
      'background:' + c.bg + ';color:' + c.text + ';border-radius:' + c.radius + ';padding:18px 20px;' +
      'box-shadow:0 18px 50px -12px rgba(0,0,0,.45);font:15px/1.5 ' + c.font + ';border:1px solid rgba(255,255,255,.12)}' +
      '#cc-banner p{margin:0 0 14px}#cc-banner a{color:inherit;text-decoration:underline}' +
      '#cc-banner .cc-btns{display:flex;gap:10px;flex-wrap:wrap}' +
      '#cc-banner button{flex:1 1 140px;cursor:pointer;font:600 15px/1 ' + c.font + ';padding:12px 16px;border-radius:' + c.btnRadius + ';border:1.5px solid ' + c.accent + '}' +
      '#cc-accept{background:' + c.accent + ';color:' + c.accentText + '}' +
      '#cc-reject{background:transparent;color:' + c.text + '}';
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var d = document.createElement('div');
    d.id = 'cc-banner'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Cookie preferences');
    d.innerHTML = '<p>' + CONFIG.message + '</p><div class="cc-btns">' +
      '<button id="cc-reject" type="button">Reject</button>' +
      '<button id="cc-accept" type="button">Accept cookies</button></div>';
    document.body.appendChild(d);
    function choose(state) {
      try { localStorage.setItem(KEY, state); } catch (e) {}
      applyConsent(state);
      d.remove();
    }
    document.getElementById('cc-accept').onclick = function () { choose('granted'); };
    document.getElementById('cc-reject').onclick = function () { choose('denied'); };
  }
  window.openCookieSettings = function () { banner(); return false; };

  if (saved !== 'granted' && saved !== 'denied') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', banner);
    else banner();
  }
})();
