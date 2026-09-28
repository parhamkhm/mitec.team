# Impeccable pass — Phase 2, batch 4: the harden sweep

**Closed:** HE4, FC3, A7, A8, A9, A10, A11, A12, A13, PW2, PW5, FC2, the owner's Work decisions 1–3 and the FAQ
no-JS decision. Before them, one commit carried the owner's three decisions on batch 3.

| Commit | Closes |
|---|---|
| `impeccable(adapt): channels — short labels where narrow, the brands' marks; tonal edge on light` | owner's decisions on batch 3 |
| `impeccable(harden): decks — one clamped deck line for the outline laptops` | HE4, FC3 |
| `impeccable(adapt): targets — 44px hit areas for the logo, «مطمئن نیستید؟» and the pause toggle` | A7 (part) |
| `impeccable(harden): about — the photo placeholder label meets AA` | A8 |
| `impeccable(adapt): work — opaque side cards, a centre-only flat row that crossfades, the narrow layout to 989px` | PW2, Work 1, Work 3 |
| `impeccable(layout): work — the back's three texts as rows from 1024px, where a card holds them` | Work 2 |
| `impeccable(harden): work — dots as 44px-tall targets drawn by transform, dots named by project, a region, a one-line caption name` | PW5, A12, A10 (dots), A7 (dots) |
| `impeccable(harden): faq — the tapped question stays put; hover; no markers without JS` | FC2, FAQ no-JS, A10 (FAQ) |
| `impeccable(optimize): layers — will-change only while a section is in view` | A9 |
| `impeccable(optimize): data — portfolio.json fetched once, shared` | A11 |
| `impeccable(polish): project — remove the old .dc.html prototypes, support.js and image-slot.js` | A13 |

## The owner's decisions on batch 3

- **The channels pair never stacks.** Where a pair is under 352px wide, the visible labels shorten to «واتساپ» and
  «تلگرام» and the padding tightens; «پیام در واتساپ» / «پیام در تلگرام» stay as each button's `aria-label`.
  - A container query on `.channels` makes the switch follow each pair's own width. Full labels appear from 400px
    in About and from about 434px in the closing band and the menu, whose pairs are narrower.
  - Checked at 320, 360, 375, 390, 400, 414, 430, 480, 600, 768 and 1440, and at the edges (399–401, 431–440). With
    Vazirmatn, the Tahoma fallback and Noto Naskh alike, every pair is side by side and equal in width, each label
    on one line, nothing clipped.
- **Tonal buttons on light surfaces have a 1px `--color-border-hover` edge.** It is a new token,
  `--color-tonal-border`, transparent on forest. It covers every tonal button (the nav «شروع پروژه», every
  channels pair). Hover keeps its own fill, and the edge stays. DESIGN.md's tonal spec and token lists follow.
- **WhatsApp and Telegram use the brands' marks from Simple Icons v16.33.0 (CC0 1.0).** They are monochrome in
  `currentColor`, inset in their box to sit at the Lucide icons' optical size: WhatsApp by 2 units, the solid
  Telegram disc by 2.5. The sprite comment records the source and licence; Lucide's chat bubble and paper plane
  are gone.

## HE4 + FC3: the deck lines

The static hero's statement and the closing band's echo drew their keyboard deck 8% / 6% past the screen, which
widened the page on phones and tablets (801px of scroll at 768, 392 at 390). Both now use one rule, `.deck-line`:
`inset-inline: max(var(--deck-reach), (100% − 100vw) / 2 + 8px)`, so a deck never comes within 8px of the viewport's
edge. There is no sideways scroll at any width, with or without motion. At 1440 both decks keep their width (881
and 851px).

## A7 + A8: targets and the placeholder label

- **Hit areas (transparent pseudo-elements, so nothing drawn changes).** The wordmark (nav and footer), «مطمئن
  نیستید؟…» and the 36px pause toggle take 44px targets, checked at 390 by hit-testing 21px from each centre. The
  Work dots are 24 × 44px targets (see Work).
- **«عکس» on the placeholder photos** is `--color-text-secondary` now: 5.97:1 on the sunken fill, where muted was
  4.36.

## Work

- **Decision 1:** ±1 is fully opaque, set back by its dim layer alone (.45); only ±2 fades (.3), and ±3 is out. No
  card shows another through it.
