# Impeccable pass — Phase 1 summary

All open findings from the audit (`01-audit-home.md`) and the eight critiques (`02`–`09`), in one place for triage.
Nothing in the site has been changed by Phase 1.

**Excluded:**
- the owner-accepted conflicts C1–C8;
- A14 (closed with C7);
- the float cards (owner-confirmed illustration);
- documented product state: `/order` and `/track` not built, placeholder contacts, prices and photos, Testimonials
  hidden.

## Scores

| Report | Target | Score | Band | P1 | P2 | P3 |
|---|---|---|---|---|---|---|
| 01 | Audit (technical) | 15/20 | Good | 2 | 6 | 5 open |
| 02 | Portal hero | 21/32 | Acceptable (66%) | 2 | 2 | 1 |
| 03 | Proof + Work | 21/32 | Acceptable (66%) | – | 4 | 1 |
| 04 | Services | 25/36 | Acceptable (69%) | – | 2 | 2 |
| 05 | Process | 20/32 | Acceptable (62%) | – | 5 | – |
| 06 | About | 20/32 | Acceptable (62%) | – | 4 | 1 |
| 07 | Pricing calculator | 23/36 | Acceptable (64%) | – | 5 | – |
| 08 | FAQ + CTA + footer | 25/36 | Acceptable (69%) | 1 | 2 | 2 |
| 09 | Whole page at 390 | 25/36 | Acceptable (69%) | 1 | 2 | – |

**50 open findings: 6 P1, 32 P2, 12 P3. No P0.**

Critique severities were calibrated across sections during synthesis. Where a review said P1 and this summary says P2,
the report explains why: AB1, AB2, PC1, PC2 and PR1. MO2 and MO5 are the same findings as PC4 and AB3, so each is
listed once.

## Every open finding

Effort: **S** is under half a day, **M** is about a day, **L** is several days.

