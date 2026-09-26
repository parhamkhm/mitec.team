// mitec — Work: a 3D coverflow of the projects in src/data/portfolio.json.
// The centre card flips over, in place, to its details (DESIGN.md §5,
// "Work coverflow").
//
// Recycled slots. A fixed pool of seven cards sits at offsets −3 … +3 from an
// unbounded virtual index; ±3 are invisible staging slots. Each slot shows
// projects[mod(index + offset, N)], so with few projects the same one can be
// on screen twice, and the loop never ends in either direction. A step moves
// every slot one offset over; the one pushed past ±3 jumps, invisible, to the
// other end and takes its new project there, so no card ever crosses the
// stage. Three projects or thirty run the same code.
//
// Positive offsets are "next", on the LEFT of this RTL page: ArrowLeft, the
// left arrow and a swipe to the right go forward.
//
// Each card has two faces of the same size. «جزئیات پروژه» turns the centre
// card over to its back: the need / built / result as three tabs, and the
// site link. The face not in view is inert. Any move of the carousel turns
// the card back first.
//
// A step writes each card's transform and opacity once, in one frame, and the
// CSS transitions in home.css do the motion. The only per-frame work is the
// optional stage tilt, a track on the shared engine. Layout is read only on
// resize (the engine's measure) and when a text panel scrolls or changes.

import { track, kick, whenMotion } from './motion/engine.js';
import { clamp, damp } from './motion/easing.js';
import { faNumber } from '../utils/format.js';

const POOL = 7;          // offsets −3 … +3
const HOLD_MS = 8000;    // autoplay rests this long after a manual interaction or a flip
const SWIPE_PX = 45;
const MAX_DOTS = 7;      // more projects than this: a «۳ از ۱۲» counter instead
const TILT_DEG = 3;

// Offsets 0, ±1, ±2, ±3: [translateX in % of the card's width, scale,
// rotateY, opacity, dim]. The side cards turn to face the centre.
const LAYOUT = {
  wide: [[0, 1, 0, 1, 0], [86, .84, 24, .65, .45], [155, .68, 38, .38, .6], [205, .56, 46, 0, .6]],
  narrow: [[0, 1, 0, 1, 0], [62, .86, 18, .65, .45], [116, .74, 26, .38, .6], [160, .64, 32, 0, .6]]
};
const Z = [30, 20, 10, 0];
const FLIPPED_DIM = .15; // extra dim on the side cards while the centre card is turned over

// The back's three blocks, in reading order (right to left).
const TABS = [['need', 'نیاز'], ['built', 'راهکار'], ['result', 'نتیجه']];

// The card's screenshot covers a 4:5 box, so it is drawn ~2.6× the card's width.
const CARD_SIZES = '(max-width: 499px) 187vw, (max-width: 759px) 936px, (max-width: 999px) 676px, (max-width: 1307px) 68vw, 884px';
const NOTE = 'لینک سایت بعد از تأیید مشتری منتشر می‌شود.';

const root = document.documentElement;
const narrow = matchMedia('(max-width: 759px)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const motionOn = () => root.classList.contains('motion');
const flipMs = () => (motionOn() ? 700 : 250);   // home.css: the flip, or the reduced-motion crossfade
const mod = (n, m) => ((n % m) + m) % m;

function h(tag, cls, attrs = {}) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}
function iconButton(cls, icon, label) {
  const b = h('button', cls, { type: 'button', 'aria-label': label });
  b.append(h('span', `icon ${icon}`, { 'aria-hidden': 'true' }));
  return b;
}
const srcsetOf = (im) => [im.src960 && `${im.src960} 960w`, im.src1920 && `${im.src1920} 1920w`].filter(Boolean).join(', ');
const chips = (tags) => (tags || []).map((t) => {
  const chip = h('span', 'work-card__tag');
  chip.textContent = t;
  return chip;
});

export async function initWork() {
  const section = document.getElementById('work');
  const host = section?.querySelector('.work-carousel');
  if (!host) return;
  let projects;
  try {
    const res = await fetch(new URL('../data/portfolio.json', import.meta.url));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    projects = (await res.json()).filter((p) => p && p.id);
    if (!projects.length) throw new Error('no projects');
  } catch (e) {
    console.warn('[work] portfolio unavailable; showing the static list', e);
    section.classList.add('work--static');
    return;
  }
  build(section, host, projects);
}

