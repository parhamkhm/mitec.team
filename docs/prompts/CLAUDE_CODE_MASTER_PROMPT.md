# MASTER IMPLEMENTATION PROMPT — mitec.team "Portal" redesign

You are implementing a redesign of the mitec.team home page. Everything below was produced by a prior analysis of (a) reference screenshots of obermann-webdesign.de and (b) this repository. You do not need to look at the reference site or guess from images: every behaviour you need is specified here. Where something is a decision the owner still has to make, it is marked **[DECISION]** — implement the stated default and list it in your final report.

---

## 1. Context

- Repo root contains `DESIGN.md` (visual authority), `PRODUCT.md` (product truth), `devserver.py` (no-cache static server), and `project/` (the actual site, served as the web root).
- Active branch: `light-design` (last commit: "Rebuild the site on the light sage + forest design system"). Create a new branch from it: `feature/portal-hero`. Commit per phase. Do not push.
- Stack: **static HTML + vanilla ES modules + plain CSS. No build step, no package.json, no framework, no animation library.** Run with `python devserver.py 4173` → http://127.0.0.1:4173/.
- Language/direction: Persian, `<html lang="fa" dir="rtl">`, Vazirmatn. Persian digits in all user-facing numbers.
- Team: two people (Parham — design/front end, Sina — back end). The back end talks to the front end only through `project/src/api/` and is mocked (`USE_MOCK: true`).
- The `.dc.html` files in `project/` are old design prototypes from a Claude Design handoff. `Mitec Home.dc.html` predates the current light design system — **do not use it as a visual source**. Do not edit any `.dc.html` file.

## 2. Goal

Turn the home page (`project/index.html`) into an immersive, scroll-driven experience whose signature moment is a **"portal" hero**: the visitor lands on a full-viewport deep-forest scene with a large central rounded square; scrolling makes the camera travel *into* that square, the square grows past the viewport edges, and the visitor arrives inside a light (off-white) space that is the first content section of the site. After the portal, the page returns to a normal document flow, but every section gets calm, precise micro-interactions and scroll-linked motion.

Story to preserve: **forest = identity ("recognize"), off-white = reading ("decide")**. Entering the square = entering the studio's daylight workspace.

## 3. Current implementation findings (verified in code)

| Area | Finding |
|---|---|
| Pages | Only `project/index.html` is implemented. `/order`, `/order/success`, `/track`, 404 exist only as `.dc.html` prototypes. **There is no `project/order/` or `project/track/` directory — every `./order/` and `./track/` link currently 404s.** Do not build those pages in this task. |
| Styles | `src/styles/tokens.css` (primitives + semantic `--color-*`, type scale, imports only spacing/radii/motion from `_ds/…/tokens/`), `src/styles/components.css` (reset, buttons, cards, nav, footer, icons as Lucide CSS masks from jsDelivr), `src/styles/home.css` (page composition). |
| Surfaces | Light by default; dark areas declare `data-surface="dark"` and the whole semantic token set remaps. |
| JS | `src/scripts/home.js`: `initNav()` (mobile toggle, Escape, closes >860px), `initWorkFilter()` (tabs filter by `data-tags`, empty note), `initFaq()` (single-open accordion; swaps `icon-plus`/`icon-minus`). No animation, no scroll logic. |
| Motion | None on the page by design. Motion tokens exist via `_ds/…/tokens/motion.css`: `--dur-fast 140ms`, `--dur 220ms`, `--dur-slow 420ms`, `--ease-out`, `--ease-in-out`, `--ease-entrance`; all zeroed under `prefers-reduced-motion`. `components.css` also kills animations/transitions under reduced motion and sets `html { scroll-behavior: smooth }`. |
| Hero | Two-column: copy on the start (right) side; forest tile `.hero__stage` (grid texture, mint glow, laptop + phone mockups with `.img-slot` placeholders) on the end side. Stats bar (`.stat-bar`, 3 real facts) and project-name strip (`.logo-strip`) live inside the hero. |
| Sections in order | Hero → Services (`#services`, 4 cards) → Work (`#work`, tabs + 3 forest tiles) → Process (`#process`, 5 steps) → About (`#about`, 2 person cards) → Testimonials (sample content, labelled «نمونه — جایگزین شود») → FAQ (`#faq`, 5 items) → Closing CTA (`#contact`, forest band) → Footer (forest, `--color-bg-alt`). |
| Nav | `.navbar` is `position: sticky` and occupies ~68px of flow; light background at 88% + blur; nav CTA is tonal. Active link is hard-coded to «خانه». |
| Data | `src/data/site-copy.json` (real stats: ۳ projects, ۲ people, ۱ روز response — never invent numbers), `portfolio.json`, `faq.json`, `testimonials.json` (sample). |
| Order logic | `src/config/order-catalog.json`: `siteTypes` (7 incl. `unsure`), `templates`, `sections`, `features` (8), `colors`, `fonts`, `estimates` (weeks + price range per site type), `featureCost` ([price, extraWeeks]), `sectionCost`. `src/config/app.config.js`: `showPrice: false`, `USE_MOCK: true`. The estimate formula exists only inside `Mitec Order Builder.dc.html` → `estimate()`; the wizard persists to `localStorage['mitec.order.v1']` as `{ selection, step, unsure }`. |
| API | `src/api/client.js` exposes `getCatalog()`, `submitOrder()`, `uploadFile()`, `trackOrder()`, all returning `{ ok, data, error }`; `mapper.js` is the only shape boundary. |
| Gotchas | `body { overflow-x: hidden }` (switch to `overflow-x: clip` so no scroll container can break `position: sticky`). `--ls-eyebrow: .16em` is applied to Persian eyebrows — letter-spacing can visually break Persian letter joins. |

