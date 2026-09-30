# Impeccable pass — Phase 3: the last fix round

After the re-audit (`20-reaudit-home.md`), the owner's final round before `document`: R1, R2, R5, the three
remaining P3s (SV4, AB5, FC5), R3, R4 (investigated first) and a deployment page.

| Commit | Closes |
|---|---|
| `impeccable(harden): calculator — a focused site type scrolls clear of the bar (R1)` | R1 |
| `impeccable(harden): forced colours — the chosen site type in selection colours, the native slider, the closing heading as inline words (R2)` | R2 |
| `impeccable(harden): faq — the link to the calculator made by script, plain text without JS (R5)` | R5 |
| `impeccable(harden): services — each «شروع پروژه» named by its service, the section named by its heading (SV4)` | SV4 |
| `impeccable(animate): about — the title lines converge over the title's own passage, once it is all on screen (AB5)` | AB5 |
| `impeccable(document): DESIGN.md — the closing band has no glow; the line that asked for one removed (FC5)` | FC5 |
| `impeccable(optimize): services — a 384w art file; sizes net of the card padding on phones (R3)` | R3 |
| `impeccable(optimize): first frame — icons no first view shows moved to public/icons.svg; the hero script's notes moved to portal.js (R4)` | R4 |
| `docs: DEPLOY.md — compression, cache headers and content types for the server` | the deployment page |

## R1: the focused site type

The site-type radios joined the rule that keeps focused calculator controls clear of the nav and the bar. Tabbing
into the calculator, the checked tab is now fully visible (5 of 5 probe points) at 360, 390, 430 and 768, with motion on
and reduced (at 390 with reduced motion it was fully under the bar).

## R2: forced colours

- **Site types:** each tab is outlined in `ButtonBorder`; the chosen one takes `SelectedItem` / `SelectedItemText`.
- **Pages slider:** the native control, in system colours (the styled track was a gradient, which forced colours
  drop).
- **Closing heading:** its words are plain inline text in forced colours, so no word's backplate covers the line
  above. «مسیر دیجیتال کسب‌وکارتان» keeps its dots and descenders at 1440 and 390, in both a light and a dark
  contrast theme, with the same line breaks as normally.
- Nothing changes outside forced colours.

## R5, SV4, AB5, FC5

- **R5:** the first FAQ answer has «برآورد سریع» as plain text in the markup; `home.js` makes it the link. Without JS
  it is no longer a Tab stop; with JS it lands on the calculator.
- **SV4:** the four «شروع پروژه» links in Services are «شروع پروژه: {the card's title}» (`aria-label`, starting with the
  visible words), and the section is a region named by its heading. The page's other two «شروع پروژه» (hero, closing
  band) go to the same place, so they keep the same name.
- **AB5:** About's two title lines now meet over the title's own passage, from the moment all of it is on screen to
  its top at 45% of the viewport. Of the 144px (1440) / 23px (390) of travel, 142 / 21 now happen with the whole title
  in view, where 45 / 12 did before.
- **FC5:** DESIGN.md's closing band says "grid texture. No glow" instead of asking for a glow the build never had.

## R3: the Services art

- A 384w file per illustration (13–20KB, against 37–59KB for the 768w), encoded like the others (WebP, quality 88).
- `sizes` on phones is now 60% of the width less 96px (it was less 48px, which left out the card's own padding and
  asked 2× phones for about 60 device px too many).
- Six illustrations, what each device loads: 1× desktop and 2× phones 299 → 104KB; 2× desktop, 2× tablets and 3×
  phones keep the 768w (they need it). Every pick is at least as wide as its box.

## R4: what grew the HTML, and the long task

### What grew `index.html` from 42 to 64KB

Uncompressed bytes, 01's build (`1a521d9`) → the re-audit (`8ff0ca9`):

