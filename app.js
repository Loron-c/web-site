/* ================================================================
   EXCELDENT Dental Lab — Model Site
   Animations & interactions
   ================================================================ */
/* ================================================================
   Boot — 撤掉首屏骨架（不依赖 GSAP，脚本挂了也要撤）
   ================================================================ */
(function () {
  const boot = document.getElementById('boot');
  if (!boot) return;
  const hide = () => {
    boot.classList.remove('is-on');
    boot.classList.add('done');
    setTimeout(() => boot.remove(), 600);
  };
  if (document.readyState === 'complete') setTimeout(hide, 60);
  else window.addEventListener('load', () => setTimeout(hide, 60));
})();

const hasGsap = typeof gsap !== 'undefined';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/* 只有「GSAP 可用且用户未要求减少动画」时才接管入场动画；
   否则立即摘掉 .js-anim，让内容以静态方式直接可见（防白屏）。 */
const animate = hasGsap && !reduceMotion;

if (animate) {
  gsap.registerPlugin(ScrollTrigger);
  window.__animReady = true;
} else {
  document.documentElement.classList.remove('js-anim');
}

/* ================================================================
   Header scroll state
   ================================================================ */
const header = document.getElementById('site-header');
const onScroll = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 8);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ================================================================
   Language toggle (EN default · CN via data-cn)
   ================================================================ */
const langToggle = document.getElementById('lang-toggle');

/* 语言偏好持久化。file:// / 隐私模式 / 禁用存储时 localStorage 会抛异常，
   全部吞掉——持久化只是增强，不能因此让整站脚本挂掉。 */
const LANG_KEY = 'exceldent-lang';
const saveLang = (v) => {
  try { localStorage.setItem(LANG_KEY, v); } catch (e) { /* 存不了就跳过，不影响浏览 */ }
};

const setLang = (lang) => {
  document.documentElement.setAttribute('data-lang', lang);
  document.documentElement.setAttribute('lang', lang === 'cn' ? 'zh-CN' : 'en');
  saveLang(lang);
  document.querySelectorAll('[data-en][data-cn]').forEach((el) => {
    const text = el.getAttribute(`data-${lang}`);
    if (text == null) return;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = text;
    } else if (el.tagName === 'OPTION') {
      el.textContent = text;
    } else {
      el.textContent = text;
    }
  });
  document.querySelectorAll('.lang-opt').forEach((opt) => {
    opt.classList.toggle('lang-active', opt.dataset.langOpt === lang);
  });
  document.title = lang === 'cn'
    ? '优里卡齿科 — 高端定制义齿'
    : 'EXCELDENT Dental Lab — High-End Custom Dental Prosthetics';
};
langToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-lang') === 'en' ? 'cn' : 'en';
  setLang(next);
});

/* 恢复：head 内联脚本已把 data-lang 设成上次的偏好，但 HTML 里的文案仍是英文，
   这里统一刷一遍（含标题），确保属性与界面一致。 */
setLang(document.documentElement.getAttribute('data-lang') === 'cn' ? 'cn' : 'en');

/* ================================================================
   Mobile menu
   ================================================================ */
const burger = document.getElementById('nav-burger');
const navLinks = document.querySelector('.nav-links');
burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('is-open');
  document.body.classList.toggle('menu-open', open);
});
navLinks.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navLinks.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }
});

/* ================================================================
   Scroll-reveal: hero lines + reveal blocks
   ================================================================ */
