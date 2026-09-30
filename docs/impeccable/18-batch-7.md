# Impeccable pass — Phase 2, batch 7: typeset

**Closed:** HE5, PW3, SV3, AB1, MO3, PR5, the Process subheading widow and the closing heading's «از / همین‌جا»
split. Before them, one commit carried the owner's follow-ups on batch 6.

| Commit | Closes |
|---|---|
| `impeccable(harden): batch 6 follow-ups — stacked Process cards change in one step; the widened row keeps a 24px gutter; «عکس» hidden from screen readers` | the follow-ups |
| `impeccable(typeset): process — numerals at .55 when dimmed (3:1 for large text), proportional figures (PR5)` | PR5 |
| `impeccable(typeset): about — the title on the H2 scale (display-3, 700), each line one line from 1024px (AB1)` | AB1 |
| `impeccable(typeset): proof — «۱» leads with a smaller «روز کاری»; the stats as rows on phones; labels balanced (PW3)` | PW3 |
| `impeccable(typeset): line breaks — headings and subs balanced, function words tied, phone subs at 18px, «از همین‌جا» one unit (HE5, SV3, MO3, the Process sub, the CTA heading)` | HE5, SV3, MO3, the widow, the split |
| `impeccable(typeset): hero — the sub's function words untied (they made the font swap move it)` | a CLS guard (below) |

## The owner's follow-ups on batch 6

- **PR1's ~40ms and the services' unselectable text:** accepted as they are.
- **Stacked Process (below 1200px) changes in one step too.** Each card fills, lights and eases in over
  `--dur-slow` when the rail head reaches its middle, and reverses at the same mark when scrolling back. The rail
  still fills continuously. Over 30 scroll positions each at 1024, 1100, 768 and 390, from the list's arrival to its
  end:
  - no card part-filled at rest, at any position;
  - the lit card was always the last one whose middle the reading line had passed.
- **The widened row keeps its gutter.** `#process` is a size container, and the row is
  `min(100cqw − 2 × gutter, 1440px)`, so it measures the page without a classic scrollbar. With a 10px classic
  scrollbar the gutter is 24px each side at 1200, 1300, 1440 and 1480 (was about 16 at 1440). There is no sideways
  scroll.
- **About:** the placeholder's «عکس» is `aria-hidden`.

## How the lines are set now

- **`text-wrap: balance`** on the section titles and subs, card titles, stat labels, FAQ questions, the About title,
  the hero statement's first line and the closing heading. Paragraphs already had `pretty`.
- **Function words tied to the next word.** In those same short texts, «و»، «از»، «به»، «با»، «در»، «تا»، «بدون»،
  «یا» and «که» are joined to the word after them by a no-break space, so no line ends on one. This extends the
  owner's rule; the lone-word check is the one asked for.
  - How: `&nbsp;` in `index.html` (35 of them), and `tie()` in `src/utils/format.js` for the calculator heading,
    which comes from `pricing.json`.
  - Two exceptions:
    - the card title «CRM و سیستم‌های مدیریتی» is not tied, because the tie would leave «مدیریتی» alone on its
      last line;
    - the hero's sub is not tied, because in the first view the tied units broke differently in the fallback and
      in Vazirmatn, and the font swap moved the text (slow-phone CLS 0.0006 → 0.0014; back to 0.0006 untied).
- **Nothing breaks inside a word or across a ZWNJ.** There is no `word-break`, `overflow-wrap: anywhere` or
  hyphenation, and the audit found no word split at any width. Letter-spacing stays 0.

## The audit: every heading, sub, eyebrow, stat label and display line

58 elements at each width, motion on; the same results under reduced motion. The Work stage's cards are left out:
they are turned in 3D, so their line positions can't be read on screen, and their titles are one line where
measured by height.

| Width | 320 | 390 | 768 | 1024 | 1280 | 1440 | 1920 |
|---|---|---|---|---|---|---|---|
| One-word last line, before → after | 13 → 1 | 7 → 0 | 1 → 0 | 2 → 0 | 1 → 0 | 1 → 0 | 1 → 0 |
| A line ending on a function word, before → after | 11 → 1 | 8 → 2 | 0 → 0 | 0 → 1 | 1 → 0 | 1 → 0 | 1 → 0 |
| A word split across lines | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

**Still with a one-word last line:** only «CRM و سیستم‌های مدیریتی» at 320. Beside the chip, its title column is
172px, and «سیستم‌های» and «مدیریتی» each need a line to themselves («CRM و / سیستم‌های / مدیریتی»).

