Method: dual-agent (A: design-review subagent · B: detector subagent). Both assessments ran isolated; B's results were
read only after A had finished. An API usage limit interrupted both part-way; each was resumed with its context
intact.

# Impeccable critique — the whole home page as one phone journey (390px)

Phase 1, step 3 of `docs/prompts/IMPECCABLE_PASS.md`. Target: the whole page at 390×844 (touch, DPR 2), top to bottom.
Also checked:
- 360×740;
- landscape 844×390;
- a 300px viewport as a stand-in for large system text;
- a failed data load and a slow network.

This is about the phone journey *across* sections. The section reports (02–08) cover each section in depth, and their
findings are referred to here by ID rather than repeated. Nothing was changed.

**Not re-raised:** A1, A3, A4 and A7. **Already covered by section reports:** HE1 (no nav CTA on phones), HE3 (the
empty lit screen), PC4 (hidden site-type tabs), AB3 (About cards), SV1, FC1.

**The journey in numbers:** the page is 12,572px long, 14.9 screens at 390×844 (17.1 at 360×740).

| Section | Height (390) | Screens |
|---|---|---|
| Portal hero | 2,616px | 3.1 |
| Work | 847px | 1.0 |
| Services | 2,492px | 3.0 |
| Process | 1,385px | 1.6 |
| About | 1,033px | 1.2 |
| Calculator | 2,307px | 2.7 |
| FAQ | 842px | 1.0 |
| CTA band | 776px | 0.9 |

- The first «شروع پروژه» is in the first screen (y 418–469).
- The first direct-contact option, WhatsApp, is at y≈12,102, **96% of the way down**.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | The bar shows a live price but drops "N items chosen" below 767px |
| 2 | Match System / Real World | 3 | «CRM», «لندینگ پیج», «SSL» in front of a café owner (copy flag) |
| 3 | User Control and Freedom | 3 | The Work sheet exits well. The phone menu has no veil, and the page behind it stays live (A3) |
| 4 | Consistency and Standards | 2 | The type scale inverts on phones (MO3). The About title is 34px while the other H2s are 30px |
| 5 | Error Prevention | 3 | The calculator only allows valid states |
| 6 | Recognition Rather Than Recall | 2 | Four of the six site types are hidden (PC4). Direct contact exists only at the very end (MO1) |
| 7 | Flexibility and Efficiency | n/a | One-visit landing page; the menu anchors suffice |
| 8 | Aesthetic and Minimalist Design | 3 | A strong world, but Services runs three screens and every section opens with a heavy preamble |
| 9 | Error Recovery | 3 | Tested: a failed `pricing.json` gives a clean message and CTA; a failed `portfolio.json` gives the static list |
| 10 | Help and Documentation | 3 | FAQ and «مطمئن نیستید؟» exist, but the FAQ sits at 85% depth |
| **Total** | | **25/36** | **Acceptable (69%)** |

## Design Specificity Verdict

**LLM assessment.** The first three screens are authored for a phone:
- the forest, the amber phrase and the lit laptop;
- a stacked hero designed for a phone, not squeezed onto one.

From Services to the FAQ the phone falls back into a generic landing-page rhythm. Six sections in a row open with the
same eyebrow → H2 → sub preamble, followed by a stack of white cards. Roughly three authored screens, then eight that
read like a template.

**Deterministic scan.** B's 390 findings are listed under their sections (02–08). For the whole-page view:
- **Known or accepted:** C1–C5, A10, A12, and the Work back-face false positives.
- **False positives:**
  - the hero "low-contrast" (the forest wall layer);
  - the transient lift-off "text-occlusion";
  - edge findings on the hero sub, the Proof sub and the no-JS Work list;
  - the Process spotlight "low-contrast".
- **No real horizontal overflow at 390** with motion on (`scrollWidth` = `clientWidth` = 390). With the overlay drawn,
  the layout viewport grew to 1,560px, but that was the overlay's own boxes for off-screen Work slides, not the page.
  (With *reduced motion* there is a 2px overflow at 390. That is HE4, which the detector did not test.)
- Nothing new from the detector.

**Visual overlays.** Injection succeeded at 390 in a foreground tab. The console reported 57–59 flagged elements across
the page, all of them classified above. The overlay was removed and the viewport reset afterwards.

## Overall Impression

