/*
  Analytics for verlyntech.com. Nothing loads until you fill in a setting below.

  Option A: Google Analytics 4
    Set GA_ID to your measurement ID (looks like "G-XXXXXXXXXX").
    GA sets cookies, so a small cookie notice appears and GA loads only after a visitor accepts.

  Option B: Plausible (or any cookieless script)
    Set PLAUSIBLE_SRC to the script URL shown in your Plausible dashboard, and
    PLAUSIBLE_DOMAIN to "verlyntech.com" if your snippet has a data-domain attribute.
    No cookies, so no notice is shown.

  Events tracked automatically: whatsapp_click, email_click, phone_click, cta_start_pilot,
  and form_submit (fires on the thank-you page after an enquiry is sent).
*/
(function () {
  "use strict";
  var GA_ID = "";
  var PLAUSIBLE_SRC = "";
  var PLAUSIBLE_DOMAIN = "";

  var KEY = "vt-consent";
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadGA() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", GA_ID);
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
  }

  function loadPlausible() {
    window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
    var s = document.createElement("script");
    s.defer = true;
    s.src = PLAUSIBLE_SRC;
    if (PLAUSIBLE_DOMAIN) s.setAttribute("data-domain", PLAUSIBLE_DOMAIN);
    document.head.appendChild(s);
  }

  function track(name) {
    var sent = false;
    try {
      if (GA_ID && window.gtag) { gtag("event", name); sent = true; }
      if (PLAUSIBLE_SRC && window.plausible) { plausible(name); sent = true; }
    } catch (e) {}
    return sent;
  }

  function banner() {
    var d = document.createElement("div");
    d.className = "consent";
    d.setAttribute("role", "dialog");
    d.setAttribute("aria-label", "Cookie notice");
    d.innerHTML = '<p>We use Google Analytics cookies to see which pages are useful. Nothing loads unless you accept. <a href="/privacy/">Privacy policy</a></p>' +
      '<div class="acts"><button type="button" class="ok">Accept</button><button type="button" class="no">Decline</button></div>';
    d.querySelector(".ok").onclick = function () { write("granted"); d.remove(); loadGA(); fireView(); };
    d.querySelector(".no").onclick = function () { write("denied"); d.remove(); };
    document.body.appendChild(d);
  }

  // form_submit only counts when the visitor arrives from the contact page, and once per submission
  var FS = "vt-fs";
  function fromContact() {
    try { return new URL(document.referrer).pathname.indexOf("/contact") === 0 && new URL(document.referrer).origin === location.origin; } catch (e) { return false; }
  }
  function fireView() {
    var v = document.body.getAttribute("data-track-view");
    if (!v) return;
    if (v !== "form_submit") { track(v); return; }
    try { if (sessionStorage.getItem(FS)) return; } catch (e) {}
    if (fromContact() && track(v)) { try { sessionStorage.setItem(FS, "1"); } catch (e) {} }
  }
  try { if (location.pathname.indexOf("/contact") === 0) sessionStorage.removeItem(FS); } catch (e) {}

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-track]");
    if (a) track(a.getAttribute("data-track"));
  });

  function init() {
    if (PLAUSIBLE_SRC) loadPlausible();
    if (GA_ID) {
      var c = read();
      if (c === "granted") loadGA();
      else if (c === null) banner();
    }
    fireView();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