| Part | 01 | Re-audit | Change | Needed for the first frame? |
|---|---|---|---|---|
| The hero's layout script (the first-frame fit, the Vazirmatn word widths) | 457 | 7,495 | +7,038 | Yes: it is what makes the first frame the final one (A1). About 2.5KB of it was comments. The word-width table itself is 300 bytes. |
| Icon sprite (25 symbols) | – | 5,409 | +5,409 | Only 8 of the 25 icons can appear in a first view. |
| Icon `<svg><use>` markup | (images from jsdelivr) | 3,260 | +3,260 | Yes: markup. |
| HTML comments | 5,029 | 7,559 | +2,530 | No, but they are the only notes for anyone editing `index.html`. |
| Module-graph preload script | – | 1,541 | +1,541 | Yes: it has to be listening before first paint. |
| `<img>` / `<link>` tags (srcset, sizes, the preload) | 3,582 | 4,470 | +888 | Yes. |
| ARIA, role and data attributes | 2,221 | 2,575 | +354 | Yes. |
| `&nbsp;` word ties (5 bytes more than a space each) | – | 175 | +175 | Yes. |
| Everything else (markup and text) | 30,182 | 31,010 | +828 | Yes. |
| **Total** | **41,890** | **63,930** | **+22,040** | gzipped 9.5 → 16.6KB |

### What the long task is

A Chrome trace of the slow phone (Slow 4G, 4× CPU, gzipped) shows the task is the page's **first style and layout**,
not script:
- The hero's inline script runs in 2–5ms. Its first read of the stage's height makes the browser lay out what has
  been parsed so far (the nav and the hero, about 120–240 layout objects) there and then.
- That layout takes 190–810ms at 4× CPU (it varies run to run); style adds 30–100ms.
- The same work exists in 01's build: there it ran between the last stylesheet and first paint (about 500ms), so it
  was not reported as one task.
- Tried: the 16 `local()` fallback faces. Without them the first layout took the same 240–480ms, so they are not the
  cost. It is the first-time text shaping of the hero's Persian text, which any first paint needs.

### What moved

- **Icons:** the 8 a first view can show stay inline (menu, ×, the forward arrow, the hero's second button, the
  float cards' two, and WhatsApp / Telegram for the menu's pair). The other 17 are in `public/icons.svg`, used by
  external `<use href="public/icons.svg#i-NAME">`, which works without JS. `src/utils/icon.js` picks the inline symbol
  or the file. All 75 icons at 1440 (67 at 390) draw with JS, and all of them without.
- **The hero script's notes** (2.5KB of comments) moved to `motion/portal.js`, beside the call that re-runs the same
  function, leaving one-line pointers inline. The code itself stays: all of it serves the first frame.
- **Kept inline:** the layout script, the word-width table, the module preload, the comments in the markup (see the
  table), the `&nbsp;` ties.

### Before and after

Before is `dc217e5` (after R3), after is this commit. Keep-alive server, Slow 4G, alternating runs, medians in ms;
"long task" is the longest task before first paint.

| | Phone, plain (9 runs) | Phone, gzipped (9 runs) | Desktop 1440, plain (5 runs) |
|---|---|---|---|
| HTML (bytes) | 64,716 → 61,551 | 16,692 → 15,635 | 64,716 → 61,551 |
| Long task | 589 → 682 | 512 → 489 | 82 → 99 |
| FCP | 3028 → 2988 | 2172 → 2148 | 2304 → 2308 |
| LCP | 3124 → 2988 | 2176 → 2212 | 2304 → 2308 |
| CLS | 0.0006 → 0.0006 | 0.0006 → 0.0006 | 0.0019 → 0.0021 |

- **Every difference is inside the run-to-run noise** (about ±150ms on the phone). The HTML is 5% smaller, and the
  long task, which is layout, not bytes, didn't change.
- **What moves first paint on a slow phone is compression:** about 0.85s here (2988 plain against 2148 gzipped).
  `docs/DEPLOY.md` asks the server for it.

## docs/DEPLOY.md

For whoever runs the server (nginx serves `project/` from `/var/www/portfolio`):
- Brotli where the module is installed, else gzip, for HTML, CSS, JS, JSON and SVG;
- `Cache-Control`: fonts `max-age=31536000, immutable` (renamed if ever replaced), and the same for any hashed
  asset added later; everything else `no-cache`, since no other file name changes with its content. One `map`, so
  no regex location can catch `/api/`;
- the content types to check in `mime.types` (woff2, webp, JS modules, SVG) and `charset utf-8`;
- `no-store` only in development (`devserver.py`);
- `curl` checks for a deploy.

## Checks

- The sweep (320–1440 × motion, reduced motion, forced colours, no JS): all 20 clean: no sideways scroll, no console errors, every section present.
- The keyboard walk, targets and the accessibility tree at 1440 and 390: no unnamed controls, no broken
  references, no duplicate ids, no focus stop hidden by the nav or the bar; the menu and the Work sheet hold and
  return focus as before. No request leaves the site. Images after a full scroll: 405 → 210KB at 1440 and 390.
