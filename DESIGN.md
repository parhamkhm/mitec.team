# DESIGN.md — Mitec (mitec.team)

> Source of truth for all visual work on the Mitec website. Read this before creating or editing any UI.
> If a request conflicts with this file, follow the user's explicit instruction, then update this file.

## North Star

**Read in daylight, recognize in forest, act on one green — and let amber only ever whisper.**

- Sage-light surfaces carry the **reading**.
- Deep forest green (the Instagram color) carries the **identity**, in tiles and bands.
- One action green carries **every clickable primary action and nothing else**.
- Amber is a rare highlight, never an action.

If a new element makes any of these jobs ambiguous, its color is wrong.

---

## 1. Context

- Brand: **Mitec (میتک)**, a studio for websites and digital solutions (online services, CRM, automation, data analytics, support). Target market: Iran.
- Language: **Persian, RTL** (`<html lang="fa" dir="rtl">`). Latin appears only in brand names and the `mitec.team` wordmark.
- Font: **Vazirmatn** (weights 400 / 500 / 700 / 800), self-hosted. Fallback: the device's own Persian font, scaled and re-metricked to Vazirmatn so the swap moves no text (Tahoma, Geeza Pro, Noto Naskh Arabic or Noto Sans Arabic; `tokens.css`), then `Tahoma, "Segoe UI", sans-serif`.
- Numerals: use **Persian digits** (۰–۹) in UI copy and stats.
- Visual link: the site must feel like the same brand as the Instagram page (dark green `#12312A` posts, mint `#57B79A`, amber `#E0A25C`, subtle grid texture, device mockups on green).

---

## 2. Hard rules (never break)

