// mitec — Quick scope: a price-and-duration calculator. Site-type tabs; a
// summary card (what the base always includes, then the total and the one
// CTA); the page slider and a grid of add-on tiles. Everything it shows comes
// from the pricing document (getPricing()): packages, items, prices, days and
// every label. The maths is the shared estimate() the /order wizard will use
// too. Nothing is scroll-scrubbed here: it is a tool.
//
// Layout (home.css): from 1024px the summary card is the start column and is
// always in view (sticky), never taller than the screen: only its list of
// included items gives way, scrolling inside the card, and it shows the
// items' descriptions only when the whole list fits without that. Below
// 1024px everything stacks and the total + CTA ride in a bar at the bottom
// of the screen while the calculator is on it. That total + CTA block is a
// single element moved between the card and the bar, so there is always one
// live region and one CTA. Long add-on lists show their first few tiles and
// a button for the rest.

import { getPricing } from '../api/client.js';
import { estimate } from '../utils/estimate.js';
import { faNumber, fill, formatPrice, formatDuration } from '../utils/format.js';

// The only strings not taken from the pricing document: what shows when it
// cannot be loaded, the way out for visitors unsure of their site type, the
// count of chosen add-ons under the total, and the defaults for the two
// optional section fields that fold a long add-on list.
const COPY = {
  error: 'برآورد در دسترس نیست؛ مستقیم در سفارش‌ساز ادامه دهید',
  cta: 'ادامه در سفارش‌ساز',
  unsure: 'مطمئن نیستید؟ در سفارش‌ساز کمکتان می‌کنیم',
  picked: '{n} امکان انتخاب شده',
  showAllAddons: 'نمایش همه‌ی امکانات ({n})',
  showFewerAddons: 'نمایش کمتر'
};
const ORDER_URL = './order/';
const STORE_KEY = 'mitec.order.v1'; // the order builder's own saved state
const MORE_AFTER = 4; // phones show this many base items before «show all»
const WIDE = '(min-width: 1024px)'; // two columns, sticky summary card
const STICKY_GAP = 24; // px between the nav and the sticky card
const ADDONS_SHOWN = { wide: 9, narrow: 6 }; // tiles shown before «show all add-ons»
const root = document.documentElement;

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};
const icon = (name) => {
  const i = el('span', `icon icon-${name}`);
  i.setAttribute('aria-hidden', 'true');
  return i;
};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// A changed figure: the old value slides up 8px and fades as the new one
// slides in, both in one grid cell so the line never reflows mid-fade.
function swap(box, text) {
  const old = box.lastElementChild;
  if (old?.textContent === text) return;
  box.append(el('span', null, text));
  if (!old) return;
  if (!root.classList.contains('motion')) return old.remove();
  const ease = { duration: 220, easing: 'cubic-bezier(.22,.61,.36,1)' }; // --dur, --ease-out
  old.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-8px)' }], ease).onfinish = () => old.remove();
  box.lastElementChild.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], ease);
}

const cta = (label) => {
  const a = el('a', 'btn btn--lg btn--primary scope-cta', label);
  a.href = ORDER_URL;
  a.append(' ', icon('arrow-left'));
  return a;
};

