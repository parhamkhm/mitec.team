---
name: mitec.team
description: A dark emerald-and-bronze studio system in Persian RTL, where only emerald acts and only bronze emphasises.
colors:
  navy-ground: "#06142D"
  navy-deep: "#030C1C"
  navy-raised: "#0C2140"
  teal-hero: "#07211F"
  emerald-action: "#1AA36B"
  emerald-lit: "#2CC486"
  emerald-speech: "#5FE0AC"
  emerald-label-dark: "#0E5A3C"
  emerald-label-hover: "#14764F"
  bronze-emphasis: "#C9A682"
  bronze-lifted: "#E2C6A4"
  bronze-on-light: "#7E5A3E"
  ink-white: "#FFFFFF"
  ink-ivory: "#F4F7F6"
  ink-body: "#C2D2CE"
  ink-muted: "#7A908D"
  ink-dark: "#0E1A18"
  status-danger: "#E0544A"
  status-warning: "#D9A441"
  status-info: "#3E9BD4"
typography:
  display:
    fontFamily: "Vazirmatn, system-ui, sans-serif"
    fontSize: "clamp(44px, 6.4vw, 84px)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.022em"
  headline:
    fontFamily: "Vazirmatn, system-ui, sans-serif"
    fontSize: "clamp(28px, 3.4vw, 44px)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.022em"
  title:
    fontFamily: "Vazirmatn, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.012em"
  body:
    fontFamily: "Vazirmatn, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.62
  label:
    fontFamily: "Vazirmatn, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.18em"
  stat:
    fontFamily: "Vazirmatn, system-ui, sans-serif"
    fontSize: "clamp(30px, 3.2vw, 44px)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
rounded:
  xs: "6px"
  sm: "10px"
  md: "14px"
  lg: "20px"
  xl: "28px"
  pill: "999px"
  circle: "50%"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  7: "32px"
  8: "40px"
  9: "48px"
  10: "64px"
  11: "80px"
  12: "96px"
  13: "128px"
components:
  button-primary:
    backgroundColor: "{colors.emerald-label-dark}"
    textColor: "{colors.ink-white}"
    rounded: "{rounded.pill}"
    padding: "11px 20px"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.emerald-label-hover}"
    textColor: "{colors.ink-white}"
  button-secondary:
    backgroundColor: "rgba(255,255,255,.045)"
    textColor: "{colors.ink-white}"
    rounded: "{rounded.pill}"
    padding: "11px 20px"
  card-glass:
    backgroundColor: "rgba(255,255,255,.045)"
    textColor: "{colors.ink-body}"
    rounded: "{rounded.lg}"
    padding: "24px"
  card-ivory:
    backgroundColor: "{colors.ink-ivory}"
    textColor: "{colors.ink-dark}"
    rounded: "{rounded.lg}"
    padding: "24px"
  card-emerald:
    backgroundColor: "#0F4C3F"
    textColor: "#E4EDEA"
    rounded: "{rounded.lg}"
    padding: "24px"
  input:
    backgroundColor: "rgba(3,12,28,.55)"
    textColor: "{colors.ink-body}"
    rounded: "{rounded.sm}"
    padding: "11px 20px"
  badge-accent:
    backgroundColor: "rgba(26,163,107,.14)"
    textColor: "{colors.emerald-speech}"
    rounded: "{rounded.pill}"
    padding: "5px 12px"
    typography: "{typography.label}"
  medallion:
    backgroundColor: "{colors.emerald-action}"
    textColor: "{colors.ink-white}"
    rounded: "{rounded.circle}"
    size: "48px"
  nav-link-active:
    textColor: "{colors.ink-white}"
    typography: "{typography.body}"
---

# Design System: mitec.team

## Overview

**Creative North Star: "The Night Atelier"**

mitec is two people who build the thing themselves, and the interface says so before the copy does. The ground is deep navy with a teal-green bloom sitting off-centre — a room at night, not a corporate slide. Bronze appears where a name or a finished number belongs, the way a warm lamp falls on a nameplate. Emerald appears only where a hand is actually working: the button you press, the card that is live, the field that has focus. Nothing else is permitted to compete for attention, and the restraint is what makes a two-person studio read as deliberate rather than small.

The system is Persian and right-to-left first. Vazirmatn carries every role — display, body, numerals — because the original Montserrat/Mulish pairing has no Persian glyphs, and that substitution is the system's documented entry point for type. Density is generous rather than packed: sections breathe on a `clamp(64px, 8vw, 128px)` rhythm, cards hold 24px of air, and running copy sits at 1.62 leading so long Persian sentences stay readable. Surfaces are glass over that navy bloom — 4.5% white fills, 8% hairlines, an inset top highlight — so the page reads as layered atmosphere rather than stacked boxes.

