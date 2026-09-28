# Impeccable pass — Phase 2, batch 2: the hero's first frame

**Closed:** A1 (the hero jumps after first paint), A5 (serialised module loading), A6 (the CSS `@import` chain) and
HE3 (blank lit screen when stacked). Also done, from the owner's notes on batch 1: per-platform font fallbacks, and
the font preload measured and decided.

| Commit | What |
|---|---|
| `chore: keep docs/impeccable/shots/ out of git` | screenshots untracked and ignored, kept on disk |
| `impeccable(optimize): fonts — metric-matched fallbacks for Android and iOS` | one fallback family per platform font, `public/fonts/fallback-check.html` |
| `impeccable(optimize): page — load order: …` | A6 (scales linked), A5 (module graph preloaded after first paint), no font preload |
| `impeccable(optimize): hero — the first frame is the measured layout` | A1 |
| `impeccable(adapt): hero — a real screenshot on the stacked lit screen` | HE3, plus its line in DESIGN.md §5 |

## Results

Median of 8 interleaved runs per cell, cold cache. **Before** is the batch 1 commit; **after** is this batch.
Desktop is 1440×900. The slow phone is 390×844 at 2x, throttled to 150 ms, 1.6 Mbps down, 0.75 Mbps up and a
4× slower CPU. Two servers:
- the dev server (`devserver.py`: HTTP/1.0, a new connection per request);
- the same files over HTTP/1.1 keep-alive, which is closer to a production server.

| | Desktop, dev server | Desktop, keep-alive | Slow phone, dev server | Slow phone, keep-alive |
|---|---|---|---|---|
| **CLS** | 0.424 → **0.005** | 0.152 → **0.005** | 0.337 → **0.0007** | 1.000 → **0.0007** |
| **LCP** (ms) | 674 → 284 | 172 → 228 | 1694 → 1862 | 1634 → 1872 |
| **DCL** (ms) | 857 → 549 | 319 → 312 | 3551 → 3533 | 3375 → 3481 |
| FCP (ms) | 674 → 284 | 172 → 228 | 1694 → 1516 | 1634 → 1712 |

- The LCP element is the H1 in every run, before and after.
- CLS is under the 0.1 target everywhere.
  - The worst single run of the 32 after-runs was 0.048: desktop, keep-alive, the H1's font landing mid-load.
  - The remaining 0.005 on desktop is the Vazirmatn 800 swap re-fitting the H1 from 76 to 72 px (see Fonts).
- **The slow phone's LCP is about 170–240 ms later than batch 1's.** A trace shows why:
  - **Batch 1:** the preloaded Vazirmatn 800 had arrived before the first layout. That layout took 148 ms, and
    the H1 was in the first paint (which the measure then moved).
  - **Now:** the first layout shapes the hero in the fallback font. On a 4× slowed CPU that costs several
    hundred ms more (590 ms in one trace), and the nav paints before the H1.
  - **Putting the preload back** gives the H1 its first-paint slot again. It still measured worse overall, though
    (next section): the preload delays the stylesheets.

## Font preload (owner's note 4)

Slow phone, keep-alive server, 10 interleaved rounds, medians (ms):

| Variant | FCP | LCP | DCL | CLS |
|---|---|---|---|---|
| Batch 1 commit | 1608 | 1628 | 3418 | 1.0 |
| Module graph as `<link rel="modulepreload">` in `<head>`, 800 preloaded | 2278 | 2284 | 2956 | 0 |
| The same, no font preload | 2246 | 2330 | 2918 | 0.0007 |
| Module graph preloaded after first paint, 800 preloaded | 1830 | 1914 | 3337 | 0 |
| **Module graph preloaded after first paint, no font preload** (shipped) | **1758** | **1824** | 3523 | 0.0007 |
| No module preload, 800 preloaded | 1958 | 1984 | 3786 | 0 |
| No module preload, no font preload | 1814 | 1840 | 3806 | 0.0007 |

- **Without the 800 preload, first paint is better** (1758 vs 1830 ms, LCP 1824 vs 1914), so the preload is gone.
  Its only gain was a swap shift of 0.0007.
