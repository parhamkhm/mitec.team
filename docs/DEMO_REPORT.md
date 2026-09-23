# Demo report — home-page redesign, pricing v3/v4, docs and QA

Branch `feature/portal-hero`, not pushed and not merged. Everything below was built and checked locally with
headless Chrome (Playwright) plus Firefox for one earlier check. No real phone, real screen reader or DevTools
session on your machine was used, so the report says where a check needs your eyes.

---

## 1. Run the demo

From the repository root:

```bash
python devserver.py 4173
```

Open <http://127.0.0.1:4173/>. The server sends `no-store`, so every edit shows on reload. Useful extra pages:

- <http://127.0.0.1:4173/src/utils/estimate.test.html>: the pricing maths tests (16/16 pass).
- To see the calculator change from data: edit `project/src/config/pricing.json` (a price, a label,
  `"active": false`, `"order"`, a new add-on, or `"group"` on some add-ons), save, reload. Nothing else needs changing.

Screenshots of the calculator (1440, 768, 390, the grouped sample, and the hero at p=0 at 360 and 1920) are in
`Claude outputs/v4-screens/`. That folder is git-ignored, as you asked earlier for screenshots not to be committed.

## 2. Guided tour: scroll top to bottom

Best viewed first at a laptop size (1440×900), then with the window narrowed to a phone width.

1. **Hero, the laptop portal** (approved, unchanged). At the top the H1, the line under it and both buttons sit on
   the laptop's display over the forest scene. Scroll slowly: the copy lifts off, the intro statement reveals word by
   word, the glass fades into the light **Proof room**, and the nav switches from forest to light. Scroll back up: it
   all reverses, with no jump where the scene lets go.
2. **Proof room.** The three real stats and the project-name strip. Work follows directly after.
3. **Work.** Three project rows alternating sides; the media tiles drift slightly as you scroll.
4. **Testimonials.** Still sample content, labelled as such; the cards tilt gently.
5. **Services.** Four cards that rise in once.
6. **Process** (approved, unchanged). The rail fills as you scroll. Each step it reaches fills in, and one forest
   "spotlight" step moves along with you, then back in reverse.
7. **About.** The two team cards come together.
8. **Quick scope, the pricing calculator** (new layout, V4). Things to try:
   - Switch the site-type tabs. Watch the summary card (the start column): what is always included, «شامل N صفحه»,
     the total, the CTA.
   - Drag the page slider and toggle add-on tiles. The total and «N امکان انتخاب شده» update.
   - Scroll while the tiles pass. From 1024px the summary card stays in view under the nav and lets go at the end of
     the section.
   - Tiles: every tile in the grid is the same height; with an odd number, the last one spans both columns. «فرم تماس»
     has no price, yet its bottom line still aligns with the others.
   - Narrow the window below 1024px: summary card → pages → tiles, and the total + CTA become a bar at the bottom of
     the screen, only while the calculator is on screen.
   - The amber badge «اعداد نمونه — جایگزین شود» shows because every number is still a placeholder (§8).
9. **FAQ.** Single-open accordion. With JS off, every answer is now readable (a QA fix, §5).
10. **Closing CTA band.** The heading reveals word by word inside an outline of the laptop.

Accessibility demos, if you want them:
- turn on your OS's "reduce motion": the page becomes a normal static document;
- press Tab from the top: focus is always visible and never hidden;
- turn on Windows High Contrast: icons now stay visible.

---

## 3. What changed, step by step

This session's three steps, each with its own commit and a tag you can revert to:

| Step | Commit | Tag | What |
|---|---|---|---|
| V4 — pricing layout | `b75070f` | `checkpoint/v4-layout` | Count-proof tile grid, sticky summary card (base + total + CTA), bottom bar below 1024px, optional add-on `group`, «N امکان انتخاب شده», `docs/copy-todo.md` started |
| Phase 6 — docs | `cf4fad4` | `checkpoint/phase-6` | DESIGN.md contrast table (§10) and motion notes (§13) for the calculator; `docs/prompts/README.md` (which spec overrides which); project and root READMEs updated |
| Phase 7 — QA | `ffeb616` | `checkpoint/phase-7` | §18 re-run on the current build; two fixes (FAQ readable without JS, icons visible in forced colours); site-wide copy problems added to `docs/copy-todo.md` |

Everything on `feature/portal-hero` that is not on `main` yet, oldest first:

