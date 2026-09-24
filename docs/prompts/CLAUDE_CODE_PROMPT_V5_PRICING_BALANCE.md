# PRICING v5 — rebalance the calculator for 12+ add-ons

Layout fix only. Do not change pricing data values, `estimate.js`, copy, colours, the approved hero/Process/other sections, or the tile's visual design (dashed/solid states, toggle, price line).

## What broke (measured in Chromium on the current `copy/final-pass` build, 12 add-ons)

| Viewport | Summary card | Config column (pages + tiles) | Ratio | Tile rows | Sticky |
|---|---|---|---|---|---|
| 1920×1080 | 472×739 | 660×1130 | 1.53 | 6 × 150px | yes |
| 1440×900 | 472×739 | 660×1130 | 1.53 | 6 × 150px | yes |
| 1280×800 | 472×857 | 660×1130 | 1.32 | 6 × 150px | **no** (card taller than the viewport, so it scrolls away and leaves an empty column) |

Causes:
1. Three add-ons were added (crm, automation, analytics): 12 tiles in 2 columns give 6 rows.
2. The new, longer descriptions wrap to 2 lines at 324px, and `grid-auto-rows: 1fr` stretches every row to 150px, so the one-line tiles get a gap in the middle.
3. The sticky rule drops stickiness whenever the card is taller than the viewport, which happens on 800–880px-high screens (most laptops).

## Target

At every desktop size, the tile column is at most ~1.15× the summary card's height, the summary (with total and CTA) is always visible while choosing, and any add-on count from 1 to ~24 forms complete rows.

## Changes

### 1. Column split and tile grid by width
- **≥ 1280px:** `.scope-cols` becomes `minmax(0, 4fr) minmax(0, 8fr)`. The add-on grid uses **3 tiles per row**, built on a 6-track grid (each tile `grid-column: span 2`) so the remainder can be spread evenly:
  - count % 3 == 1 → the last tile spans all 6 tracks;
  - count % 3 == 2 → the last two tiles span 3 tracks each.

  ```css
  .scope-addons { grid-template-columns: repeat(6, minmax(0, 1fr)); }
  .scope-addons > * { grid-column: span 2; }
  .scope-addons > :last-child:nth-child(3n + 1) { grid-column: 1 / -1; }
  .scope-addons:has(> :last-child:nth-child(3n + 2)) > :nth-last-child(-n + 2) { grid-column: span 3; }
  ```
  Apply the same rule per group when add-ons have `group`.
- **1024–1279px:** keep `5fr / 7fr` and 2 tiles per row with the existing odd-last-spans-both rule.
- **768–1023px and < 768px:** unchanged (single column, bottom checkout bar, 2 then 1 tiles per row).

### 2. Tile height
- Keep `grid-auto-rows: 1fr` (equal rows), but make tiles compact: padding `var(--space-4)`, gap `var(--space-1)` between title and description, `min-height: 0` (remove the 124px floor) so the row height comes from the content.
- Title: max 2 lines (`line-clamp: 2`). Description: max 2 lines (already). Full text stays in the `title` attribute.
- Add a content rule to `docs/pricing-guide.md` and `docs/pricing.schema.json` (`maxLength: 48` on add-on `desc`, `maxLength: 28` on add-on `title`) so admin-entered text cannot blow up the grid. Do not shorten any existing text yourself; list the ones over the limit in your report.

### 3. A summary that never leaves the screen
- Replace "drop sticky if too tall" with: the summary is **always** sticky at ≥ 1024px, with `max-height: calc(100dvh - var(--scope-top) - 24px)` and `display: flex; flex-direction: column`.
  - The base header and the checkout block (total, meta, CTA, disclaimer) never shrink (`flex: none`).
  - Only the included list scrolls inside the card (`overflow-y: auto; overscroll-behavior: contain`), with a soft fade mask at its bottom edge while it has more to scroll. The scroll container must be keyboard-focusable (`tabindex="0"`, `aria-label`).
- In the summary, the included list shows **titles only** in one column; the descriptions appear under the titles only when the card has room (measure once on resize: if the full list fits without scrolling, show descriptions; otherwise hide them). No layout jump while scrolling the page.
- Remove the `is-single` / `is-sticky` toggling logic that is no longer needed; keep the `ResizeObserver` only for the description fit check and `--scope-top`.

### 4. Long lists stay bounded
- If a site type has more than **9** active add-ons at ≥ 1024px (**6** below), show the first 9 (or 6) plus a full-width text button «نمایش همه‌ی امکانات ({n})» that expands the rest in place (and «نمایش کمتر» to collapse). Selected add-ons are never hidden: when collapsed, a selected add-on beyond the limit stays visible. Button text comes from `section` in `pricing.json` (`showAllAddons`, `showFewerAddons`): add them as optional fields with these defaults in the schema and guide.

## Acceptance checklist
Test with the real `pricing.json` and temporary copies with 1, 2, 3, 4, 5, 7, 9, 12 and 16 add-ons (revert afterwards):
- [ ] 1920×1080, 1440×900, 1366×768, 1280×800: the config column is ≤ 1.15× the summary height (report measured numbers in a table like the one above). The summary stays pinned with the total and CTA visible the whole time you scroll the tiles.
- [ ] Every count forms complete rows: no half-empty last row at 3 per row or 2 per row.
- [ ] One-line and two-line tiles in the same row look intentional (content top-aligned, price on the same baseline, no big internal gap).
- [ ] The collapse/expand of long lists works with the keyboard and keeps selected add-ons visible.
- [ ] 768 and 390: unchanged from the approved V4 behaviour.
- [ ] No horizontal scroll, console clean, `estimate.test.html` still passes.

One commit on `copy/final-pass` ("Pricing: rebalance grid and always-visible summary"), do not push, then report with screenshots at 1920, 1440, 1280×800, 768 and 390.
