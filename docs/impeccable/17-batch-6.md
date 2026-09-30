# Impeccable pass — Phase 2, batch 6: layout and adapt

**Closed:** PR1, PR2 (as decided), PR3, PR4, AB3, AB4 (the photo rule), SV1, MO4, A4 and `--section-pad`. Before them,
four small commits carried the owner's decisions on batch 5.

| Commit | Closes |
|---|---|
| `impeccable(distill): work — the rows back removed; the tabs at every size` | decision 1 on batch 5 |
| `impeccable(adapt): calculator bar — one row: a chevron for the breakdown, a short «نمونه» after the duration` | decision 2 |
| `impeccable(clarify): calculator breakdown — «۴ صفحه‌ی بیشتر» for the pages beyond those included` | decision 3 |
| `docs(copy-todo): the Impeccable copy flags from reports 02–09, under «از Impeccable»` | decision 4 |
| `impeccable(animate): process — the spotlight fades on a steep curve and the text switches at its midpoint (PR1)` | PR1 |
| `impeccable(animate): process — across, the rail runs from the whole row in view to its top at 25%; cards change in one step; a link lands on the end state (PR2)` | PR2 |
| `impeccable(layout): process — five across from 1200px, the row widened up to 1440px; stacked below; equal card heights (PR3)` | PR3 |
| `impeccable(adapt): process — stacked cards in two columns from 760 to 1199px (PR4)` | PR4 |
| `impeccable(adapt): about — narrow cards restack round a 64px photo; photos crop to the circle; an odd member count centres (AB3, AB4)` | AB3, AB4 |
| `impeccable(adapt): services — the whole card is its link; chip and title on one row on phones; art sized to its box (SV1, MO4, A4)` | SV1, MO4, A4 |
| `impeccable(adapt): rhythm — --section-pad floor 64px on phones` | `--section-pad` |

## The owner's decisions on batch 5

1. **The Work rows mode is gone:** work.js (the spare card, `fitRows`, the rows markup, the × focus case), home.css
   and the DESIGN.md line, which is its pre-rows text again. Every card has the tabs at every size. The Mery budget
   entry left `docs/copy-todo.md`, and `16-batch-5.md` notes why.
