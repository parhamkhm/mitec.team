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
// Also owns the nav's forest → light switch, which follows the scene — or,
// without motion, the bottom edge of the static forest band.

import { track, view, whenMotion } from './engine.js';
import { clamp, seg, lerp, damp, inCubic, outCubic, inOutSine, inOutCubic } from './easing.js';

const px = (n) => `${n}px`;
const H1_MIN = 36; // the lower bound of the H1's own clamp()

export function initPortal() {
  const portal = document.querySelector('.portal');
  if (!portal) return;
  const nav = document.querySelector('.navbar');
  const q = (s) => portal.querySelector(s);
  const qa = (s) => [...portal.querySelectorAll(s)];
  const stage = q('.portal__stage');
  const copy = q('.portal__copy');
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
  const hint = q('.portal__hint');
  const card = q('.stat-bar');
  const strip = q('.logo-strip');
  const stats = qa('.stat-block');
  // The copy lifts off top-down: eyebrow, title, sub, actions — all gone
  // before the statement starts at .16.
  const lift = [...copy.children].map((el, i) => [el, [0, 0.015, 0.03, 0.045][i], [0.1, 0.12, 0.14, 0.15][i]]);
  const reveal = [...words, ...phrases, ...lines];
  const styled = [hint, room, frame, glass, shine, glow, base, say, loader, fill, card, strip, ...stats, ...reveal, ...lift.map(([el]) => el)];

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

  // ---- the scene
  let top = 0, L = 1, sExit = 1, rise = 0, tilt = 0, lite = false, tau = 90;
  let W = 1, H = 1, dy0 = 0;
  let ps = -1, drawn = -1;
  let vars = {};
  const setVar = (k, v) => {
    if (vars[k] !== v) portal.style.setProperty(k, (vars[k] = v));
  };
  const show = (el, t, d) => {
    el.style.opacity = t;
    el.style.transform = t < 1 ? `translateY(${d * (1 - t)}px)` : '';
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
    frame.style.transform = `translateY(${dy0 * (1 - lean)}px) scale(${s}) rotateX(${tilt * (1 - lean)}deg)`;
    base.style.transform = `translateY(${0.06 * H * inCubic(seg(p, 0, 0.18))}px)`; // falls away first

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
    glow.style.opacity = lerp(0.5, 1, outCubic(seg(p, 0.54, 0.66)));
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
    show(strip, outCubic(seg(p, 0.82, 0.94)), 24);

    // Hysteresis keeps the nav from flickering at the line.
    setNav(light ? p >= 0.84 : p >= 0.86);
  }

  // Copy height from its first child's top to its last child's bottom — layout
  // offsets, so the lift transforms don't count.
  const kids = copy.children;
  const copyEnd = () => kids[kids.length - 1].offsetTop + kids[kids.length - 1].offsetHeight;
  const copyH = () => copyEnd() - kids[0].offsetTop;
  // Shrink the H1 toward its clamp's lower bound until the copy fits `avail`;
  // only if that is not enough does the sub drop to body-lg. True if it fits.
  function fit(avail) {
    title.style.fontSize = sub.style.fontSize = '';
    let size = parseFloat(getComputedStyle(title).fontSize);
    while (copyH() > avail && size > H1_MIN) title.style.fontSize = px((size = Math.max(H1_MIN, size - 4)));
    if (copyH() > avail) sub.style.fontSize = 'var(--text-body-lg)';
    return copyH() <= avail;
  }

  const scene = {
    el: portal,
    measure() {
      const w = view.w;
      const sh = stage.clientHeight; // 100svh: steady while a phone's URL bar slides
      const small = w < 760;
      lite = small || view.lite;
      W = Math.round(Math.min(0.7 * w, 860, 0.62 * sh * 1.6));
      H = Math.round(W / 1.6);
      const r = Math.round(clamp(0.012 * W, 8, 12));
      const b = Math.round(clamp(0.016 * W, 10, 16));
      const chin = Math.round(1.4 * b);
      const bh = Math.round(clamp(0.02 * W, 10, 16));
      L = Math.round(view.h * (w >= 1024 ? 3 : small ? 2.1 : 2.4));
      // No roll, so the display only has to clear the viewport itself.
      sExit = Math.max(w / W, view.h / H) * 1.12;
      rise = 0.14 * view.h;
      tilt = lite ? 0 : 10;
      tau = view.coarse ? 45 : 90;
      portal.classList.toggle('portal--lite', lite);
      setVar('--portal-track', px(L));
      setVar('--screen-w', px(W));
      setVar('--screen-h', px(H));
      setVar('--screen-r', px(r));
      setVar('--bezel', px(b));
      setVar('--chin', px(chin));
      setVar('--base-h', px(bh));
      setVar('--portal-hole', `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}'%3E%3Crect width='${W}' height='${H}' rx='${r}'/%3E%3C/svg%3E")`);
      // The statement stays on the glass even while the screen is at its smallest.
      setVar('--say-max', px(Math.round(Math.min(w - 48, 1.25 * W - 32))));
      // Lite and full animate different spans; start both from clean.
      for (const el of reveal) el.removeAttribute('style');

      // The copy goes on the screen if it fits there, else above the laptop.
      let stacked = small;
      if (!stacked) {
        portal.classList.remove('portal--stacked');
        setVar('--copy-max', px(W - 96));
        stacked = !fit(H - 56);
      }
      dy0 = 0;
      portal.classList.toggle('portal--stacked', stacked);
      if (stacked) {
        setVar('--copy-max', px(w - 48));
        const lh = b + H + chin + bh; // lid top to base bottom
        const floor = sh - 68;        // keep the hint's corner clear
        fit(floor - kids[0].offsetTop - 24 - lh);
        const from = copyEnd() + 24;
        // Centred in the space under the copy; pulled up rather than cropped.
        const lt = Math.min(from + Math.max(0, (floor - from - lh) / 2), sh - lh - 8);
        dy0 = lt + b + H / 2 - sh / 2;
        portal.classList.toggle('portal--tight', lt + lh > floor);
      } else portal.classList.remove('portal--tight');
      setVar('--portal-w', px(Math.ceil(1.05 * Math.hypot(w, sh + 2 * Math.abs(dy0)))));

      top = portal.getBoundingClientRect().top + scrollY;
      drawn = -1;
    },
    update(dt, snap) {
      const p = clamp((view.y - top) / L);
      ps = snap || ps < 0 ? p : damp(ps, p, dt, tau);
      if (Math.abs(p - ps) < 0.0005) ps = p;
      if (ps !== drawn) render(ps, !snap);
      return ps !== p;
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
    const offScene = track(scene);
    hint.addEventListener('click', toEnd);
    room.addEventListener('focusin', guard);
    return () => {
      offScene();
      hint.removeEventListener('click', toEnd);
      room.removeEventListener('focusin', guard);
      for (const el of [portal, ...styled]) el.removeAttribute('style');
      portal.classList.remove('is-live', 'portal--lite', 'portal--stacked', 'portal--tight');
      hint.hidden = false;
      actions.inert = false;
      vars = {};
      ps = drawn = -1;
      offFlat = track(flat);
    };
  });
}
