# Impeccable re-audit — home page (`project/index.html`)

Phase 3, step 2 of `docs/prompts/IMPECCABLE_PASS.md`: the technical audit of `01-audit-home.md` again, after
Phase 2 (batches 1–7) and the polish. Same dimensions, same widths, same checks. **Nothing was changed.**

- Branch `design/impeccable-pass` at `8ff0ca9`, served with `python devserver.py 4173`. For the load comparison, the
  01 build (`1a521d9`) and this one were served side by side from `git archive` copies on a keep-alive server, plain
  and gzipped.
- Viewports as in 01: 1440×900, 1280×800, 768×1024 (touch) and 390×844 (touch, DPR 2); spot checks at 320×640,
  800×347, 844×390 and 1920×1080.
- Tools: the Impeccable detector, run once by hand on the source and on the live page at the four main widths (the
  hook stays off, as decided); Playwright (Chromium) scripts; screenshots for visual confirmation.
- Checks: all of 01's, and four more:
  - contrast measured under the glyphs themselves (each text run shot with and without its text);
  - focus hidden behind fixed or sticky layers (the nav, the calculator bar);
  - WCAG 1.4.12 text spacing;
  - image resolution against the pixels each image covers.
- Load: Chrome's Slow 4G preset (562.5ms latency, 1.44Mb/s down, 675kb/s up), 4× CPU on the phone, medians of
  interleaved runs (9 on the phone, 5 on desktop).

Not raised again: C1–C8 (accepted in 01), A14 (closed with C7), the float cards (illustration), and the product state
PRODUCT.md documents (`/order` and `/track` not built; placeholder contacts, prices and photos).

---

## Scores against 01

