# HERO v8 — light screen, device finish, screen light, floating cards, wall of work

The portal hero reads as one flat forest tone: the wall, the lid and the glass are all forest, so the laptop dissolves into the background. The owner approved a mockup (`docs/mockups/mitec-hero-mockup.html`, version «الف» with `?f=silver`; screenshot `docs/mockups/hero-v8-approved.png`). Build that look inside the existing portal architecture.

**Keep unchanged:**
- the scroll choreography (copy lifts off → intro statement + loader → the screen "loads" → fly through into the Proof room);
- portal.js geometry and measuring;
- stacked/tight/lite modes;
- the nav behaviour;
- all copy text.

**Constraints:**
- vanilla CSS/ES modules, no new dependencies;
- tokens only (add new tokens to `tokens.css` and DESIGN.md; no raw hex in component CSS);
- per-frame changes are transform/opacity only;
- no CSS `filter` or `backdrop-filter` on anything inside the scaled frame;
- RTL, reduced motion, no-JS.

**Branch:** `git checkout copy/final-pass && git pull`. If `main` has new commits, merge `main` into `copy/final-pass` first (no rebase, no force).

---

## 1. The screen is lit (light glass)

Under `html.motion`, whenever the copy sits **on the display**, the display is a light surface:

- **`.portal__glass`**
  - The background is the light `--color-surface`, with one static sheen on top:
    - a soft `--green-50`-based radial at the top centre;
    - a diagonal white glare from the top-start corner, about 45% opacity, fading out by 32%.
  - Add both as tokens (`--color-screen`, `--color-screen-sheen`, `--color-screen-glare`).
- **Copy on the screen (not stacked)**
  - `.portal__copy` renders with the **light token set**. portal.js already decides stacked vs on-screen; in the same place, set `data-surface="dark"` only when stacked and remove it when the copy is on the screen. The static no-JS / reduced-motion band stays forest, as today.
  - **Eyebrow:** tonal pill (`--color-tonal` background, 1px `--color-tonal-hover` border, `--color-tonal-text`).
  - **H1:** heading colour. For the marked phrase «فراتر از طراحی سایت؛», use the standard light `.headline-mark` highlighter stroke, with the phrase text in a new token `--color-headline-accent: var(--green-700)`.
    - It is non-interactive and deliberately not `--color-cta` (green-600), so the "CTA green only on clickables" rule holds. Document it.
    - Remove the forest-only override at `portal.css` line ~61 for the on-screen case. Keep that override for the stacked and static cases.
  - **Sub:** `--color-text-secondary`.
  - **Buttons:** primary (light CTA) + outline on white (light tokens). Remove the forest-glass outline override for the on-screen case.
- **Intro statement and loader**
  - They also switch to the light token set while they are on the screen: dark text on the lit glass, loader track `--color-border`, fill `--color-text-secondary`.
  - Verify with the measured `--say-max` that whenever the statement's opacity is > 0, it lies fully inside the display rect at 1920, 1440, 1280×800 and 1024. It must never sit half on the forest wall. If a size fails, shrink the statement there; do not change the choreography.
- **The "load" moment**
  - The glass is now close to the room's colour, so the glass-to-room fade is almost seamless. Keep the sequence.
  - Make the load readable through the loader completing and the sheen and glare fading out with the glass.
  - Check there is no white flash and no visible seam at the display edge during the fly-through.
- **`.portal__reflection`**
  - On the light glass it becomes a white band (`--color-reflection-light`, about 55% white). It slides once, as now.
  - It stays off in `portal--lite`.
- **Contrast:** report H1, marked phrase, sub, eyebrow and both buttons over the glass, including the sheen and glare areas (AA; the H1 is large text).

## 2. Device finish (so the laptop separates from the wall)

Change the shared brand laptop (`.laptop__*` in `components.css`, drawn by the portal frame) from forest tones to a **silver device with a black bezel**.

