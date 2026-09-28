// mitec — the portal hero. The visitor dives into a laptop's screen: the
// hero copy lifts off the display, the screen shows a short intro statement
// while a loading line fills, then the glass fades to the light room behind
// and the camera flies through the display into it.
//
// Every layer is a pure function of one damped progress value, so the scene
// plays the same forwards and backwards and there are no one-shot triggers
// to fall out of sync. Geometry (display size, where the copy fits, scroll
// length, exit scale) is measured on resize only; the per-frame path writes
// transforms and opacity and nothing else.
//
// Round the laptop: three decorative float cards (site-copy.json →
// hero.floatCards) that drift off as the dive starts, and a faded wall of
// the portfolio's screenshots behind it, filled after first paint.
//
// Also owns the nav's forest → light switch, which follows the scene — or,
// without motion, the bottom edge of the static forest band.

import { track, view, whenMotion, kick } from './engine.js';
import { clamp, seg, lerp, damp, inCubic, outCubic, inOutSine, inOutCubic } from './easing.js';
import { icon as glyph } from '../../utils/icon.js';

const DEPTH = 1600; // the stage's perspective (portal.css)

// The float cards: which edge of the lid each one overlaps and where along
// it (a fraction of the lid, physical left → right or top → bottom), its
// tilt, how far it drifts out as the dive starts, and how far it leans toward
// a fine pointer (px). A side card reaches INTRUDE px onto the display, less
// than the copy's 48px margin there. Where the copy is wider than that (the
// H1 grows with the display), a card slides along its edge to the nearest
// spot CLEAR px from every line and button, or sits this layout out.
const FLOATS = {
  seo: { side: 'top', at: 0.15, r: -2, drift: 48, lean: 8 },
  crm: { side: 'right', at: 0.22, r: 2, drift: 72, lean: 14 },
  analytics: { side: 'left', at: 0.68, r: -3, drift: 60, lean: 10 }
};
const INTRUDE = 36;
const CLEAR = 20;
// The top card overlaps the lid by LAP px: its text line stays above the
// silver rim, which would lift the background under it through the card's
// 8% translucency.
const LAP = 12;
// The analytics card's chart: an area and a line, in the card's mint.
const CHART = '<svg class="portal__card-chart" viewBox="0 0 204 54" width="204" height="54">'
  + '<defs><linearGradient id="portal-chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".35"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs>'
  + '<path d="M0 46 26 40 52 43 78 30 104 33 130 22 156 24 182 10 204 6V54H0Z" fill="url(#portal-chart-fill)"/>'
  + '<path d="M0 46 26 40 52 43 78 30 104 33 130 22 156 24 182 10 204 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/></svg>';
const WALL_TILES = 20; // 5 × 4

const make = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text) n.textContent = text;
  return n;
};
const icon = (name) => {
  const box = make('span', 'portal__card-ico');
  box.append(glyph(name));
  return box;
};

