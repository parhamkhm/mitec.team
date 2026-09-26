# WORK v6 — 3D coverflow carousel + expandable project details

Replace the current Work media presentation (the forest tiles / browser frames / laptop version, whichever is in the code now) with a **3D coverflow carousel** whose centre card **expands into a detail panel** on click.

Two components from 21st.dev are the **visual and behavioural reference only**: "3D Coverflow Carousel" (layout, 3D stage, ambient backdrop) and "Floating Card Gallery" (click to reveal more information). Their code is React + Tailwind + shadcn + framer-motion. **This project is vanilla HTML/CSS/ES modules with no build step:**
- **Do not** install or add React, TypeScript, Tailwind, shadcn, framer-motion, lucide-react or any npm package.
- **Do not** copy their inline styles, hex colours, fonts, Unsplash images or English copy.
- Rebuild the behaviour below in plain JS on top of the existing motion engine and design tokens.

Work on `copy/final-pass` (already synced with main). Leave the laptop component used by the portal hero untouched; only remove Work-specific media code that is no longer used.

---

## 1. Section layout

- The Work section becomes a **dark band** (`data-surface="dark"`), so every token remaps.
  - Heading stays centred: eyebrow «نمونه‌کارها», title «پروژه‌هایی که تحویل داده‌ایم», sub «هر پروژه با یک نیاز مشخص شروع شد و با یک راهکار مشخص به نتیجه رسید.».
  - Under the heading comes the carousel stage, then the controls row (arrows + dots).