function build(section, host, projects) {
  const N = projects.length;
  const many = N > 1;
  const layers = [...section.querySelectorAll('.work__ambient-layer')];

  // ---- state
  let active = 0;          // unbounded virtual index of the centre card
  let queue = 0;           // steps still to take (signed), e.g. from a dot three away
  let pumpTimer = 0;
  let announce = false;    // say the new project (manual changes only, never autoplay)
  let flipped = null;      // the slot turned over to its back, if any
  let turningUntil = 0;    // until then a card is still turning back; the carousel waits

  // ---- the stage and its seven slots
  const stage = h('div', 'work-stage');
  const trackEl = h('div', 'work-stage__track');
  stage.append(trackEl);
  const slots = Array.from({ length: POOL }, (_, i) => makeSlot(i));
  trackEl.append(...slots.map((s) => s.el));
  host.append(stage);

  // ---- controls
  let toggle = null, counter = null, bar = null;
  let dots = [];
  const controls = h('div', 'work-controls');
  if (many) {
    host.append(
      iconButton('work-arrow work-arrow--prev', 'icon-chevron-right', 'پروژه‌ی قبلی'),
      iconButton('work-arrow work-arrow--next', 'icon-chevron-left', 'پروژه‌ی بعدی')
    );
    if (N <= MAX_DOTS) {
      const wrap = h('div', 'work-dots');
      dots = projects.map((_, i) => {
        const d = h('button', 'work-dot', { type: 'button', 'aria-label': `رفتن به پروژه‌ی ${faNumber(i + 1)}` });
        d.dataset.to = i;
        return d;
      });
      wrap.append(...dots);
      controls.append(wrap);
    } else {
      const box = h('div', 'work-counter');
      counter = h('span');
      const progress = h('span', 'work-progress', { 'aria-hidden': 'true' });
      bar = h('span');
      progress.append(bar);
      box.append(counter, progress);
      controls.append(box);
    }
    toggle = iconButton('work-toggle', 'icon-pause', 'توقف چرخش');
    controls.append(toggle);
  }
  const status = h('p', 'visually-hidden', { 'aria-live': 'polite', 'aria-atomic': 'true' });
  host.append(controls, status);

  // One card: a front (the screenshot and its face) and a back (the details),
  // the same size, back to back inside .work-card__inner.
  function makeSlot(i) {
    const el = h('div', 'work-card is-teleport');
    const inner = h('div', 'work-card__inner');

    const front = h('div', 'work-card__front');
    const img = h('img', 'work-card__img', { alt: '', decoding: 'async', sizes: CARD_SIZES });
    const face = h('div', 'work-card__face');
    const tags = h('div', 'work-card__tags');
    const body = h('div', 'work-card__body');
    const title = h('h3', 'work-card__title');
    const summary = h('p', 'work-card__summary');
    const more = h('button', 'btn btn--sm btn--tonal work-card__more', { type: 'button', 'aria-expanded': 'false', 'aria-controls': `work-back-${i}` });
    more.textContent = 'جزئیات پروژه';
    body.append(title, h('span', 'work-card__rule', { 'aria-hidden': 'true' }), summary, more);
    face.append(tags, body);
    const dim = h('span', 'work-card__dim', { 'aria-hidden': 'true' });
    front.append(img, face, dim);

    const back = h('div', 'work-card__back', { id: `work-back-${i}`, role: 'group', 'aria-labelledby': `work-back-title-${i}` });
    back.inert = true;
    const backImg = h('img', 'work-card__back-img', { alt: '', decoding: 'async', loading: 'lazy' });
    const sheet = h('div', 'work-card__sheet');
    const head = h('div', 'work-card__head');
    const backTags = h('div', 'work-card__tags');
    head.append(backTags, iconButton('work-card__close', 'icon-x', 'بستن جزئیات'));
    const backTitle = h('h3', 'work-card__back-title', { id: `work-back-title-${i}` });
    const tablist = h('div', 'work-tabs', { role: 'tablist', 'aria-labelledby': backTitle.id });
    const indicator = h('span', 'work-tabs__indicator', { 'aria-hidden': 'true' });
    tablist.append(indicator);
    const content = h('div', 'work-card__content');
    const tabs = [], panels = [];
    TABS.forEach(([, label], k) => {
      const tab = h('button', 'work-tab', { type: 'button', role: 'tab', id: `work-tab-${i}-${k}`, 'aria-controls': `work-panel-${i}-${k}` });
      tab.textContent = label;
      tab.dataset.k = k;
      const panel = h('div', 'work-card__panel', { role: 'tabpanel', id: `work-panel-${i}-${k}`, 'aria-labelledby': tab.id });
      panel.append(h('p'));
      tabs.push(tab);
      panels.push(panel);
    });
    tablist.append(...tabs);
    content.append(...panels);
    const foot = h('div', 'work-card__foot');
    sheet.append(head, backTitle, tablist, content, foot);
    back.append(backImg, sheet);

    inner.append(front, back);
    el.append(inner);
    const s = { el, front, back, img, tags, title, summary, more, dim, backImg, backTags, backTitle, indicator, tabs, panels, foot,
      pos: i - 3, p: -1, tab: 0, clearAt: 0, exiting: false, teleport: true };
    selectTab(s, 0);
    return s;
  }

  // A slot's project follows from its offset; swapped only while it is invisible.
  function fill(s) {
    const p = mod(active + s.pos, N);
    if (s.p === p) return;
    s.p = p;
    const pr = projects[p];
    const im = pr.image;
    s.img.loading = s.pos === 0 ? 'eager' : 'lazy';
    s.img.hidden = !im;
    if (im) {
      s.img.width = im.width || 1920;
      s.img.height = im.height || 960;
      s.img.srcset = srcsetOf(im);
      s.img.src = im.src960 || im.src1920;
      s.img.alt = im.alt || '';
    }
    s.title.textContent = s.backTitle.textContent = pr.nameFa || pr.name || '';
    s.summary.textContent = pr.summary || '';
    s.summary.hidden = !pr.summary;
    s.tags.replaceChildren(...chips(pr.tags));
    s.backTags.replaceChildren(...chips(pr.tags));
    s.backImg.hidden = !im?.ambient;
    if (im?.ambient) s.backImg.src = im.ambient;
    TABS.forEach(([key], k) => { s.panels[k].firstChild.textContent = pr[key] || ''; });
    if (pr.url && pr.url !== '#') {
      const a = h('a', 'btn btn--sm btn--outline work-card__site', { target: '_blank', rel: 'noopener' });
      a.href = pr.url;
      a.append('دیدن سایت ', h('span', 'icon icon-arrow-up-left', { 'aria-hidden': 'true' }));
      s.foot.replaceChildren(a);
    } else {
      const note = h('p', 'work-note');
      note.textContent = NOTE;
      s.foot.replaceChildren(note);
    }
    selectTab(s, 0);
  }
  slots.forEach(fill);

  // ---- the back's tabs: «نیاز» · «راهکار» · «نتیجه»
  function selectTab(s, k, focus = false) {
    s.tab = k;
    s.tabs.forEach((t, j) => {
      t.setAttribute('aria-selected', String(j === k));
      t.tabIndex = j === k ? 0 : -1;
    });
    s.panels.forEach((panel, j) => {
      panel.classList.toggle('is-current', j === k);
      panel.inert = j !== k;
      panel.tabIndex = j === k ? 0 : -1; // the text can be scrolled from the keyboard
      if (j === k) panel.scrollTop = 0;
    });
    // Equal thirds, so one tab's width is 100% of the indicator's own; the
    // first tab is on the right, the next ones to its left.
    s.indicator.style.transform = k ? `translateX(${-100 * k}%)` : '';
    if (focus) s.tabs[k].focus({ preventScroll: true });
    if (s === flipped) requestAnimationFrame(() => fade(s.panels[k]));
  }
  // A soft fade at the foot of a text that goes on below the fold.
  function fade(panel) {
    panel.toggleAttribute('data-more', panel.scrollHeight - panel.clientHeight - panel.scrollTop > 4);
  }

  // ---- turning the centre card over
  function flip(s) {
    if (flipped || s.pos !== 0 || performance.now() < turningUntil) return;
    flipped = s;
    queue = 0;
    clearTimeout(pumpTimer);
    selectTab(s, 0);
    s.back.inert = false;
    s.tabs[0].focus({ preventScroll: true }); // before the front goes inert, so focus never drops to <body>
    s.front.inert = true;
    s.more.setAttribute('aria-expanded', 'true');
    s.el.classList.add('is-flipped');
    requestAnimationFrame(() => fade(s.panels[0]));
    render();
    schedule();
  }
  function unflip(returnFocus = false) {
    const s = flipped;
    if (!s) return;
    flipped = null;
    const hadFocus = s.el.contains(document.activeElement);
    s.front.inert = false;
    if (hadFocus || returnFocus) s.more.focus({ preventScroll: true });
    s.back.inert = true;
    s.more.setAttribute('aria-expanded', 'false');
    s.el.classList.remove('is-flipped');
    // The carousel moves once the card has (nearly) finished turning back.
    turningUntil = performance.now() + flipMs() * 0.65;
    render();
    holdAutoplay();
  }

  // ---- writing one frame
  let raf = 0;
  const render = () => { if (!raf) raf = requestAnimationFrame(paint); };

  function place(s, flat, lay) {
    const a = Math.min(Math.abs(s.pos), 3);
    const side = Math.sign(s.pos);
    const [x, sc, r, o, dim] = lay[a];
    s.el.style.transform = `translateX(${-side * x || 0}%) scale(${flat ? 1 : sc}) rotateY(${flat ? 0 : side * r}deg)`;
    s.el.style.opacity = o;
    s.el.style.zIndex = Z[a];
    // A card leaving for ±3 fades out fast, so its slot is free to recycle soon.
    s.el.style.transitionDuration = s.exiting ? `800ms, ${exitMs()}ms` : '';
    s.dim.style.opacity = flipped && a ? Math.min(dim + FLIPPED_DIM, .85) : dim;
    s.el.dataset.pos = s.pos;
    s.el.classList.toggle('is-active', a === 0);
    s.el.inert = a === 3;
    s.more.tabIndex = a === 0 ? 0 : -1;
    if (a === 0) {
      s.el.removeAttribute('aria-hidden');
      s.el.setAttribute('role', 'group');
      s.el.setAttribute('aria-roledescription', 'اسلاید');
      s.el.setAttribute('aria-label', `${faNumber(s.p + 1)} از ${faNumber(N)}: ${projects[s.p].nameFa || ''}`);
    } else {
      s.el.setAttribute('aria-hidden', 'true');
      s.el.removeAttribute('role');
      s.el.removeAttribute('aria-roledescription');
      s.el.removeAttribute('aria-label');
    }
  }

  function paint() {
    raf = 0;
    const flat = !motionOn();
    const lay = narrow.matches ? LAYOUT.narrow : LAYOUT.wide;
    const jumped = [];
    for (const s of slots) {
      if (s.teleport) {
        s.el.classList.add('is-teleport');
        s.teleport = false;
        jumped.push(s);
      }
      place(s, flat, lay);
    }
    // Transitions back on once the jump has been drawn.
    if (jumped.length) requestAnimationFrame(() => requestAnimationFrame(() => jumped.forEach((s) => s.el.classList.remove('is-teleport'))));

    const p = mod(active, N);
    dots.forEach((d, i) => d.setAttribute('aria-current', String(i === p)));
    if (counter) {
      counter.textContent = `${faNumber(p + 1)} از ${faNumber(N)}`;
      bar.style.transform = `scaleX(${(p + 1) / N})`;
    }
    const centre = slots.find((s) => s.pos === 0);
    if (announce) {
      status.textContent = centre.el.getAttribute('aria-label');
      announce = false;
    }
    // Focus never stays on a card that has turned to the side.
    const f = document.activeElement;
    if (f && host.contains(f) && f.closest('.work-card') && f.closest('.work-card') !== centre.el) centre.more.focus({ preventScroll: true });
  }

  const exitMs = () => (motionOn() ? 380 : 250);

  // One step forward (+1) or back (−1). Returns how long to wait first if
  // the slot it has to recycle is still fading out.
  function step(dir) {
    const out = dir > 0 ? -3 : 3;
    const spare = slots.find((s) => s.pos === out);
    const wait = spare.clearAt - performance.now();
    if (wait > 0) return wait;
    active += dir;
    const now = performance.now();
    for (const s of slots) {
      const was = Math.abs(s.pos);
      s.pos -= dir;
      s.exiting = Math.abs(s.pos) === 3 && was <= 2;
      if (s.exiting) s.clearAt = now + exitMs() + 40;
    }
    spare.pos = -out;        // past the far end: jump, invisible, to the other one
    spare.exiting = false;
    spare.teleport = true;
    spare.clearAt = 0;
    fill(spare);
    render();
    queueAmbient();
    return 0;
  }

  function pump() {
    clearTimeout(pumpTimer);
    pumpTimer = 0;
    const turning = turningUntil - performance.now();
    if (turning > 0) {
      pumpTimer = setTimeout(pump, turning);
      return;
    }
    while (queue && !flipped) {
      const dir = Math.sign(queue);
      const wait = step(dir);
      if (wait > 0) {
        pumpTimer = setTimeout(pump, wait);
        return;
      }
      queue -= dir;
    }
  }

  // Any move turns a flipped card back first; the carousel moves after it.
  function go(delta, manual = true) {
    if (!many || !delta) return;
    if (manual) {
      announce = true;
      holdAutoplay();
    }
    if (flipped) unflip();
    queue = clamp(queue + delta, -3, 3);
    pump();
  }
  // The shortest way round to project i (dots).
  function goTo(i) {
    let d = mod(i - (active + queue), N);
    if (d > N / 2) d -= N;
    go(d);
  }

  // ---- ambient backdrop: crossfade to the centre project's pre-blurred file
  let ambTimer = 0, ambToken = 0;
  function queueAmbient() {
    clearTimeout(ambTimer);
    ambTimer = setTimeout(() => setAmbient(mod(active, N)), 240);
  }
  function setAmbient(p) {
    const src = projects[p].image?.ambient;
    if (!src || layers.length < 2) return;
    const on = layers.find((l) => l.classList.contains('is-on')) || layers[0];
    if (on.getAttribute('src') === src) return;
    const off = layers.find((l) => l !== on);
    const token = ++ambToken;
    off.src = src;
    const show = () => {
      if (token !== ambToken) return;
      off.classList.add('is-on');
      on.classList.remove('is-on');
    };
    if (off.decode) off.decode().then(show, show);
    else show();
  }

  // ---- autoplay: forward every data-autoplay-delay ms, forever
  const delay = Math.max(1500, Number(section.dataset.autoplayDelay) || 4500);
  let userPaused = section.dataset.autoplay === 'false';
  let hovering = false, focused = false, onScreen = false, holdUntil = 0, timer = 0;
  const canPlay = () => many && !userPaused && motionOn() && !hovering && !focused && onScreen && !flipped && !document.hidden;
  function schedule() {
    clearTimeout(timer);
    timer = 0;
    if (canPlay()) timer = setTimeout(tick, Math.max(delay, holdUntil - Date.now()));
  }
  function tick() {
    timer = 0;
    if (!canPlay()) return;
    go(1, false);
    schedule();
  }
  function holdAutoplay() {
    holdUntil = Date.now() + HOLD_MS;
    schedule();
  }
  function setUserPaused(v) {
    userPaused = v;
    if (toggle) {
      toggle.setAttribute('aria-label', v ? 'ادامه‌ی چرخش' : 'توقف چرخش');
      toggle.firstChild.className = `icon ${v ? 'icon-play' : 'icon-pause'}`;
    }
    schedule();
  }
  setUserPaused(userPaused);

  // ---- one listener set, on the carousel (plus Esc and outside clicks while a card is turned)
  let swipe = null, swipedAt = -1e9;
  const slotOf = (el) => slots.find((x) => x.el === el.closest('.work-card'));
  host.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('.work-arrow--next')) return go(1);
    if (t.closest('.work-arrow--prev')) return go(-1);
    const dot = t.closest('.work-dot');
    if (dot) return goTo(Number(dot.dataset.to));
    if (t.closest('.work-toggle')) return setUserPaused(!userPaused);
    if (t.closest('.work-card__close')) return unflip(true);
    const tab = t.closest('.work-tab');
    if (tab) return selectTab(slotOf(tab), Number(tab.dataset.k), true);
    const card = t.closest('.work-card');
    if (!card || performance.now() - swipedAt < 400) return;
    const s = slotOf(card);
    if (!s || Math.abs(s.pos) > 2) return;
    if (s.pos === 0) {
      if (!t.closest('.work-card__back')) flip(s);
    } else go(s.pos);
  });
  host.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    // Tabs: roving focus in RTL order, so ArrowLeft is the next tab.
    const tab = e.target.closest('.work-tab');
    if (tab) {
      const s = slotOf(tab);
      const k = { ArrowLeft: s.tab + 1, ArrowRight: s.tab - 1, Home: 0, End: TABS.length - 1 }[e.key];
      if (k === undefined) return;
      e.preventDefault();
      selectTab(s, mod(k, TABS.length), true);
      return;
    }
    // The carousel's keys work only while focus is inside it, never on the
    // whole window, and not while reading a card's back.
    if (!many || e.target.closest('.work-card__back')) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(-1); }
  });
  document.addEventListener('keydown', (e) => {
    if (flipped && e.key === 'Escape') unflip(true);
  });
  // A click anywhere outside the turned card turns it back (an arrow, dot or
  // side card then moves the carousel once it has).
  document.addEventListener('pointerdown', (e) => {
    if (flipped && !flipped.el.contains(e.target)) unflip();
  }, true);
  host.addEventListener('scroll', (e) => {
    if (e.target.classList?.contains('work-card__panel')) fade(e.target);
  }, true);
  // Touch: a swipe to the right brings the card on the left (next) to the centre.
  stage.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') swipe = { id: e.pointerId, x: e.clientX, y: e.clientY };
  });
  stage.addEventListener('pointerup', (e) => {
    if (!swipe || e.pointerId !== swipe.id) return;
    const dx = e.clientX - swipe.x;
    const dy = e.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) >= SWIPE_PX && Math.abs(dx) > Math.abs(dy)) {
      swipedAt = performance.now();
      go(dx > 0 ? 1 : -1);
    }
  });
  stage.addEventListener('pointercancel', () => { swipe = null; });
  host.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { hovering = true; schedule(); } });
  host.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { hovering = false; schedule(); } });
  host.addEventListener('focusin', (e) => {
    focused = e.target.matches(':focus-visible'); // keyboard focus, not a click
    schedule();
  });
  host.addEventListener('focusout', (e) => {
    if (host.contains(e.relatedTarget)) return;
    focused = false;
    schedule();
  });
  new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    schedule();
  }, { threshold: 0.25 }).observe(stage);
  document.addEventListener('visibilitychange', schedule);
  narrow.addEventListener('change', render);

  // ---- the stage leans toward a fine pointer, at most ±3deg (engine track)
  let tiltOff = null;
  function startTilt() {
    if (!finePointer.matches) return null;
    let left = 0, top = 0, w = 1, ht = 1, tx = 0, ty = 0, cx = 0, cy = 0, drawn = '';
    const off = track({
      el: stage,
      measure() {
        let x = 0, y = 0;
        for (let n = stage; n; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
        left = x; top = y; w = stage.offsetWidth || 1; ht = stage.offsetHeight || 1;
      },
      update(dt, snap) {
        if (snap) { tx = ty = 0; cx = cy = 0; }
        cx = damp(cx, tx, dt, 140);
        cy = damp(cy, ty, dt, 140);
        if (Math.abs(cx - tx) < 0.005) cx = tx;
        if (Math.abs(cy - ty) < 0.005) cy = ty;
        const t = cx || cy ? `rotateX(${cy.toFixed(3)}deg) rotateY(${cx.toFixed(3)}deg)` : '';
        if (t !== drawn) trackEl.style.transform = drawn = t;
        return cx !== tx || cy !== ty;
      }
    });
    // Rotating toward the pointer: rotateY(+) faces right, rotateX(+) faces up.
    // Held still while a card is turned over, so its back stays square to the reader.
    const move = (e) => {
      if (e.pointerType !== 'mouse') return;
      tx = flipped ? 0 : TILT_DEG * clamp(((e.pageX - left) / w) * 2 - 1, -1, 1);
      ty = flipped ? 0 : -TILT_DEG * clamp(((e.pageY - top) / ht) * 2 - 1, -1, 1);
      kick();
    };
    const leave = () => { tx = ty = 0; kick(); };
    stage.addEventListener('pointermove', move);
    stage.addEventListener('pointerleave', leave);
    return () => {
      off();
      stage.removeEventListener('pointermove', move);
      stage.removeEventListener('pointerleave', leave);
      trackEl.style.transform = '';
    };
  }
  // Motion on or off (reduced motion can change live): relayout, autoplay, tilt.
  whenMotion(() => {
    render();
    schedule();
    tiltOff = startTilt();
    return () => {
      tiltOff?.();
      tiltOff = null;
      render();
      schedule();
    };
  });

  render();
  queueAmbient();
}
