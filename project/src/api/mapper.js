// Boundary between the front end's internal shape and the API's shape.
// If the back end renames or restructures anything, ONLY this file changes.

// pricingVersion: the pricing document's version the estimate was made with
// (saved next to the selection by the home page's quick scope).
export function toApiOrder(selection, catalog, pricingVersion = selection.pricingVersion ?? null) {
  return {
    site_type: selection.siteType || null,
    pages: Number.isInteger(selection.pages) ? selection.pages : null,
    addons: [...(selection.addons || [])],
    pricing_version: pricingVersion,
    template: selection.template || null,
    mixed_description: selection.templateNote || '',
    sections: [...(selection.sections || [])],
    features: [...(selection.features || [])],
    style: { color: selection.color || null, font: selection.font || null },
    assets: { has_logo: selection.hasLogo ?? null, has_content: selection.hasContent ?? null },
    business: {
      name: selection.business?.name || '',
      field: selection.business?.field || '',
      instagram_or_site: selection.business?.handle || '',
      references: selection.business?.refs || '',
      description: selection.business?.desc || '',
      phone: selection.business?.phone || ''
    },
    attachments: selection.uploads || [],
    meta: { catalog_version: catalog?.version || null, locale: 'fa-IR', source: 'web-order-builder' }
  };
}

// The pricing document (GET /pricing, or src/config/pricing.json in mock
// mode) as the UI and estimate() expect it: numbers are whole and >= 0, lists
// are sorted by `order`, ids are unique, pages.min <= pages.max, and each site
// type only lists add-ons that exist. Inactive items are kept (the UI and
// estimate() skip them), so nothing the admin hid is lost on the way through.
const whole = (v, fallback = 0) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};
const text = (v) => (typeof v === 'string' ? v : '');
const uniqueById = (list) => {
  const seen = new Set();
  return (Array.isArray(list) ? list : []).filter((x) => x && x.id && !seen.has(x.id) && seen.add(x.id));
};
const byOrder = (a, b) => a.order - b.order;

export function fromApiPricing(api) {
  if (!api || !Array.isArray(api.siteTypes)) throw new Error('Pricing document has no siteTypes');
  const addons = uniqueById(api.addons).map((a, i) => ({
    id: text(a.id),
    title: text(a.title),
    desc: text(a.desc),
    price: whole(a.price),
    days: whole(a.days),
    active: a.active !== false,
    order: whole(a.order, i)
  })).sort(byOrder);
  const known = new Set(addons.map((a) => a.id));

  const siteTypes = uniqueById(api.siteTypes).map((t, i) => {
    const base = t.base || {};
    const pages = t.pages || {};
    const min = whole(pages.min, 1) || 1;
    const max = whole(pages.max, min) || min;
    return {
      id: text(t.id),
      label: text(t.label),
      active: t.active !== false,
      order: whole(t.order, i),
      base: {
        title: text(base.title),
        subtitle: text(base.subtitle),
        price: whole(base.price),
        days: whole(base.days),
        pagesIncluded: whole(base.pagesIncluded, 1) || 1,
        included: uniqueById(base.included).map((x) => ({ id: text(x.id), title: text(x.title), desc: text(x.desc) }))
      },
      pages: {
        enabled: pages.enabled === true,
        min: Math.min(min, max),
        max: Math.max(min, max),
        pricePerExtra: whole(pages.pricePerExtra),
        daysPerExtra: whole(pages.daysPerExtra)
      },
      addons: [...new Set(Array.isArray(t.addons) ? t.addons : [])].filter((id) => known.has(id))
    };
  }).sort(byOrder);

  const currency = api.currency || {};
  const display = api.display || {};
  return {
    version: whole(api.version),
    updatedAt: text(api.updatedAt) || null,
    placeholder: api.placeholder === true,
    currency: {
      unit: text(currency.unit),
      divisor: whole(currency.divisor, 1) || 1,
      suffix: text(currency.suffix),
      from: text(currency.from)
    },
    display: {
      showPrice: display.showPrice === true,
      showDuration: display.showDuration === true,
      durationUnit: text(display.durationUnit),
      durationLabel: text(display.durationLabel),
      durationPrefix: text(display.durationPrefix)
    },
    section: Object.fromEntries(Object.entries(api.section || {}).filter(([, v]) => typeof v === 'string')),
    siteTypes,
    addons
  };
}

export function fromApiOrder(api) {
  if (!api) return null;
  return {
    trackingCode: api.tracking_code ?? api.code ?? null,
    status: api.status ?? 'received',
    statusLabel: api.status_label ?? null,
    createdAt: api.created_at ?? null,
    estimateWeeks: api.estimate_weeks ?? null,
    notes: api.notes ?? ''
  };
}
