// mitec — scroll engine. One rAF loop, one passive scroll listener, and
// measurements cached outside the loop. Every scroll-linked effect on the
// page registers a track:
//
//   track({ el?, measure?(), update(dt, snap) })
//
// measure() holds every layout read and runs only on resize, load and font
// swap. update() only writes (transform, opacity, attributes) and returns
// true while it is still easing toward its target; with nothing scrolled and
// nothing easing, the loop sleeps. A track with `el` is skipped while el is
// off screen, after one last update with snap = true so it parks at its end
// state instead of freezing mid-way.
//
// It also owns html.motion: the class every motion rule is scoped to, set
// only when the visitor hasn't asked for reduced motion (and isn't in forced
// colours). A <head> script sets it before first paint; this keeps it true
// to the live preference and tears effects down when it changes.

const root = document.documentElement;
const noReduce = matchMedia('(prefers-reduced-motion: no-preference)');
const forced = matchMedia('(forced-colors: active)');
const coarse = matchMedia('(pointer: coarse)');

export const view = {
  w: innerWidth,
  h: innerHeight,
  y: scrollY,
  coarse: coarse.matches,
  // Low-power devices get the simplified scene at any width.
  lite: (navigator.hardwareConcurrency || 8) <= 4 || !!navigator.connection?.saveData
};

const tracks = new Set();
const byEl = new Map();
let raf = 0;
let last = 0;
let pending = 0;

const io = new IntersectionObserver((entries) => {
  for (const e of entries) for (const t of byEl.get(e.target) || []) t.on = e.isIntersecting;
  kick();
}, { rootMargin: '25% 0px' });

function frame(now) {
  raf = 0;
  const dt = last ? Math.min(now - last, 50) : 16.7;
  view.y = scrollY;
  let busy = false;
  for (const t of tracks) {
    if (t.on === false) {
      if (!t.parked) t.update(dt, true);
      t.parked = true;
    } else {
      t.parked = false;
      if (t.update(dt, false)) busy = true;
    }
  }
  last = busy ? now : 0;
  if (busy) raf = requestAnimationFrame(frame);
}

export function kick() {
  if (!raf) raf = requestAnimationFrame(frame);
}

function measure() {
  pending = 0;
  const w = innerWidth;
  const h = innerHeight;
  view.coarse = coarse.matches;
  // A phone's URL bar changes the height by ~50–110px as it slides in and
  // out; re-laying the scene out for that would make it jump mid-scroll.
  if (!view.coarse || w !== view.w || Math.abs(h - view.h) >= 120) view.h = h;
  view.w = w;
  for (const t of tracks) {
    t.parked = false;
    t.measure?.();
  }
  kick();
}

// Batched into the next frame: measure() may resize the body (the portal
// sets its own scroll length), and doing that inside a ResizeObserver
// callback would trip the observer's loop error.
export function remeasure() {
  if (!pending) pending = requestAnimationFrame(measure);
}

export function track(t) {
  tracks.add(t);
  if (t.el) {
    byEl.set(t.el, [...(byEl.get(t.el) || []), t]);
    io.observe(t.el);
  }
  t.measure?.();
  kick();
  return () => {
    tracks.delete(t);
    if (!t.el) return;
    const rest = byEl.get(t.el).filter((x) => x !== t);
    if (rest.length) byEl.set(t.el, rest);
    else {
      byEl.delete(t.el);
      io.unobserve(t.el);
    }
  };
}

// ---- motion gate ---------------------------------------------------------
const setups = new Map();
const motionOK = () => noReduce.matches && !forced.matches;

// setup() runs while motion is allowed and must return its teardown.
export function whenMotion(setup) {
  setups.set(setup, motionOK() ? setup() : null);
}

function applyMode() {
  const on = motionOK();
  root.classList.toggle('motion', on);
  for (const [setup, teardown] of setups) {
    if (on && !teardown) setups.set(setup, setup());
    if (!on && teardown) {
      teardown();
      setups.set(setup, null);
    }
  }
  remeasure();
}

root.classList.toggle('motion', motionOK());
noReduce.addEventListener('change', applyMode);
forced.addEventListener('change', applyMode);

addEventListener('scroll', kick, { passive: true });
addEventListener('resize', remeasure);
addEventListener('load', remeasure);
document.fonts?.ready.then(remeasure);
new ResizeObserver(remeasure).observe(document.body);
