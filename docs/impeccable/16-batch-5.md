# Impeccable pass — Phase 2, batch 5: the calculator

**Closed:** PC1, PC2, PC3, PC4, PC5 and the free add-on string. Before them, one commit carried the owner's four
decisions on batch 4.

| Commit | Closes |
|---|---|
| `impeccable(harden): batch 4 decisions — one kind of Work back per size, the H1 fitted for Vazirmatn before it lands, Persian carousel roles` | owner's decisions on batch 4 |
| `impeccable(harden): calculator — choices kept across site types; pages start at the type's included count, with a tick and the price of one more page (PC1, PC3)` | PC1, PC3 |
| `impeccable(adapt): calculator — every site type in view below 1024px, the tabs wrapping into a grid in the same track (PC4)` | PC4 |
| `impeccable(clarify): calculator — a free add-on says «بدون هزینه‌ی اضافه»` | the free add-on string |
| `impeccable(clarify): calculator — «جزئیات برآورد» under the total, opening upward in the bar; «اعداد نمونه» beside the figure (PC2, PC5)` | PC2, PC5 |

## The owner's decisions on batch 4

### 1. One kind of Work back per size

- **Rows or tabs is now one choice for every card.** From 1024px, work.js tries each project's three texts in a
  spare card (added to the stage only while it measures, so it works for any number of projects). Rows show only if
  every project fits; otherwise every card has the tabs.
- **With today's texts, that means tabs at every size.** Tested at 1024, 1280×800, 1440, 1920 and 768: no card has
  rows. With the texts cut short for a test, every card showed rows at 1440, and none did after a resize to 1000px.
- **Batch 4's rows table was wrong, and is corrected there.** The panel centres its content, so `scrollHeight`
  counted only the half of an overflow below the panel. And Mery's title is one line, not two. The real figures
  (space needed / available, px):

  | | Mery | Karamad | E2 |
  |---|---|---|---|
  | 1280×800 | 259 / 170 | 259 / 192 | 205 / 192 |
  | 1440, 1920 | 232 / 182 | 205 / 204 | 205 / 204 |
  | …with every text on one line | 205 at both | 205 | 205 |

- **Shortening Mery's texts is needed but not enough.** At 1440, one row holds about 75 characters, and Mery's
  «نتیجه» (83) takes two lines. But even with every text on one line Mery is 23px short, because its «دیدن سایت»
  button is 22px taller than the other cards' note. At 1280×800 every card is short even on one line each (Mery
  35px, Karamad and E2 13px). The entry in `docs/copy-todo.md` («از Impeccable») gives the budgets (about 75
  characters per text for 1440, about 65 for 1280×800) and says a layout change is needed as well.

### 2. The desktop font-swap shift

**(b) is kept:** the H1 is fitted for Vazirmatn before it lands.

- **Why a single width ratio can't work.** On one line, Vazirmatn 800 is 2.5% *narrower* than every fallback
  (Tahoma 0.975, Noto Naskh 0.978, Noto Sans 0.974). Yet at 1440 it needs 72px where the fallback fits 76px,
  because of where the line breaks. At 76px «دیجیتال» is 243px in Vazirmatn and 225px in Tahoma, so the second line
  («ساخت زیرساخت دیجیتال») is 771px in a 764px box and the H1 goes to four lines. A ratio would say Vazirmatn is
  narrower and fit 76px, so it would change nothing.
- **What (b) does instead.** The inline layout script stores each H1 word's width in Vazirmatn 800, in em, and the
  space's (0.248em), plus the mark's .08em padding on its first and last word. Until the 800 face has landed
  (`document.fonts.check`), the fit counts the lines Vazirmatn will take and uses the taller of that and the
  fallback. It also holds the H1 at that height (`min-height`), so nothing under it moves when the font lands. If
  a word is not in the table (the copy changed), this switches off, and the fit follows the fallback until the font
  lands, as before.
- **The fitted size with and without the font, 15 sizes from 320 to 1920:** the same at 14. At 360×780 the fallback
  wraps taller than Vazirmatn (194 → 156px). That is unchanged, since the fit only ever adds height.
