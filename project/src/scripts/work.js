// mitec — Work: a 3D coverflow of the projects in src/data/portfolio.json
// (DESIGN.md §5, "Work coverflow").
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
// Each card's front is the client's website and nothing else: one <button>
// (the centre card's is the control; a cue chip in its bottom-end corner says
// so), with the project named in a caption under the stage. The details are
// the card's back: the centre card turns over to it, or, where a card is too
// short to hold it (phones and narrow tablets), the same back opens as a
// bottom sheet. Any move of the carousel turns a card back first.
//
// A step writes each card's transform and opacity once, in one frame, and the
// CSS transitions in home.css do the motion. The only per-frame work is the
// optional stage tilt, a track on the shared engine. Layout is read only on
// resize (the engine's measure) and when a text panel scrolls or changes.

import { track, kick, whenMotion } from './motion/engine.js';
import { clamp, damp } from './motion/easing.js';
import { faNumber } from '../utils/format.js';
import { icon, setIcon } from '../utils/icon.js';

const POOL = 7;          // offsets −3 … +3
const HOLD_MS = 8000;    // autoplay rests this long after a manual interaction or the details close
const SWIPE_PX = 45;
const MAX_DOTS = 7;      // more projects than this: a «۳ از ۱۲» counter instead
const TILT_DEG = 3;
const CUE_CIRCLE = 40;   // the cue chip's collapsed circle, px (home.css)
const HINT_MS = 260 + 2400; // the first-view hint: expand, hold while the ring pulses twice, collapse

// Offsets 0, ±1, ±2, ±3: [translateX in % of the card's width, scale,
// rotateY, opacity, dim]. The side cards turn to face the centre. Tuned for
// the 16:10 card (measured): from 1280px each ±2 card is ~90% on screen and
// 42–44% clear of the ±1 card in front of it, which stays ~55% clear of the
// centre card. ±1 is fully opaque (the dim layer alone sets it back), so no
// card ever shows another through it; only ±2 fades, and ±3 is out.
// flat (reduced motion): the centre card alone, flat; the others wait,
// invisible and inert, a card's width (+4%) apart, and a slide change
// crossfades in place (home.css), so nothing slides.
const LAYOUT = {
  wide: [[0, 1, 0, 1, 0], [50, .74, 34, 1, .45], [88, .56, 46, .3, .6], [124, .46, 48, 0, .6]],
  narrow: [[0, 1, 0, 1, 0], [62, .86, 16, 1, .45], [112, .72, 24, .3, .6], [150, .6, 30, 0, .6]],
  flat: [[0, 1, 0, 1, 0], [104, 1, 0, 0, 0], [208, 1, 0, 0, 0], [312, 1, 0, 0, 0]]
};
const Z = [30, 20, 10, 0];
const FLIPPED_DIM = .15; // extra dim on the side cards while the centre card is turned over

// The back's three blocks, in reading order (right to left): the tab label,
// and the label of the same text as a row (as in the no-JS list, .work-facts).
const TABS = [['need', 'نیاز', 'نیاز کسب‌وکار'], ['built', 'راهکار', 'راهکار ما'], ['result', 'نتیجه', 'نتیجه']];

// The screenshot covers a 16:10 card of clamp(300px, 42vw, 600px) (86vw up
// to 989px, less on a short screen); it is about 2:1, so it is drawn at
// ~1.3× the card's width.
const CARD_SIZES = '(max-width: 989px) 112vw, (max-width: 1428px) 55vw, 780px';
const SHEET_SIZES = '100vw';
const NOTE = 'لینک سایت بعد از تأیید مشتری منتشر می‌شود.';

