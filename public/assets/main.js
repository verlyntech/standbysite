(function () {
  "use strict";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  // ---- Light / dark toggle (the saved choice is applied early by a tiny script in each page's <head>)
  var tog = document.getElementById("tog");
  function eff() { return root.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); }
  function lab() { if (tog) tog.setAttribute("aria-label", eff() === "dark" ? "Switch to light mode" : "Switch to dark mode"); }
  if (tog) {
    tog.addEventListener("click", function () {
      var n = eff() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", n);
      try { localStorage.setItem("vt-theme", n); } catch (e) {}
      lab();
    });
    lab();
  }

  // ---- Services page: hovering or focusing a node names the full service
  var netG = document.getElementById("netG"), hint = document.getElementById("hint");
  if (netG && hint) {
    var def = hint.textContent;
    var say = function (e) {
      var a = e.target.closest && e.target.closest(".nd");
      if (!a) return;
      hint.textContent = a.getAttribute("aria-label");
      hint.classList.add("hot");
    };
    var unsay = function () { hint.textContent = def; hint.classList.remove("hot"); };
    netG.addEventListener("mouseover", say);
    netG.addEventListener("focusin", say);
    netG.addEventListener("mouseleave", unsay);
    netG.addEventListener("focusout", unsay);
  }

  // ---- Page transition: the blade sweeps across, then the next page loads
  var wipe = document.getElementById("wipe");
  function flag(v) { try { sessionStorage.setItem("vt-nav", v + "@" + Date.now()); } catch (e) {} }
  var svcPage = /^\/services\/[^\/]+\/?$/;
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
    var u;
    try { u = new URL(a.href, location.href); } catch (x) { return; }
    if (u.origin !== location.origin || (u.pathname === location.pathname && u.search === location.search)) return;
    if (svcPage.test(location.pathname) && svcPage.test(u.pathname)) { flag("within"); return; }
    if (reduce || !wipe) return;
    e.preventDefault();
    flag("wipe");
    wipe.classList.add("out");
    setTimeout(function () { location.href = u.href; }, 380);
  });
  window.addEventListener("pageshow", function (e) { if (e.persisted && wipe) wipe.classList.remove("out"); });

  // ---- Count-up numbers on the "Why Verlyn" page
  var els = document.querySelectorAll("[data-n]");
  els.forEach(function (el) {
    var to = +el.getAttribute("data-n");
    if (reduce) { el.textContent = to; return; }
    var t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 1100, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = "0";
    requestAnimationFrame(step);
  });
})();
