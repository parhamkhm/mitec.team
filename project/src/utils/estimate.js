// mitec — the price and duration estimate, shared by the home page's quick
// scope and (later) the /order wizard, so both always quote the same numbers.
// Pure: the same pricing document and selection always give the same result.
// Every number comes from the pricing document (GET /pricing, normalised by
// fromApiPricing()); nothing is hard-coded here.

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const sum = (lines, key) => lines.reduce((t, l) => t + l[key], 0);

// selection: { siteTypeId, pages, addonIds }
// returns    { price, days, extraPages, pages, lines: [{ id, title, price, days }] }
//   price is tomans and days working days; pages is the page count actually
//   used (clamped to the type's min…max); lines itemise the base, any extra
//   pages (with qty), then each add-on — for the summary and the order payload.
// Unknown, inactive or not-offered add-on ids, and an unknown or inactive site
// type, are ignored rather than trusted.
export function estimate(pricing, { siteTypeId, pages, addonIds = [] } = {}) {
  const type = (pricing?.siteTypes || []).find((t) => t.id === siteTypeId && t.active !== false);
  if (!type) return { price: 0, days: 0, extraPages: 0, pages: 0, lines: [] };

  const base = type.base || {};
  const rule = type.pages || {};
  const included = base.pagesIncluded || 1;
  const count = rule.enabled
    ? clamp(Math.round(Number(pages)) || included, rule.min || 1, rule.max || included)
    : included;
  const extraPages = Math.max(0, count - included);

  const lines = [{ id: 'base', title: base.title || '', price: base.price || 0, days: base.days || 0 }];
  if (extraPages) {
    lines.push({
      id: 'extra-pages',
      title: pricing.section?.pagesTitle || '',
      qty: extraPages,
      price: extraPages * (rule.pricePerExtra || 0),
      days: extraPages * (rule.daysPerExtra || 0)
    });
  }
  const offered = new Set(type.addons || []);
  const picked = new Set(addonIds);
  for (const a of pricing.addons || []) {
    if (a.active === false || !offered.has(a.id) || !picked.has(a.id)) continue;
    lines.push({ id: a.id, title: a.title || '', price: a.price || 0, days: a.days || 0 });
  }

  return { price: sum(lines, 'price'), days: sum(lines, 'days'), extraPages, pages: count, lines };
}
