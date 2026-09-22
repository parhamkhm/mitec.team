# mitec.team — Design System

A dark, emerald-and-bronze system for a digital studio that sells **business websites**: design, build, search growth, commerce and support. Everything here is derived from one source (below) and from nothing else.

---

## 1. Sources — and an important caveat

| Source | What it is | Access |
| --- | --- | --- |
| `uploads/mitec site reference.jpg` (mirrored at `assets/reference/site-reference.jpg`) | A single 736×1097 raster marketing mockup, supplied by the user as the visual direction | In this project |
| `mitec.team` | The company named in the brief | **Not reachable** from this environment |

**Read this before trusting anything below.** The reference image is a stock template comp that carries a third-party brand name ("BizNext") and third-party client logos. It was treated strictly as an *art-direction reference* — palette, type feeling, layout rhythm, effects. No mark, wordmark, photograph or client logo from it has been reproduced.

No codebase, Figma file, deck or copy deck was provided. Consequently:

- **Colours are sampled** from the image pixel-by-pixel, then regularised into ramps.
- **Type is substituted** (see §4).
- **Icons are substituted** (see §7).
- **The component inventory was authored**, not transcribed, because no source defines one. Every component maps to something visible in the reference or to an unavoidable dependency of it — see §8 "Intentional additions".
- **Copy in the UI kit is written**, not lifted, because no product copy exists. It follows the tone rules in §3 and is placeholder-grade: replace it.

---

## 2. Index

```
styles.css              ← the only file consumers link
tokens/                 fonts · colors · typography · spacing · radii · elevation · gradients · motion · base
guidelines/             22 foundation specimen cards (Colors · Type · Spacing · Brand)
components/
  core/                 Button · IconButton · Badge · Card · Logo · Icon
  content/              SectionHeading · StatBlock · StatBar · FeatureCard · LogoStrip · GlowRule · KeywordRail
  forms/                Field · Input · Select · Checkbox · Radio · Switch
  navigation/           NavBar · Tabs · Breadcrumb
  feedback/             Alert · Tooltip · ProgressDots
ui_kits/marketing-site/ Click-through recreation of the public site (4 screens)
templates/landing-page/ "Landing page" starting template (Design Component)
assets/                 README.md (what's missing and why) + reference/
thumbnail.html          Homepage tile
SKILL.md                Agent-Skills wrapper
```

Each component directory carries `<Name>.jsx`, `<Name>.d.ts`, `<Name>.prompt.md` and one `@dsCard` HTML.

---

## 3. Content fundamentals

The reference's voice is **plain, declarative, proof-first B2B**. Extended into a usable set of rules:

**Person.** Second person for the reader, first-person plural for the studio. *"We deliver innovative digital solutions."* / *"Tell us what you are launching."* Never "I". Never "our team is passionate about".

**Casing.** Title Case for headlines, navigation, buttons and card titles — *Get Started*, *Watch Video*, *Client Satisfaction*, *Website Design*. Sentence case for body copy and form hints. **UPPERCASE** is reserved for eyebrows, micro-labels and badges, always with wide tracking (`--ls-eyebrow` .18em).

**Headline shape.** Three parts, stacked: a light italic kicker (*Professional*), a bronze subject (*Business Website*), a white payoff (*Design*). The bronze run names *what it is*; the white run names *what you get*. Exactly one bronze run per headline.

**Length.** Headlines 2–5 words per line. Subheads one sentence, under 12 words — *"Modern Layout for Startups and Companies."* Card bodies one or two sentences. Buttons 1–3 words.

**Proof over adjectives.** Every claim is followed by a figure: `500+ Projects`, `98% Client Satisfaction`, `24/7 Support`, `+68% Growth`. Figures are rounded and short (`500+`, not `512`); captions are one or two Title Case words. If you cannot attach a number, cut the claim.

**Value words stand alone.** The closing rail is single adjectives beaded on emerald dots: *Modern · Fast · Secure · Scalable*. Three to five, Title Case, no punctuation.

