/* ================================================================
   EXCELDENT — 内页通用脚本（语言切换 / 移动菜单 / 顶栏 / 回顶）
   被 about.html、product.html 共用；product.js 通过 SITE.onLang 挂自己的重渲染
   ================================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  /* head 里的内联脚本已把 data-lang 恢复成上次的偏好，这里直接以属性为准 */
  var lang = root.getAttribute('data-lang') === 'cn' ? 'cn' : 'en';
  var hooks = [];

  /* ---- 语言偏好持久化 ----
     file:// 协议、隐私模式、禁用 Cookie 的场景下 localStorage 可能直接抛异常，
     必须全部吞掉：持久化是增强项，绝不能因为它让整站脚本崩掉。 */
  var STORE_KEY = 'exceldent-lang';
  var saveLang = function (v) {
    try { localStorage.setItem(STORE_KEY, v); } catch (e) { /* 存不了就算了，不影响浏览 */ }
  };

  var applyStatic = function (next) {
    document.querySelectorAll('[data-en][data-cn]').forEach(function (el) {
      var t = el.getAttribute('data-' + next);
      if (t != null) el.textContent = t;
    });
    document.querySelectorAll('.lang-opt').forEach(function (o) {
      o.classList.toggle('lang-active', o.dataset.langOpt === next);
    });
  };

  var setLang = function (next) {
    lang = next;
    root.setAttribute('data-lang', next);
    root.setAttribute('lang', next === 'cn' ? 'zh-CN' : 'en');
    saveLang(next);
    applyStatic(next);
    hooks.forEach(function (fn) { fn(next); });
  };

  /* 恢复：head 内联脚本已设好 data-lang，但页面 HTML 里的文本仍是英文，
     这里统一刷一遍，让静态文案与 data-lang 对齐（动态内容由后续脚本按 lang 自行渲染）。 */
  applyStatic(lang);

  window.SITE = {
    getLang: function () { return lang; },
    setLang: setLang,
    onLang: function (fn) { hooks.push(fn); },
    // 页面标题跟随语言切换
    setTitle: function (en, cn) {
      document.title = lang === 'cn' ? cn : en;
      hooks.push(function (l) { document.title = l === 'cn' ? cn : en; });
    }
  };

  var langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      setLang(lang === 'en' ? 'cn' : 'en');
    });
  }

  var burger = document.getElementById('nav-burger');
  var navLinks = document.querySelector('.nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      document.body.classList.toggle('menu-open', open);
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('is-open');
        document.body.classList.remove('menu-open');
      }
    });
  }

  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  var topBtn = document.getElementById('footer-top-btn');
  if (topBtn) {
    topBtn.addEventListener('click', function () {
      var smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
    });
  }
})();
