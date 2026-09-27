# WORK v7 — screenshot-only cards, click cue, caption under the stage

Follow-up to V6 and the card-flip change. The coverflow, infinite loop, autoplay, ambient backdrop and the **back face** (tabs «نیاز» · «راهکار» · «نتیجه», close ×, «دیدن سایت») are approved. **Do not change them** beyond what is listed here.

What the owner wants: the card front shows **only the client's website**, with no text covering it. A small, clear cue tells visitors that clicking shows more. The project name moves **under the stage**, into the empty band between the active card and the dots/pause row.

Constraints (unchanged): vanilla HTML/CSS/ES modules, no build step, no new dependencies, semantic tokens only (no new hex), RTL, Persian digits, `letter-spacing: 0` on Persian, animate only `transform`/`opacity`, full `prefers-reduced-motion` support.

Before you start: `git checkout copy/final-pass && git pull`. If `main` has new commits, merge `main` into `copy/final-pass` first (no rebase, no force). Then work on `copy/final-pass`.

---

## 1. Card front = the website, nothing else

- **Remove from the front face:** the readability gradient, the tag chips, the title, the mint rule, the summary and the «جزئیات پروژه» button. Keep that markup only on the back face (and in the no-JS fallback).
- **Landscape cards.** A desktop screenshot cropped into a 4:5 portrait card shows only a slice of the site and is hard to recognise. With no text on the face, the card should show the site the way a visitor sees it:
  - Put the ratio in one variable: `--work-card-ratio: 16 / 10` (the owner can switch back to `4 / 5` with one line).
  - Width `clamp(300px, 42vw, 600px)`.
  - The image stays `object-fit: cover`, with `object-position: right top` (RTL sites keep their logo and hero text on the right, above the fold).
- **Retune the coverflow for the wider card.** Starting values below; tune them so that at ≥ 1280px the ±2 cards are at least ~40% visible, nothing overlaps the active card's click cue, and the page has no horizontal scroll (`overflow-x: clip` on the section).

  | Offset | translateX (× card width) | scale | rotateY | opacity |
  |---|---|---|---|---|
  | 0 | 0 | 1 | 0 | 1 |
  | ±1 | ±0.70 | .82 | ∓28deg | .6 |
  | ±2 | ±1.22 | .64 | ∓40deg | .3 |
  | ±3 (staging) | ±1.60 | .5 | ∓45deg | 0 (`inert`) |

- **Stage height:** `clamp(300px, 30vw, 440px)`, reduced to fit the new card height plus shadow.
- **Separating white sites from the dark band:**
  - 1px `--color-border` (on-dark) around the card;
  - the existing elevation shadow;
  - a very thin inner top highlight (inset box-shadow, on-dark border-subtle token).

  No green halo and no forest frame.
- **Side cards:** the dim overlay stays as it is.

## 2. The click cue

The whole active card is the control. The cue only tells visitors that.

- **Semantics:**
  - The active card is a `<button>` (or `role="button"` + `tabindex="0"`) with `aria-label` «{name} — مشاهده‌ی جزئیات پروژه» and `aria-expanded` tied to the flip state.
  - Side cards get `aria-label` «رفتن به پروژه‌ی {name}».
  - The image `alt` stays descriptive.
- **Cue chip.** One small chip sits at the **bottom-end corner** of the active card (bottom-left in RTL), 12px from the edges. It is visible only on the active card, never on side cards.
  - **Anatomy:** a 40px circle with a `+` icon (the existing icon set, 18px). Next to the icon is the label «جزئیات پروژه». The chip background is the raised forest surface token at about 88% opacity, with the on-dark text colour and a 1px border-subtle. Do not use `backdrop-filter`.
  - **Collapsed (default on fine pointers):** only the circle shows.
  - **Expanded:** it grows into a pill showing the label. Build this with transforms only:
    - the pill background is its own layer that animates `transform: scaleX()` from the circle width to the full pill width, anchored at the end side;
    - the label fades and slides in (opacity 0 → 1, translateX 6px → 0);
    - the icon stays fixed;
    - 260ms `--ease-out`.
  - **When it expands:** on hover over the active card, on keyboard focus of the card, and during the first-view hint (below).
  - **Touch / coarse pointers:** the chip is always expanded, with the shorter label «جزئیات».
- **Hover response of the whole active card (fine pointers):**
  - the screenshot scales 1 → 1.03 inside the card (the image layer only; the card keeps its size and `overflow: hidden`);
  - the card lifts 4px (translateY);
  - the ambient backdrop brightens slightly (overlay opacity);
  - the cursor is `pointer`.
- **First-view hint (once per page load):**
  1. The first time the section is ≥ 50% in view, the chip expands.
  2. A soft ring pulses out of it twice. Use a pseudo-element: scale 1 → 1.6, opacity .5 → 0, 1.2s.
  3. The chip holds for 2.4s, then collapses.
  4. Do not repeat it on later slide changes.

  Autoplay is not paused by the hint.
- **When flipped:** the chip fades out (the back face has its own close ×) and fades back in on close.
- **Reduced motion:** no pulse, no lift, no zoom. The chip stays expanded with its label.

## 3. Caption under the stage (the empty band)

A caption block sits between the stage and the controls row. It is centred and as wide as the active card (max 600px), and it always describes the active project.

