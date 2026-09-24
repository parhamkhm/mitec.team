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
- Font: **Vazirmatn** (weights 400 / 500 / 700 / 800). Fallback: `Tahoma, "Segoe UI", sans-serif`.
- Numerals: use **Persian digits** (۰–۹) in UI copy and stats.
- Visual link: the site must feel like the same brand as the Instagram page (dark green `#12312A` posts, mint `#57B79A`, amber `#E0A25C`, subtle grid texture, device mockups on green).

---

## 2. Hard rules (never break)

1. **No navy or blue** anywhere, except the `info` status token.
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

  --color-tonal:       var(--green-50);
  --color-tonal-hover: var(--green-100);
  --color-tonal-text:  var(--green-700);

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

  --color-tonal:       rgba(87, 183, 154, .14);
  --color-tonal-hover: rgba(87, 183, 154, .22);
  --color-tonal-text:  var(--green-300);

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

  /* Home hero laptop only (§8) */
  --color-reflection: rgba(241, 245, 242, .06);

  background-color: var(--color-bg);
  color: var(--color-text-body);
}
```

The footer uses `data-surface="dark"` plus `background: var(--color-bg-alt)` (resolves to `#0B211C`).

`tokens.css` also holds the non-colour scales: type (`--text-*`, `--lh-*`, and `--ls-*`, which are all 0 — §13), `--section-pad: clamp(96px, 11vw, 176px)` for section padding, and the motion values (`--dur-reveal`, `--dur-media`, `--stagger`, `--reveal-rise`, `--ease-portal`) on top of the design system's `--dur` / `--ease-*` scale. All durations go to 0 under reduced motion.

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
| **Tonal** | bg `--color-tonal`, text `--color-tonal-text`, hover `--color-tonal-hover` | same tokens | Second conversion path: nav «شروع پروژه», «مشاوره رایگان» |
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
.btn-tonal   { background: var(--color-tonal); color: var(--color-tonal-text); }
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
- Home page: the nav overlays the hero (fixed). It uses the forest variant (`data-surface="dark"`, **94%** fill, no bottom border) over the hero scene and switches to light once the visitor is inside the room. 94% rather than a see-through 70%, because late in the scene it is the light room that shows through, and the tonal CTA needs 94% to stay at 4.73:1 on it.

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

- **The device.** A laptop drawn in CSS, never a raster mockup (it is scaled up during the dive and must stay sharp). Display 16:10. Lid `--color-surface-elevated` with a 1px `--color-border` edge; bezel inner edge and chin `--color-surface-sunken`; camera dot `--color-border-strong`; keyboard deck a single-hue gradient `--color-border-strong → --color-border`. It stands on the forest wall with the grid texture and one mint glow behind it (§8).
- **The copy** sits centred on the display (the glass is `--color-surface` on forest), as wide as the display less 48px a side. If it cannot fit, the H1 shrinks towards its clamp floor (36px) first; on phones, or where it still cannot fit, the copy stacks above the laptop. H1 800, `clamp(36px, 5.4vw, 76px)`, letter-spacing 0. On forest the highlighted phrase is `--color-highlight-text` (amber-400, 6.33:1 on forest, 5.55:1 on the glass), not the highlighter stroke. One primary + one outline; the outline edge uses `--color-text-muted` on the glass (4.74:1, where `--color-border-strong` would be 2.96:1).
- **The dive.** Scrolling carries the camera into the screen: the copy lifts off, the screen shows the intro statement — «آماده‌اید زیرساخت دیجیتال کسب‌وکارتان را بسازید؟» / «سایت شما. سرویس شما. مسیر رشد شما.» — revealed by whole words and phrases (never by characters), with a thin loading line in `--color-text-secondary` (not the CTA colour: it is not clickable). Then the glass fades to the light room — the Proof section — and the camera passes through the display into it.
- **Readability.** Light text only ever sits on forest: the statement reaches opacity 0 before the glass starts to fade, and the copy is gone before the statement starts.
- **Without motion** (reduced motion, no JS, forced colours): a forest band with the copy, then the statement on the screen of a static laptop outline, then Proof as an ordinary light section.

### Stats / trust bar

- White surface card on canvas, `--color-border-subtle`.
- Numerals: `--color-brand`, weight 800, Persian digits, `font-variant-numeric: tabular-nums`.
- Labels: `--color-text-secondary`.
- **No buttons inside the stats bar.**
- On the home page it lives in the Proof room the portal opens into, with the project-name strip under it. Stats are real facts only (`src/data/site-copy.json`).

### Service cards

- Home: six cards in a grid of 3 columns from 1024px, 2 from 760px, 1 below.
- `--color-surface`, 1px `--color-border-subtle`, `--shadow-card`.
- Icon in a 36–40px chip: bg `--color-tonal`, icon `--color-tonal-text`.
- Title `--color-text-primary`, description `--color-text-secondary`.
- Hover: border → `--color-border-hover`, shadow → `--shadow-elevated`.

