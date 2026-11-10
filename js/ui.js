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

  var sel = '.h-card, .h-paso, .h-t, .h-ricardo .container > *, .p-box, .p-canal, .p-video, .h-cierre .container, .h-ins, .faq, .chq-p';
  var els = document.querySelectorAll(sel);
  if (!('IntersectionObserver' in window)) return;
  els.forEach(function (el) { el.classList.add('reveal'); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  els.forEach(function (el) { io.observe(el); });
  // Contadores: arrancan en 0 y suben cuando el número entra en pantalla
  var nums = document.querySelectorAll('strong[data-n]');
  nums.forEach(function (n) { n.textContent = (n.getAttribute('data-pre') || '') + '0' + (n.getAttribute('data-suf') || ''); });
  var io2 = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { io2.unobserve(e.target); setTimeout(function () { contar(e.target); }, 250); } });
  }, { threshold: 0.6 });
  nums.forEach(function (n) { io2.observe(n); });
  function contar(s) {
    var fin = parseInt(s.getAttribute('data-n'), 10), pre = s.getAttribute('data-pre') || '', suf = s.getAttribute('data-suf') || '';
    var t0 = null;
    function paso(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 2600, 1), q = 1 - Math.pow(1 - p, 3); s.textContent = pre + Math.round(fin * q) + suf; if (p < 1) requestAnimationFrame(paso); }
    requestAnimationFrame(paso);
  }
  var tabs = document.querySelectorAll('.p-tabs a');
  if (tabs.length) {
    var io3 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) tabs.forEach(function (a) { a.classList.toggle('activo', a.getAttribute('href') === '#' + e.target.id); }); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('.p-servicio[id]').forEach(function (sec) { io3.observe(sec); });
  }
})();

// Calendario fiscal: 3 fechas clave con cuenta regresiva de cada una
(function () {
  var ul = document.getElementById('cal-lista'); if (!ul) return;
  var F = [
    [2, 15, 'LLC con socios (Formulario 1065) y S-Corp (1120-S)'],
    [3, 15, 'LLC de un dueño extranjero (1120 + 5472), corporaciones (1120) y 1040-NR con salario en EE.UU.'],
    [5, 15, 'Declaración personal 1040-NR sin salario en EE.UU.']
  ];
  var hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  F.forEach(function (f) {
    var y = hoy.getFullYear(), d = new Date(y, f[0], f[1]);
    if (d < hoy) d = new Date(y + 1, f[0], f[1]);
    while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
    var dias = Math.round((d - hoy) / 864e5);
    var li = document.createElement('li');
    li.innerHTML = '<span class="f">' + pad(d.getMonth() + 1) + '/' + pad(d.getDate()) + '/' + d.getFullYear() + '</span><span class="q"></span><span class="d"><strong data-n="' + dias + '">' + dias + '</strong> días</span>';
    li.querySelector('.q').textContent = f[2];
    ul.appendChild(li);
  });
  var nums = ul.querySelectorAll('strong[data-n]');
  nums.forEach(function (n) { n.textContent = '0'; });
  var io = new IntersectionObserver(function (e) {
    if (!e[0].isIntersecting) return; io.disconnect();
    nums.forEach(function (n) {
      var fin = +n.getAttribute('data-n'), t0 = null;
      (function paso(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 2000, 1); n.textContent = Math.round(fin * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(paso); })(performance.now());
    });
  }, { threshold: 0.4 });
  io.observe(ul);
})();

// Frase destacada: cambia en cada visita
(function () {
  var p = document.getElementById('frase-txt'); if (!p) return;
  var F = ['“Cumplir a tiempo siempre cuesta menos que corregir tarde.”',
           '“Tu LLC no necesita suerte con el IRS: necesita orden y estrategia.”',
           '“Vivas donde vivas, tu empresa en Estados Unidos merece estar en regla.”'];
  p.textContent = F[Math.floor(Math.random() * F.length)];
})();

// Video de portada: se reproduce o pausa tocando en cualquier parte
(function () {
  var marco = document.querySelector('.h-video-marco'); if (!marco) return;
  var v = marco.querySelector('video'), b = marco.querySelector('.h-play');
  function act() { marco.classList.toggle('reproduciendo', !v.paused); }
  marco.addEventListener('click', function () {
    if (v.paused) v.play(); else v.pause();
  });
  v.addEventListener('play', act); v.addEventListener('pause', act); v.addEventListener('ended', act);
})();