- **Load (Slow 4G; 4× CPU on phone and tablet), before → after:**

  | | Runs | CLS (median; worst) | FCP | LCP |
  |---|---|---|---|---|
  | Desktop 1440, base → (b) | 9 | 0.0056; 0.048 → 0.0019; 0.0021 | 2236 → 2228 | 2236 → 2228 |
  | Desktop 1440, base → (a) preload ≥1024px | 9 | 0.0056 → 0.0002 | 2236 → 2356 | 2236 → 2356 |
  | Phone 390, base → (b) | 5 | 0.0006 → 0.0006 | 2720 → 2844 | 3408 → 3080 |
  | Tablet 768, base → (b) | 5 | 0.0014 → 0.0014 | 3320 → 3244 | 3404 → 3392 |

  - **(a) is dropped:** its FCP and LCP are 120 ms later, past the 50 ms bound.
  - **(b) has no CLS spikes:** its CLS is 0.0019–0.0021 in all nine runs; base spiked to about 0.047 in four of
    nine.
  - **The phone's FCP spread is run-to-run noise.** Each run lands at about 2.5 s or about 3.5 s, in both versions,
    and (b) was faster in three of the five pairs. A direct timing of the layout function under 4× CPU, with the
    fallback font, shows what (b) costs: +0.4 ms at 390, +2.5 ms at 1440 (one more 4px step, the one base takes
    only after the font lands) and 6–15 ms at 768.
- **Batch 2's note** that no frame was drawn with the old fit is corrected in `13-batch-2.md`, and so is the code
  comment on the font hook.

### 3. Dots at 24 × 44 and the narrow Work layout on landscape phones

Accepted as they are.

### 4. Screen-reader names

The carousel's `aria-roledescription` is «اسلایدر نمونه‌کارها»; the current slide already had «اسلاید». The side
cards stay plain buttons («رفتن به پروژه‌ی …»): with three projects the same one can show on both sides, so labelling
each as a numbered slide would repeat «۲ از ۳».

## PC1 + PC3: one `selectType` change

- **Nothing chosen is dropped (PC1).** `state.picked` keeps every add-on. One the current type doesn't offer has no
  tile, and it stays out of the count, the estimate and the hand-off. It comes back with a type that offers it.
  - Traced: corporate, 5 pages, CMS and payment → ecommerce → landing → corporate brings back 5 pages, CMS and
    payment, «از ۲۴ میلیون تومان». It used to come back at 1 page with nothing chosen.
- **The page count (PC3).** `state.wanted` is the count last set on the slider (0 until then). On a type switch the
  slider shows the larger of that and the type's included pages, within the type's range.
  - Traced: corporate at 1 page → ecommerce shows 3 (its included pages), where it used to keep 1 while the card
    said «شامل ۳ صفحه».
  - Setting 2 on ecommerce, then catalog → 3, then corporate → 2 again.
- **The included span.** Where a type includes more pages than its minimum (ecommerce, catalog), a 2 × 14px
  `--color-text-muted` tick across the track marks the last included page. It is drawn on the input's own box and
  keeps clear of action green.
- **«هر صفحه‌ی بیشتر: از ۱ میلیون تومان»** sits under the slider, before the note on extra pages; both describe the
  slider.

## PC4: every site type in view

Below 1024px the six tabs wrap into a grid inside the same sunken track: three per row (235px each at 768), two below
600px (165px at 390, 130px at 320). Native radios and 44px targets are kept. At 320, the four longest labels take
two lines (74px tall).

## The free add-on

«فرم تماس» now says «بدون هزینه‌ی اضافه» in its price line, in `--color-text-muted` 500. That is 5.38:1 on the tile
and 4.89:1 on a chosen one. DESIGN.md §5 had kept that line empty; it now describes the new text.

## PC2 + PC5: the checkout

- **The row under the figures:** «جزئیات برآورد» (a text button with a 44px target, `aria-expanded`) at the start,
  and «اعداد نمونه» at the end. The badge sits beside the figure in the card and in the bar, so a screenshot of the
  bar carries its caveat too. The heading keeps its own badge.