| Commit | What |
|---|---|
| `6b6313a` | Master Phase 5: first Quick scope configurator and shared `estimate()` (since replaced by V3) |
| `6ac4728` | Master Phase 6: first docs pass |
| `402bc7b` | Master Phase 7: first QA pass (skip link fixed-position, favicon request) |
| `df217fe` | V3 A: the pricing document (`pricing.json`), schema, `getPricing()`, admin contract |
| `c0fcdcc` | V3 B: day-based `estimate()`, `format.js`, `estimate.test.html` |
| `3fefd74` | V3 C: the calculator, rendered from data |
| `bdfdfd6` | V3 D: `docs/pricing-guide.md`, docs |
| `b75070f` | V4 (this session) |
| `cf4fad4` | Phase 6 again (this session) |
| `ffeb616` | Phase 7 again (this session) |

Local `main` (`aef608a`) is itself 8 commits ahead of `origin/main` and still unpushed. GitHub rejected both saved
tokens (Git Credential Manager and gh); see §5.

---

## 4. Decisions I made on your behalf

### V4: the pricing layout

1. **The bottom bar is CSS `position: sticky`, not a fixed bar toggled by IntersectionObserver.** It sticks to the
   bottom of the screen inside the calculator's own box, so it shows only while the calculator is on screen. It comes
   to rest at the end of the section, so it can never cover the FAQ or the footer. A fixed bar would either cover the
   next section or need a second, in-flow copy of the total and CTA (two live regions, two primaries).
2. **One total + CTA element is moved** between the card (≥ 1024px) and the bar (below) when the breakpoint changes.
   So there is always exactly one live region and one CTA, and focus is kept if it was on the CTA.
3. **The odd-tile rule is `:last-child:nth-child(odd)`** instead of the spec's `:has()` selector. The result is the
   same and it also works without `:has()`, so the no-`:has()` fallback is never needed.
4. **Included list columns.**
   - Two columns from 1280px, as the spec says.
   - Also two at 768–1023px, where the card is full width. The spec is silent there, and two columns bring the tiles up
     sooner.
   - One column at 1024–1279 and on phones.
   - The literal fallback to one column when even two columns would not let the card fit is implemented.
5. **Card spacing was tuned** so that at 1440×900 all six site types stay sticky (card 658–762px against 783px of
   room). The two 9-add-on types come out at 1.27× and 1.31× (the spec says "~1.3×").
6. **«N امکان انتخاب شده» lives in `scope.js`** (the `COPY` constants), because V4 allowed no data change except
   `group`. Listed in `docs/copy-todo.md` to move into `pricing.json` later.
7. **A hairline, not «·», separates the duration from the count.** A dot next to Persian digits reads as a zero (۰).
8. **The phone bar is compact:** the price and the days on the start side, the CTA on the end, with the «جمع» label,
   the count and the CTA's arrow hidden. The CTA text is one step smaller, so everything fits on one row down to 360px.
9. **Groups:**
   - When add-ons have a `group`, ungrouped ones come first, directly under «امکانات بیشتر».
   - Group headings are `h4` under the `h3`.
   - `mapper.js` passes `group` through. That, and adding the field to the schema and the guide, is the only data-side
     change.
10. **Pages block order is label · value, slider, hint** (the hint moved under the slider, as sketched).
11. **Keyboard focus clears the nav and the bar** (`scroll-margin`). Without it, tabbing on a phone could land a tile
    under the bar.

### Phases 6 and 7

12. **"Continue with the remaining phases" meant re-running them.** Master Phases 5–7 were already committed
    (`6b6313a`, `6ac4728`, `402bc7b`) before V3. So Phase 6 now brings the docs up to date with V3/V4, and Phase 7
    re-runs §18 on today's build.
13. **§18's Quick scope item was checked with V3's meaning:** prices and working days from the pricing document, not the
    old week ranges, and the V3 payload with `pages`, `addons` and `pricingVersion`.
14. **FAQ markup changed so answers read without JS.** The FAQ is not in your frozen list, and §18 requires the page to
    be readable with JS off.
15. **Icons in forced colours** now use system colours. This is a site-wide one-rule fix in `components.css` (a §12
    requirement), and it was invisible on every icon before, not only in the calculator.
16. **The JS budget was not cut to size** (see §6, open question 1): the biggest files are frozen (portal, engine) or
    required by V3/V4.
17. **Tags are local only**, like the commits.

### From V3 (already in my V3 report; repeated here so everything is in one place)

18. Fake round placeholder numbers rather than zeros, so the calculator is reviewable.
19. Extra `section` / `currency` / `display` label fields, so no calculator string lives in code.
20. Draft descriptions for six add-ons, and the type-specific first «included» item for five types, reused from the
    order catalog.
