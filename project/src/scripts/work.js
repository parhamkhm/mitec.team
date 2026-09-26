// mitec — Work: a 3D coverflow of the projects in src/data/portfolio.json,
// whose centre card opens a detail dialog (DESIGN.md §5, "Work coverflow").
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
// A step writes each card's transform and opacity once, in one frame, and the
// CSS transitions in home.css do the motion. The only per-frame work is the
// optional stage tilt, a track on the shared engine. Layout is read only on
// resize (the engine's measure) and when the dialog opens or closes.

import { track, kick, whenMotion } from './motion/engine.js';
import { clamp, damp } from './motion/easing.js';
import { faNumber } from '../utils/format.js';

const POOL = 7;          // offsets −3 … +3
const HOLD_MS = 8000;    // autoplay rests this long after a manual interaction
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
const OPEN_SIDE_OPACITY = .2; // side cards while the dialog is open

// The card's screenshot covers a 4:5 box, so it is drawn ~2.6× the card's width.
const CARD_SIZES = '(max-width: 499px) 187vw, (max-width: 759px) 936px, (max-width: 999px) 676px, (max-width: 1307px) 68vw, 884px';
const DETAIL_SIZES = '(min-width: 900px) 510px, 92vw';
const NOTE = 'لینک سایت بعد از تأیید مشتری منتشر می‌شود.';