## 4. Reference analysis (what to take, what not to take)

The reference is a dark, single-hue site built on SvelteKit + Tailwind with Lenis smooth scroll and (very likely) a WebGL/pre-rendered 3D logo. **Take its composition, rhythm and motion logic. Do not take its palette, font, letter-spacing, WebGL, Lenis, or any of its content.**

Extracted system:
- **Single central axis.** Almost every section is centred; one idea per viewport; very large negative space (≈160–240px between sections at 1920px).
- **Headings large but calm** (40–48px section titles, regular/medium weight); body 16–18px; secondary text is the same ink at lower contrast.
- **Surfaces barely separate from the background**: 1px low-contrast borders, fills one step lighter, radius 8–12px; depth comes from soft halos behind media, not drop shadows.
- **Hero sequence** (reconstructed from consecutive scroll positions): a centred text block sits over a dim, large 3D mark. On scroll the text moves up at roughly scroll speed and fades out within ~40% of a viewport; the mark simultaneously scales up (≈1 → 1.45 → 2.6 → >6), gains brightness/specular highlights and rolls about −20° to −25°; its central negative space becomes a window; the *next section is already rendered inside that window at ≈0.3–0.4 scale, tilted with the frame*; the frame passes the viewport edges and the inner section settles at scale 1, upright, in normal flow. A "scroll to explore" hint sits bottom-start and disappears on first scroll. Evidence from the reference DOM: a scroll track ≈2.7× viewport height, fixed background layers whose opacity is animated, and a hero wrapper whose opacity is animated.
- **Card entrance** (testimonials): cards rise from below, tilted back (rotateX) and fanned (small alternating rotateZ), clustered toward the centre, then spread into their grid and flatten — scroll-linked.
- **Projects**: alternating zig-zag rows; large media with a soft coloured halo behind it; text column beside it with title, two short paragraphs, a text link.
- **"Meet the person / behind the design"**: a two-line display heading whose lines start offset in opposite horizontal directions and converge as you scroll.
- **Pricing**: two-column calculator — "Base / always included" card + add-on rows with a `+` toggle and "from" price; a slider for page count; a total line; one full-width CTA; a non-binding disclaimer.
- **CTA band** with a faint dot/grid texture; **FAQ** as a narrow single column of divider-separated rows with `+` icons.

## 5. Exact required changes (summary)

1. **REBUILD the hero** as a pinned, scroll-scrubbed portal scene (spec in §7).
2. **ADD a "Proof" landing section** that lives *inside* the portal (the room the visitor enters). It reuses the existing stats bar and project-name strip, which **move out of the hero**.
3. **ADD a tiny vanilla motion engine** (one rAF loop, one passive scroll listener, cached measurements) shared by all scroll-linked effects, plus an IntersectionObserver reveal utility. No new dependencies.
4. **MODIFY the nav** to overlay the hero (fixed), start in a dark variant, and switch to the light variant when the visitor is inside the room; add scroll-spy active states.
5. **REBUILD Work** as three alternating zig-zag rows (forest media tile + light text column); **REMOVE the tabs filter** **[DECISION — default: remove; three items do not need filtering]**.
6. **MODIFY Testimonials** with the tilt-and-settle entrance; keep the "sample" badge **[DECISION — default: keep the section visible with the badge]**.
7. **MODIFY Services, Process, About, FAQ, CTA band** with the motion described in §6.
8. **ADD a "quick scope" configurator section** on the home page that reuses `order-catalog.json` and a shared `estimate()` (§8). Price stays hidden while `showPrice` is `false`.
9. **UPDATE `DESIGN.md`, `PRODUCT.md`, `project/README.md`** so documentation matches the new hero, surfaces and motion rules.

