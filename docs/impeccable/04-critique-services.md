Method: dual-agent (A: design-review subagent · B: detector subagent). Both assessments ran isolated; B's results were
read only after A had finished. B was interrupted by an API usage limit part-way and resumed with its context intact.

# Impeccable critique — the Services section

Phase 1, step 3 of `docs/prompts/IMPECCABLE_PASS.md`. Target: `#services`.
- **Contents:** the heading, and six cards. Each card has an icon chip, a title, a description and one link: four say
  «شروع پروژه», one «بپرسید», one «جزئیات پشتیبانی». Each card also carries a decorative illustration, and the grid runs
  3 / 2 / 1 columns.
- **Inspection:** rendered at 1440×900, 1280×800, 768×1024 and 390×844. Checked hover, keyboard focus, a touch tap,
  reduced motion, a blocked icon CDN, and where the two in-page links land.

Nothing was changed.

**Not re-raised:** A4 (illustration `sizes`), C5 (card border + shadow). HE2 (icons from jsdelivr) is defined in the
hero report; here it empties all six chips.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | On touch, a tap on a card title leaves the card in its hover state (green edge, lifted art) with nothing happening |
| 2 | Match System / Real World | 3 | «CRM», «لندینگ» and «SSL» are jargon for café and shop owners (copy flag). Card 3 glosses CRM well |
| 3 | User Control and Freedom | 3 | «بپرسید» jumps about 5,200px (1440) to 6,000px (390), past four sections |
| 4 | Consistency and Standards | 2 | One link style and one ← arrow carry three kinds of action: open a page, jump to the contact band, jump to the FAQ. The card hover promises a click the card doesn't take |
| 5 | Error Prevention | 3 | The card body looks live but does nothing |
| 6 | Recognition Rather Than Recall | 3 | All four «شروع پروژه» links go to the same `./order/`, so the service chosen here is dropped |
| 7 | Flexibility and Efficiency | n/a | One-pass Persuade section |
| 8 | Aesthetic and Minimalist Design | 3 | Two pictorial devices per card (chip + 3D art) say the same thing. The sub repeats the six titles |
| 9 | Error Recovery | 3 | If the icons fail, the chips go empty (HE2). The text still carries the meaning |
| 10 | Help and Documentation | 2 | No "not sure which?" help. «جزئیات پشتیبانی» lands on seven closed FAQ rows |
| **Total** | | **25/36** | **Acceptable (69%)** |

## Design Specificity Verdict

**LLM assessment.** It could belong to any studio in the category. Swap the palette and wordmark and this is any
agency's services grid: a centred eyebrow, H2 and sub, then 3×2 equal cards, each with an icon chip, a title, three
lines and «شروع پروژه ←».

What does belong to mitec:
- the disciplined sage, white and forest palette;
- carefully set Persian: correct ZWNJ and 1.8 leading;
- a 3D illustration set colour-matched to the Instagram greens.

Two things undercut that:
- **The one mitec-specific asset is barely visible.** The illustrations sit at .35 under a white fade and read as grey
  haze.
- **The layout argues against the copy.** Card 1 promises «نه قالب آماده» from inside the most template-shaped block on
  the page.

Nothing links the services to the three real projects in the Work band just above.

**Deterministic scan.**
- Only known items: the cards' thin border and wide shadow (C5), and the static scan's "cramped-padding" on the cards (a
  verified false positive; that scan cannot see CSS padding).
- With the overlay scrolled to `#services` at 1440 and 390, nothing section-specific.
- A4 is not a detector rule.
- The design review found everything below.

**Visual overlays.** Injection succeeded. The console reported 44 flagged elements at 1440 and 57 at 390, all of them
page-level known items. The overlay was removed afterwards.

## Overall Impression

A well-made, calm, generic block. It explains the offer without proving it. It also has one real interaction defect:
the cards look clickable but aren't.

## What's Working

1. **Persian typesetting is correct.** 16px body at 1.8 leading and 23px/700 titles. ZWNJ is correct throughout
   («سیستم‌های», «توسعه‌ی», «بهینه‌سازی»), and mixed CRM/SSL text renders cleanly at every width.
2. **The illustrations never shift the layout.** They are out of flow and height-capped below 1200px. Reduced motion
   changes opacity only, and the grid holds 3 / 2 / 1 exactly at 1024 and 760.
3. **The links are reachable.** Every link is 44px tall, has a clear focus ring, and sits on the start side, where a
   right thumb lands.

## Priority Issues

**SV1 · [P2] The card looks clickable but isn't, and the real target is oversized**
- **What:**
  - The `.card--interactive` hover (border, elevated shadow, art lift) fires on a card whose body does nothing: the
    cursor is `auto`, and a click on the title changes nothing.
  - On touch, the hover state stays after a tap.
  - The actual link is a 307×44 row whose visible label is 92px, so about 215px of invisible hit area lies over the
    illustration.
  - Its focus ring draws a wide empty box with the label at one edge.
  - The links don't share a baseline: in row 2 at 1440, «جزئیات پشتیبانی» sits 29px lower.
