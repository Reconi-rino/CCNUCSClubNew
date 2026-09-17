/* ==========================================================================
   集中站主视觉轮播
   - 渐进增强：没有 JS 时只展示 HTML 里标记为 is-active 的第一屏，卡片照常可点。
   - 无障碍：暂停/播放按钮 + 指示点，跟随 prefers-reduced-motion。
   - 自动轮播会在悬停、聚焦、切换标签页时暂停。
   ========================================================================== */
(function () {
  'use strict';

  var carousel = document.getElementById('carousel');
  var slides = Array.prototype.slice.call(document.querySelectorAll('#slides .slide'));
  if (!carousel || slides.length < 2) return;

  var dotsBox = document.getElementById('dots');
  var status = document.getElementById('carousel-status');
  var playBtn = carousel.querySelector('[data-toggle-play]');
  var playIcon = carousel.querySelector('[data-play-icon]');
  var INTERVAL = 6500;

  var index = Math.max(0, slides.findIndex(function (s) { return s.classList.contains('is-active'); }));
  /* 深链接直接定位到某张主视觉时，不要从第一张淡入淡出——直接就位 */
  var deepLink = /^#slide-(\d+)$/.exec(window.location.hash || '');
  if (deepLink) {
    var wanted = Number(deepLink[1]) - 1;
    if (wanted >= 0 && wanted < slides.length) {
      index = wanted;
      carousel.classList.add('is-instant');
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () { carousel.classList.remove('is-instant'); });
      });
    }
  }
  slides.forEach(function (slide, i) { slide.classList.toggle('is-active', i === index); });
  var timer = null;
  var paused = false;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dots = [];

  var nameOf = function (slide) {
    var label = slide.getAttribute('aria-label') || '';
    var title = slide.querySelector('.slide__title');
    return title ? title.textContent.trim() : label;
  };

  /* ---------------------------------------------------------- 指示点 -- */
  if (dotsBox) {
    slides.forEach(function (slide, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'dot';
      dot.setAttribute('aria-label', '第 ' + (i + 1) + ' 张：' + nameOf(slide));
      dot.addEventListener('click', function () { go(i, true); });
      dotsBox.appendChild(dot);
      dots.push(dot);
    });
  }

  function syncDots() {
    dots.forEach(function (dot, i) {
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  /* ------------------------------------------------------------ 切换 -- */
  function go(next, byUser) {
    var total = slides.length;
    next = (next % total + total) % total;
    if (next === index) return;

    slides[index].classList.remove('is-active');
    slides[next].classList.add('is-active');
    index = next;
    syncDots();

    if (status) status.textContent = '第 ' + (index + 1) + ' / ' + total + ' 张：' + nameOf(slides[index]);

    var img = slides[index].querySelector('img');
    if (img && img.decode) img.decode().catch(function () {});

    if (byUser) restart();
  }

  function next() { go(index + 1, true); }
  function prev() { go(index - 1, true); }

  /* -------------------------------------------------------- 自动轮播 -- */
  function stop() {
    if (timer) { window.clearInterval(timer); timer = null; }
  }

  function start() {
    stop();
    if (paused || reduced || document.hidden) return;
    timer = window.setInterval(function () { go(index + 1, false); }, INTERVAL);
  }

  function restart() { stop(); start(); }

  function setPaused(value) {
    paused = value;
    if (playBtn) {
      playBtn.setAttribute('aria-pressed', String(paused));
      playBtn.setAttribute('aria-label', paused ? '开始自动轮播' : '暂停自动轮播');
    }
    if (playIcon) playIcon.textContent = paused ? '▶' : '❙❙';
    if (paused) stop(); else start();
  }

  /* ------------------------------------------------------------ 交互 -- */
  carousel.querySelectorAll('[data-dir]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dir = Number(btn.getAttribute('data-dir'));
      if (dir < 0) prev(); else next();
    });
  });

  if (playBtn) {
    playBtn.addEventListener('click', function () { setPaused(!paused); });
  }

  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', function () { if (!paused) start(); });
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', function (e) {
    if (!carousel.contains(e.relatedTarget) && !paused) start();
  });

  carousel.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else if (!paused) start();
  });

  /* 触摸/指针滑动 */
  var startX = null, startY = null, dragging = false;
  carousel.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    startX = e.clientX; startY = e.clientY; dragging = true;
    stop();
  });
  carousel.addEventListener('pointerup', function (e) {
    if (!dragging) return;
    dragging = false;
    var dx = e.clientX - startX;
    var dy = e.clientY - startY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { if (dx < 0) next(); else prev(); }
    else if (!paused) start();
  });
  carousel.addEventListener('pointercancel', function () {
    dragging = false;
    if (!paused) start();
  });

  /* 若用户随后关闭了「减少动态效果」，也跟着更新 */
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    var onChange = function (e) { reduced = e.matches; if (reduced) stop(); else if (!paused) start(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  syncDots();

  /* 启动时就把 4 张主视觉都解码好：切换时不会先黑一下再出现 */
  slides.forEach(function (slide) {
    var img = slide.querySelector('img');
    if (img && img.decode) img.decode().catch(function () {});
    else if (img && !img.complete) img.loading = 'eager';
  });

  if (reduced) setPaused(true); else start();
})();
