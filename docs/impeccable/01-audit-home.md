# Impeccable audit — home page (`project/index.html`)

Phase 1, step 2 of `docs/prompts/IMPECCABLE_PASS.md`. A technical audit: accessibility, performance, responsive
behaviour, theming and implementation integrity, measured on the rendered page. **Nothing was changed.**

- Branch `design/impeccable-pass` at `1a521d9`, served with `python devserver.py 4173`.
- Viewports: 1440×900, 1280×800, 768×1024 (touch) and 390×844 (touch, DPR 2). Spot checks at 320×640, 800×347,
  844×390 and 1920×1080.
- Tools: the Impeccable detector (v0.1.5) on the source and on the live URL at all four viewports; Playwright
  (Chromium) scripts for the checks below; the in-app browser for visual confirmation.
- Checks: keyboard walk, accessibility tree, focus rings, contrast (DOM and worst-pixel), touch targets, overflow, reflow
  at 320px, forced colours, reduced motion and no-JS, Core Web Vitals on a slow-4G + 4× CPU phone profile, a blocked
  Google Fonts request, and image sizing.
- **Caveat:** the dev server sends no compression and no cache headers, so byte counts are uncompressed upper bounds.

Per the owner: the hero float cards' figures are confirmed decorative illustration and are not raised here.
Items that PRODUCT.md already documents as unbuilt or placeholder are listed separately, not scored.

## Owner triage (2026-09-27)

- **A1–A8 (all P1 and P2): accepted.** To be fixed in Phase 2. Not fixed yet.
- **C1–C8 (Conflicts with DESIGN.md): accepted by owner.** They are deliberate decisions, stay as they are, and are not
  raised again in later reports.
- **A13: done for `_ds`.** `45a8b79` removed `project/_ds/`, keeping its three live scales in `src/styles/scales/`. The
  four `.dc.html` prototypes (plus `support.js` and `image-slot.js`) are still in `project/` and now render unstyled.
- **A14: closed.** It is the same question as C7, which the owner accepted.
- **A9–A12 (P3):** open, no decision yet.

Later reports refer to these findings by ID.

---

## Audit Health Score

| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 3 | AA mostly met. The open mobile menu lets focus walk out behind it; one placeholder label is at 4.36:1 |
| 2 | Performance | 2 | Hero layout jumps after first paint (CLS 0.22 desktop, 1.08 phone); the font depends on Google Fonts |
| 3 | Responsive Design | 3 | No overflow from 320 to 1920px; some touch targets below 44px; the phone's pre-JS hero covers its buttons |
| 4 | Theming | 4 | Semantic tokens throughout, no raw colours, clean `data-surface` remapping, forced colours handled |
| 5 | Implementation Integrity | 3 | A coherent, product-specific system; old design-system files and prototypes are still served |
| **Total** | | **15/20** | **Good** (address performance first) |

## Implementation Integrity Verdict

**Pass.** The page expresses one deliberate system: DESIGN.md's tokens are the only colours in component CSS, forest
areas all set `data-surface="dark"`, the motion runs through one engine, and the Persian/RTL details (Persian digits,
`aria-valuetext` in Persian, word-level reveals, letter-spacing 0) are consistent.