- **Module preload tags in `<head>` cost about 450 ms of first paint**, taking bandwidth from the stylesheets. The
  graph is now preloaded from a small script once the page has first painted. That keeps first paint where it was
  without preloads and still brings DOMContentLoaded forward.
- **Run-to-run noise on the slow phone is about ±150 ms.** Differences under that are not findings.

**Also measured, not changed:** loading the three scales by `<link>` (as decided for A6), by the old `@import`, or
merged into `tokens.css` made no measurable difference. LCP medians were 1778, 1708 and 1702 ms over 12 rounds.
The three files total 1.7 KB, so merging them would save three requests; it is the owner's call.

## A1: how the first frame became the measured one

- **One layout function.** `mitecPortalLayout` sizes the display and the lid parts to the viewport. It then puts
  the copy on the lit screen and shrinks the H1 in 4 px steps until it fits; where it can't, or below 760 px, the
  copy stacks above the laptop and the laptop starts under it.
  - It sits inline after the portal in `index.html`, because a module cannot run before first paint.
  - It runs there before first paint, and `portal.js` calls the same function on every measure, so there is one
    version of the layout. The one-line pre-paint script it replaces (the copy's `data-surface`) is part of it.
- **The laptop's resting pose.** The frame's transform reads `--portal-dy` and `--portal-tilt`, which the layout
  sets. The old 22svh phone stand-in remains only as a fallback.
- **Checked:** the first frame (modules held back) equals the measured layout at 1920, 1440, 1366×768, 1280×800,
  1024×768, 1024×1366, 768×1024, 414, 390, 360 and 320.
- **The font landing later.** No single `size-adjust` can match every line break. At 1440 and wider the display is
  capped, and the H1 fits in three lines at 76 px in every fallback, while Vazirmatn needs 72 px. So each
  Vazirmatn weight re-runs the layout as it lands. (Corrected in batch 4: Chrome first lays the H1 out in
  Vazirmatn at the old 76 px, in four lines, then at the re-fit 72 px, so a late swap counts as two small shifts,
  about 0.046 together; see `15-batch-4.md`.)
- **Unchanged:** reduced motion, forced colours and no-JS keep the static band. If the module fails to load, the
  static page also drops the layout's sizes.

## HE3

Stacked (phones, and wherever the copy does not fit on the screen, 768×1024 among them), the lit screen shows the
first project's screenshot at rest. It is `portfolio.json`'s first `src960`, with `object-fit: cover` and
`object-position: right top`, and it fades out with the copy, gone by 15% of the dive.
- It is in the markup, so it is part of the first frame.
- It is lazy and hidden outside the stacked layout. It is not fetched at 1440, under reduced motion or in forced
  colours.
- **LCP note:** at 768×1024 the screenshot (548×338) is larger than the H1 (539×134), so it becomes that layout's
  LCP element. It is 25 KB.

## Font fallbacks (owner's note 3)

| Family | Font | Platforms | size-adjust (400 / 500 / 700 / 800) |
|---|---|---|---|
| `Vazirmatn Tahoma` | Tahoma, Tahoma Bold | Windows, macOS | 93 / 93.8 / 83.8 / 84.1% |
| `Vazirmatn Geeza` | Geeza Pro | iOS | 100% (not measured yet) |
| `Vazirmatn Naskh` | Noto Naskh Arabic (+ UI) | Android | 109.4 / 110.3 / 107.6 / 107.9% |
| `Vazirmatn Noto Sans` | Noto Sans Arabic (+ UI) | Android builds without Naskh, Linux | 99.3 / 100.1 / 91.7 / 92% |

- **How the values were measured:** on the page's own Persian text, with the official notofonts release (Naskh
  v2.021, Naskh UI v2.017, Sans v2.013, Sans UI v2.011).
  - The UI variants are within 0.4% of the regular ones on shaped text, so each shares its family.
  - The ascent, descent and line-gap overrides follow from `size-adjust`.
- **Calibrating on the H1 instead:** the H1 alone gives a 2.5% narrower ratio in weight 800. A sweep of 75
  viewports × 3 fallbacks found it no better overall (30 layout mismatches against 29), so the page average stays.
- **Installing Noto locally did not work here.** Chromium on Windows ignores per-user fonts, for `local()` and
  even for family names, and a machine-wide install needs admin rights. The per-user install was removed again.
  - The Noto faces were tested instead from the release files, inlined so they load synchronously like `local()`
    does.
  - The `local()` names were checked against the fonts' own name tables.
