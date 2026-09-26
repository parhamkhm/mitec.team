// mitec — scroll-linked section effects. Each is a track on the shared
// engine: geometry is cached in measure(), and update() maps the scroll
// position to transforms only, skipping frames where nothing changed. The
// engine parks every effect at its end state while its section is off
// screen. Reveal-once motion lives in reveal.js + motion.css, not here.

import { track, view, whenMotion } from './engine.js';
import { clamp, seg, lerp, damp, outCubic, inOutSine } from './easing.js';

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

// Work: each laptop enters tilted back and turned so its screen faces the
// text — perspective(1400px) rotateX(14deg) rotateY(±10deg), ±6deg when the
// row is stacked — and flattens as the row's media reaches the viewport's
// centre, while its ambient glow comes up from .2 to .45 on the same
// progress (the glow's wrapper holds .75, so the image runs .27 → .6 and
// hover can still lift it; home.css). Damped like the portal, so a wheel's
// steps glide instead of jumping. The side is measured, not assumed: rows
// swap sides from 1024px; stacked rows alternate.
function workTilt() {
  return $$('.work-row__media').map((media, i) => {
    const laptop = media.querySelector('.laptop');
    const glow = media.querySelector('.work-row__glow img');
    const text = media.parentElement.querySelector('.work-row__text');
    let from = 0, to = 1, ry = 10, ps = -1, drawn = -1;
    const render = (p) => {
      drawn = p;
      const k = 1 - inOutSine(p); // 1 = fully tilted, 0 = flat
      laptop.style.transform = k ? `perspective(1400px) rotateX(${14 * k}deg) rotateY(${ry * k}deg)` : '';
      glow.style.opacity = k ? lerp(0.45, 0.2, k) / 0.75 : '';
    };
    return {
      el: media,
      measure() {
        const top = docTop(media);
        from = top - view.h;                                 // its top meets the viewport's bottom
        to = top + media.offsetHeight / 2 - view.h / 2;      // its centre meets the viewport's centre
        const m = media.getBoundingClientRect();
        const t = text.getBoundingClientRect();
        const d = t.left + t.width / 2 - (m.left + m.width / 2);
        // rotateY(+) turns the screen to face the right.
        ry = Math.abs(d) < 8 ? (i % 2 ? -6 : 6) : 10 * Math.sign(d);
        drawn = -1;
      },
      update(dt, snap) {
        const p = seg(view.y, from, to);
        ps = snap || ps < 0 ? p : damp(ps, p, dt, 70);
        if (Math.abs(p - ps) < 0.001) ps = p;
        if (ps !== drawn) render(ps);
        return ps !== p;
      }
    };
  });
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
// reaches. Across (≥1024px) the fill runs
// while the steps rise through the viewport; stacked, it follows a reading
// line at 60% of the viewport. The geometry is measured with or without
// motion, so the static rail has its length too.
//
// The same head position colours the step cards: each fills with
// --color-step-fill over the stretch of rail leading into its dot (the first
// over an equal lead-in before the rail starts), and the card whose dot the
// head reached last is the one forest spotlight. Per frame only transform and
// opacity change; the spotlight's data-surface flips only when its index does.
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
  let across = true, top = 0, from = 0, len = 1, at = [], dots = [], last = null, spot = -1;
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
      from = a.offsetTop;
      box.style.setProperty('--rail-len', `${len}px`);
      box.style.setProperty('--rail-from', `${from}px`);
      top = docTop(box);
      last = null;
    },
    update() {
      if (!root.classList.contains('motion')) return;
      // The rail head, in px along the rail from the first dot (negative
      // before the rail starts). Clamped to the range where anything changes.
      const lead = dots[1] - dots[0];
      const raw = across
        ? ((view.y - top + 0.85 * view.h) / (0.5 * view.h)) * len
        : view.y + 0.6 * view.h - (top + from + 33);
      const h = clamp(raw, -lead - 1, len + HYST + 1); // past the last dot's hysteresis band
      if (h === last) return;
      last = h;
      const p = clamp(h / len);
      fill.style.transform = across ? `scaleX(${p})` : `scaleY(${p})`;
      steps.forEach((li, i) => li.classList.toggle('is-reached', p > 0 && p >= at[i] - 0.001));
      cards.forEach((k, i) => {
        const from_ = i ? dots[i - 1] : -lead;
        const f = clamp((h - from_) / (dots[i] - from_));
        k.fill.style.transform = across ? `scaleX(${f})` : `scaleY(${f})`;
        k.line.style.opacity = f;
        k.n.style.opacity = 0.35 + 0.65 * f;
      });
      let s = spot;
      while (s < dots.length - 1 && h >= dots[s + 1] + HYST) s++;
      while (s >= 0 && h < dots[s] - HYST) s--;
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
    const offs = [...workTilt(), ...testimonialsTilt(), ...aboutConverge(), ...ctaEcho()].map(track);
    return () => {
      offs.forEach((off) => off());
      rail?.reset();
      $$('.work-row .laptop, .work-row__glow img, .testimonial, .about-title__line, .cta-band__echo').forEach((el) => el.removeAttribute('style'));
    };
  });
}