On a phone the page opens high, and Work is its most concrete moment. But between the hero and the calculator, a
visitor who wants to act or message has nothing to tap. And the promise that sets mitec apart ("talk to the people
directly") is only actionable 10,000px after it is first made.

## What's Working

1. **Work fits a phone.** The band is 847px, about one screen. The «جزئیات» chip opens a native bottom sheet:
   screenshot on top, then the tabs, then a full-width «دیدن سایت» in the thumb zone. × and Escape close it.
2. **The calculator's bottom bar is designed for a phone.**
   - It holds the price and the CTA, and pins only while the calculator is on screen.
   - It is 79px tall and respects the safe area.
   - It comes to rest at the section's end, and degrades cleanly when the data fails.
3. **The stacked hero works.** The primary sits in the lower-middle thumb zone as the only solid button. It is pure
   CSS, so it survives a slow connection; about 386KB transfers on first load.

## Priority Issues

**MO1 · [P1] No way to act from the phone nav, and direct contact is buried**
- **What:** below 860px the nav is a logo and a hamburger, and the toggle sits mid-bar with about 170px of empty bar
  beside it. After the hero's primary leaves (around y 300):
  - the only visible actions until the calculator are four text links inside the Services cards (y 4,056–5,142);
  - Process and About (about 3,000px) have none;
  - WhatsApp and Telegram first appear at y 12,102.
- **Why it matters:** PRODUCT.md counts a direct message as a success, and the café owner's native channel is chat.
  An interrupted visitor comes back mid-page with nothing to tap.
- **Fix:** HE1's persistent tonal nav CTA covers «شروع پروژه». On top of it:
  - add WhatsApp and Telegram as items in the phone menu, using the existing channels (no new copy);
  - hide the nav CTA while the calculator's bar or `#contact` is on screen, so there is still one primary.
- **Suggested command:** `/impeccable adapt` · **Effort:** S · Overlaps HE1, PW1, FC1, AB2 and A3; all touch the phone
  nav.

**MO2 → PC4** (hidden site-type tabs on phones). The review graded it P1; it is recorded once, as PC4 (P2), in the
pricing report.

**MO3 · [P2] The type hierarchy collapses on phones**
- **What:**
  - Section subs stay at `--text-lead` (23px) while H2s drop to 30px, a 1.30 ratio against 1.96 on desktop.
  - Card titles are also 23px, the same as the subs.
  - The hero's sub is 18px, smaller than every section sub.
  - As a result each preamble runs 5–7 lines: Services is a 2-line H2 plus a 3-line sub.
- **Fix:** below 760px, set `.section-heading__sub` to 18px to match `.portal__sub`. H2s stay at 30px.
- **Suggested command:** `/impeccable typeset` · **Effort:** S · Part of the typesetting group (with AB1's H2 size).

**MO4 · [P2] Services is the trough of the phone journey**
- **What:** 2,492px of six same-shaped cards (about 357px each), with «شروع پروژه» repeated four times.
- **Fix:** on phones, put the icon chip and the title on one row and tighten `card--pad-lg`. That saves about 60px per
  card, roughly 360px in all. Whether the repeated card links should stay is an IA and copy question for the owner.
- **Suggested command:** `/impeccable distill` · **Effort:** M · Overlaps SV1.

**MO5 → AB3** (the About cards on phones). Recorded once, in the About report.

## Persona Red Flags

**Casey (one-handed, interrupted, slow connection)**
- The only persistent control is the hamburger at the top of the screen, the hardest reach one-handed.
- A normal flick can pass the whole statement, which is readable for only about 500px of pinned scroll.
- Coming back mid-page, there is nothing to tap.

**Jordan (first-timer)**
- «ادامه در سفارش‌ساز» and a price appear in the bar as soon as the calculator's top is 274px into the screen, before
  any choice is made.
- «سفارش‌ساز» is never explained before the CTA band.

**Riley (stress tester)**
- At 360, «۱ روز کاری» breaks into «۱ روز / کاری» (PW3).
- In landscape 844×390 the hero primary's bottom (403) sits below the fold (390).
- With large text, the bar's duration wraps («حدود ۱۰ / روز کاری»).
- Data failures are handled well.

**Café owner who found mitec on Instagram, reading between customers**
- The first project is a café, which is perfect.
- Her own site type is clipped in the tabs (PC4).
- The Instagram link she would recognise is the last item on the page, alone on its line.

## Minor Observations

- **The menu over the hero:** the menu's tonal «شروع پروژه» sits right over the hero's primary, so the same label
  shows twice, stacked.
- **Proof:** a three-fact room with about 250px of blank under the stat card. The frame holds for about 530px of
  scroll (see PW).
- **FAQ answer 1** points to «برآورد سریع» without a link, about 2,300px back up the page (FC).
- **The CTA band's laptop echo** reads as a bordered card at 390 (FC).
- **Calculator count:** «N امکان انتخاب شده» is hidden below 767px, so a free add-on's toggle has no visible effect in
  the bar (PC).

## Questions to Consider

1. On a phone the dive spends 2.1 screens on one sentence and three facts. Is that the best use of Casey's first 20
   seconds? (A question only; the choreography is approved.)
2. If a café owner does business on WhatsApp, why is WhatsApp the last and smallest thing on the page?
3. What should the lit screen promise at rest on a phone, where no copy sits on it? (HE3)

## New Conflicts with DESIGN.md (for the owner)

- **Section padding on phones.** `--section-pad: clamp(96px, 11vw, 176px)` (§3) puts 192px between sections at 390.
  Across seven section changes that is about 1,340px, or 1.6 screens, of padding. A lower phone floor (around 64px)
  would tighten the rhythm, but it changes a documented token.

---

First run for this target, no trend yet. Snapshot: `.impeccable/critique/` (slug `project-index-html-mobile-390`).

Questions skipped: the owner asked for all eight critiques to run back to back without stopping (2026-09-27); triage
happens on the summary (`10-summary.md`).
