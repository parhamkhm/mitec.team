# PORTAL v2 — laptop device + intro statement

Follow-up to `CLAUDE_CODE_MASTER_PROMPT.md`. The portal hero you built in Phase 2 is approved: keep its feel (damping, accelerating dive, nav switch, reduced-motion teardown). This task changes **what the visitor dives into** and **adds one narrative beat** before the room. Everything in the master prompt still applies unless this file overrides it.

Work on the same branch, one commit, then **stop and report** so the owner can review in the browser. Do not start Phase 3.

---

## 1. What changes

1. **The rounded square becomes a laptop.** The visitor sees a laptop (front view, lid open, base below). The window they dive through is the laptop's **display**, not a square.
2. **The dive goes into the screen.** The camera moves toward the display and passes through it. The lid and keyboard deck grow past the viewport edges; the base drops out of view at the bottom first.
3. **New intro statement ("the screen is loading").** After the hero copy lifts off and before the room appears, the laptop screen shows a short statement that reveals in steps, with a thin loading line under it. Then the text clears, the screen "loads" (the glass fades to reveal the light room), and the dive completes into the site. The statement is exactly:

```
آماده‌ای راهکار دیجیتال کسب‌وکارت رو بسازی؟
سایتت. سبک خودت. انتخاب‌های تو.
```

Keep the characters exactly as written, including the zero-width non-joiners (in «آماده‌ای», «کسب‌وکارت», «انتخاب‌های») and the Persian question mark «؟».

## 2. Current code you are changing (read first)

- `project/index.html` → `.portal` > `.portal__stage` > `.portal__copy` (hero copy), `.portal__room` (Proof section), `.portal__frame` (wall, glass, glow, rim), `.portal__hint`.
- `project/src/scripts/motion/portal.js` → `render(p)` timeline, `scene.measure()` geometry (`S`, `L`, `sExit`, `R`, `--portal-hole` SVG mask).
- `project/src/styles/portal.css` → static layout, `html.motion` scene, masks (`.portal__wall`, `.portal__rim`, `.portal__glow`).
- Keep unchanged: `engine.js`, `easing.js`, the damping in `scene.update()`, the `whenMotion()` setup/teardown pattern, `setNav()` hysteresis, the focus guard, the hint button behaviour.

## 3. The laptop (CSS/SVG only, never a raster image)

The laptop is scaled up many times during the dive, so it must be built from DOM/CSS or inline SVG to stay sharp. No PNG/JPG/WebP mockups.

Structure inside `.portal__frame` (one transformed container, as now):

```
.portal__frame
  .portal__wall      forest + .texture-grid, masked with the DISPLAY-shaped hole (same XOR mask technique as now)
  .portal__glow      one mint radial glow behind the laptop, masked off the display
  .portal__lid       the lid body: bezel ring around the display, masked with the same hole
    .portal__camera  6px dot, top bezel centre
  .portal__glass     fills the display (the "screen off / loading" state)
    .portal__reflection  one soft diagonal highlight (desktop only)
  .portal__base      keyboard deck below the lid: trapezoid + centred thumb notch
```

