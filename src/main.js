import './style.css';

document.documentElement.classList.add('js');

(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const pages = ['home', 'work', 'projects', 'toolkit', 'contact'];

  document.querySelectorAll('.sun').forEach((sun) => {
    let markup = '<circle r="9"/><circle r="12"/>';
    for (let index = 0; index < 28; index += 1) {
      const angle = index * Math.PI * 2 / 28;
      const length = index % 2 ? 30 : 46;
      markup += `<line x1="${(Math.cos(angle) * 16).toFixed(1)}" y1="${(Math.sin(angle) * 16).toFixed(1)}" x2="${(Math.cos(angle) * length).toFixed(1)}" y2="${(Math.sin(angle) * length).toFixed(1)}"/>`;
    }
    sun.innerHTML = markup;
  });

  document.querySelectorAll('.row, .tr, .card, .feat, .tag, .also, .links, .mail').forEach((element) => {
    if (!element.classList.contains('sr')) element.classList.add('sr');
  });

  document.querySelectorAll('.sr').forEach((element) => {
    const sibling = Array.prototype.indexOf.call(element.parentNode.children, element);
    element.style.transitionDelay = `${Math.min(sibling, 5) * 90}ms`;
  });

  let pending = Array.from(document.querySelectorAll('.sr'));

  function formatCount(element, value) {
    return (element.getAttribute('data-pre') || '').replace('&lt;', '<')
      + value.toFixed(+(element.getAttribute('data-dec') || 0))
      + (element.getAttribute('data-suf') || '');
  }

  function count(element) {
    if (still) return;
    const target = +element.getAttribute('data-to');
    let start = null;
    (function step(timestamp) {
      if (!start) start = timestamp;
      let progress = Math.min(1, (timestamp - start) / 1400);
      progress = 1 - Math.pow(1 - progress, 3);
      element.textContent = formatCount(element, target * progress);
      if (progress < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  document.querySelectorAll('[data-to]').forEach((element) => {
    if (!still) element.textContent = formatCount(element, 0);
  });

  function check() {
    const viewportHeight = innerHeight;
    pending = pending.filter((element) => {
      if (!element.offsetParent) return true;
      const rect = element.getBoundingClientRect();
      if (rect.top < viewportHeight * .94 && rect.bottom > -40) {
        element.classList.add('in');
        element.querySelectorAll('[data-to]').forEach(count);
        return false;
      }
      return true;
    });
  }

  const slots = document.querySelectorAll('.slot[data-s]');

  function drift() {
    if (still) return;
    const viewportHeight = innerHeight;
    slots.forEach((element) => {
      if (!element.offsetParent) return;
      const rect = element.getBoundingClientRect();
      const offset = rect.top + rect.height / 2 - viewportHeight / 2;
      if (Math.abs(offset) > viewportHeight * 1.3) return;
      element.style.setProperty('--py', `${(-offset * parseFloat(element.getAttribute('data-s')) * 1.6).toFixed(1)}px`);
    });
  }

  const bar = document.getElementById('bar');
  let tick = false;

  function onScroll() {
    if (tick) return;
    tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const scrollPosition = scrollY;
      const maximum = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      bar.style.transform = `scaleX(${Math.min(1, scrollPosition / maximum)})`;
      check();
      drift();
    });
  }

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  setInterval(check, 500);

  function route(first = false) {
    let page = (location.hash || '').slice(1);
    if (!pages.includes(page)) page = 'home';
    root.setAttribute('data-pg', page);
    document.querySelectorAll('[data-page]').forEach((element) => {
      element.classList.toggle('off', element.getAttribute('data-page') !== page);
    });
    document.querySelectorAll('nav a').forEach((link) => {
      if (link.getAttribute('href') === `#${page}`) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.title = (page === 'home' ? '' : `${page[0].toUpperCase()}${page.slice(1)} – `) + 'Henry Okwudili';
    if (!first) scrollTo(0, 0);
    onScroll();
  }

  addEventListener('hashchange', () => route());
  route(true);
})();