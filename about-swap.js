/* ================================================================
   about.html — 版头像素切换矩阵（关于我们 ⇄ 公司简介正文）
   依赖：page.js（window.SITE）、pixelswap.js（window.PixelSwap）
   两层内容集中在此维护，语言切换时按 SITE.onLang 重刷
   ================================================================ */
(function () {
  'use strict';

  // 两层文案：第一层＝居中大字「关于我们」；第二层＝公司简介正文（不出现标题字样）
  var C = {
    en: {
      eyebrow1: 'EXCELDENT · ABOUT',
      title: 'About Us',
      sub: 'A high-tech enterprise dedicated to the digital manufacturing of custom dental prosthetics.',
      eyebrow2: 'EXCELDENT · PROFILE',
      p1: 'EXCELDENT was founded in <b>2019</b> and is located in the Kangdelai International Medical Industrial Park, Jinwan District, Zhuhai, Guangdong. The facility covers more than <b>10,000 ㎡</b> and is home to over <b>800</b> professionals.',
      p2: 'The company focuses on the digital and intelligent manufacturing of high-end custom dental prosthetics, with three product lines: Fixed Restorations, Removable Dentures, and Orthodontic products. Its products serve the United States, Europe and other international markets.',
      mission: 'Our mission: Customer-Oriented and Quality-Focused.'
    },
    cn: {
      eyebrow1: 'EXCELDENT · ABOUT',
      title: '关于我们',
      sub: '一家专注数字化定制义齿智造的高新技术企业。',
      eyebrow2: 'EXCELDENT · PROFILE',
      p1: '珠海优里卡齿科技术开发有限公司（EXCELDENT）成立于 <b>2019</b> 年，位于广东省珠海市金湾区康德莱国际医疗产业园，园区面积 <b>10,000+</b> 平方米，拥有 <b>800+</b> 名员工。',
      p2: '公司专注于高端定制义齿的数字化智能制造，主营固定修复体、活动可摘义齿与正畸三大产品线，产品服务美国、欧洲等国际市场。',
      mission: '企业使命：以客户为导向，以质量为核心。'
    }
  };

  var swap = document.getElementById('about-swap');
  if (!swap) return;

  var layer1 = document.getElementById('as-layer-1');
  var layer2 = document.getElementById('as-layer-2');
  var hero = swap.closest('.pd-hero') || swap;

  function markup(lang) {
    var t = C[lang] || C.en;
    return {
      one:
        '<div class="as-face as-face--center">' +
          '<div class="as-eyebrow">' + t.eyebrow1 + '</div>' +
          '<h1 class="as-title">' + t.title + '</h1>' +
          '<p class="as-sub">' + t.sub + '</p>' +
        '</div>',
      two:
        '<div class="as-face as-face--profile">' +
          '<div class="as-grid">' +
            '<div>' +
              '<div class="as-eyebrow">' + t.eyebrow2 + '</div>' +
              '<p class="as-p">' + t.p1 + '</p>' +
              '<p class="as-p">' + t.p2 + '</p>' +
              '<p class="as-p as-p--mission">' + t.mission + '</p>' +
            '</div>' +
            '<div class="as-mark" aria-hidden="true">ED</div>' +
          '</div>' +
        '</div>'
    };
  }

  function render(lang) {
    var m = markup(lang);
    layer1.innerHTML = m.one;
    layer2.innerHTML = m.two;
  }

  render(window.SITE.getLang());

  window.PixelSwap(swap, {
    pixelSize: 76,
    gap: 0,
    pixelRadius: 0,
    pixelSpin: 0,
    pixelScale: 0.35,
    duration: 1300,
    pixelDuration: 480,
    pattern: 'random',
    randomness: 0,
    fade: true,
    trigger: 'hover',
    // 鼠标移出矩阵但仍在版头内时保持「公司简介」，离开整个版头才还原
    leaveTarget: hero
  });

  window.SITE.onLang(render);
})();