| # | Dimension | 01 | Now | Change | Why |
|---|---|---|---|---|---|
| 1 | Accessibility | 3 | 3 | = | 01's gaps are closed: the menu holds focus and its label changes, the placeholder label meets AA, all targets are 44px. Still 3 because of R1, a WCAG 2.2 AA failure (a focused tab hidden under the calculator bar), and R2 (forced colours). With R1 fixed it would be 4. |
| 2 | Performance | 2 | 3 | +1 | The layout no longer jumps (phone CLS 1.075 → 0.0006, desktop 0.220 → 0.002), no request leaves the site, fewer requests, lighter on phones, compositor layers only where needed, one data fetch. Not 4: the slow phone's first paint is no earlier than 01's (see [Load](#load-the-01-build-against-this-one)), and the Services art is still 2–3× the pixels it needs (R3, R4). |
| 3 | Responsive Design | 3 | 4 | +1 | No sideways scroll at any width or mode, every target at least 44px except the Work dots (24 × 44, accepted), nothing covered before JS runs, text spacing passes. |
| 4 | Theming | 4 | 4 | = | Semantic tokens only, no raw colours; the one primitive is C8. The forced-colours gaps are counted under Accessibility (R2). |
| 5 | Implementation Integrity | 3 | 3 | = | The old files are gone (A13) and every detector finding is deliberate or a false positive. Still 3 because DESIGN.md lags the build: the closing band's glow it describes isn't built (FC5), and this pass's decisions aren't all in it yet. The held `document` step closes both; then 4. |
| | **Total** | **15/20** | **17/20** | **+2** | **Good**, one band below Excellent (18–20). R1 alone is worth the point. |

## Audit Health Score

| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 3 | R1: at 390 with reduced motion, Tab into the calculator puts the focused site type under the pinned bar |
| 2 | Performance | 3 | Slow-phone first paint about where 01's was (+0.16s gzipped); one 634ms task before it |
| 3 | Responsive Design | 4 | -- |
| 4 | Theming | 4 | -- |
| 5 | Implementation Integrity | 3 | DESIGN.md drift: FC5's glow, and this pass's decisions still to merge |
| **Total** | | **17/20** | **Good** |

## Implementation Integrity Verdict

**Pass.** The page is one deliberate system. Colours come only from DESIGN.md's semantic tokens (the exceptions are mask
alphas and C8's primitive); forest areas remap through `data-surface="dark"`; all motion runs through the engine under
`html.motion`, which is set only with JS, without reduced motion and without forced colours; the Persian details
(Persian digits, word ties, balanced headings, letter-spacing 0) hold across the page. No request leaves the site.

The detector's findings are all known: the DESIGN.md decisions C1–C5 and C7, the Services chips the owner kept, and
the same false positives as 01. See [Detector findings](#detector-findings-verified). The integrity issue left is
documentation drift, not code.

## Executive Summary

- **Audit Health Score: 17/20 (Good),** up from 15/20.
- **All 13 open findings from 01 are closed,** with measurements below. Of the 50 Phase 1 findings, only three P3s
  that no batch took up (SV4, AB5, FC5) and the parked PW4 are open.
- **New findings: 5.** 0 P0, 1 P1, 1 P2, 3 P3.
  1. **[P1] R1:** the focused site-type tab is hidden under the calculator bar (390, reduced motion). One missing
     `scroll-margin`.
  2. **[P2] R2:** forced colours lose three things: which site type is selected, the page slider's track, and the dots
     and descenders of the closing heading's first line. They were already there in 01's build; 01 missed them.
  3. **[P3] R3:** the smallest Services art file is 768px wide; the art needs 280–350px.
  4. **[P3] R4:** on a 4× slowed phone, first paint waits on one 634ms task, and the HTML is half again as large.
     Production needs compression.
  5. **[P3] R5:** without JS, the FAQ's «برآورد سریع» link (added in the polish) is a Tab stop that leads to the
     hidden calculator.
- **Next:** `harden` for R1, R2 and R5 (small CSS and markup changes), `optimize` for R3 and R4, then the held
  `document` step, which also settles FC5.

---

## 01's findings now

| ID | Sev. | Finding in 01 | Now | Evidence |
|---|---|---|---|---|
| A1 | P1 | Hero jumps after first paint | **Closed** (batch 2) | CLS under Slow 4G: phone 1.075 → 0.0006, desktop 0.220 → 0.002. Nothing covers the phone's buttons before JS. |
| A2 | P1 | Font from Google Fonts; a hanging request blanks the page | **Closed** (batch 1) | Self-hosted. With the font files hanging, first paint at 168ms in the metric-matched fallback, CLS 0 (01: blank for the 20s it hung). No third-party host at any width. |
| A3 | P2 | Open menu leaks focus; label doesn't change | **Closed** (batch 3) | «باز کردن فهرست» → «بستن فهرست»; 14 Tabs stay in the menu and toggle; 12 background regions `inert`; Escape closes and returns focus to the toggle. |
| A4 | P2 | Services art at double size on phones | **Closed** (batch 6) | `sizes` matches the box. Phone images after a full scroll: 899 → 405KB. What is left is R3. |
| A5 | P2 | Serialised module loading | **Closed** (batch 2) | The module graph is fetched in parallel right after first paint, so it no longer holds it up. DCL itself is not earlier; see Load. |
| A6 | P2 | CSS `@import` chain | **Closed** (batch 2) | Five linked stylesheets load in parallel (eight, three of them chained, before). |
| A7 | P2 | Touch targets under 44px | **Closed** (batch 4) | Probed hit areas at 320, 390, 768 and 844×390: all at least 44 × 44 except the Work dots, 24 × 44 by owner decision. |
| A8 | P2 | Placeholder «عکس» at 4.36:1 | **Closed** (batches 4, 6) | Meets AA, and `aria-hidden`. |
| A9 | P3 | Permanent `will-change` | **Closed** (batch 4) | Elements holding it, top / mid-page / end: 51 / 28 / 28 → 26 / 0 / 1 on desktop (the hero's, while it runs). |
| A10 | P3 | Layout-property transitions | **Closed** (batch 4) | The detector finds none (2 in 01). |
| A11 | P3 | `portfolio.json` fetched 3× | **Closed** (batch 4) | Once. |
| A12 | P3 | `<img>` without `src` | **Closed** (batch 4) | No `broken-image` finding. |
| A13 | P3 | Retired files still served | **Closed** (01 triage, batch 4) | `_ds` and the prototypes removed. |
| A14 | P3 | Display leading | Closed with C7 | — |

The critiques' findings (02–09) are closed in batches 1–7 except **SV4** (identical «شروع پروژه» link names in Services),
**AB5** (About's converge motion ends before the title is in view) and **FC5** (DESIGN.md's closing-band glow isn't
built), which no batch took up, and **PW4** (phone and panel captures), parked for assets.

---

## New findings

### P1 Major

#### R1 · [P1] At 390 with reduced motion, a focused site-type tab is hidden under the calculator bar
- **Location:** `project/src/styles/home.css:1489`. The rule that keeps focused calculator controls clear of the bar
  lists `.scope-unsure, .scope-range, .scope-addon, .scope-base__more, .scope-addons__more`, but not the site-type
  radios (`.scope-tab input`).
- **Category:** Accessibility.
- **Evidence:** Tab from About into the calculator. The browser scrolls the checked radio just into view at the bottom
  edge, where the bar is pinned:
  - 390×844, reduced motion: the tab at 797–842px, the bar at 793–867px, **none** of five probe points visible;
  - 430×932, reduced motion: one of five visible;
  - 768×1024: the bar clips the tab's bottom edge (four of five visible);
  - with motion on, and at 360, the tab lands clear of the bar.
  - Screenshot: `ra-390-reduce-tab-under-bar`.
- **Impact:** A keyboard user (a phone or tablet with a keyboard, or switch access) lands on the calculator's first
  control and can't see it, or which site type the arrow keys are changing.
- **Standard:** WCAG 2.2 2.4.11 Focus Not Obscured (Minimum), AA, fails at 390. 2.4.12 (AAA) at 430 and 768.
- **Recommendation:** Add `.scope-tab input` to that rule (bottom margin `var(--scope-bar-h) + 16px`). The input fills
  its tab, so the tab scrolls clear.
- **Suggested command:** `/impeccable harden`

### P2 Minor

#### R2 · [P2] Forced colours lose the selected site type, the slider's track and part of the closing heading
- **Location:** `home.css:1102` (the checked tab is a fill and a shadow); `home.css:1296` (the slider's track and fill
  are backgrounds); `home.css:1608` (`.cta-band h2 > span { display: inline-block }`).
- **Category:** Accessibility.
- **Evidence** (Chromium, forced colours; the same in 01's build, which 01 did not examine):
  - **Site types:** forced colours drop fills and shadows, so every tab reads as plain text and nothing shows which is
    selected (`ra-forced-1440-scope`, `ra-forced-390-scope`).
  - **Pages slider:** only the thumb is drawn, on no track.
  - **Closing heading:** forced colours paint a backplate behind each run of text. Each word is its own
    `inline-block` (for the word-by-word reveal), so the second line's backplates cover the first line's
    descenders at the 1.08 display leading. «مسیر دیجیتال کسب‌وکارتان» loses its dots below the line and the tails
    of «ر» at 1440; at 390 the first two lines do (`ra-forced-1440-cta-heading`, `ra-forced-390-cta-heading`;
    `…-01build` for 01's build).
  - The hero statement (leading 1.5) and every other heading are intact.
- **Impact:** Windows contrast-theme users can't tell which site type the estimate is for, can't see the slider's
  range, and read a damaged heading at the page's close.
- **Standard:** Not a WCAG failure as such; forced-colours support, which 01 counted as a strength.
- **Recommendation:** In one `@media (forced-colors: active)` block:
  - a 2px `Highlight` outline or border on the checked tab;
  - the track and fill drawn with `CanvasText` / `Highlight` borders;
  - the heading's words `display: inline` (the reveal doesn't run in forced colours anyway).
- **Suggested command:** `/impeccable harden`

### P3 Polish

- **R3 · [P3] The smallest Services art file is twice what it needs** (Performance).
  - **Location:** the six `.service-card__art` images: `srcset` offers 768w and 1536w only.
  - **Evidence:** the art box is 278px at 1440 (DPR 1) and 350 device pixels at 390 (DPR 2), so the 768w file is
    2.8× and 2.2× the pixels shown. The six files are about 50KB each.
  - **Recommendation:** add a ~400w variant to each `srcset` (about 300KB → 120KB on a phone, estimated).
  - **Command:** `/impeccable optimize`
- **R4 · [P3] The slow phone's first paint waits on one long task, and the HTML has grown** (Performance).
  - **Evidence:**
    - On a 4× slowed phone, the CSS is in at about 1.55s, then one **634ms** main-thread task (the first style and
      layout, and the hero's inline fit) runs before first paint. In 01's build, first paint waited on the
      `@import` chain instead.
    - `index.html` is 42 → 64KB uncompressed (the inline icon sprite, the first-frame layout script, the word
      ties); 9.6 → 16.6KB gzipped.
    - Net effect in the table below: first paint +0.5s uncompressed, +0.16s gzipped (within the ±0.15–0.2s
      run-to-run noise).
  - **Recommendation:**
    - Make sure production compresses HTML, CSS and JS (gzip or brotli): `home.css` alone is 82 → 20KB. This is
      the host's configuration (the back end's, if it serves the site), not a front-end change.
    - Then measure whether `content-visibility: auto` on the sections below the fold shortens that first task,
      checking CLS and anchor jumps.
  - **Command:** `/impeccable optimize`
- **R5 · [P3] Without JS, the FAQ's «برآورد سریع» link is a Tab stop to a hidden section** (Accessibility).
  - **Location:** `index.html`, the first FAQ answer. The link came with the polish; `html:not(.js)` makes it look
    like text and take no pointer, but CSS can't take it out of the tab order.
  - **Evidence:** with JS off it is Tab stop 22 at 1440; Enter sets `#scope`, which is `display: none`, and nothing
    moves.
  - **Recommendation:** keep plain text in the markup and let `home.js` wrap it in the link.
  - **Command:** `/impeccable harden`

### Still open from Phase 1 (P3, not new)

- **SV4:** the four Services links are all named «شروع پروژه» (six links of that name at 1440); a screen reader's
  link list doesn't say which service. Services, Process, About, FAQ and the closing band have no accessible name (Work has one).
  `/impeccable harden`
- **AB5:** About's converge motion happens mostly before the title is in view. `/impeccable animate`
- **FC5:** DESIGN.md's closing band has "grid texture + one mint glow"; the build has the texture and no glow. The
  `faq.json` half of FC5 is now documented (DESIGN.md §9: the FAQ is markup). `/impeccable document`

---

## Load: the 01 build against this one

Slow 4G, keep-alive server, alternating runs, medians in ms. The phone is 390×844 at DPR 2 with a 4× slower CPU.

| | Phone, plain (9 runs) | Phone, gzipped (9 runs) | Desktop 1440, plain (5 runs) |
|---|---|---|---|
| FCP | 2544 → 3052 | 2296 → 2460 | 2196 → 2264 |
| LCP | 2544 → 3052 | 2296 → 2472 | 2196 → 2264 |
| DCL | 6089 → 6551 | 5651 → 5758 | 4652 → 5205 |
| **CLS** | **1.0751 → 0.0006** | **1.0751 → 0.0006** | **0.2202 → 0.0021** |

- The LCP element is the H1 in every run. Gzipped, the phone's LCP (2.47s) is inside Google's "good" band (2.5s).
- "Plain" is the upper bound (the dev server doesn't compress). A production host would sit near the gzipped column.

After a full scroll (every lazy image loaded), same script, uncompressed:

| | Desktop 1440: 01 → now | Phone 390: 01 → now |
|---|---|---|
| Requests | 61 → 42 | 56 → 41 |
| Third-party hosts | 3 → **0** | 3 → **0** |
| Images | 409KB in 31 files → 405KB in 12 | 899KB in 28 → **405KB** in 12 |
| JS | 111KB in 15 → 121KB in 17 | the same |
| CSS | 121KB in 8 → 146KB in 5 | the same |
| Fonts | from Google (not measurable) → 137KB in 4, self-hosted | the same |
| `portfolio.json` fetches | 3 → 1 | 2 → 1 |

The 21 icons that were image requests to jsdelivr are an inline sprite now, hence the drop in image files.

---

## Detector findings (verified)

Counts per scan (source, then the live page at each width):

| Rule | Source | 1440 | 1280 | 768 | 390 | Verdict | In 01 |
|---|---|---|---|---|---|---|---|
| `low-contrast` | – | 7 | 7 | 3 | 7 | **False positive.** Work's card backs behind their hidden back faces (the canvas check sees the screenshot under text you can't see), and, at 768/390, the stacked hero's light text "on" the stage colour while it sits on the forest wall. The glyph-level check found no text below AA. | yes (13) |
| `body-text-viewport-edge` | – | – | – | 22 | 16 | **False positive.** Paragraphs on the back faces of off-screen, clipped Work slides. | yes (16) |
| `cramped-padding` | 4 | 1 | 1 | 1 | – | **False positive.** The source scan can't see CSS. The URL finding is an FAQ row, whose bottom border is a list divider, not a box edge. | yes (31, source) |
| `icon-tile-stack` | 6 | 6 | 6 | 6 | – | **Deliberate.** The Services chip above each title is DESIGN.md §5's card; the owner kept it (11, Services). | new rule |
| `clipped-overflow-container` | 1 | 1 | 1 | 1 | 1 | **Intentional.** The coverflow clips its side slides; the keyboard walk finds nothing hidden. | yes |
| `buried-raster` | – | 1 | 1 | 1 | 1 | **Intentional.** Work's backdrop cross-fade buffer. | yes |
| `tight-leading` | 1 | – | – | – | – | **C7.** | yes |
| `hero-eyebrow-chip` | 1 | 1 | 1 | – | – | **C1.** | yes |
| `ai-color-palette` | – | 3 | 3 | 3 | 3 | **C2.** | yes |
| `dark-glow`, `radial-spotlight-glow` | 3 | 11 | 11 | 11 | 11 | **C3.** | yes |
| `codex-grid-background` | 2 | 1 | 1 | 1 | 1 | **C4.** | yes |
| `gpt-thin-border-wide-shadow` (advisory) | 20 | 30 | 30 | 27 | 27 | **C5.** | yes |
| `layout-transition` | – | – | – | – | – | Gone (A10). | 2 |
| `broken-image` | – | – | – | – | – | Gone (A12). | 1 |

No finding is new in kind except `icon-tile-stack`, which the detector didn't have in 01.

## Patterns & Systemic Issues

- **What the pass fixed was systemic,** and it held: the first frame is the final layout, nothing loads from a third
  party, and motion lives in one place (`html.motion`).
- **Forced colours are the page's least-tested mode.** Every R2 item is a state or shape drawn only with a fill, a
  shadow or a stacked inline box, which that mode removes. The fix is one small block, and a check that belongs in
  every future sweep.
- **Sticky layers need their `scroll-margin` kept in step with the controls.** R1 is one control missing from a list,
  the same mechanism that already protects the others.

## Positive Findings

- **No sideways scroll** at any of the eight sizes, nor in the 20-case sweep (320–1440 × motion, reduced motion, forced
  colours, no JS). No console errors, no failed requests.
- **Contrast, measured under the glyphs:** every text run on screen at rest passes AA at 1440, 1280, 768 and 390,
  motion on, and at 1440 and 390 with reduced motion (about 200 runs per setup). The closest are the dimmed Process
  numerals, 3.45:1 as large text.
- **Keyboard:** 58 stops at 1440, 50 at 768, 49 at 390, in reading order (nav, hero, Work, Services, About, the
  calculator, FAQ, the closing band, footer; Proof and Process have nothing to focus, as designed). Every stop shows
  the focus ring (Services' ring is on the whole card). The Work sheet is a modal `<dialog>` that holds focus and
  returns it on Escape.
- **Screen readers:** one H1 and a clean H2 → H3 outline with and without JS; no unnamed controls, duplicate ids,
  broken references or dead `#` links; `lang="fa" dir="rtl"`; all landmarks.
- **Text spacing (WCAG 1.4.12):** with line-height 1.5, letter .12em, word .16em and paragraphs 2em, nothing clips at
  390 or 1440.
- **Resilience:** fonts hanging → first paint at 168ms in the fallback, CLS 0. `home.js` missing → the complete static
  document, CLS 0, no errors. Pricing failing → the named error state with a way on and the direct-message pair.
- **Images:** at every scroll position sampled (a third of a screen apart, at 1440, 768 and 390), each image in view
  has at least the pixels it covers, apart from Work's pre-blurred backdrops (by design).

## Known and documented (not scored)

- `./order/` and `./track/` return 404, including every «شروع پروژه» (PRODUCT.md: not built yet).
- Placeholder contacts, prices («اعداد نمونه») and team photos.
- The copy flags in `docs/copy-todo.md` («از Impeccable») are for the owner's copy pass.

## Recommended Actions

1. **[P1] `/impeccable harden`:** R1, the site-type tabs added to the calculator's `scroll-margin` rule.
2. **[P2] `/impeccable harden`:** R2, one forced-colours block (selected tab, slider track, the heading's words
   inline).
3. **[P3] `/impeccable harden`:** R5, the FAQ link made by script; SV4, names for the Services links and sections
   (new spoken copy: the owner's call).
4. **[P3] `/impeccable optimize`:** R3, a ~400w Services art variant; R4, compression on the host (the back end's
   configuration, to agree with its owner), then measure `content-visibility` on below-the-fold sections.
5. **[P3] `/impeccable animate`:** AB5.
6. **[P3] `/impeccable document`** (held): merge 11 and batches 1–7 into DESIGN.md, and settle FC5 there.
7. **`/impeccable polish`** after the fixes.

You can ask me to run these one at a time, all at once, or in any order you prefer.

Re-run `/impeccable audit` after fixes to see your score improve.

## Screenshots

All in `docs/impeccable/shots/` (gitignored, kept on disk):
- `ra-390-reduce-tab-under-bar`: R1, the focused tab under the bar;
- `ra-forced-{1440,390}-scope`, `ra-forced-1440-scope-01build`: R2, the tabs and the slider;
- `ra-forced-{1440,390}-cta-heading`, `ra-forced-1440-cta-heading-01build`: R2, the closing heading.
