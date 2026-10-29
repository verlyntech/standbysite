(function () {
  "use strict";
  // Count-up numbers on the "Why Verlyn" page
  var els = document.querySelectorAll("[data-n]");
  if (!els.length) return;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
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