**Punctuation.** Ampersands in short labels (*SEO & Growth*). No exclamation marks. No trailing periods on headlines, buttons, badges or stat captions; periods on body sentences. Em dashes sparingly, spaced.

**Emoji: never.** Not in UI, not in marketing copy, not in headings. Iconography carries that load.

**Banned register.** "Unlock", "supercharge", "revolutionise", "game-changing", "seamlessly", "we're excited to announce", "delight". Replace with the concrete thing that happens: *"You will have a scoped proposal within two business days."*

**Errors and system messages** are short, blameless and instructive: *"That address is missing an @"* — not "Invalid input". Success messages state what happens next: *"We'll be in touch within one business day."*

---

## 4. Visual foundations

### Colour

Four families, strictly roled. The discipline of this brand is that **only emerald acts and only bronze emphasises** — nothing else is allowed to compete.

- **Navy** `#030C1C → #274470` — the page ground. Cool, slightly blue-violet at its deepest.
- **Teal** `#041418 → #15594A` — navy rotated toward green. It appears *only* inside gradients and glows, never as a flat fill.
- **Emerald** `#0E5A3C → #D9FAEB` — the single action colour. Every button, focus ring, active tab, glow, medallion and success state. `--accent` is `green-500` `#1AA36B`.
- **Bronze** `#7E5A3E → #F0DDC5` — emphasis only: the accent word in a headline, stat numerals, process numbers. **Never a button, never a surface, never a border.**
- **Ink** — green-tinted neutrals for text and light cards. Never a pure grey; `#7A908D`, not `#808080`.

Status reuses the family: success *is* emerald, warning shares bronze's hue (`#D9A441`). Only danger `#E0544A` and info `#3E9BD4` are outsiders, and they appear in `Alert` only.

Reach for semantic aliases (`--surface-card`, `--text-muted`, `--accent`), not the raw ramps.

### Backgrounds

Never a flat colour. The page ground is `--grad-page`: a radial teal-green bloom sitting off-centre at roughly 22%/38% over a navy field, darkening to `#040F24` at the edges. Over that sits an almost-invisible vertical mesh (`--grad-mesh-line`, 64px pitch, ~16% emerald, masked to fade top and bottom) that reads as technical texture rather than a grid.

There are **no photographs in this system** — none were supplied. Where the reference used a desk environment, the UI kit renders the same depth in CSS. When real photography arrives it should be cool-leaning, low-saturation, green-cast and darkened under `--grad-scrim-bottom` so white type clears 4.5:1; no warm or grainy treatments.

### Type

**Display — Montserrat.** 800 weight, `-0.022em` tracking, `1.04` leading. Hero and section titles only. The italic kicker is Montserrat 300 italic.
**Body / UI — Mulish.** 300–800. All running copy, labels, buttons, form text.
**Numerals — Montserrat 800** in bronze, `-0.02em`.
**Mono — JetBrains Mono**, for token names and code only.

Scale: display 84 / 62 / 44 (clamped), headings 38 / 30 / 23 / 19, body lead 20 / 17 / 15 / 13.5 / 12, all body at `1.62` leading.

> **Type substitution — please confirm.** The source is a raster image with no font files. Montserrat and Mulish are the nearest Google Fonts matches to the geometric display and humanist body faces visible in it, and they load from Google Fonts rather than bundled binaries. **If mitec.team licenses different faces, send the files and this is a one-file change (`tokens/fonts.css` + `--font-display` / `--font-body`).**

### Spacing and layout

4-based to 24px, then 32 / 40 / 48 / 64 / 80 / 96 / 128. Container 1200px, narrow column 760px, 24px gutter, section padding `clamp(64px, 8vw, 128px)`. Card padding 24px (32px for large cards). Controls 11px × 20px.