export function initPortal() {
  const portal = document.querySelector('.portal');
  if (!portal) return;
  const nav = document.querySelector('.navbar');
  const q = (s) => portal.querySelector(s);
  const qa = (s) => [...portal.querySelectorAll(s)];
  const stage = q('.portal__stage');
  const copy = q('.portal__copy');
  const kids = copy.children;
  const title = q('.portal__title');
  const sub = q('.portal__sub');
  const actions = q('.portal__actions');
  const say = q('.portal__statement');
  const lines = qa('.portal__intro-line');
  const words = qa('.portal__intro .w');
  const phrases = qa('.portal__intro-phrase');
  const loader = q('.portal__loader');
  const fill = q('.portal__loader span');
  const room = q('.portal__room');
  const frame = q('.portal__frame');
  const glass = q('.portal__glass');
  const shine = q('.portal__reflection');
  const glow = q('.portal__glow');
  const base = q('.portal__base');
  const shadow = q('.portal__deck-shadow');
  const cardsBox = q('.portal__cards');
  const plane = q('.portal__works-plane');
  const hint = q('.portal__hint');
  const card = q('.stat-bar');
  const stats = qa('.stat-block');
  // The copy lifts off top-down: eyebrow, title, sub, actions — all gone
  // before the statement starts at .16.
  const lift = [...copy.children].map((el, i) => [el, [0, 0.015, 0.03, 0.045][i], [0.1, 0.12, 0.14, 0.15][i]]);
  const reveal = [...words, ...phrases, ...lines];
  const styled = [hint, room, frame, glass, shine, glow, base, shadow, say, loader, fill, card, ...stats, ...reveal, ...lift.map(([el]) => el)];

  let light = null;
  const setNav = (on) => {
    if (!nav || on === light) return;
    light = on;
    if (on) nav.removeAttribute('data-surface');
    else nav.dataset.surface = 'dark';
  };

  // ---- without motion: the nav flips once the forest band is out from under it
  let edge = 0;
  const flat = {
    measure() { edge = say.getBoundingClientRect().bottom + scrollY - (nav?.offsetHeight || 0) / 2; },
    update() { setNav(view.y >= edge); }
  };

  // ---- the float cards: built once, from site-copy.json
  let floats = [];
  let loading = false;
  let cardsOn = false;
  let lx = 0, ly = 0, tx = 0, ty = 0; // the lean, −1…1: current and target
  let leanX = 0, leanY = 0;           // the lean last drawn
  let gone = false;                   // drawn drifted out and faded: nothing to write until p comes back
  async function loadCards() {
    if (loading || !cardsBox) return;
    loading = true;
    try {
      const res = await fetch(new URL('../../data/site-copy.json', import.meta.url));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()).hero?.floatCards;
      if (!data) return;
      const bodies = {
        seo: () => {
          const b = make('div');
          const label = make('span');
          label.append(`${data.seo.before} `, make('span', 'portal__card-num', data.seo.value), ` ${data.seo.after}`);
          b.append(icon('search'), label);
          return b;
        },
        crm: () => {
          const b = make('div');
          const text = make('div');
          text.append(make('div', 'portal__card-title', data.crm.title), make('div', 'portal__card-meta', data.crm.meta));
          b.append(icon('shopping-bag'), text, make('span', 'portal__card-dot'));
          return b;
        },
        analytics: () => {
          const b = make('div');
          const row = make('div', 'portal__card-row');
          row.append(make('span', 'portal__card-label', data.analytics.label), make('span', 'portal__card-value', data.analytics.value));
          b.append(row);
          b.insertAdjacentHTML('beforeend', CHART);
          return b;
        }
      };
      floats = Object.entries(FLOATS).map(([key, cfg], i) => {
        const el = make('div', `portal__card portal__card--${key}`);
        const body = bodies[key]();
        body.className = 'portal__card-body';
        body.style.setProperty('--r', `${cfg.r}deg`);
        body.style.setProperty('--i', i);
        el.append(body);
        return { el, ...cfg, x: 0, y: 0, ux: 0, uy: 0 };
      });
      cardsBox.append(...floats.map((c) => c.el));
      placeCards();
      drawn = -1;
      kick();
    } catch (e) {
      console.warn('[portal] float cards unavailable', e);
    }
  }

  // ---- the wall of work: filled once, when the page is idle after first paint
  let walled = false;
  function fillWall() {
    if (walled || !plane) return;
    walled = true;
    const idle = window.requestIdleCallback || ((f) => setTimeout(f, 300));
    requestAnimationFrame(() => idle(async () => {
      try {
        const res = await fetch(new URL('../../data/portfolio.json', import.meta.url));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const shots = (await res.json()).map((p) => p.image).filter((im) => im?.src960);
        if (!shots.length) return;
        const tiles = document.createDocumentFragment();
        for (let i = 0; i < WALL_TILES; i++) {
          const im = shots[i % shots.length];
          const img = make('img');
          img.alt = '';
          img.loading = 'lazy';
          img.decoding = 'async';
          img.fetchPriority = 'low';
          img.width = 960;
          img.height = Math.round((960 * im.height) / im.width) || 600;
          img.src = im.src960;
          tiles.append(img);
        }
        plane.append(tiles);
      } catch (e) {
        console.warn('[portal] wall of work unavailable', e);
      }
    }, { timeout: 3000 }));
  }

  // ---- the scene
  let top = 0, L = 1, sExit = 1, rise = 0, tilt = 0, lite = false, stacked = false, tau = 90;
  let W = 1, H = 1, dy0 = 0;
  let sw = 1, sh = 1, bz = 0, chinH = 0;
  let ps = -1, drawn = -1;
  const show = (el, t, d) => {
    el.style.opacity = t;
    el.style.transform = t < 1 ? `translateY(${d * (1 - t)}px)` : '';
  };
  // The cards drift out from the display and fade in the first 15% of the
  // dive — gone before the statement — and lean toward a fine pointer.
  function drawCards(p) {
    if (p >= 0.18 && gone) return;
    gone = p >= 0.18;
    leanX = lx;
    leanY = ly;
    const t = outCubic(seg(p, 0, 0.18));
    const o = 1 - inOutSine(seg(p, 0.02, 0.14));
    for (const c of floats) {
      if (c.el.hidden) continue;
      c.el.style.opacity = o;
      c.el.style.transform = `translate(${c.x + c.ux * c.drift * t + lx * c.lean}px, ${c.y + c.uy * c.drift * t + ly * c.lean}px)`;
    }
  }
  // What the cards keep clear of, in stage px at rest: the eyebrow, the H1's
  // and sub's lines and the buttons (layout offsets, so the lift transforms
  // don't count), and the scroll hint.
  function obstacles() {
    const out = [];
    const add = (el, rects) => {
      const dy = el.offsetTop - el.getBoundingClientRect().top; // the copy fills the stage
      for (const r of rects) if (r.width > 1) out.push([r.left, r.top + dy, r.right, r.bottom + dy]);
    };
    const range = document.createRange();
    for (const el of [title, sub]) {
      range.selectNodeContents(el);
      add(el, range.getClientRects());
    }
    for (const el of [kids[0], ...actions.children]) add(el, [el.getBoundingClientRect()]);
    if (!hint.hidden) {
      const r = hint.getBoundingClientRect(), y = stage.getBoundingClientRect().top;
      out.push([r.left, r.top - y, r.right, r.bottom - y]);
    }
    return out;
  }
  // From the measured lid, tilted and projected like the frame at rest: each
  // card on its edge, clear of the copy, inside the viewport, under the nav.
  function placeCards() {
    cardsOn = floats.length > 0 && !portal.classList.contains('portal--stacked');
    gone = false;
    if (!cardsOn) return;
    const a = (tilt * Math.PI) / 180;
    // A point on the display's plane (from its centre) → the stage.
    const at = (x, y) => {
      const k = DEPTH / (DEPTH - y * Math.sin(a));
      return [sw / 2 + x * k, sh / 2 + y * Math.cos(a) * k];
    };
    const block = obstacles();
    const lw = W + 2 * bz, lh = H + bz + chinH;
    for (const c of floats) {
      c.el.hidden = false;
      const cw = c.el.offsetWidth, ch = c.el.offsetHeight;
      // Where the card sits for a spot `f` (a fraction) along its edge.
      const spot = (f) => {
        let x, y;
        if (c.side === 'top') {
          [x, y] = at(-W / 2 - bz + f * lw, -H / 2 - bz);
          x -= cw / 2;
          y += LAP - ch / 2;
        } else {
          const dir = c.side === 'right' ? 1 : -1;
          [x, y] = at(dir * (W / 2 - INTRUDE), -H / 2 - bz + f * lh);
          if (dir < 0) x -= cw;
        }
        return [clamp(x, 16, sw - 16 - cw), clamp(y - ch / 2, 76, sh - 16 - ch)];
      };
      const clear = ([x, y]) => !block.some(([l, t, r, b]) => x - CLEAR < r && x + cw + CLEAR > l && y - CLEAR < b && y + ch + CLEAR > t);
      // The nearest clear spot, stepping 2% of the edge either way.
      let pos = null;
      for (let i = 0; i <= 50 && !pos; i++) {
        for (const f of i ? [c.at - i * 0.02, c.at + i * 0.02] : [c.at]) {
          if (f < 0.04 || f > 0.96) continue;
          const xy = spot(f);
          if (clear(xy)) {
            pos = xy;
            break;
          }
        }
      }
      c.el.hidden = !pos;
      if (!pos) continue;
      [c.x, c.y] = pos;
      // Drift out along the line from the display's centre to the card's.
      const ux = c.x + cw / 2 - sw / 2, uy = c.y + ch / 2 - sh / 2;
      const len = Math.hypot(ux, uy) || 1;
      c.ux = ux / len;
      c.uy = uy / len;
    }
  }
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const onPointer = (e) => {
    if (!cardsOn || lite || !pointer.matches || ps > 0.15) return;
    tx = clamp((e.clientX / sw) * 2 - 1, -1, 1);
    ty = clamp((e.clientY / sh) * 2 - 1, -1, 1);
    kick();
  };

  // Reveal els one after another across [a, b], each over w of progress.
  const stagger = (els, p, a, b, w, d) => {
    const step = (b - a - w) / Math.max(els.length - 1, 1);
    els.forEach((el, i) => show(el, outCubic(seg(p, a + i * step, a + i * step + w)), d));
  };

  function render(p, onScreen) {
    drawn = p;
    portal.classList.toggle('is-live', onScreen && p < 1);

    // Phase 1 · lean in — the copy lifts off, the lid comes upright.
    const h = 1 - seg(p, 0, 0.03);
    hint.style.opacity = h;
    if (hint.hidden !== !h) hint.hidden = !h;

    let o = 1;
    for (const [el, a, b] of lift) {
      const t = seg(p, a, b);
      o = 1 - inCubic(t);
      el.style.opacity = o;
      el.style.transform = t ? `translateY(${-t * rise}px)` : '';
    }
    // Invisible means unfocusable. Only the actions go inert, so the heading
    // stays in the accessibility tree.
    if (actions.inert !== !o) actions.inert = !o;

    const lean = inOutSine(seg(p, 0, 0.18));
    const s = p < 0.18 ? lerp(1, 1.25, lean)
      : p < 0.54 ? lerp(1.25, 1.6, inOutSine(seg(p, 0.18, 0.5)))
      : lerp(1.6, sExit, inCubic(seg(p, 0.54, 0.8)));
    // Stacked, the laptop rises from under the copy late, once the copy is
    // mostly gone (its lit screen never passes behind readable text), and is
    // in place when the statement starts at .16.
    const up = inCubic(seg(p, 0, 0.16));
    frame.style.transform = `translateY(${dy0 * (1 - up)}px) scale(${s}) rotateX(${tilt * (1 - lean)}deg)`;
    base.style.transform = shadow.style.transform = `translateY(${0.06 * H * inCubic(seg(p, 0, 0.18))}px)`; // falls away first
    if (cardsOn) drawCards(p);

    // Phase 2 · the statement, read while the screen slowly approaches.
    const out = inCubic(seg(p, 0.48, 0.54)); // at 0 before the glass starts to fade
    say.style.opacity = p < 0.16 ? 0 : 1 - out;
    say.style.transform = `translateY(${-12 * out}px) scale(${lerp(0.97, 1.03, seg(p, 0.16, 0.54))})`;
    if (lite) {
      show(lines[0], outCubic(seg(p, 0.16, 0.28)), 14);
      show(lines[1], outCubic(seg(p, 0.27, 0.4)), 14);
    } else {
      stagger(words, p, 0.16, 0.28, 0.04, 14);
      stagger(phrases, p, 0.27, 0.4, 0.05, 14);
    }
    loader.style.opacity = outCubic(seg(p, 0.16, 0.2));
    fill.style.transform = `scaleX(${inOutSine(seg(p, 0.18, 0.46))})`;

    // Phase 3 · the screen loads, and the camera goes through it.
    glass.style.opacity = 1 - inOutSine(seg(p, 0.54, 0.66));
    glow.style.opacity = lerp(0.8, 1, outCubic(seg(p, 0.54, 0.66)));
    if (!lite) shine.style.transform = `translateX(${lerp(W, -0.35 * W, seg(p, 0.2, 0.75))}px)`;
    const f = 1 - seg(p, 0.8, 0.85);
    frame.style.opacity = f;
    frame.style.visibility = f ? '' : 'hidden';

    // Phase 4 · through — the room grows slower than the frame (depth).
    const rs = p < 0.54
      ? lerp(0.42, 0.5, inOutSine(seg(p, 0, 0.54)))
      : lerp(0.5, 1, inOutCubic(seg(p, 0.54, 0.88)));
    room.style.transform = rs === 1 ? 'none' : `scale(${rs})`;
    card.style.opacity = outCubic(seg(p, 0.74, 0.8)); // arrives with its first stat, never empty
    stagger(stats, p, 0.74, 0.88, 0.06, 24);

    // Hysteresis keeps the nav from flickering at the line.
    setNav(light ? p >= 0.84 : p >= 0.86);
  }

  const scene = {
    el: portal,
    measure() {
      // The layout itself (display and lid, where the copy goes and how big
      // the H1 is, where the laptop starts) lives inline after the portal in
      // index.html, which runs it before first paint; calling the same
      // function here keeps the two in step. The rest is for scrolling.
      const g = window.mitecPortalLayout(view.h, view.lite);
      ({ sw, sh, W, H, dy0, lite, tilt, stacked } = g);
      bz = g.bezel;
      chinH = g.chin;
      L = g.L;
      // No roll, so the display only has to clear the viewport itself.
      sExit = Math.max(view.w / W, view.h / H) * 1.12;
      rise = 0.14 * view.h;
      tau = view.coarse ? 45 : 90;
      // Lite and full animate different spans; start both from clean.
      for (const el of reveal) el.removeAttribute('style');

      if (!stacked) loadCards();
      placeCards();
      if (!lite && !stacked) fillWall();
      if (lite) tx = ty = lx = ly = 0;

      top = portal.getBoundingClientRect().top + scrollY;
      drawn = -1;
    },
    update(dt, snap) {
      const p = clamp((view.y - top) / L);
      ps = snap || ps < 0 ? p : damp(ps, p, dt, tau);
      if (Math.abs(p - ps) < 0.0005) ps = p;
      lx = snap ? tx : damp(lx, tx, dt, 160);
      ly = snap ? ty : damp(ly, ty, dt, 160);
      if (Math.abs(tx - lx) + Math.abs(ty - ly) < 0.002) {
        lx = tx;
        ly = ty;
      }
      if (ps !== drawn) render(ps, !snap);
      else if (cardsOn && (lx !== leanX || ly !== leanY)) drawCards(ps);
      return ps !== p || lx !== tx || ly !== ty;
    }
  };

  const toEnd = () => scrollTo({ top: top + L, behavior: 'smooth' });
  // Nothing in the room is focusable today; if that changes, keyboard focus
  // must never land on it while it is still small behind the frame.
  const guard = () => {
    if (ps < 0.85) scrollTo({ top: top + 0.9 * L, behavior: 'instant' });
  };

  let offFlat = track(flat);
  whenMotion(() => {
    offFlat();
    // The statement is only ever seen on the lit screen.
    say.removeAttribute('data-surface');
    const offScene = track(scene);
    hint.addEventListener('click', toEnd);
    room.addEventListener('focusin', guard);
    addEventListener('pointermove', onPointer, { passive: true });
    return () => {
      offScene();
      hint.removeEventListener('click', toEnd);
      room.removeEventListener('focusin', guard);
      removeEventListener('pointermove', onPointer);
      for (const el of [portal, ...styled, ...floats.map((c) => c.el)]) el.removeAttribute('style');
      portal.classList.remove('is-live', 'portal--lite', 'portal--stacked', 'portal--tight');
      copy.dataset.surface = say.dataset.surface = 'dark'; // the static forest band
      hint.hidden = false;
      actions.inert = false;
      ps = drawn = -1;
      tx = ty = lx = ly = 0;
      cardsOn = false;
      offFlat = track(flat);
    };
  });
}
