Method: dual-agent (A: design-review subagent · B: detector subagent). Both assessments ran isolated; B's results were
read only after A had finished. An API usage limit interrupted both part-way; each was resumed with its context
intact.

# Impeccable critique — the Process section

Phase 1, step 3 of `docs/prompts/IMPECCABLE_PASS.md`. Target: `#process` («پنج مرحله‌ی مشخص»).
- **What it is:** five step cards on a rail. As you scroll, the rail's forest fill reaches each step, the card fills
  from its start edge, and one step at a time becomes the forest "spotlight".
- **How it was inspected:** scroll sweeps at 1440×900, 1280×800, 768×1024 and 390×844, with frozen frames of the
  spotlight cross-fade, a jump from the nav's «فرایند» link, and reduced motion.

Nothing was changed.

**Not re-raised:** A9 (permanent `will-change`), C3 and C4.

**Guardrail note:** `docs/prompts/README.md` lists the Process spotlight as approved and frozen. PR1 is a timing bug
fix. PR2 and PR3 change how the spotlight behaves, so they need the owner's go-ahead.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | The spotlight looks like project status ("we are at development") but only tracks scroll position |
| 2 | Match System / Real World | 3 | Clear RTL order, plain labels. The leading zero in «۰۱» is a Latin habit |
| 3 | User Control and Freedom | 3 | Reversible, and 6px hysteresis stops flicker. There is no way to stay on one step |
| 4 | Consistency and Standards | 2 | The forest card carries 3–5-line paragraphs (§6 allows two). The half-filled state matches no other card state |
| 5 | Error Prevention | 3 | Unreached numerals at 2.06:1 make steps 4–5 look disabled |
| 6 | Recognition Rather Than Recall | 3 | All five steps are visible on desktop. On a phone the stack is about 1,000px |
| 7 | Flexibility and Efficiency | n/a | Read-only section |
| 8 | Aesthetic and Minimalist Design | 2 | Rail, fill wipe, spotlight, lift and numeral opacity all move at once, and the cards pass through a muddy grey-green |
| 9 | Error Recovery | 2 | The approval gate (step 2) and the test build (step 3) imply recourse. Nothing covers revisions or what happens if you're unhappy (copy flag) |
| 10 | Help and Documentation | n/a | The section is itself the explanation, and the FAQ follows |
| **Total** | | **20/32** | **Acceptable (62%)** |

## Design Specificity Verdict

**LLM assessment.** A generic pattern in brand colours. "Consult → design → build → deliver → support" on numbered
cards is the most interchangeable block on any studio site. What is specific is in the copy, not the design:
- design approved before any code;
- a test build the client watches;
- the client's own domain and host, with SSL;
- training on the panel.

The rail, fill and spotlight are well engineered, but they only decorate the order of the steps. They show nothing a
static list doesn't, and they don't back up the promise in the subheading, «همیشه می‌دانید کار کجاست».

**Deterministic scan.** Known items:
- the step cards' border and shadow (C5);
- the static scan's "cramped-padding" (a verified false positive).

"low-contrast" on the lit step (1.1–1.7:1) is a false positive. The forest comes from a sibling layer
(`span.process-step__spot`, `#12312A`), and the detector reads the card's white base. Settled values are 12.74:1 and
8.27:1.

B also saw, for one frame, the text colour and the forest layer mid-animation on separate timings. That matches the
review's main finding, PR1, and the review measured it fully.

**Visual overlays.** Injection succeeded. With the page scrolled through `#process` the console reported 43–46 flagged
elements at 1440 and 59 at 390, all of them the known items above or the spotlight false positive. The overlay was
removed afterwards.

## Overall Impression

The engineering is disciplined, the phone and static versions are clear, and the section ends on real reassurance
(«پشتیبانی»). The problem is the spotlight hand-over: text goes unreadable while you scroll, and the spotlight lands on
arbitrary steps on desktop.

## What's Working

1. **Engine discipline.** Each frame writes only transform and opacity. The spotlight's `data-surface` flips only
   when its index changes, with 6px hysteresis, and it works in both directions.
2. **Stacked layouts (≤ 1023px).** The rail follows a reading line at 60% of the viewport, which suits a thumb scroll.
   At 390 every body text is exactly two lines.
3. **The static version** (reduced motion and no JS) is the calmest and clearest: every step filled, the rail full,
   no spotlight.

## Priority Issues

**PR1 · [P2] Text contrast collapses on every spotlight change**
- **What:** the text colour eases over `--dur` (220ms), but the `.process-step__spot` forest layer eases over
  `--dur-slow` (420ms). So text and background swap brightness at the same moment:
  - the entering card's title drops to 1.27:1 and its body to 1.10:1;
  - the leaving card's title drops to 1.37:1 and its body to 1.02:1;
  - text stays under 4.5:1 for about 130–150ms per change, on two cards at once, in both directions, at 1440 and at
    390;
  - in a real wheel scroll, 50 of about 90 sampled frames had some text under 4.5:1 (33 under 3:1).
- **Why it matters:** while scrolling, the muddy grey (not a token colour) is the usual state, not a one-off. It reads
  as flicker on the section's main interaction.
- **Fix:** take the text colour off the long fade. Either give it a short transition (60–80ms) delayed until the forest
  layer is about 40–50% opaque, entering and leaving, or snap it at that point with `steps(1)`. This fixes timing only,
  so it is a bug fix under the guardrail.