Layout rule: content is centre-aligned on the home page (hero, section headings, keyword rail) and left-aligned on inner pages. Feature rows run four across, case-study grids three across. The nav is the only fixed element — `position: sticky`, translucent, blurred.

### Corner radii

Cards 20px. Media and inner panels 14px. Inputs and selects 10px. Checkboxes 6px. **Actions and badges are full pills** (999px) — a pill always means "you can press this". Icon buttons and medallions are perfect circles. Nothing in the system uses a square corner.

### Cards

One radius (20px), a **1px hairline** at 8% white, `--grad-glass` (8.5% → 1% white) and an inset top highlight at 10% white. No drop shadow on dark grounds — depth comes from the hairline and the glow. Four skins:

- `glass` — the default on dark.
- `ivory` — a light card on the dark ground, `--grad-ivory`, 60%-white border, `--shadow-ivory` (the only real drop shadow in the system). It sets `.mt-on-light`, which re-points every text token.
- `emerald` — `--grad-emerald-card` plus `--glow-md`. **Exactly one per row**, marking the featured or active item. This is the reference's signature move: three pale cards and one lit one.
- `solid` — opaque navy panel for dense UI.

### Elevation, glow and blur

On dark, **elevation reads as emerald glow**, not shadow: `--glow-sm/md/lg` at 22% / 30% / 26% alpha. Drop shadows (`--shadow-md/lg`) exist for ivory cards and tooltips only. Blur is used in exactly two places: glass surfaces at 18px, and the sticky nav scrim at 40px. Never blur text, never blur a whole section.

### Borders

Hairlines, always. `--border-hairline` 8% white is the default; `--border-subtle` 14% for controls; `--border-strong` 26% on hover; `--border-accent` (emerald 45%) for focus, active and the emerald card. On light surfaces the same ladder inverts to ink alphas. **No 2px borders. No coloured left-border-only cards** — that pattern is explicitly banned; `Alert` uses a full tinted border instead.

### Dividers

There is only one rule in the system: `--grad-rule`, an emerald hairline that fades to zero at both ends, optionally beaded with a glowing 5px node. Never a flat grey line.

### Motion

`--dur` 220ms, `--ease-out` `cubic-bezier(.22,.61,.36,1)`. Fast interactions 140ms, entrances 420ms with `--ease-entrance`. Nothing bounces, nothing overshoots, nothing spins. Cross-fades and 2px translations only.

- **Hover:** cards lift `-2px` and their border warms to emerald; the glow steps from `sm` to `md`. Buttons brighten their gradient rather than darkening. Ghost and text items gain a faint glass ground. Never an opacity fade on hover — that reads as "disabled".
- **Press:** `scale(0.97)`, 140ms, no colour change.
- **Focus:** `--ring-focus`, a 3px emerald halo at 35%. Always visible, never removed.
- **Disabled:** `opacity: 0.42`, `cursor: not-allowed`, no other change.

`prefers-reduced-motion` zeroes every duration token at the `:root` level, so respecting it is automatic.

### Transparency

Transparency is structural, not decorative: glass surfaces (white at 2–8%), the nav scrim (navy at 72%), status tints (12–14%) and the sunken input ground (navy at 55%). Body text is **never** set at reduced opacity — muted text uses `--text-muted`, a real colour, so contrast stays measurable.

---

## 5. Contrast

`--text-body` `#C2D2CE` on `--bg-page` `#06142D` ≈ 10.5:1. `--text-muted` `#7A908D` ≈ 4.6:1 — it is the floor, and it is for captions and hints only, never running copy. White on `--accent` `#1AA36B` ≈ 3.5:1, which clears the 3:1 bar for the bold ≥15px button labels this system uses and nothing smaller. Bronze `--gold-400` on navy ≈ 7.4:1.

---

## 6. Iconography

**Lucide**, 2px monoline, loaded from `https://cdn.jsdelivr.net/npm/lucide-static@0.544.0/icons/<name>.svg`.

