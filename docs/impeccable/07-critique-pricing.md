Method: dual-agent (A: design-review subagent · B: detector subagent). Both assessments ran isolated; B's results were
read only after A had finished. An API usage limit interrupted both part-way; each was resumed with its context
intact.

# Impeccable critique — the pricing calculator (`#scope`)

Phase 1, step 3 of `docs/prompts/IMPECCABLE_PASS.md`. Target: `#scope` («هزینه و زمان پروژه‌ی شما»).
- **What was used:**
  - site-type tabs;
  - the always-included list;
  - page slider;
  - add-on tiles and «نمایش همه‌ی امکانات»;
  - the summary card (sticky from 1024px) and the bottom bar below 1024px;
  - the total;
  - «اعداد نمونه»;
  - «ادامه در سفارش‌ساز» and «مطمئن نیستید؟».
- **How:** at 1440×900, 1280×800, 768×1024 and 390×844, with and without reduced motion. The loading and error states
  were forced, and the hand-off to the order builder was checked in `localStorage`.

Nothing was changed.

**Not re-raised:** A5 (module waterfall), A7 (the «مطمئن نیستید؟» link's height). Prices are placeholders by design.
The pricing data and `estimate.js` are off-limits; every fix below is in the calculator's UI code (`scope.js`,
`home.css`).

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | The total cross-fades and stays in view. On a phone, toggling the free «فرم تماس» changes nothing in the bar (the count is hidden below 768px) |
| 2 | Match System / Real World | 3 | Persian digits and «میلیون تومان» are right. «حدود ۹۸ روز کاری» is not how an owner thinks. «از» on every add-on reads oddly |
| 3 | User Control and Freedom | 2 | Switching site type throws away the chosen add-ons and page count, with no undo (PC1) |
| 4 | Consistency and Standards | 3 | «شامل ۱ صفحه» beside a slider set to «۲۰ صفحه». The "summary" doesn't summarise the choice |
| 5 | Error Prevention | 3 | Inputs are clamped. The type switch is the one destructive action |
| 6 | Recognition Rather Than Recall | 2 | The chosen add-ons appear nowhere near the total, only as a count, and on phones not even that |
| 7 | Flexibility and Efficiency | n/a | A one-off estimator |
| 8 | Aesthetic and Minimalist Design | 3 | Calm. «از … میلیون تومان» repeats on 9–12 tiles. With everything chosen, the tiles become a uniform tonal wall |
| 9 | Error Recovery | 2 | The error state removes the heading and offers only the order builder |
| 10 | Help and Documentation | 2 | Tile descriptions and «مطمئن نیستید؟» help. Nothing helps with "how many pages do I need?", and the per-page price is never shown |
| **Total** | | **23/36** | **Acceptable (64%)** |

## Design Specificity Verdict

**LLM assessment.** The behaviour is specific; the look is generic. The details are carefully done:
- Persian money formatting («از ۱۰ میلیون تومان»);
- a slider that fills from the right;
- one checkout element that moves between the card and the bar;
- "always included" shown before any price.

Visually it is the standard SaaS configurator: a segmented pill, dashed option cards with +/− circles, a sticky
summary. Nothing sounds like mitec at the moment money appears. The "direct team, no middleman" promise is missing
exactly where it would reassure most.

**Deterministic scan.** Known items only: the summary card's border and shadow (C5). With the overlay at `#scope`
(1440 and 390) nothing was specific to this section, and the «اعداد نمونه» badge (`#8C5313` on `#F7E2C4`) wasn't
flagged. The design review found everything below.

**Visual overlays.** Injection succeeded. At `#scope` the console reported 43–46 flagged elements at 1440 and 59 at
390, none of them from the calculator. The overlay was removed afterwards.

## Overall Impression

A well-engineered estimator that answers "how much?" with one number and nothing behind it. It loses the visitor's
choices when they compare types, and on phones it hides most of its first decision.

## What's Working

1. **Value comes before cost.** The included list («راه‌اندازی روی دامنه و هاست — به نام خودتان», «پشتیبانی بعد از
   تحویل») answers the fears Iranian owners actually have.
2. **The phone bottom bar behaves.** At 390 it arrives with the section and stays pinned at 766–844px for about 2,000px
   of scroll. It comes to rest at the section's end and never covers the FAQ. There is one live region and one CTA.
3. **The hand-off works.** After the CTA, `mitec.order.v1` holds `{selection: {siteType, pages, addons}, step,
   unsure, pricingVersion}` as documented. Action green appears only on the slider and the CTA.

## Priority Issues

**PC1 · [P2] Switching site type silently discards the visitor's choices**
- **What:** `scope.js` `selectType()` filters `state.picked` down to the new type's add-ons and clamps `state.pages`
  in place (verified in synthesis).
  - Tested: corporate with 5 pages + CMS + payment → ecommerce (payment dropped) → landing (CMS dropped, pages 1) →
    back to corporate.
  - It came back at 1 page, nothing chosen, 10M.
- **Why it matters:** comparing types is the natural move, and every comparison costs the visitor their
  configuration. Neither the screen nor the live region says so.
- **Fix:** keep `state.picked` and the requested page count as the visitor's intent across types. Clamp only when
  rendering and estimating: `estimate()` already ignores add-ons a type doesn't offer, and the tiles are built from
  `t.addons`.
- **Suggested command:** `/impeccable harden` · **Effort:** S. Graded P2 rather than the review's P1, because re-selecting
  is a workaround.