- **Suggested command:** `/impeccable animate` · **Effort:** S. Graded P2 rather than the review's P1: it resolves as
  soon as scrolling stops.

**PR2 · [P2] On desktop the spotlight lands arbitrarily, and its first beat is missed**
- **What:**
  - From 1024px the row reads horizontally, but the effect is driven by vertical scroll.
  - The nav's «فرایند» link lands at 1440 with step 3 lit, step 4 at 81% fill (a hard vertical seam through its
    paragraph) and step 5 empty.
  - Step 1 fills and turns forest when only about 100px of its card is on screen.
- **Why it matters:** the section looks like a status tracker frozen at "development".
- **Fix:** from 1024px, play the rail, fill and spotlight once as an entrance (about 1.5s) when the row is fully in
  view, ending at the defined end state. §13's "reveal once" allows this. Keep scroll scrubbing on the stacked layouts.
  This changes the frozen spotlight, so it needs the owner's go-ahead.
- **Suggested command:** `/impeccable animate` · **Effort:** M

**PR3 · [P2] Forest paragraphs run past two lines, and 1024 is cramped**
- **What:**
  - The spotlight's body runs to 3 lines at 1440 and 1280, 4–5 at 1024 (a 132px text column), and 3 at 360 (step 2).
  - At 1024 the cards are ragged (241 vs 268px) because `.process-step` doesn't fill its `li`, and «می‌شود.» sits alone
    on a line.
- **Why it matters:** §6 says no paragraph over two lines on forest, and names only Work's card back as the exception.
- **Fix:** keep the stacked rail up to about 1200px, widen the text measure above that, and add `height: 100%` to
  `.process-step`.
- **Suggested command:** `/impeccable layout` · **Effort:** S–M. Alternatively, extend DESIGN.md's exemption (see New
  conflicts).

**PR4 · [P2] Tablet is a stretched phone layout**
- **What:** at 768 the 680px cards each hold one line of 15px text at the start edge and are about 70% empty. The five
  one-liners take 863px.
- **Fix:** from 760 to 1023px, lay each card out in two columns (numeral and title on the start side, body beside
  them), or cap the list at about 560px with the rail.
- **Suggested command:** `/impeccable adapt` · **Effort:** S

**PR5 · [P2] The step numerals are under contrast while dimmed, and «۰» reads as detached**
- **What:**
  - Unreached numerals at opacity .35 measure 2.06:1 on white. They are 32px/800, which counts as large text, and that
    still needs 3:1 (WCAG 1.4.3).
  - `tabular-nums` puts Vazirmatn's narrow «۰» in a full-width slot, so «۰۱» reads as a ring and a «۱».
- **Fix:** set the dimmed opacity to at least .5 (3:1), or .65 (4.5:1), and drop `tabular-nums` on
  `.process-step__n`. Whether to keep the leading zero is a copy question for the owner.
- **Suggested command:** `/impeccable typeset` · **Effort:** S

## Persona Red Flags

**Jordan (first-timer)**
- Reads the forest card as "the important step" or "where things stand".
- Mistakes a half-filled card with a seam for a loading glitch.

**Riley (stress tester)**
- A fast wheel or fling moves the spotlight faster than its 420ms fade, so several cards are grey at once.
- At 1024: 4–5-line paragraphs and ragged cards.

**Casey (one-handed phone, slow connection)**
- A momentum fling crosses 2–3 steps within a single fade.
- Before Vazirmatn loads (A2), fallback metrics change the line counts.

**First-time café owner**
- "After delivery" is well answered: her own domain and host, training, support.
- "How much of my time, and what do I provide?" is only implied.
- "How long?" is absent, and nothing links to the working days the calculator shows.
- "Always know where the work is" never names «پیگیری سفارش».
- (All copy flags.)

## Minor Observations

- **Subheading widow:** «کار کجاست.» sits alone on the second line at 1440, 1280 and 768 (typesetting group).
- **Rail off-centre:** on desktop the rail runs from dot 1 to dot 5, each 24px in from its card's start edge. At 1440 it
  ends about 190px short of the row's left end, under a centred heading.
- **Fill corners:** `scaleY` squashes the rounded corners of the partial fill on phones.
- **Double numbering:** screen readers announce both the `<ol>` numbering and the visible «۰۱». With `list-style: none`,
  Safari also drops the list semantics unless the list has `role="list"`.
- **Step 5 stays forest** after you scroll past, so that becomes the section's permanent look on the way back up.

## Questions to Consider

1. If the spotlight disappeared tomorrow, would any visitor lose information? If not, could that motion budget preview
   the order tracker and prove «همیشه می‌دانید کار کجاست»?
2. Every agency has these same five steps. Could each step carry the one fact an anxious owner needs (her part, the
   rough time)?
3. The reassurance peaks at «پشتیبانی». Should a quiet link to the calculator or to a direct message sit right there?

## New Conflicts with DESIGN.md (for the owner)

- **DESIGN.md is ambiguous about the spotlight's paragraph length.** §5 and §6 exempt the spotlight from "never a
  text-heavy forest card", but §6's separate "no paragraph over two lines on forest" rule exempts only Work's card
  back. Either PR3 brings the build within the rule, or DESIGN.md extends that exemption to the spotlight.

---

First run for this target, no trend yet. Snapshot: `.impeccable/critique/` (slug `project-index-html-process`).

Questions skipped: the owner asked for all eight critiques to run back to back without stopping (2026-09-27); triage
happens on the summary (`10-summary.md`).