if (animate) {
  // Hero title lines stagger in (无遮罩版 — 纯位移+淡入，避免裁切 descender)
  // 用 gsap.to + 显式设初始值,因为 CSS .reveal-line 已是 opacity:0(从 .reveal 继承)
  gsap.set('.hero-title .reveal-line', { opacity: 0, y: 60 });
  gsap.to('.hero-title .reveal-line', {
    opacity: 1, y: 0, duration: 0.9, ease: 'power4.out', stagger: 0.12, delay: 0.15
  });

  // Hero sub-elements fade in
  gsap.to('.hero-eyebrow, .hero-lede, .hero-ctas, .hero-meta', {
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.6
  });

  // Generic section reveals (skip hero — those animate on load above)
  const revealEls = gsap.utils.toArray('.reveal, [data-reveal]').filter(
    (el) => !el.closest('.hero')
  );
  revealEls.forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
    });
  });

  // Section heads (title + lede) — animate together
  gsap.utils.toArray('.section-head').forEach((head) => {
    const kids = head.querySelectorAll('.section-eyebrow, .section-title, .section-lede');
    gsap.to(kids, {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: head, start: 'top 85%', toggleActions: 'play none none reverse' }
    });
  });

  // Pillar cards — 同步入场（不用 stagger：滚动经过时组内卡片必须始终等高，
  // 依次浮起会让并排卡在动画中途显得高低不一）
  gsap.from('.pillar', {
    opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '.pillars', start: 'top 80%', toggleActions: 'play none none reverse' }
  });

  // Product cards — 同步入场（同上）
  gsap.from('.product-card', {
    opacity: 0, y: 50, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.product-grid', start: 'top 80%', toggleActions: 'play none none reverse' }
  });

  // Culture cards — 同步入场（同上）
  gsap.from('.culture-card', {
    opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '.culture-grid', start: 'top 82%', toggleActions: 'play none none reverse' }
  });

  // Tech feature split animation
  gsap.from('.tech-feature-media', {
    opacity: 0, x: -60, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.tech-feature', start: 'top 80%', toggleActions: 'play none none reverse' }
  });
  gsap.from('.tech-feature-body', {
    opacity: 0, x: 60, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.tech-feature', start: 'top 80%', toggleActions: 'play none none reverse' }
  });
  gsap.from('.tech-card', {
    opacity: 0, y: 30, duration: 0.7, ease: 'power3.out',
    scrollTrigger: { trigger: '.tech-secondary', start: 'top 85%', toggleActions: 'play none none reverse' }
  });

  // Hero meta — initial state
  gsap.set('.hero-meta', { opacity: 0, y: 30 });
  gsap.set('.hero-eyebrow, .hero-lede, .hero-ctas', { opacity: 0, y: 20 });
  // re-fire after a moment so hero animates
  gsap.to('.hero-eyebrow, .hero-lede, .hero-ctas, .hero-meta', {
    opacity: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 0.6, ease: 'power3.out'
  });

  // Parallax: hero glows drift on scroll
  gsap.to('.hero-glow--orange', {
    y: 120, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
  });
  gsap.to('.hero-glow--blue', {
    y: -150, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
  });
} else {
  // Reduced motion: just make everything visible
  document.querySelectorAll('.reveal, .reveal-line, [data-reveal]').forEach((el) => {
    el.classList.add('is-in');
    el.style.opacity = 1;
    el.style.transform = 'none';
  });
}

/* ================================================================
   Stat counters
   ================================================================ */
document.querySelectorAll('.counter').forEach((el) => {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  if (!animate) {
    el.textContent = (target >= 1000
      ? target.toLocaleString('en-US')
      : String(target)) + suffix;
    return;
  }
  const obj = { val: 0 };
  const formatNum = (n) => {
    if (target >= 1000) return Math.floor(n).toLocaleString('en-US');
    return Math.floor(n).toString();
  };
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      if (reduceMotion) { el.textContent = formatNum(target) + suffix; return; }
      gsap.to(obj, {
        val: target,
        duration: 2.2,
        ease: 'power2.out',
        onUpdate: () => { el.textContent = formatNum(obj.val) + suffix; }
      });
    }
  });
});

/* ================================================================
   Video — click cover to play
   ================================================================ */
const videoFrame = document.getElementById('video-frame');
if (videoFrame) {
  const video = document.getElementById('quality-video');
  const cover = document.getElementById('video-cover');
  const setLoading = (on) => videoFrame.classList.toggle('is-loading', on);

  cover.addEventListener('click', () => {
    // 51MB 视频要缓冲：留在封面上转圈，能播了再切走，避免黑屏干等
    setLoading(true);
    video.controls = true;
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => setLoading(false));
  });

  // 真正开始播放才撤封面
  video.addEventListener('playing', () => {
    setLoading(false);
    videoFrame.classList.add('is-playing');
  });
  video.addEventListener('canplay', () => setLoading(false));
  // 播放中途卡顿再次提示
  video.addEventListener('waiting', () => setLoading(true));
  video.addEventListener('error', () => setLoading(false));

  // 播完回到封面态
  video.addEventListener('ended', () => {
    setLoading(false);
    videoFrame.classList.remove('is-playing');
    video.currentTime = 0;
  });
}