- **Geeza Pro ships only on Apple devices.** Its values stay at 100% until `public/fonts/fallback-check.html` is
  opened once on an iPhone; the page prints ready-to-paste rules. Safari applies `size-adjust` from version 17.
  Its support for the ascent and descent overrides was not verified here.

**Font-swap shift per fallback.** Vazirmatn was held back 2 s, so the swap comes well after first paint (worst of
3 runs). "Unmatched" is the same font without `size-adjust` or overrides.

| Fallback | Desktop 1440 | Tablet 768 | Phone 390 |
|---|---|---|---|
| Tahoma, matched | 0.0054 | 0 | 0.0007 |
| Tahoma, unmatched | 0.0081 | 0 | 0.0989 |
| Noto Naskh, matched | 0.0022 | 0 | 0.0018 |
| Noto Naskh, unmatched | 0.0024 | 0 | 0.0037 |
| Noto Sans, matched | 0.0015 | 0 | 0 |
| Noto Sans, unmatched | 0.0029 | 0 | 0 |

## Screenshots

`docs/impeccable/shots/` (on disk, not in git) has `b2-before-*` and `b2-after-*` at 1440, 768 and 390. For each,
`-first` is the first frame with the modules held back and `-settled` is the page after they ran. Before, the two
differ at every width; after, they are the same.

## Open items

- **Geeza Pro (iOS fallback): waiting for the owner's iPhone values.** `Vazirmatn Geeza` stays at `size-adjust: 100%`
  (and the matching overrides) until the owner opens `public/fonts/fallback-check.html` on an iPhone and sends the
  lines it prints; they go into `src/styles/tokens.css` as they are.

## Follow-ups after approval (measured under Slow 4G)

From here on every measurement uses Chrome DevTools' **Slow 4G** preset (request latency 562.5 ms, i.e. a ~150 ms
round trip; 1.6 Mbps × 0.9 down, 750 kbps × 0.9 up) and a 4× slower CPU on phones and tablets. The runs are
interleaved, with medians of 8 and a cold cache. The keep-alive server now sends `no-cache` instead of the dev
server's `no-store`, so a preloaded file can be reused within the page, as on a production server.

**Batch 2 re-reported, slow phone 390×844 (ms):**

| | FCP | LCP | DCL | CLS |
|---|---|---|---|---|
| Batch 1, keep-alive | 2736 | 2740 | 6172 | 1.0 |
| Batch 2, keep-alive | 2540 | 2638 | 5895 | 0.0007 |
| Batch 1, dev server | 2904 | 2904 | 5776 | 0.337 |
| Batch 2, dev server | 2504 | 2674 | 5843 | 0.0007 |

- **Under Slow 4G, batch 2 is no slower than batch 1** (within ±200 ms run-to-run noise) and removes the layout
  shift.
- **Desktop 1440×900** under the same network, without the CPU slowdown: FCP and LCP 2192, DCL 4992. CLS was
  0.047: with the fonts arriving this late, the Vazirmatn 800 swap re-fits the H1 (76 → 72 px) after first paint.

**The three follow-ups:**
- **Scales merged into `tokens.css`:** the three files are gone, so there are three fewer requests.
- **The stacked screenshot is preloaded where it is the LCP element.** That is where the hero stacks and from
  414px wide, where the H1 drops to three lines and the screenshot outgrows it. A first version preloaded it
  wherever the hero stacks; at 390, where the H1 is the LCP, that delayed LCP by about 190 ms, so phones under
  414px no longer preload it. The `<img>` stays lazy, and a desktop never fetches it for the hero. The wall of work
  already loads the same file there, after first paint and at low priority.

  | LCP (ms) | Batch 2 | Now |
  |---|---|---|
  | 390×844 (the H1) | 2876 | 2822 |
  | 430×932 (the screenshot) | 4096 | 2884 |
  | 768×1024 (the screenshot) | 4202 | 3048 |

  **On `devserver.py` the preloaded screenshot downloads twice**, because its `no-store` header forbids reusing
  the preload. A server that allows storing fetches it once.
- **Geeza Pro:** see Open items.
