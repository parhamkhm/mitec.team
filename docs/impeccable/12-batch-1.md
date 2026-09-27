# Impeccable pass — Phase 2, batch 1: third-party runtime assets

**Closed:** A2 (Vazirmatn from Google Fonts) and HE2 (icons from `cdn.jsdelivr.net`).

| Commit | ID | What |
|---|---|---|
| `impeccable(optimize): fonts — self-host Vazirmatn with a metric-matched fallback` | A2 | `public/fonts/`, `@font-face` and fallback in `tokens.css`, measures from `ch` to `--ch` |
| `impeccable(harden): icons — inline SVG sprite, no CDN` | HE2 | one inline sprite in `index.html`, `.icon` in `components.css`, `src/utils/icon.js` |

## Fonts

Vazirmatn v33.003 from the official rastikerdar release (`fonts/webfonts/`, about 51 KB per weight). The release has
no Arabic/Latin subsets, so each weight is subset with fonttools (at dev time only) to Google Fonts' `arabic` and
`latin` ranges, keeping every OpenType layout feature. The command is in `project/public/fonts/README.md`.

| File | Size |
|---|---|
| `vazirmatn-400.woff2` | 34,780 B |
| `vazirmatn-500.woff2` | 35,220 B |
| `vazirmatn-700.woff2` | 35,280 B |
| `vazirmatn-800.woff2` | 35,228 B |

- **Characters kept:** Persian digits (۰–۹), Arabic digits (٠–٩), ZWNJ/ZWJ, «٪ ، ؛ ؟ « »» and all of Latin-1 (CRM, SSL,
  mitec.team). Every character in `index.html`, `src/data`, `src/config` and the scripts was checked against each
  subset. Only → and ≥ fall outside it, and both appear only in code comments.
- **Preload:** 800 only (the H1). On a throttled phone an A/B found that preloading 400 as well delayed first paint and
  gained nothing once the fallback matched.
- **Fallback:** "Vazirmatn Fallback" is Tahoma (Bold for 600–900) with `size-adjust` (Vazirmatn's width ÷ Tahoma's on
  the page's own text) and ascent/descent/line-gap overrides, per weight range.
- **Measures:** `max-width: 52ch` and the like resolve `ch` against the "0" of the font that is showing. Tahoma's
  scaled "0" is about 10% narrower, so under the fallback the hero sub wrapped to three lines and jumped to two when
  Vazirmatn landed. The five measures now read `calc(N * var(--ch))`, with `--ch` fixed at 1ch of Vazirmatn Regular
  (0.56201em). All 23 affected elements keep their widths at 1920, 1440, 1280, 1024, 768 and 390.

## Icons

lucide-static@0.544.0, the 21 icons the page uses, as one inline sprite at the top of `<body>` (3,553 bytes, 21
`<symbol>`s, no request). Markup: `<svg class="icon icon-NAME" aria-hidden="true"><use href="#i-NAME"/></svg>`.
`.icon` keeps the old 20px box and draws the stroke (2, round caps and joins, `currentColor`). At 1x and 2x it is
pixel-identical to the masks it replaces. Under forced colours, `currentColor` takes the text's system colour, so
DESIGN.md §10 now names that mechanism in place of the masks. The outcome it states is unchanged.

## Measurements

Same script before and after (Playwright, Chromium). Desktop is 1440×900 on the local server. The phone is 390×844 at
2x, throttled to 150 ms, 1.6 Mbps down and a 4× slower CPU. CLS is split into the font swap and the rest, which is
A1's hero measure (batch 2).

| Scenario | Before | After |
|---|---|---|
| Desktop FCP | 672–1168 ms | 256–296 ms (cold first run 952) |
| Desktop CLS, total | 0.217–0.226 | 0.151 |
| Desktop CLS, font swap | 0.011–0.019 | 0.0002 |
| Phone FCP | 1452–1480 ms | 1568–1584 ms |
| Phone CLS, total | 1.075 | 1.001 |
| Phone CLS, font swap | 0.072–0.075 | 0.0009 |
| Phone, reduced motion, CLS | 0.199 | 0.0009 |
| External hosts refused: Vazirmatn / icons painted | no / 0 of 66 (desktop), 0 of 56 (phone) | yes / 66 of 66, 56 of 56 |
| External hosts never answering (as when filtered) | blank page for 23 s and more | FCP 264 ms, everything painted |
| Cross-origin requests | 17–20 (fonts.googleapis.com, cdn.jsdelivr.net) | 0 |

On the throttled phone, first paint is about 100 ms later than with Google Fonts. The likely cause is the preloaded 800
(35 KB), which now downloads alongside the render-blocking CSS on the 1.6 Mbps link. Before, the font files were
requested only after the page was styled. In exchange, the swap no longer moves text. The phone's CLS of 1.0 is A1:
the hero is laid out again once the JS measure runs, which is batch 2.

## Screenshots

`shots/b1-before-*.webp` and `shots/b1-after-*.webp`: `1440-top`, `1440-services`, `1440-faq`, `390-top`, `390-work`
and `390-faq`, plus `blocked-1440-top`, `blocked-390-top` and `blocked-390-faq`, taken with every external host
refused.