Geometry (all computed in `measure()`, written as CSS vars):
- Display: aspect **16:10**. `W = min(70vw, 860px, 0.62 × vh × 1.6)`, `H = W / 1.6` (the height term protects 1280×720 laptops). Display radius `r = clamp(8px, 1.2% of W, 12px)`.
- Bezel: `b = clamp(10px, 1.6% of W, 16px)` on sides and top, `1.4b` at the bottom (chin). Lid radius `r + b`.
- Base: width `1.16 × lid width`, height `clamp(10px, 2% of W, 16px)`, trapezoid via `clip-path: polygon(1.5% 0, 98.5% 0, 100% 100%, 0 100%)` (the same shape the old `.hero__laptop-base` used), thumb notch `16%` wide × `35%` of base height, centred on the top edge.
- Replace `--portal-s` (square) with `--screen-w` / `--screen-h` / `--screen-r`. Update the `--portal-hole` SVG to a `W×H` rect with radius `r` (viewBox in the display's aspect, not 100×100).
- `transform-origin` of `.portal__frame` = **the display centre**, and the display centre sits at the viewport centre, so the camera always flies straight into the screen.

Colours (semantic tokens only; add primitives to `tokens.css` only if something is truly missing):
- Lid: `--color-surface-elevated` (on forest) with a 1px `--color-border` edge.
- Bezel inner edge / chin: `--color-surface-sunken`.
- Camera: `--color-border-strong`.
- Base: a single-hue gradient from `--color-border-strong` to `--color-border` (DESIGN.md §8: single hue, no black shadows on forest).
- Glass: `--color-surface` (as now).
- The existing `--color-rim-*` / `--color-sheen` tokens and the conic rim sheen are **removed**; the reflection on the glass replaces the sheen: a 35%-wide `linear-gradient(115deg, transparent, rgba(241,245,242,.06), transparent)` band that slides from start to end across the display with progress (`translateX` only). Remove any token that becomes unused.

## 4. Copy placement

- **Desktop / laptop / tablet (≥ 760px):** at p = 0 the hero copy sits **inside the display**, centred, so the laptop looks like it is showing the headline. Constrain `.portal__copy` content to `max-width: W − 2 × 48px`. If the copy does not fit in `H` at the current width (measure it), reduce the H1 size with the existing clamp's lower bound, not by overflowing the screen.
- **Mobile (< 760px):** the display is too small for the copy. Stack instead: copy in the upper part of the stage, laptop centred in the lower part (translateY). In Phase 1 the copy lifts off and the laptop translates to the vertical centre while it scales, then the rest of the timeline is the same.

## 5. The intro statement

Markup: a new element **after** `.portal__copy` and **before** `.portal__room` in the DOM (reading order: H1 → statement → Proof):

```html
<p class="portal__intro" data-surface="dark">
  <span class="portal__intro-line">…line 1, one <span class="w"> per word…</span>
  <span class="portal__intro-line">
    <span class="portal__intro-phrase">سایتت.</span>
    <span class="portal__intro-phrase">سبک خودت.</span>
    <span class="portal__intro-phrase">انتخاب‌های تو.</span>
  </span>
</p>
<div class="portal__loader" aria-hidden="true"><span></span></div>
```

- Split line 1 **by words only** (split on spaces, never inside a word, never by characters; keep ZWNJ-joined words as a single word). Build the spans in the HTML, not at runtime, so the no-JS text is correct.
- Typography: line 1 `clamp(24px, 3.2vw, 44px)`, weight 700, `--color-text-primary` (on forest = `#F1F5F2`). Line 2 `clamp(18px, 2vw, 26px)`, weight 500, `--color-text-body`. `letter-spacing: 0`, `line-height` 1.5, centred, max-width 20em.
- It is a **viewport-centred layer** (sibling of the frame, `z-index` above the glass, below the nav). It does not inherit the frame's scale; it has its own slow push-in `scale(.97 → 1.03)` across its visible window, so it never balloons or blurs.
- The loader: 2px high, 160px wide (120px on mobile), centred 32px under the statement. Track `--color-border`; fill `--color-text-secondary` (not the CTA token: it is not clickable), `transform: scaleX()` from the start edge (right in RTL).
- Readability rule: the statement only ever sits over the glass (forest). It must reach opacity 0 **before** the glass starts fading.
- Without motion (no JS, reduced motion, forced colours): render the statement as a static centred block inside the forest band, under the hero copy; hide the loader.

## 6. New timeline (replaces the table in master prompt §7.3)

Scroll length grows to make room for the statement: `L = 3.0 × vh` desktop/laptop, `2.4 × vh` tablet, `2.1 × vh` mobile. The Z-roll (`R`, ±8°) is **removed**: a rolling laptop reads as falling, not as leaning in. Depth comes from the lid tilt instead (below). Keep the perspective on `.portal__stage` at `1600px`.

| Phase | p | Element | Change | Ease |
|---|---|---|---|---|
| Initial | 0 | laptop | lid tilted back `rotateX(10deg)`, display showing the hero copy over the glass; glow at .5; hint visible | — |
| 1 · Lean in | 0 – .03 | hint | opacity 1 → 0, then `hidden` | linear |
| | 0 – .15 | copy: eyebrow 0 – .10, H1 .015 – .12, sub .03 – .14, actions .045 – .15 | lift `−14vh`, opacity 1 → 0; actions `inert` at 0 (all copy is gone before the statement starts at .16) | linear / inCubic |
| | 0 – .18 | frame | `rotateX 10° → 0`, scale 1 → 1.25 | inOutSine |
| | 0 – .18 | base | extra `translateY(0 → 6% of H)` (falls away first) | inCubic |
| 2 · Statement | .16 – .28 | line 1 words | each word opacity 0 → 1, `translateY(14px → 0)`; stagger spread evenly over the range | outCubic |
| | .27 – .40 | line 2 phrases | same reveal, three steps | outCubic |
| | .18 – .46 | loader | `scaleX 0 → 1` | inOutSine |
| | .16 – .54 | statement layer | `scale .97 → 1.03` | linear |
| | .18 – .50 | frame | scale 1.25 → 1.6 (slow approach while reading) | inOutSine |
| | .40 – .48 | — | hold: statement fully visible | — |
| | .48 – .54 | statement + loader | opacity 1 → 0, `translateY(0 → −12px)` | inCubic |
| 3 · Screen loads | .54 – .66 | glass | opacity 1 → 0 (the room appears on the screen) | inOutSine |
| | .54 – .66 | glow | opacity → 1 (the screen lights the room) | outCubic |
| | .54 – .80 | frame | scale 1.6 → `sExit` | inCubic |
| | .20 – .75 | reflection | slides across the display | linear |
| 4 · Through | 0 – .54 | room | scale .42 → .50 | inOutSine |
| | .54 – .88 | room | scale .50 → 1 | inOutCubic |
| | .74 – .88 | stat items | reveal, stagger .04 (as now) | outCubic |
| | .82 – .94 | project-name strip | reveal | outCubic |
| | .80 – .85 | frame | opacity 1 → 0, then `visibility: hidden` | linear |
| | ≥ .86 | nav | light surface (hysteresis .02) | CSS |
| Final | .92 – 1 | — | hold, then the stage releases into Work | — |

- `sExit = max(vw / W, vh / H) × 1.12` (the hole only has to clear the viewport now that there is no roll; recompute on resize).
- Mobile/lite: no lid tilt, no reflection, word reveal becomes line-level fades (line 1 at .16 – .28, line 2 at .27 – .40), everything else identical.
- The whole scene stays a pure function of the damped progress: scrolling back up must replay it in reverse (statement reappears, glass returns, copy returns).

## 7. Constraints (unchanged from the master prompt, restated because they bite here)

- Per frame: only `transform` and `opacity` (plus the `inert` / `hidden` / `visibility` toggles you already have). Masks are set once in `measure()`.
- `rotateX` needs `transform-style: flat` on the masked children and `backface-visibility: hidden` on the frame; verify the mask still clips correctly in Chrome, Firefox and Safari while tilted. If a browser mis-renders the masked layer under 3D transform, drop the tilt for that browser rather than switching to a per-frame mask.
- No new dependencies, no WebGL, no raster laptop image.
- Semantic tokens only; one primary button per viewport; no CTA-green on non-clickables.
- Update `DESIGN.md` (hero exception now describes the laptop portal and the intro statement) and the header comment of `portal.css` / `portal.js`.

## 8. Acceptance checklist

- [ ] At p = 0 on 1920×1080, 1440×900 and 1280×720 the laptop is fully visible, the copy sits inside the display without overflow, and nothing overlaps the nav.
- [ ] At 390×844 the copy sits above the laptop and neither is cropped.
- [ ] The camera flies straight into the display centre; the base leaves the viewport first; no roll.
- [ ] The statement is readable for a real pause (≥ 8% of the track) before it clears; words never break apart; ZWNJs intact.
- [ ] No light text ever sits over the light room (statement at 0 before glass starts fading).
- [ ] The laptop edges stay sharp at maximum scale (no raster blur).
- [ ] Scroll up replays everything in reverse without jumps.
- [ ] Reduced motion / no JS: forest band with copy, a static laptop outline, the statement as static text, then Proof.
- [ ] DevTools Performance: no layout or paint storms per frame, no long tasks > 50 ms.
- [ ] Console clean.

When done, commit ("Portal v2: laptop device and intro statement"), then stop and report: what changed, which acceptance items you verified and how, and anything you had to deviate from.
