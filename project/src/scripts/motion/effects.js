// mitec — scroll-linked section effects. Each is a track on the shared
// engine: geometry is cached in measure(), and update() maps the scroll
// position to transforms only, skipping frames where nothing changed. The
// engine parks every effect at its end state while its section is off
// screen. Reveal-once motion lives in reveal.js + motion.css, not here.

import { track, view, whenMotion } from './engine.js';
import { clamp, seg, lerp, outCubic } from './easing.js';

const root = document.documentElement;
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// Document top of an element from layout offsets, so transforms (reveals,
// parallax) never skew the cached geometry.
const docTop = (el) => {
  let y = 0;
  for (let n = el; n; n = n.offsetParent) y += n.offsetTop;
  return y;
};

// Progress of el from "its top enters the viewport's bottom" (0) to "its
// bottom leaves the viewport's top" (1).
function passing(el, render) {
  let top = 0, h = 0, last = -1;
  return {
    el,
    measure() { top = docTop(el); h = el.offsetHeight; last = -1; },
    update() {
      const t = seg(view.y, top - view.h, top + h);
      if (t !== last) render((last = t));
    }
  };
}

// Work: the screenshot drifts inside its tile, +4% → −4% of its height.
const workParallax = () => $$('.work-row__media').map((tile) => {
  const shot = tile.querySelector('.work-row__shot');
  return passing(tile, (t) => { shot.style.transform = `translateY(${lerp(4, -4, t)}%)`; });
});

// Testimonials: the cards rise from below, tilted back and fanned in toward
// the centre, then spread into their grid and flatten — while the section's
// top travels from the viewport's bottom to 35% down it.
function testimonialsTilt() {
  const sec = document.querySelector('.testimonials');
  if (!sec) return [];
  const grid = sec.querySelector('.testimonials-grid');
  const cards = $$('.testimonial', sec);
  const span = 1 - 0.08 * (cards.length - 1);
  let top = 0, k = 1, dirs = [], last = -1;
  return [{
    el: sec,
    measure() {
      top = docTop(sec);
      k = view.w < 760 ? 0.6 : 1; // phones: ~40% shorter travel
      const g = grid.getBoundingClientRect();
      dirs = cards.map((c) => {
        const r = c.getBoundingClientRect();
        const d = r.left + r.width / 2 - (g.left + g.width / 2);
        return Math.abs(d) < 8 ? 0 : -Math.sign(d); // toward the centre; 0 when stacked
      });
      last = -1;
    },
    update() {
      const sp = seg(view.y, top - view.h, top - 0.35 * view.h);
      if (sp === last) return;
      last = sp;
      cards.forEach((c, i) => {
        const t = clamp((sp - 0.08 * i) / span);
        const r = 1 - outCubic(t);
        const fan = dirs[i] ? -3 * dirs[i] : i % 2 ? -3 : 3;
        c.style.opacity = seg(t, 0, 0.3);
        c.style.transform = r ? `translate(${12 * k * dirs[i] * r}%, ${140 * k * r}px) rotateX(${24 * r}deg) rotateZ(${fan * r}deg)` : '';
      });
    }
  }];
}

// Process: a forest rail fills along the steps; each numeral comes up to
// full strength once the fill has passed it. Across (≥1024px) the fill runs
// while the steps rise through the viewport; stacked, it follows a reading
// line at 60% of the viewport. The geometry is measured with or without
// motion, so the static rail has its length too.
function processRail() {
  const box = document.querySelector('.process-track');
  if (!box) return null;
  const fill = box.querySelector('.process-rail__fill');
  const steps = $$('.process-grid > li', box);
  const end = (li) => li.offsetLeft + li.offsetWidth; // the start edge, on this RTL page
  let across = true, top = 0, from = 0, len = 1, at = [], last = -1;
  return {
    el: box,
    measure() {
      const a = steps[0], z = steps[steps.length - 1];
      across = steps[1].offsetTop === a.offsetTop;
      len = (across ? end(a) - end(z) : z.offsetTop - a.offsetTop) || 1;
      at = steps.map((li) => (across ? end(a) - end(li) : li.offsetTop - a.offsetTop) / len);
      from = a.offsetTop;
      box.style.setProperty('--rail-len', `${len}px`);
      box.style.setProperty('--rail-from', `${from}px`);
      top = docTop(box);
      last = -1;
    },
    update() {
      if (!root.classList.contains('motion')) return;
      const p = across
        ? seg(view.y, top - 0.85 * view.h, top - 0.35 * view.h)
        : seg(view.y + 0.6 * view.h, top + from + 33, top + from + 33 + len);
      if (p === last) return;
      last = p;
      fill.style.transform = across ? `scaleX(${p})` : `scaleY(${p})`;
      steps.forEach((li, i) => li.classList.toggle('is-reached', p > 0 && p >= at[i] - 0.001));
    },
    reset() {
      fill.removeAttribute('style');
      steps.forEach((li) => li.classList.remove('is-reached'));
      last = -1;
    }
  };
}

// About: the heading's two lines start pushed apart and meet by the time the
// section is centred (10vw each way; 6vw on phones).
function aboutConverge() {
  const sec = document.querySelector('#about');
  const lines = sec ? $$('.about-title__line', sec) : [];
  if (lines.length < 2) return [];
  return [passing(sec, (t) => {
    const d = (view.w < 760 ? 6 : 10) * (view.w / 100) * (1 - outCubic(seg(t, 0, 0.5)));
    lines[0].style.transform = d ? `translateX(${-d}px)` : '';
    lines[1].style.transform = d ? `translateX(${d}px)` : '';
  })];
}

// Closing CTA: the laptop echo grows from .92 to 1.04 as the band passes.
function ctaEcho() {
  const band = document.querySelector('.cta-band');
  const echo = band?.querySelector('.cta-band__echo');
  return echo ? [passing(band, (t) => { echo.style.transform = `scale(${lerp(0.92, 1.04, t)})`; })] : [];
}

export function initEffects() {
  const rail = processRail();
  if (rail) track(rail);
  whenMotion(() => {
    const offs = [...workParallax(), ...testimonialsTilt(), ...aboutConverge(), ...ctaEcho()].map(track);
    return () => {
      offs.forEach((off) => off());
      rail?.reset();
      $$('.work-row__shot, .testimonial, .about-title__line, .cta-band__echo').forEach((el) => el.removeAttribute('style'));
    };
  });
}