| ID | Section | Sev. | Finding | Effort | Command |
|---|---|---|---|---|---|
| A1 | Hero (load) | P1 | First paint ≠ measured layout: CLS 0.22 desktop, 1.08 phone; pre-JS phone laptop covers the buttons | M | optimize |
| A2 | Page | P1 | Vazirmatn from Google Fonts, render-blocking; a hanging request blanks the page | M | optimize |
| HE1 | Hero / nav | P1 | Phones/tablets: no visible «شروع پروژه» for ~4 screens after the first flick (nav CTA only inside the menu) | M | adapt |
| HE2 | Page | P1 | All 21 icons load from `cdn.jsdelivr.net` (blank hamburger, FAQ markers, chips, arrows when blocked) | S | harden |
| FC1 | CTA band | P1 | Closing band ranks «پیگیری سفارش» above the direct channels; channels are bare 16px links under a hairline | M | layout |
| MO1 | Phone journey | P1 | Nothing to act on from the phone nav; WhatsApp first appears 96% down the page | S | adapt |
| A3 | Nav (phone) | P2 | Open menu lets focus walk out behind it; toggle label stays «باز کردن فهرست» | S | harden |
| A4 | Services | P2 | Illustration `sizes` wrong on phones (~480KB extra) | S | optimize |
| A5 | Page | P2 | 15 unbundled modules, no `modulepreload` (DOMContentLoaded 3.8s on a slow phone) | S | optimize |
| A6 | Page | P2 | CSS `@import` chain in `tokens.css` | S | optimize |
| A7 | Work / scope / nav | P2 | Touch targets < 44px: Work dots 24px, pause 36px, «مطمئن نیستید؟» 27px tall, logo 24px (+ Work sheet tabs 34px, × 40px, from 03) | S | adapt |
| A8 | About | P2 | Placeholder «عکس» label at 4.36:1 | S | harden |
| HE3 | Hero (stacked) | P2 | Lit screen blank at rest on tablets/phones: brightest shape, reads as a failed load | M | adapt |
| HE4 | Hero (static) | P2 | Reduced motion / no JS: page scrolls sideways (+33px at 768, +2px at 390) from `.portal__intro::after` | S | harden |
| PW1 | Work | P2 | No «شروع پروژه» across Proof + Work on phones/tablets (~1,700px) | S | layout |
| PW2 | Work (reduced motion) | P2 | "Flat row" is overlapping see-through cards | S | harden |
| PW3 | Proof | P2 | Stat typesetting: «۱ روز کاری» at numeral size dominates; bad label breaks at 390/360 | S | typeset |
| PW4 | Work | P2 | Only desktop homepage screenshots; no phone or panel views for the service/tool audience (needs captures) | M | adapt |
| SV1 | Services | P2 | Cards look clickable but aren't; oversized off-label hit area; sticky hover on touch | S | polish |
| SV2 | Services | P2 | «بپرسید» and «جزئیات پشتیبانی» land on a pitch / seven closed FAQ rows | S | clarify |
| PR1 | Process | P2 | Text contrast collapses (to ~1.02:1) on every spotlight hand-over (text 220ms vs layer 420ms) | S | animate |
| PR2 | Process (desktop) | P2 | Spotlight lands arbitrarily and its first beat is missed. **Frozen feature: owner go-ahead** | M | animate |
| PR3 | Process | P2 | Forest paragraphs run 3–5 lines (§6 allows 2); 1024 cramped and ragged. **DESIGN.md ambiguity: owner** | M | layout |
| PR4 | Process (tablet) | P2 | 768 cards ~70% empty, one line each | S | adapt |
| PR5 | Process | P2 | Dimmed step numerals at 2.06:1 (large text needs 3:1); `tabular-nums` detaches «۰» | S | typeset |
| AB1 | About | P2 | Title breaks into 3 lines, «شما» alone at ≥ 1279px; H2 64px/500 off the scale | S | typeset |
| AB2 | About | P2 | The section that promises direct access has nothing to tap | S | shape |
| AB3 | About (phone/tablet) | P2 | Cards never restack; 168–178px text columns | S | adapt |
| AB4 | About | P2 | No rule for real photos (natural size, corner shows); a third member sits alone | S | harden |
| PC1 | Calculator | P2 | Switching site type silently discards add-ons and page count | S | harden |
| PC2 | Calculator | P2 | Total has no breakdown; «شامل ۱ صفحه» vs a 20-page choice. **New copy: owner** | M | clarify |
| PC3 | Calculator | P2 | Slider and package disagree; per-page price never shown | S | clarify |
| PC4 | Calculator (phone/tablet) | P2 | Most site-type tabs hidden (2.5 of 6 at 390; «سرویس اختصاصی» clipped at 768) | S | adapt |
| PC5 | Calculator | P2 | «اعداد نمونه» badge far from the figure (the phone bar has no caveat) | S | clarify |
| FC2 | FAQ | P2 | Single-open accordion moves the tapped item (to −418px at 390); no hover state | S | harden |
| FC3 | CTA band | P2 | Laptop-echo deck overshoots at 768/390 (`inset-inline: -6%`) | S | polish |
| MO3 | Phone journey | P2 | Type hierarchy collapses: section subs 23px vs H2 30px; 5–7-line preambles | S | typeset |
| MO4 | Services (phone) | P2 | Services is 2,492px (3 screens) of look-alike cards | M | distill |
| A9 | Page | P3 | Permanent `will-change` on ~25 elements | S | optimize |
| A10 | Work / FAQ | P3 | `width` / `padding-bottom` transitions | S | optimize |
| A11 | Page | P3 | `portfolio.json` fetched 3× | S | optimize |
| A12 | Work | P3 | Ambient `<img>` without `src` | S | harden |
| A13 | Page | P3 | Old `.dc.html` prototypes (+ `support.js`, `image-slot.js`) still served (`_ds` already removed) | S | polish |
| HE5 | Hero | P3 | Statement line 1 breaks 4/2; no `text-wrap: balance` | S | typeset |
| PW5 | Work | P3 | `aria-roledescription` on a role-less div; dots named by index; caption height jumps | S | harden |
| SV3 | Services | P3 | Heading orphan at 768 («دارد»), sub split at 390 | S | typeset |
| SV4 | Services | P3 | Four identical «شروع پروژه» link names; section not labelled | S | harden |
| AB5 | About | P3 | Converge motion happens mostly before the title is visible | S | animate |
| FC4 | Footer | P3 | Footer repeats the CTAs, has no channels, double gutter at 390 | S | distill |
| FC5 | CTA / FAQ | P3 | Drift: DESIGN.md §5's CTA-band glow not implemented; `faq.json` never read | S | polish |

