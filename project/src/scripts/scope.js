// mitec — Quick scope: a price-and-duration calculator in the shape of the
// reference's pricing section (site-type tabs; a base card of what is always
// included; a page slider and add-on rows; one total; one CTA). Everything it
// shows comes from the pricing document (getPricing()): packages, items,
// prices, days and every label. The maths is the shared estimate() the /order
// wizard will use too. Nothing is scroll-scrubbed here: it is a tool.

import { getPricing } from '../api/client.js';
import { estimate } from '../utils/estimate.js';
import { faNumber, fill, formatPrice, formatDuration } from '../utils/format.js';

// The only strings not taken from the pricing document: what shows when it
// cannot be loaded, and the way out for visitors unsure of their site type.
const FALLBACK = {
  error: 'برآورد در دسترس نیست؛ مستقیم در سفارش‌ساز ادامه دهید',
  cta: 'ادامه در سفارش‌ساز',
  unsure: 'مطمئن نیستید؟ در سفارش‌ساز کمکتان می‌کنیم'
};
const ORDER_URL = './order/';
const STORE_KEY = 'mitec.order.v1'; // the order builder's own saved state
const MORE_AFTER = 4; // phones show this many base items before «show all»
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
  const baseCard = $('scopeBase');
  const config = $('scopeConfig');
  const foot = $('scopeFoot');

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
    body.replaceChildren(el('p', 'scope-error', FALLBACK.error), cta(FALLBACK.cta));
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
  const unsure = el('a', 'scope-unsure', FALLBACK.unsure);
  unsure.href = ORDER_URL;
  typesBox.replaceChildren(group, unsure);

  // ---- total + CTA (sticky on phones) and the disclaimer
  const sticky = el('div', 'scope-sticky');
  const total = el('p', 'scope-total');
  total.setAttribute('aria-hidden', 'true'); // screen readers get the live line below
  const priceBox = P.display.showPrice ? el('span', 'scope-total__price') : null;
  const daysBox = P.display.showDuration ? el('span', 'scope-total__days') : null;
  if (priceBox || daysBox) {
    total.append(el('span', 'scope-total__label', S.totalLabel));
    if (priceBox) total.append(priceBox);
    if (priceBox && daysBox) total.append(el('span', 'scope-total__sep', '·'));
    if (daysBox) total.append(daysBox);
    sticky.append(total);
  }
  const live = el('p', 'visually-hidden');
  live.setAttribute('aria-live', 'polite');
  const go = cta(S.ctaLabel || FALLBACK.cta);
  sticky.append(live, go);
  foot.replaceChildren(sticky);
  if (S.disclaimer) foot.append(el('p', 'scope-disclaimer', S.disclaimer));

  // ---- the two columns, rebuilt whenever the type changes
  let slider = null;
  let sliderValue = null;

  function renderBase(t) {
    const list = el('ul', 'scope-base__list');
    list.id = 'scopeIncluded';
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
    const parts = [el('h3', 'scope-base__title', t.base.title)];
    if (t.base.subtitle) parts.push(el('p', 'scope-base__sub', t.base.subtitle));
    parts.push(list);
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
    baseCard.replaceChildren(...parts);
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
      box.append(top);
      if (S.pagesDesc) {
        const d = el('p', 'scope-pages__desc', S.pagesDesc);
        d.id = 'scopePagesDesc';
        box.append(d);
      }
      slider = el('input', 'scope-range');
      Object.assign(slider, { type: 'range', id: 'scopePages', min: t.pages.min, max: t.pages.max, step: 1, value: state.pages });
      if (S.pagesDesc) slider.setAttribute('aria-describedby', 'scopePagesDesc');
      slider.addEventListener('input', () => {
        state.pages = Number(slider.value);
        update(true);
      });
      box.append(slider);
      parts.push(box);
    }

    const offered = t.addons.map((id) => addons.get(id)).filter(Boolean).sort((x, y) => x.order - y.order);
    if (offered.length) {
      if (S.addonsTitle) parts.push(el('h3', 'scope-addons__title', S.addonsTitle));
      const list = el('div', 'scope-addons');
      for (const a of offered) {
        const on = state.picked.has(a.id);
        const b = el('button', 'scope-addon');
        b.type = 'button';
        b.dataset.id = a.id;
        b.setAttribute('aria-pressed', String(on));
        const text = el('span', 'scope-addon__text');
        text.append(el('span', 'scope-addon__title', a.title));
        if (a.desc) text.append(el('span', 'scope-addon__desc', a.desc));
        b.append(text);
        // No price element at all when prices are off, or for a free add-on.
        if (P.display.showPrice && a.price > 0) b.append(el('span', 'scope-addon__price', price(a.price)));
        const toggle = el('span', 'scope-addon__toggle');
        toggle.append(icon(on ? 'minus' : 'plus'));
        b.append(toggle);
        list.append(b);
      }
      list.addEventListener('click', (e) => {
        const b = e.target.closest('.scope-addon');
        if (!b) return;
        const on = !state.picked.has(b.dataset.id);
        if (on) state.picked.add(b.dataset.id);
        else state.picked.delete(b.dataset.id);
        b.setAttribute('aria-pressed', String(on));
        b.querySelector('.scope-addon__toggle .icon').className = `icon icon-${on ? 'minus' : 'plus'}`;
        update(true);
      });
      parts.push(list);
    }
    config.replaceChildren(...parts);
  }

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

  selectType(state.type, false);
}