21. Which add-ons each type offers, also my guess:
    - corporate and custom: all nine;
    - ecommerce: all but payment and booking;
    - menu: all but auth and payment;
    - catalog: contact form, CMS, multilingual, SEO and chat;
    - landing: contact form, multilingual, SEO and chat.
22. The home calculator shows prices (`display.showPrice: true` in the document) with the «اعداد نمونه» badge.
    `APP_CONFIG.showPrice` (false) still governs the future wizard.
23. The section is hidden without JS (every string comes from data). The legacy `features` key is dropped from the saved
    order. `pricing_version` is sent with orders.

---

## 5. Skipped, blocked, open

**Blocked**
- **Pushing to GitHub.** Both saved credentials were rejected earlier. You need to run `gh auth login -h github.com` and
  `gh auth setup-git`, then `git push origin main` (for `aef608a`). Per your instructions nothing was pushed or merged
  this session.

**Not verifiable here, please check on your machine**
- **60fps on real hardware.** Headless Chrome showed:
  - no forced (JS-triggered) layouts and no long tasks at normal CPU;
  - median frame interval 10ms, p95 19.7ms;
  - at 4× CPU throttle, one task of 50.2ms.

  A DevTools Performance recording on your laptop would confirm.
- **A real screen reader.** The live region's text was checked programmatically: one announcement per change.
- **A real phone's URL bar.** Emulated with a viewport change of 64px mid-scene: the scene did not restart or jump.

**Known gaps (unchanged)**
- `/order`, `/track` and the 404 page are not built. Links to `./order/` and `./track/` return 404.
- Fonts (Google Fonts) and icons (jsDelivr) still load from CDNs and must be made local for Iran.
- Placeholder: team photos, project screenshots, testimonials, contact links (WhatsApp, Telegram, Instagram), favicon.
- Every pricing number (§8).

## 6. Open questions for you

1. **JS size.** The new JS is about 46 KB as written, about 30 KB without comments, and 15.8 KB gzipped. The master
   prompt's budget was about 12 KB unminified. The frozen portal and engine plus the V3/V4 calculator account for most
   of it. Accept, or should I look for cuts outside the frozen parts?
2. **The intro statement's informal register** («رو»، «تو») against «شما» everywhere else. It is frozen, so this is your call.
3. **«از» before the total** («جمع: از ۲۷ میلیون تومان»). Changing it needs a new data field, which is a data-model change.
4. **Phone bar.** Should it also show «N امکان انتخاب شده»? I hid it to fit one row at 360px.
5. **Two-column included list at 768–1023px.** OK, or one column as at 1024–1279?
6. **Publishing order.** Push `main` (`aef608a`) once auth works, then review this branch and merge it into `main`?

---

## 7. §18 validation checklist (master prompt), on today's build

The scene, nav, overflow, button, colour and text checks ran at 360×740, 390×844, 768×1024, 1280×800, 1440×900 and 1920×1080, and overflow and console also at 1024×768. The keyboard pass ran at 1440, 768 and 390, performance at 1440×900.

