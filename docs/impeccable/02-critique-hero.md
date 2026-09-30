Method: dual-agent (A: design-review subagent · B: detector subagent). Both assessments ran isolated; B's results were
read only after A had finished. An API usage limit interrupted both part-way; each was resumed with its context
intact.

# Impeccable critique — the portal hero (first screen + scroll dive)

Phase 1, step 3 of `docs/prompts/IMPECCABLE_PASS.md`. Target: `.portal#top` in `project/index.html`, from the first
screen through the dive into the Proof room (`portal.css`, `components.css .laptop`, `motion/portal.js`). Inspected
rendered at 1440×900, 1280×800, 768×1024 and 390×844, with dive frames at 0–100% and with reduced motion. Nothing was
changed.

**Not re-raised** (see `01-audit-home.md`): A1 (first paint ≠ measured layout), A2 (Google Fonts), A3 (menu focus),
C1, C3, C4 and C7 (accepted by owner). The float cards' figures are owner-confirmed illustration. The dive
choreography is approved; nothing below changes it.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | The hint fades at p .03, and the 3-screen pinned track gives no sense of its length. The loader is decorative, not real status |
| 2 | Match System / Real World | 2 | «زیرساخت دیجیتال», Latin «CRM» and six services in one sentence ask a lot of a café owner (copy flag) |
| 3 | User Control and Freedom | 3 | Fully reversible, and the hint skips to the end of the track. No skip once the hint has gone |
| 4 | Consistency and Standards | 3 | On phones the hamburger sits mid-bar beside the logo, not at the edge |
| 5 | Error Prevention | 2 | The static layout scrolls sideways (HE4). Icons can vanish (HE2) |
| 6 | Recognition Rather Than Recall | 2 | On phones the only «شروع پروژه» hides in the menu for about 4 screens (HE1) |
| 7 | Flexibility and Efficiency | n/a | Persuade surface; no expert paths expected |
| 8 | Aesthetic and Minimalist Design | 3 | The desktop rest frame is strong. The empty lit screen when stacked and the sparse end frame are the valleys |
| 9 | Error Recovery | 3 | The cards and the wall of work fail quietly and cleanly when data is missing |
| 10 | Help and Documentation | n/a | Landing page; the FAQ lives elsewhere |
| **Total** | | **21/32** | **Acceptable (66%)** |

## Design Specificity Verdict

**LLM assessment.** On desktop the hero is authored for mitec.
- A CSS silver laptop sits on the Instagram forest, with the glare lit from the RTL side.
- The wall behind it is built from mitec's own delivered sites; a Persian café screen shows at the lower left.
- The dive into the screen and out into daylight is a real concept, not decoration.

Two things pull it back toward the category: the float cards (SEO pill, order toast, growth chart) are a familiar
SaaS-hero device, and the headline's vocabulary is category language. On phones the stacked layout drops the cards and
the wall by design. What is left is forest, a grid and an empty white laptop, which could be anyone's. Roughly: authored
on desktop, generic on phones.

**Deterministic scan.**
- **Known or accepted:** everything the CLI (static, URL 1440, URL 390) and the in-page overlay flagged for the hero is
  known or accepted: C1 (eyebrow pill), C2 (logo mint on forest), C3 (glow), C4 (grid), C5 (float-card shadows), C7
  (display leading).
- **False positives, checked in the page:**
  - "low-contrast" on the H1 and sub (1.0–1.7:1) at 390 and in the CLI's 1440 render: the stacked copy is painted over
    `.portal__wall` (`#12312A`), a sibling layer. The detector walks ancestors and lands on the stage's `#F5F7F4`. Real
    ratios are 12.74:1 and 8.27:1.
  - "text-occlusion" of the H1 under the nav: a transient lift-off frame. By then the H1 is at opacity ≤ .19.
  - "cramped-padding" on `.portal__statement`: a centred flex layer.
  - "body-text-viewport-edge" on the sub: 24px gutters at every sample.
  - `.portal__stage` "clipped overflow": intentional clipping of the pinned scene.
