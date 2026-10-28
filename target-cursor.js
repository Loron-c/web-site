/* =============================================================================
   TargetCursor · 克制版 —— EXCELDENT 官网定制光标
   -----------------------------------------------------------------------------
   原始组件：React Bits "Target Cursor"（React 版）
   移植说明：改为原生 JS，未使用 GSAP —— 原版本身就是纯 JS 手写弹簧物理 + rAF，
             只是被各注册站归在了 GSAP 类目下。本文件零外部依赖，站点仍 100% 自包含。
   与原始组件的差异（刻意为之）：
     1. hideDefaultCursor = false —— 保留系统光标，不接管点击反馈
     2. onlyOnTarget = true —— 仅悬停可交互元素时浮现四角框，其余时间完全不可见
                               （原版无此开关，只能「全站替换」或「不用」）
     3. spinDuration = 0 —— 去掉持续自旋，避免 rAF 常驻带来的无谓开销
     4. mix-blend-mode 关闭 —— 品牌橙经 difference 混合会被背景反相，必须走 normal
   ============================================================================= */
(function () {
  'use strict';

  /* ---- 环境门禁 ---- */
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  // 触屏 / 无精确指针（手机、平板）→ 不启用
  if (!fine.matches) return;
  // 系统开启「减少动态效果」→ 不启用（与站点既有降级策略保持一致）
  if (calm.matches) return;

  /* ---- 参数 ---- */
  var CFG = {
    // 锁定范围：链接与按钮。
    // 排除两类「整块可点」的卡片级链接——给它们套框会横跨标题排版，观感像错位提示框：
    //   .product-card —— 首页产品大卡（自带 hover 描边）
    //   .pd-item-link —— 关于页 What We Make 卡里的 "View product line"（被拉伸成 309×48 的宽块）
    // 通用豁免：任意元素加 data-cursor-ignore 属性（自身或祖先）即可不参与锁定
    targetSelector: 'a:not(.product-card):not(.pd-item-link), button',
    color: '#F26B3A',
    size: 30,          // 自由态方块半径（克制版下不可见，仅作展开起点）
    cornerSize: 10,    // 四角长度
    thickness: 2,      // 描边粗细
    padding: 5,        // 锁定框相对目标外扩
    hoverDuration: 0.2,
    clickEffect: true  // 按下时四角轻微内收
  };

  var QUARTER = Math.PI / 2;
  var CORNER_ANGLES = [0, 90, 180, 270];

  /* 弹簧积分：原版的二阶 verlet，分两步迭代保证稳定 */
  function spring(s, goal, stiffness, damping, dt) {
    var steps = 2, h = dt / steps;
    for (var i = 0; i < steps; i++) {
      s.v += (stiffness * (goal - s.x) - damping * s.v) * h;
      s.x += s.v * h;
    }
  }

  /* ---- DOM ---- */
  var root = document.createElement('div');
  root.className = 'tc-root';
  root.setAttribute('aria-hidden', 'true');
  root.style.cssText =
    'position:fixed;inset:0;z-index:9999;pointer-events:none;opacity:0;' +
    '--tc-color:' + CFG.color + ';';

  var corners = [];
  for (var i = 0; i < 4; i++) {
    var c = document.createElement('span');
    c.style.cssText =
      'position:absolute;top:0;left:0;box-sizing:border-box;transform-origin:top left;' +
      'border-style:solid;border-color:var(--tc-color);will-change:transform;';
    root.appendChild(c);
    corners.push(c);
  }

  var label = document.createElement('span');
  label.style.cssText =
    'position:absolute;top:0;left:0;font:600 12px/1 -apple-system,"Segoe UI","Microsoft YaHei",sans-serif;' +
    'white-space:nowrap;opacity:0;color:var(--tc-color);will-change:transform,opacity;';
  root.appendChild(label);
  document.body.appendChild(root);

  /* ---- 状态 ---- */
  var pointer = { x: 0, y: 0, inside: false, seen: false, pressed: false };
  var cx = { x: 0, v: 0 }, cy = { x: 0, v: 0 };
  var hw = { x: 0, v: 0 }, hh = { x: 0, v: 0 };
  var rad = { x: 0, v: 0 }, turn = { x: 0, v: 0 };
  var lock = { x: 0, v: 0 }, press = { x: 0, v: 0 }, show = { x: 0, v: 0 };
  var target = null, targetRadius = 0, quarter = 0;
  var raf = 0, last = 0, lastLabel = '';

  function findTarget(x, y, el) {
    var node = el || document.elementFromPoint(x, y);
    var found = (node && node.closest && node.closest(CFG.targetSelector)) || null;
    // data-cursor-ignore 豁免（自身或祖先带此属性均不锁定）
    if (found && found.closest('[data-cursor-ignore]')) return null;
    return found;
  }

  function lockOn(next) {
    if (next === target) return;
    target = next;
    if (target) {
      quarter = Math.round(turn.x / QUARTER);
      targetRadius = parseFloat(getComputedStyle(target).borderTopLeftRadius) || 0;
    }
  }

  function frame(now) {
    raf = 0;
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;

    if (target && !target.isConnected) lockOn(null);
    var rect = target ? target.getBoundingClientRect() : null;
    var locked = !!rect && pointer.inside;

    var snapW = 4.6 / CFG.hoverDuration;
    var snapK = snapW * snapW;
    var snapC = 2 * 0.62 * snapW;

    // 只在锁定目标时显现，其余时间 opacity 归零
    spring(show, locked ? 1 : 0, 260, 32, dt);
    spring(lock, locked ? 1 : 0, snapK, 2 * snapW, dt);
    spring(press, pointer.pressed && CFG.clickEffect ? 1 : 0, 900, 40, dt);

    var goalX = pointer.x, goalY = pointer.y;
    var goalW = CFG.size / 2, goalH = CFG.size / 2;
    var goalR = Math.min(2, CFG.cornerSize / 4);

    if (locked) {
      var mx = rect.left + rect.width / 2;
      var my = rect.top + rect.height / 2;
      goalX = mx;                       // 克制版不做视差偏移（parallaxOn = false）
      goalY = my;
      var odd = Math.abs(quarter) % 2 === 1;
      var w = rect.width / 2 + CFG.padding;
      var h = rect.height / 2 + CFG.padding;
      goalW = odd ? h : w;
      goalH = odd ? w : h;
      goalR = Math.min(targetRadius + Math.max(0, CFG.padding), CFG.cornerSize);
    }

    if (!pointer.seen) {
      cx.x = goalX; cy.x = goalY; hw.x = goalW; hh.x = goalH;
      pointer.seen = true;
    }

    spring(cx, goalX, snapK, snapC, dt);
    spring(cy, goalY, snapK, snapC, dt);
    spring(hw, goalW, snapK, snapC, dt);
    spring(hh, goalH, snapK, snapC, dt);
    spring(rad, goalR, snapK, 2 * snapW, dt);
    spring(turn, quarter * QUARTER, snapK, snapC, dt);

    var squeeze = 1 - press.x * 0.14;
    var w2 = Math.max(0, hw.x) * squeeze;
    var h2 = Math.max(0, hh.x) * squeeze;
    var local = [[-w2, -h2], [w2, -h2], [w2, h2], [-w2, h2]];
    var r = Math.max(0, Math.min(rad.x, CFG.cornerSize));
    var cos = Math.cos(turn.x), sin = Math.sin(turn.x);
    var deg = (turn.x * 180) / Math.PI;
    var left = Infinity, top = Infinity;

    for (var i = 0; i < 4; i++) {
      var lx = local[i][0], ly = local[i][1];
      var x = cx.x + lx * cos - ly * sin;
      var y = cy.x + lx * sin + ly * cos;
      if (x < left) left = x;
      if (y < top) top = y;
      corners[i].style.transform =
        'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0) rotate(' +
        (CORNER_ANGLES[i] + deg).toFixed(2) + 'deg)';
      corners[i].style.width = CFG.cornerSize + 'px';
      corners[i].style.height = CFG.cornerSize + 'px';
      corners[i].style.borderWidth = CFG.thickness + 'px 0 0 ' + CFG.thickness + 'px';
      corners[i].style.borderTopLeftRadius = r.toFixed(2) + 'px';
    }

    // 标签：仅当元素带 data-cursor-label 时出现（站内暂未设置该属性，故默认不显示）
    var text = target ? target.getAttribute('data-cursor-label') || '' : '';
    if (text && text !== lastLabel) { label.textContent = text; lastLabel = text; }
    var shown = text ? Math.max(0, Math.min(1, lock.x)) : 0;
    label.style.transform =
      'translate3d(' + left.toFixed(2) + 'px,' + (top - 8).toFixed(2) + 'px,0) translateY(-100%) translateY(' +
      ((1 - shown) * 4).toFixed(2) + 'px)';
    label.style.opacity = shown.toFixed(3);

    root.style.opacity = Math.max(0, Math.min(1, show.x)).toFixed(3);

    // 静止判定：不锁定时完全停下 rAF，不留常驻循环
    var settled =
      show.x < 0.002 && Math.abs(show.v) < 0.002 &&
      Math.abs(lock.x) < 0.002 && Math.abs(press.x) < 0.002 &&
      Math.abs(cx.v) + Math.abs(cy.v) + Math.abs(hw.v) + Math.abs(hh.v) < 0.01;
    if (locked || !settled) raf = requestAnimationFrame(frame);
    else last = 0;
  }

  function wake() { if (!raf) raf = requestAnimationFrame(frame); }

  function onMove(e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.inside = true;
    lockOn(findTarget(pointer.x, pointer.y, e.target));
    wake();
  }
  function onDown(e) { if (e.pointerType && e.pointerType !== 'mouse') return; pointer.pressed = true; wake(); }
  function onUp() { pointer.pressed = false; wake(); }
  function onLeave() { pointer.inside = false; pointer.pressed = false; lockOn(null); wake(); }
  function onScroll() { if (!pointer.inside) return; lockOn(findTarget(pointer.x, pointer.y)); wake(); }

  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onDown, { passive: true });
  window.addEventListener('pointerup', onUp, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true, capture: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  window.addEventListener('blur', onLeave);

  // 指针能力变化（如接拔鼠标）时重新判断
  fine.addEventListener('change', function () { if (!fine.matches) onLeave(); });
})();