- **Ambient backdrop** (the reference's blurred background):
  - Use the pre-blurred files `public/images/work/{karamad,mery,e2}-home-ambient.webp`. Do not add CSS `filter: blur()`.
  - Two stacked full-bleed layers crossfade (opacity, 700ms) to the active project's ambient image when the slide changes.
  - Above them sits a radial overlay from transparent-ish in the centre to the forest background (`--color-bg` on dark) at the edges, so the band always reads as mitec forest. The client's colours only tint the middle.
- Section vertical padding: `--section-pad`. Stage height: `clamp(420px, 56vw, 560px)` on desktop.
- Update DESIGN.md: Work is an allowed dark band (documented exception next to the hero and the CTA band). The client colours appear only in screenshots and the ambient glow, never in our tokens.

## 2. Cards (data-driven)

Render the cards from `src/data/portfolio.json`. Add these optional fields per project and fill them for the three current projects:
- `summary`: one short line for the card face.
  - karamad: «فروشگاه اینترنتی با دسته‌بندی فنی و پنل مدیریت»
  - mery: «منوی آنلاین دوزبانه و باشگاه مشتریان امتیازی»
  - e2: «منوی QR سبک و سریع، بهینه برای موبایل»
- `image`: `src960` / `src1920` / `alt` (already present or add), plus `ambient`.

Card face:
- **Shape and image:** portrait card, `aspect-ratio: 4 / 5`, width `clamp(260px, 26vw, 340px)`, radius `--radius-xl`, 1px `--color-border`. The screenshot fills it as a full-bleed `object-fit: cover; object-position: right center` (RTL sites put their headline on the right, so the crop keeps each site's hero text).
- **Readability gradient:** a vertical overlay from transparent (top 30%) to near-solid forest (bottom), so the text is always readable. Check contrast.
- **Top-start:** tag chips (existing tags, e.g. «منوی آنلاین»).
- **Bottom, centred:**
  - title (weight 800);
  - a 32px accent rule in `--color-accent` (mint);
  - `summary` in `--color-text-body`;
  - a **tonal** button «جزئیات پروژه» (not primary; the page keeps one primary per viewport).

## 3. Coverflow behaviour (from reference 1)

Stage: `perspective: 1400px`. Position each card by its offset from the active index (wrap-around).

| Offset | translateX | scale | rotateY | opacity | z |
|---|---|---|---|---|---|
| 0 (active) | 0 | 1 | 0 | 1 | 30 |
| ±1 | ±86% of card width | .84 | ∓24deg | .65 | 20 |
| ±2 | ±155% of card width | .68 | ∓38deg | .38 | 10 |
| other | 0 | .4 | 0 | 0 | 0 (hidden, `inert`) |

- **RTL:** "next" is the card on the **left**. The ArrowLeft key and the left arrow button go to the next card; ArrowRight and the right arrow button go to the previous one.
- Transitions: `transform` and `opacity` only, 800ms `cubic-bezier(.25,1,.5,1)`.
  - Do not use CSS `filter` for dimming. Dim side cards with a dark overlay layer whose opacity changes instead.
  - The card-face content fades in on the active card only (opacity + translateY 16px → 0, 500ms). Side cards show just the image under the dim layer.
- Clicking a side card makes it active. Clicking the active card or its «جزئیات پروژه» button opens the details (section 4).
- **Controls:**
  - two round arrow buttons (44px, on-dark outline style) at the stage edges;
  - dots below: active dot is a 28px pill in `--color-accent`, the rest 8px in `--color-border-strong`;
  - all controls have Persian `aria-label`s («پروژه‌ی بعدی»، «پروژه‌ی قبلی»، «رفتن به پروژه‌ی ۲»).
- Swipe on touch (threshold 45px). Keyboard arrows only while focus is inside the carousel, never on the whole window.
- **Infinite loop, any number of projects.** The carousel never has an end and never shows a "1 / 2 / 3 special layout".
  - The stage always shows the full 5 visible positions (−2 … +2) filled, whatever the project count, and keeps rotating endlessly in both directions.
  - **Recycled slots.** Build a fixed pool of 7 card elements for positions −3 … +3 (±3 are invisible staging slots, opacity 0, `inert`).
    - Keep an unbounded virtual index (`active` can grow past N or go negative).
    - Each slot shows `projects[mod(virtualIndex, N)]`, so with only 3 projects the same project can appear twice on screen (as a clone). That is intended and gives a seamless loop.
    - When a slot moves out past ±3, recycle it to the opposite ±3 while it is invisible, swap in its new content, then let it animate in. No card may ever fly across the stage when wrapping.
  - Adding projects to `portfolio.json` needs no code change; 3 or 30 projects behave the same.
  - With a single project, still show it centred with its clones on the sides for the loop look, but hide the arrows and dots (nothing to navigate).
  - **Dots:** with up to 7 projects, one dot per project (the active one follows `mod(active, N)`). With more than 7, replace them with a counter «۳ از ۱۲» (Persian digits) and a thin progress bar, so the controls never overflow.
- **Autoplay: on, as a continuous loop.** Advance to the next card every 4.5s, forever (it wraps via the infinite loop).
  - Pause on hover, on keyboard focus inside the carousel, while the detail panel is open, and while the section is off-screen (IntersectionObserver).
  - After a manual interaction (arrow, dot, swipe, click), pause for 8s, then resume.
  - Reduced motion: no autoplay.
  - Expose `data-autoplay` (default true) and `data-autoplay-delay` on the section.
  - Add a small pause/play toggle button next to the dots («توقف چرخش» / «ادامه‌ی چرخش»), as required for auto-moving content.
- **Optional subtle stage tilt** (from reference 2): on fine pointers, the whole stage rotates at most ±3deg toward the mouse, eased via the existing rAF engine. Off for touch and reduced motion.

## 4. Expanded details (from reference 2)

Opening the active card shows a **detail panel**:
- **Animation:** it scales from the card's own rect (FLIP: start at the card's position and size, animate to the panel's; transform/opacity only; `scale .9 → 1`, opacity 0 → 1, 350ms `--ease-out`). The side cards dim further (.2) and the ambient brightens slightly.
- **Size and layout:** `min(960px, 92vw)`, max-height `86vh` with internal scroll. The panel is a raised forest surface with a `--forest-line` border and radius `--radius-xl`. Two columns ≥ 900px, stacked below.
  - **Media column:** the **full** screenshot (natural ~2:1, never cropped) with the 960/1920 srcset, in a rounded frame.
  - **Text column:**
    - tags;
    - title;
    - the three existing blocks «نیاز کسب‌وکار» / «راهکار ما» / «نتیجه»;
    - the site link «دیدن سایت» (outline button, opens in a new tab), or the existing «لینک سایت بعد از تأیید مشتری منتشر می‌شود.» note;
    - a close button (× icon, 44px) at the top-start corner.
- **Accessibility:**
  - `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the project title;
  - focus moves into the panel on open and is trapped there;
  - Esc, the close button or a click on the dimmed backdrop closes it, and focus returns to the card that opened it;
  - background content is `inert` while it is open.
- Prev/next are disabled while the panel is open.

## 5. Responsive, fallbacks, performance

- **< 760px:**
  - card width 72vw;
  - side cards peek at ±62% with rotateY ∓18deg and scale .86;
  - arrows hidden; swipe and dots remain;
  - the detail panel becomes a bottom sheet (full width, max-height 88vh, slides up) with the screenshot above the text.
- **Reduced motion:** no 3D (all rotateY 0, side cards translate and fade only), crossfades instead of scale, and the detail panel fades without FLIP.
- **No JS:** a horizontal scroll-snap row of cards with the details (need / solution / result / link) rendered under each card. Everything readable, no hidden content.
- **Images:** active card image eager, others lazy; srcset with 960w/1920w; width/height set. Ambient images are tiny; preload only the first.
- **Performance:** one listener set, transforms written in a single rAF, and no per-frame layout reads. Check that there are no long tasks > 50ms while sliding.

## Acceptance

- [ ] At 1920, 1440, 1280, 768 and 390, the stage, cards and controls fit with no horizontal scroll, and the card text is readable (report contrast of title/summary over the gradient).
- [ ] RTL direction is correct for arrows, keys and swipe.
- [ ] 1, 2, 3 and 5 projects (test with temporary data, then revert) all look intentional.
- [ ] The detail panel opens from the card, traps focus, closes with Esc, backdrop click and ×, and returns focus. The full screenshot is shown uncropped.
- [ ] Reduced motion and no-JS fallbacks work.
- [ ] No new dependencies; semantic tokens only; one primary button per viewport; console clean.

One commit on `copy/final-pass`, do not push. Report with screenshots: the carousel at rest, mid-transition, and with the detail panel open (desktop and 390px).