- The CLI's headless render showed the hero in its stacked state even at 1440, and without the JS-built parts. This
  is a detector-environment quirk, not a page finding.
- The detector agrees with the review on nothing new, and found no issue the review missed.

**Visual overlays.** Injection succeeded in two passes in the in-app browser. At the top of the page at 1440 the
console reported 44 flagged elements, all of them the known or accepted rules above. The live server was stopped and
the tab closed afterwards, so no overlay remains visible.

## Overall Impression

This is the most authored screen on the site at 1440 and 1280, and the dive lands without a flash. The biggest
opportunity is on phones: after one flick there is no visible way to act, and the stacked scene loses the things that
make it mitec's.

## What's Working

1. **Readability on the lit screen.** In the light token set the H1 breaks into three balanced lines (72px at 1440,
   65px at 1280). The primary sits on the start side, and its focus ring is clear on white.
2. **Float-card placement.** The cards are placed against the measured copy, touch no text at 1440 or 1280, and are
   gone by 15% of the dive, before the statement starts.
3. **Accessibility plumbing.**
   - Actions go `inert` once invisible.
   - The hint is a real button that skips the track.
   - After the hint, Tab lands on the Work card.
   - The same DOM gives a complete static fallback.

## Priority Issues

**HE1 · [P1] Phones and tablets: no visible way to start a project for about four screens**
- **What:**
  - Below 860px the nav CTA lives only inside the collapsed menu.
  - The hero's actions go inert at 15% of the dive (about 265px of scroll at 390).
  - The next visible «شروع پروژه» is a Services card link at y≈3,463.
  - Direct channels appear only in `#contact` (y≈11,500).
- **Why it matters:** the page's goal is out of sight exactly while the showpiece plays, for the half of visitors on
  phones.
- **Fix:** from 860px down, keep `.navbar__cta` (tonal, `btn--sm`) in the bar, outside `#navMenu`, in the empty space
  beside the toggle. It turns primary only after the hero's primary has left, as DESIGN.md §5 already allows.
- **Suggested command:** `/impeccable adapt` · **Effort:** S–M · Overlaps MO1, PW1.

**HE2 · [P1] Every icon on the page loads from `cdn.jsdelivr.net`**
- **What:** `components.css:93–113` points 21 `.icon-*` masks at `lucide-static` on jsdelivr (verified in synthesis).
  With jsdelivr blocked:
  - the phone hamburger renders as an empty 44px box;
  - the CTAs lose their arrows;
  - the FAQ loses its +/− markers (FC);
  - the Services chips go blank (SV).
- **Why it matters:** jsdelivr is often slow or filtered in Iran, and on phones the toggle is the only way into the
  navigation. It also breaks the pass's own "no CDNs" constraint. This is the same risk as A2, but for icons.
- **Fix:** self-host the SVGs (e.g. `project/public/icons/`) and point each `mask-image` at the relative URL. Keep
  the mask + `currentColor` technique.
- **Suggested command:** `/impeccable harden` · **Effort:** S · Overlaps A2 (fix together).

**HE3 · [P2] Stacked layout: the lit screen is blank at rest**
- **What:** at 768×1024 and 390×844 the laptop's screen is a large empty white field (548×338 at 768), the brightest
  shape in the viewport.
- **Why it matters:** it reads as a failed load, pulls the eye off the H1 and CTA, and the phone scene loses
  everything that makes it mitec's.
- **Fix:** in the stacked layout only, show one real portfolio screenshot (`portfolio.json` `src960`, already fetched
  for Work) on the glass at rest, and fade it out with the copy by 15% (opacity only, timing unchanged). DESIGN.md §5
  would need a one-line addition (see New conflicts).
- **Suggested command:** `/impeccable adapt` · **Effort:** M · Coordinate with A1 (same stacked first paint).