## Overlapping findings

Fix these together; one decision or pass covers several IDs.

1. **The phone nav and phone actions: HE1, MO1, PW1, A3, A7 (logo).**
   - HE1 (a persistent tonal «شروع پروژه» in the bar) and MO1 (WhatsApp and Telegram in the phone menu) are one change
     to the phone nav.
   - A3 (focus containment) is in the same component.
   - Once HE1 lands, recheck PW1; it may no longer be needed.
2. **The direct-message path: FC1 (anchor), AB2, SV2, MO1, FC4.**
   - Four sections independently found that a direct message, a named success, is hard to reach.
   - Decide the channel hierarchy once, in the closing band (FC1), then reuse it in About (AB2), the Services
     «بپرسید» target (SV2), the phone menu (MO1) and the footer (FC4).
   - The calculator's error state (07, minor) should offer the same channels.
3. **Third-party runtime assets: A2 + HE2.** The same risk (Google Fonts and jsdelivr, both unreliable in Iran) and
   the same fix: self-host under `project/public/`. It also honours the pass's no-CDN constraint.
4. **The hero's first frame: A1 + A5 + A6 + A2 + HE3.**
   - A1's layout shift shrinks when the modules arrive sooner (A5, A6) and the font swap stops shifting text (A2's
     metric-matched fallback).
   - HE3 changes what the stacked first frame shows, so design it together with A1's pre-JS phone stand-in.
5. **Oversized "deck" pseudo-elements: HE4 + FC3.** Both use a negative `inset-inline` percentage that breaks the
   gutter on narrow screens. Apply one clamp pattern to both.
6. **The typesetting pass: HE5, PW3, SV3, AB1, MO3, PR5** (plus the Process subheading widow and the CTA heading split
   «از / همین‌جا»). Most are `text-wrap: balance`, a phone sub size, and bringing the About H2 onto the scale. This is
   Phase 2 step 5's whole-page `typeset`.
7. **Calculator state and content.**
   - PC1 and PC3 are one `selectType` change.
   - PC4 is the same finding as MO2.
   - PC2 and PC5 both change what the checkout holds, and both need owner copy.
8. **About cards: AB3 (= MO5) + AB4.** The same `.about-card` CSS: restacking and the photo rule.
9. **Services cards: SV1 + MO4 (+ A4).** Making the whole card the link and tightening it on phones touch the same
   markup. A4 (image `sizes`) is on the same element.
10. **The Work block: PW2, PW5, A7, A10, A12.** All in `work.js` / `home.css` Work. One `harden` pass, keeping the
    coverflow logic (only staging values and attributes change).
11. **The FAQ: FC2 + A10.** The same accordion code, both the scroll jump and the `padding-bottom` transition.
12. **Process: PR1 separate from PR2 / PR3.** PR1 is a timing bug fix and can go ahead. PR2 and PR3 change the frozen
    spotlight or depend on a DESIGN.md decision. PR5's contrast belongs with the typesetting pass (6).

## Decisions only the owner can make

- **Frozen feature:** PR2 and PR3 (Process spotlight).
- **New DESIGN.md conflicts raised by the critiques** (not accepted yet):
  - 02: a stacked-screen line in §5 (for HE3).
  - 03: four Work §5 items (side-card opacity, back tabs, card width at 768, clones with ≤ 3 projects).
  - 04: three Services §5 items (chip or illustration, illustration presence, fixed 3/2/1 grid).
  - 05: the §5/§6 spotlight paragraph rule.
  - 07: the free add-on's empty price line, and adding the breakdown to the summary card.
  - 08: FAQ markers without JS.
  - 09: `--section-pad` on phones.
- **New copy:**
  - A3's open-state label;
  - PC2's breakdown label;
  - PC3's per-page price slot;
  - the copy flags throughout the reports (jargon for café owners, generic headings, repeated eyebrows).
- **Assets:** PW4 (phone and panel captures), AB4 (real team photos).
- **A13:** delete or move the old prototypes.
