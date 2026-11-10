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
    });
  }, { threshold: 0.12 });
  els.forEach(function (el) { io.observe(el); });
  // Contadores: arrancan en 0 y suben cuando el número entra en pantalla
  var nums = document.querySelectorAll('strong[data-n]');
  nums.forEach(function (n) { n.textContent = (n.getAttribute('data-pre') || '') + '0' + (n.getAttribute('data-suf') || ''); });
  var io2 = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { io2.unobserve(e.target); contar(e.target); } });
  }, { threshold: 0.6 });
  nums.forEach(function (n) { io2.observe(n); });
  function contar(s) {
    var fin = parseInt(s.getAttribute('data-n'), 10), pre = s.getAttribute('data-pre') || '', suf = s.getAttribute('data-suf') || '';
    var t0 = null;
    function paso(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 2200, 1), q = 1 - Math.pow(1 - p, 3); s.textContent = pre + Math.round(fin * q) + suf; if (p < 1) requestAnimationFrame(paso); }
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

// Calendario fiscal y barra de aviso con la próxima fecha límite del IRS
(function () {
  var F = [
    [2, 15, 'LLC con socios (Formulario 1065) y S-Corp (1120-S)'],
    [3, 15, 'LLC de un dueño extranjero (1120 + 5472), corporaciones (1120) y 1040-NR con salario en EE.UU. (y sus extensiones)'],
    [4, 1, 'Reporte anual de tu LLC en Florida (Sunbiz)'],
    [5, 15, 'Declaración personal 1040-NR sin salario en EE.UU.'],
    [8, 15, 'Declaraciones extendidas de LLC con socios (1065) y S-Corp (1120-S)'],
    [9, 15, 'Declaraciones extendidas de corporaciones, 1120 + 5472 y 1040-NR con salario']
  ];
  var M = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  var hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  function habil(d) { while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1); return d; }
  var lista = [];
  [hoy.getFullYear(), hoy.getFullYear() + 1].forEach(function (y) {
    F.forEach(function (f) { var d = new Date(y, f[0], f[1]); if (f[0] !== 4) habil(d); lista.push({ d: d, que: f[2] }); });
  });
  lista = lista.filter(function (x) { return x.d >= hoy; }).sort(function (a, b) { return a.d - b.d; });
  var prox = lista[0]; if (!prox) return;
  var dias = Math.round((prox.d - hoy) / 864e5);
  function fmt(d) { return d.getDate() + ' de ' + M[d.getMonth()] + ' de ' + d.getFullYear(); }

  var el = document.getElementById('cal-dias');
  if (el) {
    document.getElementById('cal-prox-fecha').textContent = fmt(prox.d);
    document.getElementById('cal-prox-que').textContent = prox.que;
    el.setAttribute('data-n', dias); el.textContent = '0';
    var io = new IntersectionObserver(function (e) {
      if (!e[0].isIntersecting) return; io.disconnect();
      var t0 = null; (function paso(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 1800, 1); el.textContent = Math.round(dias * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(paso); })(performance.now());
    }, { threshold: 0.5 });
    io.observe(el);
    var ul = document.getElementById('cal-lista');
    lista.slice(0, 6).forEach(function (x, i) {
      var li = document.createElement('li'); if (i === 0) li.className = 'prox';
      li.innerHTML = '<span class="f"><b>' + x.d.getDate() + '</b>' + M[x.d.getMonth()].slice(0, 3) + '</span><span class="q"></span>';
      li.querySelector('.q').textContent = x.que; ul.appendChild(li);
    });
  }

  // Barra superior (se puede cerrar; no vuelve a salir en la misma visita)
  try { if (sessionStorage.getItem('barra-cerrada')) return; } catch (e) {}
  var bar = document.createElement('div'); bar.className = 'h-aviso';
  bar.innerHTML = '<span>📅 Próxima fecha límite del IRS: <b>' + prox.d.getDate() + ' de ' + M[prox.d.getMonth()] + '</b> · faltan <b>' + dias + ' días</b></span> <a href="/#calendario">Ver calendario</a><button type="button" aria-label="Cerrar aviso">&times;</button>';
  document.body.insertBefore(bar, document.body.firstChild);
  bar.querySelector('button').addEventListener('click', function () { bar.remove(); try { sessionStorage.setItem('barra-cerrada', '1'); } catch (e) {} });
})();

// Frase destacada: cambia en cada visita
(function () {
  var p = document.getElementById('frase-txt'); if (!p) return;
  var F = ['“Cumplir a tiempo siempre cuesta menos que corregir tarde.”',
           '“Tu LLC no necesita suerte con el IRS: necesita orden y estrategia.”',
           '“Vivas donde vivas, tu empresa en Estados Unidos merece estar en regla.”'];
  p.textContent = F[Math.floor(Math.random() * F.length)];
})();