### Process steps

- White step cards on a rail. As the rail's forest fill (`--color-brand`) reaches a step, the card fills with `--color-step-fill` (`--green-100`) from the start edge, its edge turns `--color-step-line` (`--green-300`), and its numeral comes up to full `--color-brand`. Text keeps its colours: title 13.71:1, secondary 6.02:1 on the fill.
- **One forest "spotlight" at a time** — the step whose dot the rail reached last. It sets `data-surface="dark"` (text remaps to on-dark), cross-fades a `--color-brand` layer in over `--dur-slow`, lifts 6px, drops its shadow and takes a `--forest-line` edge. This is a documented exception to "never a text-heavy forest card" (§6): one short step, and never more than one.
- Nothing here is clickable, so nothing here is `--color-cta`.
- Reduced motion / no JS: every step shows filled, no spotlight.

### Portfolio rows

- One row per project: a forest media tile (`data-surface="dark"`, grid texture, `--radius-xl`, `--forest-line` border, 16:10) beside a light text column. The media column is the wider one; rows alternate sides from 1024px and stack media-then-text below it.
- The screenshot sits inset in the tile with one mint glow behind it only, never behind text.
- The text column is on light: tag badges in the tonal pair, title `--color-text-primary`, the need / built / result list (labels `--color-text-muted`), then the site link or the "link after client approval" note.
- Hover on the tile: bg → `--color-brand-hover`, glow up to full.

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
- **The pricing calculator** (Quick scope) renders everything — packages, items, prices, days, labels — from the pricing document (`docs/pricing-guide.md`); no copy or number lives in its code.
  - Layout, count-proof: a 4fr / 8fr pair from 1280px, 5fr / 7fr at 1024–1279px. The start column is one **summary card** — the base title, what is always included (one column of titles), «شامل N صفحه», then the total, the chosen-count line, the full-width CTA and the disclaimer. From 1024px it is always `position: sticky` under the nav and never taller than the screen (`max-height: 100dvh` less the nav and 48px): the head, the pages line and the checkout keep their size, and only the included list gives way and scrolls inside the card (keyboard-focusable, named by the card title), with a fade to `--color-surface` at its foot while there is more below. The items' descriptions show under their titles only when the whole list fits without scrolling (measured on resize, never on scroll). The card lets go where the columns end. The end column is the page slider, then the add-on tiles. Below 1024px: summary → pages → tiles in one column, and the total + CTA become a bar pinned to the bottom of the screen while the calculator is on it (`--color-surface`, top edge `--color-border-subtle`, safe-area padding), coming to rest at the section's end so it never covers what follows. Below 768px the checklist folds after four items behind «همه‌ی موارد».
  - Site-type tabs: one segmented track on `--color-surface-sunken`; the selected tab is `--color-surface` with `--shadow-card`. Native radios, 44px targets.
  - Add-on tiles: `grid-auto-rows: 1fr`, so every tile in a grid is as tall as the tallest, and every count forms complete rows. From 1280px, 3 per row on a 6-track grid (each tile spans 2): one tile left over spans the row, two left over take half each. Up to 1279px, 2 per row and an odd last tile spans both; below 768px, 1 per row. More than 9 add-ons (6 below 1024px) show the first 9 (6) and a full-width text button «نمایش همه‌ی امکانات (N)» / «نمایش کمتر» (`section.showAllAddons` / `showFewerAddons`); a chosen add-on is never folded away, and opening moves focus to the first new tile. Tile: padding `--space-4`, no height floor (the row height comes from the content); title (at most two lines) and a 32px `+` / `−` circle on the first line, `--space-1` to the description (at most two lines; full texts in `title`), the price «از X» (`--color-text-secondary` 700) pushed to the bottom — its line is kept even when empty (a free add-on) so every tile's last line aligns. The data caps an add-on title at 28 characters and a description at 48. The whole tile is an `aria-pressed` toggle: 1px dashed `--color-border` while off, `--color-border-hover` on hover, solid `--color-border-hover` on `--color-tonal` when on, with the circle filled `--color-tonal-text`. Optional `group` in the data adds one small heading and grid per group.
  - The page slider is interactive, so its fill and thumb are `--color-cta`; the track is `--color-border`.
  - The total is a figure, not an action: price `--text-h3` 800 `--color-text-primary`, duration `--color-text-secondary`, Persian digits; a hairline, not «·», separates the duration from «N امکان انتخاب شده» (a dot beside Persian digits reads as ۰). `display.showPrice` / `showDuration` false removes that part from the page entirely. While the document's `placeholder` is true, a `badge--highlight` says the numbers are samples. The total + CTA block is one element moved between the card and the bar, so there is one live region and one CTA.

### FAQ