- **PW2 (reduced motion and forced colours):** its own staging, `LAYOUT.flat`: the centre card alone, the others
  invisible and inert. A slide change is a 250ms crossfade in place: the outgoing card fades where it is and moves
  off once invisible, and the next one is in place at once. Traced on a step: the outgoing card stayed at 420px
  while fading 1 → 0, then moved.
- **Decision 3:** the narrow layout (86vw card, peeking side cards) runs up to 989px.
  - The card is held down on short screens, to at most `(100svh − 240px)` × the card ratio but never under 42vw.
  - The stage grows to the card + 64px (at least 300).
  - Results: 768×1024 has a 660×413 card (was 323×202), 900×700 736×460, and phones keep 335×210 on a 300px stage.
- **Decision 2:** from 1024px, a card whose three texts fit its panel without scrolling shows them as rows (the
  no-JS list's `.work-facts`: «نیاز کسب‌وکار», «راهکار ما», «نتیجه», each a label over its text) instead of the
  tabs. Each card is checked on every measure; on the turn, focus goes to the back's ×.

  | Space needed / available in the panel | Mery | Karamad | E2 |
  |---|---|---|---|
  | 1280×800 (card 538×336) | 214 / 170 | 225 / 192 | 198 / 192 |
  | 1440 and 1920 (card 600×375) | 207 / 182 | 204 / 204 | 204 / 204 |

  - **At 1280×800 none of the three fits,** so all keep the tabs there (the decided fallback).
  - **At 1440 and wider,** Karamad and E2 show rows. Mery keeps the tabs, because its two-line title leaves it
    25px short.
- **Dots (A7 + A10):** each dot is a 24 × 44px target at the same 24px pitch, since 44px-wide targets would push the
  dots apart.
  - The pill is two 8px caps and a bar. Active, the caps move 10px apart and the bar opens between them, and the
    neighbours step 10px aside by translate; nothing animates width.
  - Pixel-compared with batch 3 for each active dot: the same drawing (antialiasing aside).
- **PW5:** the carousel is a `role="region"`, and the dots are named «رفتن به پروژه‌ی {name}». The caption's name
  keeps to one line, with the full name in `title`.
- **A12:** the backdrop's second ambient `<img>` is made by work.js, so none stands in the markup without a `src`.

## FAQ

- **FC2:** opening an item used to carry the tapped question up the screen as the open one above collapsed: q2 by
  106px at 390, q7 by 78px at 1440. home.js now scrolls along with the collapse, so the tapped question moves 0px
  in both cases. Questions take `--color-tonal-text` on hover.
- **No JS:** every answer is open, the +/− markers are hidden and the pointer cursor is gone.
- **A10:** the space under an answer is a block inside the collapsing row, so only the grid row animates. Open
  answers are the same height as before; closed ones are 0.

## A9, A11, A13

- **A9:** the engine puts `.in-view` on each tracked element near the viewport (Work's own observer does the same),
  and every `will-change` sits under it. Elements holding one at 1440, before → after: 51 → 26 at the top, 28 → 13
  at Process, 28 → 1 at the FAQ.
- **A11:** `src/utils/portfolio.js` fetches `portfolio.json` once for the project count, Work and the wall of
  work: 3 requests → 1.
- **A13:** the four `.dc.html` prototypes, `support.js` and `image-slot.js` are deleted, with nothing in the site
  referring to them. PRODUCT.md, both READMEs and NEXT_SESSION.md no longer point at them.

## Checks

A sweep at 320, 390, 768, 1024 and 1440 under motion, reduced motion, forced colours and no JS, scrolled from top to
bottom. All 20 combinations were clean:
- no sideways scroll (the no-JS page at 390 used to scroll 2px);
- no console errors or warnings;
- every section present;
- the Work carousel built with JS, and the static list without it.

## Load (Slow 4G + 4× CPU on phone and tablet; Slow 4G alone on desktop)

Before is `dfdebeb` (batch 3's record), after is `6717f9b`. The network is Slow 4G: 562.5 ms request latency
(about 150 ms RTT), 1.44 Mb/s down, 675 kb/s up. Both are served by a keep-alive server with `Cache-Control:
no-cache`, and the runs alternate before/after, five each. Medians, in ms:

| | Phone 390 (4× CPU) | Tablet 768 (4× CPU) | Desktop 1440 |
|---|---|---|---|
| FCP | 2958 → 2862 | 3214 → 3040 | 2196 → 2224 |
| LCP | 3028 → 2862 | 3214 → 3086 | 2196 → 2224 |
| DCL | 6258 → 6211 | 6325 → 6157 | 4997 → 5149 |
| CLS | 0.0006 → 0.0006 | 0.0014 → 0.0014 | 0.0053 → 0.0462 |
| LCP element | H1 | stacked screenshot | H1 |

- **Phone and tablet** are the same or a little faster (within run-to-run noise); CLS is unchanged.
- **Desktop CLS is bimodal in both versions, and under the 0.1 target in every run.** Per run, before: 0.0053,
  0.0053, 0.048, 0.0053, 0.0466; after: 0.0468, 0.0462, 0.0462, 0.0467, 0.0053. The medians differ only in how
  many runs fall on each side.
  - **Where it comes from:** at 1440 the H1 fits three lines at 76 px in the fallback font, and Vazirmatn 800 needs
    72 px. When the 800 face lands after first paint (about 3.6 s in), Chrome records the H1 in Vazirmatn at 76 px,
    in four lines (283 → 365 px tall, about 0.025), then the re-fit to 72 px (365 → 269, about 0.021).
  - **Tried and dropped:** re-fitting from a ResizeObserver on a hidden Vazirmatn probe. It re-fits 2–3 ms after
    the swap, but Chrome still records both shifts, so the score did not move; the `document.fonts` hook stays.
    Batch 2's record said no frame was drawn with the old fit; that sentence is corrected there.
  - Batch 4 did not change the fonts. Batch 2 already tried calibrating the bold fallback on the H1 alone, and it
    was no better across 75 viewports, so this stays a known item under the target (see For the owner).

## For the owner

- **Dots at 44px wide:** not possible at the dots' 24px pitch without spreading them apart. They are 24 × 44
  targets (AA's 24px minimum and 44px tall).
- **The rows back** shows today only at 1440+ for Karamad and E2. Rows for every card at 1280×800 would need
  smaller text than DESIGN.md's body-sm at 1.8.
- **Landscape phones (up to 989px wide) now use the narrow Work layout** too (decision 3). Their card keeps its
  size, held by the short screen.
- **Desktop font-swap shift (about 0.046 when Vazirmatn 800 lands after first paint):** known and under 0.1; it
  was there before batch 4 (batch 2 measured 0.047 under Slow 4G). No `size-adjust` avoids it without new line-break
  mismatches elsewhere. What is left changes how fonts load (for example, preloading the 800 face on wide screens
  only, not measured yet), so it waits for your call.
- **The carousel's `aria-roledescription` is still the English "carousel".** A Persian one would be new
  (spoken-only) copy, so it is left as it was.

## Screenshots

All in `docs/impeccable/shots/` (gitignored, kept on disk).

- **Before / after pairs** (`b4-before-*` / `b4-after-*`):
  - `work-390`, `work-768`, `work-1440`: motion (decisions 1 and 3; the new dots).
  - `work-390-rm`, `work-1440-rm`: reduced motion, the centre card alone (PW2).
  - `hero-deck-390-rm`, `hero-deck-768-rm`: the static hero's deck, scrolled as far sideways as the page allows
    (HE4).
  - `closing-390`: the closing band's deck (FC3).
  - `faq-390`: q2 tapped while q1 was open (FC2): the question moved 106px before, 0 after.
  - `about-390`: the placeholder's «عکس» label (A8).
- **After only:**
  - `b4-decisions-{320,390,768}-{menu,about,contact}`, `b4-decisions-1440-{about,contact}`: the channel pairs with
    short and full labels, the brands' marks and the tonal edge.
  - `b4-work-back-1280`: the tabs back (nothing fits as rows at 1280×800).
  - `b4-work-back-1440`, `b4-work-back-rows-1440`: Mery's tabs back and Karamad's rows back.
  - `b4-work-{390,768,900,1440}-motion`, `b4-work-{390,1440}-rm`: Work as first captured during the batch.