## 6. Section-by-section implementation instructions

New page order: **Portal hero (with Proof room) → Work → Testimonials → Services → Process → About → Quick scope → FAQ → Closing CTA → Footer.** Alternate `--color-bg` / `--color-bg-alt` between light sections. Section vertical padding: `clamp(96px, 11vw, 176px)` (add a token `--section-pad`). Section headings are centred (`.section-heading--center`) except inside cards.

### 6.1 Nav — MODIFY
- On the home page make `.navbar` `position: fixed; inset-inline: 0; top: 0; z-index: 30`. Nothing else may reserve its height above the hero.
- Two states: `data-surface="dark"` while over the forest scene (background `color-mix(in srgb, var(--color-bg) 70%, transparent)` + blur 12px, no bottom border), light when `portalProgress ≥ 0.80` (existing light style). Swap with 0.02 hysteresis; colours transition with `--dur`.
- Nav CTA stays **tonal**; it may become primary only after the hero's primary button is gone (DESIGN.md §5 rule, keep it).
- Scroll-spy: IntersectionObserver on sections with ids → move `.is-active` and `aria-current="page"`.
- Keep mobile toggle behaviour from `initNav()` unchanged.

### 6.2 Portal hero + Proof room — REBUILD / ADD
DOM (reading order = copy first, room second; stacking via z-index):
```html
<section class="portal" id="top" aria-labelledby="hero-title">
  <div class="portal__stage">
    <div class="portal__copy" data-surface="dark"> eyebrow · <h1 id="hero-title"> · sub · actions </div>
    <div class="portal__room"> <section class="proof" id="proof" aria-labelledby="proof-title"> … </section> </div>
    <div class="portal__frame" aria-hidden="true">
      <div class="portal__wall" data-surface="dark"></div>   <!-- forest + grid texture, static hole -->
      <div class="portal__glass"></div>                        <!-- fills the hole at start -->
      <div class="portal__rim"></div>                          <!-- lit edge of the hole -->
      <div class="portal__glow"></div>                         <!-- single mint glow, behind rim -->
    </div>
    <button class="portal__hint" type="button">…</button>
  </div>
</section>
```
- Copy: keep current hero copy verbatim (eyebrow «تیم دو‌نفره · طراحی سایت حرفه‌ای», the H1 with `.headline-mark` phrase, the sub, primary «ساخت سفارش من» + outline «دیدن نمونه‌کارها»). Centre-aligned. H1 `clamp(40px, 5.4vw, 76px)`, weight 800, `letter-spacing: 0`. On forest the highlighted phrase uses `--color-highlight-text` (amber-400 on forest, 6.33:1) instead of the light-surface highlighter stroke.
- Proof room content (light surface): eyebrow «نمونه‌کارها», heading **[DECISION — default copy: «خودتان ببینید»]**, one line «هر پروژه با نیازی که داشت و کاری که برایش انجام دادیم.» (existing copy), then the existing `.stat-bar` (moved, unchanged values) and `.logo-strip` (moved). No buttons inside the room.
- The laptop/phone mockups leave the hero; screenshots will live in the Work tiles.
- Full motion spec: §7.

### 6.3 Work — REBUILD layout, KEEP content
- Three rows, each `grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr)` ≥ 1024px, gap `--space-9`. Row 1: text on start (right), media on end (left); row 2 mirrored; row 3 as row 1. < 1024px: media then text, stacked.
- Media: forest tile (`data-surface="dark"`, `.texture-grid`, radius `--radius-xl`, `--forest-line` border), 16:10, keeps the `.img-slot` placeholders; one mint radial glow *behind* the screenshot only.
- Text column on light: badges (light tonal), `h3.card-title`, the existing `<dl>` (نیاز / چه ساختیم / نتیجه), link or note exactly as today.
- Remove `#workTabs`, `#workEmpty`, `initWorkFilter()` and their CSS. Keep tag text as badges.
- Motion: on enter (IO, once): media `clip-path: inset(10% round 20px)` → `inset(0 round 20px)` + `scale(.96 → 1)`, 700ms `--ease-entrance`; text children stagger 60ms (opacity 0→1, translateY 20px→0). Scroll-linked while visible: the screenshot inside the tile translates Y from `+4%` to `−4%` (tile has `overflow: hidden`). Hover: tile background → `--color-brand-hover`, glow opacity .6 → 1.

