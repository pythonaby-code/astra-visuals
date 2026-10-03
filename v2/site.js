/* Astra Visuals — эффекты сайта: затмение на холсте, печатающийся заголовок,
   появление при прокрутке, свечение карточек за мышью, параллакс. */
(function () {
  var doc = document.documentElement;
  doc.classList.add('js');
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- затмение: планета с ободком сверху, синий горизонт снизу ---------- */
  function eclipse(canvas) {
    var ctx = canvas.getContext('2d');
    var w = 0, h = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
    var stars = [];
    function size() {
      var r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = [];
      var n = Math.round(w * h / 9000);
      for (var i = 0; i < n; i++) stars.push([Math.random() * w, Math.random() * h, Math.random() * 1.2 + .2, Math.random() * 6.28]);
    }
    size();
    window.addEventListener('resize', size);
    var scrollY = 0;
    window.addEventListener('scroll', function () { scrollY = window.scrollY; }, { passive: true });

    function draw(t) {
      var s = t / 1000;
      ctx.clearRect(0, 0, w, h);
      // звёзды мерцают
      for (var i = 0; i < stars.length; i++) {
        var st = stars[i];
        ctx.globalAlpha = .25 + .55 * (0.5 + 0.5 * Math.sin(s * 1.3 + st[3]));
        ctx.fillStyle = '#d9d2ff';
        ctx.fillRect(st[0], st[1] - scrollY * .15, st[2], st[2]);
      }
      ctx.globalAlpha = 1;
      // «живой» перелив: оттенок ободка медленно ходит между фиолетовым и розовым
      var hue = 280 + 22 * Math.sin(s * .35);
      var page = canvas.dataset.mode === 'page';
      var R = Math.max(w * .78, 620);
      // На внутренних страницах шапка низкая: ободок планеты кладём к её низу,
      // а синего горизонта нет вовсе — ему там негде поместиться.
      var cx = w / 2, cy = (page ? h * 1.3 - R * .965 : -R * .30) + scrollY * .25;           // параллакс: планета уходит медленнее страницы
      // ореол ободка
      var g = ctx.createRadialGradient(cx, cy, R * .86, cx, cy, R * 1.12);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(.42, 'hsla(' + (hue + 40) + ',95%,82%,.95)');
      g.addColorStop(.52, 'hsla(' + hue + ',90%,64%,.75)');
      g.addColorStop(.72, 'hsla(' + (hue - 25) + ',85%,45%,.28)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.12, 0, Math.PI * 2); ctx.fill();
      // сама планета — чёрная, чуть подсвечена снизу
      var body = ctx.createRadialGradient(cx, cy + R * .55, R * .1, cx, cy, R);
      body.addColorStop(0, 'hsla(' + hue + ',55%,11%,1)');
      body.addColorStop(.7, '#07050f');
      body.addColorStop(1, '#030208');
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.arc(cx, cy, R * .965, 0, Math.PI * 2); ctx.fill();
      if (page) { if (!still) requestAnimationFrame(draw); return; }
      // синий горизонт снизу
      var by = h + R * .62 - scrollY * .1;
      var b = ctx.createRadialGradient(cx, by, R * .55, cx, by, R * .9);
      b.addColorStop(0, 'rgba(0,0,0,0)');
      b.addColorStop(.62, 'rgba(79,107,255,.0)');
      b.addColorStop(.74, 'hsla(' + (232 + 10 * Math.sin(s * .5)) + ',100%,62%,.85)');
      b.addColorStop(.8, 'rgba(127,212,255,.35)');
      b.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = b;
      ctx.beginPath(); ctx.arc(cx, by, R * .9, 0, Math.PI * 2); ctx.fill();
      if (!still) requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }
  document.querySelectorAll('canvas.eclipse').forEach(eclipse);

  /* ---------- печатающийся заголовок ---------- */
  document.querySelectorAll('[data-type]').forEach(function (el) {
    var full = el.getAttribute('data-type');
    el.setAttribute('aria-label', full.replace(/\|/g, ' '));
    if (still) { el.innerHTML = full.split('|').join('<br>'); return; }
    var caret = '<span class="caret" aria-hidden="true"></span>';
    var i = 0;
    function tick() {
      i++;
      var shown = full.slice(0, i);
      el.innerHTML = shown.split('|').map(function (p, k, a) {
        return k === a.length - 1 ? '<span class="shine">' + p + '</span>' : p;
      }).join('<br>') + caret;
      if (i < full.length) setTimeout(tick, full[i - 1] === '|' ? 260 : 42 + Math.random() * 40);
    }
    el.innerHTML = caret;
    setTimeout(tick, 350);
  });

  /* ---------- появление при прокрутке ---------- */
  var items = [].slice.call(document.querySelectorAll('.reveal'));
  function show(el) { el.classList.add('in'); }
  if ('IntersectionObserver' in window && !still) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el, k) { el.style.transitionDelay = (el.dataset.delay || 0) + 'ms'; io.observe(el); });
    // Подстраховка: ничего не остаётся невидимым, даже если наблюдатель молчит.
    setTimeout(function () { items.forEach(show); }, 4000);
  } else {
    items.forEach(show);
  }

  /* ---------- свечение карточек за мышью ---------- */
  document.querySelectorAll('.card').forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- параллакс ---------- */
  var par = [].slice.call(document.querySelectorAll('[data-speed]'));
  var tiltEl = document.querySelector('[data-tilt]');
  var mx = 0, my = 0;
  window.addEventListener('pointermove', function (e) {
    mx = e.clientX / window.innerWidth - .5; my = e.clientY / window.innerHeight - .5;
  }, { passive: true });
  function loop() {
    var y = window.scrollY;
    par.forEach(function (el) {
      var sp = parseFloat(el.dataset.speed);
      var r = el.getBoundingClientRect();
      var mid = r.top + r.height / 2 - window.innerHeight / 2;
      el.style.transform = 'translate3d(' + (mx * sp * 30) + 'px,' + (-mid * sp * .06) + 'px,0)';
    });
    if (tiltEl) tiltEl.style.transform = 'perspective(1800px) rotateX(' + (6 - Math.min(6, y / 50) + my * -2) + 'deg) rotateY(' + (mx * 3) + 'deg)';
    if (!still) requestAnimationFrame(loop);
  }
  if (par.length || tiltEl) loop();

  /* ---------- кнопки «Скопировать» ---------- */
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = document.getElementById(b.dataset.copy);
      var text = t ? t.textContent.trim() : '';
      var done = function () { var o = b.textContent; b.textContent = 'Скопировано'; setTimeout(function () { b.textContent = o; }, 1400); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () { select(t); });
      else select(t);
    });
  });
  function select(el) {
    if (!el) return;
    var r = document.createRange(); r.selectNodeContents(el);
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  }
})();