export async function initScope() {
  const sec = document.getElementById('scope');
  if (!sec) return;
  const $ = (id) => document.getElementById(id);
  const head = $('scopeHead');
  const body = $('scopeBody');
  const typesBox = $('scopeTypes');
  const summary = $('scopeSummary');
  const config = $('scopeConfig');

  let res;
  try {
    res = await getPricing();
  } catch (e) {
    res = { ok: false, error: e };
  }
  const P = res.ok ? res.data : null;
  const types = P ? P.siteTypes.filter((t) => t.active) : [];
  sec.removeAttribute('aria-busy');

  // Unavailable: one line and the way on, nothing else.
  if (!types.length) {
    console.error('[scope] pricing unavailable', res.error || 'no active site types');
    head.replaceChildren();
    body.replaceChildren(el('p', 'scope-error', COPY.error), cta(COPY.cta));
    return;
  }

  const S = P.section;
  const addons = new Map(P.addons.filter((a) => a.active).map((a) => [a.id, a]));
  const unit = { prefix: P.display.durationPrefix, label: P.display.durationLabel };
  const price = (n) => formatPrice(n, P.currency);
  const state = { type: types[0], pages: 0, picked: new Set() };

  // ---- heading (+ the «sample numbers» badge while the numbers are placeholders)
  const title = el('div', 'scope-head__title');
  const h2 = el('h2', 'section-heading__title section-heading__title--display-3', S.title);
  h2.id = 'scope-title';
  title.append(h2);
  if (P.placeholder && S.placeholderBadge) {
    const badge = el('span', 'badge badge--highlight');
    badge.append(icon('clock'), S.placeholderBadge);
    title.append(badge);
  }
  head.replaceChildren(el('span', 'section-heading__eyebrow', S.eyebrow), title);
  if (S.subtitle) head.append(el('p', 'section-heading__sub', S.subtitle));

  // ---- site-type tabs: a native radio group, so the arrow keys, roving focus
  // and their RTL direction come from the browser.
  const group = el('fieldset', 'scope-tabs');
  group.append(el('legend', 'visually-hidden', S.typesLabel));
  const track = el('div', 'scope-tabs__track');
  for (const t of types) {
    const label = el('label', 'scope-tab');
    const input = el('input');
    Object.assign(input, { type: 'radio', name: 'scope-type', value: t.id, checked: t === state.type });
    label.append(input, el('span', null, t.label));
    track.append(label);
  }
  group.append(track);
  const unsure = el('a', 'scope-unsure', COPY.unsure);
  unsure.href = ORDER_URL;
  typesBox.replaceChildren(group, unsure);

  // ---- the checkout: total, what is picked, the live line and the CTA. It
  // sits at the foot of the summary card from 1024px, in the bottom bar below.
  const checkout = el('div', 'scope-checkout');
  const figures = el('div', 'scope-checkout__figures');
  const priceBox = P.display.showPrice ? el('span', 'scope-total__price') : null;
  const daysBox = P.display.showDuration ? el('span', 'scope-total__days') : null;
  const lead = priceBox || daysBox; // the big figure: the price, or the days without prices
  if (lead) {
    const total = el('p', 'scope-total');
    total.setAttribute('aria-hidden', 'true'); // screen readers get the live line below
    lead.classList.add('scope-total__figure');
    total.append(el('span', 'scope-total__label', S.totalLabel), lead);
    figures.append(total);
  }
  const meta = el('p', 'scope-meta');
  if (daysBox && daysBox !== lead) {
    daysBox.setAttribute('aria-hidden', 'true');
    meta.append(daysBox);
  }
  const count = el('span', 'scope-meta__count');
  meta.append(count);
  figures.append(meta);
  const live = el('p', 'visually-hidden');
  live.setAttribute('aria-live', 'polite');
  const go = cta(S.ctaLabel || COPY.cta);
  checkout.append(figures, live, go);

  // ---- the summary card: the base (rebuilt per type), then the checkout and
  // the disclaimer
  const baseBox = el('div', 'scope-summary__base');
  const note = S.disclaimer ? el('p', 'scope-disclaimer', S.disclaimer) : null;
  summary.replaceChildren(baseBox, ...(note ? [note] : []));

  let slider = null;
  let sliderValue = null;
  let list = null; // the included items; scrolls inside the sticky card when it must
  let listBox = null;

  // The fade at the list's foot shows only while there is more below.
  function listEdge() {
    if (!list) return;
    const scrolls = list.scrollHeight > list.clientHeight + 1;
    listBox.classList.toggle('has-more', scrolls && list.scrollTop + list.clientHeight < list.scrollHeight - 1);
    // A list that scrolls must be reachable by keyboard to be scrolled.
    if (scrolls === list.hasAttribute('tabindex')) return;
    if (scrolls) {
      list.tabIndex = 0;
      list.setAttribute('aria-label', state.type.base.title);
    } else {
      list.removeAttribute('tabindex');
      list.removeAttribute('aria-label');
    }
  }

  function renderBase(t) {
    list = el('ul', 'scope-base__list');
    list.id = 'scopeIncluded';
    list.addEventListener('scroll', listEdge, { passive: true });
    listBox = el('div', 'scope-base__box');
    listBox.append(list);
    t.base.included.forEach((item, i) => {
      const li = el('li', i >= MORE_AFTER ? 'is-more' : null);
      const mark = el('span', 'scope-base__mark');
      mark.append(icon('check'));
      const text = el('span', 'scope-base__item');
      text.append(el('strong', null, item.title));
      if (item.desc) text.append(el('span', 'scope-base__desc', item.desc));
      li.append(mark, text);
      list.append(li);
    });
    const top = el('div', 'scope-base__head');
    top.append(el('h3', 'scope-base__title', t.base.title));
    if (t.base.subtitle) top.append(el('p', 'scope-base__sub', t.base.subtitle));
    const parts = [top, listBox];
    if (t.base.included.length > MORE_AFTER && S.showAll) {
      const more = el('button', 'scope-base__more', S.showAll);
      more.type = 'button';
      more.setAttribute('aria-expanded', 'false');
      more.setAttribute('aria-controls', list.id);
      more.append(icon('plus'));
      more.addEventListener('click', () => {
        const open = list.classList.toggle('is-open');
        more.setAttribute('aria-expanded', String(open));
        more.lastChild.className = `icon icon-${open ? 'minus' : 'plus'}`;
      });
      parts.push(more);
    }
    if (S.pagesIncluded) parts.push(el('p', 'scope-base__pages', fill(S.pagesIncluded, { n: faNumber(t.base.pagesIncluded) })));
    baseBox.replaceChildren(...parts);
  }

  // One add-on tile; the whole tile is the toggle. The price line is always
  // there (empty for a free add-on) so every tile's last line lines up.
  function tile(a) {
    const on = state.picked.has(a.id);
    const b = el('button', 'scope-addon');
    b.type = 'button';
    b.dataset.id = a.id;
    b.setAttribute('aria-pressed', String(on));
    const top = el('span', 'scope-addon__top');
    const toggle = el('span', 'scope-addon__toggle');
    toggle.append(icon(on ? 'minus' : 'plus'));
    const name = el('span', 'scope-addon__title', a.title);
    name.title = a.title; // clamped to two lines on screen
    top.append(name, toggle);
    b.append(top);
    if (a.desc) {
      const desc = el('span', 'scope-addon__desc', a.desc);
      desc.title = a.desc; // clamped to two lines on screen
      b.append(desc);
    }
    // No price element at all when prices are off.
    if (P.display.showPrice) b.append(el('span', 'scope-addon__price', a.price > 0 ? price(a.price) : ''));
    return b;
  }

  function renderConfig(t) {
    const parts = [];
    slider = null;
    sliderValue = null;
    if (t.pages.enabled) {
      const box = el('div', 'scope-pages');
      const top = el('div', 'scope-pages__head');
      const label = el('label', 'scope-pages__title', S.pagesTitle);
      label.htmlFor = 'scopePages';
      sliderValue = el('output', 'scope-pages__value');
      sliderValue.htmlFor = 'scopePages';
      top.append(label, sliderValue);
      slider = el('input', 'scope-range');
      Object.assign(slider, { type: 'range', id: 'scopePages', min: t.pages.min, max: t.pages.max, step: 1, value: state.pages });
      slider.addEventListener('input', () => {
        state.pages = Number(slider.value);
        update(true);
      });
      box.append(top, slider);
      if (S.pagesDesc) {
        const hint = el('p', 'scope-pages__desc', S.pagesDesc);
        hint.id = 'scopePagesDesc';
        slider.setAttribute('aria-describedby', hint.id);
        box.append(hint);
      }
      parts.push(box);
    }

    addonsBox = el('div', 'scope-addons-box');
    addonsBox.id = 'scopeAddons';
    parts.push(addonsBox);
    config.replaceChildren(...parts);
    renderAddons(t);
  }

  // Tiles in one grid, or — only if the data gives add-ons a `group` — one
  // small heading and grid per group, in order of first appearance. Add-ons
  // without a group come first, straight under the section's add-on title.
  //
  // A long list shows its first few tiles and a button for the rest. A chosen
  // add-on is never folded away: it stays in view past the limit. The limit
  // is applied when the list is drawn, not on each toggle, so a tile never
  // vanishes from under the pointer. Folded tiles are left out of the DOM, so
  // the grids' last-row rules count only the tiles on screen.
  let addonsBox = null;
  let expanded = false;

  // `focus`: after «show all», the ids that were already on screen (focus
  // goes to the first new tile); after «show fewer», 'more' (focus stays on
  // the button). Nothing moves focus otherwise.
  function renderAddons(t, focus) {
    const offered = t.addons.map((id) => addons.get(id)).filter(Boolean).sort((x, y) => x.order - y.order);
    const groups = new Map([['', []]]);
    for (const a of offered) {
      const g = a.group || '';
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g).push(a);
    }
    const all = [...groups.values()].flat(); // display order
    const limit = wide.matches ? ADDONS_SHOWN.wide : ADDONS_SHOWN.narrow;
    const folds = all.length > limit;
    const shown = new Set(all.filter((a, i) => !folds || expanded || i < limit || state.picked.has(a.id)));

    const parts = [];
    if (all.length && S.addonsTitle) parts.push(el('h3', 'scope-addons__title', S.addonsTitle));
    for (const [name, members] of groups) {
      const seen = members.filter((a) => shown.has(a));
      if (!seen.length) continue;
      if (name) parts.push(el('h4', 'scope-addons__group', name));
      const grid = el('div', 'scope-addons');
      grid.append(...seen.map(tile));
      parts.push(grid);
    }
    let more = null;
    if (folds) {
      const label = expanded
        ? S.showFewerAddons || COPY.showFewerAddons
        : fill(S.showAllAddons || COPY.showAllAddons, { n: faNumber(all.length) });
      more = el('button', 'scope-addons__more', label);
      more.type = 'button';
      more.setAttribute('aria-expanded', String(expanded));
      more.setAttribute('aria-controls', addonsBox.id);
      more.append(icon(expanded ? 'minus' : 'plus'));
      more.addEventListener('click', () => {
        const before = new Set([...addonsBox.querySelectorAll('.scope-addon')].map((b) => b.dataset.id));
        expanded = !expanded;
        renderAddons(state.type, expanded ? before : 'more');
      });
      parts.push(more);
    }
    addonsBox.replaceChildren(...parts);

    if (focus instanceof Set) {
      [...addonsBox.querySelectorAll('.scope-addon')].find((b) => !focus.has(b.dataset.id))?.focus();
    } else if (focus === 'more' && more) {
      more.focus({ preventScroll: true });
      more.scrollIntoView({ block: 'nearest' });
    }
  }

  config.addEventListener('click', (e) => {
    const b = e.target.closest('.scope-addon');
    if (!b) return;
    const on = !state.picked.has(b.dataset.id);
    if (on) state.picked.add(b.dataset.id);
    else state.picked.delete(b.dataset.id);
    b.setAttribute('aria-pressed', String(on));
    b.querySelector('.scope-addon__toggle .icon').className = `icon icon-${on ? 'minus' : 'plus'}`;
    update(true);
  });

  function update(announce) {
    const t = state.type;
    const est = estimate(P, { siteTypeId: t.id, pages: state.pages, addonIds: [...state.picked] });
    if (slider) {
      const text = fill(S.pagesValue, { n: faNumber(est.pages) });
      sliderValue.value = text;
      slider.setAttribute('aria-valuetext', text);
      const span = t.pages.max - t.pages.min;
      slider.style.setProperty('--fill', `${span ? ((est.pages - t.pages.min) / span) * 100 : 100}%`);
    }
    const priceText = priceBox ? price(est.price) : '';
    const daysText = daysBox ? formatDuration(est.days, unit) : '';
    if (priceBox) swap(priceBox, priceText);
    if (daysBox) swap(daysBox, daysText);
    const n = est.lines.filter((l) => addons.has(l.id)).length;
    count.textContent = n ? fill(COPY.picked, { n: faNumber(n) }) : '';
    count.hidden = !n;
    meta.hidden = !n && !meta.contains(daysBox);
    if (announce) live.textContent = [S.totalLabel, [priceText, daysText].filter(Boolean).join('، ')].filter(Boolean).join(': ');
    return est;
  }

  function selectType(t, announce) {
    state.type = t;
    // Keep the chosen add-ons this type also offers, and the page count
    // within this type's range.
    state.picked = new Set([...state.picked].filter((id) => t.addons.includes(id) && addons.has(id)));
    state.pages = clamp(state.pages || t.base.pagesIncluded, t.pages.min, t.pages.max);
    renderBase(t);
    renderConfig(t);
    update(announce);
  }

  track.addEventListener('change', (e) => {
    const t = types.find((x) => x.id === e.target.value);
    if (!t) return;
    e.target.closest('.scope-tab').scrollIntoView({ block: 'nearest', inline: 'nearest' });
    selectType(t, true);
  });

  // Hand the choice to the order builder in its own saved shape, merged with
  // anything already saved there; add-ons replace the old feature list. The
  // link itself navigates, with or without this.
  go.addEventListener('click', () => {
    const est = update(false);
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null') || {};
      const { features, ...prev } = saved.selection || {};
      localStorage.setItem(STORE_KEY, JSON.stringify({
        selection: { ...prev, siteType: state.type.id, pages: est.pages, addons: est.lines.filter((l) => addons.has(l.id)).map((l) => l.id) },
        step: 2,
        unsure: {},
        pricingVersion: P.version
      }));
    } catch (e) {
      /* storage unavailable or corrupt — the builder simply starts fresh */
    }
  });

  // ---- layout: where the checkout lives, and how much of the card's list shows
  const wide = matchMedia(WIDE);
  const nav = document.querySelector('.navbar');

  // From 1024px the checkout is the foot of the summary card; below, it is the
  // bar after the columns (pinned by CSS while the calculator is on screen).
  function place() {
    const inCard = wide.matches;
    if (inCard === (checkout.parentNode === summary) && checkout.parentNode) return;
    const focused = checkout.contains(document.activeElement) ? document.activeElement : null;
    if (inCard) summary.insertBefore(checkout, note);
    else body.append(checkout);
    focused?.focus({ preventScroll: true });
  }

  // From 1024px the card is always sticky and never taller than the screen
  // (CSS): when it would be, only the included list gives way and scrolls.
  // The items' descriptions show only while the whole list fits without
  // scrolling — measured with them, dropped if it does not. This runs on
  // resize and when the card's content changes, never on scroll.
  let queued = false;
  function fit() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      const top = nav ? nav.offsetHeight : 0;
      sec.style.setProperty('--scope-top', `${top + STICKY_GAP}px`);
      summary.classList.add('has-desc');
      if (wide.matches && list) summary.classList.toggle('has-desc', list.scrollHeight <= list.clientHeight + 1);
      listEdge();
    });
  }

  selectType(state.type, false);
  place();
  fit();
  new ResizeObserver(fit).observe(summary);
  addEventListener('resize', fit);
  wide.addEventListener('change', () => {
    place();
    renderAddons(state.type); // the folding limit differs by width
    fit();
  });
}
