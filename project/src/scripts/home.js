// mitec — home page entry.
// Small, independent behaviours (nav, scroll-spy, FAQ) plus the motion layer
// under ./motion/. No dependencies, no build step — this loads as a
// plain ES module straight off the page.

import { whenMotion } from './motion/engine.js';
import { initReveal } from './motion/reveal.js';
import { initPortal } from './motion/portal.js';
import { initEffects } from './motion/effects.js';

function initNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  const close = () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  const open = () => {
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  };

  toggle.addEventListener('click', () => {
    if (menu.classList.contains('is-open')) close();
    else open();
  });

  // Close after choosing a link, on Escape, or when the layout grows past
  // the breakpoint where the menu is no longer an overlay.
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) close();
  });
}

// The nav marks the section under a thin band at ~45% of the viewport.
// Sections without a nav link (testimonials, FAQ) clear the mark rather than
// leave a stale one claiming to be current.
function initScrollSpy() {
  const links = [...document.querySelectorAll('.navbar__link')];
  const sections = document.querySelectorAll('main > section[id]');
  const set = (id) => {
    for (const a of links) {
      const on = a.hash === `#${id}`;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    }
  };
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) set(e.target.id);
  }, { rootMargin: '-45% 0px -54% 0px' });
  sections.forEach((s) => io.observe(s));
}

function initFaq() {
  const list = document.getElementById('faqList');
  if (!list) return;
  const items = Array.from(list.querySelectorAll('.faq-item'));

  function setOpen(item, isOpen) {
    const btn = item.querySelector('.faq-item__q');
    const panel = item.querySelector('.faq-item__a');
    const chevron = item.querySelector('.faq-item__chevron');
    btn.setAttribute('aria-expanded', String(isOpen));
    panel.hidden = !isOpen;
    // The marker is a masked Lucide glyph, not a "+" character, so the open
    // state swaps the mask class rather than writing text into the span.
    if (chevron) {
      chevron.classList.toggle('icon-minus', isOpen);
      chevron.classList.toggle('icon-plus', !isOpen);
    }
  }

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-item__q');
    if (!btn) return;
    const item = btn.closest('.faq-item');
    const willOpen = btn.getAttribute('aria-expanded') !== 'true';
    // Single-open accordion: opening one closes every other item.
    for (const other of items) setOpen(other, other === item && willOpen);
  });
}

initNav();
initScrollSpy();
initPortal();
initEffects();
initFaq();
whenMotion(initReveal);
