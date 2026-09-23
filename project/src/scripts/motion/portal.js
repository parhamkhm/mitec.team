// mitec — the portal hero. Every layer is a pure function of one damped
// progress value, so the scene plays the same forwards and backwards and
// there are no one-shot triggers to fall out of sync. Geometry (window size,
// scroll length, exit scale) is measured on resize only; the per-frame path
// writes transforms and opacity and nothing else.
//
// Also owns the nav's forest → light switch, which follows the scene — or,
// without motion, the bottom edge of the static forest band.

import { track, view, whenMotion } from './engine.js';
import { clamp, seg, lerp, damp, inCubic, outCubic, inOutSine, inOutCubic } from './easing.js';

const px = (n) => `${n}px`;

export function initPortal() {
  const portal = document.querySelector('.portal');
  if (!portal) return;
  const nav = document.querySelector('.navbar');
  const q = (s) => portal.querySelector(s);
  const copy = q('.portal__copy');
  const room = q('.portal__room');
  const frame = q('.portal__frame');
  const glass = q('.portal__glass');
  const glow = q('.portal__glow');
  const rim = q('.portal__rim');
  const hint = q('.portal__hint');
  const actions = q('.portal__actions');
  const card = q('.stat-bar');
  const strip = q('.logo-strip');
  const stats = [...portal.querySelectorAll('.stat-block')];
  // The copy lifts off top-down: eyebrow, title, sub, actions.
  const lift = [...copy.children].map((el, i) => [el, [0, 0.02, 0.04, 0.05][i], [0.16, 0.19, 0.21, 0.22][i]]);
  const styled = [hint, room, frame, glass, glow, rim, card, strip, ...stats, ...lift.map(([el]) => el)];

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
    measure() { edge = copy.getBoundingClientRect().bottom + scrollY - (nav?.offsetHeight || 0) / 2; },
    update() { setNav(view.y >= edge); }
  };

  // ---- the scene
  let top = 0, L = 1, sExit = 1, rise = 0, R = 0, sheen = true, tau = 90;
  let ps = -1, drawn = -1;
  let vars = {};
  const setVar = (k, v) => {
    if (vars[k] !== v) portal.style.setProperty(k, (vars[k] = v));
  };
  const show = (el, t) => {
    el.style.opacity = t;
    el.style.transform = t < 1 ? `translateY(${24 * (1 - t)}px)` : '';
  };

  function render(p, onScreen) {
    drawn = p;
    portal.classList.toggle('is-live', onScreen && p < 1);

    // Phase 1 · lift-off
    const h = 1 - seg(p, 0, 0.04);
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

    // Phase 2 · approach — the frame grows, then accelerates past the edges.
    const s = p < 0.22
      ? lerp(1, 1.35, inOutSine(seg(p, 0, 0.22)))
      : lerp(1.35, sExit, inCubic(seg(p, 0.22, 0.72)));
    const rot = R * (inOutSine(seg(p, 0.6, 0.85)) - inOutSine(seg(p, 0.25, 0.6)));
    const f = 1 - seg(p, 0.7, 0.76);
    frame.style.transform = `rotate(${rot}deg) scale(${s})`;
    frame.style.opacity = f;
    frame.style.visibility = f ? '' : 'hidden';
    glass.style.opacity = 1 - inOutSine(seg(p, 0.18, 0.45));
    glow.style.opacity = lerp(0.5, 1, outCubic(seg(p, 0, 0.3)));
    if (sheen) rim.style.setProperty('--sheen', `${220 * seg(p, 0, 0.7)}deg`);

    // Phase 3 · reveal — the room grows slower than the frame (depth).
    const rs = p < 0.3
      ? lerp(0.42, 0.5, inOutSine(seg(p, 0, 0.3)))
      : lerp(0.5, 1, inOutCubic(seg(p, 0.3, 0.82)));
    room.style.transform = rs === 1 && !rot ? 'none' : `rotate(${rot}deg) scale(${rs})`;

    card.style.opacity = outCubic(seg(p, 0.66, 0.78)); // arrives with its first stat, never empty
    stats.forEach((el, i) => show(el, outCubic(seg(p, 0.66 + 0.04 * i, 0.78 + 0.04 * i))));
    show(strip, outCubic(seg(p, 0.78, 0.92)));

    // Phase 4 · inside — hysteresis keeps the nav from flickering at the line.
    setNav(light ? p >= 0.78 : p >= 0.8);
  }

  const scene = {
    el: portal,
    measure() {
      const { w, h } = view;
      const vmin = Math.min(w, h);
      const small = w < 760;
      const S = Math.round(small ? Math.min(0.84 * w, 420)
        : w >= 1024 && w < 1280 ? Math.min(0.58 * vmin, 520)
        : Math.min(0.62 * vmin, 600));
      const r = Math.round(clamp(0.03 * vmin, 20, 36));
      const diag = Math.hypot(w, h);
      const lite = small || view.lite;
      L = Math.round(h * (small ? 1.6 : w < 1024 ? 1.8 : 2.2));
      // Past this the window is wider than the screen's diagonal with margin,
      // so the wall is off screen at any tilt.
      sExit = (diag / S) * 1.15;
      rise = 0.14 * h;
      R = lite ? 0 : w < 1024 ? 5 : 8;
      sheen = !lite;
      tau = view.coarse ? 45 : 90;
      portal.classList.toggle('portal--lite', lite);
      setVar('--portal-track', px(L));
      setVar('--portal-s', px(S));
      setVar('--portal-r', px(r));
      setVar('--portal-w', px(Math.ceil(diag * 1.05)));
      setVar('--portal-hole', `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='${((r / S) * 100).toFixed(3)}'/%3E%3C/svg%3E")`);
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
      portal.classList.remove('is-live', 'portal--lite');
      hint.hidden = false;
      actions.inert = false;
      vars = {};
      ps = drawn = -1;
      offFlat = track(flat);
    };
  });
}
