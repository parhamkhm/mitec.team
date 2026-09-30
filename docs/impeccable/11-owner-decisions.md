# Impeccable pass — owner decisions on 10-summary.md

Recorded from `docs/prompts/IMPECCABLE_DECISIONS.md` (2026-09-27). It decides every open question in the summary. Then run Phase 2 in the batches below.

**Change log**
- 2026-09-27, Phone nav: the menu toggle moves to the left edge of the phone/tablet bar, and the menu panel opens from that side (the owner's wording, as saved in the prompt file). Applied in batch 3, together with HE1, MO1 and A3.

The session rules from `IMPECCABLE_PASS.md` §A still apply:
- DESIGN.md wins unless a line below changes it;
- one batch = one or more commits, each with a clear message;
- before/after screenshots at 1440 and 390 (plus 768 where the finding is about tablets);
- **stop after each batch** and report which IDs are closed.

---

## 1. Decisions

### DESIGN.md conflicts

| Ref | Decision |
|---|---|
| **HE3** (02) | **Accepted.** In the stacked layout only, the lit screen shows one real portfolio screenshot at rest (first project's `src960`, `object-position: right top`) and fades out with the copy. Add the line to §5. |
| **Work 1** (03): side-card opacity | **Accepted.** ±1 at opacity 1, with recession done by the dim layer only. Opacity fades only at ±2 and ±3. No card may show another through it. |
| **Work 2** (03): back tabs | **Accepted.** From 1024px the back face shows need / solution / result as three stacked rows (the `.work-facts` pattern), if they fit the card without scrolling at 1280×800. If any project's text does not fit, keep the tabs for that card as the fallback. Below 1024 the bottom sheet keeps its current layout. |
| **Work 3** (03): card width at 768 | **Accepted.** The narrow layout (86vw) extends up to the sheet breakpoint (989px). |
| **Work 4** (03): clones | **Rejected.** The infinite loop with clones is a deliberate owner decision; more projects are being added. Keep it as is. |
| **Services** (04): chip vs illustration, illustration presence, asymmetric layout | **Rejected, all three.** Keep §5. MO4 (phone length) is handled by `distill` inside the existing card design. |
| **Pricing** (07): free add-on price line | **Changed.** A free add-on shows «بدون هزینه‌ی اضافه» in the price slot (muted). Update §5 Forms. |
| **Pricing** (07): PC2 breakdown | **Accepted.** Add a collapsed disclosure to the summary card and amend the §5 recipe. |
| **FAQ** (08): markers without JS | **Accepted.** Without JS, hide the +/− markers and the pointer cursor, and show all answers open. |
| **Mobile** (09): `--section-pad` | **Accepted.** `clamp(64px, 11vw, 176px)` (the phone floor becomes 64px). Recheck that sections still breathe at 390. |
| **Process PR3** (05) | Bring the build **within** the two-line rule; do not extend the exemption. Keep the stacked rail up to about 1200px, widen the measure above that, and set `.process-step { height: 100% }`. If a paragraph still runs over two lines at 1280 or wider, list it as a copy flag (do not rewrite it). |

### Frozen feature: Process spotlight (PR2)

**Accepted with a change: keep it scroll-driven.** The owner likes that the rail fills as you scroll, so do not turn it into a timed entrance.
- From 1024px, remap the progress range: the fill starts only when the whole row is in view, and completes (step 5 lit, end state) by the time the row's top reaches about 25% of the viewport.
- Arriving from the nav link or a `#process` hash shows the end state directly.
- No seam may cut through a paragraph at rest: a spotlight hand-over is either complete or not started.
- Stacked layouts keep the current behaviour.

PR1 (the contrast collapse during hand-over) is fixed in the same batch.

### The direct-message hierarchy (FC1, then reused)

Decided once and reused in the closing band (FC1), the phone menu (MO1), About (AB2), the Services «بپرسید» target (SV2), the footer (FC4) and the calculator's error state.

| Tier | Element |
|---|---|
| **1** | «شروع پروژه»: the one primary button. |
| **2** | «پیام در واتساپ» and «پیام در تلگرام»: **tonal** buttons with their icons, side by side. Same size as each other and smaller than the primary. |
| **3** | «پیگیری سفارش» and Instagram: plain text links. |

- SV2: «بپرسید» scrolls to the closing band's channels, not to the FAQ.
- AB2: About gets one tier-2 pair under the cards, with the line «مستقیم با خود تیم حرف بزنید».
- FC4: the footer gets the three channels as small icon + text links, and drops its repeated CTAs.

### Phone nav (HE1, MO1, A3)

- **Toggle position (owner request):** on phones and tablets, the menu toggle moves to the **left edge** of the bar (the end side in RTL).
  - Bar order, right to left: logo at the right edge → flexible space → tonal «شروع پروژه» → menu toggle at the left edge.
  - The open menu panel anchors to the toggle's side: it opens from the left/top-left, and its enter/exit motion comes from that side.
  - Keep the 44px hit area and the gutter. Check at 320, 360, 390 and 768 that the logo, CTA and toggle never overlap or wrap.
- The phone bar shows a persistent small **tonal** «شروع پروژه» next to the menu toggle. It is tonal, so the one-primary rule holds.
- The open menu ends with the tier-2 pair (WhatsApp, Telegram).
- A3:
  - toggle label «بستن فهرست» when open;
  - focus is contained in the menu;
  - background `inert`;
  - Esc closes and returns focus to the toggle.
- After this, recheck PW1. If a «شروع پروژه» is now always reachable on phones, close PW1 without adding another button.

### Copy

- **Approved new strings:**
  - A3: «بستن فهرست»;
  - PC2 disclosure: «جزئیات برآورد»;
  - PC3 per-page line: «هر صفحه‌ی بیشتر: از {price}»;
  - the free add-on string above;
  - the About line above;
  - the channel labels above.
- **All other copy flags** (jargon such as CRM / SSL / لندینگ / زیرساخت, generic headings, repeated eyebrows, the FAQ additions, the reply-time line) are **not changed now**. Collect them, verbatim with their section and the report ID, into `docs/copy-todo.md` under a new heading «از Impeccable». The owner will run a separate copy pass.

### Assets

- **PW4** (phone and panel captures) and **AB4's real photos:** parked until the owner supplies them.
- **AB4's photo rule:** implement it now so the photos drop in later. Use a fixed aspect ratio with `object-fit: cover`, and lay out an odd member count without an orphan.

### A13

**Delete** the old `.dc.html` prototypes and `support.js` / `image-slot.js` (they are broken since `_ds` was removed, and git history keeps them).

---

## 2. Phase 2 batches (in this order, stop after each)

1. **Reliability (A2 + HE2).**
   - Self-host Vazirmatn (woff2; arabic + latin subsets; 400/500/700/800; `font-display: swap`; preload the one or two weights used above the fold) with a metric-matched fallback (`size-adjust` etc.) so the swap does not shift text.
   - Self-host the 21 icons, as an inline SVG sprite or local files.
   - Result: no request leaves the origin. Verify with the network log, and with all external hosts blocked.
2. **Hero first frame (A1 + A5 + A6 + HE3).**
   - `modulepreload` for the module graph;
   - replace the `@import` chain with `<link>`s;
   - make the pre-JS CSS layout equal the measured layout, including the stacked phone layout with HE3's screenshot.
   - Target CLS < 0.1 on desktop and on a 4× throttled phone. Report before/after CLS, LCP and DCL.
3. **Phone nav + direct-message path** (HE1, MO1, A3 and the toggle moving to the left edge with the menu opening from that side; then FC1, AB2, SV2, FC4; then recheck PW1).
4. **Harden sweep:**
   - HE4 + FC3 (one clamp pattern for the deck pseudo-elements);
   - A7 (44px hit areas without changing the visuals);
   - A8;
   - the Work group: PW2, PW5, A10, A12, plus Work decisions 1–3;
   - FC2 + the FAQ no-JS decision;
   - A9, A11, A13.
5. **Calculator (PC1–PC5 + the free add-on string).** PC1 + PC3 as one `selectType` change; PC4 (tabs visible on phone/tablet: wrap or a compact select, no hidden options).
6. **Layout / adapt:**
   - Process: PR1, PR2 (as decided), PR3, PR4;
   - About: AB3, AB4 (rule only);
   - Services: SV1 + MO4 + A4 (the whole card is the link, a tighter card on phones, correct `sizes`);
   - `--section-pad`.
7. **Typeset** (whole page, overlap group 6): HE5, PW3, SV3, AB1, MO3, PR5, the Process subheading widow and the CTA heading split. Persian letter-spacing stays 0.

Then Phase 3 as planned: `polish` → re-`audit` (score comparison table against 01) → `document` (merge these decisions into DESIGN.md; show the diff first).
