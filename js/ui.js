// Interacciones ligeras: aparición al hacer scroll, contadores, encabezado compacto, barra de progreso
(function () {
  var bar = document.createElement('div'); bar.className = 'h-progreso'; document.body.appendChild(bar);
  var nav = document.querySelector('.navbar');
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var h = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
      if (nav) nav.classList.toggle('compacto', scrollY > 40);
      ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Preguntas: abrir una a la vez
  document.querySelectorAll('.faq').forEach(function (d) {
    d.addEventListener('toggle', function () { if (d.open) document.querySelectorAll('.faq[open]').forEach(function (o) { if (o !== d) o.open = false; }); });
  });

  var sel = '.h-card, .h-paso, .h-t, .h-ricardo .container > *, .p-box, .p-canal, .p-video, .h-cierre .container, .h-cifra, .h-ins, .faq, .chq-p';
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
  }, { threshold: 0.12 });
  els.forEach(function (el) { io.observe(el); });
  function contar(s) {
    var fin = parseInt(s.getAttribute('data-n'), 10), pre = s.getAttribute('data-pre') || '', suf = s.getAttribute('data-suf') || '';
    var t0 = null;
    function paso(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 1200, 1); s.textContent = pre + Math.round(fin * p) + suf; if (p < 1) requestAnimationFrame(paso); }
    requestAnimationFrame(paso);
  }
})();