- **New fixed device tokens.** These are primitives plus semantic aliases that **do not remap** under `data-surface`, because the device is an object, not a surface. Example values:
  - `--device-bezel: #0E1714`
  - `--device-bezel-edge: #2A3632` (camera dot, bezel inner line)
  - `--device-rim: #C9D3CD`
  - `--device-rim-shade: #8E9C95`
  - `--device-deck-hi: #E6ECE8`
  - `--device-deck-mid: #AAB7B0`
  - `--device-deck-lo: #8E9C95`
  - `--device-deck-notch: #9AA7A0`

  Aliases: `--color-device-*`.
- **Lid**
  - The bezel ring (sides, top and chin) is `--color-device-bezel`.
  - The outer silhouette gets a 2px `--color-device-rim` edge plus a 1px `--color-device-rim-shade` edge outside it (two box-shadow rings, no border-width change, so the geometry maths stays identical).
  - The camera dot is `--color-device-bezel-edge`.
  - The display cut-out mask is unchanged.
- **Keyboard deck**
  - Vertical gradient `--color-device-deck-hi` → `--color-device-deck-mid` (70%) → `--color-device-deck-lo`.
  - The thumb notch is `--color-device-deck-notch`.
  - Add a 1px top highlight line at about 90% white, and a soft drop shadow under the deck (part of the frame).
- **Everything else stays:** the lid/deck proportions, `--bezel`, `--chin`, `--base-h`.
- Update DESIGN.md §5/§8: the brand laptop is silver with a black bezel, and it is the only place these device tokens are used.

## 3. Screen light (glow + floor)

- **`.portal__glow`:** stronger and closer.
  - `radial-gradient(closest-side, var(--color-glow-strong) 0%, var(--color-glow) 55%, transparent)`, where `--color-glow-strong` is mint at about 26%;
  - base opacity .8;
  - still masked off the display.
- **New `.portal__floor`,** inside the frame so it scales and tilts with the laptop:
  - an ellipse of soft light on the "desk" just under the deck: `radial-gradient(ellipse 50% 40% at 50% 10%, rgba(214,236,226,.14), transparent 70%)` (tokenise it);
  - width about 1.6× the lid, height about 0.3× the screen height;
  - static.
- Both fade with the rest of the scene during the dive (reuse the existing progress mapping; no new scroll logic).

## 4. Floating UI cards (three)

Three small decorative cards sit around the laptop and **say "beyond web design" before anyone reads the H1**.

- **Content**, from `site-copy.json` → `hero.floatCards` (edit copy there, not in HTML):
  1. **`seo`** — a pill with a search icon: «رتبه‌ی ۱ گوگل» (the digit in `--color-highlight`). It overlaps the lid's top edge near the top-end corner (top-left in RTL), rotated −2deg.
  2. **`crm`** — an icon tile (bag icon) + «سفارش جدید ثبت شد» + a muted line «همین حالا · به CRM اضافه شد», with a small mint status dot at its corner. It overlaps the right edge of the lid at about 20% height, rotated 2deg.
  3. **`analytics`** — a muted label «بازدید این ماه» and a value «۳۲٪ رشد» (`--green-300` on dark), over a small inline-SVG area + line chart (mint stroke, fading fill). It overlaps the left edge at about 65% height, rotated −3deg.
- **Style:**
  - on-dark raised surface: `--color-surface-elevated` at about 92% opacity;
  - 1px `--forest-line` border, radius 18px (999px for the pill);
  - drop shadow and a 1px inset top highlight;
  - text sizes caption to body-sm, weights 800 for titles.
- **Semantics:** decorative and illustrative, so the container is `aria-hidden="true"`. They are not links and not focusable.
- **Placement and motion:**
  - The cards live in the stage (**not** inside `.portal__frame`, so they never balloon during the dive).
  - portal.js positions them from the frame rect it already measures (on resize only).
  - Fine pointers: ±8–14px parallax toward the pointer, different depth per card, eased in the existing engine tick.
  - Scroll: during the first ~20% of the portal progress (while the copy lifts off), the cards drift outward away from the laptop (40–80px) and fade to 0. They are gone before the statement appears and never enter the fly-through.
  - Entrance on load: stagger in after the H1 (opacity + 12px translateY, 80ms apart).
