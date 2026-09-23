// mitec — Quick scope. Pick a site type and features, see the approximate
// timeline from the shared estimate, then carry the choice into the order
// builder. The choices come from getCatalog(), never from the markup. Price
// appears only when APP_CONFIG.showPrice is on; otherwise no price element
// exists at all (not a hidden or blurred one).

import { getCatalog } from '../api/client.js';
import { APP_CONFIG } from '../config/app.config.js';
import { estimate } from '../utils/estimate.js';
import { toFa } from '../utils/persian-digits.js';

const STORE_KEY = 'mitec.order.v1'; // the order builder's own saved state
const root = document.documentElement;

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};
const weeksText = ([a, b]) => (a === b ? `حدود ${toFa(a)} هفته` : `${toFa(a)} تا ${toFa(b)} هفته`);
const priceText = ([a, b]) => `${toFa(Math.round(a / 1e6))} تا ${toFa(Math.round(b / 1e6))} میلیون تومان`;

// The number swap: the old value rises out 8px as the new one rises in.
// Both sit in one grid cell so the line never reflows mid-fade.
function swap(box, text) {
  const old = box.lastElementChild;
  if (old?.textContent === text) return;
  const next = el('span', null, text);
  box.append(next);
  if (!old) return;
  if (!root.classList.contains('motion')) return old.remove();
  const ease = { duration: 220, easing: 'cubic-bezier(.22,.61,.36,1)' };
  old.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-8px)' }], ease).onfinish = () => old.remove();
  next.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], ease);
}

export async function initScope() {
  const box = document.getElementById('scopeChoices');
  const go = document.getElementById('scopeGo');
  if (!box || !go) return;

  box.setAttribute('aria-busy', 'true');
  let res;
  try {
    res = await getCatalog();
  } catch (e) {
    res = { ok: false };
  }
  box.removeAttribute('aria-busy');
  // Without the catalog the builder still asks the same questions, so the
  // no-JS note and the button stay as they are.
  if (!res.ok || !res.data?.siteTypes) return;
  const cat = res.data;
  const sel = { siteType: null, features: [] };

  // Site type: a native radio group, so arrow keys, roving focus and the
  // RTL direction of those arrows come from the browser.
  const types = el('fieldset', 'scope-group');
  types.append(el('legend', null, 'نوع سایت'));
  const chips = el('div', 'scope-chips');
  for (const t of cat.siteTypes) {
    const label = el('label', 'scope-chip');
    const input = el('input');
    Object.assign(input, { type: 'radio', name: 'scope-type', value: t.id });
    label.append(input, el('span', null, t.label));
    chips.append(label);
  }
  types.append(chips);

  // Features: toggle buttons (aria-pressed); Space and Enter come with <button>.
  const feats = el('fieldset', 'scope-group');
  feats.append(el('legend', null, 'امکانات'));
  const list = el('div', 'scope-feats');
  for (const f of cat.features) {
    const b = el('button', 'scope-feat');
    b.type = 'button';
    b.dataset.id = f.id;
    b.setAttribute('aria-pressed', 'false');
    const icon = el('span', 'icon icon-plus');
    icon.setAttribute('aria-hidden', 'true');
    b.append(el('span', null, f.label), icon);
    list.append(b);
  }
  feats.append(list);

  // The result. The visible line cross-fades its number; screen readers get
  // the plain sentence from a separate live region, once per change.
  const result = el('div', 'scope-result');
  const line = el('p', 'scope-result__line');
  line.setAttribute('aria-hidden', 'true');
  const weeks = el('span', 'scope-result__value');
  line.append('زمان تقریبی: ', weeks);
  result.append(line);
  let price = null;
  if (APP_CONFIG.showPrice === true) {
    const p = el('p', 'scope-result__line scope-result__line--price');
    p.setAttribute('aria-hidden', 'true');
    price = el('span', 'scope-result__value');
    p.append('هزینه تقریبی: ', price);
    result.append(p);
  }
  const live = el('p', 'visually-hidden');
  live.setAttribute('aria-live', 'polite');
  result.append(live);

  box.replaceChildren(types, feats, result);

  const update = (announce) => {
    const est = estimate(cat, { ...sel, sections: [] });
    swap(weeks, weeksText(est.weeks));
    if (price) swap(price, priceText(est.price));
    if (announce) live.textContent = `زمان تقریبی: ${weeksText(est.weeks)}` + (price ? `، هزینه تقریبی: ${priceText(est.price)}` : '');
  };

  chips.addEventListener('change', (e) => {
    sel.siteType = e.target.value;
    update(true);
  });
  list.addEventListener('click', (e) => {
    const b = e.target.closest('.scope-feat');
    if (!b) return;
    const on = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', String(on));
    b.lastElementChild.classList.toggle('icon-check', on);
    b.lastElementChild.classList.toggle('icon-plus', !on);
    sel.features = on ? [...sel.features, b.dataset.id] : sel.features.filter((id) => id !== b.dataset.id);
    update(true);
  });

  // Hand the choice to the order builder in its own saved shape, keeping
  // anything already saved there. It opens on step 2 (template) once a site
  // type is known; «نمی‌دانم» or no type starts at step 1, where the builder
  // asks its questions. The link itself still navigates, with or without this.
  go.addEventListener('click', () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null') || {};
      const prev = saved.selection || {};
      localStorage.setItem(STORE_KEY, JSON.stringify({
        selection: { ...prev, siteType: sel.siteType, features: [...sel.features], sections: prev.sections || [] },
        step: sel.siteType && sel.siteType !== 'unsure' ? 2 : 1,
        unsure: saved.unsure || {}
      }));
    } catch (e) {
      /* storage unavailable or corrupt — the builder simply starts fresh */
    }
  });

  update(false);
}