The confirmed anti-reference is the stock-template comp the palette was sampled from: its filled pictograms, its borrowed client logos, and its invented proof numbers are all explicitly rejected. mitec ships three real projects and a two-person team, and the design must stay honest at that scale. Where the reference reached for a photograph, this system renders depth in CSS instead — there is no photography yet, and none should be faked.

**Key Characteristics:**
- Deep navy ground with an off-centre teal bloom; never a flat fill
- Emerald is the only action colour; bronze is the only emphasis colour
- Glass surfaces, hairline borders, emerald glow instead of drop shadow
- Persian RTL throughout, Vazirmatn across every type role
- Exactly one lit (emerald) card per row; the rest stay pale
- Proof over adjectives — every claim carries a real figure or is cut

## Colors

Four strictly-roled families over a navy ground: navy builds the room, teal warms the gradients, emerald acts, bronze emphasises, and green-tinted inks carry text.

### Primary
- **Emerald Action** (`#1AA36B`): the single action colour — buttons, focus rings, active tabs, medallions, success states, the beaded dot on every rule. It is the one hue allowed to mean "press this" or "this is live."
- **Emerald Lit** (`#2CC486`): the bright stop of the action gradient and the colour of glow. It carries hover states and the 5px glowing nodes on dividers, never a text label.
- **Emerald Speech** (`#5FE0AC`): emerald as *text* on dark — eyebrows, links, badge labels, the focus halo. Reads at ~9:1 on the navy ground.
- **Deep Emerald Label** (`#0E5A3C` → `#14764F`): the darker pair reserved for surfaces that carry text on top of the action colour. This exists because white on the standard accent gradient measures 2.25–3.23:1, and this system's button labels (17/15/13.5px) are below WCAG's large-text exception, so the 4.5:1 threshold applies. This pair clears it at 8.25:1 at rest and 5.62:1 on hover, using no colour outside the system's own ramp.

### Secondary
- **Bronze Emphasis** (`#C9A682`): the accent word in a headline, stat numerals, process step numbers. Exactly one bronze run per headline. **Never a button, never a surface, never a border.**
- **Bronze Lifted** (`#E2C6A4`): the light stop of the gold text-fill gradient and the colour of bronze on a badge.

### Tertiary
- **Teal Hero** (`#07211F` → `#15594A`): navy rotated toward green. Appears *only* inside gradients and glows — the page bloom, the hero wash, the emerald card fill. Never a flat fill of its own.

### Neutral
- **Navy Ground** (`#06142D`): the page. Always delivered as the radial `--grad-page` bloom, never as a flat colour.
- **Navy Deep** (`#030C1C`): edge darkening, sunken input grounds, shadow tint.
- **Navy Raised** (`#0C2140`): the opaque panel colour for dense UI where glass would be unreadable.
- **Ink Body** (`#C2D2CE`): running copy on dark, ~10.5:1 on the ground.
- **Ink Muted** (`#7A908D`): captions and hints only, ~4.6:1 — the contrast floor. Never running copy.
- **Ink Ivory** (`#F4F7F6`): the light card surface, which flips the whole text ramp via `.mt-on-light`.
- **Ink Dark** (`#0E1A18`): text on ivory surfaces.

Status reuses the family — success *is* emerald, warning shares bronze's hue (`#D9A441`). Only danger (`#E0544A`) and info (`#3E9BD4`) sit outside it, and they appear in `Alert` alone.

### Named Rules

**The Single Actor Rule.** Only emerald acts and only bronze emphasises. If an element is neither pressable nor a point of emphasis, it is navy, glass, or ink. Two competing accents on one surface is a defect, not a choice.

**The One Lit Card Rule.** In any row or grid of cards, exactly one may be emerald. Three pale cards and one lit one is the system's signature move; two lit cards destroys it.

**The Real Colour Rule.** Body text is never set at reduced opacity. Muted text uses `--text-muted`, an actual colour, so contrast stays measurable rather than inherited.

**The Label Pair Rule.** Any surface carrying *text* on the action colour uses the deep emerald pair (`#0E5A3C` → `#14764F`), not the standard accent gradient. Icon medallions, the nav underline, and chart bars keep the bright gradient — they are non-text graphics, where 3.23:1 clears WCAG 1.4.11's 3:1 bar.

## Typography

**Display Font:** Vazirmatn (with system-ui, sans-serif)
**Body Font:** Vazirmatn (with system-ui, sans-serif)
**Label/Mono Font:** JetBrains Mono — token names and code only

**Character:** One family carries the whole system, separated by weight and tracking rather than by face. At 800 with `-0.022em` tracking and 1.04 leading, Vazirmatn reads geometric and confident; at 400 with 1.62 leading it turns humanist and quiet. The substitution is deliberate and documented: Montserrat and Mulish carry no Persian glyphs, so re-pointing `--font-display` and `--font-body` at Vazirmatn is the system's own sanctioned override point. Persian numerals are used throughout — Latin digits in user-facing copy are a defect.

