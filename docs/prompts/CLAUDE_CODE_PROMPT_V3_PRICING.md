# PRICING v3 — reference-style calculator, fully data-driven (admin-ready)

Follow-up to the master prompt and V2. The Quick scope section (Phase 5) works, but it must change in three ways:

1. **Closer to the reference layout**: a "Base" package card listing everything that is always included, a page-count slider, add-on rows with a `+` toggle and a "from" price, one total, one full-width CTA, one disclaimer line.
2. **Nothing hard-coded**: every price, duration, item, label and description comes from one data document that a future **admin panel** (built later by the back-end developer) will edit. The front end only renders it.
3. **Realistic durations**: the current week-based estimate reads far longer than real projects. Move to a day-based model whose numbers come from the data.

Do not touch any other section. Site-wide copy and translation fixes are a separate, later task: do not rewrite copy outside this section.

Work on `feature/portal-hero`. One commit per part (A–D), then stop and report. Do not push.

---

## Part A — Data model (the admin contract)

Create `project/src/config/pricing.json` (the mock and fallback) with the shape below. The front end reads it through the existing API layer: add `getPricing()` to `src/api/client.js` (mock: fetch the JSON; real: `GET /pricing`) with the same `{ ok, data, error }` contract, and a mapper `fromApiPricing()` in `mapper.js`. Components never read the JSON file directly.

```jsonc
{
  "version": 3,
  "updatedAt": "2026-09-23T00:00:00Z",
  "placeholder": true,              // true until the owner enters real numbers (see Part D)
  "currency": { "unit": "تومان", "divisor": 1000000, "suffix": "میلیون تومان" },
  "display": { "showPrice": true, "showDuration": true, "durationUnit": "workday" },

  "section": {
    "eyebrow": "برآورد سریع",
    "title": "هزینه و زمان سایت شما",
    "subtitle": "هر پروژه متفاوت است. این محاسبه یک برآورد اولیه است؛ قیمت دقیق در گفت‌وگو مشخص می‌شود.",
    "ctaLabel": "ادامه در سفارش‌ساز",
    "disclaimer": "همه‌ی اعداد تقریبی‌اند. بعد از جلسه‌ی اولیه، پیشنهاد دقیق برایتان ارسال می‌شود."
  },

  "siteTypes": [
    {
      "id": "corporate",
      "label": "سایت شرکتی",
      "active": true,
      "order": 1,
      "base": {
        "title": "پایه",
        "subtitle": "پایه‌ی هر سایت",
        "price": 0,                 // toman, integer
        "days": 0,                  // working days, integer
        "pagesIncluded": 1,
        "included": [
          { "id": "custom-design",  "title": "طراحی اختصاصی",          "desc": "متناسب با برند و مخاطب شما" },
          { "id": "responsive",     "title": "بهینه برای همه‌ی دستگاه‌ها", "desc": "موبایل، تبلت و دسکتاپ" },
          { "id": "motion",         "title": "انیمیشن و تعامل",          "desc": "سایتی که حس زنده بودن دارد" },
          { "id": "home-page",      "title": "صفحه‌ی اصلی",              "desc": "اولین برداشت از کسب‌وکار شما" },
          { "id": "legal-pages",    "title": "صفحه‌های قوانین",           "desc": "قوانین و حریم خصوصی" },
          { "id": "hosting-setup",  "title": "راه‌اندازی روی دامنه و هاست", "desc": "به نام خودتان، با SSL" },
          { "id": "support",        "title": "پشتیبانی بعد از تحویل",    "desc": "یک دوره بدون هزینه" }
        ]
      },
      "pages": { "enabled": true, "min": 1, "max": 20, "pricePerExtra": 0, "daysPerExtra": 0 },
      "addons": ["contact-form", "cms", "i18n", "seo", "auth", "payment", "booking", "loyalty", "chat"]
    }
    // …one entry per site type from order-catalog.json siteTypes (except "unsure", see below)
  ],

  "addons": [
    { "id": "contact-form", "title": "فرم تماس",           "desc": "تا مشتری‌ها مستقیم با شما در ارتباط باشند", "price": 0, "days": 0, "active": true, "order": 1 },
    { "id": "cms",          "title": "پنل مدیریت محتوا",   "desc": "محتوا را خودتان و بدون دانش فنی تغییر دهید",  "price": 0, "days": 0, "active": true, "order": 2 },
    { "id": "i18n",         "title": "چندزبانه",           "desc": "هر بازدیدکننده سایت را به زبان خودش ببیند",   "price": 0, "days": 0, "active": true, "order": 3 }
    // …plus seo, auth, payment, booking, loyalty, chat, reusing labels from order-catalog.json features
  ]
}
```

