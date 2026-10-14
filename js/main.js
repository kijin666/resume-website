/* ============================================================
   个人网页简历 · 交互脚本 js/main.js
   功能：
     1. 深浅色主题切换（记忆用户选择）
     2. 顶部滚动进度条 + 导航栏阴影
     3. 导航高亮当前区块 + 手机端菜单
     4. 滚动进场动画（IntersectionObserver）
     5. 技能条宽度动画
     6. 数字滚动统计
     7. 首屏打字机效果
     8. 回到顶部 + 页脚年份
   ============================================================ */

(function () {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- 1. 主题切换 ---------- */
  const THEME_KEY = 'resume-theme';
  const html = document.documentElement;
  const params = new URLSearchParams(location.search);

  // 网址加 ?static=1 可一次性关闭所有动画（用于自动截图、导出 PDF 等场景）
  const STATIC_MODE = params.has('static');

  // 优先级：网址参数 ?theme=dark / ?theme=light  >  上次的选择  >  系统设置
  const urlTheme = params.get('theme');
  const saved = urlTheme || localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  html.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));

  $('#themeToggle')?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
  });

  /* ---------- 2. 滚动进度条 / 导航栏状态 ---------- */
  const progressBar = $('#progressBar');
  const header = $('#siteHeader');
  const toTop = $('#toTop');

  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const percent = height > 0 ? (scrollTop / height) * 100 : 0;

    if (progressBar) progressBar.style.width = percent + '%';
    header?.classList.toggle('is-scrolled', scrollTop > 10);
    toTop?.classList.toggle('is-visible', scrollTop > 400);

    highlightNav();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- 3. 导航高亮 + 手机菜单 ---------- */
  const navList = $('#navList');
  const navLinks = $$('.nav__link');
  const sections = navLinks
    .map((link) => $(link.getAttribute('href')))
    .filter(Boolean);

  function highlightNav() {
    const offset = window.innerHeight * 0.32;
    let current = sections[0];
    sections.forEach((sec) => {
      if (sec.getBoundingClientRect().top <= offset) current = sec;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + current.id);
    });
  }

  $('#menuToggle')?.addEventListener('click', () => navList?.classList.toggle('is-open'));
  navLinks.forEach((link) => link.addEventListener('click', () => navList?.classList.remove('is-open')));

  /* ---------- 4 & 5. 滚动进场动画 + 技能条 ---------- */
  const revealItems = $$('.reveal');

  if (STATIC_MODE) {
    // ?static=1：所有内容直接显示为最终状态，不播动画
    revealItems.forEach((el) => el.classList.add('is-visible'));
    $$('.skills__col').forEach((el) => fillSkills(el, true));
    $$('.about__stats').forEach((el) => countUp(el, true));
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          if (entry.target.classList.contains('skills__col')) fillSkills(entry.target);
          if (entry.target.classList.contains('about__stats')) countUp(entry.target);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealItems.forEach((el) => io.observe(el));
  } else {
    // 老浏览器兜底：直接显示
    revealItems.forEach((el) => el.classList.add('is-visible'));
    $$('.skills__col').forEach(fillSkills);
    $$('.about__stats').forEach(countUp);
  }

  function fillSkills(scope, instant) {
    $$('.skill', scope).forEach((skill, i) => {
      const level = Number(skill.dataset.level || 0);
      const fill = $('.skill__fill', skill);
      if (!fill) return;
      if (instant) { fill.style.width = level + '%'; return; }
      setTimeout(() => { fill.style.width = level + '%'; }, i * 130);
    });
  }

  /* ---------- 6. 数字滚动 ---------- */
  function countUp(scope, instant) {
    $$('[data-count]', scope).forEach((el, i) => {
      const target = Number(el.dataset.count || 0);

      if (instant) { el.textContent = target; return; }

      const duration = 1100;
      const startAt = performance.now() + i * 120;
      el.textContent = '0'; // 从 0 开始滚动（HTML 里写的是最终数字，禁用 JS 时也不会显示 0）

      function step(now) {
        const t = Math.min(Math.max((now - startAt) / duration, 0), 1);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        el.textContent = Math.round(target * eased);
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);

      // 兜底：万一动画被浏览器暂停（切后台、打印预览），到点直接显示最终数字
      setTimeout(() => { el.textContent = target; }, duration + i * 120 + 400);
    });
  }

  /* ---------- 7. 首屏打字机 ---------- */
  const typedEl = $('#typed');
  if (typedEl && !STATIC_MODE && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const words = ['昇腾 AI 应用 / 计算机运维', 'AI 工具实践者', '硬件维修 · 义务服务', '正在学习 AI 应用开发'];
    let wordIndex = 0, charIndex = 0, deleting = false;

    function type() {
      const word = words[wordIndex];
      charIndex += deleting ? -1 : 1;
      typedEl.textContent = word.slice(0, charIndex);

      let delay = deleting ? 45 : 110;
      if (!deleting && charIndex === word.length) { delay = 1600; deleting = true; }
      else if (deleting && charIndex === 0) { deleting = false; wordIndex = (wordIndex + 1) % words.length; delay = 320; }

      setTimeout(type, delay);
    }
    typedEl.textContent = '';
    setTimeout(type, 400);
  }

  /* ---------- 8. 回到顶部 / 年份 / 打印兜底 ---------- */
  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 按 Ctrl+P 导出 PDF 时，把所有动画状态直接定格成最终效果，避免打印出空白或 0
  window.addEventListener('beforeprint', () => {
    revealItems.forEach((el) => el.classList.add('is-visible'));
    $$('.skills__col').forEach((el) => fillSkills(el, true));
    $$('.about__stats').forEach((el) => countUp(el, true));
    if (typedEl) typedEl.textContent = '昇腾 AI 应用 / 计算机运维';
  });

  // 初始化一次，保证刷新后状态正确
  onScroll();
})();