**HE4 · [P2] The static hero (reduced motion or no JS) scrolls sideways on phones and tablets**
- **What:** the outline laptop's deck, `.portal__intro::after { inset-inline: -8% }`, widens the document. Verified
  in synthesis:
  - `scrollWidth` 801 against 768 on a touch tablet, and 392 against 390 on a phone;
  - the page loads 32px sideways at 768;
  - anchor jumps land sideways.
  - Motion-on and desktop layouts are unaffected.
- **Why it matters:** reduced-motion visitors on phones get a page that drifts sideways.
- **Fix:** clamp the deck to the gutter (e.g. `inset-inline: max(-8%, calc(8px - var(--gutter)))`), or clip overflow
  on `.portal__statement`.
- **Suggested command:** `/impeccable harden` · **Effort:** S · Overlaps FC3 (the CTA echo has the same pattern).

**HE5 · [P3] Line breaks in the statement and the Proof labels**
- **What:**
  - Statement line 1 breaks 4 words / 2 words («…کسب‌وکارتان / را بسازید؟») at 1440, 1280 and 768.
  - `.portal__intro-line` has no `text-wrap: balance`, unlike the H1.
- **Fix:** add `text-wrap: balance` to `.portal__intro-line:first-child`.
- **Suggested command:** `/impeccable typeset` · **Effort:** S · Part of the typesetting group (see summary).

## Persona Red Flags

**Jordan (first-timer)**
- Meets jargon in the H1 and sub (copy flag).
- The hint is a small muted caption in the far corner.
- After one scroll: an empty screen, then a question («آماده‌اید…؟») he cannot act on, then «خودتان ببینید» with
  nothing to click.

**Riley (stress tester)**
- Reversing, resizing and the keyboard all behave.
- A blocked CDN leaves a blank toggle (HE2).
- Reduced motion at 390–768 drifts sideways (HE4).
- The skip link targets `#top`, the hero itself, so it only skips the nav.

**Casey (one-handed, slow connection)**
- The first phone screen fits, and the primary (y 418–469) is reachable.
- The toggle is top-centre, a hard one-handed reach.
- After the first flick there are about two screens of forest and an empty laptop with no CTA.
- Icons and the font depend on external hosts.

**Café owner arriving from Instagram on a phone**
- The palette matches Instagram, which is good.
- Her instinct is to message, and the first screen has no WhatsApp or Telegram path; «تماس» is about 13 screens down.
- Nothing on the phone hero says "menu" or "café". The café screenshot exists only in the desktop wall.

## Minor Observations

- On phones the left half of the nav bar is empty because the toggle hugs the logo (the HE1 fix uses that space).
- The dive's end frame is sparse. At 100% the Proof content fills only 320–615 of 900px (1440). See PW, and question 1.
- The wall of work shows Latin client text («Your Energy», «Evolve») beside the deck at 1440.
- The CRM float card's meta line mixes Latin «CRM» into a 12–14px RTL caption.
- The "loader" line signals a loading state that isn't real. It works as a metaphor, but it is a status signal with
  nothing behind it.

## Questions to Consider

1. The site's most expensive motion ends on three numerals. Should the room you fly into feel like the work itself?
2. Would a café owner recognise herself faster in an online menu than in «۳۲٪ رشد»?
3. Direct access with no middleman is the one promise competitors cannot copy, and it is absent from the first
   screen. Should a direct-message path sit beside «شروع پروژه»? (Copy flag; no wording proposed.)

## New Conflicts with DESIGN.md (for the owner)

- **HE3's fix adds content to the lit screen.** DESIGN.md §5 defines the lit screen as sheen and glare only. If the
  owner accepts the fix, §5 needs a line for the stacked layout.

---

First run for this target, no trend yet. Snapshot: `.impeccable/critique/` (slug `project-index-html-hero`).

Questions skipped: the owner asked for all eight critiques to run back to back without stopping (2026-09-27); triage
happens on the summary (`10-summary.md`).
