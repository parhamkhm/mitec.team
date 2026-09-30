// mitec — scroll-linked section effects. Each is a track on the shared
// engine: geometry is cached in measure(), and update() maps the scroll
// position to transforms only, skipping frames where nothing changed. The
// engine parks every effect at its end state while its section is off
// screen. Reveal-once motion lives in reveal.js + motion.css, not here.

import { track, view, whenMotion, kick } from './engine.js';
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

// Testimonials: the cards rise from below, tilted back and fanned in toward
// the centre, then spread into their grid and flatten — while the section's
// top travels from the viewport's bottom to 35% down it.
function testimonialsTilt() {
  const sec = document.querySelector('.testimonials');
  if (!sec || sec.hidden) return []; // hidden until real quotes exist
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

// Process: a forest rail fills along the steps and fills each dot it
// reaches, as you scroll. The geometry is measured with or without motion,
// so the static rail has its length too.
//
// Stacked, the head follows a reading line at 60% of the viewport. Across
// (the five in a row), it starts only once the whole row is in view and
// reaches the end (step 5 lit) by the time the row's top is 25% down the
// viewport; arriving by a link to #process shows that end state at once,
// until the section next leaves the screen.
//
// In both, a card changes in one step as the head passes its mark (across,
// its dot; stacked, its middle): its fill, edge and numeral ease in over
// --dur-slow (home.css), so a card is either done or not started and no
// part-filled card ever rests across its paragraph. The card whose mark the
// head passed last is the one forest spotlight, and scrolling back reverses
// each change at the same mark. Per frame only transform and opacity change;
// the spotlight's data-surface flips only when its index does.
function processRail() {
  const box = document.querySelector('.process-track');
  if (!box) return null;
  const fill = box.querySelector('.process-rail__fill');
  const steps = $$('.process-grid > li', box);
  const cards = steps.map((li) => {
    const c = li.querySelector('.process-step');
    return { c, fill: c.querySelector('.process-step__fill'), line: c.querySelector('.process-step__line'), n: c.querySelector('.process-step__n') };
  });
  const end = (li) => li.offsetLeft + li.offsetWidth; // the start edge, on this RTL page
  const HYST = 6; // px past a dot, either way, before the spotlight moves: no flicker on the line
  let across = true, top = 0, from = 0, len = 1, at = [], dots = [], marks = [], last = null, spot = -1;
  let a0 = 0, a1 = 1;      // across: the scroll range from the whole row in view to its top at 25%
  // Arrived by a link: the end state until the section, once shown so, leaves
  // the screen (on a load with the hash it starts off screen, before the jump).
  let arrived = location.hash === '#process', shown = false;
  const arrive = () => {
    arrived = true;
    shown = false;
    last = null;
    kick();
  };
  addEventListener('hashchange', () => { if (location.hash === '#process') arrive(); });
  document.addEventListener('click', (e) => { if (e.target.closest?.('a[href$="#process"]')) arrive(); }, true);
  const setSpot = (s) => {
    if (s === spot) return;
    cards[spot]?.c.removeAttribute('data-surface');
    spot = s;
    if (s >= 0) cards[s].c.dataset.surface = 'dark';
  };
  return {
    el: box,
    measure() {
      const a = steps[0], z = steps[steps.length - 1];
      across = steps[1].offsetTop === a.offsetTop;
      len = (across ? end(a) - end(z) : z.offsetTop - a.offsetTop) || 1;
      at = steps.map((li) => (across ? end(a) - end(li) : li.offsetTop - a.offsetTop) / len);
      dots = at.map((t) => t * len);
      // Where each card changes, in px along the rail: across, at its dot;
      // stacked, at its middle (the dot sits 33px into the card).
      marks = across ? dots : steps.map((li) => li.offsetTop - a.offsetTop + li.offsetHeight / 2 - 33);
      from = a.offsetTop;
      box.style.setProperty('--rail-len', `${len}px`);
      box.style.setProperty('--rail-from', `${from}px`);
      top = docTop(box);
      a1 = top - 0.25 * view.h;
      a0 = Math.min(top + box.offsetHeight - view.h, a1 - 0.2 * view.h); // a short screen still gets some travel
      last = null;
    },
    update(dt, snap) {
      if (snap && shown) arrived = shown = false; // left: the next visit scrolls in as usual
      else if (!snap && arrived && this.on) shown = true; // this.on: the engine's observer has seen it on screen
      if (!root.classList.contains('motion')) return;
      // The rail head, in px along the rail from the first dot (negative
      // before the rail starts). Clamped to the range where anything changes:
      // up to just past the last mark's hysteresis band.
      const lead = dots[1] - dots[0];
      const end_ = Math.max(len, marks[marks.length - 1]) + HYST + 1;
      const h = across
        ? -lead + (arrived ? 1 : seg(view.y, a0, a1)) * (len + lead + HYST + 1)
        : clamp(view.y + 0.6 * view.h - (top + from + 33), -lead - 1, end_);
      if (h === last) return;
      const jump = last === null && arrived; // shown at once: no easing into the end state
      last = h;
      const p = clamp(h / len);
      let s = spot;
      while (s < marks.length - 1 && h >= marks[s + 1] + HYST) s++;
      while (s >= 0 && h < marks[s] - HYST) s--;
      if (jump) {
        box.classList.add('is-jumping');
        requestAnimationFrame(() => requestAnimationFrame(() => box.classList.remove('is-jumping')));
      }
      fill.style.transform = across ? `scaleX(${p})` : `scaleY(${p})`;
      steps.forEach((li, i) => li.classList.toggle('is-reached', p > 0 && p >= at[i] - 0.001));
      cards.forEach((k, i) => {
        const f = +(i <= s);
        k.fill.style.transform = across ? `scaleX(${f})` : `scaleY(${f})`;
        k.line.style.opacity = f;
        k.n.style.opacity = 0.55 + 0.45 * f; // .55: 3.45:1 on white, over large text's 3:1
      });
      setSpot(s);
    },
    reset() {
      fill.removeAttribute('style');
      steps.forEach((li) => li.classList.remove('is-reached'));
      cards.forEach((k) => [k.fill, k.line, k.n].forEach((el) => el.removeAttribute('style')));
      setSpot(-1);
      last = null;
    }
  };
}

// About: the heading's two lines start pushed apart (10vw each way; 6vw on
// phones) and meet over the title's own passage: from the moment the whole
// title is on screen to its top 45% down the viewport. Timed to the section,
// most of the travel happened before the title could be seen.
function aboutConverge() {
  const sec = document.querySelector('#about');
  const lines = sec ? $$('.about-title__line', sec) : [];
  if (lines.length < 2) return [];
  const title = lines[0].parentElement;
  let top = 0, h = 0, last = -1;
  return [{
    el: sec,
    measure() { top = docTop(title); h = title.offsetHeight; last = -1; },
    update() {
      const t = seg(view.y, top + h - view.h, top - 0.45 * view.h);
      if (t === last) return;
      last = t;
      const d = (view.w < 760 ? 6 : 10) * (view.w / 100) * (1 - outCubic(t));
      lines[0].style.transform = d ? `translateX(${-d}px)` : '';
      lines[1].style.transform = d ? `translateX(${d}px)` : '';
    }
  }];
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
    const offs = [...testimonialsTilt(), ...aboutConverge(), ...ctaEcho()].map(track);
    return () => {
      offs.forEach((off) => off());
      rail?.reset();
      $$('.testimonial, .about-title__line, .cta-band__echo').forEach((el) => el.removeAttribute('style'));
    };
  });
}
