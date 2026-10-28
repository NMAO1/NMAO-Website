/* NMAO — Phase 1 "life": scroll-reveal + count-up. Progressive enhancement. */
(function () {
  'use strict';

  /* ---------- scroll reveal ---------- */
  var els = [].slice.call(document.querySelectorAll('.reveal, .offer-banner, .sheet-group, .prod-foot, .pillar, .founder-card'));

  function reveal(el) { el.classList.add('in'); }

  if (!('IntersectionObserver' in window)) {
    els.forEach(reveal);
  } else {
    var io = new IntersectionObserver(function (entries) {
      // stagger only the items that enter together in this batch
      var hits = entries.filter(function (e) { return e.isIntersecting; });
      hits.forEach(function (e, i) {
        e.target.style.transitionDelay = (Math.min(i, 6) * 90) + 'ms';
        reveal(e.target);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
    // failsafe — nothing stays hidden
    setTimeout(function () {
      els.forEach(function (el) {
        if (!el.classList.contains('in')) {
          var r = el.getBoundingClientRect();
          if (r.top < (window.innerHeight || 0) + 240) reveal(el);
        }
      });
    }, 3000);
  }

  /* ---------- count-up ---------- */
  var counters = [].slice.call(document.querySelectorAll('[data-count]'));
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1200, t0 = null;
    function frame(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 0.5 - Math.cos(p * Math.PI) / 2; // ease-in-out
      el.textContent = prefix + Math.floor(eased * target).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = prefix + target.toLocaleString() + suffix;
    }
    requestAnimationFrame(frame);
  }
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(countUp);
  }
})();