- One narrow column of rows split by `--color-border` hairlines — no card per item. `+` / `−` marker in `--color-tonal-text`.
- Single-open. Panels open with a grid-rows animation (`--dur-slow`); closed panels are `inert`.
- Without JS every answer is open in the markup (the buttons cannot do anything then); `html.js` collapses them in CSS before first paint.

### Final CTA band

- Full width, `data-surface="dark"`, grid texture + one mint glow.
- Heading `--color-text-primary`, one line of `--color-text-body`, one primary button (mint).
- Home page: centred. The heading, line and buttons sit on a "screen" framed by a `--color-border` outline echo of the hero laptop; the heading reveals word by word.

### Footer

- `data-surface="dark"`, background `--color-bg-alt` (`#0B211C`).
- Links `--color-text-secondary` → hover `--color-text-primary`. Small print `--color-text-muted`.

---

## 6. Surface rules

- **Light = read and decide:** services, process, about, pricing, FAQ, testimonials, forms.
- **Forest = recognize and commit:** hero media tile, portfolio tiles, final CTA band, footer — and the home hero's laptop scene.
- Forest appears in only two shapes: **full-width bands** or **media tiles**. Never a text-heavy card. The exceptions are the home hero scene (§5), which is the hero itself, and the single Process "spotlight" step (§5).
- At most **one** full-width forest band between the hero and the footer. Don't alternate dark/light every section. The home hero scene is not counted in this.
- No paragraph longer than two lines on forest.
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
- **Home hero laptop:** its one glow sits behind the device and is masked off the display, so it never lies over the light room. The only other light on it is `--color-reflection` (`--on-dark-1` at 6%): a soft band that slides once across the dark screen. There is no rim or sheen.
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
- **Shadows:** forest-tinted `rgba(18,49,42,…)` only, never black. None on forest.
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
| amber `#E0A25C` on the laptop glass (forest-raised) | 5.55 |
| on-dark-3 `#8FA69C` as the outline-button edge on the glass | 4.74 |
| nav on the hero at 94% forest over the light room: links / tonal CTA | 6.97 / 4.73 |
| text-primary / text-secondary on step fill `#D8EDE3` | 13.71 / 6.02 |
| brand `#12312A` numeral on step fill | 11.44 |
| text-primary / text-secondary / text-muted on tonal `#EEF6F2` (a chosen add-on tile) | 15.28 / 6.71 / 4.89 |
| white icon in the tonal-text `#13604A` circle (a chosen add-on) | 7.50 |
| border-strong `#7F8D86` circle edge on white / tonal (the add-on toggle) | 3.47 / 3.15 |
| text-secondary `#4B5951` on surface-sunken `#E2E9E4` (an unselected site-type tab) | 5.97 |
| ℹ add-on tile edges: `--color-border` dashed on white 1.79, `--color-border-hover` on tonal 1.36 | decorative: the tile is identified by its text and the ≥ 3:1 toggle circle |
| ❌ forest-line-strong `#5E8479` on the glass | 2.96: not an outline-button edge there |
| ❌ amber `#E0A25C` on light | 2.07: never text |
| ❌ mint `#57B79A` on white | 2.43: never text or meaningful icons |

**When adding any new color pair, compute its contrast (WCAG 2.x formula) before shipping.** Targets: text ≥ 4.5:1, UI boundaries ≥ 3:1.

Also check:
- `prefers-reduced-motion`: disable glow/hover transitions, and see §13.
- `forced-colors: active`: buttons keep a visible border. Icons are CSS masks filled with a background colour, which forced colours would blank, so they opt out and take a system colour (`CanvasText`, `LinkText` in links, `ButtonText` in buttons).
- Status = color + icon + text.

---

## 11. Do / Don't

**Do**
- Use semantic tokens in components; primitives live only in `tokens.css`.
- Keep one solid primary button per viewport.
- Put screenshots and mockups on forest tiles.
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
- **Reversible.** Scroll-linked motion is a pure function of scroll position, so scrolling back replays it in reverse. No one-shot triggers inside a scene.
- **Reveal once, calmly.** Entrances play once as a section arrives: rise 20–28px and fade, 600–700ms `--ease-entrance`, 60–90ms stagger. Content that keyboard focus reaches shows at once.
- **Words, never characters.** Persian text may reveal by whole words or phrases (ZWNJ-joined words stay whole), never by letter — the letters join.
- **Letter-spacing 0 on Persian text**, animated or not (§9).
- **Invisible means unfocusable.** Anything faded out that could take focus is made `inert`; decorative layers are `aria-hidden`.
- **Tools respond; they don't perform.** In the pricing calculator nothing is scroll-linked: tabs, tiles and toggle circles transition background and border over `--dur`, and a changed figure cross-fades (the old value up and out 8px, the new one in, 220ms; instant without `html.motion`). The sticky summary card and the bottom bar are plain CSS `position: sticky`. Keyboard focus scrolled into view clears the nav and the bar (`scroll-margin`).