- **Hidden** in `portal--stacked`, `portal--tight`, below 760px, and in the static / no-JS layout.
- **Reduced motion:** shown static (no parallax, no drift). They fade out on scroll with the copy.

## 5. Wall of real work (behind the laptop)

A tilted, faded plane of the real project screenshots sits behind the laptop on the forest wall. It gives texture, and the first thing seen is our own work.

- **Data-driven** from `portfolio.json`: use each project's `image.src960`, repeated to fill a 5×4 grid (20 tiles; with 3 projects, cycle K, M, E…). New projects appear automatically.
- **Structure**
  - A layer inside `.portal__frame`, behind the lid (same z order as the wall), with the **same display-hole mask** as `.portal__wall`, so it never shows inside the screen. It scales with the frame during the dive; the fly-past is intended.
  - It is a static child plane: about 2400px wide, `transform: rotateX(52deg) rotateZ(-14deg)`, centred, gap 28px.
  - Tiles are 2:1, `object-fit: cover; object-position: right top`, radius 14px.
  - A radial mask fades it out to the edges: an ellipse of 62%×58%, solid at the centre, gone by 78%.
- **Tone**
  - Plane opacity .34.
  - **No `filter: saturate`:** mute the client colours with a forest tint layer on top instead (`radial-gradient(ellipse 70% 60% at 50% 50%, <forest 10%>, <forest 75%> 80%)`, tokenised).
  - The result should read as texture, never as competing content (compare the approved screenshot).
- **Performance**
  - Images use `loading="lazy"`, `decoding="async"`, `fetchpriority="low"`, and are injected after the hero's first paint (idle callback), so the LCP is unaffected. Set width/height.
  - Nothing inside the plane animates; add `contain: strict` on its box.
  - Measure: no long tasks > 50ms and no dropped frames while scrolling the dive on a 4× CPU-throttled profile. If the dive janks, render only 12 tiles.
- **Where it is off:** skipped in `portal--lite` and below 760px (plain grid wall there), and absent in the static / no-JS layout.
- **Reduced motion:** shown (static).

## 6. Docs

- **DESIGN.md**
  - Hero exception: lit screen, silver device, glow + floor, three decorative float cards (hidden on small / tight / stacked), wall of work (masked, tinted, static).
  - New tokens and the contrast numbers.
- **Mockups:** put the approved mockup HTML and screenshot in `docs/mockups/` if they are not there already (the owner will provide them there).

---

## Acceptance

- [ ] **Resting state** at 1920, 1440, 1280×800 and 1024 matches the approved mockup: lit screen, silver device clearly separated from the wall, glow + floor, three cards overlapping the lid edges, and the wall of work visible but quiet. No horizontal scroll.
- [ ] **Stacked / phones (390, 768):** the copy above the laptop keeps the forest tokens and is readable. No cards and no wall. The laptop is silver with a lit screen.
- [ ] **Scroll through the whole dive:**
  - the cards drift out and are gone by ~20%;
  - the statement is fully on the lit glass whenever visible (dark text, readable);
  - the loader shows;
  - no white flash or seam at the load;
  - the fly-through into Proof is smooth.

  Record a short capture or frames at 0/15/30/50/70/90/100%.
- [ ] **Reduced motion and no-JS:** unchanged static layout (forest band, static laptop outline, then Proof), with nothing broken by the new layers.
- [ ] **Contrast report** (section 1) passes AA. One primary button per viewport. CTA green is used only on clickables.
- [ ] **Performance:**
  - LCP is not delayed by the wall images (report LCP before and after);
  - no long tasks > 50ms during the dive at 4× throttle;
  - console clean.
- [ ] **No new dependencies;** tokens only in component CSS.

One commit on `copy/final-pass` ("Hero: lit screen, silver device, depth layers"), **do not push**. Report with screenshots:
- the rest state at 1440 and 1280×800;
- 390;
- 3 mid-dive frames;
- the contrast table.