**PC2 · [P2] The total has no breakdown**
- **What:** the card shows the included list and one number:
  - the chosen add-ons are missing;
  - «شامل ۱ صفحه» contradicts a 20-page choice;
  - the base price is never stated.
  `estimate()` already returns an itemised `lines` list "for the summary".
- **Why it matters:** money is a high-stakes moment, and an owner with a fixed budget can't see what to drop.
- **Fix:** add a collapsed disclosure inside `.scope-checkout` that renders `est.lines`: base, extra pages × quantity,
  and each add-on. It travels with the checkout, and in the bar it opens upward. Its label is new copy for the owner.
- **Suggested command:** `/impeccable clarify` · **Effort:** M. See New conflicts: §5 describes what the card holds.

**PC3 · [P2] The page slider and the package disagree**
- **What:**
  - Going from corporate to ecommerce keeps «۱ صفحه» while the card says «شامل ۳ صفحه», so slider steps 1–3 change
    nothing.
  - The per-page price (`pricePerExtra`) is never shown.
- **Fix:**
  - On a type switch, set pages to max(requested, `pagesIncluded`).
  - Mark the included span on the track with a neutral tick, not action green.
  - There is no copy slot for the per-page price (copy flag).
- **Suggested command:** `/impeccable clarify` · **Effort:** S · Fix together with PC1.

**PC4 · [P2] Most site types are hidden on phones and tablets**
- **What:**
  - At 390, 2.5 of the 6 tabs are visible, and the track hides its scrollbar with no fade or arrow.
  - At 768, «سرویس اختصاصی» is clipped (the track needs 806px and has 720).
- **Why it matters:** the custom-service tab is the entry point for half the audience (PRODUCT.md), and the café
  owner's own «منوی آنلاین» is clipped.
- **Fix:** below 1024px, wrap the tabs into a 3×2 grid (768) or 2×3 grid (390) inside the same sunken track. Keep the
  44px targets and native radios.
- **Suggested command:** `/impeccable adapt` · **Effort:** S · Same finding as MO2.

**PC5 · [P2] The "sample numbers" badge is detached from the figure**
- **What:** «اعداد نمونه» appears only in the section heading. On phones the bar shows «از ۹۸ میلیون تومان» about
  2,000px away from it, and a screenshot of the bar carries no caveat.
- **Fix:** while `placeholder` is true, put a compact badge (clock icon plus label) inside the checkout, next to the
  figure.
- **Suggested command:** `/impeccable clarify` · **Effort:** S

## Persona Red Flags

**Jordan (first-timer)**
- Doesn't know how many pages he needs, and «شامل ۱ صفحه» next to his count confuses him.
- «از» on the total reads as "could be more".
- The CTA doesn't say whether continuing commits him (copy flag).

**Riley (stress tester)**
- Hits PC1.
- Finds slider steps that change no price (ecommerce 1–3).
- On a phone, toggles the free add-on and sees no change in the bar.
- The extremes are fine: 12 add-ons and 20 pages give «از ۹۸ میلیون تومان», and it fits the phone bar.

**Casey (one-handed, slow connection)**
- Never discovers the sideways-scrolling tabs.
- The loading skeleton is 2,628px tall against a 2,307px result, so the page jumps 321px when a slow load finishes.
- A timeout gives a headless error band.

**Clinic owner with a fixed budget**
- On phones and tablets «نوبت‌دهی و رزرو», her key add-on, is folded behind «نمایش همه‌ی امکانات (۱۲)».
- Without a breakdown, "what fits my budget" is mental arithmetic.

## Minor Observations

- **Error state:**
  - It removes the heading (`head.replaceChildren()`), so `aria-labelledby="scope-title"` points at nothing.
  - What's left is one line and a CTA, with no WhatsApp or Telegram option, though a direct message counts as success.
- **Loading skeleton:** it is taller than the result (see Casey above). Sizing it close to the result avoids the jump.
- **Tab order from 1024px:** the CTA comes before the slider and tiles.
- **Included list at 1280×800:** it scrolls inside the card to hide one item, and the item descriptions never show at
  either desktop size.
- **Free add-on:** its empty price line reads as missing data. This is deliberate per §5 (see New conflicts).
- **Price typography:** «از» and «میلیون تومان» are set at the figure's size. A smaller unit would let the number lead.
- **The bar at rest:** it becomes a full-bleed white slab sitting on sage above the band's bottom padding.
- **Summary card:** its title never names the chosen type.
- **Live region:** it announces the new total only, never what changed or what was dropped.

## Questions to Consider

1. The add-ons folded away are the differentiators: CRM, automation and analytics on desktop; booking, loyalty and chat
   on phones. Should the first view sell "beyond web design" rather than a contact form and multilingual?
2. For a fixed-budget owner, is "from X" with 12 toggles the right tool, or should the question run budget-first:
   "here is what fits"?
3. While every number is a sample, does showing a price build or cost trust compared with showing only the included
   list and working days?

## New Conflicts with DESIGN.md (for the owner)

- **Labelling a free add-on** (e.g. as free) would contradict §5 Forms, which keeps a free add-on's price line empty.
- **The PC2 breakdown disclosure** extends §5's list of what the summary card holds. Kept collapsed, it respects "only
  the included list gives way", but the recipe should be amended to record it.

---

First run for this target, no trend yet. Snapshot: `.impeccable/critique/` (slug `project-index-html-scope`).

Questions skipped: the owner asked for all eight critiques to run back to back without stopping (2026-09-27); triage
happens on the summary (`10-summary.md`).
