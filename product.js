/* ================================================================
   EXCELDENT — 产品线详情页数据 + 渲染（依赖 page.js 提供的 SITE）
   product.html?line=fixed|removable|ortho
   注意：产品描述为演示占位文案，待公司资料确认后替换
   ================================================================ */
(function () {
  'use strict';

  /* 材质表：集中管理，items 用 mat 索引引用，避免重复维护文案 */
  var DATA = {
    fixed: {
      title: { en: 'Fixed Restorations', cn: '固定修复体' },
      lede: {
        en: 'High-precision fixed prosthetics designed for long-term performance and natural aesthetics.',
        cn: '高精度固定修复体，长久耐用，自然美观。'
      },
      mats: [
        { en: 'ZIRCONIA', cn: '氧化锆' },
        { en: 'ALL-CERAMIC', cn: '全瓷' },
        { en: 'METAL-CERAMIC', cn: '金属烤瓷' },
        { en: 'TITANIUM', cn: '纯钛' }
      ],
      items: [
        {
          mat: 0,
          name: { en: 'Zirconia Crowns & Bridges', cn: '氧化锆全瓷冠桥' },
          desc: {
            en: 'Full-contour zirconia from single units to multi-unit cases, balancing strength and translucency.',
            cn: '全形态氧化锆单冠至多单位长桥，兼顾强度与半透明美感。'
          }
        },
        {
          mat: 1,
          name: { en: 'All-Ceramic Veneers & Inlays', cn: '全瓷贴面与嵌体' },
          desc: {
            en: 'Pressed-ceramic veneers and inlays refining anterior shade, shape and alignment.',
            cn: '铸瓷贴面与嵌体，改善前牙颜色、形态与排列，呈现自然美学效果。'
          }
        },
        {
          mat: 2,
          name: { en: 'Porcelain-Fused-to-Metal', cn: '烤瓷熔附金属冠桥' },
          desc: {
            en: 'Metal substructure veneered with porcelain — a proven strength-to-aesthetics balance.',
            cn: '金属内冠外覆烤瓷，兼顾强度与美观的经典方案。'
          }
        },
        {
          mat: 3,
          name: { en: 'Titanium Implant Superstructures', cn: '纯钛种植上部结构' },
          desc: {
            en: 'Custom titanium abutments and screw-retained structures matched to the chosen implant system.',
            cn: '按种植系统定制的钛基台与螺丝固位结构，精准配合。'
          }
        },
        {
          mat: 0,
          name: { en: 'Zirconia Implant Restorations', cn: '氧化锆种植上部修复' },
          desc: {
            en: 'Implant-supported zirconia single units, splinted work and full-arch restorations.',
            cn: '种植支持的氧化锆单冠、联冠到全弓修复。'
          }
        }
      ]
    },

    removable: {
      title: { en: 'Removable Dentures', cn: '活动可摘义齿' },
      lede: {
        en: 'Comfortable, precise-fitting removable solutions for partial and full-arch restoration.',
        cn: '舒适、精准贴合的可摘义齿方案，覆盖局部与全口修复。'
      },
      mats: [
        { en: 'ACRYLIC RESIN', cn: '丙烯酸树脂' },
        { en: 'CoCr ALLOY', cn: '钴铬合金' },
        { en: 'FLEXIBLE NYLON', cn: '弹性树脂' },
        { en: 'Ti BAR + ACRYLIC', cn: '钛杆 + 树脂' }
      ],
      items: [
        {
          mat: 0,
          name: { en: 'Partial Acrylic Dentures', cn: '局部胶托' },
          desc: {
            en: 'Resin-based partial dentures with comfortable retention for everyday wear.',
            cn: '树脂基托局部义齿，固位舒适，适合日常佩戴。'
          }
        },
        {
          mat: 0,
          name: { en: 'Complete Dentures', cn: '全口义齿' },
          desc: {
            en: 'Complete dentures with careful occlusal design and esthetic tooth arrangement for edentulous patients.',
            cn: '为无牙颌患者精心设计咬合与排牙的全口义齿。'
          }
        },
        {
          mat: 1,
          name: { en: 'CoCr Frameworks & Metal Bases', cn: '钴铬合金支架与钢托' },
          desc: {
            en: 'Cast partial frameworks and tooth-shaded metal bases — lightweight, strong and comfortable.',
            cn: '局部铸造支架与齿色钢托，轻量高强、佩戴舒适。'
          }
        },
        {
          mat: 2,
          name: { en: 'Flexible Partial Dentures', cn: '弹性义齿（隐形义齿）' },
          desc: {
            en: 'Metal-clasp-free flexible bases designed for aesthetics and wearing comfort.',
            cn: '无金属卡环的弹性基托，美观舒适。'
          }
        },
        {
          mat: 3,
          name: { en: 'Implant Overdentures', cn: '种植覆盖义齿' },
          desc: {
            en: 'Bar-retained removable work balancing stability and access for hygiene.',
            cn: '覆盖植体杆的可摘修复，兼顾稳固与清洁便利。'
          }
        }
      ]
    },

    ortho: {
      title: { en: 'Orthodontic Products', cn: '正畸产品线' },
      lede: {
        en: 'Modern orthodontic appliances engineered for predictable tooth movement and patient comfort.',
        cn: '现代正畸产品，可预测的牙齿移动与舒适的佩戴体验。'
      },
      mats: [
        { en: 'THERMOPLASTIC', cn: '热塑性高分子' },
        { en: 'ACRYLIC RESIN', cn: '丙烯酸树脂' }
      ],
      items: [
        {
          mat: 0,
          name: { en: 'Clear Aligners', cn: '隐形矫治器' },
          desc: {
            en: 'Clear aligners designed for staged, predictable tooth movement and comfortable daily wear.',
            cn: '透明矫治器，分阶段可预测的牙齿移动，日常佩戴舒适。'
          }
        },
        {
          mat: 0,
          name: { en: 'Thermoplastic Retainers', cn: '压膜保持器' },
          desc: {
            en: 'Clear retainers keeping treatment results stable after active orthodontic therapy.',
            cn: '矫治后稳定维持治疗效果的透明保持器。'
          }
        },
        {
          mat: 1,
          name: { en: 'Occlusal Splints', cn: '咬合板' },
          desc: {
            en: 'Protective splints for bruxism and temporomandibular symptoms.',
            cn: '夜磨牙与颞颌关节症状的咬合保护装置。'
          }
        },
        {
          mat: 1,
          name: { en: 'Expansion Appliances', cn: '扩弓器' },
          desc: {
            en: 'Removable devices engineered for rapid palatal expansion.',
            cn: '快速腭扩展的活动矫治装置。'
          }
        }
      ]
    }
  };

  var params = new URLSearchParams(location.search);
  var key = params.get('line');
  var line = DATA[key];
  if (!line) {
    // 未知参数 → 回首页，不留白页
    location.replace('index.html');
    return;
  }

  var lang = window.SITE.getLang();
  var pad = function (n) { return n < 10 ? '0' + n : '' + n; };

  var renderItems = function () {
    var ul = document.getElementById('pd-items');
    ul.innerHTML = '';
    line.items.forEach(function (item, i) {
      var mat = line.mats[item.mat];
      var li = document.createElement('li');
      li.className = 'pd-item';

      /* 图片占位：背景统一深蓝，材质名压在其上。
         换真图时把整块 .pd-ph 替换成 <img> 即可，其余结构不用动。 */
      var ph = document.createElement('div');
      ph.className = 'pd-ph';
      ph.setAttribute('aria-hidden', 'true');
      var phTag = document.createElement('span');
      // 仅中文界面显示：英文版不出现"待补"类内部标注
      phTag.className = 'ph-tag cn-only';
      phTag.textContent = '待补';
      var phMark = document.createElement('span');
      phMark.className = 'ph-mark';
      phMark.textContent = mat[lang];
      ph.appendChild(phTag);
      ph.appendChild(phMark);

      var body = document.createElement('div');
      body.className = 'pd-body';

      var num = document.createElement('span');
      num.className = 'pd-item-num';
      num.textContent = pad(i + 1);

      var h3 = document.createElement('h3');
      h3.className = 'pd-item-title';
      h3.textContent = item.name[lang];

      /* 材质徽章：独立于图片存在 —— 将来图片换成实拍后，材质信息仍然保留 */
      var badge = document.createElement('span');
      badge.className = 'mat-badge';
      badge.textContent = mat[lang];

      var p = document.createElement('p');
      p.className = 'pd-item-desc';
      p.textContent = item.desc[lang];

      var note = document.createElement('span');
      // 仅中文界面显示（cn-only）：对外英文版不出现"待补充"类内部标注
      note.className = 'pd-item-note cn-only';
      note.textContent = '图片与详细参数 · 待补充';

      body.appendChild(num);
      body.appendChild(h3);
      body.appendChild(badge);
      body.appendChild(p);
      body.appendChild(note);

      li.appendChild(ph);
      li.appendChild(body);
      ul.appendChild(li);
    });
  };

  var applyLine = function () {
    document.getElementById('pd-title').textContent = line.title[lang];
    document.getElementById('pd-lede').textContent = line.lede[lang];
    renderItems();
  };

  // 面包屑末段挂在静态 data-en/data-cn 体系里，随全局切换
  var crumbLine = document.getElementById('pd-crumb-line');
  crumbLine.setAttribute('data-en', line.title.en);
  crumbLine.setAttribute('data-cn', line.title.cn);
  crumbLine.textContent = line.title[lang];

  applyLine();
  window.SITE.setTitle(
    line.title.en + ' — EXCELDENT Dental Lab',
    line.title.cn + ' — 优里卡齿科'
  );
  window.SITE.onLang(function (next) {
    lang = next;
    applyLine();
  });
})();
