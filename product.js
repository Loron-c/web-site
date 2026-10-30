/* ================================================================
   EXCELDENT — 产品页数据 + 渲染（依赖 page.js 提供的 SITE）
   product.html?line=fixed|removable|ortho
   数据来源：公司旧站 hknorthstar.com 产品目录（6 类 28 项）核对整理，
   并按对标公司目录增删后共 30 项；参数缺失处统一标注「待补充」
   ================================================================ */
(function () {
  'use strict';

  /* ---------- 产品线（?line= 参数对应） ---------- */
  var LINES = {
    fixed: {
      title: { en: 'Fixed Restorations', cn: '固定修复体' },
      lede: {
        en: 'Full ceramic, PFM and implant-supported restorations — engineered for long-term performance and natural aesthetics.',
        cn: '全瓷、烤瓷与种植上部修复，兼顾长期性能与自然美观。'
      }
    },
    removable: {
      title: { en: 'Removable Dentures', cn: '活动可摘义齿' },
      lede: {
        en: 'Frameworks, dentures and precision attachments for partial and full-arch cases.',
        cn: '支架、义齿与精密附件，覆盖局部与全口缺失修复。'
      }
    },
    ortho: {
      title: { en: 'Orthodontic', cn: '正畸产品线' },
      lede: {
        en: 'Functional appliances, retainers and protective guards for everyday orthodontic practice.',
        cn: '功能矫治器、保持器与防护装置，覆盖日常正畸所需。'
      }
    }
  };
  var LINE_ORDER = ['fixed', 'removable', 'ortho'];

  /* ---------- 子类（分组） ---------- */
  var GROUPS = {
    ceramic: {
      en: 'Full Ceramic', cn: '全瓷系列', line: 'fixed',
      dEn: 'Zirconia and glass-ceramic restorations where strength meets translucency.',
      dCn: '氧化锆与玻璃陶瓷修复体，在强度与通透美感之间取平衡。'
    },
    pfm: {
      en: 'PFM', cn: '烤瓷系列', line: 'fixed',
      dEn: 'Metal substructures veneered with porcelain — the proven workhorse.',
      dCn: '金属内冠外覆烤瓷，临床验证最充分的经典方案。'
    },
    print: {
      en: '3D Printing', cn: '3D 打印', line: 'fixed',
      dEn: 'Printed directly to shape — a mill-free route to definitive restorations.',
      dCn: '直接打印成形，不经过切削的修复体路径。'
    },
    implant: {
      en: 'Implant', cn: '种植修复', line: 'fixed',
      dEn: 'Implant-supported structures from single abutments to full-arch frameworks.',
      dCn: '从个性化基台到全口支架的种植上部结构。'
    },
    removable: {
      en: 'Removable Restoration', cn: '活动修复', line: 'removable',
      dEn: 'Frameworks and dentures built on materials that stay comfortable.',
      dCn: '以材料性能为基础的支架与义齿，兼顾强度与佩戴舒适。'
    },
    attachment: {
      en: 'Precision Attachment', cn: '精密附件', line: 'removable',
      dEn: 'Precision attachments that decide how a removable case feels.',
      dCn: '决定可摘修复体戴用感受的精密附件系统。'
    },
    ortho: {
      en: 'Orthodontic Appliance', cn: '矫正装置', line: 'ortho',
      dEn: 'Functional and removable appliances for everyday orthodontic practice.',
      dCn: '功能矫治与活动装置，覆盖日常正畸与防护需求。'
    }
  };
  var GROUP_ORDER = ['ceramic', 'pfm', 'print', 'implant', 'removable', 'attachment', 'ortho'];

  /* ---------- 浮层章节标题 ---------- */
  var SEC = {
    brand:  ['品牌介绍', 'Brand'],
    scope:  ['适用范围', 'Indications'],
    plan:   ['种植解决方案', 'Treatment Planning'],
    feat:   ['产品特点', 'Features'],
    spec:   ['产品标准', 'Specifications'],
    flow:   ['工艺流程', 'Workflow'],
    clinic: ['临床建议', 'Clinical Notes']
  };

  /* ---------- 产品数据（30 项） ----------
     secs 章节正文目前以中文为主；英文界面下浮层顶部有提示条。
     「参数待补充」= 资料尚未提供，不做臆测填写。 */
  var P = [
    /* ============ 全瓷系列 ============ */
    { g: 'ceramic', id: 'wieland', cn: '威兰德全瓷', en: 'Wieland Zirconia',
      oCn: '氧化锆单冠至 6 颗长桥，强度约 1400MPa，通透性佳。',
      oEn: 'Zirconia single units to 6-unit bridges, ~1400MPa, high translucency.',
      chips: [['氧化锆', 'Zirconia'], ['单冠 · 长桥', 'Crown · Bridge'], ['全锆冠 · 嵌体', 'Full-zirconia · Inlay'], ['≈1400MPa', '≈1400MPa']],
      secs: [
        ['scope', ['单冠；长桥——允许 48mm 长度桥体，一般可覆盖 6 颗牙位', '单嵌体，也可做嵌体桥、全锆冠、全锆桥']],
        ['feat', ['弯曲强度高达 1400MPa', '高纯度原料，通透性极佳；液态等静压专利工艺，生物相容性安全、可靠、稳定', '内冠涂刷技术，满足不同内冠颜色需要']],
        ['spec', ['牙冠材质：氧化锆', '牙冠厚度：0.4–0.7mm', '牙冠强度：约 1400MPa']]
      ] },

    { g: 'ceramic', id: 'ablaze', cn: 'Ablaze 全瓷', en: 'Ablaze Zirconia',
      oCn: '强度约 1220MPa，8 类内冠色，前牙内冠最薄可至 0.3mm。',
      oEn: '~1220MPa with 8 dentin shades; anterior copings down to 0.3mm.',
      chips: [['氧化锆', 'Zirconia'], ['8 类内冠色', '8 Shade Options'], ['前牙内冠 0.3mm', '0.3mm Coping'], ['≈1220MPa', '≈1220MPa']],
      secs: [
        ['scope', ['单冠；长桥——允许 48mm 长度桥体，一般可覆盖 6 颗牙位', '单嵌体，也可做嵌体桥、全锆冠、全锆桥']],
        ['feat', ['超高强度、边缘密合度与美学效果兼具', '8 类内冠颜色，专利染色技术，颜色呈现完整', '1220MPa 高强度，通透性佳', '前牙内冠最薄至 0.3mm，配套精密切削，精密度高']],
        ['spec', ['牙冠材质：氧化锆', '牙冠厚度：0.4–0.7mm', '牙冠强度：1220MPa']],
        ['clinic', ['全瓷牙按常规标准制备', '取模时边缘线需清晰可见', '建议使用树脂类粘接剂粘接', '如需调磨，用精细金刚砂车针点磨并充分水冷，最后抛光上釉']]
      ] },

    { g: 'ceramic', id: 'emax', cn: '易美全瓷', en: 'IPS e.max',
      oCn: '玻璃陶瓷底冠，前牙美学修复首选，贴面最薄可至 0.2mm。',
      oEn: 'Lithium disilicate base — first choice for esthetic anterior work; veneers down to 0.2mm.',
      chips: [['玻璃陶瓷', 'Glass-ceramic'], ['前牙美学', 'Anterior Esthetics'], ['贴面 0.2mm', 'Veneer 0.2mm'], ['3 颗以内桥体', 'Up to 3-unit']],
      secs: [
        ['scope', ['单冠；3 颗以内桥体，范围局限于小臼齿，缺失位只有一颗，不可作悬臂式牙桥', '贴面：传统厚度 0.6mm，超薄贴面最薄可至 0.2mm；也可做嵌体']],
        ['feat', ['玻璃陶瓷类底冠材料', '高度美学与光学效果，美学修复首选', '粘接效果特佳，对人体无副作用，与自然牙融合度高']],
        ['spec', ['牙冠材质：玻璃陶瓷（二硅酸锂）', '贴面厚度：0.2–0.6mm', '牙冠强度：参数待补充']]
      ] },

    { g: 'ceramic', id: 'lava', cn: 'LAVA 全瓷', en: 'Lava Zirconia',
      oCn: '强度约 1440MPa，适配长桥、嵌体与全锆冠。',
      oEn: '~1440MPa; long-span bridges, inlays and full-zirconia crowns.',
      chips: [['氧化锆', 'Zirconia'], ['长桥', 'Long-span Bridge'], ['8 类内冠色', '8 Shade Options'], ['≈1440MPa', '≈1440MPa']],
      secs: [
        ['scope', ['单冠；长桥——允许 48mm 长度桥体，一般可覆盖 6 颗牙位', '单嵌体，也可做嵌体桥、全锆冠、全锆桥']],
        ['feat', ['超高强度、边缘密合度与美学效果兼具', '8 类内冠颜色，专利染色技术', '1440MPa 高强度，通透性佳', '前牙内冠最薄至 0.3mm，配套精密切削']],
        ['spec', ['牙冠材质：氧化锆', '牙冠厚度：0.4–0.7mm', '牙冠强度：约 1440MPa']]
      ] },

    /* ============ 烤瓷系列 ============ */
    { g: 'pfm', id: 'laser', cn: '生物镭射烤瓷', en: 'Laser Print PFM',
      oCn: '选择性激光熔化钴铬内冠，致密光洁，避免铸造缺陷。',
      oEn: 'Laser-sintered CoCr copings — dense, clean, no casting defects.',
      chips: [['钴铬', 'CoCr'], ['激光熔化', 'Laser Melting'], ['内壳 0.3mm', 'Coping 0.3mm'], ['非铸造', 'Non-cast']],
      secs: [
        ['brand', ['采用选择性激光熔化（CAD/CAM）技术，由 CAM 电脑控制激光，逐层堆积熔化金属粉末直接成形金属底冠，再烧结烤瓷而成。']],
        ['feat', ['内冠不是传统金属铸造工艺制作', '精确度极高，底冠光洁致密，更利于口腔安全健康']],
        ['spec', ['钴铬合金内冠 + 烤瓷层', '金属内壳厚度 0.3mm', '唇颊侧烤瓷饰面，舌侧露 2–3mm 宽微细金属边', '也可选择全包瓷、全金属脚边或瓷肩台设计']]
      ] },

    { g: 'pfm', id: 'pfm', cn: '金属烤瓷', en: 'Porcelain Fused to Metal',
      oCn: '传统铸造金属内冠外覆烤瓷，可选钴铬、贵金属或纯钛。',
      oEn: 'Cast metal coping plus porcelain; CoCr, precious alloy or titanium.',
      chips: [['传统铸造', 'Cast Coping'], ['钴铬 · 贵金属 · 纯钛', 'CoCr · Noble · Ti'], ['舌侧 2–3mm 金属边', '2–3mm Metal Margin']],
      secs: [
        ['feat', ['采用传统金属铸造技术制作内冠', '精确度极高，底冠光洁致密，更利于口腔安全健康']],
        ['spec', ['金属内冠 + 烤瓷层烧结而成', '唇颊侧烤瓷饰面，舌侧露 2–3mm 宽微细金属边', '内冠可选普通钴铬合金、贵金属、纯钛', '也可选择全包瓷、全金属边缘或瓷肩台冠设计']]
      ] },

    /* ============ 3D 打印 ============ */
    { g: 'print', id: 'printcb', cn: '3D 打印冠桥', en: '3D Printed Crown & Bridge',
      oCn: '树脂直接打印成形，免切削，适合数字化流程内的冠桥修复。',
      oEn: 'Resin printed directly to shape — no milling, built into a digital workflow.',
      chips: [['3D 打印', '3D Printing'], ['免切削', 'Mill-free'], ['冠 · 桥', 'Crown · Bridge']],
      secs: [
        ['feat', ['直接打印成形，省去切削环节，交付周期更短', '成形精度高，适合多单位桥体的批量制作', '可作长期修复体使用，具体依材料与临床要求而定']],
        ['spec', ['参数待补充']]
      ] },

    /* ============ 种植修复 ============ */
    { g: 'implant', id: 'malo', cn: 'Malo 桥（All-on-4）', en: 'Malo / Malone Bridge',
      oCn: 'All-on-4 概念下咬合面螺丝固位的种植上部结构，可整体取下维护。',
      oEn: 'All-on-4 occlusal screw-retained superstructure — removable for servicing.',
      chips: [['All-on-4', 'All-on-4'], ['咬合面螺丝固位', 'Occlusal Screw-retained'], ['可拆下维护', 'Removable']],
      secs: [
        ['feat', ['基于 All-on-4 概念的咬合面螺丝固位种植上部结构', '上部结构可整体取下，便于清洁与维护', '支架强度高，适合全口或大范围种植修复']],
        ['spec', ['参数待补充']]
      ] },

    { g: 'implant', id: 'overdenture', cn: '种植覆盖义齿', en: 'Implant Overdenture',
      oCn: '至少两颗植体固位，可选杆卡、球帽、磁性或双套冠。',
      oEn: 'Two or more implants retained; bar, ball, magnet or telescopic.',
      chips: [['无牙颌', 'Edentulous'], ['≥2 颗植体', '≥2 Implants'], ['杆卡 · 球帽 · 磁性 · 双套冠', 'Bar · Ball · Magnet · Telescope']],
      secs: [
        ['scope', ['无牙颌患者的修复治疗。']],
        ['feat', ['固位与稳定性更好——有种植体提供固位力', '咀嚼效率更高，进食不松动，无食物嵌塞的尴尬', '基托与边缘可做得更短、甚至无基托，口内异物感更小', '植体保留周围牙槽骨，减缓骨吸收']],
        ['spec', ['至少 2 颗种植体提供固位，并有良好的共同就位道', '可选杆卡式、球帽、磁性附着体或双套冠等方式固位']]
      ] },

    { g: 'implant', id: 'abutment', cn: '种植个性化基台', en: 'Custom Abutment',
      oCn: '匹配主流种植系统，穿龈高度与角度可按病例定制。',
      oEn: 'Matched across 258 implant systems; emergence profile and angle made to case.',
      chips: [['258 套系统', '258 Systems'], ['穿龈定制', 'Custom Emergence'], ['角度补偿', 'Angle Correction']],
      secs: [
        ['scope', ['无牙颌患者的修复治疗', '可选 258 套种植系统，覆盖主要临床需求']],
        ['feat', ['自然的解剖面与贴合度', '满足各种穿龈高度及超大角度需求', '免除临床医生选择基台的困扰', '让复杂种植简单化、低成本、低风险']],
        ['spec', ['参数待补充']]
      ] },

    { g: 'implant', id: 'casting', cn: '铸造个性化种植支架', en: 'Casting Superstructure',
      oCn: '个性化支架与基台连体铸造，螺丝固位，分散咬合负荷。',
      oEn: 'Abutment and framework cast as one piece, screw-retained.',
      chips: [['连体铸造', 'One-piece Cast'], ['螺丝固位', 'Screw-retained'], ['分散咬合', 'Load Distribution']],
      secs: [
        ['feat', ['个性化支架与成品基台连体铸造：在基牙或基牙代型上连接塑胶或蜡型，包埋去蜡铸造打磨后，在支架上进行上部修复；支架通过螺丝与口内种植体连接', '金属支架可增加上部结构强度、固位力并分散合力', '更理想的美观与功能效果', '患者可自行保养维护']],
        ['spec', ['个性化支架与成品基台连体铸造，在支架上铸出基牙或基牙代型形状，再在其上完成上部修复', '配套连接螺丝', '支架材料按成品基台的金属类型选择同等材料；若基台为塑胶可铸件，则任一金属均可', '上部修复可选直接烤瓷或烤塑、冠修复或排人工牙']],
        ['flow', ['设计支架 → 铸造支架 → 临床试戴支架 → 完成上部修复']]
      ] },

    /* ============ 矫正装置 ============ */
    { g: 'ortho', id: 'snoring', cn: '止鼾器', en: 'Snoring Guard',
      oCn: '下颌前伸式设计，配可调杆，扩开睡眠时缩窄的气道。',
      oEn: 'Mandibular advancement with adjustable rods.',
      chips: [['下颌前伸', 'Mandibular Advancement'], ['可调杆', 'Adjustable Rods'], ['1 套 2 件', '2 Rods per Set']],
      secs: [
        ['scope', ['防打鼾用。戴上后可将下颌往前推，扩开睡眠时缩小的呼吸气道，降低或消除共鸣鼾声。']],
        ['spec', ['透明色硬胶片或软胶片，热压塑技术制作', '1 套 2 件进口可调杆，固定在上下托盘的左右两侧']],
        ['clinic', ['加工初期在正中合基础上将下颌前移约 2mm 固定可调杆，医生按临床需要更换杆长——杆越短下颌越前，杆越长下颌越后', '睡眠前戴上']]
      ] },

    { g: 'ortho', id: 'hawley', cn: '哈利氏保持器', en: 'Hawley Retainer',
      oCn: '唇弓加箭头卡环，最常用的标准活动保持器。',
      oEn: 'Labial bow plus arrow clasps — the standard removable retainer.',
      chips: [['唇弓 + 箭头卡环', 'Bow + Arrow Clasps'], ['标准活动矫治器', 'Standard Removable'], ['患者自摘', 'Patient-removable']],
      secs: [
        ['scope', ['为保持临床矫治效果，矫治结束后佩戴；可使牙小量移动，或通过调节唇弓关闭前牙少量间隙。']],
        ['feat', ['常用的标准活动矫治器，患者可自行摘戴']],
        ['spec', ['1 个唇弓 + 2 个箭头卡环 + 1 块净色树脂胶基托板']],
        ['clinic', ['除刷牙外可长时间佩戴；为稳定和保持效果，应持续佩戴较长时间', '想加强保持效果，可将唇弓贴牙制作', '具体应用由医师根据临床情况决定']]
      ] },

    { g: 'ortho', id: 'expansion', cn: '螺旋矫正器', en: 'Expansion Plate',
      oCn: '三面推螺旋器扩弓，患者可自行摘戴。',
      oEn: 'Three-way screw for arch expansion; patient-removable.',
      chips: [['三面推螺旋器', '3-way Screw'], ['扩弓', 'Arch Expansion'], ['可摘', 'Removable']],
      secs: [
        ['scope', ['牙弓拥挤时扩张牙弓。']],
        ['feat', ['主要通过螺旋器加力扩弓', '活动矫治器，医生或患者可自行摘戴']],
        ['spec', ['2 个箭头卡环固位 + 1 块净色树脂胶基托板 + 1 个三面推螺旋器']],
        ['clinic', ['加力时应逐步进行', '牙弓扩开后，再用其它矫正器排列牙齿', '除上述附件外如需设计其它附件，另行计费', '具体应用由医师根据临床情况决定']]
      ] },

    { g: 'ortho', id: 'sport', cn: '运动护齿套', en: 'Sport Guard',
      oCn: '基本型 / 冲撞型 / 专业抗击型三档，对应不同运动强度。',
      oEn: 'Three protection levels from cycling to contact sports.',
      chips: [['三档防护', '3 Protection Levels'], ['成品厚 3–5mm', '3–5mm Thick'], ['热压塑', 'Pressure-formed']],
      secs: [
        ['scope', ['基本型：适用于排球、自行车等运动的口腔保护', '冲撞型：适用于足球、篮球、垒球、溜冰、轮滑等运动', '专业抗击型：适用于拳击、曲棍球等运动']],
        ['spec', ['基本型：3+4mm 或 2+5mm 两层透明胶片，热压塑，成品厚度约 3mm', '冲撞型：同规格胶片，成品厚度约 5mm', '专业抗击型：约 7mm 厚特殊三层透明胶片，前牙区中间层为硬质层，后牙区为单色彩色胶片，成品厚度约 5mm', '胶片唇舌侧均覆盖到牙龈']],
        ['clinic', ['制作需对颌模型与咬合关系蜡堤', '一般只做上颌，胶片止于两侧第一磨牙']]
      ] },

    { g: 'ortho', id: 'rpe', cn: '快速扩弓器（RPE）', en: 'Rapid Palatal Expansion',
      oCn: '钥匙加力式腭侧扩弓装置，按箭头方向逐次加力。',
      oEn: 'Key-activated palatal expander — turn in the arrow direction for each adjustment.',
      chips: [['钥匙加力', 'Key-activated'], ['腭侧扩弓', 'Palatal Expansion'], ['逐步加力', 'Gradual Force']],
      secs: [
        ['feat', ['用钥匙按箭头方向插入并加力，逐步扩大牙弓宽度', '结构简单，患者可按医嘱在家中自助加力']],
        ['spec', ['参数待补充']]
      ] },

    { g: 'ortho', id: 'invisret', cn: '隐形保持器', en: 'Invisible Retainer',
      oCn: '透明压膜保持器，正畸结束后维持牙列位置，佩戴时几乎不可见。',
      oEn: 'Clear pressure-formed retainer — holds the result after orthodontic treatment.',
      chips: [['透明压膜', 'Clear Pressure-formed'], ['正畸后保持', 'Post-ortho Retention'], ['美观', 'Esthetic']],
      secs: [
        ['feat', ['透明膜片压膜成形，佩戴时几乎不可见', '用于正畸治疗结束后维持牙列位置', '摘戴方便，便于日常清洁']],
        ['spec', ['参数待补充']]
      ] },

    /* ============ 活动修复 ============ */
    { g: 'removable', id: 'bego', cn: '德国 BPD 完美支架', en: 'Bego Framework',
      oCn: 'BEGO 支架材料，弹性、密合、超薄轻巧。',
      oEn: 'BEGO framework alloy — elastic, close-fitting and thin.',
      chips: [['BEGO', 'BEGO'], ['弹性密合', 'Elastic Fit'], ['超薄轻巧', 'Ultra-thin']],
      secs: [
        ['brand', ['德国百年牙科品牌 BEGO 公司的金属支架材料。']],
        ['scope', ['牙列缺损的活动修复用支架。']],
        ['feat', ['支架具有优越的弹性、密合、超薄、轻巧等特性']],
        ['spec', ['完美支架，包含与支架整体铸造出来的固位卡环、颌支托、前牙区固位小钉']]
      ] },

    { g: 'removable', id: 'ti', cn: '纯钛支架', en: 'Titanium Framework',
      oCn: '进口纯钛，生物相容性佳、有弹性且轻巧。',
      oEn: 'Imported pure titanium: biocompatible, elastic and light.',
      chips: [['进口纯钛（日本）', 'Imported CP Ti'], ['生物相容', 'Biocompatible'], ['轻巧', 'Lightweight']],
      secs: [
        ['brand', ['进口纯钛，日本产。']],
        ['scope', ['牙列缺损的活动修复用支架。']],
        ['feat', ['优越的生物相容性、弹性、轻巧等特性']],
        ['spec', ['纯钛钢托支架，包含与支架整体铸造出来的固位卡环、颌支托、前牙区固位小钉']]
      ] },

    { g: 'removable', id: 'full', cn: '全口义齿', en: 'Full Denture',
      oCn: '常规全口义齿，塑胶基托配树脂牙，注重咬合与排牙。',
      oEn: 'Conventional complete denture — acrylic base with resin teeth.',
      chips: [['黏膜支持', 'Mucosa-borne'], ['塑胶基托 + 树脂牙', 'Acrylic + Resin Teeth'], ['全口缺失', 'Full Edentulous']],
      secs: [
        ['scope', ['适用于全口牙列缺失的修复，此处指由黏膜及黏膜下组织支持的常规全口义齿。']],
        ['feat', ['可摘义齿，美观、轻巧']],
        ['spec', ['普通塑胶基托 + 普通树脂牙（凯丰胶牙）']],
        ['clinic', ['建议先制作个别托盘，以便取得准确印模', '可选择高端基托材料（如 199 不碎胶）及高端树脂牙，需另行计费']]
      ] },

    { g: 'removable', id: 'peek', cn: 'PEEK 支架', en: 'PEEK Framework',
      oCn: '无金属、质轻、透 X 光、防过敏，异物感更小。',
      oEn: 'Metal-free, light, radiolucent and non-allergenic.',
      chips: [['无金属', 'Metal-free'], ['透 X 光', 'Radiolucent'], ['减震', 'Shock-absorbing']],
      secs: [
        ['scope', ['可摘义齿，美观轻巧；密度小、质量轻、异物感相对小', '可用于可摘义齿、种植上部、套筒冠、杆卡结构修复体等']],
        ['feat', ['易加工、耐腐蚀性好、比金属轻，纯 PEEK 生物相容性佳', '有弹性、减震，对余留牙无磨损；耐断裂与扭转，包容性强', '不含金属、防过敏、不溶于水、抗菌斑、化学性质稳定', '透 X 光性能好，便于术后检查恢复情况', '自然美、性价比高、不染色，口内感觉轻松自然', '易研磨、易抛光、易贴面']]
      ] },

    { g: 'removable', id: 'printfw', cn: '3D 打印活动支架', en: '3D Printed Partial Framework',
      oCn: '支架直接打印成形，交付快、精度稳定，复杂卡环设计不受限。',
      oEn: 'Partial frameworks printed directly — fast turnaround with consistent precision.',
      chips: [['3D 打印', '3D Printing'], ['快速交付', 'Fast Turnaround'], ['高精度', 'High Precision']],
      secs: [
        ['feat', ['支架打印成形，交付周期明显短于传统铸造流程', '精度稳定，卡环与支托可一次成形', '复杂设计不受铸造收缩限制']],
        ['spec', ['参数待补充']]
      ] },

    { g: 'removable', id: 'duracetal', cn: '聚甲醛支架（DuraCetal）', en: 'DuraCetal Framework',
      oCn: '高结晶聚甲醛树脂支架，无金属、轻量，是金属支架的替代方案。',
      oEn: 'Highly crystalline acetal copolymer — metal-free, light alternative to cast frameworks.',
      chips: [['聚甲醛', 'Acetal Copolymer'], ['无金属', 'Metal-free'], ['轻量', 'Lightweight']],
      secs: [
        ['feat', ['乙缩醛共聚物（聚甲醛）材料，纯度高、结晶度高', '适合局部义齿支架，重量明显轻于金属支架', '无金属色，美观性好']],
        ['spec', ['参数待补充']]
      ] },

    { g: 'removable', id: 'clear', cn: '透明弹性局部义齿', en: 'Clear Flexible Partial',
      oCn: '半透明弹性树脂支架，无金属卡环，靠组织倒凹获得固位。',
      oEn: 'Translucent flexible resin framework — no metal clasps, retentive on soft-tissue undercuts.',
      chips: [['弹性树脂', 'Flexible Resin'], ['半透明', 'Translucent'], ['无金属卡环', 'No Metal Clasp']],
      secs: [
        ['feat', ['支架轻巧，半透明材质与牙龈、余留牙过渡自然', '100% 无金属设计，无金属卡环外露', '戴用舒适，患者接受度高']],
        ['spec', ['参数待补充']]
      ] },

    /* ============ 精密附件 ============ */
    { g: 'attachment', id: 'telescope', cn: '套筒冠', en: 'Telescope Coping',
      oCn: '内外冠套合固位，兼顾固定修复的稳定与可摘性。',
      oEn: 'Double-crown retention combining fixed stability with removability.',
      chips: [['内外冠套合', 'Double Crown'], ['固位稳定', 'Retention']],
      empty: true,
      secs: [
        ['spec', ['参数待补充']]
      ] },

    { g: 'attachment', id: 'galvano', cn: '电铸纯金套筒冠（Galvano）', en: 'Galvano Telescopic',
      oCn: '电化学电铸成形的 0.2–0.3mm 纯金内外冠，密合度极高。',
      oEn: 'Electroformed pure-gold copings at 0.2–0.3mm — extreme fit accuracy.',
      chips: [['电铸成形', 'Electroformed'], ['纯金 0.2–0.3mm', 'Pure Gold 0.2–0.3mm'], ['高密合', 'Precise Fit']],
      secs: [
        ['feat', ['通过电化学电铸工艺，成形可自支撑的金属支架', '纯金层厚度薄至 0.2–0.3mm，厚度均匀', '密合度高，套筒冠的固位与戴用舒适度更好']],
        ['spec', ['参数待补充']]
      ] },

    { g: 'attachment', id: 'snap', cn: '快模式（Snap）', en: 'Snap Attachment',
      oCn: '冠外锚式附着体，所需空间小，具弹性缓冲。',
      oEn: 'Extra-coronal anchor type; minimal space, elastic cushioning.',
      chips: [['冠外锚式', 'Extra-coronal Anchor'], ['空间需求小', 'Minimal Space'], ['弹性缓冲', 'Elastic Cushion']],
      secs: [
        ['scope', ['适用于单、双侧游离端缺失修复和种植覆盖义齿修复（单侧游离缺失须在对侧设计支抗）。']],
        ['feat', ['冠外附着体，锚式', '放置在基牙邻面、唇面或杆卡，所需空间较少', '牙颌龈间距所需空间较少', '具弹性缓冲']],
        ['flow', ['分两次完成：第一次完成固定部分；第二次完成活动部分（做活动修复时，固定牙部分需带牙取模一起返回）']],
        ['clinic', ['第一次固定烤瓷部分完成后返回临床试戴，试戴合适后戴着固定部分用硅橡胶取模', '取模时建议用较稀的少量丁香油或氧化锌将固定烤瓷部分临时粘接后再取', '如需自行灌模，灌模前在固定冠底部均匀涂一层凡士林，便于脱模、减少颈缘崩瓷']]
      ] },

    { g: 'attachment', id: 'preciline', cn: '栓道式（Preci-line）', en: 'Preci-line Slot',
      oCn: '摩擦力固位，垫圈可更换，对基牙有保护作用。',
      oEn: 'Friction retention with replaceable inserts.',
      chips: [['摩擦固位', 'Friction Fit'], ['垫圈可换', 'Replaceable Insert'], ['保护基牙', 'Tooth Protection']],
      secs: [
        ['scope', ['适用于单、双侧游离缺失修复或局部缺失修复（单侧游离缺失须在对侧设计支抗）。']],
        ['feat', ['摩擦力固位，垫圈可更换', '对基牙有一定的保护作用', '具弹性缓冲']],
        ['clinic', ['分两次完成：第一次固定烤瓷部分完成后返回临床试戴，合适后戴着固定部分用硅橡胶取模；取模时建议临时粘接后再取', '自行灌模前在固定冠底部涂一层凡士林便于脱模；凡士林过多会造成固定冠定位不准、活动托就位困难']]
      ] },

    { g: 'attachment', id: 'vks', cn: 'Bredent VKS-OC 附着体', en: 'Bredent VKS-OC Attachment',
      oCn: '可放在杆或冠的颊、舌、近远中任意面，适合空间受限的病例。',
      oEn: 'Fits on buccal, lingual, mesial or distal surfaces — built for limited space.',
      chips: [['德国 Bredent', 'Bredent'], ['位置灵活', 'Flexible Placement'], ['空间受限适用', 'Limited Space']],
      secs: [
        ['feat', ['可靠、功能性好，几乎可用于任何附着体病例', '可放置在杆或冠的颊面、舌面、近中或远中', '对空间要求低，适合间隙紧张的病例', '限制少，设计自由度高']],
        ['spec', ['参数待补充']]
      ] },

    { g: 'attachment', id: 'precivertix', cn: 'Preci-Vertix 附着体', en: 'Preci-Vertix Attachment',
      oCn: '与 Preci-line 同厂的垂直栓道式附件，摘戴轻松、维护量低。',
      oEn: 'Vertical slot attachment from the Preci-line family — easy insert, low maintenance.',
      chips: [['垂直栓道', 'Vertical Slot'], ['易摘戴', 'Easy Insert'], ['维护量低', 'Low Maintenance']],
      secs: [
        ['feat', ['患者自行摘戴轻松，不需要额外技巧', '维护与保养需求低', '适应面广，可配合氧化锆或烤瓷冠桥使用', '美学表现好']],
        ['spec', ['参数待补充']]
      ] }
  ];

  /* ---------- 状态与工具 ---------- */
  var params = new URLSearchParams(location.search);
  var key = params.get('line');
  if (!LINES[key]) {
    // 未知参数 → 回首页，不留白页
    location.replace('index.html');
    return;
  }
  var line = key;

  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
  var esc = function (s) {
    return String(s).replace(/[&<>]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c];
    });
  };

  function lang() { return window.SITE.getLang(); }
  function L(p) { return p[lang() === 'cn' ? 'cn' : 'en']; }
  function byGroup(g) { return P.filter(function (p) { return p.g === g; }); }
  function byLine(l) { return P.filter(function (p) { return GROUPS[p.g].line === l; }); }
  function groupsOf(l) { return GROUP_ORDER.filter(function (g) { return GROUPS[g].line === l; }); }

  /* ---------- 版头（面包屑 / 标题 / 导语 / 文档标题） ---------- */
  function renderHero() {
    var Ln = LINES[line];
    $('#pd-title').textContent = L(Ln.title);
    $('#pd-lede').textContent = L(Ln.lede);
    window.SITE.setTitle(
      Ln.title.en + ' — EXCELDENT Dental Lab',
      Ln.title.cn + ' — 优里卡齿科'
    );
  }

  /* ---------- 吸顶分类导航 ---------- */
  function renderCatNav() {
    $('#cat-nav').innerHTML = groupsOf(line).map(function (g) {
      return '<a href="#cat-' + g + '"><b>' + esc(GROUPS[g][lang()]) + '</b>' +
             '<span>' + byGroup(g).length + '</span></a>';
    }).join('');
  }

  /* ---------- 产品卡 ---------- */
  function cardHTML(p, i) {
    var g = GROUPS[p.g];
    return '' +
      '<li class="pd-item" data-id="' + p.id + '">' +
        '<div class="pd-ph" aria-hidden="true"><span class="ph-mark">' + esc(g[lang()]) + '</span></div>' +
        '<div class="pd-body">' +
          '<span class="pd-item-num">' + pad(i) + '</span>' +
          '<h3 class="pd-item-title">' + esc(p[lang()]) + '</h3>' +
          '<span class="mat-badge">' + esc(g[lang()]) + '</span>' +
          '<button class="pd-summary" type="button" aria-label="' + esc(L({ cn: '查看详细参数', en: 'View specifications' })) + '">' +
            '<span class="sum-text">' + esc(lang() === 'cn' ? p.oCn : p.oEn) + '</span>' +
          '</button>' +
          '<span class="pd-more">' +
            esc(p.empty ? { cn: '查看详细参数 · 待补充', en: 'Specs pending' } : { cn: '查看详细参数', en: 'View specifications' }) +
            '<span class="arw" aria-hidden="true">→</span>' +
          '</span>' +
        '</div>' +
      '</li>';
  }

  function renderBody() {
    var idx = 0;
    var html = '';
    groupsOf(line).forEach(function (gk) {
      var items = byGroup(gk);
      html += '<div class="cat-block" id="cat-' + gk + '">' +
                '<div class="cat-head">' +
                  '<h2>' + esc(GROUPS[gk][lang()]) + '</h2>' +
                  '<span class="cat-count">' + items.length + '</span>' +
                  '<span class="cat-en">' + esc(lang() === 'cn' ? GROUPS[gk].en : GROUPS[gk].cn) + '</span>' +
                '</div>' +
                '<p class="cat-desc">' + esc(lang() === 'cn' ? GROUPS[gk].dCn : GROUPS[gk].dEn) + '</p>' +
                '<ul class="pd-grid">' + items.map(function (p) { idx++; return cardHTML(p, idx); }).join('') + '</ul>' +
              '</div>';
    });
    $('#pd-body').innerHTML = html;

    $$('#pd-body .pd-item').forEach(function (li) {
      var p = P.filter(function (x) { return x.id === li.dataset.id; })[0];
      var open = function () { openDetail(p, li); };
      li.querySelector('.pd-summary').addEventListener('click', open);
      li.querySelector('.pd-more').addEventListener('click', open);
    });
  }

  /* ---------- 详情参数浮层 ---------- */
  var lastLi = null;
  function openDetail(p, li) {
    var g = GROUPS[p.g];
    var Ln = LINES[g.line];

    $('#dt-crumb').textContent =
      [L({ cn: '产品', en: 'Products' }), L(Ln.title), L(g)].join(' / ');
    $('#dt-title').textContent = L(p);
    $('#dt-sub').textContent = lang() === 'cn' ? p.en : p.cn;
    $('#dt-chips').innerHTML = (p.chips || []).map(function (c) {
      return '<span>' + esc(lang() === 'cn' ? c[0] : c[1]) + '</span>';
    }).join('');

    var body = '';
    if (lang() === 'en') {
      body += '<div class="dt-langnote">' +
        'Technical parameters below are currently provided in Chinese; the English version is pending translation.' +
        '</div>';
    }
    (p.secs || []).forEach(function (s) {
      var k = s[0], items = s[1];
      var h = SEC[k] || ['', ''];
      body += '<div class="dt-sec"><h3>' + esc(h[lang() === 'cn' ? 0 : 1]) + '</h3>';
      if (k === 'flow') {
        body += '<p>' + items.map(esc).join('</p><p>') + '</p>';
      } else if (k === 'brand' && items.length === 1) {
        body += '<p>' + esc(items[0]) + '</p>';
      } else {
        body += '<ul>' + items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
      }
      body += '</div>';
    });
    $('#dt-body').innerHTML = body;

    $('#dt-overlay').classList.add('on');
    document.body.style.overflow = 'hidden';
    if (lastLi) lastLi.classList.remove('is-open');
    lastLi = li || null;
    if (lastLi) lastLi.classList.add('is-open');
  }

  function closeDetail() {
    $('#dt-overlay').classList.remove('on');
    document.body.style.overflow = '';
    if (lastLi) { lastLi.classList.remove('is-open'); lastLi = null; }
  }

  /* ---------- 事件绑定 ---------- */
  var overlay = document.getElementById('dt-overlay');
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeDetail();  // 点面板外关闭
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('on')) closeDetail();
  });
  $('#dt-close').addEventListener('click', closeDetail);

  function renderAll() {
    renderHero();
    renderCatNav();
    renderBody();
  }

  renderAll();
  window.SITE.onLang(function () {
    closeDetail();
    renderAll();
  });
})();