Rules:
- **Every number in the seed is a placeholder** (`0` or a clearly fake round value) until the owner provides real ones. Do not carry over `estimates` / `featureCost` from `order-catalog.json`: the owner says those durations are unrealistic.
- **Do not add a "Logo & Branding" add-on**, even though the reference has one: mitec does not offer brand/logo design (see the FAQ).
- The seed copy above is a **draft**: implement it as given, it will be revised in the later copy pass.
- IDs are stable slugs; labels can change freely. Add-ons are defined once globally and referenced by id per site type, so the admin edits a price in one place.
- `active: false` hides an item or a site type without deleting it; `order` controls sorting.
- The `unsure` site type from the order catalog is not a pricing package. In this section, show it as a text link under the type tabs («مطمئن نیستید؟ در سفارش‌ساز کمکتان می‌کنیم») that goes to `./order/`.
- Add `docs/pricing.schema.json` (JSON Schema draft 2020-12) describing this document with required fields, integer ≥ 0 for prices/days, `min ≤ max`, unique ids, and `addons[]` in a site type referencing existing add-on ids. The back-end developer will validate admin input against it.
- Extend `project/API_CONTRACT.md` with: `GET /pricing` (public, returns the document), and a **proposal** for admin endpoints (`GET/PUT /admin/pricing`, whole-document replace with version check, `409` on a stale `version`). Mark it a proposal, the same way the existing contract does.

## Part B — Calculation (one shared pure module)

Replace the week-based logic in `src/utils/estimate.js` with a pure function used by this section now and by the `/order` wizard later:

```
estimate(pricing, { siteTypeId, pages, addonIds }) → {
  price,            // base.price + extraPages × pricePerExtra + Σ addon.price
  days,             // base.days  + extraPages × daysPerExtra  + Σ addon.days
  extraPages,       // max(0, pages − base.pagesIncluded)
  lines: [{ id, title, price, days }]   // itemised, for the summary and the order payload
}
```

- Clamp `pages` to the site type's `min…max`; ignore unknown or inactive add-on ids.
- Formatting helpers in `src/utils/`: `formatPrice(toman, currency)` → «از ۲۴ میلیون تومان» (Persian digits, `divisor`/`suffix` from data; values below one divisor unit shown in full with thousands separators «۸۵۰٬۰۰۰ تومان»), and `formatDuration(days, unit)` → «حدود ۱۲ روز کاری». Never hard-code the currency or unit.
- Add a tiny test file `src/utils/estimate.test.html` (open in the browser, prints pass/fail to the console) covering: base only, extra pages, add-ons, clamping, inactive add-on, unknown id.
- `estimate.js` must no longer read `order-catalog.json` estimates. Leave `order-catalog.json` itself untouched (the future wizard still uses its other fields).

## Part C — UI (reference layout, mitec design system)

Layout, light surface, `id="scope"`, centred section heading from `section.*`:

```
[ type tabs: one per active siteType, radio-group semantics ]           (full width, centred)
[ «مطمئن نیستید؟…» link ]

┌──────── start column (right in RTL) ────────┐  ┌──────── end column ─────────────────────┐
│ Base card                                   │  │ Pages: label + description + value     │
│   title / subtitle (centred)                │  │   range slider (min…max)                │
│   ───────                                   │  │ Add-on rows (one per add-on):           │
│   included[]: title (bold) + desc (muted)   │  │   title + desc        «از X» (top end)  │
│   ───────                                   │  │                        [+] / [−] toggle │
│   «شامل N صفحه» (pagesIncluded)             │  │                                         │
└─────────────────────────────────────────────┘  └─────────────────────────────────────────┘
                       Total:  «از ۲۴ میلیون تومان» · «حدود ۱۲ روز کاری»
                  [ ─────────── ادامه در سفارش‌ساز (primary, full width ≤ 680px) ─────────── ]
                                  disclaimer (muted, small)
```