**Still ending a line on a function word:**
- that title at 320, 390 and 1024 («CRM و / سیستم‌های مدیریتی»);
- the hero's sub at 390 («… CRM و / اتوماسیون، …»), untied as explained above.

## The items

- **HE5 (the statement).** From 1280px it breaks 3 + 3 words («آماده‌اید زیرساخت دیجیتال / کسب‌وکارتان را
  بسازید؟»; was 4 + 2). It is one line at 768 and 1024.
- **PW3 (Proof).**
  - «۱ روز کاری» is now the numeral and a unit (`.stat-block__unit`, `--text-h4` at 700; `unit` in
    `site-copy.json`). It never wraps (at 360 it used to break «۱ روز / کاری»).
  - Below 760px the stats are rows: numerals at `--text-h3` on the start side, labels beside them in one column.
    At 390 the labels are one line each; at 320 they balance («واسطه بین / شما و تیم»).
  - Before, at 390, «پروژه‌ی / تحویل‌شده» split and «واسطه بین شما و / تیم» ended a line on «و».
- **SV3 (Services).**
  - At 768 the H2 is «هر آنچه کسب‌وکار شما / برای رشد آنلاین لازم دارد» (was «دارد» alone).
  - At 390 the sub no longer splits «از / شروع تا رشد».
- **AB1 (About).** The title is `--text-display-3` at 700, like every section title (was 64px at 500). Each of its
  two lines is one line at every width from 320 to 1920 (was three lines, with «شما» alone, from 1279px).
- **MO3 (phones).** Section subs are 18px below 760px (were 23), so they sit under the 30px H2s.
- **PR5 (Process numerals).**
  - Dimmed at .55: 3.45:1 on white, where large text needs 3:1 (was .35, 2.06:1).
  - Proportional figures, so the narrow «۰» of «۰۱» sits close to its digit. The leading zero stays; it is in
    copy-todo.
- **The Process sub.** It breaks at its comma everywhere: «از اولین گفت‌وگو تا بعد از تحویل، / همیشه می‌دانید کار
  کجاست.» (before, «کار کجاست.» was alone at 1440, 1280 and 768).
- **The closing heading.** «از همین‌جا» is one reveal unit, so it never splits: «مسیر دیجیتال کسب‌وکارتان / را از
  همین‌جا شروع کنید» from 1024px (was «…را از / همین‌جا…» at 1280 and 1440).

## Checks

- **The sweep:** 320, 390, 768, 1024 and 1440 under motion, reduced motion, forced colours and no JS. All 20 were
  clean: no sideways scroll, no console errors, every section present.
- **Without JS**, the headings keep their balance and ties, since both are CSS and markup.

## Load (Slow 4G; 4× CPU on the phone)

Before is `9f9d434` (the follow-ups on batch 6), after is this batch. Keep-alive server, alternating runs. Medians, in
ms:

| | Phone 390, 4× CPU (9 runs) | Desktop 1440 (5 runs) |
|---|---|---|
| FCP | 3008 → 2936 | 2260 → 2264 |
| LCP | 3008 → 2936 | 2260 → 2264 |
| DCL | 6451 → 6317 | 5201 → 5215 |
| CLS | 0.0006 → 0.0006 | 0.0021 → 0.0019 |

- **The hero sub's ties first measured 0.0014 on the phone,** the same in all nine runs. The shift was attributed to
  the sub at the font swap, and with its four ties removed it was 0.0006 again in three runs. That is why the hero
  sub stays untied; the figures above are with it untied.

## For the owner

- **When editing copy in `index.html`,** keep the `&nbsp;` after function words in headings, subs and labels, and
  add one after a new «و» or «از». Text set by script goes through `tie()`.
- **«CRM و سیستم‌های مدیریتی» at 320** keeps a lone word. Only a shorter title or a smaller card-title size on the
  smallest phones would change it.
- **The Proof stat card on phones** is taller now that the stats are rows: 107 → 175px at 390, 131 → 212px at 320.

## Screenshots

All in `docs/impeccable/shots/` (gitignored, kept on disk). Before / after pairs, `b7-before-*` / `b7-after-*`:
- `proof-390`, `proof-1440`: the Proof room at the dive's end (motion on); `proof-static-320` (reduced motion);
- `statement-static-1440`: the statement's first line, 3 + 3;
- `services-head-768`, `services-head-390`: the H2 and the sub;
- `process-head-1440`: the sub broken at its comma;
- `about-head-1440`, `about-head-390`: the title on the H2 scale, two lines;
- `cta-1280`: «از همین‌جا» kept together;
- `faq-320`: the questions balanced.