2. **The phone bar is one row.**
   - At its start is a 32px tonal chevron for the breakdown (a 44px target, named «جزئیات برآورد» by its visually
     hidden text). It still opens upward, and it turns over when open.
   - While the numbers are placeholders, the duration line ends with a hairline and a small muted «نمونه»
     (`--text-eyebrow`, hidden from screen readers, which have the heading's badge). The card keeps its text button
     and the full badge.
   - What made it fit: no row gap for the closed breakdown's empty row, the duration line at 1.5, and under 400px
     16px side padding and a 10px CTA padding. Under 360px the CTA keeps its own row. Lucide's `chevron-up` joins
     the sprite.

   | Bar, closed | 320 | 360 | 390 | 768 |
   |---|---|---|---|---|
   | With «نمونه» | 118px | 74px | 74px | 83px |
   | Without (`placeholder: false`) | 118px | 74px | 74px | 83px |
   | Batch 5 | 176px | 124px | 124px | 133px |

   With the Tahoma fallback, 360 is 92px until Vazirmatn lands (the mark wraps to a second line). The bar only
   shows once the calculator is on screen, far down the page, so the font has normally landed by then.
3. **The breakdown's extra pages read «۴ صفحه‌ی بیشتر»** (`COPY.extraPages`, `section.extraPages`). The type's own
   name as the first line is approved, and the copy-todo row that asked about both is closed.
4. **The copy flags from reports 02–09 are in `docs/copy-todo.md`,** under «از Impeccable». There are 22, each with its
   section, report and place, current text verbatim, and the issue in one line; PR3 below adds one more. Flags that
   later decisions settled are left out, and the section says which.

## Process

### PR1: text on a half-lit card

The text eased over `--dur` while the forest layer eased over `--dur-slow`. Timing the text alone could not fix it:
tested at five timings, the layer's ease-out keeps the background for about 150ms in the band where neither text
colour passes, whatever the text does. So the layer keeps its 420ms but fades on a new token, `--ease-swap`
(`cubic-bezier(1, 0, 0, 1)`), which crosses that band in about 40ms. The text switches in one step at the
midpoint.

| One hand-over, sampled every frame | Before | After |
|---|---|---|
| Time under 4.5:1, each card (1440 and 390) | 160–180ms | about 40ms |
| Lowest contrast | 1.04:1 | 2.2:1, for one frame |
| Frames under 3:1 | 10 | 1 |

### PR2: the five-across rail

- **The range.** The head starts once the whole row is in view, and reaches the end (step 5 lit) by the time the
  row's top is 25% down the viewport. A short screen still gets 20% of a viewport of travel.
- **No seam at rest.** A card changes in one step as the head passes its dot: its fill, edge and numeral ease in
  over `--dur-slow`. The rail itself still fills with the scroll.
- **Arriving by a link.** A click on a link to `#process`, a `hashchange` or a load with the hash shows the end
  state at once, with no easing. It holds until the section, once shown so, leaves the screen; scrolling back in
  then scrubs as usual. The flag counts as "shown" only after the engine's observer has seen the section, since a
  load with the hash starts off screen and smooth-scrolls there.
- **Stacked layouts** keep the reading line at 60%, and their continuous fill.

| 1440 | Before | After |
|---|---|---|
| Scroll positions (30) with a part-filled card at rest | 15 | 0 |
| First change | row top at 863 of 900 (row mostly off screen) | row fully in view (bottom at 809 of 900) |
| Step 5 lit from | row top at 34% | 22% (sampled every 37px) |
| After the nav link | step 3 lit, a seam through step 4 at 81%, step 5 empty | step 5 lit, all filled |
| Loaded with `#process` | as the nav link | step 5 lit, all filled |

The same at 1200 and 1920 (step 5 at 22% and 25%), measured after PR3 moved the row to 1200px. 390 is unchanged.

### PR3: two lines on the lit card

- **Five across from 1200px.** Below that the steps stack. At 1024 five columns had set a paragraph in 4–5 lines at
  132px.
- **The row is wider and a little tighter.** From 1200px it may run past the 1200px container, up to 1440px, never
  closer than the gutter to the screen's edge. The cards are 12px apart with 20px padding (were 16 and 24), and
  every card in the row is as tall as the tallest.
- **The paragraphs need 203 / 231 / 221 / 217 / 198px** to set in two lines.

  | Width | Text column | Paragraphs in two lines |
  |---|---|---|
  | 1920 | 236px | all five |
  | 1440 | 227px | four (step 2 runs to three) |
  | 1366 | 212px | two (steps 2–4 run to three) |
  | 1280 | 195px | none |
  | 1200 | 179px | none |

  As decided, these are listed in `docs/copy-todo.md`, not rewritten.

### PR4: tablets and small laptops

From 760 to 1199px each stacked card has two columns: the numeral and title in an 11rem start column, the paragraph
beside them, centred on them. At 768 a card is 125px tall (was 160, about 70% empty), and the five steps take 689px
(were 864). At 1024 each paragraph is one line.

## About

- **AB3.** Each card is a container.
  - Under 480px (its content under 416): a 64px photo beside the name and role, and the bio under them across the
    card.
  - At 480 and wider: the 88px photo beside the text, aligned to the top, so names in a row sit level.

  | | Before | After |
  |---|---|---|
  | 390: role / bios | role in 2 lines; bios 4 and 5 lines at 168px | role in 1 line; bios 2 and 3 lines at 276px |
  | 768: the two names | 27px apart in height | level |
  | 390: card heights | 268 / 268px | 227 / 254px |

- **AB4.**
  - `.about-card__photo > img` fills the square and crops to the circle.
  - The REPLACE note in `index.html` carries the asset spec: square WebP, at least 176px, `width` / `height`,
    `alt` the member's name.
  - From 760px an odd last card sits centred at a column's width.
  - Checked with a photo dropped in and a third card. DESIGN.md gains an About recipe (it had none).

## Services

- **SV1.**
  - **The card is its link now.** The link is a box its own width, on the last line of every card in a row (row 2
    at 1440 and row 3 at 768 were 29px off). Its `::before` covers the card, so a tap anywhere in the body opens it.
  - **Layers.** The art and the fade sit under the content at z-index −1, in the card's own stacking context.
  - **Focus and hover.** Focus draws on the card where `:has()` is supported (the link's own ring otherwise).
    Hover only applies on devices that hover, so a tap no longer leaves it stuck.
- **MO4.** Below 760px the chip and the title share a row, and the card uses `--pad-card` (24px): Services at 390 is
  1621px tall (was 2038). The four repeated «شروع پروژه» stay, since whether they should is in copy-todo.
- **A4.** `sizes` follows the art's own box: 280px from 1200; (100vw − 80px) / 4 from 1024; (100vw − 64px) × .375
  from 760; (100vw − 48px) × .6 below. At 390 (DPR 2) the six 768w files load instead of the 1536w ones.

## `--section-pad`

`clamp(64px, 11vw, 176px)`. At 390 each band has 64px (was 96), 448px less across the seven bands; 768 has 84px;
from about 1000px nothing changes (1440 stays 158px). Every section boundary still reads at 390, with the band colour
changing at each. With the batch's other changes, the page at 390 goes from 11735 to 10750px.

## Checks

- **The sweep:** 320, 390, 768, 1024 and 1440 under motion, reduced motion, forced colours and no JS. All 20 were
  clean: no sideways scroll, no console errors or warnings, every section present.
- **No sideways scroll** at 768, 1024, 1200 and 1440 on a `#process` load either (the widened row included).

## Load (Slow 4G; 4× CPU on the phone)

Before is `0b2fce0` (the decisions on batch 5), after is this batch. Keep-alive server, alternating runs. Medians, in
ms:

| | Phone 390, 4× CPU (9 runs) | Desktop 1440 (5 runs) |
|---|---|---|
| FCP | 2912 → 2856 | 2284 → 2296 |
| LCP | 2940 → 2920 | 2284 → 2296 |
| DCL | 6359 → 6260 | 5207 → 5232 |
| CLS | 0.0006 → 0.0006 | 0.0021 → 0.0021 |

No change beyond noise. A first 5-run phone set had after 136ms slower. Its before runs spread from 2432 to 3144ms,
so 9 more rounds were run; those are the figures above. Nothing in the batch touches the first screen; the CSS
grew about 3 KB.

## For the owner

- **PR1 is not zero.** About 40ms per hand-over stays under 4.5:1, one frame near 2.2:1, because the layer still
  fades. Only a hard switch (no fade) would reach zero.
- **The stacked Process layouts** (below 1200px, now including 1024–1199) keep the continuous fill, as decided. A
  seam can rest there across a paragraph when scrolling stops mid-card.
- **With a classic (non-overlay) scrollbar**, the widened Process row at 1440 leaves about 16px at each side, not
  24, because `100vw` counts the scrollbar. It never scrolls sideways.
- **Services:** with the whole card as the link, the card's text can't be selected by dragging.
- **Still open from 06:** the placeholder «عکس» is read aloud before each name. Marking it `aria-hidden` while it's
  a placeholder is a one-line change, not in this batch.

## Screenshots

All in `docs/impeccable/shots/` (gitignored, kept on disk).

- **The bar (decision 2):** `b5d-bar-{320,360,390}` and `b5d-bar-{320,360,390}-open`.
- **Before / after pairs** (`b6-before-*` / `b6-after-*`):
  - `process-1440`, `process-1024`, `process-768`, `process-390`: landed from `#process`. At 1440, before: step 3
    lit and a seam through step 4; after: the end state. At 1024: five across before, stacked after. At 768: the
    two-column cards.
  - `about-390`, `about-768`: the restacked cards (reduced motion, so no reveal is mid-way).
  - `services-390`, `services-1440`: the chip-and-title row on phones; the links on one line per row.