- **The breakdown:** an inset list on `--color-surface-sunken`.
  - The lines, in order: the site type («سایت شرکتی»), «+۴ صفحه» for the pages beyond those included, then each
    chosen add-on. Each shows its amount, or «بدون هزینه‌ی اضافه» for a free one (in `--color-text-secondary`
    here, since muted is 4.36:1 on sunken).
  - It follows every change live. It fades up 6px as it opens, with no motion under reduced motion.
- **In the card** it opens under its button, and the included list gives way, as the card's recipe says.
- **In the bar** the button's row sits above the figures and the CTA, and the breakdown above that row. The bar grows
  upward and the button stays under the finger. Past 40% of the screen the list scrolls inside, and it becomes
  keyboard-focusable («جزئیات برآورد»).
- **Focus clears the bar.** The bar's height (`--scope-bar-h`) feeds the `scroll-margin`, so keyboard focus clears
  the taller bar.
- **A 320px fix on the way.** The price and the CTA never fitted side by side under about 340px: at 320 the CTA
  covered the price before this batch. Under 360px the CTA now takes its own full-width row.
- **The bar is taller.** Closed, it is 124px at 390 (it was 79), 133px at 768 (88) and 176px at 320 (79, the
  price covered then), the CTA row included.

## Checks

- **The sweep:** 320, 390, 768, 1024 and 1440 under motion, reduced motion, forced colours and no JS. All 20 clean:
  no sideways scroll, no console errors or warnings, every section present.
- **The calculator at 320, 360 and 390** with all 12 add-ons and 20 pages («از ۹۸ میلیون تومان»): no overlap
  between the price and the CTA, and no sideways scroll.
- **The hand-off** to the order builder stores `{ siteType, pages, addons }` with only the add-ons the chosen type
  offers.

## Load (Slow 4G; 4× CPU on the phone)

Before is `b159c22` (the decisions commit), after is this batch; keep-alive server, alternating runs, five each.
Medians, in ms:

| | Phone 390 (4× CPU) | Desktop 1440 |
|---|---|---|
| FCP | 3036 → 3128 | 2264 → 2268 |
| LCP | 3308 → 3244 | 2264 → 2268 |
| DCL | 6501 → 6685 | 5206 → 5239 |
| CLS | 0.0006 → 0.0006 | 0.0021 → 0.0019 |

- **Desktop is unchanged.**
- **The phone's differences are within its run-to-run spread:** FCP ran 2292–3656 before and 2632–3588 after. The
  batch adds about 3 KB to `home.css` and 3 KB to `scope.js`, and the calculator is far below the first view.

## For the owner

- **The phone bar is taller:** one more row for «جزئیات برآورد» and «اعداد نمونه», and at 320 a row for the CTA
  (see the figures above). A smaller bar would mean dropping the badge from the bar, or moving the button into the
  breakdown.
- **The breakdown's first two lines are composed from existing strings:** the type's own label, and «+{n} صفحه»
  from `section.pagesValue`. They are listed in `docs/copy-todo.md` («از Impeccable») for your copy pass.
- **Mery's rows:** see decision 1 above. Shortening the texts is needed but not enough on its own.
- **Still open from 07 (not in this batch):**
  - the loading skeleton is 321px taller than the result;
  - the error state drops the heading and offers no WhatsApp or Telegram;
  - from 1024px the CTA comes before the slider in the tab order.

## Screenshots

All in `docs/impeccable/shots/` (gitignored, kept on disk).

- **Before / after pairs** (`b5-before-*` / `b5-after-*`), corporate, 5 pages, CMS and the contact form chosen:
  - `scope-{320,390,768,1440}`: the section's top, with the tabs and the bar;
  - `scope-{320,390,768,1440}-config`: the slider, the tiles and the checkout.
- **After only:**
  - `b5-after-scope-1440-ecommerce-open`: the tick at 3 pages and the breakdown open in the card;
  - `b5-after-scope-390-open`: the breakdown open in the bar;
  - `b5-after-scope-320-max`: all 12 add-ons and 20 pages, with the CTA on its own row.