### 6.4 Testimonials — MODIFY
- Keep content and the sample badge. Grid of 2 (auto-fit ≥ 300px).
- Scroll-linked entrance over the section's progress window "section top at 100% viewport → section top at 35% viewport": parent `perspective: 1200px`; each card from `translateY(140px) rotateX(24deg) rotateZ(±3deg) translateX(toward centre 12%)` to identity; stagger 0.08 of progress between cards; opacity 0 → 1 over the first 30%. Transform-origin: bottom centre.

### 6.5 Services — MODIFY
- Keep 4 cards and their links. Reveal on enter: stagger 70ms, opacity 0→1, translateY 28px→0, 600ms `--ease-entrance`. Icon chip: scale .8→1 with 100ms extra delay. Keep existing hover.

### 6.6 Process — MODIFY
- Add a rail behind the 5 steps: 2px line in `--color-border`; a fill in `--color-brand` (never action green) whose `scaleX` goes 0→1 with section progress (origin: right in RTL). Mobile (< 760px): vertical rail on the start side, `scaleY`.
- Numerals `.process-step__n` go from opacity .35 to 1 as the fill passes them (`is-reached` class). Nothing clickable becomes green.

### 6.7 About — MODIFY
- Replace the section heading with a two-line display heading, weight 500, `clamp(34px, 5vw, 64px)`: **[DECISION — default: line 1 «آدم‌هایی که», line 2 «پشت هر پروژه‌اند»]**; keep «کل پروژه را همان دو نفری انجام می‌دهند که با آن‌ها صحبت کرده‌اید.» as the sub.
- Scroll-linked: line 1 `translateX(-10vw → 0)`, line 2 `translateX(10vw → 0)` over section progress 0 → 0.5 (mirror of the reference for RTL). Mobile: ±6vw.
- Person cards: photo slot reveals with `scale(.9→1)` + opacity; text stagger.

### 6.8 Quick scope (pricing/configurator) — ADD (see §8 for rules)

### 6.9 FAQ — MODIFY
- Narrow column, items separated by 1px `--color-border` dividers (drop the per-item card chrome). Keep single-open logic and `aria-expanded`.
- Animate open/close with the `grid-template-rows: 0fr → 1fr` technique on a wrapper (duration `--dur-slow`). Closed panels must not be focusable: use the `inert` attribute on closed panels instead of `hidden` (keep `hidden` as the no-JS default).

### 6.10 Closing CTA band — MODIFY
- Keep forest band, grid texture, copy, links, one primary + one outline.
- Add a decorative "portal echo": a centred rounded-square outline (`--forest-line`, 1px) behind the heading, `scale(.92 → 1.04)` over section progress. Heading reveal by **words** (never characters).

### 6.11 Footer — KEEP.

## 7. Main scroll animation specification (the portal)

