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
  // con apertura y cierre suaves
  var faqDur = 380;
  function faqAnim(d, abrir) {
    var c = d.querySelector('summary + div'); if (!c) { d.open = abrir; return; }
    if (d._anim) { d._anim.cancel(); }
    if (abrir) { d.open = true; }
    var h = c.scrollHeight;
    c.style.overflow = 'hidden';
    d.classList.toggle('faq-abierta', abrir);
    var a = c.animate(abrir
      ? [{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }]
      : [{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }],
      { duration: faqDur, easing: 'cubic-bezier(.4,0,.2,1)' });
    d._anim = a;
    a.onfinish = function () { d._anim = null; c.style.overflow = ''; if (!abrir) d.open = false; };
  }
  document.querySelectorAll('.faq').forEach(function (d) {
    if (d.open) d.classList.add('faq-abierta');
    d.querySelector('summary').addEventListener('click', function (e) {
      e.preventDefault();
      var abrir = !d.classList.contains('faq-abierta');
      if (abrir) document.querySelectorAll('.faq.faq-abierta').forEach(function (o) { if (o !== d) faqAnim(o, false); });
      faqAnim(d, abrir);
    });
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

// Video de portada: el primer toque en cualquier parte lo reproduce (luego mandan los controles normales)
(function () {
  var v = document.querySelector('.h-video-marco video'); if (!v) return;
  function primero() { if (v.paused) v.play(); }
  v.addEventListener('click', primero);
  v.addEventListener('play', function () { v.removeEventListener('click', primero); }, { once: true });
  // Al terminar vuelve a la imagen inicial, sin repetir
  v.loop = false;
  v.addEventListener('ended', function () { v.pause(); v.currentTime = 0; setTimeout(function () { v.load(); }, 50); v.addEventListener('click', primero); v.addEventListener('play', function () { v.removeEventListener('click', primero); }, { once: true }); });
})();

// Testimonios del inicio: rotan cada 9 s (pausa al pasar el mouse)
(function () {
  var g = document.getElementById('t-rota'); if (!g) return;
  var extra = [
    ['“Excelente atención y asesoría desde el momento 1 de parte del equipo completo, siempre respondiendo todas nuestras dudas de una manera clara y concisa.”', 'Steamline Group LLC'],
    ['“Trato muy cercano, comprensibles y atentos. Gracias por el servicio que me habéis ofrecido. ¡Un abrazo a todo el equipo!”', 'Educating Crypto Labs LLC'],
    ['“Necesitaba un socio confiable para las finanzas de mi empresa y superaron mis expectativas. Su equipo es transparente, eficiente y siempre está al tanto de las regulaciones.”', 'Carlos Perdomo']
  ];
  var cards = g.querySelectorAll('.h-t'); if (!cards.length) return;
  var base = [].map.call(cards, function (c) { return [c.querySelector('p').textContent, c.querySelector('strong').textContent]; });
  var sets = [base, extra], i = 0, pausa = false;
  g.addEventListener('mouseenter', function () { pausa = true; });
  g.addEventListener('mouseleave', function () { pausa = false; });
  setInterval(function () {
    if (pausa || document.hidden) return;
    i = (i + 1) % sets.length;
    [].forEach.call(cards, function (c, k) {
      setTimeout(function () {
        c.classList.add('t-sale');
        setTimeout(function () {
          var t = sets[i][k]; if (!t) return;
          c.querySelector('p').textContent = t[0]; c.querySelector('strong').textContent = t[1];
          c.classList.remove('t-sale');
        }, 450);
      }, k * 180);
    });
  }, 9000);
})();