### Hierarchy
- **Display** (800, `clamp(44px, 6.4vw, 84px)`, 1.04): hero titles only. One per page.
- **Headline** (700–800, `clamp(28px, 3.4vw, 44px)`, 1.04): section titles.
- **Title** (700, 19–23px, 1.2): card titles, feature names.
- **Body** (400, 15px, 1.62): running copy. Lead paragraphs at 20px, secondary copy at 13.5px.
- **Label** (700, 12px, `0.18em`, uppercase): eyebrows and micro-labels. Overlines at 11px / `0.24em`.
- **Stat** (800, `clamp(30px, 3.2vw, 44px)`, `-0.02em`): stat numerals, always bronze.

### Named Rules

**The Three-Part Headline Rule.** A headline stacks: an italic kicker, a bronze subject naming *what it is*, and a white payoff naming *what you get*. Exactly one bronze run per headline.

**The No-Emoji Rule.** Never in UI, never in copy, never in headings. Iconography carries that load, and icons are Lucide masks — never inline SVG paths, never Unicode glyphs (▸ ✓ ★) standing in for icons.

**The Persian Numeral Rule.** All user-facing figures render in Persian digits (`۳`, `۱ روز`). `src/utils/persian-digits.js` exists for exactly this; a Latin digit in the UI is a bug.

## Layout

A 4-based scale to 24px, then 32 / 40 / 48 / 64 / 80 / 96 / 128. The container is 1200px with a 24px gutter; the narrow reading column is 760px. Section padding is `clamp(64px, 8vw, 128px)` — the vertical rhythm that makes the page feel unhurried.

Direction is RTL at the document level, with logical properties (`margin-inline`, `inset-inline`) throughout so the layout mirrors cleanly. The one exception is `.logo`, which is forced to `direction: ltr` because the wordmark is built from Latin runs ("mi" + "tec" + "." + ".team") that would otherwise reorder.

Home-page content is centre-aligned — hero, section headings, keyword rail — and inner pages run left-aligned (start-aligned). Feature rows run four across, portfolio grids three across. The navbar is the only fixed element: sticky, translucent navy at 72%, blurred at 40px, with a hairline bottom border. Below the mobile breakpoint the nav menu collapses behind a toggle, which is the one component the source system had no treatment for.

Card padding is 24px, 32px for large cards. Controls sit at 11px × 20px.

## Elevation & Depth

*Current state, recorded as description rather than law — this system is open to exploring other depth treatments.*

On dark grounds depth currently reads as **emerald glow rather than shadow**. A card is separated from the ground by three things: a 1px hairline at 8% white, a `--grad-glass` fill running 8.5% → 1% white, and an inset top highlight at 10% white. Real drop shadows appear in exactly one place — ivory cards and tooltips, where a light surface on a dark ground needs the lift. Blur is used twice: 18px on glass surfaces and 40px on the sticky nav scrim. Text is never blurred, and a whole section is never blurred.

### Shadow Vocabulary
- **Glow sm** (`0 0 18px rgba(44,196,134,.22)`): resting state on lit elements — medallions, primary buttons, active tabs.
- **Glow md** (`0 0 38px rgba(44,196,134,.30)`): hover lift and the emerald card's resting state.
- **Glow lg** (`0 0 80px rgba(44,196,134,.26)`): ambient wash behind a hero element.
- **Glow inset** (`inset 0 1px 0 rgba(255,255,255,.10)`): the top highlight that makes glass read as a surface.
- **Ivory shadow** (`0 18px 40px -18px rgba(3,12,28,.45)`): the only true drop shadow on a resting surface.
- **Focus ring** (`0 0 0 3px rgba(95,224,172,.35)`): always visible, never removed.

## Shapes

Nothing in this system uses a square corner. Cards are 20px, media and inner panels 14px, inputs and selects 10px, checkboxes 6px. Actions and badges are full pills (999px) — **a pill always means "you can press this."** Icon medallions and avatars are perfect circles.

Borders are hairlines, always: 8% white by default, 14% on controls, 26% on hover, and emerald at 45% for focus, active, and the emerald card. On light surfaces the same ladder inverts to ink alphas. No 2px borders. No coloured-left-border-only cards — that pattern is explicitly banned; `Alert` uses a full tinted border instead.

There is exactly one divider in the system: an emerald hairline that fades to zero at both ends (`--grad-rule`), optionally beaded with a glowing 5px node. Never a flat grey line.

## Components

