Method: dual-agent (A: design-review subagent · B: detector subagent). Both assessments ran isolated; B's results were
read only after A had finished. An API usage limit interrupted both part-way; each was resumed with its context
intact.

# Impeccable critique — the About section

Phase 1, step 3 of `docs/prompts/IMPECCABLE_PASS.md`. Target: `#about` («تیمی متخصص، از ایده تا رشد کنار شما»).
- **The section:**
  - the scroll-linked title lines;
  - the line about working directly with the team;
  - two member cards (Parham Movahedi, UI/frontend; Sina Alipour, back end/infrastructure) with placeholder photo slots.
- **Inspection:** 1440×900, 1280×800, 768×1024 and 390×844, plus reduced motion. Edge tests: a real photo dropped in,
  a third member, and a long name.

Nothing was changed.

**Not re-raised:** A8 (the «عکس» label's contrast). Placeholder photos are documented product state. PRODUCT.md
forbids stating the team's size; nothing below does.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | The nav's active «درباره‌ی ما» works; there is no other state to report |
| 2 | Match System / Real World | 2 | The roles use developer jargon (بک‌اند، فرانت‌اند، زیرساخت) for café and clinic owners (copy flag) |
| 3 | User Control and Freedom | 3 | Reversible motion, nothing traps the visitor, and nowhere to go either |
| 4 | Consistency and Standards | 2 | The H2 is 64px/500 without `section-heading__title`. Every other H2 is 45px/700, and §9 says H2 is 700 |
| 5 | Error Prevention | 3 | Nothing for a visitor to get wrong. The authoring traps are AB4 |
| 6 | Recognition Rather Than Recall | 2 | To act on "talk to us directly", the visitor must remember that the channels are two sections further down |
| 7 | Flexibility and Efficiency | n/a | Persuade section |
| 8 | Aesthetic and Minimalist Design | 2 | The title's last word «شما» sits alone at ≥ 1279px. The dashed «عکس» circles read as unfinished |
| 9 | Error Recovery | 3 | No error paths. The missing photo shows as a raw placeholder, not a designed fallback |
| 10 | Help and Documentation | n/a | Landing section |
| **Total** | | **20/32** | **Acceptable (62%)** |

## Design Specificity Verdict

**LLM assessment.** Could belong to any studio. A centred eyebrow, title and sub over two identical cards (avatar
circle, name, role, bio) is the stock "meet the team" block.

Only one line is mitec's own: the sub's «…بدون واسطه و بدون برون‌سپاری». It is set in 23px grey under a 64px title,
which makes the least specific claim on the page and repeats the hero eyebrow's «تیم متخصص».

The section *states* the direct-access promise without *showing* it:
- there are no faces (documented placeholders);
- nothing ties the people to the Work projects;
- nothing can be tapped (0 focusable elements).

**Deterministic scan.** Known items only: the cards' border and shadow (C5), and the static scan's "cramped-padding"
(a verified false positive). The overlay found nothing About-specific at `#about`, and A8 is not a detector rule. The
design review found everything below.

**Visual overlays.** Injection succeeded. At `#about` the console reported 43–46 flagged elements at 1440 and 59 at
390, none of them from this section. The overlay was removed afterwards.

## Overall Impression

This should be where trust peaks ("these are the people"). Instead the loudest line is generic, the real promise is
quiet, the faces are placeholders, and there is no way to reach the people it introduces.

## What's Working

1. **The sub is the clearest statement of the positioning on the page, and it is honest.** It never states team size
   and never oversells.
2. **The roles complement each other.** UI/front end and back end/infrastructure match the service split, so a
   reader can infer that named people cover the whole build. The structure is sound:
   - an h3 per person;
   - correct ZWNJ («پیاده‌سازی», «بک‌اند»);
   - letter-spacing 0;
   - role text about 7.5:1, bios above 7:1.
3. **The motion is disciplined.** It is transform-only and moves whole lines, never characters. Reduced motion shows
   the complete static section.

## Priority Issues

**AB1 · [P2] The display title breaks into three lines and strands «شما» at ≥ 1279px**
- **What:** `.about-title` is 64px inside `.section-heading`'s 62ch cap (558px), and «از ایده تا رشد کنار شما» needs
  about 559px. It sets on two lines up to 1260px and on three lines from 1279px through 1920px.
- **Why it matters:**
  - The two-line converge motion becomes one line plus two.
  - The word for the client is stranded at the two most common desktop widths.
  - This is the loudest heading after the hero, at weight 500, against §9.
- **Fix:**
  - Let the title escape the cap (`.about-heading { max-width: none }`; the sub keeps its 52ch).
  - Add `text-wrap: balance` as a guard.
  - Bring it onto the scale (`--text-display-2` or `-3`) at 700.
  - Check that each `.about-title__line` is one line from 1024 to 1920px.
- **Suggested command:** `/impeccable typeset` · **Effort:** S. Graded P2 rather than the review's P1: a visual defect
  with no task impact. Part of the typesetting group.

**AB2 · [P2] The section that promises direct access is a dead end**
- **What:** `#about` has no focusable element. The direct-message row («یا مستقیم پیام بدهید: واتساپ · تلگرام») exists
  only in `#contact`, after the calculator and the FAQ.
- **Why it matters:** PRODUCT.md counts a direct message as a success, and this is where a visitor is most ready to
  send one.
- **Fix:**
  - Reuse that existing row, with its copy and the `app.config.js` values, under `.about-grid`.
  - Style it as §5 text links (`--color-link`, underlined), not a button, so there is still one primary per viewport.
  - Per-person channels are the owner's call.
- **Suggested command:** `/impeccable shape` · **Effort:** S · Overlaps FC1 (the direct-message group).

**AB3 · [P2] The cards never restack on narrow widths**
- **What:**
  - The photo stays beside the text at every width: the text column is 178px at 768 (two-column grid) and 168px at 390.
  - On the 390 phone the role wraps to two lines and the bios run 4–5 lines of 3–4 words.
  - A long test name wrapped to three lines.
  - At 768, `align-items: center` puts the two names at different heights.
- **Fix:** add a container query on `.about-card`. Below about 480px of card width, put the photo above the text, or a
  56–64px photo in a row with the name. Use `align-items: start` in the two-column range.
- **Suggested command:** `/impeccable adapt` · **Effort:** S · Same finding as MO5.

**AB4 · [P2] The layout isn't ready for real photos or a third member**
- **What:**
  - There is no rule for an `img` inside `.about-card__photo`. A photo dropped in where `<!-- REPLACE: real photo -->`
    says rendered at its natural size, and the 88px circle showed only its top corner.
  - A third card sits alone in the start column, with an empty half-row beside it.
- **Fix:**
  - Add `.about-card__photo > img { display: block; width: 100%; height: 100%; object-fit: cover }`.
  - Document an asset spec: square, ≥ 176px for DPR 2, WebP, `alt` = the name, `width`/`height` set.
  - Make the grid count-proof (centre an odd last card), as §5 does for the add-on tiles.
- **Suggested command:** `/impeccable harden` · **Effort:** S

**AB5 · [P3] The converge motion happens mostly before the title is visible**
- **What:** `aboutConverge()` runs across the whole section's passage. At 1440 the lines travel from 144px to 43px
  apart before the title enters the viewport, so the visible travel is about 43px at 1440 and about 7px at 390.
- **Fix:** time it to the title's own passage (entering → about 45% up the viewport), or drop it and give the motion
  to the people.
- **Suggested command:** `/impeccable animate` · **Effort:** S

## Persona Red Flags

**Jordan (first-timer):**
- «بک‌اند و زیرساخت» means nothing to him.
- The dashed «عکس» circles raise "is this real or unfinished?".
- Nothing tells him what to do about "talk to the team".

**Riley (stress tester):**
- The people can't be checked: no photos, no profile links, no tie to the three Work projects.
- Sina's bio lists six disciplines for one person, which invites doubt.
- With reduced motion on a 768 touch device, jumping to `#about` lands the page 32px sideways (HE4).

**Casey (one-handed, slow connection):**
- On a phone the section is 1,033px tall.
- The two cards are 268px each and mostly white space.
- There is no thumb target for a message, only a long scroll to `#contact`.

**Café owner who was burned by an agency that outsourced her site:**
- She needs to know who will answer her on WhatsApp and who will build her site.
- The section names roles but never says who she will talk to.
- Faceless team cards are exactly what that agency showed her.

## Minor Observations

- **Unnamed section:** `#about` has no `aria-labelledby`, so it isn't a named region (`#scope` is).
- **Placeholder read aloud:** the placeholder «عکس» is announced before each name. Mark it `aria-hidden` while it's
  a placeholder (A8 covers only its contrast).
- **Role line colour:** the role is `--color-tonal-text` green with no underline, on a page where green usually means
  clickable. The token is allowed; neutral secondary text at 700 would avoid the reading.
- **Placement at 1440:** the 558px heading block sits over a 1152px grid, so the cards read as a footnote rather than
  the subject.
- **Copy flags:**
  - The title repeats the hero eyebrow's «تیم متخصص».
  - Parham's bio repeats his role.
  - Sina's bio is a list of services, with no voice and out of balance with Parham's.

## Questions to Consider

1. If the promise is "the people you talk to build it", why is About the one section where you can't talk to anyone?
2. Should the people be the proof across the page, with each Work project credited to who built it?
3. Would a wary owner trust a dashed «عکس» circle more than no photo at all? Should this section wait for real photos,
   as Testimonials does, or ship a designed monogram state?

## New Conflicts with DESIGN.md (for the owner)

None. DESIGN.md has no About recipe (§6 only lists About as a light surface), and AB1's fix brings the H2 back in line
with §9. Once decided, the About recipe is worth recording in Phase 3's `document`.

---

First run for this target, no trend yet. Snapshot: `.impeccable/critique/` (slug `project-index-html-about`).

Questions skipped: the owner asked for all eight critiques to run back to back without stopping (2026-09-27); triage
happens on the summary (`10-summary.md`).
