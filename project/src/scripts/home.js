// mitec — home page entry.
// Small, independent behaviours (nav, scroll-spy, the project count, FAQ,
// quick scope) plus the motion layer under ./motion/. No dependencies, no
// build step — this loads as a plain ES module straight off the page.

import { whenMotion } from './motion/engine.js';
import { initReveal } from './motion/reveal.js';
import { initPortal } from './motion/portal.js';
import { initEffects } from './motion/effects.js';
import { initScope } from './scope.js';
import { initWork } from './work.js';
import { faNumber } from '../utils/format.js';
import { setIcon } from '../utils/icon.js';
import { APP_CONFIG } from '../config/app.config.js';
import { loadPortfolio } from '../utils/portfolio.js';

// The menu of the phone and tablet bar (up to 860px), a disclosure. While it
// is open, everything but the toggle and the menu is inert and Tab cycles
// between the two; the toggle reads «بستن فهرست» and shows a cross. Escape
// closes it and hands focus back to the toggle. Choosing a link closes it and
// moves on to the link's target; a tap outside closes it and activates
// nothing, since the page under it is inert.
function initNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;
  const bar = matchMedia('(max-width: 860px)');
  const glyph = toggle.querySelector('.icon');
  const rest = ['.skip-link', '.navbar .logo', '.navbar__cta--bar', 'main', 'footer']
    .map((s) => document.querySelector(s))
    .filter(Boolean);
  let isOpen = false;

  const set = (open, refocus = false) => {
    isOpen = open;
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'بستن فهرست' : 'باز کردن فهرست');
    setIcon(glyph, open ? 'x' : 'menu');
    for (const el of rest) el.inert = open;
    if (!open && refocus) toggle.focus();
  };
  // The toggle, then what the menu shows (the desktop-only CTA is hidden here).
  const stops = () => [toggle, ...[...menu.querySelectorAll('a, button')].filter((el) => el.getClientRects().length)];

  toggle.addEventListener('click', () => set(!isOpen));
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) set(false);
  });
  document.addEventListener('click', (e) => {
    if (isOpen && !menu.contains(e.target) && !toggle.contains(e.target)) set(false);
  });
  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      set(false, true);
    } else if (e.key === 'Tab') {
      const list = stops();
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    }
  });
  // Past 860px the menu is an ordinary row again.
  bar.addEventListener('change', () => {
    if (!bar.matches && isOpen) set(false);
  });
}

// Every WhatsApp, Telegram and Instagram link takes its address from
// src/config/app.config.js (contact), so each is set in one place. The markup
// holds the same addresses for visitors without JS; keep them in step.
function initChannels() {
  for (const link of document.querySelectorAll('[data-channel]')) {
    const href = APP_CONFIG.contact?.[link.dataset.channel];
    if (href) link.href = href;
  }
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
    item.classList.toggle('is-open', isOpen);
    // A closed panel stays in the layout at zero height, so opening can
    // animate (home.css), but inert: nothing in it can take focus or be read.
    panel.inert = !isOpen;
    // The marker is a Lucide glyph from the sprite, not a "+" character, so
    // the open state swaps the glyph rather than writing text.
    if (chevron) setIcon(chevron, isOpen ? 'minus' : 'plus');
  }

  // Take over from the no-JS default, where every answer is open and readable
  // (the buttons do nothing without JS). html.js already collapses the panels
  // in CSS before first paint, so this only syncs state and ARIA.
  for (const item of items) {
    item.querySelector('.faq-item__a').hidden = false;
    setOpen(item, false);
  }

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-item__q');
    if (!btn) return;
    const item = btn.closest('.faq-item');
    const willOpen = btn.getAttribute('aria-expanded') !== 'true';
    const top = btn.getBoundingClientRect().top;
    // Single-open accordion: opening one closes every other item.
    for (const other of items) setOpen(other, other === item && willOpen);
    holdInPlace(btn, top);
  });

  // Closing the open item above collapses it over --dur-slow, which would
  // carry the question just tapped up the screen (off it, on a phone with a
  // long answer open). Scroll along with the collapse, frame by frame, so the
  // question stays where it was under the finger.
  function holdInPlace(el, top) {
    const ms = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dur-slow')) || 0;
    const end = performance.now() + ms + 60;
    const tick = () => {
      const dy = el.getBoundingClientRect().top - top;
      if (Math.abs(dy) >= 0.5) window.scrollBy({ top: dy, behavior: 'instant' });
      if (performance.now() < end) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}

// The Proof room's «projects delivered» figure is the number of projects in
// src/data/portfolio.json, so adding one there updates it. The markup holds
// the count as last written, for visitors without JS or if the list fails.
async function initProjectCount() {
  const value = document.querySelector('[data-stat="projects"]');
  if (!value) return;
  try {
    const projects = await loadPortfolio();
    if (Array.isArray(projects) && projects.length) value.textContent = faNumber(projects.length);
  } catch (e) {
    console.warn('[proof] project count unavailable; keeping the figure in the markup', e);
  }
}

initNav();
initChannels();
initScrollSpy();
initProjectCount();
initPortal();
initEffects();
initFaq();
initScope();
initWork();
whenMotion(initReveal);