### Buttons
- **Shape:** full pill (999px)
- **Primary:** deep emerald gradient (`#0E5A3C` → `#14764F`) with white label, `--glow-sm` plus the inset highlight; 11px × 20px at medium, 15px × 30px at large, 8px × 16px at small
- **Hover:** gradient brightens to solid `#14764F` and glow steps to `md` — buttons brighten, they never darken, and never fade opacity (that reads as disabled)
- **Press:** `scale(0.97)` at 140ms, no colour change
- **Secondary:** glass fill at 4.5% white, 14% border, 18px backdrop blur, white label; hover raises fill to 7.5% and border to 26%
- **Disabled:** `opacity: 0.42`, `cursor: not-allowed`, nothing else changes

### Cards / Containers
- **Corner Style:** 20px
- **Four skins:** `glass` (default on dark — glass gradient, 8% hairline, inset highlight), `ivory` (light card on dark ground, 60%-white border, the system's only resting drop shadow, sets `.mt-on-light` which re-points every text token), `emerald` (the lit one — emerald card gradient, 45% emerald border, `--glow-md`), `solid` (opaque navy for dense UI)
- **Internal Padding:** 24px, 32px large
- **Hover (interactive cards only):** lift `translateY(-2px)`, border warms to emerald, glow steps `sm` → `md`

### Inputs / Fields
- **Style:** sunken navy ground at 55%, 10px radius, 14% subtle border, 11px × 20px padding
- **Focus:** 3px emerald halo at 35% (`--ring-focus`); never removed
- **Error:** full tinted border, never a left-border-only stripe

### Navigation
- Sticky, navy at 72%, 40px backdrop blur, hairline bottom border. Links at 15px medium in body ink; active links go bold white with a 2px emerald underline carrying `--glow-sm`. Below the mobile breakpoint the menu collapses behind a 38px bordered toggle.

### Badges
- Full pill, 12px bold uppercase at `0.06em`. Accent variant: emerald tint at 14% with emerald-speech label and a 45% emerald border. Bronze variant: bronze tint at 14% with `#E2C6A4` label.

### The Medallion (signature)
The brand's one icon container: a 44–48px perfect circle filled with the bright accent gradient, white glyph, `--glow-sm`. It appears on every feature and service card, and it is the one place the bright gradient is allowed under a foreground element — because a glyph is a graphic, not text.

### The Glow Rule & Keyword Rail (signature)
A single emerald hairline fading to zero at both ends, beaded with glowing 5px nodes, separating single Title-Case value words (*مدرن · سریع · امن · مقیاس‌پذیر*). Three to five words, no punctuation. This is the system's closing gesture and its most recognisable non-card element.

## Do's and Don'ts

### Do:
- **Do** deliver the page ground as `--grad-page` — a radial teal-green bloom at ~22%/38% over navy, darkening to `#040F24` at the edges.
- **Do** use the deep emerald pair (`#0E5A3C` → `#14764F`) for any surface carrying text on the action colour; it clears 4.5:1 where the bright gradient does not.
- **Do** keep exactly one emerald card per row — the lit one marks what is featured or active.
- **Do** reach for semantic aliases (`--surface-card`, `--text-muted`, `--accent`) rather than the raw ramps.
- **Do** render every user-facing figure in Persian digits.
- **Do** attach a real number to every claim, or cut the claim — the three delivered projects, the two-person team, and the one-business-day response are the only proof available, and inventing more is a product-level violation.
- **Do** draw icons as Lucide CSS masks with `background-color: currentColor`, at 16 / 20 / 22 / 26px.
- **Do** keep `.logo` at `direction: ltr` so the Latin wordmark holds its order on an RTL page.

### Don't:
- **Don't** use bronze as a button, a surface, or a border. It emphasises; it never acts.
- **Don't** put two accent colours in competition on one surface.
- **Don't** use a flat background colour anywhere the page ground shows — it is always a gradient.
- **Don't** set body text at reduced opacity; use `--text-muted`, a real colour.
- **Don't** use `--text-muted` (`#7A908D`, 4.6:1) for running copy — it is the floor, for captions and hints only.
- **Don't** use a square corner, a 2px border, a flat grey divider, or a coloured-left-border-only card.
- **Don't** fade opacity on hover — that reads as disabled. Brighten instead.
- **Don't** let anything bounce, overshoot, or spin. Cross-fades and 2px translations only, at 220ms on `cubic-bezier(.22,.61,.36,1)`.
- **Don't** use emoji or Unicode characters as icons, and never hand-write SVG paths.
- **Don't** reproduce anything from the source reference comp — its "BizNext" branding, its client logos, or its invented figures (`500+ Projects`, `98% Client Satisfaction`). It is an art-direction reference and a confirmed anti-reference for content.
- **Don't** fabricate photography. There is none yet; depth is rendered in CSS until real images arrive.