const root = document.documentElement;
// Up to the sheet breakpoint the centre card is 86vw and the side cards peek.
const narrow = matchMedia('(max-width: 989px)');
// Below 990px a 16:10 card is under ~260px tall: too short for its back, so
// the details open as a bottom sheet there (phones included).
const sheetMode = matchMedia('(max-width: 989px)');
// From 1024px the back shows its three texts as rows where they fit the card
// (checked per card), and the tabs only where they don't.
const rowsMode = matchMedia('(min-width: 1024px)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const motionOn = () => root.classList.contains('motion');
const flipMs = () => (motionOn() ? 700 : 250);   // home.css: the flip, or the reduced-motion crossfade
const mod = (n, m) => ((n % m) + m) % m;

// The caption's name: the optional `name`, else the title before «؛».
const nameOf = (pr) => String(pr.name || '').trim() || String(pr.title || pr.nameFa || '').split('؛')[0].trim();
const summaryOf = (pr) => String(pr.summary || '').trim() || (pr.tags || []).join(' · ');

function h(tag, cls, attrs = {}) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}
function iconButton(cls, name, label) {
  const b = h('button', cls, { type: 'button', 'aria-label': label });
  b.append(icon(name));
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
  const easeOut = getComputedStyle(root).getPropertyValue('--ease-out').trim() || 'ease-out';

  // ---- state
  let active = 0;          // unbounded virtual index of the centre card
  let queue = 0;           // steps still to take (signed), e.g. from a dot three away
  let pumpTimer = 0;
  let manualMove = false;  // the next caption change comes from the visitor, not autoplay
  let flipped = null;      // the slot turned over to its back, if any
  let sheetSlot = null;    // the slot whose back is open as the bottom sheet, if any
  let turningUntil = 0;    // until then a card is still turning back; the carousel waits

  // ---- the stage and its seven slots
  const stage = h('div', 'work-stage');
  const trackEl = h('div', 'work-stage__track');
  stage.append(trackEl);
  const slots = Array.from({ length: POOL }, (_, i) => makeSlot(i));
  trackEl.append(...slots.map((s) => s.el));

  // ---- the caption under the stage: two layers, so the old one can leave
  // while the new one arrives. Silent during autoplay, polite on manual moves.
  const caption = h('div', 'work-caption', { 'aria-live': 'off', 'aria-atomic': 'true' });
  const capItems = [0, 1].map(() => {
    const item = h('div', 'work-caption__item');
    const name = h('p', 'work-caption__name', { dir: 'auto' });
    const summary = h('p', 'work-caption__summary');
    item.append(name, summary);
    caption.append(item);
    return { item, name, summary };
  });
  let capCur = 0;
  let capProject = -1;
  let politeTimer = 0;

  // ---- controls
  let toggle = null, counter = null, bar = null;
  let dots = [];
  const controls = h('div', 'work-controls');
  host.append(stage);
  if (many) {
    host.append(
      iconButton('work-arrow work-arrow--prev', 'chevron-right', 'پروژه‌ی قبلی'),
      iconButton('work-arrow work-arrow--next', 'chevron-left', 'پروژه‌ی بعدی')
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
    toggle = iconButton('work-toggle', 'pause', 'توقف چرخش');
    controls.append(toggle);
  }
  host.append(caption, controls);

  // One card: a front (the website, as a button, with its cue chip) and a
  // back (the details), the same size, back to back inside .work-card__inner.
  function makeSlot(i) {
    const el = h('div', 'work-card is-teleport');
    const inner = h('div', 'work-card__inner');

    const front = h('button', 'work-card__front', { type: 'button', 'aria-controls': `work-back-${i}` });
    const img = h('img', 'work-card__img', { alt: '', decoding: 'async', sizes: CARD_SIZES });
    // Scroll preview (opt-in, image.full): the wrapper drops one card height
    // while the tall screenshot rises its own height, so its foot meets the
    // card's foot. Transforms only; no measuring.
    const pan = h('span', 'work-card__pan', { 'aria-hidden': 'true' });
    const full = h('img', 'work-card__full', { alt: '', decoding: 'async' });
    pan.append(full);
    const cue = h('span', 'work-cue', { 'aria-hidden': 'true' });
    const label = h('span', 'work-cue__label');
    label.append(h('span', 'work-cue__long'), h('span', 'work-cue__short'));
    label.firstChild.textContent = 'جزئیات پروژه';
    label.lastChild.textContent = 'جزئیات';
    const circle = h('span', 'work-cue__circle');
    circle.append(icon('plus'));
    cue.append(h('span', 'work-cue__pill'), label, circle);
    const dim = h('span', 'work-card__dim', { 'aria-hidden': 'true' });
    front.append(img, pan, cue, dim);

    const back = h('div', 'work-card__back', { id: `work-back-${i}`, role: 'group', 'aria-labelledby': `work-back-title-${i}` });
    back.inert = true;
    const backImg = h('img', 'work-card__back-img', { alt: '', decoding: 'async', loading: 'lazy' });
    const sheet = h('div', 'work-card__sheet');
    const head = h('div', 'work-card__head');
    const backTags = h('div', 'work-card__tags');
    head.append(backTags, iconButton('work-card__close', 'x', 'بستن جزئیات'));
    const backTitle = h('h3', 'work-card__back-title', { id: `work-back-title-${i}` });
    const tablist = h('div', 'work-tabs', { role: 'tablist', 'aria-labelledby': backTitle.id });
    const indicator = h('span', 'work-tabs__indicator', { 'aria-hidden': 'true' });
    tablist.append(indicator);
    const content = h('div', 'work-card__content');
    const tabs = [], panels = [];
    TABS.forEach(([, text], k) => {
      const tab = h('button', 'work-tab', { type: 'button', role: 'tab', id: `work-tab-${i}-${k}`, 'aria-controls': `work-panel-${i}-${k}` });
      tab.textContent = text;
      tab.dataset.k = k;
      const panel = h('div', 'work-card__panel', { role: 'tabpanel', id: `work-panel-${i}-${k}`, 'aria-labelledby': tab.id });
      panel.append(h('p'));
      tabs.push(tab);
      panels.push(panel);
    });
    tablist.append(...tabs);
    content.append(...panels);
    // The same three texts as rows (the no-JS list's .work-facts), shown
    // instead of the tabs where they fit.
    const rows = h('dl', 'work-facts work-card__rows');
    const rowTexts = TABS.map(([, , label]) => {
      const pair = h('div');
      const dt = h('dt');
      dt.textContent = label;
      const dd = h('dd');
      pair.append(dt, dd);
      rows.append(pair);
      return dd;
    });
    const foot = h('div', 'work-card__foot');
    sheet.append(head, backTitle, tablist, content, rows, foot);
    back.append(backImg, sheet);

    inner.append(front, back);
    el.append(inner);
    const s = { el, front, img, pan, full, dim, back, backImg, sheet, backTags, backTitle, indicator, tabs, panels, rows, rowTexts, foot,
      fullSrc: '', pos: i - 3, p: -1, tab: 0, clearAt: 0, exiting: false, teleport: true };
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
    // The tall screenshot loads only when this card first becomes the centre one.
    s.pan.classList.remove('is-ready');
    s.full.removeAttribute('src');
    s.fullSrc = im?.full || '';
    s.backTitle.textContent = pr.nameFa || pr.title || nameOf(pr);
    s.backTags.replaceChildren(...chips(pr.tags));
    s.backImg.hidden = !im?.ambient;
    if (im?.ambient) s.backImg.src = im.ambient;
    TABS.forEach(([key], k) => { s.panels[k].firstChild.textContent = s.rowTexts[k].textContent = pr[key] || ''; });
    if (pr.url && pr.url !== '#') {
      const a = h('a', 'btn btn--sm btn--outline work-card__site', { target: '_blank', rel: 'noopener' });
      a.href = pr.url;
      a.append('دیدن سایت ', icon('arrow-up-left'));
      s.foot.replaceChildren(a);
    } else {
      const note = h('p', 'work-note');
      note.textContent = NOTE;
      s.foot.replaceChildren(note);
    }
    selectTab(s, 0);
    fitRows(s);
  }
  // Rows where all three texts fit the card's text area without scrolling,
  // from 1024px; otherwise (or below) the tabs.
  function fitRows(s) {
    if (!rowsMode.matches) {
      s.el.classList.remove('has-rows');
      return;
    }
    s.el.classList.add('has-rows');
    if (s.rows.scrollHeight > s.rows.clientHeight + 1) s.el.classList.remove('has-rows');
  }
  slots.forEach(fill);

  function loadFull(s) {
    if (!s.fullSrc || s.full.getAttribute('src')) return;
    s.full.onload = () => s.pan.classList.add('is-ready');
    s.full.src = s.fullSrc;
  }

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

  // ---- details: the flip, or the bottom sheet where a card is too short
  const detailOpen = () => !!(flipped || sheetSlot);
  function openDetail(s) {
    if (detailOpen() || s.pos !== 0 || performance.now() < turningUntil) return;
    queue = 0;
    clearTimeout(pumpTimer);
    if (sheetMode.matches) openSheet(s);
    else flip(s);
  }
  function flip(s) {
    flipped = s;
    selectTab(s, 0);
    s.back.inert = false;
    // Before the front goes inert, so focus never drops to <body>: the first
    // tab, or the back's × where the rows show (read inside the back, which
    // is named by its title).
    (s.el.classList.contains('has-rows') ? s.back.querySelector('.work-card__close') : s.tabs[0]).focus({ preventScroll: true });
    s.front.inert = true;
    s.front.setAttribute('aria-expanded', 'true');
    s.el.classList.add('is-flipped');
    host.classList.add('is-flipped');
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
    if (hadFocus || returnFocus) s.front.focus({ preventScroll: true });
    s.back.inert = true;
    s.front.setAttribute('aria-expanded', 'false');
    s.el.classList.remove('is-flipped');
    host.classList.remove('is-flipped');
    // The carousel moves once the card has (nearly) finished turning back.
    turningUntil = performance.now() + flipMs() * 0.65;
    render();
    holdAutoplay();
  }

  // The bottom sheet reuses the card's own back: its .work-card__sheet node
  // moves into the dialog under the screenshot, and back again on close.
  let dialog = null, sheetPanel, sheetShot, sheetVeil;
  function buildSheet() {
    dialog = h('dialog', 'work-sheet', { 'aria-modal': 'true' });
    dialog.dataset.surface = 'dark';
    sheetVeil = h('div', 'work-sheet__veil');
    sheetPanel = h('div', 'work-sheet__panel');
    sheetShot = h('img', 'work-sheet__shot', { alt: '', decoding: 'async', sizes: SHEET_SIZES });
    sheetPanel.append(sheetShot);
    dialog.append(sheetVeil, sheetPanel);
    document.body.append(dialog);
    dialog.addEventListener('cancel', (e) => { e.preventDefault(); closeSheet(); }); // Esc
    sheetVeil.addEventListener('click', () => closeSheet());
    dialog.addEventListener('click', onDetailClick);
    dialog.addEventListener('keydown', (e) => {
      if (onTabKey(e) || e.key !== 'Tab') return;
      // Focus stays in the sheet: Tab wraps round its controls.
      const f = [...sheetPanel.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]')].filter((el) => !el.closest('[inert]'));
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
  function openSheet(s) {
    if (!dialog) buildSheet();
    sheetSlot = s;
    const im = projects[s.p].image;
    sheetShot.hidden = !im;
    if (im) {
      sheetShot.width = im.width || 1920;
      sheetShot.height = im.height || 960;
      sheetShot.srcset = srcsetOf(im);
      sheetShot.src = im.src960 || im.src1920;
      sheetShot.alt = im.alt || '';
    }
    selectTab(s, 0);
    sheetPanel.append(s.sheet);
    dialog.setAttribute('aria-labelledby', s.backTitle.id);
    s.front.setAttribute('aria-expanded', 'true');
    host.classList.add('is-flipped');
    render();
    schedule();
    dialog.showModal();
    sheetPanel.scrollTop = 0;
    s.tabs[0].focus({ preventScroll: true });
    const reduce = !motionOn();
    sheetVeil.animate([{ opacity: 0 }, { opacity: 1 }], { duration: reduce ? 150 : 320, easing: 'linear' });
    sheetPanel.animate(reduce ? [{ opacity: 0 }, { opacity: 1 }] : [{ transform: 'translateY(100%)' }, { transform: 'none' }],
      { duration: reduce ? 150 : 320, easing: easeOut });
  }
  let sheetClosing = false;
  function closeSheet() {
    const s = sheetSlot;
    if (!s || sheetClosing) return;
    sheetClosing = true;
    const reduce = !motionOn();
    const dur = reduce ? 150 : 260;
    sheetVeil.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur, easing: 'linear', fill: 'forwards' });
    const a = sheetPanel.animate(reduce ? [{ opacity: 1 }, { opacity: 0 }] : [{ transform: 'none' }, { transform: 'translateY(100%)' }],
      { duration: dur, easing: easeOut, fill: 'forwards' });
    a.finished.catch(() => {}).then(() => {
      dialog.close();
      [sheetVeil, sheetPanel].forEach((el) => el.getAnimations().forEach((x) => x.cancel()));
      s.back.append(s.sheet);
      s.front.setAttribute('aria-expanded', 'false');
      host.classList.remove('is-flipped');
      sheetSlot = null;
      sheetClosing = false;
      s.front.focus({ preventScroll: true });
      render();
      holdAutoplay();
    });
  }
  function closeDetail(returnFocus = true) {
    if (sheetSlot) closeSheet();
    else unflip(returnFocus);
  }
  // Crossing 990px with the details open: close them; the next open picks the right form.
  sheetMode.addEventListener('change', () => { if (detailOpen()) closeDetail(false); });

  // Clicks and keys inside a back, wherever it is (on the card or in the sheet).
  function slotOf(el) {
    return slots.find((x) => x.el.contains(el) || x.sheet.contains(el));
  }
  function onDetailClick(e) {
    const t = e.target;
    if (t.closest('.work-card__close')) { closeDetail(true); return true; }
    const tab = t.closest('.work-tab');
    if (tab) { selectTab(slotOf(tab), Number(tab.dataset.k), true); return true; }
    return false;
  }
  // Tabs: roving focus in RTL order, so ArrowLeft is the next tab.
  function onTabKey(e) {
    const tab = e.target.closest?.('.work-tab');
    if (!tab || e.altKey || e.ctrlKey || e.metaKey) return false;
    const s = slotOf(tab);
    const k = { ArrowLeft: s.tab + 1, ArrowRight: s.tab - 1, Home: 0, End: TABS.length - 1 }[e.key];
    if (k === undefined) return false;
    e.preventDefault();
    selectTab(s, mod(k, TABS.length), true);
    return true;
  }

  // ---- the caption: always the centre project; it moves with the cards
  // (dir +1 is forward, and the cards then travel right on this RTL page).
  function setCaption(p, dir) {
    if (p === capProject) return;
    const first = capProject < 0;
    capProject = p;
    const pr = projects[p];
    const inc = capItems[1 - capCur], out = capItems[capCur];
    capCur = 1 - capCur;
    inc.name.textContent = nameOf(pr);
    inc.summary.textContent = summaryOf(pr);
    inc.summary.title = summaryOf(pr);
    // Manual moves are announced once; autoplay's never.
    clearTimeout(politeTimer);
    caption.setAttribute('aria-live', manualMove ? 'polite' : 'off');
    manualMove = false;
    politeTimer = setTimeout(() => caption.setAttribute('aria-live', 'off'), 1500);
    out.item.setAttribute('aria-hidden', 'true');
    inc.item.removeAttribute('aria-hidden');
    for (const el of [out.item, inc.item, inc.name, inc.summary, out.name, out.summary]) el.getAnimations().forEach((x) => x.cancel());
    out.item.style.opacity = '0';
    inc.item.style.opacity = '';
    if (first) return;
    if (!motionOn()) {
      out.item.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, easing: 'linear' });
      inc.item.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: 'linear' });
      return;
    }
    out.item.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${8 * dir}px)` }], { duration: 180, easing: easeOut });
    [inc.name, inc.summary].forEach((el, i) => el.animate(
      [{ opacity: 0, transform: `translateX(${-12 * dir}px)` }, { opacity: 1, transform: 'none' }],
      { duration: 320, delay: 100 + 60 * i, easing: easeOut, fill: 'backwards' }
    ));
  }

  // ---- writing one frame
  let raf = 0;
  const render = () => { if (!raf) raf = requestAnimationFrame(paint); };

  function place(s, flat, lay) {
    const a = Math.min(Math.abs(s.pos), 3);
    const side = Math.sign(s.pos);
    const [x, sc, r, o, dim] = lay[a];
    s.el.style.transform = `translateX(${-side * x || 0}%) scale(${sc}) rotateY(${side * r}deg)`;
    s.el.style.opacity = o;
    s.el.style.zIndex = Z[a];
    // A card leaving for ±3 fades out fast, so its slot is free to recycle soon.
    // (Flat, every card but the centre one is already invisible.)
    s.el.style.transitionDuration = s.exiting && !flat ? `800ms, ${exitMs()}ms` : '';
    s.dim.style.opacity = flipped && a ? Math.min(dim + FLIPPED_DIM, .85) : dim;
    s.el.dataset.pos = s.pos;
    s.el.classList.toggle('is-active', a === 0);
    s.el.inert = a === 3 || (flat && a > 0);
    const name = nameOf(projects[s.p]);
    s.front.tabIndex = a === 0 ? 0 : -1;
    if (a === 0) {
      s.el.setAttribute('role', 'group');
      s.el.setAttribute('aria-roledescription', 'اسلاید');
      s.el.setAttribute('aria-label', `${faNumber(s.p + 1)} از ${faNumber(N)}`);
      s.front.setAttribute('aria-label', `${name} — مشاهده‌ی جزئیات پروژه`);
      s.front.setAttribute('aria-expanded', String(s === flipped || s === sheetSlot));
      loadFull(s);
    } else {
      s.el.removeAttribute('role');
      s.el.removeAttribute('aria-roledescription');
      s.el.removeAttribute('aria-label');
      s.front.setAttribute('aria-label', `رفتن به پروژه‌ی ${name}`);
      s.front.removeAttribute('aria-expanded');
    }
  }

  function paint() {
    raf = 0;
    const flat = !motionOn();
    const lay = flat ? LAYOUT.flat : narrow.matches ? LAYOUT.narrow : LAYOUT.wide;
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
    // Focus never stays on a card that has turned to the side.
    const centre = slots.find((s) => s.pos === 0);
    const f = document.activeElement;
    if (f && host.contains(f) && f.closest('.work-card') && f.closest('.work-card') !== centre.el) centre.front.focus({ preventScroll: true });
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
    setCaption(mod(active, N), dir);
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
    while (queue && !detailOpen()) {
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
    if (!many || !delta || sheetSlot) return;
    if (manual) {
      manualMove = true;
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
  const canPlay = () => many && !userPaused && motionOn() && !hovering && !focused && onScreen && !detailOpen() && !document.hidden;
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
      setIcon(toggle.firstChild, v ? 'play' : 'pause');
    }
    schedule();
  }
  setUserPaused(userPaused);

  // ---- the first-view hint: once per page load, when the section is half in
  // view, the centre card's cue opens, its ring pulses twice, and it closes.
  // Autoplay carries on.
  const hintIO = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    hintIO.disconnect();
    host.classList.add('is-hinting');
    setTimeout(() => host.classList.remove('is-hinting'), HINT_MS);
  }, { threshold: 0.5 });
  hintIO.observe(section);

  // ---- one listener set, on the carousel (plus Esc and outside clicks while a card is turned)
  let swipe = null, swipedAt = -1e9;
  host.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('.work-arrow--next')) return go(1);
    if (t.closest('.work-arrow--prev')) return go(-1);
    const dot = t.closest('.work-dot');
    if (dot) return goTo(Number(dot.dataset.to));
    if (t.closest('.work-toggle')) return setUserPaused(!userPaused);
    if (onDetailClick(e)) return;
    const front = t.closest('.work-card__front');
    if (!front || performance.now() - swipedAt < 400) return;
    const s = slotOf(front);
    if (!s || Math.abs(s.pos) > 2) return;
    if (s.pos === 0) openDetail(s);
    else go(s.pos);
  });
  host.addEventListener('keydown', (e) => {
    if (onTabKey(e) || e.altKey || e.ctrlKey || e.metaKey) return;
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

  // The cue chip opens with transforms only: its pill layer scales from the
  // collapsed circle to its full width, which is measured here on resize.
  track({
    measure() {
      const cue = slots.find((s) => s.pos === 0)?.front.querySelector('.work-cue');
      const w = cue?.offsetWidth;
      if (w) host.style.setProperty('--cue-s', (CUE_CIRCLE / w).toFixed(4));
      slots.forEach(fitRows); // the card's size, or the font, changed
    },
    update() {}
  });

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
  setCaption(mod(active, N), 1);
  queueAmbient();
}