| # | Check | Result | Notes |
|---|---|---|---|
| 1 | Portal continuous and reversible; no jump at unpin; Work right after the room | ✅ Pass | The room heading holds still until the last pinned pixel, then moves 1:1 with scroll. The next section is `#work`. 60fps itself needs your machine (§5). |
| 2 | At p = 0 the H1, sub and both CTAs are readable; light text never over the light room | ✅ Pass | The H1 and both CTAs are in view at 360 and 1920 (screenshots `hero-p0-*`). Light text only on forest or glass: unchanged since the approved V2. |
| 3 | The wall is off-screen before it fades, at 360 and 1920 | ✅ Pass | The display covers the whole viewport when the fade starts, at all six sizes. "While rotated" does not apply: V2 removed the roll. |
| 4 | Nav dark over the scene, light in the room, no flicker | ✅ Pass | One flip while jittering ±0.3% across the switch, at every size. |
| 5 | Reduced motion: no pinning, no scrubbing, all visible, anchors work | ✅ Pass | No `html.motion`, no sticky in the portal, 0 hidden reveals, `scroll-behavior: auto`. The «فرایند» link lands at 80–85px, under the nav. |
| 6 | JS disabled: readable in normal flow | ✅ Pass (after fix) | The FAQ answers were unreadable before today's fix. The calculator is hidden by design (V3: it is a tool, and every string comes from data). |
| 7 | Keyboard-only: focus always visible, never on an invisible element | ✅ Pass | Full Tab pass at 1440 (45 stops), 768 (39) and 390 (40). Every stop fully opaque, on screen, with a ring, not inert, and never under the nav or the calculator bar. |
| 8 | No horizontal scroll at 360; URL bar doesn't restart the scene | ✅ Pass | Overflow 0 at all sizes. 844→780→844px mid-scene: same scroll position, track length and device transform. |
| 9 | No layout/style recalc per frame from the engine; no long tasks > 50ms | ✅ Pass, one note | 0 JS-forced layouts. 43 layouts in about 800 frames, so not one per frame. The engine writes inline transforms every frame, so one style recalculation per frame is expected. No long tasks at 1×; one of 50.2ms at 4× throttle. |
| 10 | No new hex outside `tokens.css`; one primary per viewport; action green only on clickables | ✅ Pass | The only hex outside tokens is inside a comment, plus the pre-existing `theme-color` meta. Never more than 1 primary per viewport. Nothing unclickable is action green. |
| 11 | Persian: no letter-spacing, no character splitting, Persian digits | ✅ Pass | No Persian text has tracking; only Latin wordmarks do. The only Latin digits are the brand name «E2 Café». |
| 12 | Quick scope correct (V3 meaning); no price when off; payload shape | ✅ Pass | Three cases worked by hand match at 1440 and 390: corporate 4 pages + CMS + SEO = ۲۰ M / ۲۰ days; ecommerce 5 pages + loyalty + chat = ۳۳ M / ۳۳; menu + booking + contact form = ۱۰ M / ۱۰. With `showPrice: false` there is no «تومان» in the DOM. The payload is `{ selection: { …prev, siteType, pages, addons }, step: 2, unsure: {}, pricingVersion: 3 }`. |
| 13 | FAQ single-open, animated, closed panels unfocusable | ✅ Pass | Opening one closes the others; grid-rows transition of 0.42s; closed panels are `inert`. |
| 14 | Console clean; only the known 404s | ✅ Pass | No errors or warnings at any size. The only failed request is `/order/`, after clicking the CTA. |

V4's own checklist, also passing:
- **Tile counts:** 1, 2, 3, 8, 9 and 16 add-ons at 1440, 768 and 390 all give an even grid, exactly one full-width tile
  when odd, equal heights and aligned price lines.
- **Long description:** clamped to 2 lines, with the full text in `title`.
- **Groups:** grouping appears and disappears with the data.
- **Sticky card:** it releases at the section end.
- **Bottom bar:** it never covers the section below.
- **Keyboard and screen reader:** behaviour unchanged, with one announcement per change.

---

## 8. Placeholder pricing numbers you still have to fill in

All in `project/src/config/pricing.json` (guide: `docs/pricing-guide.md`). They are clearly fake round numbers. When
the real ones are in, set `"placeholder": false` to remove the «اعداد نمونه» badge.

| Site type | Base price (toman) | Base days | Pages included | Page slider | Per extra page |
|---|---|---|---|---|---|
| سایت شرکتی (corporate) | 10,000,000 | 10 | 1 | on, 1–20 | 1,000,000 / 1 day |
| فروشگاه اینترنتی (ecommerce) | 20,000,000 | 20 | 3 | on, 1–30 | 1,000,000 / 1 day |
| منوی آنلاین (menu) | 5,000,000 | 5 | 1 | off | — |
| کاتالوگ و نمونه‌کار (catalog) | 10,000,000 | 10 | 3 | on, 1–30 | 1,000,000 / 1 day |
| لندینگ پیج (landing) | 5,000,000 | 5 | 1 | off | — |
| سرویس اختصاصی (custom) | 30,000,000 | 30 | 1 | on, 1–20 | 1,000,000 / 1 day |

| Add-on | Price (toman) | Days |
|---|---|---|
| فرم تماس (contact-form) | 0 | 0 |
| پنل مدیریت محتوا (cms) | 5,000,000 | 5 |
| چندزبانه (i18n) | 5,000,000 | 5 |
| سئوی پایه (seo) | 2,000,000 | 2 |
| ثبت‌نام و ورود (auth) | 3,000,000 | 3 |
| پرداخت آنلاین (payment) | 5,000,000 | 5 |
| نوبت‌دهی و رزرو (booking) | 5,000,000 | 5 |
| باشگاه مشتریان (loyalty) | 10,000,000 | 10 |
| چت آنلاین (chat) | 1,000,000 | 1 |

Which add-ons each type offers is also a placeholder (§4, item 21), and so are the six add-on descriptions I drafted
(`docs/copy-todo.md`).
