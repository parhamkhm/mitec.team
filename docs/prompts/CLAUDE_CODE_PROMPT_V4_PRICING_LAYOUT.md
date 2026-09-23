# PRICING v4 — orderly, count-proof layout for the calculator

Follow-up to V3. Data model, calculation, copy, colours and interactions of the pricing section are approved: **do not change pricing.json's shape, estimate.js, the admin contract, or any other section.** This task is layout only.

## The problem (from the current build)

- The add-on column is a single stack of tall rows (the `+` toggle sits on its own line under the price), so 9 add-ons make it far taller than the Base card. The page shows a long ragged column next to a short card with a big empty area under it.
- Row heights differ (rows with `price: 0` are shorter), so the stack looks uneven.
- The total and CTA are far below, disconnected from the choices.
- Every new add-on the admin adds makes this worse.

## The goal

Whatever the number of add-ons (1 to ~24) and site type, the section must always read as a tidy grid: aligned edges, equal tile heights, balanced columns, and the price/CTA always within reach.

## New layout (≥ 1024px)

```
┌── start column (right in RTL), 5fr ─────────┐  ┌── end column, 7fr ──────────────────────────────┐
│ SUMMARY CARD  (sticky)                      │  │ Pages block (label · value · slider · hint)     │
│   «پایه» title + subtitle                   │  │ ─────────                                        │
│   included[] as a 2-column checklist        │  │ «امکانات بیشتر»                                  │
│   «شامل N صفحه»                             │  │ ┌──────────────┐ ┌──────────────┐               │
│   ─────────                                 │  │ │ add-on tile  │ │ add-on tile  │   2-col grid,  │
│   جمع: «از ۳۰ میلیون تومان»                  │  │ └──────────────┘ └──────────────┘   equal rows   │
│   «حدود ۳۰ روز کاری» · «۳ امکان انتخاب شده»  │  │ ┌──────────────┐ ┌──────────────┐               │
│   [ ادامه در سفارش‌ساز ]  (full card width)  │  │ │              │ │              │               │
│   disclaimer                                │  │ └──────────────┘ └──────────────┘               │
└─────────────────────────────────────────────┘  │ ┌──────────────────────────────┐ ← odd last tile │
                                                 │ │  spans both columns           │   spans 2     │
                                                 │ └──────────────────────────────┘                │
                                                 └─────────────────────────────────────────────────┘
```

1. **Summary card = Base card + total + CTA.** Move the total line, the CTA and the disclaimer from below the section into the bottom of the Base card. Remove the old standalone total/CTA block. The CTA stays the only primary button in the viewport.
2. **Sticky summary.** The start column is `position: sticky; top: calc(<nav height> + 24px); align-self: start`. Measure with a `ResizeObserver`: if the card is taller than `innerHeight − nav − 48px`, drop the sticky class (never let a sticky card be cut off). Stop being sticky when the section ends (sticky inside the section's grid does this naturally; verify it).
3. **Compact included list.** Render `included[]` as a 2-column grid (`repeat(2, minmax(0, 1fr))`, gap `--space-4` / `--space-5`): check chip + title (weight 700) + desc (caption, muted) under it. At < 1280px or if the card would exceed the sticky height, fall back to 1 column.
4. **Add-on tiles in a grid.** `display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: 1fr; gap: var(--space-3)`. Every tile in the grid is the same height.
   - **Orphan rule:** when the number of visible tiles is odd, the last tile spans both columns: `.addons:has(> .addon:last-child:nth-child(odd)) > .addon:last-child { grid-column: 1 / -1; }`. With a single add-on it therefore spans the full width.
   - Tile anatomy (the whole tile is the toggle button, `aria-pressed`):
     ```
     ┌────────────────────────────────────────┐
     │ Title                            [+]   │   row 1: title (start) · 32px round toggle (end)
     │ Description, max 2 lines               │   row 2: -webkit-line-clamp: 2; full text in title attr
     │ «از ۵ میلیون تومان»                    │   row 3: price, pushed to the bottom (margin-top: auto)
     └────────────────────────────────────────┘
     ```
     `display: flex; flex-direction: column; gap: var(--space-2); padding: var(--space-4) var(--space-5); min-height: 124px`. The price row always keeps its line height, even when the price is 0 and nothing is printed, so every tile's baseline lines up.
   - States: off = 1px dashed `--color-border`, `+` icon; hover = `--color-border-hover`; on = solid `--color-border-hover`, `--color-tonal` background, `−` icon inside a `--color-tonal-text` filled circle. Toggle transitions use `--dur`. No layout shift between states (same border width).
5. **Optional grouping (only if the data has it).** If any add-on has an optional `group` string, render one small heading per group (in `order` of first appearance) with its own tile grid (same orphan rule per group). If no add-on has `group`, render one grid with no headings. Add `group` as an optional field to `docs/pricing.schema.json` and `docs/pricing-guide.md`; no other data changes.
6. **Summary selection line.** Under the total, show «N امکان انتخاب شده» (Persian digits) from the estimate's `lines`; hide it when N is 0.

## Other breakpoints

- **768–1023px:** one column. The summary card first (not sticky), then the pages block, then the add-on grid at 2 columns with the same orphan rule. The total/CTA block becomes a sticky bottom bar (see mobile).
- **< 768px:** add-on grid is 1 column (no orphan rule needed). The included list is collapsed after 4 items behind the existing «همه‌ی موارد» disclosure. The total + CTA sit in a bar pinned to the bottom of the viewport **only while the section is in view** (IntersectionObserver): `--color-surface` background, top border `--color-border-subtle`, safe-area padding, total on the start side, CTA on the end. The summary card itself shows no duplicate total on mobile.
- Tabs row: unchanged (horizontal scroll with snap on small screens).

## Constraints

- Semantic tokens only, no new hex. No new dependencies. Keep all existing a11y behaviour (roving tabs, slider keys, live region: move `aria-live` with the total into the summary card and the mobile bar, never announce twice).
- Keep the reveal entrance (heading, then the two columns, 80ms stagger).
- `:has()` is fine (supported in all current browsers). Without it the layout must still be acceptable: the odd last tile simply stays half-width.

## Acceptance checklist

Test by temporarily editing `pricing.json` (revert afterwards):
- [ ] 1, 2, 3, 8, 9 and 16 add-ons: the grid is always even; an odd count gives exactly one full-width last tile; all tiles in a grid have equal height.
- [ ] 9 add-ons at 1440×900: the end column is not more than ~1.3× the summary card height; the summary card stays visible (sticky) while scrolling the tiles and releases at the section end.
- [ ] A very long description is clamped to 2 lines and does not stretch its row.
- [ ] A tile with `price: 0` aligns with its neighbours.
- [ ] Adding `group` to some add-ons renders grouped grids; removing it restores one grid.
- [ ] 768 and 390 widths: order is summary → pages → tiles; the bottom bar appears only while the section is on screen and never covers the footer or the section below.
- [ ] Keyboard and screen reader behaviour unchanged; the total is announced once per change.
- [ ] No horizontal scroll; console clean.

Commit as "Pricing: count-proof tile grid and sticky summary", do not push, then stop and report with screenshots at 1440, 768 and 390.
