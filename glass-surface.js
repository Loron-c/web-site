/* ================================================================
   GlassSurface 原生 JS 移植（源自 React Bits，仅取 SVG 滤镜折射路径）
   - Chrome / Edge：backdrop-filter 引用 SVG 位移滤镜，边缘真实折射背后内容
   - Safari / Firefox：自动降级为磨砂玻璃（.glass-fallback）
   用法：元素加 data-glass 属性即可，其余由本脚本接管
   ================================================================ */
(function () {
  'use strict';

  /* 玻璃参数（对应 React 版 props，按徽章场景定档） */
  var CFG = {
    distortionScale: -180,   /* 边缘弯曲强度（负值向内收） */
    redOffset: 0,            /* RGB 三通道微量错位 → 边缘彩色色散 */
    greenOffset: 10,
    blueOffset: 20,
    borderWidth: 0.07,       /* 折射边宽（短边占比） */
    blur: 11,                /* 折射边到平静中心的过渡柔度 */
    brightness: 50,          /* 中心亮度 50% = 不畸变 */
    opacity: 0.93,           /* 中心保持背后原样的程度 */
    displace: 0.5,           /* 轻磨砂 */
    saturation: 1.2,         /* 透过玻璃的饱和度 */
    xChannel: 'R', yChannel: 'G',
    mixBlendMode: 'difference'
  };
  var UID = 0;

  function supportsSVGFilters() {
    if (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) return false;
    if (/Firefox/.test(navigator.userAgent)) return false;
    var div = document.createElement('div');
    div.style.backdropFilter = 'url(#glass-probe)';
    return div.style.backdropFilter !== '';
  }

  /* 生成位移贴图：红/蓝双向渐变按 difference 叠加，中心亮块给出「平静区」 */
  function displacementMap(w, h) {
    var edge = Math.min(w, h) * CFG.borderWidth * 0.5;
    var svg =
      '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
          '<linearGradient id="gr" x1="100%" y1="0%" x2="0%" y2="0%">' +
            '<stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="red"/>' +
          '</linearGradient>' +
          '<linearGradient id="gb" x1="0%" y1="0%" x2="0%" y2="100%">' +
            '<stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="blue"/>' +
          '</linearGradient>' +
          '<filter id="soft" filterUnits="userSpaceOnUse" x="0" y="0" width="' + w + '" height="' + h + '" color-interpolation-filters="sRGB">' +
            '<feGaussianBlur stdDeviation="' + CFG.blur + '"/>' +
          '</filter>' +
        '</defs>' +
        '<rect width="' + w + '" height="' + h + '" fill="black"/>' +
        '<rect width="' + w + '" height="' + h + '" rx="999" fill="url(#gr)"/>' +
        '<rect width="' + w + '" height="' + h + '" rx="999" fill="url(#gb)" style="mix-blend-mode:' + CFG.mixBlendMode + '"/>' +
        '<rect x="' + edge + '" y="' + edge + '" width="' + (w - edge * 2) + '" height="' + (h - edge * 2) + '" rx="999" ' +
          'fill="hsl(0 0% ' + CFG.brightness + '% / ' + CFG.opacity + ')" filter="url(#soft)"/>' +
      '</svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  function buildFilterSVG(id) {
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'glass-defs');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');

    var filter = document.createElementNS(NS, 'filter');
    filter.setAttribute('id', id);
    filter.setAttribute('colorInterpolationFilters', 'sRGB');
    filter.setAttribute('x', '0%');
    filter.setAttribute('y', '0%');
    filter.setAttribute('width', '100%');
    filter.setAttribute('height', '100%');

    var feImage = document.createElementNS(NS, 'feImage');
    feImage.setAttribute('x', '0'); feImage.setAttribute('y', '0');
    feImage.setAttribute('width', '100%'); feImage.setAttribute('height', '100%');
    feImage.setAttribute('preserveAspectRatio', 'none');
    feImage.setAttribute('result', 'map');

    /* 三通道各自位移后重组（R/G/B），模拟玻璃色散 */
    var channels = [
      { disp: 'dispR', mat: '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0', scale: CFG.distortionScale + CFG.redOffset },
      { disp: 'dispG', mat: '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0', scale: CFG.distortionScale + CFG.greenOffset },
      { disp: 'dispB', mat: '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0', scale: CFG.distortionScale + CFG.blueOffset }
    ];
    channels.forEach(function (c, i) {
      var dm = document.createElementNS(NS, 'feDisplacementMap');
      dm.setAttribute('in', 'SourceGraphic');
      dm.setAttribute('in2', 'map');
      dm.setAttribute('scale', String(c.scale));
      dm.setAttribute('xChannelSelector', CFG.xChannel);
      dm.setAttribute('yChannelSelector', CFG.yChannel);
      dm.setAttribute('result', c.disp);
      var cm = document.createElementNS(NS, 'feColorMatrix');
      cm.setAttribute('in', c.disp);
      cm.setAttribute('type', 'matrix');
      cm.setAttribute('values', c.mat);
      cm.setAttribute('result', 'ch' + i);
      filter.appendChild(dm);
      filter.appendChild(cm);
    });

    var b1 = document.createElementNS(NS, 'feBlend');
    b1.setAttribute('in', 'ch0'); b1.setAttribute('in2', 'ch1');
    b1.setAttribute('mode', 'screen'); b1.setAttribute('result', 'rg');
    var b2 = document.createElementNS(NS, 'feBlend');
    b2.setAttribute('in', 'rg'); b2.setAttribute('in2', 'ch2');
    b2.setAttribute('mode', 'screen'); b2.setAttribute('result', 'out');
    var blur = document.createElementNS(NS, 'feGaussianBlur');
    blur.setAttribute('in', 'out');
    blur.setAttribute('stdDeviation', String(CFG.displace));

    filter.appendChild(b1);
    filter.appendChild(b2);
    filter.appendChild(blur);
    svg.appendChild(filter);
    return { svg: svg, feImage: feImage };
  }

  function enhance(el) {
    var supported = supportsSVGFilters();
    if (!supported) { el.classList.add('glass-fallback'); return; }

    UID += 1;
    var id = 'glass-fx-' + UID;
    var built = buildFilterSVG(id);
    document.body.appendChild(built.svg);

    var feImage = built.feImage;
    var rect = el.getBoundingClientRect();
    feImage.setAttribute('href', displacementMap(Math.max(2, Math.round(rect.width)), Math.max(2, Math.round(rect.height))));
    el.style.backdropFilter = 'url(#' + id + ') saturate(' + CFG.saturation + ')';
    el.style.webkitBackdropFilter = 'url(#' + id + ') saturate(' + CFG.saturation + ')';
    el.style.setProperty('--glass-frost', String(CFG.backgroundOpacity));
    el.classList.add('glass-on');   /* 接管后去掉旧徽章的边框/底色 */

    var raf = 0;
    var ro = new ResizeObserver(function () {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return;
        feImage.setAttribute('href', displacementMap(Math.round(r.width), Math.round(r.height)));
      });
    });
    ro.observe(el);
  }

  function init() {
    var nodes = document.querySelectorAll('[data-glass]');
    if (!nodes.length) return;
    for (var i = 0; i < nodes.length; i++) enhance(nodes[i]);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