- **Why it matters:** a false affordance on every viewport, and a false "selected" state on phones.
- **Fix:**
  - Stretch the link over the card with `.service-card__link::before { content: ''; position: absolute; inset: 0; z-index: 2 }`.
    The card's `::after` is already taken by the fade.
  - Set the link to `align-self: flex-start; margin-top: auto`.
  - Show focus on the card with `.service-card:has(.service-card__link:focus-visible)`.
  - Guard the hover with `@media (hover: hover)`.
- **Suggested command:** `/impeccable polish` · **Effort:** S · Overlaps MO4.

**SV2 · [P2] The two non-builder links land badly**
- **What:**
  - «بپرسید» goes to `#contact`, whose heading and primary say "start a project". The WhatsApp and Telegram row is
    small text at the foot of that band.
  - «جزئیات پشتیبانی» goes to `#faq` with all seven rows closed. The support answer (q4) nearly repeats the card.
- **Why it matters:** a direct message counts as success, and this route buries it. The "details" link gives the visitor
  nothing new.
- **Fix:**
  - Point the support link at `#faq-a4`, and have the FAQ script open the item named in the URL hash, both on load and
    on `hashchange`. Single-open still holds.
  - Give `.cta-band__links` an id with `scroll-margin`, and target that from «بپرسید».
- **Suggested command:** `/impeccable clarify` · **Effort:** S · Overlaps FC1 (the direct-message group).

**SV3 · [P3] The section heading wraps badly**
- **What:**
  - At 768 the H2 breaks with the single word «دارد» alone on line 2.
  - At 390 the sub splits «از / شروع تا رشد».
- **Fix:** add `text-wrap: balance` to `.section-heading__title` and `.section-heading__sub` in `components.css`, as the
  hero already does. Recheck the other section headings afterwards.
- **Suggested command:** `/impeccable typeset` · **Effort:** S · Part of the typesetting group.

**SV4 · [P3] Four identical link names with no service context**
- **What:** screen-reader users hear «شروع پروژه» four times in the links list, with nothing to tell them apart.
  `#services` also has no `aria-labelledby`.
- **Fix:** add `aria-describedby` pointing at each card's title, and label the section by its H2.
- **Suggested command:** `/impeccable harden` · **Effort:** S

## Persona Red Flags

**Jordan (first-timer)**
- Wants a café menu and finds it in card 1, but card 2's «ثبت سفارش و پرداخت آنلاین» looks equally right.
- Both links go to the same place, and nothing says so. The grid implies a choice that isn't one.

**Riley (stress tester)**
- Clicks a title: nothing.
- Tabs through: box-shaped focus rings.
- Hears «شروع پروژه» four times.
- With the CDN blocked, the chips are empty.
- At 768, the orphaned «دارد».

**Casey (one-handed, slow connection)**
- Three screens of look-alike cards.
- A tap on a card body leaves it green-edged and "selected" while nothing loads.

**Shop owner unsure whether she needs "a site" or "a CRM"**
- "Orders" appears in cards 1–3.
- FAQ q5 («فقط سایت می‌سازید یا سیستم‌های داخلی…») is her exact question, and it isn't reachable from here.
- Nothing points her to the order builder's «نمی‌دانم» option.

## Minor Observations

- The icon meanings are off:
  - `icon-layout-dashboard` marks website design, while CRM (literally a dashboard) gets `icon-users`;
  - `trending-up` stands for automation.
- The card links have no underline, although DESIGN.md §5's text-link recipe asks for one (5px offset). Without the CDN
  arrow, colour and weight are the only cue.
- The illustrations' UI mockups read left to right: window dots at the top left, and service 3's rows put the avatar on
  the left, on an RTL page.
- The hover transform is scoped by `@media (prefers-reduced-motion: no-preference)` rather than `html.motion`. DESIGN.md
  §13 scopes all motion to `html.motion`.
- Copy flags: the H2 is category-generic, and the sub restates the six titles.

## Questions to Consider

1. If the سفارش‌ساز already handles «نمی‌دانم», why does this grid ask visitors to pick one of six doors into the same room?
2. What here could only be mitec's? Should each card name the delivered project that proves it (from `portfolio.json`),
   so the grid becomes evidence rather than a claim?
3. The illustrations are the one on-brand picture asset, yet they are dimmed to 35%. Should they carry the card, and the
   chip go?

## New Conflicts with DESIGN.md (for the owner)

- **Dropping either the icon chip or the illustration** to end the double picture. §5 Service cards requires both.
- **Giving the illustrations more presence** (above .35 at rest, or no white fade). This conflicts with §5's `.35 / .6`
  values and the fade, and with the §10 contrast rows measured against them.
- **A featured or asymmetric layout** (for example, two lead cards for the two audiences). This conflicts with §5's
  fixed "six cards, 3 / 2 / 1".

---

First run for this target, no trend yet. Snapshot: `.impeccable/critique/` (slug `project-index-html-services`).

Questions skipped: the owner asked for all eight critiques to run back to back without stopping (2026-09-27); triage
happens on the summary (`10-summary.md`).