1. **No navy or blue** anywhere, except the `info` status token. Client content is not UI: a project's screenshots, and in Work the ambient backdrop made from them, keep the client's own colours (E2's blue). Those colours never become a token or touch anything we draw.
2. **Components use semantic tokens only** (`--color-*`). Primitives (`--green-600`, `--sage-200`…) appear only in the token file.
3. **One solid primary button per viewport**, and at most one per section.
4. **Action green (`--color-cta`) is only for clickable things.** Stats, chart bars, decorative icons and headings are never action green.
5. **Never put mint `#57B79A` or amber `#E0A25C` text on light backgrounds.** They fail contrast (2.43:1 and 2.07:1).
6. **Never use pure `#FFFFFF`** as the page background or as text on dark. Use `#F5F7F4` for the page and `#F1F5F2` for text on dark.
7. **Every dark area must set `data-surface="dark"`.** Never hand-pick colors inside a dark area.
8. **Forms are always on light surfaces.**
9. **No gradients, glows or amber on buttons.**
10. **No third accent hue.** The palette is green + sage + amber, plus status colors.

---

## 3. Tokens

Put this in the global stylesheet (e.g. `src/styles/tokens.css`) and import it before everything else. Do not add new hex values in component files. If a new color is truly needed, add it here as a primitive first, then map a semantic token to it.

```css
/* ─── Primitives ─────────────────────────────────────────────── */
:root {
  /* Mitec Green — hue ≈163°, anchored on Instagram #57B79A / #12312A */
  --green-50:  #EEF6F2;  --green-100: #D8EDE3;  --green-200: #B3DCC9;
  --green-300: #86C6AC;  --green-400: #57B79A;  --green-500: #2E9478;
  --green-600: #197358;  --green-700: #13604A;  --green-800: #154738;
  --green-900: #12312A;  --green-950: #0B211C;

  /* Sage neutrals — 2–3% green bias */
  --sage-0:   #FFFFFF;  --sage-25:  #F5F7F4;  --sage-50:  #EDF2EE;
  --sage-100: #E2E9E4;  --sage-200: #D2DBD5;  --sage-300: #B8C5BD;
  --sage-400: #7F8D86;  --sage-500: #5F6E65;  --sage-600: #4B5951;
  --sage-700: #34423B;  --sage-800: #22302A;  --sage-900: #13201B;

  /* Amber — Instagram #E0A25C */
  --amber-50: #FCF3E7;  --amber-100: #F7E2C4;  --amber-300: #EDBF84;
  --amber-400: #E0A25C; --amber-700: #8C5313;

  /* Forest surfaces + on-dark text */
  --forest-raised: #173B33;  --forest-elevated: #1E463D;
  --forest-line:   #2E574C;  --forest-line-strong: #5E8479;
  --on-dark-1: #F1F5F2;  --on-dark-2: #B9CBC3;  --on-dark-3: #8FA69C;
  --mint-hover: #72C7AB;

  /* The brand laptop's finish (the home hero's device): silver with a black
     bezel. A device, not a surface — the only place these are used (§5). */
  --device-bezel: #0E1714;       --device-bezel-edge: #2A3632;
  --device-rim: #C9D3CD;         --device-rim-shade: #8E9C95;
  --device-deck-hi: #E6ECE8;     --device-deck-mid: #AAB7B0;
  --device-deck-lo: #8E9C95;     --device-deck-notch: #9AA7A0;

/* ─── Semantic · light (default) ─────────────────────────────── */
  --color-bg:               var(--sage-25);
  --color-bg-alt:           var(--sage-50);
  --color-surface:          var(--sage-0);
  --color-surface-elevated: var(--sage-0);
  --color-surface-sunken:   var(--sage-100);

  --color-text-primary:   var(--sage-900);
  --color-text-body:      var(--sage-800);
  --color-text-secondary: var(--sage-600);
  --color-text-muted:     var(--sage-500);
  --color-text-disabled:  var(--sage-400);

  --color-brand:       var(--green-900);
  --color-brand-hover: var(--forest-raised);

  /* Process steps (§5) — deliberately not remapped on forest */
  --color-step-fill:      var(--green-100);
  --color-step-line:      var(--green-300);
  --color-step-spot-line: var(--forest-line);

  --color-cta:        var(--green-600);
  --color-cta-hover:  var(--green-700);
  --color-cta-active: var(--green-800);
  --color-cta-text:   #FFFFFF;

  --color-tonal:        var(--green-50);
  --color-tonal-hover:  var(--green-100);
  --color-tonal-text:   var(--green-700);
  --color-tonal-border: var(--color-border-hover);

  --color-link:       var(--green-600);
  --color-link-hover: var(--green-700);
  --color-accent:     var(--green-400);   /* decorative only on light */

  --color-highlight:      var(--amber-400);
  --color-highlight-soft: var(--amber-100);
  --color-highlight-text: var(--amber-700);

  --color-border:        var(--sage-300);
  --color-border-subtle: var(--sage-200);
  --color-border-strong: var(--sage-400);  /* ≥3:1 — inputs, outline buttons */
  --color-border-hover:  var(--green-200);

  --color-focus:      var(--green-600);
  --color-focus-halo: var(--green-100);

  --color-success: #177044;  --color-success-bg: #E6F4EC;
  --color-warning: #8A5100;  --color-warning-bg: #FFF4DE;
  --color-error:   #B42318;  --color-error-bg:   #FDECEB;
  --color-info:    #2459A8;  --color-info-bg:    #EAF1FB;

  --color-overlay:   rgba(11, 33, 28, .72);
  --color-glow:      rgba(87, 183, 154, .22);
  --color-grid-line: rgba(18, 49, 42, .05);

  --shadow-card:     0 1px 2px rgba(18,49,42,.06), 0 10px 28px -12px rgba(18,49,42,.14);
  --shadow-elevated: 0 2px 4px rgba(18,49,42,.06), 0 18px 40px -16px rgba(18,49,42,.22);

  /* Home hero (§5 hero exception, §8). Fixed: they belong to objects in the
     scene (the lit screen, its light, the device), not to a surface, so
     [data-surface="dark"] does not remap them. */
  --color-screen:           var(--sage-0);               /* the lit display */
  --color-screen-sheen:     var(--green-50);             /* soft radial at its top centre */
  --color-screen-glare:     rgba(255, 255, 255, .45);    /* diagonal glare from its top-start corner */
  --color-reflection-light: rgba(255, 255, 255, .55);    /* the band that slides once across it */
  --color-headline-accent:  var(--green-700);            /* the marked phrase on the lit screen: never clickable, so not --color-cta */
  --color-glow-strong:      rgba(87, 183, 154, .26);     /* the screen's glow, at its core */
  --color-floor-light:      rgba(214, 236, 226, .14);    /* the light the screen throws on the desk */
  --color-works-tint:       rgba(18, 49, 42, .10);       /* the forest tint over the wall of work: centre … */
  --color-works-tint-edge:  rgba(18, 49, 42, .75);       /* … and edge */
  --color-device-bezel:      var(--device-bezel);
  --color-device-bezel-edge: var(--device-bezel-edge);
  --color-device-rim:        var(--device-rim);
  --color-device-rim-shade:  var(--device-rim-shade);
  --color-device-deck-hi:    var(--device-deck-hi);
  --color-device-deck-mid:   var(--device-deck-mid);
  --color-device-deck-lo:    var(--device-deck-lo);
  --color-device-deck-notch: var(--device-deck-notch);
  --color-device-deck-line:  rgba(255, 255, 255, .9);    /* the deck's top highlight */
  --color-device-shadow:     rgba(11, 33, 28, .7);       /* under the deck and the float cards: forest, never black */
}

/* ─── Semantic · on forest (bands, tiles, footer) ──────────────── */
[data-surface="dark"] {
  --color-bg:               var(--green-900);
  --color-bg-alt:           var(--green-950);
  --color-surface:          var(--forest-raised);
  --color-surface-elevated: var(--forest-elevated);
  --color-surface-sunken:   var(--green-950);

  --color-text-primary:   var(--on-dark-1);
  --color-text-body:      var(--on-dark-2);
  --color-text-secondary: var(--on-dark-2);
  --color-text-muted:     var(--on-dark-3);
  --color-text-disabled:  var(--forest-line-strong);

  --color-cta:        var(--green-400);
  --color-cta-hover:  var(--mint-hover);
  --color-cta-active: var(--green-300);
  --color-cta-text:   var(--green-950);

  --color-tonal:        rgba(87, 183, 154, .14);
  --color-tonal-hover:  rgba(87, 183, 154, .22);
  --color-tonal-text:   var(--green-300);
  --color-tonal-border: transparent;

  --color-link:           var(--green-300);
  --color-link-hover:     var(--on-dark-1);
  --color-highlight-text: var(--amber-400);

  --color-border:        var(--forest-line);
  --color-border-subtle: rgba(255, 255, 255, .08);
  --color-border-strong: var(--forest-line-strong);
  --color-border-hover:  var(--forest-line-strong);

  --color-focus:      var(--green-400);
  --color-focus-halo: transparent;
  --color-grid-line:  rgba(255, 255, 255, .035);
  --shadow-card: none;

  background-color: var(--color-bg);
  color: var(--color-text-body);
}
```

The footer uses `data-surface="dark"` plus `background: var(--color-bg-alt)` (resolves to `#0B211C`).

`tokens.css` also holds the non-colour scales: type (`--text-*`, `--lh-*`, and `--ls-*`, which are all 0 — §13), `--section-pad: clamp(64px, 11vw, 176px)` for section padding (the phone floor is 64px: 96px put about 1.6 screens of padding between the sections at 390), and the motion values (`--dur-reveal`, `--dur-media`, `--stagger`, `--reveal-rise`, `--ease-portal`) on top of the design system's `--dur` / `--ease-*` scale. All durations go to 0 under reduced motion.

### Tailwind v4 (if the project uses Tailwind)

Map the semantic tokens in `@theme` so utilities pick up the dark-scope remap automatically:

```css
@theme {
  --color-bg: var(--color-bg);
  --color-bg-alt: var(--color-bg-alt);
  --color-surface: var(--color-surface);
  --color-ink: var(--color-text-primary);
  --color-body: var(--color-text-body);
  --color-secondary: var(--color-text-secondary);
  --color-muted: var(--color-text-muted);
  --color-brand: var(--color-brand);
  --color-cta: var(--color-cta);
  --color-cta-hover: var(--color-cta-hover);
  --color-cta-text: var(--color-cta-text);
  --color-tonal: var(--color-tonal);
  --color-tonal-text: var(--color-tonal-text);
  --color-line: var(--color-border);
  --color-line-subtle: var(--color-border-subtle);
  --color-line-strong: var(--color-border-strong);
  --font-sans: "Vazirmatn", Tahoma, "Segoe UI", sans-serif;
}
```

Use `bg-cta text-cta-text`, not `bg-[#197358]`. Arbitrary hex values in class names are not allowed.

---

## 4. Color roles at a glance

| Role | Light | On forest | Use for |
|---|---|---|---|
| Page background | `#F5F7F4` | `#12312A` | Canvas |
| Alt section | `#EDF2EE` | `#0B211C` | Alternating sections, trust strip, footer |
| Card surface | `#FFFFFF` | `#173B33` | Cards, inputs, stats |
| Heading text | `#13201B` | `#F1F5F2` | Headings, labels, numbers |
| Body text | `#22302A` | `#B9CBC3` | Paragraphs |
| Secondary text | `#4B5951` | `#B9CBC3` | Descriptions, inactive nav |
| Muted text | `#5F6E65` | `#8FA69C` | Captions, hints, placeholders (≥14px) |
| Brand | `#12312A` | `#12312A` | Logo, dark tiles/bands, stat numerals |
| Primary CTA | `#197358` / white | `#57B79A` / `#0B211C` | Main button only |
| Tonal | `#EEF6F2` / `#13604A` | mint 14% / `#86C6AC` | Secondary conversion, icon chips |
| Border strong | `#7F8D86` | `#5E8479` | Inputs, outline buttons |
| Highlight | `#F7E2C4` stroke | `#E0A25C` text | One headline phrase |

**Area budget per page:** light neutrals 60–65% · forest 20–25% (max 30%) · ink and lines ~8% · action green 3–5% · mint 1–2% · amber ≤1%.
If action green goes over ~5%, something that isn't clickable is green. Fix it.
The home hero's forest scene (§5) is measured as the hero, not against this budget: it fills the first screen and then leaves.

---

## 5. Component recipes

### Buttons (4 levels + disabled)

| Level | Light | On forest | When |
|---|---|---|---|
| **Primary** | bg `--color-cta`, text `--color-cta-text`, hover `--color-cta-hover`, active `--color-cta-active` | same tokens (resolve to mint + dark text) | The one main action: «شروع پروژه», «ارسال درخواست» |
| **Tonal** | bg `--color-tonal`, a 1px `--color-border-hover` edge (`--color-tonal-border`), text `--color-tonal-text`, hover bg `--color-tonal-hover` (the edge stays) | same fill and text tokens, no edge | Second conversion path: nav «شروع پروژه», «مشاوره رایگان», the channels «پیام در واتساپ» / «پیام در تلگرام» |
| **Outline** | transparent, 1px `--color-border-strong`, text `--color-text-primary`, hover bg `--color-surface-sunken` | same tokens | Navigation-type actions: «دیدن نمونه‌کارها» |
| **Text link** | `--color-link`, underline, `text-underline-offset: 5px` | same | Tertiary actions, inline links |
| **Disabled** | bg `--sage-100`, text `--sage-400` | bg `--forest-raised`, text `--forest-line-strong` | Never pale green |

- Solid buttons get `border: 1px solid transparent` so they stay visible in `forced-colors` mode.
- Flat fills only: no gradient, glow or colored shadow.
- RTL arrow icons point **left** (←) for "forward/next".
- Sticky nav: the nav CTA may switch from tonal to primary **only after** the hero's primary button scrolls out of view.

```css
.btn-primary { background: var(--color-cta); color: var(--color-cta-text); border: 1px solid transparent; }
.btn-primary:hover  { background: var(--color-cta-hover); }
.btn-primary:active { background: var(--color-cta-active); }
.btn-tonal   { background: var(--color-tonal); color: var(--color-tonal-text); border-color: var(--color-tonal-border); } /* edge on light only */
.btn-tonal:hover { background: var(--color-tonal-hover); }
.btn-outline { background: transparent; color: var(--color-text-primary); border: 1px solid var(--color-border-strong); }
.btn-outline:hover { background: var(--color-surface-sunken); }
```

### Focus

```css
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
  box-shadow: 0 0 0 6px var(--color-focus-halo);
}
```
Never remove outlines without a replacement.

### Navigation

- Background: `--color-bg` at 88% opacity + `backdrop-filter: blur(12px)`; add a `--color-border-subtle` bottom border once scrolled.
- Links: `--color-text-secondary`. Active link: `--color-text-primary` + 2px `--color-cta` underline.
- Nav CTA: **tonal**.
- Up to 860px it is a bar: the logo at the start edge (right); at the end edge (left) a tonal `btn--sm` «شروع پروژه», always there, and the 44px menu toggle beside it, so a way to start a project is never out of sight on a phone. They never overlap or wrap from 320px (below 360px the button drops its arrow).
- The menu opens from the toggle's corner: a panel hanging from the bar's end side, full width between the gutters on phones and 400px at most (room for the channels side by side), growing out of its top-left (scale .96 → 1 with opacity, `--dur` in, `--dur-fast` out). Its links, then the channels pair (Direct messages below).
- While the menu is open the toggle reads «بستن فهرست» and shows ×, the rest of the page is inert, and Tab cycles between the toggle and the menu. Escape closes it and returns focus to the toggle; a tap outside closes it.
- Home page: the nav overlays the hero (fixed). It uses the forest variant (`data-surface="dark"`, **94%** fill, no bottom border) over the hero scene and switches to light once the visitor is inside the room. 94% rather than a see-through 70%, because late in the scene it is the light room that shows through, and the tonal CTA needs 94% to stay at 4.73:1 on it.

### Direct messages

A direct message is a success in its own right (PRODUCT.md), so every place that offers one uses the same three tiers:

| Tier | Element |
|---|---|
| **1** | «شروع پروژه»: the one primary button. |
| **2** | «پیام در واتساپ» and «پیام در تلگرام»: **tonal** buttons with the brands' marks (Simple Icons, CC0; monochrome in `currentColor`, never the brand colours), side by side, the same size as each other and smaller than the primary. Never stacked: where the pair is under 352px wide (phones), the visible labels shorten to «واتساپ» and «تلگرام» and the full names stay as each button's `aria-label`. |
| **3** | «پیگیری سفارش» and Instagram: plain text links. |

- Where: the closing band (all three tiers), the phone menu (ends with tier 2), About (one tier-2 pair under the cards, with the line «مستقیم با خود تیم حرف بزنید»), the footer (the three channels as small icon + text links). Services' «بپرسید» scrolls to the closing band's tier 2.
- The addresses come from `app.config.js` (`contact`); the markup carries the same ones for visitors without JS.

### Hero

Inner pages (and any hero that is not the home portal):

- Light canvas. Text on the start (right) side, visual on the end (left) side.
- Headline in `--color-text-primary`, Vazirmatn 800. Highlight **one** phrase with an amber highlighter stroke:
  ```css
  .headline-mark { background: linear-gradient(transparent 55%, var(--color-highlight-soft) 55%); }
  ```
- Eyebrow: `--color-tonal-text`, small, weight 700.
- The visual sits in a **forest tile** (`data-surface="dark"`, radius 16–20px) with the grid texture and one mint glow behind the mockups. This is the Instagram post echo.
- One primary + one outline button. Nothing else solid.

**Home: the laptop portal (hero exception).** The home hero is a full-viewport forest *scene*, not a light canvas, and it does not count as the one forest band allowed between hero and footer (§6).

- **The device.** The brand laptop: drawn in CSS, never a raster mockup (it is scaled up during the dive and must stay sharp). One component, `.laptop` in `components.css` (lid, camera, display, deck); the hero draws its lid and deck from those parts on its own frame and cuts the display out of the lid. Display 16:10. **Silver with a black bezel**, so it separates from the forest wall: lid `--color-device-bezel` inside a 2px `--color-device-rim` ring and a 1px `--color-device-rim-shade` edge; bezel inner line and camera dot `--color-device-bezel-edge`; keyboard deck a single-hue gradient `--color-device-deck-hi → --color-device-deck-mid (70%) → --color-device-deck-lo` with a 1px `--color-device-deck-line` highlight along its top, a `--color-device-deck-notch` thumb notch and a soft `--color-device-shadow` under it. The `--color-device-*` tokens are fixed (a device is an object, not a surface: `data-surface` never remaps them) and the laptop is the only thing that uses them. It stands on the forest wall with the grid texture, the wall of work, the screen's glow and its light on the desk (§8).
- **The lit screen.** Under motion the display is lit: `--color-screen` under one static sheen (`--color-screen-sheen`, a soft radial at its top centre) and a diagonal glare from its top-start corner, which is the right on this RTL page (`--color-screen-glare`, 45% white, gone by 32%).
- **The copy** sits centred on the lit display, as wide as the display less 48px a side, in the **light token set**: portal.js drops the copy's `data-surface` whenever it fits on the screen (an inline script does the same before first paint from 760px, and the static fallback puts it back). Eyebrow: a tonal pill (`--color-tonal` fill, 1px `--color-tonal-hover` edge, `--color-tonal-text`). H1 800, `clamp(36px, 5.4vw, 76px)`, letter-spacing 0, `--color-text-primary`; its marked phrase «فراتر از طراحی سایت؛» takes the standard highlighter stroke, with the phrase in `--color-headline-accent` (green-700). The accent is never clickable, so it is deliberately not `--color-cta` (green-600): action green stays on clickables only (§2, rule 4). Sub `--color-text-secondary`. One light primary + one outline button on white. If the copy cannot fit, the H1 shrinks towards its clamp floor (36px) first. Until Vazirmatn 800 has landed, that fit also counts the H1's lines from each word's stored width in Vazirmatn (the inline layout script) and holds the H1 at that height, so the swap does not change its size or line count. On phones, or where it still cannot fit, the copy stacks above the laptop. There it sits on the forest wall, so it keeps `data-surface="dark"` and the forest treatment: the highlighted phrase is `--color-highlight-text` (amber-400, 6.33:1 on forest) instead of the stroke, the outline edge is `--color-text-muted` (5.41:1), and the outline button is filled with the wall's own forest. The laptop starts under the copy (cropped at the bottom where there is no room, never pulled up behind it) and rises late in the lean, once the copy has mostly faded, so its lit screen never sits behind the copy's forest-set text; it is in place when the statement starts. Stacked, the lit screen is not a blank white field at rest: it shows the first project's screenshot (`portfolio.json` → the first `image.src960`, `object-fit: cover`, `object-position: right top`), which fades out with the copy (gone by 15% of the dive), before the statement comes up on the glass.
- **Float cards.** Three small decorative UI cards overlap the lid's edges and say "beyond web design" before anyone reads the H1: an SEO pill (search icon, «رتبه‌ی ۱ گوگل», the digit in `--color-highlight`) on the top edge near the top-left corner, −2°; a CRM order (bag icon tile, a title, a muted line and a status dot) on the right edge, 2°; an analytics card (a muted label, «۳۲٪ رشد» in `--color-tonal-text`, and a small area + line chart) on the left edge, −3°. The copy lives in `site-copy.json` → `hero.floatCards`; the figures are part of the illustration, not claims about the team.
  - On forest tokens: `--color-surface-elevated` at 92%, 1px `--color-border` (forest-line), radius 18px (the pill 999px), a `--color-device-shadow` drop shadow and a 1px `--color-border-subtle` inset top highlight; caption to body-sm text, 800 titles. The status dot and the chart are `--color-tonal-text` (green-300), not the forest CTA mint (green-400): nothing on the cards is clickable.
  - `aria-hidden`, never focusable. They live in the stage, not the frame, so they never balloon; portal.js places them on resize from the measured lid. A side card reaches at most 36px onto the display (the copy keeps 48px there), and where the H1 is wider than that it slides along its edge to the nearest spot 20px clear of every line and button, or sits that layout out. The SEO pill overlaps the lid by 12px, so its text line stays above the silver rim.
  - They stagger in after the H1 (opacity + 12px, 80ms apart), lean 8–14px toward a fine pointer, and in the first ~15% of the dive drift 48–72px outward and fade out, gone before the statement. Hidden stacked, tight, below 760px and without motion.
- **Wall of work.** Behind the laptop, a tilted plane of the portfolio's own screenshots (`portfolio.json` → `image.src960`, cycled into 5 × 4 tiles, so a new project appears by itself): 2400px wide, `rotateX(52deg) rotateZ(-14deg)` under a 1400px perspective, 28px gaps, 2:1 tiles cropped from the top right, radius 14px, the plane at .34. It is texture, never content: a radial mask (an ellipse 62% × 58% of a 1.2 × 1.3-viewport box, solid at the centre, gone by 78%) fades it out, a forest tint on top (`--color-works-tint → --color-works-tint-edge`) mutes the client colours without a filter, and the display is cut out of it like the wall (one mask: the fade less the display), so it never shows inside the screen. It scales with the frame through the dive; nothing in it moves. The images load lazily at low priority, after first paint, when the page is idle, so they never compete with the H1 (LCP). Not in the lite scene, stacked, or without motion.
- **The dive.** Scrolling carries the camera into the screen: the cards drift off and the copy lifts off, and the lit screen shows the intro statement — «آماده‌اید زیرساخت دیجیتال کسب‌وکارتان را بسازید؟» / «سایت شما. سرویس شما. مسیر رشد شما.» — in dark text (light tokens), revealed by whole words and phrases (never by characters), with a thin loading line (`--color-border` track, `--color-text-secondary` fill: not the CTA colour, it is not clickable). Then the screen "loads": the glass, with its sheen and glare, fades to the light room — the Proof section, nearly the same daylight, so there is no flash — and the camera passes through the display into it.
- **Readability.** The statement is only ever on the lit glass: while it is visible it lies inside the display at every size (checked against the measured `--say-max` at 1920, 1440, 1280×800, 1024, 768 and 390), and it reaches opacity 0 before the glass starts to fade. The copy is gone before the statement starts.
- **Without motion** (reduced motion, no JS, forced colours): unchanged. A forest band with the copy (forest tokens), then the statement on the screen of a static laptop outline, then Proof as an ordinary light section. No cards, no wall of work.

### Stats / trust bar

- White surface card on canvas, `--color-border-subtle`.
- Numerals: `--color-brand`, weight 800, Persian digits, `font-variant-numeric: tabular-nums`.
- Labels: `--color-text-secondary`.
- **No buttons inside the stats bar.**
- On the home page it lives in the Proof room the portal opens into: eyebrow, heading, one line, then the stat card, nothing else (no project-name list: projects live in Work). Stats are real facts only (`src/data/site-copy.json`); the delivered-projects figure is the number of projects in `src/data/portfolio.json`.

### Service cards

- Home: six cards in a grid of 3 columns from 1024px, 2 from 760px, 1 below.
- `--color-surface`, 1px `--color-border-subtle`, `--shadow-card`.
- Icon in a 36–40px chip: bg `--color-tonal`, icon `--color-tonal-text`.
- Title `--color-text-primary`, description `--color-text-secondary`.
- **The whole card is its link.** The link («شروع پروژه ←», «بپرسید ←», «جزئیات پشتیبانی ←») sits on the card's last line, the same line in every card of a row, as a box no wider than its label; its `::before` covers the card, so a tap anywhere opens it. Keyboard focus draws the ring on the card (where `:has()` is supported; otherwise on the link).
- Hover (only on devices that hover, so a tap never leaves it stuck): border → `--color-border-hover`, shadow → `--shadow-elevated`.
- Phones (below 760px): the chip and the title share the first row, and the card's padding is `--pad-card` (24px) instead of `--pad-card-lg`.
- Home: each card carries a decorative illustration (`public/images/services/service-N-768.webp` / `-1536.webp`, transparent; `alt=""`, `aria-hidden`, lazy, `srcset` + a `sizes` that follows the image's own box: 280px from 1200px, a quarter of the width less 80px from 1024, 37.5% less 64px from 760, and 60% less 48px on phones), absolutely positioned in the end-bottom corner (bottom left in RTL): 75% of the card's width (60% below 760px), `object-fit: contain` anchored left bottom, and below 1200px held to 42% of the card's height so a wide, short card never puts it behind the paragraph. Between it and the content sits a single-hue fade, `--color-surface` on the start side (to 25%) to transparent (80%), so the chip, the title and the first lines stay on near-solid surface. Opacity .35; on hover or focus-within .6 with a 4px lift and `scale(1.03)` over `--dur-slow` (opacity only under reduced motion). Hidden in forced colours. The card keeps its radius, border and shadow with `overflow: hidden`; the image is out of flow, so it never shifts the layout.

### Process steps

- **Layout.** Five across with the rail above them from 1200px; below that the steps stack along a vertical rail on the start side, and from 760 to 1199px each stacked card has two columns (the numeral and title on the start side, 11rem; the paragraph beside them, centred on them). The five-across row may run past the 1200px container, up to 1440px wide (never closer than the gutter to the screen's edge), with the cards 12px apart and 20px padding, so the lit card's paragraph keeps to two lines where it can; every card in the row is as tall as the tallest. With today's texts: two lines each at 1920; at 1440 all but step 2; at 1366 and 1280 some or all run to three (listed in `docs/copy-todo.md`).
- White step cards on a rail. As the rail's forest fill (`--color-brand`) reaches a step, the card fills with `--color-step-fill` (`--green-100`) from the start edge, its edge turns `--color-step-line` (`--green-300`), and its numeral comes up to full `--color-brand`. Text keeps its colours: title 13.71:1, secondary 6.02:1 on the fill.
- **One forest "spotlight" at a time** — the step whose dot the rail reached last. It sets `data-surface="dark"` (text remaps to on-dark), cross-fades a `--color-brand` layer in over `--dur-slow` on `--ease-swap` (slow at both ends, through the middle in about 40ms), its text switching colour in one step at that midpoint (entering and leaving), so no text sits on a half-lit card in the wrong colour for more than a frame or so; it lifts 6px, drops its shadow and takes a `--forest-line` edge. This is a documented exception to "never a text-heavy forest card" (§6): one short step, and never more than one.
- **The rail fills as you scroll.** Stacked, its head follows a reading line at 60% of the viewport, and each card fills over the stretch of rail leading into its dot. In the five-across row the head starts only once the whole row is in view and reaches the end (step 5 lit) by the time the row's top is 25% down the viewport; there a card changes in one step as the head passes its dot (its fill, edge and numeral ease in over `--dur-slow`), so it is either done or not started and no seam ever rests across a paragraph. Arriving by the nav link or a `#process` hash shows the end state at once, until the section next leaves the screen.
- Nothing here is clickable, so nothing here is `--color-cta`.
- Reduced motion / no JS: every step shows filled, no spotlight.

### Work coverflow

- **A forest band** (`data-surface="dark"`, `--section-pad`): a documented exception, next to the hero scene and the CTA band (§6). The centred heading (eyebrow «نمونه‌کارها», title, one line), then the stage, then the caption, then the controls.
- **Ambient backdrop.** Two full-bleed layers of the active project's pre-blurred screenshot (`public/images/work/{id}-home-ambient.webp`; no CSS blur) crossfade over 700ms when the slide changes, at opacity .55 (.7 while the pointer is on the centre card). A radial overlay above them runs from 30% forest in the middle, behind the stage, to solid `--color-bg` at the edges, so the band always reads as mitec forest and the heading sits on near-solid forest (12.74 / 8.04 over the lightest file). The client's colours appear only here and in screenshots (§2 rule 1). Only the first file is in the markup; the others load when needed. Hidden in forced colours.
- **Screenshot-only faces.** A card's front is the client's website and nothing else: no gradient, no tags, no title, no button. Its shape is one variable on the section, `--work-card-ratio: 16 / 10` (`4 / 5` brings back portrait cards); `clamp(300px, 42vw, 600px)` wide; `86vw` up to 989px (the sheet breakpoint), held down on a short screen to at most `(100svh − 240px)` × the card ratio but never under `42vw`, with the stage growing to the card's height + 64px (at least 300px). The screenshot covers it from the top right (`object-position: right top`), where these RTL sites keep their logo and hero text; `srcset` 960w / 1920w, the active card eager, the others lazy. What separates a white site from the dark band: a 1px `--color-border` edge, `--shadow-elevated` and a hairline top highlight (`inset 0 1px 0 --color-border-subtle`, on a layer over the image). No halo, no forest frame. `--radius-xl`.
- **The card is the control.** The centre card's front is one `<button>`, named «{name} — مشاهده‌ی جزئیات پروژه», with `aria-expanded` for its details; the side cards' fronts are named «رفتن به پروژه‌ی {name}» and move the carousel. The screenshot's `alt` stays descriptive. Pointing at the centre card (fine pointers): the screenshot zooms to 1.03 inside it (the card keeps its size), the card lifts 4px, the backdrop brightens, the cursor is a pointer.
- **Cue chip.** Exactly one, on the centre card only, at its bottom-end corner (bottom left on this RTL page), 12px in; never on side cards; it fades out while the card is turned over. A 40px circle with the «+» icon (18px); opened, a pill with «جزئیات پروژه». Fill `--color-surface` at 88% (no `backdrop-filter`), text `--color-text-primary`, 1px `--color-border-subtle`. It opens with transforms only: the pill layer scales out from the circle's width at the end side, the label fades and slides in 6px, the icon stays put; 260ms `--ease-out`. Collapsed at rest on fine pointers; open on hover over the card, on keyboard focus of the card, and during the first-view hint; always open, with the shorter «جزئیات», on touch, coarse pointers and below 760px, and always open under reduced motion. The label is at least 7.94:1 at the worst pixel over the lightest screenshot (Karamad) and 11.26 over the darkest.
- **First-view hint.** Once per page load, the first time the section is half in view: the centre card's chip opens, a ring pulses out of its circle twice (scale 1 → 1.6, opacity .5 → 0, 1.2s), it holds 2.4s and closes. Never again on later slide changes; autoplay carries on meanwhile. No pulse under reduced motion.
- **Caption.** Under the stage, `--space-5` below it and `--space-4` above the controls, centred and as wide as the card: the active project's name (the optional `name` in `portfolio.json`, else the title before «؛»; 800, `--text-h4`, `--color-text-primary`) and one line of `summary` (`--text-body`, `--color-text-muted`; two lines below 760px; the full text in `title`; the tags joined with « · » if there is no summary). Tags are not repeated here; they live on the back. Its height is reserved, so nothing below moves when it changes. It moves with the cards: the old one fades out 8px the way they travel (180ms), the new one comes in from 12px on the other side (320ms after 100ms, `--ease-out`), name then summary 60ms apart; a 150ms crossfade under reduced motion. A soft forest scrim behind it keeps the muted summary legible over any client's light (≥ 4.68:1; the name ≥ 11.16). `aria-live` is `off` while autoplay turns the cards and `polite` only for a manual move, then `off` again. Dimmed to .35 while the card is turned over. Plain text, never a link.
- **Coverflow.** Stage `perspective: 1400px`, `clamp(300px, 30vw, 440px)` tall; the cards share one grid cell. Offsets 0 / ±1 / ±2 / ±3 (staging): translateX 0 / 50% / 88% / 124% of the card, scale 1 / .74 / .56 / .46, rotateY 0 / 34 / 46 / 48deg (each side card turned to face the centre), opacity 1 / 1 / .3 / 0 (±1 fully opaque: the dim layer alone sets it back, so no card shows another through it), z 30 / 20 / 10 / 0. Measured: from 1280px each ±2 card is about 90% on screen and 42–44% clear of the ±1 card in front of it, which stays ~55% clear of the centre card; nothing overlaps the centre card or its chip, and the page never scrolls sideways (`overflow-x: clip` on the band). Below 760px the side cards peek at ±62%, 16deg, scale .86. Side cards dim under a forest layer (.45 / .6), never a CSS filter. Transform and opacity only, 800ms `cubic-bezier(.25, 1, .5, 1)`.
- **Endless, for any number of projects.** A fixed pool of seven cards sits at offsets −3 … +3 of an unbounded index (±3 invisible and `inert`); each shows `projects[mod(index, N)]`, so a short list repeats as clones on screen. A card pushed past ±3 jumps, invisible, to the other end and swaps its project there, so no card ever crosses the stage (checked frame by frame through rapid clicks and dot jumps). A card leaving for ±3 fades out in 380ms, which frees its slot quickly; faster input queues. With one project its clones fill the stage and there are no controls. Adding projects to `portfolio.json` needs no code change.
- **RTL.** Next is the card on the LEFT: ArrowLeft, the left arrow and a swipe to the right go forward; ArrowRight, the right arrow and a swipe to the left go back. Keys work only while focus is inside the carousel. Swipes (touch, 45px) run on a `touch-action: pan-y` stage, so the page still scrolls vertically.
- **Controls.** Two 44px round arrows at the stage's edges (on-dark outline: `--color-border-strong` edge, 3.37:1; a 72% forest fill), hidden below 760px. Dots: the active one a 28px `--color-accent` pill (5.77:1), the rest 8px in `--color-border-strong`, 24px apart, each a 24 × 44px target, named by project («رفتن به پروژه‌ی {name}»); the pill grows and its neighbours step aside by transform only. With more than 7 projects the dots become «۳ از ۱۲» and a thin progress bar. A 36px pause/play toggle («توقف چرخش» / «ادامه‌ی چرخش») with a 44px target. Every control has a Persian `aria-label`.
- **Autoplay.** Forward every `data-autoplay-delay` ms (4500 on the section), forever. It pauses on hover, on keyboard focus inside, while a card's details are open, off screen and in a background tab, and for 8s after any manual move or after the details close. `data-autoplay="false"` starts it paused until play is pressed; reduced motion turns it off (and hides the toggle).
- **Stage tilt.** On a fine pointer the whole stage turns up to ±3deg toward the pointer, damped on the shared engine. Never on touch or under reduced motion.
- **Details: the card flip** (from 990px). The centre card (Enter or Space on it, or a click) turns over in place: `rotateY(180deg)` over 700ms `cubic-bezier(.2, .8, .2, 1)`, growing to 1.04 while the side cards dim a little more (+.15). Two faces of exactly the card's size sit back to back in a `preserve-3d` inner, each with `backface-visibility: hidden` and the card's own radius and border; the face not in view is `inert`. Transform and opacity only.
  - **The back**: the project's own ambient file, cover, under forest at 88% that deepens to 96% from 42% to 65% of its height (Karamad's file is near-white at the foot), so every text passes at the worst pixel under it, measured on the 16:10 cards at 1024–1920px for all three projects and tabs: title 11.14, selected tab 4.99, other tabs 5.85, text 6.96, «دیدن سایت» 12.14, note 4.66, tags 5.09. Grid rows, padding `--space-5`: (1) the tags at the start, one row of whole chips (a chip that does not fit wraps out of sight), and a 40px × «بستن جزئیات» at the end, its edge `--color-text-muted`; (2) the title, 800, at most two lines; (3) a segmented control «نیاز» · «راهکار» · «نتیجه» (`role="tablist"`, roving tabindex, ArrowLeft for the next tab on this RTL page, Home / End), the selected tab a tonal pill that slides under it (transform only); (4) the chosen text in `--text-body-sm`, line-height 1.8, in an inset panel that fills the rest of the card, so a short text never leaves a bare gap: centred when it fits, otherwise from the top, scrolling inside with a soft fade at the foot while there is more below; the card never grows; tabs crossfade the text (opacity and a 6px rise, 200ms); (5) «دیدن سایت» as a full-width outline button (new tab), or the "link after client approval" note in `--color-text-muted`. The default tab is «نیاز». On cards up to 540px wide the rows tighten (a container query); from 1024px every current text fits its panel without scrolling.
  - **Behaviour.** Focus moves to the first tab on the turn and back to the card on the way back. It turns back on ×, Esc, or a click anywhere outside the card. Any move of the carousel (arrow, dot, swipe, a side card) turns it back first; the carousel moves once it has. The stage tilt holds still meanwhile. Under reduced motion there is no rotation: the two faces crossfade (250ms).
- **Details: the bottom sheet** (below 990px). A 16:10 card there is under ~260px tall, too short to read its back, so the centre card opens the same back as a bottom sheet instead: a native modal `<dialog>`, full width, at most 88vh, the screenshot (natural ratio) on top, then the back's own content (the same node, moved in and back; no second copy). It slides up with transform (fades under reduced motion). Focus starts on the first tab and stays in the sheet (Tab wraps); Esc, a tap on the veil or × close it and return focus to the card; the page behind is `inert` and does not scroll.
- **Scroll preview** (opt-in, per project): when a project has `image.full` (a tall full-page screenshot, WebP), hovering or focusing its centre card (fine pointers, no reduced motion) pans that image from top to foot over 6s and eases it back in 600ms on leave. Transforms only and no measuring: the image's wrapper drops one card height while the image rises its own height. The image loads only when its card first becomes the centre one. Without `image.full`, nothing changes. See `docs/portfolio-guide.md`.
- **No JS** (or if the data cannot load): `.work-list` is a scroll-snap row: each item is the screenshot (the same face), then the name and summary, then the need / built / result and the link, so nothing is hidden. This row is written in `index.html` by hand and must mirror `portfolio.json`.
- **Reduced motion:** flat (no rotateY, no scale), the centre card alone (the others invisible and inert); a slide change is a 250ms crossfade in place, with no autoplay and no tilt; no pulse, zoom, lift or scroll preview; the chip stays open with its label; a card's two faces crossfade instead of turning; the caption and the sheet crossfade.

### About (team cards)

- One white card per member (`card--surface card--pad-lg`), two per row from 760px; an odd count puts the last card centred at a column's width, never alone at the start of a row.
- The card is a container. At 480px and wider: an 88px round photo beside the name, role and bio, all aligned to the top so names in a row sit level. Narrower (phones, the two-column tablet grid): a 64px photo beside the name and role, and the bio under them across the card.
- **Photos.** Square WebP, at least 176px (88px at DPR 2), `width` / `height` set, `alt` the member's name; the circle crops it (`object-fit: cover`). Until one exists, the dashed «عکس» slot stands in.

### Client list / testimonials

- Client names/logos monochrome `--color-text-muted` on `--color-bg-alt`; hover → `--color-text-primary`.
- Testimonials: white card, decorative quote mark in `--amber-300`. On the home page the section is `hidden` until real quotes exist; when it returns, swap `band` / `band--alt` on the sections after it so the backgrounds keep alternating.

### Forms (always light)

- Container: `--color-surface`, `--color-border-subtle`.
- Label: `--color-text-primary`, weight 600. Hint: `--color-text-muted`.
- Input: bg `--color-surface`, 1px `--color-border-strong`, text `--color-text-primary`, placeholder `--color-text-muted`.
- Focus: border + outline `--color-focus`, halo `--color-focus-halo`.
- Error: border `--color-error`, message `--color-error` **with icon and text**. Never color alone.
- Success message: `--color-success` on `--color-success-bg` (hue 145°, deliberately different from brand green).
- Submit: primary button.
- **The pricing calculator** (Quick scope) renders everything — packages, items, prices, days, labels — from the pricing document (`docs/pricing-guide.md`); no number lives in its code, and the few strings the document may leave out have defaults in `scope.js` (`COPY`), each overridable by the `section` field of the same name.
  - Layout, count-proof: a 4fr / 8fr pair from 1280px, 5fr / 7fr at 1024–1279px. The start column is one **summary card** — the base title, what is always included (one column of titles), «شامل N صفحه», then the total, the chosen-count line, a row with «جزئیات برآورد» and the «اعداد نمونه» badge (in the card), the breakdown when it is open, the full-width CTA and the disclaimer. From 1024px it is always `position: sticky` under the nav and never taller than the screen (`max-height: 100dvh` less the nav and 48px): the head, the pages line and the checkout keep their size, and only the included list gives way and scrolls inside the card (keyboard-focusable, named by the card title), with a fade to `--color-surface` at its foot while there is more below. The items' descriptions show under their titles only when the whole list fits without scrolling (measured on resize, never on scroll). The card lets go where the columns end. The end column is the page slider, then the add-on tiles. Below 1024px: summary → pages → tiles in one column, and the total + CTA become a bar pinned to the bottom of the screen while the calculator is on it (`--color-surface`, top edge `--color-border-subtle`, safe-area padding), coming to rest at the section's end so it never covers what follows. The bar is one row: at the start a 32px tonal chevron button (`--color-tonal`, `--color-tonal-text`; a 44px target drawn nowhere; named «جزئیات برآورد» by its visually hidden text), then the figures, then the CTA. While the numbers are placeholders the duration line ends with a hairline and a small «نمونه» (`--text-eyebrow`, `--color-text-muted`, hidden from screen readers, which have the heading's badge) in place of the badge. The breakdown opens above the row, so the bar grows upward and the chevron turns over (at most 40% of the screen, then it scrolls inside, keyboard-focusable). Under 400px the bar's side padding is 16px and the CTA's 10px; under 360px the CTA takes its own full-width row. Closed, the bar is 74px tall from 360px (83 at 768) and 118px at 320. Below 768px the checklist folds after four items behind «همه‌ی موارد».
  - Site-type tabs: one segmented track on `--color-surface-sunken`; the selected tab is `--color-surface` with `--shadow-card`. Native radios, 44px targets. Below 1024px, where the six don't fit one row, they wrap into a grid inside the same track (three per row, two below 600px), so every type is always in view; a long label may take two lines at 320px.
  - **Choices are kept across site types.** An add-on the new type doesn't offer stays chosen but out of sight, out of the count and out of the estimate, and comes back with a type that offers it. The slider starts at the pages last asked for, never below the new type's included pages.
  - **The breakdown** («جزئیات برآورد», `section.breakdown`): in the card a text button in `--color-link` 700 with a plus / minus, at the start of its row (a 44px target drawn nowhere), with the «اعداد نمونه» badge at the row's end while the numbers are placeholders; in the bar the chevron above, with the short «نمونه», so the figure carries its caveat in a screenshot of the bar too. Collapsed by default (`aria-expanded`); open, a list in an inset panel (`--color-surface-sunken`, `--radius-lg`): the site type, «N صفحه‌ی بیشتر» for the pages beyond those included (`section.extraPages`), then each chosen add-on; name at the start in `--color-text-secondary`, amount at the end in `--color-text-primary` 700, a free add-on «بدون هزینه‌ی اضافه» in `--color-text-secondary` 500 (muted is 4.36:1 on sunken). It follows every change live and fades up 6px over `--dur` as it opens (no motion without `html.motion`).
  - Add-on tiles: `grid-auto-rows: 1fr`, so every tile in a grid is as tall as the tallest, and every count forms complete rows. From 1280px, 3 per row on a 6-track grid (each tile spans 2): one tile left over spans the row, two left over take half each. Up to 1279px, 2 per row and an odd last tile spans both; below 768px, 1 per row. More than 9 add-ons (6 below 1024px) show the first 9 (6) and a full-width text button «نمایش همه‌ی امکانات (N)» / «نمایش کمتر» (`section.showAllAddons` / `showFewerAddons`); a chosen add-on is never folded away, and opening moves focus to the first new tile. Tile: padding `--space-4`, no height floor (the row height comes from the content); title (at most two lines) and a 32px `+` / `−` circle on the first line, `--space-1` to the description (at most two lines; full texts in `title`), the price «از X» (`--color-text-secondary` 700) pushed to the bottom; a free add-on shows «بدون هزینه‌ی اضافه» there (`section.free`) in `--color-text-muted` 500 (5.38:1 on the tile, 4.89 on a chosen one), so every tile's last line aligns. The data caps an add-on title at 28 characters and a description at 48. The whole tile is an `aria-pressed` toggle: 1px dashed `--color-border` while off, `--color-border-hover` on hover, solid `--color-border-hover` on `--color-tonal` when on, with the circle filled `--color-tonal-text`. Optional `group` in the data adds one small heading and grid per group.
  - The page slider is interactive, so its fill and thumb are `--color-cta`; the track is `--color-border`. Where a type includes more pages than its minimum, a 2 × 14px `--color-text-muted` tick across the track marks the last included page (the steps up to it cost nothing). Under the slider, «هر صفحه‌ی بیشتر: از {price}» (`section.perPage`; `--color-text-secondary` 700), then the section's note on extra pages; both describe the slider.
  - The total is a figure, not an action: price `--text-h3` 800 `--color-text-primary`, duration `--color-text-secondary`, Persian digits; a hairline, not «·», separates the duration from «N امکان انتخاب شده» (a dot beside Persian digits reads as ۰). `display.showPrice` / `showDuration` false removes that part from the page entirely. While the document's `placeholder` is true, a `badge--highlight` says the numbers are samples. The total + CTA block is one element moved between the card and the bar, so there is one live region and one CTA.

### FAQ

- One narrow column of rows split by `--color-border` hairlines — no card per item. `+` / `−` marker in `--color-tonal-text`.
- Single-open. Panels open with a grid-rows animation (`--dur-slow`); closed panels are `inert`.
- Without JS every answer is open in the markup (the buttons cannot do anything then); `html.js` collapses them in CSS before first paint.

### Final CTA band

- Full width, `data-surface="dark"`, grid texture + one mint glow.
- Heading `--color-text-primary`, one line of `--color-text-body`, one primary button (mint).
- Home page: centred. The heading, line and buttons sit on a "screen" framed by a `--color-border` outline echo of the hero laptop; the heading reveals word by word. On the screen, under the primary: the channels pair with its lead-in «یا مستقیم پیام بدهید:» (`--color-text-muted`), then «پیگیری سفارش» and Instagram as text links (Direct messages). No hairline above them.

### Footer

- `data-surface="dark"`, background `--color-bg-alt` (`#0B211C`).
- Links `--color-text-secondary` → hover `--color-text-primary`. Small print `--color-text-muted`.
- The three channels as small icon + text links (WhatsApp, Telegram, Instagram). No repeated CTAs: the closing band right above already has them.

---

## 6. Surface rules

- **Light = read and decide:** services, process, about, pricing, FAQ, testimonials, forms.
- **Forest = recognize and commit:** hero media tile, the Work band, final CTA band, footer — and the home hero's laptop scene.
- Forest appears in only two shapes: **full-width bands** or **media tiles**. Never a text-heavy card. The exceptions are the home hero scene (§5), which is the hero itself, the single Process "spotlight" step (§5), and the back of Work's centre card (§5), which holds one project's texts.
- At most **one** full-width forest band between the hero and the footer. Don't alternate dark/light every section. The home hero scene is not counted in this, and Work is a documented second exception: its screenshots and their ambient light need the dark ground (§5 Work coverflow). The CTA band stays the only other one.
- No paragraph longer than two lines on forest. The back of Work's centre card is the one exception: one block at a time, in its text panel (6.96:1 at the worst pixel).
- Light levels stack in order: `bg` → `bg-alt` → `surface` → `surface-elevated`. A card is always lighter than what it sits on.
- Alternate `bg` / `bg-alt` between sections instead of drawing section borders.
- On forest, raised cards always get a `--forest-line` border. The fill contrast alone (1.14:1) is not enough.

## 7. Borders

- `--color-border-subtle` → card outlines (decorative).
- `--color-border` → dividers, table rules.
- `--color-border-strong` → anything interactive whose edge identifies it (inputs, outline buttons, checkboxes). ≥3:1.
- No colored accent rails or side-borders on cards.

## 8. Glow, gradient, texture, shadow

- **Glow:** forest surfaces only. Radial `--color-glow`, one source per section, behind media, never behind text, never on buttons.
- **Work's ambient backdrop** is client light, not `--color-glow`: the active project's own screenshot, pre-blurred, full-bleed behind the stage, under a radial overlay that is solid forest at the band's edges, so the heading and controls always sit on forest (§5 Work coverflow).
- **Home hero laptop — the screen's light:** one glow close round the laptop, `radial-gradient(closest-side, --color-glow-strong, --color-glow 55%, transparent)` at .8 (rising to 1 as the screen loads), masked off the display so it never lies over the light room; a soft ellipse of the same light on the desk under the deck (`--color-floor-light`); and on the lit screen its static sheen and glare (§5) and one white band (`--color-reflection-light`, 55%) that slides once across it, not in the lite scene. All of it fades out with the glass.
- **Gradients:** single hue only, e.g. `#12312A → #0E2A24`. Never green→amber, green→blue or navy.
- **Grid texture** (Instagram signature):
  ```css
  .texture-grid {
    background-image:
      linear-gradient(var(--color-grid-line) 1px, transparent 1px),
      linear-gradient(90deg, var(--color-grid-line) 1px, transparent 1px);
    background-size: 28px 28px;
  }
  ```
  Use on forest bands/tiles; on light only in the hero, if at all.
- **Shadows:** forest-tinted `rgba(18,49,42,…)` only, never black. None on forest, except Work's card faces, which carry `--shadow-elevated` to lift a white client site off the dark band (§5 Work coverflow), and in the home hero the laptop's deck and the float cards, which carry `--color-device-shadow` (`#0B211C` at 70%, §5 hero).
- **Image overlays:** `linear-gradient(to top, var(--color-overlay), transparent)`.
- **RTL:** CSS gradients aren't direction-aware. Flip directional gradients and glow positions under `[dir="rtl"]`. The light source sits on the text (right) side.

---

## 9. Typography × color

| Level | Token | Vazirmatn weight | Min size |
|---|---|---|---|
| Display / H1 | `--color-text-primary` | 800 | — |
| H2–H4 | `--color-text-primary` | 700 | — |
| Body | `--color-text-body` | 400 | 16px |
| Secondary | `--color-text-secondary` | 400–500 | 14px |
| Caption / hint | `--color-text-muted` | 400 | 14px |
| Eyebrow | `--color-tonal-text` | 700 | 12px |

- Hierarchy is never color alone. Always pair it with size and weight.
- Persian: treat **4.5:1 as the minimum even for large text under 24px**. Thin joins and dots lose definition faster than Latin.
- Line-height ≥ 1.8 for Persian body text.
- **Letter-spacing 0 on Persian text**, headings and eyebrows included (`--ls-*` are 0). Persian is a joined script: any tracking, positive or negative, opens gaps in the joins. Latin wordmarks may keep theirs.

---

## 10. Accessibility (verified ratios)

| Pair | Ratio |
|---|---|
| text-primary `#13201B` on bg `#F5F7F4` | 15.59 |
| text-body `#22302A` on bg | 12.79 |
| text-secondary `#4B5951` on bg / bg-alt | 6.85 / 6.51 |
| text-muted `#5F6E65` on white / bg / bg-alt | 5.38 / 4.99 / 4.75 |
| white on cta `#197358` | 5.78 |
| white on cta-hover `#13604A` | 7.50 |
| cta `#197358` vs bg (shape/link) | 5.36 |
| tonal-text `#13604A` on tonal `#EEF6F2` | 6.82 |
| border-strong `#7F8D86` on white / bg | 3.47 / 3.22 |
| amber-700 `#8C5313` on bg | 5.80 |
| ink on highlighter `#F7E2C4` | 13.30 |
| on-dark-1 `#F1F5F2` on forest / raised | 12.74 / 11.16 |
| on-dark-2 `#B9CBC3` on forest / raised | 8.27 / 7.25 |
| on-dark-3 `#8FA69C` on forest / raised / footer | 5.41 / 4.74 / 6.49 |
| mint `#57B79A` text on forest / raised | 5.77 / 5.06 |
| `#0B211C` on mint CTA / hover | 6.92 / 8.39 |
| amber `#E0A25C` on forest | 6.33 |
| forest-line-strong `#5E8479` on forest | 3.37 |
| success / warning / error / info on their bg | 5.39 / 5.91 / 5.75 / 6.02 |
| cta `#197358` link on bg-alt `#EDF2EE` | 5.10 |
| Hero copy on the lit screen, at the worst pixel under each text (sheen and glare included; 1024–1920px): eyebrow (tonal pill) / H1 / marked phrase (green-700 on the stroke) / sub / primary label / outline label | 6.82 / 13.30 / 5.94 / 7.38 / 5.78 / 16.80 |
| Hero intro statement on the lit screen, worst pixel (390–1440px): line 1 / line 2 | ≥ 16.00 / ≥ 13.66 |
| Hero float cards, worst pixel (1024–1920px; the card at 92% over the wall, the rim and the glass): titles / muted lines (on-dark-2) / SEO digit (amber-400) / «۳۲٪ رشد» (green-300, 23px 800) | ≥ 7.54 / 4.90 / 4.75 / ≥ 5.35 |
| nav on the hero at 94% forest over the light room: links / tonal CTA | 6.97 / 4.73 |
| text-primary / text-secondary on step fill `#D8EDE3` | 13.71 / 6.02 |
| brand `#12312A` numeral on step fill | 11.44 |
| text-primary / text-secondary / text-muted on tonal `#EEF6F2` (a chosen add-on tile) | 15.28 / 6.71 / 4.89 |
| white icon in the tonal-text `#13604A` circle (a chosen add-on) | 7.50 |
| border-strong `#7F8D86` circle edge on white / tonal (the add-on toggle) | 3.47 / 3.15 |
| text-secondary `#4B5951` on surface-sunken `#E2E9E4` (an unselected site-type tab) | 5.97 |
| Work cue chip label `#F1F5F2` over the screenshots (worst pixel): lightest (Karamad) / darkest | 7.94 / 11.26 |
| Work caption over the backdrop (worst pixel, all projects, 390 and 1440): name / summary (`--color-text-muted`) | ≥ 11.16 / ≥ 4.68 |
| tonal-text `#86C6AC` on a Work tag chip (forest-raised) | 6.25 |
| Work card back, at the worst pixel under each text (16:10 cards, 1024–1920px, all projects and tabs): title / selected tab / other tabs / text / «دیدن سایت» / note / tags | 11.14 / 4.99 / 5.85 / 6.96 / 12.14 / 4.66 / 5.07 |
| Work heading over the ambient backdrop, lightest file: title / sub | 12.74 / 8.04 |
| accent `#57B79A` active dot / border-strong `#5E8479` dots and arrow edges on forest | 5.77 / 3.37 |
| Services card text over its illustration, at the darkest pixel under any line (measured 360–1920px): paragraph at rest / on hover; title; link | ≥ 7.04 / ≥ 4.96; 16.8; 5.78 |
| ℹ add-on tile edges: `--color-border` dashed on white 1.79, `--color-border-hover` on tonal 1.36 | decorative: the tile is identified by its text and the ≥ 3:1 toggle circle |
| ❌ amber-400 digit where the 92% SEO pill would cross the silver rim | 3.94: so the pill's text line stays above the rim |
| ❌ amber `#E0A25C` on light | 2.07: never text |
| ❌ mint `#57B79A` on white | 2.43: never text or meaningful icons |

**When adding any new color pair, compute its contrast (WCAG 2.x formula) before shipping.** Targets: text ≥ 4.5:1, UI boundaries ≥ 3:1.

Also check:
- `prefers-reduced-motion`: disable glow/hover transitions, and see §13.
- `forced-colors: active`: buttons keep a visible border. Icons are inline SVG stroked in `currentColor`, so they take the system colour of their text (`CanvasText`, `LinkText` in links, `ButtonText` in buttons).
- Status = color + icon + text.

---

## 11. Do / Don't

**Do**
- Use semantic tokens in components; primitives live only in `tokens.css`.
- Keep one solid primary button per viewport.
- Put project screenshots on the Work coverflow cards, and other mockups on forest tiles.
- Wrap every dark area in `data-surface="dark"`.
- Use `#F1F5F2` for text on dark, and Persian digits in stats.
- Pair every status color with an icon and words.

**Don't**
- Bring back navy, or any blue besides `info`.
- Make anything green that can't be clicked (stats, hero chart bars, decorative icons on light).
- Make buttons amber, or add gradients or glows to buttons.
- Put mint or amber text on light backgrounds.
- Use a forest card for paragraphs, or put a form on dark.
- Add a third accent hue.
- Use pure `#FFFFFF` as the page background or as text on dark.
- Write raw hex values or Tailwind arbitrary colors (`bg-[#…]`) in components.

---

## 12. Pre-merge checklist for UI changes

- [ ] No new hex values outside `tokens.css`
- [ ] Only one solid primary button visible in any viewport
- [ ] Every dark area has `data-surface="dark"`
- [ ] No mint/amber text on light surfaces
- [ ] Forms on light surfaces; errors shown with icon + text
- [ ] Forest area ≤ ~30% of the page; action green ≤ ~5%
- [ ] Focus states visible on light and dark
- [ ] Layout and gradients checked in RTL
- [ ] Any new color pair's contrast computed and passing
- [ ] Motion follows §13: transform/opacity only per frame, reduced motion renders static and complete, no Persian text split below the word, letter-spacing 0

---

## 13. Motion

Motion explains depth and order; nothing on the page needs it to be understood.

- **Opt-in.** Every motion rule is scoped to `html.motion`, set only when the visitor has not asked for reduced motion (and is not in forced colours). Without it — reduced motion, no JS, forced colours — the page is the plain static document with everything visible and complete: no pinning, no scrubbing, no reveals, no smooth scrolling.
- **Transform and opacity only, per frame.** Scroll-linked effects never animate width/height/position, `clip-path`, masks, filters, shadows or background position per frame. Masks and geometry are set on resize. Class or attribute flips (a nav switching surface, a spotlight moving) happen only when state changes, and their CSS transitions do the rest.
- **One engine.** One `requestAnimationFrame` loop and one passive scroll listener (`src/scripts/motion/engine.js`) serve every scroll-linked effect; layout is read only in `measure()` (resize, load, font swap), never in the loop. Off-screen effects are skipped.
- **One pinned scene per page.** On the home page that is the portal hero; everything after it scrolls normally.
- **Pointer lean is decoration only.** The hero's float cards lean up to 14px toward a fine pointer, eased on the engine; never on touch, in the lite scene or without motion, and they are gone once the dive starts.
- **Reversible.** Scroll-linked motion is a pure function of scroll position, so scrolling back replays it in reverse. No one-shot triggers inside a scene.
- **Reveal once, calmly.** Entrances play once as a section arrives: rise 20–28px and fade, 600–700ms `--ease-entrance`, 60–90ms stagger. Content that keyboard focus reaches shows at once.
- **Words, never characters.** Persian text may reveal by whole words or phrases (ZWNJ-joined words stay whole), never by letter — the letters join.
- **Letter-spacing 0 on Persian text**, animated or not (§9).
- **Invisible means unfocusable.** Anything faded out that could take focus is made `inert`; decorative layers are `aria-hidden`.
- **Anything that moves by itself can be stopped.** The Work carousel is the one element that moves on its own: it pauses on hover, keyboard focus, off screen and while a card is turned over, carries a pause/play toggle, and never moves by itself under reduced motion. Its slide changes are CSS transitions of transform and opacity, written once per step; only its optional pointer tilt runs on the engine.
- **Tools respond; they don't perform.** In the pricing calculator nothing is scroll-linked: tabs, tiles and toggle circles transition background and border over `--dur`, and a changed figure cross-fades (the old value up and out 8px, the new one in, 220ms; instant without `html.motion`). The sticky summary card and the bottom bar are plain CSS `position: sticky`. Keyboard focus scrolled into view clears the nav and the bar (`scroll-margin`, from the bar's measured height, `--scope-bar-h`, as the breakdown can make it taller).
