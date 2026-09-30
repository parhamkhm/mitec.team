# Impeccable pass — Phase 3, step 1: polish

The home page after batches 1–7, one final detail pass. Three commits; nothing outside the home page changed.

| Commit | What |
|---|---|
| `impeccable(polish): calculator — the error state named by its line, with the direct-message pair; the section named once its heading exists; from 1024px the choices before the CTA in the tab order` | 07's three leftovers, less the skeleton |
| `impeccable(polish): calculator — the loading skeleton sized to what replaces it at each width` | 07's skeleton |
| `impeccable(polish): details — the cue chip's label gone before its pill on close; the service lift under html.motion; «برآورد سریع» in the FAQ a link to the calculator` | three details |

## The calculator

These were still open from 07, as listed at the end of batch 5.

- **The error state** (pricing unavailable):
  - The line «برآورد در دسترس نیست؛ مستقیم در سفارش‌ساز ادامه دهید» is now the section's name. Before, `#scope`
    carried `aria-labelledby="scope-title"` in the markup, and that heading doesn't exist in the loading or error state,
    so the reference pointed at nothing.
  - Under «ادامه در سفارش‌ساز» it now offers the WhatsApp / Telegram pair (tier 2 of the direct-message hierarchy in
    `11-owner-decisions.md`), the same pair as About's. Before, it offered no direct message.
- **The section's name** is set by `scope.js` when the heading is built: none while loading (`aria-busy`), the heading
  once loaded, the error line on failure.
- **Tab order from 1024px:** site types, pages and add-ons come before «ادامه در سفارش‌ساز». The summary card still
  sits in the start column (grid placement), so nothing moves on screen. Below 1024px the order is unchanged: the
  summary first, the checkout in the bar at the end. Focus is kept when the checkout moves between the two places.
- **The loading skeleton** is sized to what replaces it at each width. Section height while loading minus when
  loaded, in px:

  | Width | 390 | 768 | 1024 | 1440 |
  |---|---|---|---|---|
  | Before | +221 | +241 | −182 | −100 |
  | After | −18 | −3 | +26 | −23 |

  The figures are for the current `pricing.json`; a different number of site types or add-ons changes them.

## Details

- **The Work cue chip on close:** its label fades out in 60ms instead of 260ms, so the label is gone before the
  shrinking pill passes it. Opening keeps 260ms.
- **The Services art lift** (hover and focus) moved from `prefers-reduced-motion: no-preference` to `html.motion`, like
  every other motion on the page: no lift without JS or under reduced motion.
- **The FAQ:** «برآورد سریع» in the first answer links to the calculator. Without JS the calculator is hidden, so the
  link then looks like plain text and takes no pointer. The re-audit found that it still takes keyboard focus there
  (R5 in `20-reaudit-home.md`).

## Checks

- **The sweep** (320, 390, 768, 1024 and 1440 under motion, reduced motion, forced colours and no JS): all 20 clean,
  no sideways scroll, no console errors, every section present.
- **The error state** at 390 and 1440: the section named by the line; its links «ادامه در سفارش‌ساز», «پیام در
  واتساپ» and «پیام در تلگرام»; no duplicate ids.
- **The detector:** see the re-audit (`20-reaudit-home.md`); nothing in it comes from these commits.

## Screenshots

All in `docs/impeccable/shots/` (gitignored, kept on disk):
- `polish-before-{390,1440}-scope-loading`, `polish-after-{390,1440}-scope-loading`: the skeleton;
- `polish-before-{390,1440}-scope-error`, `polish-after-{390,1440}-scope-error`: the error state;
- `polish-after-1440-faq-link`: the first FAQ answer open, with the link.