### 7.1 Geometry
- `.portal` height = `100svh + L`, where `L = 2.2 × innerHeight` (desktop/laptop), `1.8 × innerHeight` (tablet), `1.6 × innerHeight` (mobile). Compute in JS, set as `--portal-track` in px.
- `.portal__stage`: `position: sticky; top: 0; height: 100svh; overflow: hidden; background: var(--color-bg)` (light — so the room's own edges are never visible inside the hole while it is scaled down).
- Portal square base size `S = min(62vmin, 600px)` (mobile: `min(84vw, 420px)`), radius `clamp(20px, 3vmin, 36px)`, centred.
- `.portal__frame` is ONE transformed container holding wall, glass, rim, glow. Wall = element sized `max(vw, vh) × 3`, centred, forest `--color-bg` + `.texture-grid`, with a **static** CSS mask (inline SVG data URI, `fill-rule="evenodd"`: outer rect minus a rounded rect of size S) so the hole never re-rasterises per frame. Alternative if mask edges alias: four slab elements around the hole. Rim = rounded-rect ring on the hole edge, 10px, a vertical `linear-gradient(--forest-line-strong → --green-400 20% alpha → --forest-line)`, plus a `::after` sheen (`conic-gradient` with a single `rgba(87,183,154,.35)` lobe) masked to the ring and rotated with progress. Glass = the hole filled with `--forest-raised`. Glow = one radial `--color-glow` behind the rim.
- `.portal__room`: full stage size, light surface (`--color-bg`), content centred; `transform-origin: 50% 50%`.
- Exit scale: `sExit = (hypot(vw, vh) / S) × 1.15` (recompute on resize) — the wall must be fully outside the viewport at `sExit` even while rotated.

### 7.2 Progress
- `p = clamp((scrollY − portalTop) / L, 0, 1)`. Smooth it: `pS += (p − pS) × (1 − exp(−dt / τ))`, τ = 90ms (fine pointer) / 45ms (coarse pointer); snap when |p − pS| < 0.0005. Everything is a pure function of `pS` → fully **reversible**; no one-shot triggers inside the scene.
- Helper: `seg(p, a, b) = clamp((p − a)/(b − a), 0, 1)`; eases: `inCubic`, `outCubic`, `inOutSine`, `inOutCubic`.

### 7.3 Timeline (desktop values; mobile overrides in 7.5)

| Phase | p range | Element | Property: from → to | Ease |
|---|---|---|---|---|
| Initial | 0 | stage | forest wall, glass opaque, copy visible over the square, room at scale .42 hidden behind glass, hint visible | — |
| 1 · Lift-off | 0 – .04 | hint | opacity 1 → 0, then `hidden` | linear |
| | 0 – .16 | eyebrow | translateY 0 → −14vh; opacity 1 → 0 | linear / inCubic |
| | .02 – .19 | H1 | same | same |
| | .04 – .21 | sub | same | same |
| | .05 – .22 | actions | same; set `inert` on `.portal__copy` once opacity = 0, remove when > 0 | same |
| | 0 – .22 | frame | scale 1 → 1.35 | inOutSine |
| | 0 – .30 | glow | opacity .5 → 1 | outCubic |
| 2 · Approach | .18 – .45 | glass | opacity 1 → 0 (room becomes visible inside the square) | inOutSine |
| | .22 – .72 | frame | scale 1.35 → sExit | inCubic (accelerating travel) |
| | .25 – .60 | frame + room | rotate 0 → −8deg | inOutSine |
| | 0 – .70 | rim sheen | rotate 0 → 220deg | linear |
| | 0 – .30 | room | scale .42 → .50 | inOutSine |
| 3 · Reveal | .30 – .82 | room | scale .50 → 1 (slower than the frame = depth parallax) | inOutCubic |
| | .60 – .85 | frame + room | rotate −8deg → 0 | inOutSine |
| | .66 – .86 | proof stat items | opacity 0 → 1, translateY 24px → 0, stagger .04 | outCubic |
| | .78 – .92 | project-name strip | same | outCubic |
| 4 · Inside | .70 – .76 | wall / rim / glow | opacity 1 → 0, then `visibility: hidden` on the frame | linear |
| | ≥ .80 | nav | switch to light surface (hysteresis .02) | CSS transition |
| Final | .86 – 1 | — | hold (settle zone), then the sticky stage releases and the room scrolls away as normal content; the next section (Work) follows in flow | — |

The proof heading and sub are visible from the start (tiny inside the square, like the reference); only stats and the strip reveal late.

### 7.4 Rules
- Animate **only `transform` and `opacity`**. Never animate width/height/top/left, `clip-path`, `mask-*`, `filter`, `box-shadow` or background-position per frame in this scene.
- `will-change: transform, opacity` only on frame, room, copy while `0 < p < 1`; remove it outside the scene.
- No DOM swap at the end: the room *is* the Proof section, so continuity into Work is natural.
- The "scroll to explore" button (text: «برای دیدن، اسکرول کنید», bottom on the start side, `--color-text-muted` on forest, a small looping line animation disabled under reduced motion) smooth-scrolls to `portalTop + L` on click and is keyboard reachable only while visible.
- Anchor links (`#work` etc.) and the skip link must land correctly; `scroll-margin-top: 80px` stays.
- Focus safety: if focus enters the room while `p < .85` (e.g. keyboard), scroll to `portalTop + .9L` first.

### 7.5 Responsive behaviour of the portal
- **Desktop ≥ 1280 / Laptop 1024–1279**: full spec. Laptop: `S = min(58vmin, 520px)`.
- **Tablet 760–1023**: same phases; rotation max −5deg; L = 1.8×vh.
- **Mobile < 760**: same concept, simplified: no rotation, no rim sheen, L = 1.6×vh, `S = min(84vw, 420px)`, copy sizes from existing clamps, actions stack full width, room content shows heading + stats only (strip wraps below). Recompute geometry on resize but **ignore height-only changes < 120px on coarse pointers** (mobile URL bar).
- **Low-power**: if `navigator.hardwareConcurrency ≤ 4` or `saveData` is on, use the mobile simplification at any width.
- **Reduced motion / no JS** (default markup): no pinning. `.portal` renders as a forest hero band (copy centred, a static square outline decoration), followed by the Proof section as an ordinary light section. Motion mode is opt-in: JS adds `html.motion` only when `matchMedia('(prefers-reduced-motion: no-preference)')` matches, and removes it (and tears down the scene) if that preference changes.

## 8. Pricing / configuration requirements (Quick scope section)

- Place after About, id `#scope`, light surface. Two columns ≥ 1024px (stacked below): start column = "always included" card; end column = choices + result.
- **Always included** list: use only existing truthful copy **[DECISION — default items]**: «طراحی رابط کاربری اختصاصی» (Services card 1), «راه‌اندازی روی دامنه و هاست خودتان، با SSL» (Process step 04), «یک دوره پشتیبانی بدون هزینه بعد از تحویل» (Services card 4 / FAQ).
- Choices, from `getCatalog()` (never hard-coded): site type as a radio-chip group (all 7 `siteTypes`, including «نمی‌دانم»); features as toggle rows (8 `features`) with a `+` icon that becomes a check when on (`aria-pressed`). Do not add a page-count slider (the catalog has no page dimension — do not invent one).
- Result line (`aria-live="polite"`): «زمان تقریبی: X تا Y هفته» in Persian digits, from the shared estimate. **Price is rendered only if `APP_CONFIG.showPrice === true`** (currently false → no price element in the DOM, not a blurred one).
- Extract the prototype's `estimate()` into `src/utils/estimate.js` (pure function `estimate(catalog, selection) → { weeks:[a,b], price:[a,b] }`, identical math: base from `estimates[siteType] ?? estimates.unsure`; per feature `price[0] += c[0]`, `price[1] += round(c[0]*1.6)`, `weeks[1] += c[1]`; `sectionCost × sections.length` added as `[+s, +round(s*1.5)]`). The future `/order` page must import this same module.
- One primary button: «ادامه در سفارش‌ساز». On click write `localStorage['mitec.order.v1'] = { selection: { siteType, features, sections: [] }, step: 2, unsure: {} }` inside try/catch (merge with an existing value if present) and navigate to `./order/`. Link target stays `./order/` even though the page is not built yet (known gap, list it in the report).
- Motion: chip/toggle state changes animate background/border with `--dur`; the weeks number crossfades (old up/out 8px, new in) over 220ms.
- Keyboard: arrow keys move within the radio group (roving tabindex), Space/Enter toggles features, visible focus on both surfaces.

## 9. Brand constraints (binding)

- Brand = **Emerald + Off-white**, implemented through the existing tokens: emerald = the `--green-*` ramp (forest `#12312A`, action `#197358`, mint `#57B79A`), off-white = `--sage-25 #F5F7F4` (page) and `--on-dark-1 #F1F5F2` (text on forest). Do not import the reference palette (plum/magenta/white) in any form.
- Every rule in `DESIGN.md` stays in force, with these explicit, documented amendments (write them into DESIGN.md):
  1. **Hero exception (§5/§6):** the home hero is a full-viewport forest *scene*; it is not counted as the single forest band between hero and footer. Its copy is centred.
  2. **Rim sheen (§8):** a mint sheen on the portal rim is allowed (it is part of a forest object, behind no text).
  3. **New §13 Motion:** transform/opacity only; one pinned scene per page; reduced-motion = static; never split Persian text into characters; `letter-spacing: 0` on Persian text.
- No new hex values outside `tokens.css`. Components use semantic `--color-*` only. Amber stays ≤ 1% (only the existing highlight and logo dot); no new amber.
- One solid primary button per viewport. Action green only on clickable things (the process rail and stats use `--color-brand`).

## 10. Responsive requirements

Breakpoints: mobile < 760, tablet 760–1023, laptop 1024–1279, desktop ≥ 1280. Test at 360×740, 390×844, 768×1024, 1280×800, 1440×900, 1920×1080.
- No horizontal scroll at any width (use `overflow-x: clip` on body).
- Work rows stack < 1024; Quick scope stacks < 1024; About cards stack < 760.
- Scroll-linked distances (translateX in About, card cluster offsets) scale down ~40% on mobile.
- Touch targets ≥ 44px (keep existing).
- Use `svh` for the pinned stage, `dvh` nowhere in animated elements.

## 11. Performance requirements

- One `requestAnimationFrame` loop for all scroll-linked effects; one passive `scroll` listener that only marks dirty; the loop sleeps when nothing is dirty and no smoothing is pending.
- No layout reads inside the loop: cache section tops/heights with `ResizeObserver` + `load` + `document.fonts.ready`; write-only transforms per frame.
- Scroll-linked effects outside the viewport are skipped (IntersectionObserver gates them).
- Reveal-once effects use IO + CSS transitions (no per-frame JS).
- Frames must stay under 16ms on a mid-range laptop and show no long tasks > 50ms during the portal in DevTools Performance (4× CPU throttle should still be usable).
- Images: `loading="lazy"` + `decoding="async"` + explicit width/height everywhere except anything visible at p = 0.
- The H1 must paint without JS (it is visible by default; motion only adds transforms) — no "opacity: 0 until JS" on above-the-fold content.
- New JS for this task ≤ ~12 KB unminified total. No WebGL, no video, no image sequences.

## 12. Accessibility requirements

- Semantic order: H1 first; Proof section has its own `h2`; one `main`.
- `prefers-reduced-motion: reduce` → static layout, no scrubbed or reveal motion (content visible immediately), no smooth scrolling.
- Invisible = unfocusable: hero copy gets `inert` while opacity is 0; decorative frame is `aria-hidden="true"`.
- Keyboard: all interactive elements reachable in visual order; focus never lands on an element hidden by the scene; `:focus-visible` styles work on forest and light surfaces (existing tokens).
- Configurator: proper radio group semantics, `aria-pressed` toggles, live region for the result.
- FAQ: `aria-expanded`, `aria-controls`, closed panels `inert`.
- Contrast: every new text/background pair meets DESIGN.md §10 (compute any new pair; ≥ 4.5:1 text, ≥ 3:1 UI).
- `forced-colors: active`: buttons keep borders; the portal hides decorative layers and shows a plain outline.

## 13. Architecture recommendations (decided)

- **Vanilla scroll engine, no library.** Reason: the project has no build step and no dependencies by design; the scene is a single timeline of ~12 tracks, which a 100–150-line engine handles; CDN libraries are an availability risk for users in Iran. CSS scroll-driven animations (`animation-timeline`) are not used because Firefox support is incomplete and the scene needs damping and shared state (nav swap, inert toggling).
- **No Lenis / no scroll hijacking.** Native scrolling is kept for accessibility and anchor links; the reference's smoothness is reproduced by damping the scene progress (§7.2).
- **No WebGL.** The reference's metallic 3D object is replaced by a 2.5D layered frame (wall + rim + sheen + glow) — no 3D asset exists for mitec and WebGL would cost load time on mobile networks.
- Fallback only if the vanilla engine demonstrably fails the performance criteria: vendor GSAP core + ScrollTrigger as local files under `project/public/vendor/` (no CDN) and explain why in the report.

## 14. What you may rebuild freely

Hero markup/CSS/JS, Work layout, section order, section headings layout, FAQ presentation, nav behaviour, `home.css` structure, `home.js` structure (split into modules), adding new CSS/JS files, adding the Quick scope section, removing the Work tabs filter. Do not keep old code just because it exists.

## 15. What must be preserved

- All real content: copy, stats values, project texts, team names/roles, FAQ Q&A, contact links, "sample" labelling of testimonials, placeholder comments (`REPLACE:` notes).
- `src/api/*`, `src/config/*` and `src/data/*` are read-only for this task; `src/utils/*` stays as is (you only add `estimate.js`).
- Token architecture (`tokens.css` primitives + semantic, `data-surface="dark"` remapping), button system, focus styles, skip link, forms-on-light rule.
- The `.dc.html` prototypes, `image-slot.js`, `support.js`, `_ds/` (untouched).
- Accessibility behaviours of `initNav()` and `initFaq()`.
- Persian digits, RTL, Vazirmatn.

## 16. Dependencies

None to add. Allowed files to create:
- `project/src/scripts/motion/engine.js` — rAF loop, dirty flag, damping, subscribe/unsubscribe, measurement cache, reduced-motion gate (`html.motion`).
- `project/src/scripts/motion/easing.js` — `clamp`, `seg`, easing functions.
- `project/src/scripts/motion/portal.js` — the hero scene.
- `project/src/scripts/motion/reveal.js` — IO reveal-once (`[data-reveal]`, `[data-reveal-stagger]`).
- `project/src/scripts/motion/effects.js` — Work parallax, Testimonials tilt, Process rail, About converge, CTA echo.
- `project/src/scripts/scope.js` — Quick scope configurator.
- `project/src/utils/estimate.js` — shared estimate.
- `project/src/styles/portal.css`, `project/src/styles/motion.css`.
`home.js` becomes the entry that imports and initialises these.

## 17. Implementation order

0. **Audit (no edits):** `git status`, confirm branch `light-design`, create `feature/portal-hero`. Read `DESIGN.md`, `PRODUCT.md`, `project/index.html`, all `src/styles/*`, `src/scripts/home.js`, `src/config/*`, and the `estimate()` block in `Mitec Order Builder.dc.html`. If anything in this prompt contradicts the code, trust the code, note it, and continue.
1. **Motion infrastructure:** engine, easing, reveal, `html.motion` gating, `overflow-x: clip`, `--section-pad`, motion tokens (`--ease-portal: cubic-bezier(.65,0,.35,1)` etc. in `tokens.css`). Commit.
2. **Portal hero + Proof room + nav overlay/states.** Commit. **CHECKPOINT: stop here and report** (what to scroll-test, known issues) so the owner can review the feel in a browser before you continue.
3. **Work rebuild** (remove tabs). Commit.
4. **Testimonials, Services, Process, About, FAQ, CTA band** motion + layout changes. Commit.
5. **Quick scope** + `estimate.js`. Commit.
6. **Docs:** DESIGN.md amendments (§5, §6, §8, new §13), PRODUCT.md capabilities, `project/README.md` (it still says "تم تاریک" — fix). Commit.
7. **QA pass** against §18; fix; final commit and report.

## 18. Validation checklist

- [ ] Scrolling down and back up through the portal is continuous and reversible at 60fps; no jump when the stage unpins; Work starts directly after the room.
- [ ] At p = 0 the H1, sub and both CTAs are readable (light text on forest/glass only — no light text ever overlaps the off-white room).
- [ ] The wall is fully off-screen before it fades, at 360px and at 1920px, including while rotated.
- [ ] Nav is dark over the scene and light inside the room; no flicker at the threshold.
- [ ] Reduced motion: no pinning, no scrubbing, all content visible, anchors work.
- [ ] JS disabled: page fully readable in normal flow.
- [ ] Keyboard-only pass through the whole page: focus always visible and never on an invisible element.
- [ ] No horizontal scroll at 360px; mobile URL-bar show/hide does not restart or jump the scene.
- [ ] DevTools Performance: no layout/style recalculation per frame from the engine; no long tasks > 50ms while scrolling.
- [ ] `grep` shows no new hex values outside `tokens.css`; one primary button per viewport; action green only on clickables.
- [ ] Persian text: no letter-spacing, no character splitting; digits are Persian.
- [ ] Quick scope: weeks update correctly for each site type and feature combination (verify three cases by hand against the formula); no price in DOM while `showPrice` is false; localStorage payload matches `{ selection, step, unsure }`.
- [ ] FAQ: single-open, animated, closed panels not focusable.
- [ ] Console clean (no errors, no 404 other than the known `./order/` and `./track/` routes).

## 19. Definition of Done

- All phases committed on `feature/portal-hero` with descriptive messages; nothing pushed.
- Every item in §18 checked, with any exception explained.
- DESIGN.md / PRODUCT.md / project README updated and consistent with the result.
- A final report listing: files created/changed, each **[DECISION]** default you applied, known gaps (`/order` and `/track` pages not built; placeholder images, testimonials and contact links still placeholders; fonts and icons still loaded from CDNs), and any deviation from this spec with the reason.