Most of the detector's primary findings are either deliberate DESIGN.md choices (the grid texture, the mint on forest,
the hero glow, forest-tinted shadows, the hero eyebrow pill) or false positives. The false positives are text on the
hidden back faces of Work's side cards, and the static-HTML padding checks, which cannot see CSS. See
[Detector findings](#detector-findings-verified). The real integrity issue is drift: the retired design system's colour,
gradient, elevation, typography and font files, and the old `.dc.html` prototypes, are still in the served folder.

## Executive Summary

- **Audit Health Score: 15/20 (Good).**
- **Issues:** 0 P0, 2 P1, 6 P2, 6 P3.
- **Top issues:**
  1. **[P1] The hero jumps after first paint.** `portal.js` measures only after the module graph loads, so the first
     painted layout is a CSS stand-in:
     - CLS 0.217 at 1440 and 1.075 on a throttled 390 phone.
     - On the phone, the laptop's lit screen covers «دیدن نمونه‌کارها» (white on white) for about 2.4s before the jump.
  2. **[P1] Vazirmatn comes from Google Fonts through a render-blocking stylesheet.** With the request hanging, as under
     filtering, the page stayed blank for the full 20s the request hung. The audience is in Iran (PRODUCT.md).
  3. **[P2] The open mobile menu doesn't hold focus.** Tab walks out to the hero CTA half hidden under the panel, and the
     toggle still reads «باز کردن فهرست» while open.
  4. **[P2] Services illustrations download at twice the needed size on phones.** The `sizes` value is wrong, which
     wastes about 480KB.
  5. **[P2] Loading is serialised.** 15 unbundled modules without `modulepreload`, and a CSS `@import` chain, push
     DOMContentLoaded to 3.8s on the throttled phone.
- **Next steps:** `optimize` for the two P1s and the loading chain, then `harden` for the menu and fallbacks, then
  `adapt` for the touch targets. Details in [Recommended Actions](#recommended-actions).

---

## Detailed Findings by Severity

### P0 Blocking

None found in the implementation. (The main CTA's destination, `/order`, does not exist yet. That is documented
product state, listed under [Known and documented](#known-and-documented-not-scored).)

### P1 Major

#### A1 · [P1] The hero layout jumps after first paint (CLS 0.22 desktop, 1.08 phone)
- **Location:**
  - The CSS stand-ins for the pre-JS geometry: `project/src/styles/portal.css`, the `.portal` custom properties (lines
    24–37), and the `@media (max-width: 759px)` block that sets `html.motion .portal__frame { transform: translateY(22svh) }`.
  - The first `measure()` in `project/src/scripts/motion/portal.js`.
  - The module entry at `project/index.html:561`.
- **Category:** Performance / Responsive.
- **Evidence (layout-shift attribution, three runs each):**
  - **1440, unthrottled:** first paint at 1.26s, `portal.js` measures at 1.80s. That measure makes one shift of 0.207: the
    H1 refits from 420px to 215px tall and the copy block moves about 100px. The web-font swap adds 0.019.
  - **390, slow 4G + 4× CPU:**
    - First paint 1.48s, font swap 0.074 at 2.87s, DOMContentLoaded 3.82s.
    - The first measure at 3.86s moves the laptop and forest wall from the 22svh stand-in to their measured place: one
      shift of **1.0**.
    - Until then the lit screen sits over the outline button, so «دیدن نمونه‌کارها» is white text on white.
- **Impact:** Visitors see the headline and CTAs jump just as they start to read. On phones the secondary CTA is
  unreadable for the first seconds. Mobile CLS is in Google's "poor" band (above 0.25), which is also a search-ranking
  signal.
- **Standard:** Core Web Vitals (CLS ≤ 0.1). WCAG 1.4.3 for the covered button while it lasts.
- **Recommendation:** Make the first painted state the final one, or keep the laptop out of the way until measured:
  - **Phones:** below 760px, place the pre-JS frame under the copy, or hold the frame at `visibility: hidden` until
    `.portal` carries a measured class. Appearing is not a layout shift.
  - **Desktop:** give the pre-JS H1 the size the fit usually lands on.
  - **Earlier measure:** add `modulepreload` (P2 below).
  - This fixes a load-state bug and leaves the approved choreography alone, so the guardrail allows it.
- **Suggested command:** `/impeccable optimize`

#### A2 · [P1] The font depends on Google Fonts, and a hanging request blanks the page
- **Location:** `project/index.html:17–18`: `preconnect` to `fonts.gstatic.com`, and a render-blocking `<link>` to
  `fonts.googleapis.com/css2?family=Vazirmatn…`. The file's own comment, and `tokens.css:57`, already say to self-host.
- **Category:** Performance (resilience).
- **Evidence (390, Playwright routing):**
  - **Google Fonts refused:** first paint at 220ms in the fallback font.
  - **Request hanging:** FCP and LCP of 20.15s, the whole time the request hung. A real filtered connection can hang
    until the TCP timeout.
  - **Normal:** FCP 0.6–1.3s.
- **Impact:** For visitors in Iran, the whole page can stay blank whenever Google's font service is slow or filtered.
  The sole typeface is also outside the project's control.
- **Standard:** Core Web Vitals (FCP/LCP). The pass's own constraint: no CDNs.
- **Recommendation:**
  - Self-host Vazirmatn as woff2 in `public/fonts/`. Use `@font-face` with `font-display: swap` and preload the two
    weights the first screen uses (800 and 400).
  - Add a metric-adjusted Tahoma fallback (`size-adjust`, `ascent-override`) so the swap stops shifting text. This also
    removes the font part of the CLS above.
  - Adds no dependency and no new font; it only removes a CDN.
- **Suggested command:** `/impeccable optimize`

### P2 Minor

#### A3 · [P2] The open mobile menu doesn't contain focus, and its toggle label doesn't change
- **Location:** `initNav()` in `project/src/scripts/home.js`, and the menu panel in `project/src/styles/home.css:1341–1365`.
- **Category:** Accessibility.
- **Evidence (390):**
  - After the menu's seven items, Tab moves to «شروع پروژه» in the hero, which is half hidden under the still-open panel.
  - `aria-expanded` flips correctly, and Escape closes the menu.
  - The toggle's `aria-label` stays «باز کردن فهرست» ("open the menu") while the menu is open.
- **Impact:** Keyboard and switch users lose track of where focus is. Screen-reader users hear "open menu" on a menu
  that is already open.
- **Standard:** WCAG 2.4.11 Focus Not Obscured (Minimum) passes, since the button stays partly visible. 2.4.12 (AAA)
  fails. ARIA APG disclosure pattern.
- **Recommendation:** Close the menu when focus leaves it (`focusout` outside the menu and toggle) and on an outside
  tap, returning focus to the toggle. Switching the label to «بستن فهرست» is new copy, so the owner must approve it.
- **Suggested command:** `/impeccable harden`

#### A4 · [P2] Services illustrations load at double resolution on phones (≈480KB)
- **Location:** `project/index.html`: the six `.service-card__art` images, with
  `sizes="(min-width: 1024px) 33vw, (min-width: 760px) 50vw, 100vw"`.
- **Category:** Performance.
- **Evidence:**
  - At 390 (DPR 2) the art renders 204px wide (60% of the card) but `sizes` says `100vw`, so the browser picks the
    1536w files: 6 × ~130KB instead of 6 × ~50KB.
  - After a full scroll the phone page weighs 1.21MB against 0.73MB on desktop.
- **Impact:** Slower on the mobile data plans a phone visitor is likely using, for no visual gain.
- **Recommendation:** Make `sizes` match the art's layout box: below 760px about `calc((100vw - 48px) * .6)`, from 760px
  about 75% of a half-width card, from 1024px about 75% of a third-width card.
- **Suggested command:** `/impeccable optimize`

#### A5 · [P2] Serialised module loading (15 files, no `modulepreload`)
- **Location:** `project/index.html:561`. `home.js` → its 7 imports → `scope.js`'s → `api/client.js`'s (`endpoints.js`,
  `mock.js`, `mapper.js`, `app.config.js`).
- **Category:** Performance.
- **Evidence:**
  - 15 JS requests, about 115KB uncompressed, four levels deep (each level waits for the one before).
  - DOMContentLoaded at 1.7s on desktop and 3.8s on the throttled phone.
  - Everything that waits for it arrives late: the hero measure (the CLS above), the calculator and the carousel.
- **Recommendation:** Keep the no-build setup and add `<link rel="modulepreload">` for the modules the first screen
  needs (`motion/engine.js`, `motion/easing.js`, `motion/portal.js`), and optionally for the rest of `home.js`'s
  direct imports.
- **Suggested command:** `/impeccable optimize`

#### A6 · [P2] Render-blocking CSS `@import` chain
- **Location:** `project/src/styles/tokens.css:16–18` `@import`s `spacing.css`, `radii.css` and `motion.css` from `_ds`.
- **Category:** Performance.
- **Evidence:** Three extra render-blocking requests that can only start after `tokens.css` arrives, on top of five
  stylesheets and the Google Fonts CSS.
- **Recommendation:** Reference the three files with `<link>` tags in `<head>`, so they download in parallel, or move
  the three small scales into `tokens.css`.
- **Suggested command:** `/impeccable optimize`

#### A7 · [P2] Touch targets below 44px
- **Location:**
  - Work: `.work-dot` (24×24; the active dot 44×24) and `.work-toggle` (36×36).
  - Calculator: `.scope-unsure` («مطمئن نیستید؟ در سفارش‌ساز کمکتان می‌کنیم», 27px tall).
  - Nav and footer: `.logo` (24px tall).
- **Category:** Responsive / Accessibility.
- **Evidence:** Measured at 390 and 768 with touch emulation. Every other control is at least 44px tall.
- **Impact:** The Work dots and pause button are the controls most often tapped on phones, and they are the smallest.
  Mis-taps jump to the wrong project.
- **Standard:** WCAG 2.5.8 (AA, 24×24) passes; 2.5.5 (AAA, 44×44) and platform guidance do not.
- **Recommendation:** Enlarge the hit areas with padding or a transparent `::before` without changing the visuals.
- **Suggested command:** `/impeccable adapt`

#### A8 · [P2] Placeholder photo label below AA
- **Location:** About, `.img-slot__label` «عکس» in both team cards.
- **Category:** Accessibility.
- **Evidence:** `--color-text-muted` on `--color-surface-sunken` is 4.36:1 at 14px.
- **Impact:** Minor, but it is visible text below AA. It disappears when the real photos replace the placeholders
  (PRODUCT.md, Evidence on Hand).
- **Standard:** WCAG 1.4.3 (4.5:1).
- **Recommendation:** Use `--color-text-secondary` (5.97:1 on that fill), or ship the real photos.
- **Suggested command:** `/impeccable harden`

### P3 Polish

- **A9 · [P3] Permanent `will-change` on about 25 elements outside the hero** (Performance).
  - **Location:** `home.css:298, 304, 316` and `motion.css:68–74`: the 7 Work slots and track; the Process rail, 5 step
    fills and 5 lines; the About title lines; the CTA echo; two cards. In the hero, the glow, glass and reflection keep
    theirs even when the hero is off screen.
  - **Impact:** Each holds a compositor layer for the whole visit (memory on low-end phones).
  - **Recommendation:** Enable it only while in view or animating, the way `.portal.is-live` already does.
  - **Command:** `/impeccable optimize`
- **A10 · [P3] Layout-property transitions** (Performance).
  - **Location:** `.work-dot { transition: width }` (`home.css:724`) and the FAQ's `padding-bottom` transition
    (`home.css:1294`). The FAQ's `grid-template-rows` animation itself is DESIGN.md's recipe.
  - **Recommendation:** Grow the dot with `transform: scaleX` on a pseudo-element, and put the FAQ padding inside the
    animating row.
  - **Command:** `/impeccable optimize`
- **A11 · [P3] `portfolio.json` is fetched three times per load** (Performance).
  - **Location:** `home.js` (project count), `work.js`, and `portal.js` (wall of work).
  - **Recommendation:** Share one loader.
  - **Command:** `/impeccable optimize`
- **A12 · [P3] An `<img>` with no `src` in the markup** (Implementation Integrity).
  - **Location:** `index.html:172`, `.work__ambient-layer`.
  - **Impact:** Invalid HTML without JS; `alt=""` means nothing visibly breaks.
  - **Recommendation:** Give it the first ambient file as `src`, or create it in `work.js`.
  - **Command:** `/impeccable harden`
- **A13 · [P3] Retired design-system files and prototypes are still served** (Implementation Integrity). *`_ds` removed in `45a8b79`; the prototypes remain.*
  - **Location:**
    - `project/_ds/…/tokens/`: `colors.css`, `gradients.css`, `elevation.css`, `typography.css`, `fonts.css` (which
      `@import`s Montserrat and Mulish from Google) and `base.css`. None is imported; `tokens.css` uses only spacing,
      radii and motion.
    - The four `*.dc.html` prototypes, plus `support.js` and `image-slot.js`, in `project/`.
  - **Impact:** They ship with the static site, and linking one by mistake would bring the navy system back.
  - **Recommendation:** Move them out of the served folder, or delete them (owner's call).
  - **Command:** `/impeccable polish`
- **A14 · [P3] Tight Persian display leading** (Typography). *Closed: accepted with C7.*
  - **Location:** `--lh-display: 1.08` (`tokens.css`), used by the hero H1 and the display headings.
  - **Evidence:** No collisions at 72px, but the dots under «ی» and «ب» sit close to the next line's ascenders.
  - **Recommendation:** Have `typeset` check it at the 36px phone size. The value is a DESIGN.md token (see
    [Conflicts](#conflicts-with-designmd)).
  - **Command:** `/impeccable typeset`

Not raised as a new finding: the portal dive drops frames at 4× CPU throttle. This was measured in the V8 work: about
150–180 dropped vsyncs over the dive against 110–140 before V8, at 100Hz, with no long tasks during the dive in clean
runs. It is the approved choreography; revisit only if `optimize` finds a cheap win.

---

## Detector findings (verified)

Unique primary findings across the source scan and the four URL scans, after checking each in the rendered page:

| Rule | Where | Verdict |
|---|---|---|
| `low-contrast` (Work, 13 at 1440/768/390) | Need/built/result texts and «لینک سایت…» notes on card backs | **False positive.** The texts are on the back faces of side slides, which are `backface-visibility: hidden`, `inert` and clipped. The flipped centre card was measured in V7: worst pixel ≥ 4.66:1. |
| `low-contrast` (768) | `#F1F5F2` / `#B9CBC3` "on `#F5F7F4`" | **False positive.** The stacked hero copy sits on the forest wall layer, not on the stage's light background. Checked in screenshots. |
| `body-text-viewport-edge` (390, 16) | Paragraphs 136–409px outside the viewport | **False positive.** Same card backs of off-screen slides, hidden and clipped. |
| `cramped-padding` (source scan, 31) | `portal__copy`, `stat-bar`, `card`, `band`… | **False positive.** The static-HTML scan cannot see CSS padding, and the URL scans do not repeat it. |
| `layout-transition` (2) | `.work-dot` width, FAQ `padding-bottom` | **Real, P3** (above). |
| `tight-leading` | `--lh-display` 1.08 | **Real, P3** (above). It is also a DESIGN.md token. |
| `broken-image` | `.work__ambient-layer` without `src` | **Real, P3** (above). |
| `buried-raster` | The second ambient `<img>` at opacity 0 | **Intentional.** It is the cross-fade buffer for Work's backdrop. |
| `clipped-overflow-container` | `body` and `.band.work` clip positioned children | **Intentional.** The coverflow's side slides are clipped on purpose; no focusable content is hidden (checked with the keyboard walk). |
| `dark-glow`, `radial-spotlight-glow`, `ai-color-palette`, `hero-eyebrow-chip`, `codex-grid-background`, `gpt-thin-border-wide-shadow` | Hero glow, mint on forest, grid texture, card borders and shadows, hero eyebrow pill | **Deliberate DESIGN.md decisions.** Listed under [Conflicts with DESIGN.md](#conflicts-with-designmd). |

## Patterns & Systemic Issues

- **The first paint is not the final layout.** The hero's geometry exists only after a 15-file module graph has loaded,
  and the CSS stand-ins do not match it on either desktop or phone. Most of the P1/P2 performance work is one theme:
  make the first painted state the real one, and make it arrive sooner.
- **A core asset relies on a third party the audience may not reach.** The one typeface is loaded from Google, even
  though the code's own comments call for self-hosting.
- **`will-change` as a default.** Several effects keep compositor layers for the whole visit rather than while they
  animate.
- **The smallest touch targets cluster in Work's controls.** The dots and the pause toggle are among the controls
  phones tap most.

## Positive Findings

- **No horizontal scroll** at any width from 320 to 1920px, and **no console errors or failed requests** at any viewport.
- **Keyboard:**
  - Every focus stop shows the 2px `--color-focus` ring and halo, including the calculator's visually hidden radios,
    whose visible tab takes the ring.
  - The skip link appears above the fixed nav and targets `#top`.
  - Tab order follows reading order; the Proof room has no focusable content, as DESIGN.md requires.
- **Screen readers:**
  - One H1 and a clean H2 → H3 outline; the Work slides' duplicate headings are kept out of the accessibility tree.
  - No unnamed buttons, links or form controls in the accessibility tree.
  - `lang="fa" dir="rtl"`, landmarks in place, no duplicate IDs, no broken ARIA references.
- **Calculator:**
  - `aria-pressed` add-on toggles; a Persian `aria-valuetext` («۱ صفحه») on the page slider.
  - One polite live region; `aria-busy` cleared once rendered.
- **Work carousel and dialog:**
  - The carousel has a pause control (WCAG 2.2.2), `aria-roledescription`, and inert hidden slides.
  - The details sheet is a modal `<dialog>`: focus goes to the first tab, Tab stays inside, Escape closes it and returns
    focus to the card.
- **Fallbacks:** forced colours keep buttons bordered and icons visible, and switch to the static layout. Reduced
  motion and no-JS give the complete static document.
- **Tokens:** no raw colours in component CSS, JS or inline SVG; only mask alpha values. Every forest area remaps
  through `data-surface="dark"`.
- **Images:** WebP, lazy, with `width`/`height` set and `srcset` throughout.
- **LCP is good:** 0.6–1.1s on desktop and 1.4–2.3s on a slow-4G + 4× CPU phone, with the H1 as the LCP element.
- **Contrast:** hero text on the lit screen was measured at the worst pixel in V8 (all AA, H1 13.3:1).

## Known and documented (not scored)

These are open product items recorded in PRODUCT.md, not implementation defects:
- `./order/` and `./track/` return 404, including every «شروع پروژه» button (the site's main goal), because those pages
  are not built yet.
- Contact links are placeholders (`wa.me/989000000000`, `mitec_studio`), as are the prices, labelled «اعداد نمونه»,
  and the team photos.

## Conflicts with DESIGN.md — accepted by owner

Impeccable's heuristics recommend the changes below, but DESIGN.md decided otherwise on purpose. **The owner accepted
all eight as deliberate decisions (2026-09-27).** They stay as they are and are not raised again.

- **C1 · Hero eyebrow pill** (`hero-eyebrow-chip`). Impeccable reads an eyebrow chip above the H1 as a template pattern.
  The V8 spec and DESIGN.md §5 specify the tonal pill.
- **C2 · Mint and green-300 text on forest** (`ai-color-palette`, "cyan neon on dark"). This is the studio's Instagram
  palette (DESIGN.md §1, §4).
- **C3 · The glow behind the laptop and forest-tinted shadows on forest** (`radial-spotlight-glow`, `dark-glow`). DESIGN.md §8
  prescribes the glow, and documents the shadow exceptions: Work's card faces, the laptop's deck, and the float cards.
- **C4 · Grid texture** (`codex-grid-background`). DESIGN.md §8 calls it the Instagram signature.
- **C5 · Thin border plus soft wide shadow on cards** (`gpt-thin-border-wide-shadow`, advisory). This is the DESIGN.md §5
  card recipe.
- **C6 · Reduced motion.** `components.css:54` sets every transition to 0.01ms and removes all animations, and Impeccable
  prefers keeping non-motion feedback such as opacity and colour. DESIGN.md §13 says all durations go to 0; Work
  restores its own short crossfades on purpose.
- **C7 · Display leading 1.08** (`tight-leading`). Impeccable wants at least 1.3. `--lh-display` is a DESIGN.md token.
  Accepted by owner, so A14 is closed.
- **C8 · An internal DESIGN.md inconsistency (for the owner, not a finding).** §5 names a primitive (`--amber-300`) for the
  testimonials quote mark, while §2 rule 2 says components use semantic tokens only. `home.css:878` follows §5. The
  section is hidden today.

## Recommended Actions

1. **[P1] `/impeccable optimize`**
   - Self-host Vazirmatn with preload and a metric-adjusted fallback.
   - Make the hero's first paint match its measured layout (phone stand-in, desktop H1 size).
   - Add `modulepreload`.
2. **[P2] `/impeccable optimize`**
   - Fix the Services art `sizes`.
   - Turn the CSS `@import` chain into parallel `<link>`s.
   - (P3) Scope `will-change`, dedupe `portfolio.json`, and move the layout transitions to transforms.
3. **[P2] `/impeccable harden`**
   - Mobile menu focus containment and outside-tap close; the label change needs owner copy.
   - The placeholder label's contrast.
   - (P3) The `src`-less ambient image.
4. **[P2] `/impeccable adapt`**: 44px hit areas for the Work dots and pause toggle, the «مطمئن نیستید؟» link and the
   logo.
5. ~~**[P3] `/impeccable typeset`**: Persian display leading.~~ Closed (A14, accepted with C7).
6. **[P3] `/impeccable polish`**: move the retired `_ds` files and prototypes out of the served folder (owner's
   call), then the final detail pass.

You can ask me to run these one at a time, all at once, or in any order you prefer.

Re-run `/impeccable audit` after fixes to see your score improve.