> **Icon substitution — flagged.** No icon set was supplied. The reference's glyphs are filled-circle pictograms from a stock library. Lucide is the closest CDN-available match in weight and construction; it is monoline where the reference was filled, which is the one deliberate divergence. If mitec.team has its own set, drop the SVGs into `assets/icons/` and repoint `Icon`.

**How icons are drawn.** The `Icon` component applies the SVG as a CSS `mask-image` with `background-color: currentColor`. That means an icon always inherits its parent's colour and you never inline SVG markup. **Do not hand-write SVG paths anywhere in this system**, and do not use emoji or Unicode characters (▸ ✓ ★) as icons.

**Sizes.** 16 inline with text · 20 default and in nav · 22 inside a 48px medallion · 26 in specimen displays.

**The medallion.** The brand's one icon container: a 44–48px perfect circle filled with `--grad-accent`, white glyph, `--glow-sm`. It appears on every feature and service card.

**Vocabulary in use.** `layout-dashboard` (design), `trending-up` (growth), `shopping-cart` (commerce), `headset` (support), `shield-check` (security), `bar-chart-3` (analytics), `arrow-right` (every CTA), `arrow-up-right` (external/case study), `play` (video), `chevron-right` (breadcrumb, never a slash), `chevron-down` (select), `check` (checkbox), `mail` / `phone` / `map-pin` / `clock` / `calendar` (contact), `user` / `building-2` (form fields).

**No brand logos are bundled.** The reference shows Google, Microsoft, Slack and Dropbox marks; those are other companies' trademarks. `LogoStrip` typesets client names in Montserrat 600 instead.

---

## 7. Components

| Group | Components |
| --- | --- |
| `core` | `Button` `IconButton` `Badge` `Card` `Logo` `Icon` |
| `content` | `SectionHeading` `StatBlock` `StatBar` `FeatureCard` `LogoStrip` `GlowRule` `KeywordRail` |
| `forms` | `Field` `Input` `Select` `Checkbox` `Radio` `Switch` |
| `navigation` | `NavBar` `Tabs` `Breadcrumb` |
| `feedback` | `Alert` `Tooltip` `ProgressDots` |

Consume from `window.MitecDesignSystem_43d123`. Each has a `.prompt.md` with a usage example and its rules.

### Intentional additions

No source defined a component inventory, so a standard set was authored. Everything in `core` and `content` traces directly to something visible in the reference. These are the ones that do not, with the reason:

- **`Icon`** — a wrapper for the Lucide glyph set, so no one ever inlines an SVG.
- **`Field`** — the label/hint/error wrapper every form control needs; the reference had no form.
- **`Select` / `Checkbox` / `Radio` / `Switch`** — no form appears in the reference, but a studio site cannot ship without an enquiry form.
- **`Breadcrumb` / `Tabs`** — inner-page navigation the single-page reference had no occasion to show.
- **`Alert` / `Tooltip`** — feedback surfaces, same reason.

### Templates

`templates/landing-page/` — **Landing page**. The full marketing page as a Design Component: glass nav, bronze-emphasis hero, four service tiles with one emerald highlight, stat rail, keyword rail, emerald CTA card and footer. This is the starting point consuming projects pick from.

---

## 8. UI kits

**`ui_kits/marketing-site/`** — the public site, four click-through screens (Home, Services, Portfolio, Contact) composed entirely from the components above. See its own README for what interacts and what was deliberately left out.

Only one product surface exists in the source material. No app, dashboard, docs site or slide template was provided, so none were invented.

---

## 9. Open questions for the brand owner

1. **Is the reference image actually mitec.team's direction, or a mood board?** It is a stock comp for a different brand name.
2. **Logo** — none supplied. `Logo` is a typographic placeholder.
3. **Fonts** — Montserrat / Mulish are substitutions.
4. **Icons** — Lucide is a substitution.
5. **Photography** — none supplied; all grounds are CSS.
6. **Copy** — all UI-kit copy is written to the tone rules, not lifted from the real site.
