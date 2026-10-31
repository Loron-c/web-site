/* ================================================================
   PixelSwap — 原生 JS 版（算法与 React Bits 原组件一致）
   网格构建 / pattern 排序 / 缓动求解 / 克隆内容 / Web Animations API
   用法：PixelSwap(element, settings)
   额外选项（相对原组件）：
     leaveTarget  还原触发区域，默认组件自身；传更大的容器可让内容"停留"
     prefers-reduced-motion 下自动跳过动画，直接切换
   ================================================================ */
(function () {
  'use strict';

  var MAX_PIXELS = 220;
  var KEYFRAME_STEPS = 14;

  var PATTERNS = {
    random: function () { return null; },
    center: function (x, y) { return Math.hypot(x - 0.5, y - 0.5) / Math.SQRT1_2; },
    edges: function (x, y) { return Math.min(x, 1 - x, y, 1 - y) * 2; },
    'left-to-right': function (x) { return x; },
    'right-to-left': function (x) { return 1 - x; },
    'top-to-bottom': function (_x, y) { return y; },
    'bottom-to-top': function (_x, y) { return 1 - y; },
    diagonal: function (x, y) { return (x + y) / 2; },
    spiral: function (x, y) {
      var angle = (Math.atan2(y - 0.5, x - 0.5) + Math.PI) / (Math.PI * 2);
      var radius = Math.hypot(x - 0.5, y - 0.5) / Math.SQRT1_2;
      return (angle + radius) % 1;
    }
  };

  var EASINGS = {
    linear: [0, 0, 1, 1],
    ease: [0.25, 0.1, 0.25, 1],
    'ease-in': [0.42, 0, 1, 1],
    'ease-out': [0, 0, 0.58, 1],
    'ease-in-out': [0.42, 0, 0.58, 1]
  };

  function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

  function noise(seed) {
    var value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return value - Math.floor(value);
  }

  function makeEasing(value) {
    var match = /cubic-bezier\(([^)]+)\)/.exec(value);
    var points = match ? match[1].split(',').map(Number) : EASINGS[value];
    if (!points || points.length !== 4 || points.some(Number.isNaN)) return makeEasing('ease');

    var x1 = points[0], y1 = points[1], x2 = points[2], y2 = points[3];
    if (x1 === y1 && x2 === y2) return function (p) { return p; };

    var cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    var cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;

    return function (progress) {
      var t = progress;
      for (var i = 0; i < 5; i += 1) {
        var slope = (3 * ax * t + 2 * bx) * t + cx;
        if (!slope) break;
        t -= (((ax * t + bx) * t + cx) * t - progress) / slope;
      }
      t = clamp(t, 0, 1);
      return ((ay * t + by) * t + cy) * t;
    };
  }

  // 像素最终要略大于自身格子，才能盖住 gap 与圆角
  function coverScale(size, gap, radius) {
    var p = clamp(radius, 0, 50) / 100;
    var corner = Math.SQRT1_2 / (Math.SQRT2 * (0.5 - p) + p);
    return ((size + gap) / size) * Math.max(1, corner);
  }

  function buildGrid(o) {
    var size = o.pixelSize, gap = o.gap;
    var columns = Math.max(1, Math.ceil((o.width + gap) / (size + gap)));
    var rows = Math.max(1, Math.ceil((o.height + gap) / (size + gap)));

    if (columns * rows > MAX_PIXELS) {
      size = Math.ceil(size * Math.sqrt((columns * rows) / MAX_PIXELS));
      columns = Math.max(1, Math.ceil((o.width + gap) / (size + gap)));
      rows = Math.max(1, Math.ceil((o.height + gap) / (size + gap)));
    }

    var stride = size + gap;
    var originX = (o.width - (columns * stride - gap)) / 2;
    var originY = (o.height - (rows * stride - gap)) / 2;
    var order = PATTERNS[o.pattern] || PATTERNS.random;
    var mix = clamp(o.randomness, 0, 1);
    var pixels = [];

    for (var row = 0; row < rows; row += 1) {
      for (var column = 0; column < columns; column += 1) {
        var index = row * columns + column;
        var x = columns <= 1 ? 0.5 : column / (columns - 1);
        var y = rows <= 1 ? 0.5 : row / (rows - 1);
        var base = order(x, y);
        var rnd = noise(index + 1);
        pixels.push({
          id: index,
          left: originX + column * stride,
          top: originY + row * stride,
          offset: base === null ? rnd : base * (1 - mix) + rnd * mix
        });
      }
    }
    return { pixels: pixels, size: size, gap: gap, width: o.width, height: o.height };
  }

  // 窗口变换 + 其精确逆变换：揭示出的内容不会漂移或缩放
  function buildKeyframes(o) {
    var win = [], content = [];
    for (var step = 0; step <= KEYFRAME_STEPS; step += 1) {
      var p = step / KEYFRAME_STEPS, e = o.ease(p);
      var scale = o.startScale + (o.endScale - o.startScale) * e;
      var angle = o.spin * (1 - e);
      win.push({
        offset: p,
        opacity: o.fade ? Math.min(1, e * 1.6) : 1,
        transform: 'rotate(' + angle + 'deg) scale(' + scale + ')'
      });
      content.push({ offset: p, transform: 'scale(' + (1 / scale) + ') rotate(' + (-angle) + 'deg)' });
    }
    return { window: win, content: content };
  }

  function createPixelSwap(container, settings) {
    settings = settings || {};
    var cfg = {
      pixelSize: settings.pixelSize || 64,
      gap: settings.gap || 0,
      pixelRadius: settings.pixelRadius || 0,
      pixelSpin: settings.pixelSpin || 0,
      pixelScale: settings.pixelScale == null ? 0.35 : settings.pixelScale,
      fade: settings.fade !== false,
      duration: settings.duration || 1400,
      pixelDuration: settings.pixelDuration || 450,
      pattern: settings.pattern || 'random',
      randomness: settings.randomness || 0,
      easing: settings.easing || 'cubic-bezier(0.22, 1, 0.36, 1)',
      trigger: settings.trigger || 'hover',
      leaveTarget: settings.leaveTarget || null
    };

    var layers = container.querySelectorAll('.pixel-swap__layer');
    var desired = false, transitioning = false, animations = [], pixelEls = [], timer = 0, runSeq = 0;

    function setState(next) {
      for (var i = 0; i < layers.length; i += 1) layers[i].dataset.visible = String(i === (next ? 1 : 0));
    }

    function stopAnimations() {
      animations.forEach(function (a) { a.cancel(); });
      animations = [];
      pixelEls.forEach(function (el) { el.replaceChildren(); });
      if (timer) { window.clearTimeout(timer); timer = 0; }
    }

    function run(to) {
      if (transitioning) stopAnimations();
      // 打断场景可能留下多张未收尾的像素网格，先全部拆干净再建新的
      var stale = container.querySelectorAll('.pixel-swap__grid');
      for (var s = 0; s < stale.length; s += 1) stale[s].remove();
      runSeq += 1;
      var myRun = runSeq;

      var width = container.clientWidth, height = container.clientHeight;
      var grid = buildGrid({
        width: width, height: height,
        pixelSize: Math.max(8, Math.round(cfg.pixelSize)),
        gap: Math.max(0, Math.round(cfg.gap)),
        pattern: cfg.pattern, randomness: cfg.randomness
      });

      function finish() {
        setState(to);
        transitioning = false;
        if (timer) { window.clearTimeout(timer); timer = 0; }
        // 重活（cancel 上百条动画 + 拆掉整张像素网格）放到下一帧，
        // 让最后一批像素先在屏幕上真正合成完成，避免收尾时的顿挫
        var dying = animations.splice(0, animations.length);
        var deadEls = pixelEls.splice(0, pixelEls.length);
        var deadGrids = container.querySelectorAll('.pixel-swap__grid');
        window.requestAnimationFrame(function () {
          for (var i = 0; i < dying.length; i += 1) { try { dying[i].cancel(); } catch (e) { /* 已结算 */ } }
          for (var j = 0; j < deadEls.length; j += 1) deadEls[j].replaceChildren();
          for (var k = 0; k < deadGrids.length; k += 1) deadGrids[k].remove();
        });
      }

      // 收尾以「最后一条动画真正结束」为准；setTimeout 只作兜底，
      // 避免动画时钟与定时器错位导致最后一批像素被提前 cancel / 移除（观感上末尾顿一下）
      var finishOnce = function () {
        if (myRun !== runSeq) return; // 已被新的切换接管，不再收尾
        finish();
      };

      var source = layers[to ? 1 : 0];
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!source || !grid.pixels.length || reduce) { finish(); return; }

      transitioning = true;
      var gridEl = document.createElement('div');
      gridEl.className = 'pixel-swap__grid';
      gridEl.setAttribute('aria-hidden', 'true');
      pixelEls = [];

      var total = Math.max(200, cfg.duration);
      var pixelMs = clamp(cfg.pixelDuration, 60, total);
      var spread = Math.max(0, total - pixelMs);
      var endScale = coverScale(grid.size, grid.gap, cfg.pixelRadius);
      var kf = buildKeyframes({
        ease: makeEasing(cfg.easing),
        startScale: clamp(cfg.pixelScale, 0.05, 1) * endScale,
        endScale: endScale,
        spin: cfg.pixelSpin,
        fade: cfg.fade
      });

      grid.pixels.forEach(function (pixel) {
        var el = document.createElement('div');
        el.className = 'pixel-swap__pixel';
        el.style.left = pixel.left + 'px';
        el.style.top = pixel.top + 'px';
        el.style.width = grid.size + 'px';
        el.style.height = grid.size + 'px';
        el.style.borderRadius = clamp(cfg.pixelRadius, 0, 50) + '%';

        var content = document.createElement('div');
        content.className = 'pixel-swap__pixel-content';
        content.style.left = (-pixel.left) + 'px';
        content.style.top = (-pixel.top) + 'px';
        content.style.width = grid.width + 'px';
        content.style.height = grid.height + 'px';
        content.style.transformOrigin = (pixel.left + grid.size / 2) + 'px ' + (pixel.top + grid.size / 2) + 'px';

        var clone = source.cloneNode(true);
        clone.dataset.visible = 'true';
        content.appendChild(clone);
        el.appendChild(content);

        var timing = { duration: pixelMs, delay: pixel.offset * spread, easing: 'linear', fill: 'both' };
        animations.push(el.animate(kf.window, timing));
        animations.push(content.animate(kf.content, timing));

        pixelEls.push(el);
        gridEl.appendChild(el);
      });

      container.appendChild(gridEl);

      // 优先等动画自身结算完毕；setTimeout 延后一档作为兜底（finished 不可用时仍能收尾）
      var pending = [];
      animations.forEach(function (a) { if (a && a.finished) pending.push(a.finished); });
      if (pending.length && Promise.allSettled) {
        Promise.allSettled(pending).then(finishOnce, finishOnce);
      }
      timer = window.setTimeout(finishOnce, total + 220);
    }

    function request(next) {
      if (next === desired) return;
      desired = next;
      run(next);
    }

    if (cfg.trigger === 'hover') {
      // 还原时机：默认离开组件即还原；传了 leaveTarget 则离开更大区域才还原
      var leaveEl = cfg.leaveTarget || container;
      container.addEventListener('mouseenter', function () { request(true); });
      leaveEl.addEventListener('mouseleave', function () { request(false); });
      container.addEventListener('focus', function () { request(true); });
      container.addEventListener('blur', function () { request(false); });
      container.tabIndex = 0;
      // 触屏没有 hover：改为点按切换
      if (window.matchMedia('(hover: none)').matches) {
        container.addEventListener('click', function () { request(!desired); });
      }
    } else if (cfg.trigger === 'click') {
      container.addEventListener('click', function () { request(!desired); });
      container.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); request(!desired); }
      });
      container.setAttribute('role', 'button');
      container.tabIndex = 0;
    }

    setState(false);
    return { request: request };
  }

  window.PixelSwap = createPixelSwap;
})();