- Columns ≈ `5fr / 7fr` at ≥ 1024px, stacked below (Base card first). Base card: `--color-surface`, `--color-border-subtle`, `--shadow-card`, dividers `--color-border`.
- Add-on row: 1px `--color-border` (dashed while off, like the reference; solid when on), radius `--radius-md`, whole row is the toggle button (`aria-pressed`), `+` icon when off, `−` when on (existing `icon-plus` / `icon-minus`). On: background `--color-tonal`, border `--color-border-hover`, title `--color-text-primary`. Price in `--color-text-secondary`, weight 700, Persian digits. Rows with `price: 0` show no price, not «از ۰».
- Slider: native `<input type="range">` styled with tokens (track `--color-border`, fill and thumb `--color-cta`, because it is interactive), RTL fill from the right, 44px hit area, value shown in Persian digits beside the label, `aria-valuetext` in Persian («۵ صفحه»). If `pages.enabled` is false for a type, hide the pages block.
- Changing the type tab swaps the Base card content and the available add-ons; keep add-on selections that still exist in the new type.
- Total line: price large (`--text-h3`, weight 800, `--color-text-primary`), duration secondary. When the value changes, the old number slides up 8px and fades out and the new one slides in (220ms, `--ease-out`). `aria-live="polite"` on the total.
- Respect `display.showPrice` / `showDuration`: when false, that part is not rendered (not blurred, not hidden with CSS).
- While `pricing.placeholder` is true, show a small `badge--highlight` next to the heading: «اعداد نمونه — جایگزین شود» (same pattern as the testimonials).
- CTA (the only primary button in this viewport): writes `{ selection: { siteType, pages, addons }, step: 2, unsure: {} }` to `localStorage['mitec.order.v1']` (merge, try/catch), plus `pricingVersion`, then goes to `./order/`. Update `toApiOrder()` in `mapper.js` to include `pages`, `addons` and `pricing_version`, and the matching example in `API_CONTRACT.md`.
- Entrance motion: the existing reveal utility (heading, then the two columns with a 80ms stagger). No scroll-scrubbed motion in this section: it is a tool.
- Loading and error states: while `getPricing()` is pending show a skeleton of the two columns (no layout shift). If it fails, show one line «برآورد در دسترس نیست؛ مستقیم در سفارش‌ساز ادامه دهید» plus the CTA, and log the error.
- Mobile: tabs scroll horizontally with scroll-snap, the Base card collapses its `included` list after 4 items behind a «همه‌ی موارد» disclosure button, add-on rows are full width, and the total + CTA stick to the bottom of the section while it is in view.
- Keyboard: tabs with arrow keys (roving tabindex), Space/Enter toggles add-ons, the slider works with arrows/PageUp/PageDown/Home/End, and focus is visible everywhere.

## Part D — Hand-off for real numbers

- Add `docs/pricing-guide.md` (Persian): what each field means, how price and duration are calculated (with one worked example), how to add, hide or reorder an add-on, and what the admin panel must let the owner edit (site types, base items, pages rules, add-ons, currency/display, section copy).
- In your final report, list every placeholder number the owner must fill in `pricing.json`, grouped by site type and add-on.

## Constraints

- Semantic tokens only; no new hex outside `tokens.css`. One primary button per viewport. CTA green only on interactive things (slider, CTA).
- No new dependencies. All strings of this section come from the data; the only hard-coded Persian strings allowed are the loading/error/“unsure” fallbacks, and those live in one constants object at the top of the module.
- Keep the approved hero, laptop, intro statement, Process spotlight and every other section unchanged.

## Acceptance checklist

- [ ] Changing any value in `pricing.json` (price, days, label, `active`, `order`, a new add-on) updates the UI after a reload, with no code change.
- [ ] Setting `display.showPrice` to false removes every price from the DOM.
- [ ] `estimate.test.html` passes all cases.
- [ ] Layout matches the sketch at 1440 and 1920; stacks correctly at 768 and 390; no horizontal scroll.
- [ ] Keyboard-only: select a type, move the slider, toggle add-ons, reach the CTA.
- [ ] Screen reader announces the new total after each change.
- [ ] The localStorage payload and `toApiOrder()` output include `siteType`, `pages`, `addons` and the pricing version.
- [ ] No “Logo & Branding” item anywhere.
- [ ] Console clean.

When done, stop and report: files changed, the placeholder list from Part D, and anything you deviated from.
