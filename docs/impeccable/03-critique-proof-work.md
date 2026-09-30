Method: dual-agent (A: design-review subagent · B: detector subagent). Both assessments ran isolated; B's results were
read only after A had finished. An API usage limit interrupted both part-way; each was resumed with its context
intact.

# Impeccable critique — the Proof room and the Work coverflow

Phase 1, step 3 of `docs/prompts/IMPECCABLE_PASS.md`. Targets:
- `#proof`: the light room the hero dive lands in, with the stats card.
- `#work`: the forest band with the coverflow built from `portfolio.json`, the cue chip, the caption, the in-place
  flip at 990px and up, and the bottom-sheet dialog below 990px.

Every interaction was tried at 1440×900, 1280×800, 768×1024 and 390×844, and with reduced motion: next and previous,
dots, pause, open, tabs, Escape. There were no console errors. Nothing was changed.

**Not re-raised:**
- A7 (dots 24px, pause 36px), A10 (dot `width` transition), A11 (`portfolio.json` ×3), A12 (ambient `<img>`), C2, C3
  and C5.
- The Latin `name` in the caption is deliberate (`docs/portfolio-guide.md`).
- The coverflow logic is off-limits except for real bugs.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Dots, counter, caption and the toggle's label are clear. Nothing warns that autoplay is about to turn |
| 2 | Match System / Real World | 3 | RTL arrows and swipe are right. The card flip is a metaphor the visitor has to discover |
| 3 | User Control and Freedom | 2 | On touch nothing pauses autoplay by itself (hover and focus pausing don't happen), so cards turn under a reader's thumb |
| 4 | Consistency and Standards | 3 | Tabs, sheet and arrows follow conventions |
| 5 | Error Prevention | 3 | A tap during an autoplay turn can land on the card that slid under the finger |
| 6 | Recognition Rather Than Recall | 2 | Need, built and result show one tab at a time, so the story has to be held in memory |
| 7 | Flexibility and Efficiency | n/a | Landing page, no repeat use (keyboard parity exists: arrows, Home/End) |
| 8 | Aesthetic and Minimalist Design | 2 | Side cards ghost through each other. The back is heavy chrome around one sentence. Proof is sparse |
| 9 | Error Recovery | 3 | Falls back to the static list if the data fails, and a note explains a missing link |
| 10 | Help and Documentation | n/a | Persuade section; the cue chip and first-view hint do the onboarding |
| **Total** | | **21/32** | **Acceptable (66%)** |

## Design Specificity Verdict

**LLM assessment.** Work is mostly authored for this product. The coverflow is a common pattern, but these parts are
mitec's own:
- screenshot-only faces cropped from the top right, where these RTL sites keep their hero;
- ambient light taken from the active client's own screenshot;
- a «نیاز → راهکار → نتیجه» story on every card, which mirrors the "describe your need" order builder;
- a slot pool that scales with no code change.

Proof could belong to any agency: eyebrow, heading, one line, and a white card with three numbers. Only
«۰ واسطه بین شما و تیم» carries the positioning. And because Proof is where a three-screen dive lands, a generic room
costs more here than it would anywhere else.

**Deterministic scan.**
- **Known or accepted:**
  - the stat bar's border and shadow (C5);
  - the card fronts' forest-tinted shadow and border (C3, C5);
  - the `.band.work` clipping (a verified false positive);
  - A10 (the dots' `width` transition);
  - A12 (the ambient layer's `buried-raster` / `broken-image`).
- **False positives, checked in the page:**
  - "low-contrast" and "body-text-viewport-edge" on the back faces of side slides (all seven backs are `inert`,
    `backface-visibility: hidden`, and clipped; the flipped centre card was measured at ≥ 4.66:1 in V7);
  - "edge-flush-cards" and three edge findings on the no-JS `ul.work-list`, which doesn't render under JS;
  - "body-text-viewport-edge" on the Proof sub (24px gutters, narrower during the dive).
- Nothing new from the detector; the issues below come from the design review.

**Visual overlays.** Injection succeeded. With the page scrolled to `#work` at 1440 the console reported 44 flagged
elements, all of them the known items above. The overlay was removed afterwards.

## Overall Impression

Work is the most convincing moment on the page. It has real client screens, lit by their own colour, and the story is
one tap away. Proof is where the dive's promise goes unpaid. The biggest opportunity is to give a visitor who has just
been convinced a way to act, especially on a phone.

## What's Working

1. **Screenshot faces with an ambient backdrop.** Mery's «قهوه. صبحانه. مکث.» and Karamad's store read at a glance,
   and the band stays forest.
2. **Robust to the data.** At 12 projects the controls become «۱ از ۱۲» and the Proof stat updates by itself. A long
   title clamps to two lines, and a long text scrolls with a fade.
3. **Focus handling is right at every viewport.** Opening moves focus to «نیاز». Escape, × or a tap on the veil
   returns it to the card.

## Priority Issues

**PW1 · [P2] Work is a dead end for conversion on phones and tablets**
- **What:**
  - At 768 and 390 the nav is a hamburger, and across Proof and Work (about 1,700px of scroll at 390) no «شروع پروژه»
    is visible.
  - The card back's `.work-card__foot` ends in «دیدن سایت» for one project and a muted note for the other two.
- **Why it matters:** Work is the moment of highest intent on the page.
- **Fix:** one **tonal** «شروع پروژه» (the existing label) under `.work-controls` or in `.work-card__foot`. It must
  not be solid, to keep one primary per viewport. Add a line for it to DESIGN.md §5 Work.
- **Suggested command:** `/impeccable layout` · **Effort:** S · Overlaps HE1 and MO1: a persistent nav CTA on phones
  would cover most of this.

**PW2 · [P2] The reduced-motion "flat row" is a stack of overlapping, see-through cards**
- **What:**
  - With motion off the cards keep their 50% and 88% offsets at scale 1.
  - At 1440 each ±1 card is half covered by the centre card, and at opacity .6 E2's "Evolve Your Energy" shows through
    Karamad's card.
  - At 390, neighbouring cards overlap by about 127px.
- **Why it matters:** visitors who ask for reduced motion get the muddiest version of the proof. DESIGN.md itself
  calls this state "a flat row".
- **Fix:** give the flat layout its own staging values in `work.js`'s `LAYOUT` table: no overlap, or only ±1 peeking at
  opacity 1 under `.work-card__dim`. This changes staging values, not the recycling logic, so it counts as a bug fix
  under the guardrail.
- **Suggested command:** `/impeccable harden` · **Effort:** S

**PW3 · [P2] Proof stat typesetting**
- **What:**
  - «۱ روز کاری» is set entirely at numeral size (44/41/30/23px, 800), so the least important stat is about four times
    wider than «۳» and «۰».
  - At 390 the labels break badly: «واسطه بین شما و / تیم» ends a line on «و», and «پروژه‌ی / تحویل‌شده» splits.
  - At 360 the value itself breaks («۱ روز / کاری»).
- **Why it matters:** it is the room's only content, and the eye goes to the wrong stat.
- **Fix:**
  - Split the value into a numeral and a unit (a `unit` field in `site-copy.json`), with the unit at label or h4 size,
    weight 700.
  - Below 760px, stack the stats as rows, with the numeral on the start side and the label beside it, and keep the
    numerals at `--text-h3` or larger.
  - Add `text-wrap: balance` to the labels.
- **Suggested command:** `/impeccable typeset` · **Effort:** S · Overlaps HE5 (the typesetting group).

**PW4 · [P2] The only evidence is a desktop homepage**
- **What:** at 390 both the card and the sheet show a 1920px desktop hero shrunk to 335px. That includes E2, whose
  summary says «بهینه برای موبایل». Karamad's «پنل مدیریت» and Mery's «باشگاه مشتریان» never appear.
- **Why it matters:** half the audience needs a service or tool, and sees only marketing homepages.
- **Fix:** add optional `image.mobile` and/or `image.panel` fields to `portfolio.json`, shown in the sheet's top shot
  (it already uses the natural ratio), and document them in `docs/portfolio-guide.md`. Needs new captures from the
  owner.
- **Suggested command:** `/impeccable adapt` · **Effort:** M

**PW5 · [P3] Accessibility details in the carousel**
- **What:**
  - `.work-carousel` puts `aria-roledescription` and `aria-label` on a div with no role, so assistive tech ignores
    both.
  - The dots are named «رفتن به پروژه‌ی ۱» rather than by project.
  - A two-line name at 390 grows the caption from 94px to 97px, so the dots and pause jump when autoplay reaches it.
- **Fix:**
  - Give the carousel `role="region"`.
  - Name the dots by project.
  - Clamp the caption name to one line (full text in `title`), or reserve two lines below 760px.
- **Suggested command:** `/impeccable harden` · **Effort:** S

## Persona Red Flags

**Jordan (first-timer)**
- «خودتان ببینید» promises something to see and shows three numbers.
- After opening a card, finding that «نتیجه» is a tab takes a second discovery.

**Riley (stress tester)**
- With one project the stage shows five identical Mery cards and no controls, beside a «۱» stat. It looks like a
  rendering glitch.
- Tapping during an autoplay turn moves the carousel instead of opening the card.

**Casey (one-handed, slow connection)**
- Autoplay keeps turning while she reads the two-line summary.
- The sheet's tabs are 34px tall and its × is 40px (this extends A7).
- About 260px of blank room before «نمونه‌کارها».

**Clinic manager deciding whether mitec can build her appointment system**
- The closest project, Karamad, sells medical equipment; it is not a clinic.
- Nothing shows booking, a patient panel or a CRM.
- Two of three projects have no live link.
- There is no nearby way to ask.

## Minor Observations

- The Proof room has about 285px of blank canvas under the stat card at 1440 (about 260px at 390) before the forest
  band.
- The cue chip's label spills outside the shrinking pill for about 100ms while it closes.
- At 390 the sheet repeats the screenshot of the card still visible behind it.
- Autoplay on touch (heuristic 3) is coverflow behaviour, so it is off-limits under the guardrail; noted for the owner.
- Copy flags:
  - The tag chip repeats the title («منوی آنلاین» above «منوی آنلاین کافه E2»).
  - «خودتان ببینید» heads a room with nothing to look at.
- Low confidence: under reduced motion the nav stayed forest over the light Proof room after an anchor jump.

## Questions to Consider

1. Should a new studio's first proof lead with «۳»? Or should the room keep only the two claims no competitor can make
   («۰ واسطه», «۱ روز کاری»)?
2. The dive's last words are «سایت شما.». Why does the room it opens into contain no site?
3. Who is autoplay for, on a section meant to be *read* as need → built → result?

## New Conflicts with DESIGN.md (for the owner)

1. **§5 side-card opacity (.6 / .3).** The side cards ghost through each other with motion on too: at 1280 Mery's
   hero text shows through E2's ±1 card. The review suggests ±1 at opacity 1 with the dim layer doing the recession,
   and opacity only at ±2 and ±3.
2. **§5 back tabs.** One sentence of 8–14 words sits in a 578×156 panel, and the story needs recall. The stacked
   `.work-facts` rows already used in the no-JS list would fit from 1024px, with tabs kept only as the fallback.
3. **§5 card width `clamp(300px, 42vw, 600px)`.** At 768 the centre card is 323×202 on a 720px stage. The suggestion
   is to extend the narrow layout (86vw) up to the 989px sheet breakpoint.
4. **§5 "with one project its clones fill the stage".** Five identical cards contradict «بدون ادعای اضافه». The
   suggestion is to hide ±2 when there are three or fewer projects, and to show only the centre card when there is one.

---

First run for this target, no trend yet. Snapshot: `.impeccable/critique/` (slug `project-index-html-proof-work`).

Questions skipped: the owner asked for all eight critiques to run back to back without stopping (2026-09-27); triage
happens on the summary (`10-summary.md`).