const root = document.documentElement;
const narrow = matchMedia('(max-width: 759px)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const motionOn = () => root.classList.contains('motion');
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
  const easeOut = getComputedStyle(root).getPropertyValue('--ease-out').trim() || 'ease-out';
  const layers = [...section.querySelectorAll('.work__ambient-layer')];

  // ---- the stage and its seven slots
  const stage = h('div', 'work-stage');
  const trackEl = h('div', 'work-stage__track');
  stage.append(trackEl);
  const slots = Array.from({ length: POOL }, (_, i) => makeSlot(i - 3));
  trackEl.append(...slots.map((s) => s.el));
  host.append(stage);

  // ---- controls
  let prev = null, next = null, toggle = null, counter = null, bar = null;
  let dots = [];
  const controls = h('div', 'work-controls');
  if (many) {
    prev = iconButton('work-arrow work-arrow--prev', 'icon-chevron-right', 'پروژه‌ی قبلی');
    next = iconButton('work-arrow work-arrow--next', 'icon-chevron-left', 'پروژه‌ی بعدی');
    host.append(prev, next);
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

  // ---- state
  let active = 0;          // unbounded virtual index of the centre card
  let queue = 0;           // steps still to take (signed), e.g. from a dot three away
  let pumpTimer = 0;
  let announce = false;    // say the new project (manual changes only, never autoplay)
  let isOpen = false;
  let closing = false;

  function makeSlot(pos) {
    const el = h('div', 'work-card is-teleport');
    const img = h('img', 'work-card__img', { alt: '', decoding: 'async', sizes: CARD_SIZES });
    const face = h('div', 'work-card__face');
    const tags = h('div', 'work-card__tags');
    const body = h('div', 'work-card__body');
    const title = h('h3', 'work-card__title');
    const summary = h('p', 'work-card__summary');
    const more = h('button', 'btn btn--sm btn--tonal work-card__more', { type: 'button' });
    more.textContent = 'جزئیات پروژه';
    body.append(title, h('span', 'work-card__rule', { 'aria-hidden': 'true' }), summary, more);
    face.append(tags, body);
    el.append(img, face, h('span', 'work-card__dim', { 'aria-hidden': 'true' }));
    return { el, img, tags, title, summary, more, dim: el.lastChild, pos, p: -1, clearAt: 0, exiting: false, teleport: true };
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
    s.title.textContent = pr.nameFa || pr.name || '';
    s.summary.textContent = pr.summary || '';
    s.summary.hidden = !pr.summary;
    s.tags.replaceChildren(...(pr.tags || []).map((t) => {
      const chip = h('span', 'work-card__tag');
      chip.textContent = t;
      return chip;
    }));
  }
  slots.forEach(fill);

  // ---- writing one frame
  let raf = 0;
  const render = () => { if (!raf) raf = requestAnimationFrame(paint); };

  function place(s, flat, lay) {
    const a = Math.min(Math.abs(s.pos), 3);
    const side = Math.sign(s.pos);
    const [x, sc, r, o, dim] = lay[a];
    s.el.style.transform = `translateX(${-side * x || 0}%) scale(${flat ? 1 : sc}) rotateY(${flat ? 0 : side * r}deg)`;
    s.el.style.opacity = isOpen && a ? Math.min(o, OPEN_SIDE_OPACITY) : o;
    s.el.style.zIndex = Z[a];
    // A card leaving for ±3 fades out fast, so its slot is free to recycle soon.
    s.el.style.transitionDuration = s.exiting ? `800ms, ${exitMs()}ms` : '';
    s.dim.style.opacity = dim;
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
    while (queue && !isOpen) {
      const dir = Math.sign(queue);
      const wait = step(dir);
      if (wait > 0) {
        pumpTimer = setTimeout(pump, wait);
        return;
      }
      queue -= dir;
    }
  }

  function go(delta, manual = true) {
    if (!many || isOpen || !delta) return;
    if (manual) {
      announce = true;
      holdAutoplay();
    }
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
  const canPlay = () => many && !userPaused && motionOn() && !hovering && !focused && onScreen && !isOpen && !document.hidden;
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

  // ---- one listener set, on the carousel
  let swipe = null, swipedAt = -1e9;
  host.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('.work-arrow--next')) return go(1);
    if (t.closest('.work-arrow--prev')) return go(-1);
    const dot = t.closest('.work-dot');
    if (dot) return goTo(Number(dot.dataset.to));
    if (t.closest('.work-toggle')) return setUserPaused(!userPaused);
    const card = t.closest('.work-card');
    if (!card || performance.now() - swipedAt < 400) return;
    const s = slots.find((x) => x.el === card);
    if (!s || Math.abs(s.pos) > 2) return;
    if (s.pos === 0) openDetail(s);
    else go(s.pos);
  });
  // Only while focus is inside the carousel, never on the whole window.
  host.addEventListener('keydown', (e) => {
    if (!many || isOpen || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(-1); }
  });
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
        if (snap || isOpen) { tx = ty = 0; cx = cy = 0; }
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
    const move = (e) => {
      if (e.pointerType !== 'mouse' || isOpen) return;
      tx = TILT_DEG * clamp(((e.pageX - left) / w) * 2 - 1, -1, 1);
      ty = -TILT_DEG * clamp(((e.pageY - top) / ht) * 2 - 1, -1, 1);
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

  // ---- the detail dialog
  let dialog = null, panel, veil, scroller, media, dImg, dTags, dTitle, dLink, closeBtn;
  const facts = [];
  let opener = null;

  function buildDialog() {
    dialog = h('dialog', 'work-detail', { 'aria-modal': 'true', 'aria-labelledby': 'work-detail-title' });
    dialog.dataset.surface = 'dark';
    veil = h('div', 'work-detail__veil');
    panel = h('div', 'work-detail__panel');
    closeBtn = iconButton('work-detail__close', 'icon-x', 'بستن');
    scroller = h('div', 'work-detail__scroll', { role: 'region', 'aria-labelledby': 'work-detail-title' });
    media = h('figure', 'work-detail__media');
    dImg = h('img', '', { alt: '', decoding: 'async', sizes: DETAIL_SIZES });
    media.append(dImg);
    const text = h('div', 'work-detail__text');
    dTags = h('div', 'work-detail__tags');
    dTitle = h('h3', 'work-detail__title', { id: 'work-detail-title' });
    const dl = h('dl', 'work-facts');
    for (const [key, label] of [['need', 'نیاز کسب‌وکار'], ['built', 'راهکار ما'], ['result', 'نتیجه']]) {
      const row = h('div');
      const dt = h('dt');
      dt.textContent = label;
      const dd = h('dd');
      row.append(dt, dd);
      dl.append(row);
      facts.push([key, row, dd]);
    }
    dLink = h('div');
    text.append(dTags, dTitle, dl, dLink);
    scroller.append(media, text);
    panel.append(closeBtn, scroller);
    dialog.append(veil, panel);
    document.body.append(dialog);
    dialog.addEventListener('cancel', (e) => { e.preventDefault(); closeDetail(); }); // Esc
    veil.addEventListener('click', closeDetail);
    closeBtn.addEventListener('click', closeDetail);
    dialog.addEventListener('keydown', trapTab);
  }

  function fillDialog(pr) {
    const im = pr.image;
    media.hidden = !im;
    if (im) {
      dImg.width = im.width || 1920;
      dImg.height = im.height || 960;
      dImg.srcset = srcsetOf(im);
      dImg.src = im.src960 || im.src1920;
      dImg.alt = im.alt || '';
    }
    dTags.replaceChildren(...(pr.tags || []).map((t) => {
      const b = h('span', 'badge');
      b.textContent = t;
      return b;
    }));
    dTitle.textContent = pr.nameFa || pr.name || '';
    for (const [key, row, dd] of facts) {
      dd.textContent = pr[key] || '';
      row.hidden = !pr[key];
    }
    if (pr.url && pr.url !== '#') {
      const a = h('a', 'btn btn--md btn--outline', { target: '_blank', rel: 'noopener' });
      a.href = pr.url;
      a.append('دیدن سایت ', h('span', 'icon icon-arrow-up-left', { 'aria-hidden': 'true' }));
      dLink.replaceChildren(a);
    } else {
      const note = h('p', 'work-note');
      note.textContent = NOTE;
      dLink.replaceChildren(note);
    }
  }

  // Focus stays in the panel: Tab wraps round its own controls (and the
  // scrolling area, when the panel is taller than the screen).
  function trapTab(e) {
    if (e.key !== 'Tab') return;
    const f = [...panel.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]')].filter((el) => !el.closest('[hidden]'));
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  // Opens from the card's own rect (FLIP), slides up as a sheet on phones,
  // and only fades under reduced motion. Transform and opacity only.
  function panelFrames(rect) {
    if (!motionOn()) return [{ opacity: 0 }, { opacity: 1 }];
    if (narrow.matches) return [{ transform: 'translateY(100%)' }, { transform: 'none' }];
    const to = panel.getBoundingClientRect();
    const dx = rect.left + rect.width / 2 - (to.left + to.width / 2);
    const dy = rect.top + rect.height / 2 - (to.top + to.height / 2);
    return [
      { transform: `translate(${dx}px, ${dy}px) scale(${rect.width / to.width}, ${rect.height / to.height})`, opacity: 0 },
      { transform: 'none', opacity: 1 }
    ];
  }
  const settle = () => [panel, veil].forEach((el) => el.getAnimations().forEach((a) => a.cancel()));

  function setArrows(disabled) {
    if (prev) prev.disabled = next.disabled = disabled;
  }

  function openDetail(s) {
    if (isOpen || closing) return;
    if (!dialog) buildDialog();
    queue = 0;
    clearTimeout(pumpTimer);
    fillDialog(projects[s.p]);
    opener = s.more;
    const rect = s.el.getBoundingClientRect();
    isOpen = true;
    section.classList.add('is-detail-open');
    setArrows(true);
    schedule();
    render();
    dialog.showModal();
    scroller.scrollTop = 0;
    scroller.tabIndex = scroller.scrollHeight > scroller.clientHeight + 1 ? 0 : -1;
    closeBtn.focus({ preventScroll: true });
    settle();
    const dur = motionOn() ? 350 : 200;
    veil.animate([{ opacity: 0 }, { opacity: 1 }], { duration: dur, easing: 'linear' });
    panel.animate(panelFrames(rect), { duration: dur, easing: easeOut });
  }

  function closeDetail() {
    if (!isOpen || closing) return;
    closing = true;
    const centre = slots.find((x) => x.pos === 0);
    const dur = motionOn() ? 300 : 160;
    settle();
    veil.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur, easing: 'linear', fill: 'forwards' });
    const a = panel.animate(panelFrames(centre.el.getBoundingClientRect()).reverse(), { duration: dur, easing: easeOut, fill: 'forwards' });
    a.finished.catch(() => {}).then(() => {
      dialog.close();
      settle();
      closing = false;
      isOpen = false;
      section.classList.remove('is-detail-open');
      setArrows(false);
      render();
      opener?.focus({ preventScroll: true });
      holdAutoplay();
    });
  }

  render();
  queueAmbient();
}
