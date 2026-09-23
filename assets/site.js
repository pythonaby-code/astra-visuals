/* Живое меню, темы и пиксельные значки сайта Astra Visuals.
   ⚠ Названия пунктов — ровно как в меню мода (AstraConfig). С 23 сен всё
   бесплатно: третий флаг «по подписке» у строк больше не ставится. Краски тем — из Theme.THEMES. Разойдутся — сайт
   пообещает не то, что есть в игре. */
(function () {
  'use strict';

  var TABS = [
    { name: 'Свет и небо', rows: [
      ['Полная яркость', 1], ['Убрать дождь и снег', 1], ['Своё небо', 0],
      ['Купол неба: три цвета за сутки', 1], ['Чистая вода и лава', 0], ['Свой цвет воды', 0], ['Ярче звёзды ночью', 1], ['Красить облака', 0], ['Свои цвета травы и листвы', 0], ['Убрать густой туман', 1]] },
    { name: 'Плашки HUD', rows: [
      ['Плашка про цель', 1], ['Карточка игрока', 1], ['Показывать броню цели', 1],
      ['Показывать расстояние', 0], ['Здоровье существ на плашке', 0], ['Кольцо под целью', 1], ['Броня и еда цифрами', 1], ['Плашка «Эффекты»', 1], ['Часы', 0], ['Скорость', 0]] },
    { name: 'Бой', rows: [
      ['Обводка предмета в руке', 1], ['Искры при ударе', 1], ['Числа урона', 0],
      ['Дуга броска', 1], ['След снаряда', 0], ['Чья стрела', 1], ['Круг досягаемости', 0], ['Бьющееся сердце', 1], ['Полоски здоровья над существами', 1], ['Счёт боя', 0]] },
    { name: 'Свечение', rows: [
      ['Свечение персонажей', 0], ['Trails', 1], ['Частицы в мире', 1],
      ['Объёмные частицы', 1], ['Эффект убийства', 0], ['Звёздный залп', 1], ['Атмосфера', 0], ['Манекен для тренировки', 0], ['Искры и по блокам', 1], ['Свой цвет вспышки', 0]] },
    { name: 'Звуки и музыка', rows: [
      ['Свои звуки', 1], ['Поджог TNT', 1], ['Свой плеер', 0],
      ['Запускать чужой плеер', 0], ['Что играет', 1], ['Граффити на стенах', 0], ['Перемешать', 0], ['Повторять трек', 0], ['Играть подряд', 1], ['Прятать за блоками', 1]] }
  ];

  var tabsBox = document.getElementById('tabs');
  var body = document.getElementById('menu-body');

  function showTab(i) {
    Array.prototype.forEach.call(tabsBox.children, function (b, k) {
      b.setAttribute('aria-selected', k === i ? 'true' : 'false');
    });
    body.innerHTML = '';
    TABS[i].rows.forEach(function (r) {
      var row = document.createElement('button');
      row.type = 'button';
      row.className = 'row' + (r[1] ? ' on' : '');
      row.setAttribute('aria-pressed', r[1] ? 'true' : 'false');
      var label = document.createElement('span');
      label.textContent = r[0];
      if (r[2]) {
        var s = document.createElement('small');
        s.textContent = 'ПОДПИСКА';
        label.appendChild(s);
      }
      var sw = document.createElement('span');
      sw.className = 'sw';
      row.appendChild(label);
      row.appendChild(sw);
      row.addEventListener('click', function () {
        r[1] = r[1] ? 0 : 1;
        row.classList.toggle('on', !!r[1]);
        row.setAttribute('aria-pressed', r[1] ? 'true' : 'false');
      });
      body.appendChild(row);
    });
  }
  TABS.forEach(function (t, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'tab';
    b.setAttribute('role', 'tab');
    b.textContent = t.name;
    b.addEventListener('click', function () { showTab(i); });
    tabsBox.appendChild(b);
  });
  showTab(0);

  /* ---------- темы: [имя, фон, стекло верх, стекло низ, верх ярче, акцент, за звёзды] ---------- */
  var THEMES = [
    ['Аметист', 0xF00A0713, 0xE6231645, 0xE6110A22, 0xE6341F5E, 0xFFA855F7],
    ['Бирюза', 0xF0041012, 0xE6103038, 0xE6081A1E, 0xE6184450, 0xFF2DD4BF],
    ['Закат', 0xF0140806, 0xE6431A12, 0xE6220C08, 0xE6602618, 0xFFFB923C],
    ['Полночь', 0xF0060A16, 0xE6141F3C, 0xE60A101F, 0xE61E2D56, 0xFF60A5FA],
    ['Чёрный космос', 0xF004050A, 0xE6131826, 0xE6080B14, 0xE61E2538, 0xFF7FA6FF],
    ['Роза', 0xF0140610, 0xE6431030, 0xE6220818, 0xE6601846, 0xFFF472B6],
    ['Изумруд', 0xF0031008, 0xE60E3320, 0xE6071A10, 0xE6154A2E, 0xFF34D399],
    ['Пепел', 0xF00A0A0C, 0xE6242428, 0xE6121214, 0xE6343439, 0xFFE5E7EB],
    ['Вишня', 0xF0120508, 0xE63C1220, 0xE61E0910, 0xE6581A2E, 0xFFE11D48, 1],
    ['Золото', 0xF00C0A04, 0xE62A2310, 0xE6151108, 0xE63E3418, 0xFFF5B301, 1],
    ['Лазурь', 0xF0030814, 0xE60D2044, 0xE6061022, 0xE6142F64, 0xFF38BDF8, 1],
    ['Неон', 0xF0050705, 0xE6121A12, 0xE6090D09, 0xE61B281B, 0xFF39FF88, 1]
  ];
  function rgba(argb) {
    var a = ((argb >>> 24) & 255) / 255;
    return 'rgba(' + ((argb >> 16) & 255) + ',' + ((argb >> 8) & 255) + ',' + (argb & 255) + ',' + a.toFixed(2) + ')';
  }
  function hex(argb) { return '#' + ('00000' + (argb & 0xFFFFFF).toString(16)).slice(-6); }

  var themesBox = document.getElementById('themes');
  var root = document.documentElement;
  function applyTheme(i) {
    var t = THEMES[i];
    root.style.setProperty('--glass-top', rgba(t[2]));
    root.style.setProperty('--glass-bot', rgba(t[3]));
    root.style.setProperty('--glass-hi', rgba(t[4]));
    root.style.setProperty('--accent', hex(t[5]));
    Array.prototype.forEach.call(themesBox.children, function (b, k) {
      b.setAttribute('aria-pressed', k === i ? 'true' : 'false');
    });
    drawAll();
  }
  THEMES.forEach(function (t, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'theme';
    var dot = document.createElement('i');
    dot.style.background = hex(t[5]);
    b.appendChild(dot);
    b.appendChild(document.createTextNode(t[0]));
    if (t[6]) {
      var s = document.createElement('small');
      s.textContent = '★';
      b.appendChild(s);
    }
    b.addEventListener('click', function () {
      applyTheme(i);
      // Выбрал тему — показываем, как она выглядит, а не оставляем внизу страницы.
      document.getElementById('stage').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    themesBox.appendChild(b);
  });

  /* ---------- пиксельные значки: 16×16, свои. «a» — акцент темы ---------- */
  var ART = {
    sword: ['..............ww', '.............wlw', '............wlw.', '...........wlw..', '..........wlw...', '.........wlw....', '........wlw.....', '...a...wlw......', '...aa.wlw.......', '....aawlw.......', '.....aaw........', '....bbaa........', '...bbb.aa.......', '..bbb...........', '.bbb............', '.bb.............'],
    note: ['................', '.......aaaaaaaa.', '.......aaaaaaaa.', '.......a......a.', '.......a......a.', '.......a......a.', '.......a......a.', '.......a......a.', '.......a......a.', '....www.a..www.a', '...wwwwwa.wwwwwa', '...wwwwwa.wwwwwa', '....wwww...wwww.', '................', '................', '................'],
    chat: ['................', '..aaaaaaaaaaaa..', '.aaaaaaaaaaaaaa.', '.aawwwwwwwwwwaa.', '.aaaaaaaaaaaaaa.', '.aawwwwwwwaaaaa.', '.aaaaaaaaaaaaaa.', '.aawwwwaaaaaaaa.', '.aaaaaaaaaaaaaa.', '..aaaaaaaaaaaa..', '...aaa..........', '...aa...........', '...a............', '................', '................', '................'],
    tnt: ['................', '.......w........', '......w.........', '.......l........', '..rrrrrrrrrrrr..', '..rrrrrrrrrrrr..', '..rwwwwwwwwwwr..', '..rwbwbbwbbwbr..', '..rwbwwbwwbwbr..', '..rwwwwwwwwwwr..', '..rrrrrrrrrrrr..', '..rrrrrrrrrrrr..', '..rrrrrrrrrrrr..', '................', '................', '................'],
    star: ['................', '.......a........', '.......a........', '......aaa.......', '......aaa.......', 'aaaaaaaaaaaaaaa.', '.aaaaawwwaaaaa..', '..aaaawwwaaaa...', '...aaaaaaaaa....', '...aaaaaaaaa....', '..aaaaa.aaaaa...', '..aaaa...aaaa...', '.aaa.......aaa..', '.a...........a..', '................', '................'],
    moon: ['................', '......aaaa......', '....aaaa........', '...aaa..........', '..aaa.......w...', '..aaa...........', '.aaaa...........', '.aaaa.......w...', '.aaaa...........', '.aaaaa..........', '..aaaaa.........', '..aaaaaaa....a..', '...aaaaaaaaaaa..', '....aaaaaaaaa...', '......aaaaa.....', '................']
  };
  var COL = { w: '#ede9fe', l: '#b9b2cf', b: '#6b4a2e', r: '#e0463e' };
  function drawIcon(cv) {
    var art = ART[cv.getAttribute('data-art')];
    if (!art) return;
    var accent = getComputedStyle(root).getPropertyValue('--accent').trim() || '#a855f7';
    var s = 8;
    cv.width = 16 * s;
    cv.height = 16 * s;
    var g = cv.getContext('2d');
    g.clearRect(0, 0, cv.width, cv.height);
    for (var y = 0; y < 16; y++) {
      for (var x = 0; x < 16; x++) {
        var c = art[y].charAt(x);
        if (c === '.') continue;
        g.fillStyle = c === 'a' ? accent : COL[c];
        g.fillRect(x * s, y * s, s, s);
        // Лёгкий объём: верхняя грань клетки светлее — как у предметов в игре.
        g.fillStyle = 'rgba(255,255,255,.12)';
        g.fillRect(x * s, y * s, s, 2);
      }
    }
  }
  function drawAll() {
    Array.prototype.forEach.call(document.querySelectorAll('canvas[data-art]'), drawIcon);
  }
  drawAll();
})();
