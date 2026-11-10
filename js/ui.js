// Animaciones suaves al hacer scroll y contadores de la franja de confianza
(function () {
  var sel = '.h-card, .h-paso, .h-t, .h-ricardo .container > *, .p-box, .p-canal, .p-video, .h-cierre .container, .h-cifra';
  var els = document.querySelectorAll(sel);
  if (!('IntersectionObserver' in window)) return;
  els.forEach(function (el) { el.classList.add('reveal'); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      io.unobserve(e.target);
      var s = e.target.querySelector && e.target.querySelector('strong[data-n]');
      if (s) contar(s);
    });
  }, { threshold: 0.15 });
  els.forEach(function (el) { io.observe(el); });

  function contar(s) {
    var fin = parseInt(s.getAttribute('data-n'), 10), pre = s.getAttribute('data-pre') || '', suf = s.getAttribute('data-suf') || '';
    var t0 = null;
    function paso(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 1200, 1); s.textContent = pre + Math.round(fin * p) + suf; if (p < 1) requestAnimationFrame(paso); }
    requestAnimationFrame(paso);
  }
})();