- **Content:**
  - **Name.** Use the optional field `name` from `portfolio.json`. If it is missing, use the part of `title` before «؛», trimmed. Do not invent names. Weight 800, the card-title size token, on-dark heading colour.
  - **Summary.** One line from `summary`, body token in the muted on-dark text colour, clamped to 1 line (full text in the `title` attribute). If a project has no `summary`, show its tags joined with « · ».
- **Tags stay on the back face only.** They are not repeated in the caption.
- **Layout:**
  - reserve the caption's height (`min-height` for the name plus one summary line) so nothing below jumps when projects change;
  - spacing: `--space-5` above (from the stage), `--space-4` below (to the controls).
- **Transition on slide change,** in the direction of travel (RTL aware; "next" comes from the left):
  1. The old caption fades out and moves 8px against the direction of travel (180ms).
  2. The new caption fades in from 12px on the travel side (320ms, 100ms delay, `--ease-out`).
  3. The name and the summary stagger by 60ms.
  4. Transform/opacity only.
- **Screen readers:** keep `aria-live="off"` while autoplay changes slides (announcing every 4.5s is noise). Switch it to `"polite"` only for manual navigation (arrows, dots, swipe, keys, clicking a side card), then back to `"off"`.
- **While flipped:** dim the caption to opacity .35. The back face already shows the title.
- **Not clickable.** The card is the single control, so the caption is plain text.
- **Reduced motion:** a plain 150ms crossfade.

## 4. Mobile (< 760px)

- Card width `86vw` (landscape ratio kept).
- Side cards peek at ±0.62 with rotateY ∓16deg and scale .86. Arrows hidden, swipe + dots remain, as before.
- **Details at this width:** a flipped 16:10 card is too short to read (~210px tall). So at < 760px, tapping the card opens the **same back-face content** as a bottom sheet, not a flip:
  - reuse the component and don't duplicate markup;
  - the sheet is full width, max-height 88vh, with the screenshot on top, then the tabs and the «دیدن سایت» footer;
  - it slides up with transform;
  - it follows the dialog rules: focus trap, Esc, backdrop tap and × close it, focus returns to the card, and the background is `inert`.

  ≥ 760px keeps the flip.
- The caption stays under the stage, with the summary allowed 2 lines on mobile.
- The chip is always expanded («جزئیات»).

## 5. Optional, data-driven: "scroll preview" on hover

Build this only as an opt-in that is **off when the data is absent** (no current project has it yet):

- If a project has `image.full` (a tall full-page screenshot, WebP), then on hover or focus of the active card (fine pointers, no reduced motion), the card slowly pans that image from the top to near the bottom:
  - use `transform: translateY()`, about 6s, linear-ish easing;
  - the image layer's height comes from the image's intrinsic ratio;
  - no per-frame layout reads.

  On leave, it eases back to the top in 600ms. The visitor sees the site "being scrolled".
- Document the field in the portfolio data docs: the recommended size is 1440px wide, ≤ 400KB WebP, lazy-loaded only when the card first becomes active.
- Without `image.full`, nothing changes.

## 6. No-JS fallback

The scroll-snap row stays. Each item shows the screenshot, then the name + summary caption, then the need/solution/result and link. Everything is readable without JS.

## 7. Docs

- **DESIGN.md:** Work cards are "screenshot-only faces". Record the cue-chip rule (one per active card, bottom-end), the caption rule, and `--work-card-ratio`.
- **Portfolio data docs:** add the optional `name` and `image.full` fields.

---

## Acceptance

- [ ] **No text on the front:** at 1920, 1440, 1280, 768 and 390, no text sits on any card front. The only element on the active card's front is the cue chip. There is no horizontal scroll, and the ±2 cards are visible at ≥ 1280px.
- [ ] **Screenshots:** each project's screenshot is recognisable on its card (logo and hero area visible). Include a screenshot of each of the 3 projects as the active card.
- [ ] **Cue chip:**
  - expands on hover and focus;
  - the first-view hint plays once only;
  - always expanded on touch;
  - hidden on side cards and while flipped;
  - contrast of the chip label ≥ 4.5:1 over both the lightest and the darkest screenshot (report the numbers).
- [ ] **Caption:**
  - always matches the active project, including after 30 steps each way and during autoplay;
  - no layout jump when it changes;
  - direction of the transition is correct in RTL;
  - `aria-live` stays silent during autoplay and polite on manual navigation.
- [ ] **Keyboard:** Tab reaches the active card. Enter/Space flips it. Esc closes. Arrow keys move slides only while focus is inside the carousel.
- [ ] **Details:** the flip still works at ≥ 760px. The bottom sheet works at 390px with correct focus handling.
- [ ] **Reduced motion:** no 3D, pulse, zoom, lift or pan; crossfades only; chip label visible.
- [ ] **Scroll preview:** tested with a temporary `image.full` on one project (then reverted); without it, no behaviour change.
- [ ] **General:** semantic tokens only, no new dependencies, console clean, no long tasks > 50ms while sliding.

One commit on `copy/final-pass` ("Work: screenshot-only cards, cue chip, caption"), **do not push**. Report with screenshots:
- the carousel at rest (1440 and 390);
- hover with the chip expanded;
- the first-view hint;
- the flipped card (1440);
- the bottom sheet (390).
