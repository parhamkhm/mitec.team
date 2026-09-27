Method: dual-agent (A: design-review subagent · B: detector subagent). Both assessments ran isolated; B's results were
read only after A had finished. An API usage limit interrupted both part-way; each was resumed with its context
intact.

# Impeccable critique — the FAQ, the closing CTA band and the footer

Phase 1, step 3 of `docs/prompts/IMPECCABLE_PASS.md`. Targets:
- `#faq`: a single-open accordion of seven questions;
- `#contact`: the forest closing band, with the laptop "echo", a word-by-word heading, the primary «شروع پروژه»,
  «پیگیری سفارش», and the واتساپ · تلگرام · اینستاگرام links;
- the footer.

The accordion was tried with mouse and keyboard, and the end-of-page journey was walked, at 1440×900, 1280×800,
768×1024 and 390×844, with reduced motion and without JS. Nothing was changed.

**Not re-raised:** A10 (the FAQ's `padding-bottom` transition), C2 and C4. HE2 (icons from jsdelivr) is defined in the
hero report; here it removes the FAQ's +/− markers. The contact links are documented placeholders.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | +/− and `aria-expanded` stay in sync. No hover state. An opened item can scroll out of view (FC2) |
| 2 | Match System / Real World | 3 | «پیگیری سفارش» is offered as an equal choice to people who have no order yet |
| 3 | User Control and Freedom | 3 | Single-open closes whatever you were reading. The toggle works |
| 4 | Consistency and Standards | 2 | The contact links break DESIGN.md's text-link recipe (no underline). The nav's «تماس» lands on a project pitch |
| 5 | Error Prevention | 3 | The layout jumps when an item opens (FC2) |
| 6 | Recognition Rather Than Recall | 3 | FAQ answer 1 names «برآورد سریع» as plain text, with no link |
| 7 | Flexibility and Efficiency | n/a | Persuade surface |
| 8 | Aesthetic and Minimalist Design | 3 | Calm, but the footer repeats the CTA and the eyebrow repeats the title |
| 9 | Error Recovery | 3 | Few error states. If the icons fail, the accordion shows no markers (HE2) |
| 10 | Help and Documentation | 2 | The FAQ is the help, but it has no way out to a person and no cost question (copy flag) |
| **Total** | | **25/36** | **Acceptable (69%)** |

## Design Specificity Verdict

**LLM assessment.** The peak is authored; the edges are template.
- **FAQ:** a generic hairline accordion with answers specific to mitec: payment in three parts, the domain in the
  client's name, no logo work.
- **Closing band:** the most mitec-specific moment on the page. The forest grid, the laptop echo and the word-by-word
  heading close the page the way the portal opened it. The echo is drawn thinly, though, and reads as a bordered card
  rather than a device.
- **Contact line and footer:** interchangeable template parts.

**Deterministic scan.**
- **Known items only:**
  - A10 on `#faq-a1…a7`;
  - the static scan's "cramped-padding" on the FAQ rows, the band and the link row (a verified false positive);
  - C2 on the footer logo's mint;
  - C4 on the band's grid.
- **Overlay:** with the page at `#faq` and `#contact`, nothing section-specific.
- **Coverage:** the design review found everything below.

**Visual overlays.** Injection succeeded. At `#faq` and `#contact` the console reported 43–46 flagged elements at 1440
and 59 at 390, all of them known page-level items. The overlay was removed afterwards.

## Overall Impression

The FAQ is well built and reassuring, and the forest band is a fitting homecoming. But the page ends by offering a
tool and a tracker before a person. The human channels are the smallest thing on the last screen, which undercuts
"no middleman" just as it should land.

## What's Working

1. **The FAQ is built well.**
   - Hairline rows; questions 18px/700; answers 16px at line-height 1.8, at most 68ch.
   - `h3 > button[aria-controls]` markup, with closed panels `inert`.
   - Tab, Enter and Space all work, with a visible focus ring.
   - Without JS every answer is open and readable.
2. **The closing band respects the system.**
   - One mint primary per viewport, with the nav CTA staying tonal over it.
   - Full-width 51px buttons on phones.
   - Whole-word reveal with ZWNJ intact, and static and complete under reduced motion.
3. **The laptop echo bookends the page with the portal.** It is the right idea, specifically for mitec.

## Priority Issues

**FC1 · [P1] The closing band's hierarchy inverts PRODUCT.md's order of success**
- **What:**
  - At 390, «پیگیری سفارش» (outline) is 310×50, the same size as the primary.
  - WhatsApp, Telegram and Instagram are bare 16px `.cta-band__links a` (37–64px wide, no icon, no underline), sitting
    outside `.cta-band__screen` below a full-width hairline.
  - The nav's «تماس» lands here.
- **Why it matters:** a direct message and an Instagram follow are named successes, and tracking an order is a tool for
  existing clients. This is the page's main home for the channels, so its order matters most.
- **Fix:**
  - Move the channels inside the screen as a second tier: tonal buttons, or icon + label rows with 44px targets.
  - Demote «پیگیری سفارش» to a text link, or to the footer only.
  - Drop the full-width hairline above the links.
- **Suggested command:** `/impeccable layout` · **Effort:** M · Anchors the direct-message group (AB2, SV2, MO1).

**FC2 · [P2] The single-open accordion moves the item you just opened**
- **What:** collapsing the item above moves everything below it.
  - At 1440, with q1 open, tapping q7 moves it 69px up.
  - At 390, with a long answer open in q1, the tapped q2 goes from y 120 to y −418, off screen.
  - `.faq-item__q` also has no hover state.
- **Fix:**
  - Record the button's top before toggling and `scrollBy` the difference afterwards (or `scrollIntoView({block:
    'nearest'})` once the transition ends).
  - Add a hover treatment, e.g. the question in `--color-tonal-text` or a sunken row.
- **Suggested command:** `/impeccable harden` · **Effort:** S

**FC3 · [P2] The laptop "deck" overshoots on tablet and phone**
- **What:** `.cta-band__echo::after` uses `inset-inline: -6%`.
  - At 768 with reduced motion it is 804px wide, which leaves two full-bleed stray lines stacked above the links'
    hairline.
  - At 390 it runs to within about 4px of the viewport edge, breaking the gutter.
- **Fix:** clamp the overhang to the gutter (e.g. `max(-6%, calc(-1 * var(--gutter) + 8px))`), or drop the deck below
  760px.
- **Suggested command:** `/impeccable polish` · **Effort:** S · Same pattern as HE4 (fix together).

**FC4 · [P3] The footer is a dead end**
- **What:**
  - It repeats «شروع پروژه» and «پیگیری سفارش» right below the same two buttons.
  - It has no WhatsApp, Telegram or Instagram.
  - At 390 its content is inset 48px against the band's 24px, because `.footer` and `.container` both add the gutter.
- **Fix:** replace the duplicated CTAs with the channels and an Instagram link, and remove the double gutter.
- **Suggested command:** `/impeccable distill` · **Effort:** S

**FC5 · [P3] Implementation drift from DESIGN.md**
- **What:**
  - DESIGN.md §5 gives the final CTA band "grid texture + one mint glow". There is no glow in the band's CSS (verified
    in synthesis).
  - `src/data/faq.json` is never read (verified): the FAQ is hand-written in `index.html`, so the two copies will
    drift.
- **Fix:** add the glow (a masked radial of `--color-glow`, as in the hero) or drop it from §5. Either render the FAQ
  from `faq.json` or delete the file.
- **Suggested command:** `/impeccable polish` · **Effort:** S

## Persona Red Flags

**Jordan (first-timer)**
- "Do I need an order first?": «پیگیری سفارش» looks like an equal step.
- Answer 1 says «برآورد سریع» with no link.
- There is no question about cost.

**Riley (stress tester)**
- A long answer sends the tapped item to −418.
- With the CDN blocked there are no markers.
- Without JS, the − markers and pointer cursor sit on buttons that do nothing.
- At 768, stray deck lines appear.

**Casey (one-handed, slow connection)**
- Telegram is a 37px-wide text target.
- At 390 the thumb zone is taken by the tracking button, and the channels appear only after scrolling past both
  buttons (the band is 776px tall).

**Café owner who would rather send a WhatsApp message than fill in a form**
- Tapping «تماس» lands her on a pitch for the order builder.
- WhatsApp is a 48px green word with no glyph to spot.
- The footer, where she looks next, has no channels.
- Nothing here says how fast the team replies; «۱ روز کاری» lives up in Proof (copy flag).

## Minor Observations

- At 1440 and 1280 the closing heading breaks as «…را از / همین‌جا شروع کنید», splitting «از همین‌جا». Keep that
  phrase in one span; phrase-level reveal is allowed (typesetting group).
- At 768 the closing heading drops to 30px, the clamp floor. That makes it the weakest display type on the page, at its
  climax.
- Without JS, `#scope` is hidden, so FAQ answer 1 points to nothing.
- The FAQ eyebrow and title say the same thing (copy flag).
- At 390 the translucent light nav over the forest band turns grey and lets body text ghost through.

## Questions to Consider

1. If the promise is "no middleman", why is the human channel the smallest thing on the last screen, and a tool for
   existing clients the second largest?
2. Is a visitor with an unanswered question the page's most qualified lead? If so, should the FAQ end with its own way
   to reach a person?
3. Should the footer be the channels' permanent home, on every page including the future order builder?

## New Conflicts with DESIGN.md (for the owner)

- **Hiding the FAQ markers without JS**, so that dead buttons don't show − or a pointer cursor, would depart from §5
  FAQ's marker spec.
- None otherwise: the tonal second tier and self-hosted icons both fit DESIGN.md.

---

First run for this target, no trend yet. Snapshot: `.impeccable/critique/` (slug `project-index-html-faq-cta-footer`).

Questions skipped: the owner asked for all eight critiques to run back to back without stopping (2026-09-27); triage
happens on the summary (`10-summary.md`).