/* ================================================================
   Footer — back to top
   ================================================================ */
const topBtn = document.getElementById('footer-top-btn');
if (topBtn) {
  topBtn.addEventListener('click', () => {
    // 尊重系统的「减少动画」偏好：不滚动动画，直接回顶
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
  });
}

/* ================================================================
   Form — validation + local only (model site, no backend)
   ================================================================ */
const form = document.getElementById('contact-form');
if (form) {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const ERR = {
    cn: {
      name: '名字缺失',
      emailEmpty: '邮箱缺失',
      emailInvalid: '邮箱格式错误',
      company: '单位缺失',
      message: '留言缺失'
    },
    en: {
      name: 'Name is required',
      emailEmpty: 'Email is required',
      emailInvalid: 'Invalid email format',
      company: 'Company / Clinic is required',
      message: 'Message is required'
    }
  };

  const fields = {
    name: form.querySelector('#cf-name'),
    email: form.querySelector('#cf-email'),
    company: form.querySelector('#cf-company'),
    message: form.querySelector('#cf-msg')
  };

  const currentLang = () =>
    (document.documentElement.getAttribute('data-lang') === 'cn' ? 'cn' : 'en');

  const setError = (input, msg) => {
    const field = input.closest('.form-field');
    if (!field) return;
    field.classList.add('has-error');
    let tip = field.querySelector('.field-error');
    if (!tip) {
      tip = document.createElement('span');
      tip.className = 'field-error';
      field.appendChild(tip);
    }
    tip.textContent = msg;
  };

  const clearError = (input) => {
    const field = input.closest('.form-field');
    if (!field) return;
    field.classList.remove('has-error');
    const tip = field.querySelector('.field-error');
    if (tip) tip.remove();
  };

  const clearAllErrors = () => Object.values(fields).forEach(clearError);

  // 用户开始输入就清掉该字段的错误提示
  Object.values(fields).forEach((input) => {
    input.addEventListener('input', () => clearError(input));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const L = ERR[currentLang()];
    clearAllErrors();

    let firstInvalid = null;
    const fail = (key, msg) => {
      setError(fields[key], msg);
      if (!firstInvalid) firstInvalid = fields[key];
    };

    if (!fields.name.value.trim()) fail('name', L.name);

    const emailVal = fields.email.value.trim();
    if (!emailVal) fail('email', L.emailEmpty);
    else if (!EMAIL_RE.test(emailVal)) fail('email', L.emailInvalid);

    if (!fields.company.value.trim()) fail('company', L.company);
    if (!fields.message.value.trim()) fail('message', L.message);

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const label = btn.querySelector('.btn-label');
    const original = label.textContent;

    // 加载态：转圈 + 禁用，防止重复提交（接真后端后这段就是真正的等待期）
    btn.classList.add('is-loading');
    label.textContent = currentLang() === 'cn' ? '发送中…' : 'Sending…';

    setTimeout(() => {
      btn.classList.remove('is-loading');
      btn.classList.add('is-done');
      label.textContent = currentLang() === 'cn' ? '已收到（演示用）' : 'Received (demo only)';
      setTimeout(() => {
        btn.classList.remove('is-done');
        label.textContent = original;
        form.reset();
        clearAllErrors();
      }, 2200);
    }, 900);
  });

  const resetBtn = () => {
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    btn.classList.remove('is-loading', 'is-done');
    const label = btn.querySelector('.btn-label');
    if (label) label.textContent = currentLang() === 'cn' ? '发送询单' : 'Send Inquiry';
  };

  // 切换语言时清掉旧语言的错误提示，并复位按钮
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      setTimeout(() => {
        clearAllErrors();
        resetBtn();
      }, 0);
    });
  }
}
