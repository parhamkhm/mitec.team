# Impeccable pass — Phase 2, batch 3: the phone nav and the direct-message path

**Closed:** HE1, MO1 and A3 (phone nav, with the owner's toggle change); FC1, AB2, SV2 and FC4 (direct messages);
PW1, rechecked and closed without adding a button.

| Commit | IDs |
|---|---|
| `impeccable(adapt): nav — phone bar with «شروع پروژه» and the toggle at the end edge; the menu opens from it` | HE1, MO1, A3, toggle change |
| `impeccable(layout): direct messages — the closing band's tiers, a pair in About, channels in the footer` | FC1, AB2, SV2, FC4 |

The batch 2 follow-ups went in before this batch: `3d02397` and `925fcf0`, recorded in `13-batch-2.md`.

## The phone and tablet nav (up to 860px)

- **The bar**, right to left: the logo at the start edge; flexible space; a tonal `btn--sm` «شروع پروژه»; the 44px
  menu toggle at the left edge.
  - The button is always there, so a way to start a project is never out of sight. It is tonal, so the page keeps
    one primary.
  - Measured gaps (logo ↔ button, button ↔ toggle): 320: 31 / 8px, 360: 49 / 8, 390: 79 / 8, 768: 457 / 8. Nothing
    overlaps or wraps, and nothing scrolls sideways.
  - At 320 the bar has 272px between its gutters. The logo (87), the button (124 with its arrow) and the toggle
    (44) would leave 17px for both gaps, so below 360px the button drops its arrow.
- **The menu** hangs from the bar's end side, 24px from the left edge. It is full width between the gutters on
  phones (342px at 390) and 400px at 768, the most it gets.
  - It grows out of its top-left corner (`transform-origin: 0 0`): scale .96 → 1 with opacity, `--dur` in and
    `--dur-fast` out. Under reduced motion it appears at once.
  - It ends with the channels pair.
- **A3, checked at 390 and 768:**
  - Open, the toggle has `aria-expanded="true"`, the label «بستن فهرست» and the × icon. The skip link, the logo,
    the bar's button, `main` and the footer are `inert`.
  - Tab runs خانه → … → تماس → پیام در واتساپ → پیام در تلگرام → the toggle. Shift+Tab from the toggle goes to
    the last item.
  - Escape closes the menu, restores the label and icon, removes `inert` and puts focus back on the toggle.
  - A tap outside closes it and activates nothing underneath (the page stayed at the top).
  - Choosing «درباره‌ی ما» closes it and lands on `#about`.
- **Desktop from 861px is unchanged:** every nav box is where it was in batch 2.
- **Without JS** the toggle (which could do nothing) is hidden. The bar keeps the logo and «شروع پروژه».

## Direct messages

The owner's three tiers, applied wherever a direct message is offered and written into DESIGN.md §5 as one recipe:

| Tier | Element |
|---|---|
| 1 | «شروع پروژه», the one primary button |
| 2 | «پیام در واتساپ» and «پیام در تلگرام», tonal `btn--md` with their icons, the same size as each other |
| 3 | «پیگیری سفارش» and Instagram, plain text links |

- **FC1, the closing band:** the primary alone in its row. Inside the screen, the pair under its lead-in «یا مستقیم
  پیام بدهید:», then «پیگیری سفارش» and «اینستاگرام» as underlined text links. The outline «پیگیری سفارش» button and
  the full-width hairline are gone.
- **AB2:** under the About cards, «مستقیم با خود تیم حرف بزنید» and the pair.
- **SV2:** Services' «بپرسید» now points to `#channels`, the closing band's pair, and lands clear of the fixed nav.
- **FC4:** the footer loses «شروع پروژه» and «پیگیری سفارش» and gets the three channels as small icon + text links.
  Its double gutter is gone: the content is inset 24px at 320, 390 and 768 (it was 48 at 390).
- **Icons:** Lucide `message-circle` (WhatsApp), `send` (Telegram) and `instagram`, from the approved
  lucide-static@0.544.0, added to the inline sprite. Lucide has no brand logos, so these are the nearest glyphs.
- **Addresses:** every channel link takes its address from `src/config/app.config.js` (`contact`), so a real
  number set there reaches all 10 links. The markup carries the same addresses for visitors without JS.
- **Side by side or stacked:** «پیام در واتساپ» needs 164px at `btn--md` (Telegram 154), so two equal buttons need
  about 341px.

  | Where | 320 | 390 | 768 | 1440 |
  |---|---|---|---|---|
  | Phone menu | stacked | stacked | side by side | (no menu) |
  | About | stacked | stacked | side by side | side by side |
  | Closing band | stacked | stacked | side by side | side by side |

  - At 390 the About band has 342px, the closing band 310 and the menu 308. Side by side there would sit within a
    pixel of wrapping, and would flip as the font swaps.
  - Stacked, both buttons are full width, so they are still the same size.

## PW1, rechecked

On phones and tablets the bar's «شروع پروژه» is fixed and visible at every scroll position, including across Proof
and Work (checked at 320, 360, 390, 768 and 860). A way to start a project is therefore always one tap away, so PW1
is closed without adding a button to Work, as decided.

## Load (Slow 4G, 4× CPU on the phone)

Before is `925fcf0` (just before this batch), after is this batch. Keep-alive server, interleaved runs, medians.

| | FCP | LCP | DCL | CLS |
|---|---|---|---|---|
| Phone 390, before (6 rounds) | 2698 | 2776 | 5909 | 0.0007 |
| Phone 390, after | 2718 | 2738 | 5953 | 0.0006 |
| Desktop 1440, before (5 rounds) | 2220 | 2220 | 5009 | 0.0052 |
| Desktop 1440, after | 2228 | 2228 | 5029 | 0.0053 |

No measurable cost: every difference is within the ±200 ms run-to-run noise. The LCP element is the H1 throughout,
and the console stayed clean.

## For the owner

- **The tonal fill is faint on the light canvas.** `--color-tonal` (green-50) on the sage canvas (sage-25) barely
  separates the About pair and the light-nav button from the page; the label and icon carry them. That is
  DESIGN.md's tonal as specified, so it is not changed here. A 1px `--color-tonal-hover` edge, like the hero's
  eyebrow pill, would outline them if wanted.
- **Brand logos:** WhatsApp and Telegram use Lucide's generic chat bubble and paper plane. Real brand marks would
  need a new icon source.

## Screenshots

`docs/impeccable/shots/` (on disk, not in git), at 320, 390, 768 and 1440, before (`b3-before-*`, batch 2) and
after (`b3-after-*`):
- `-top`: the first view with the bar;
- `-menu`: the open menu (phones and tablet only);
- `-work`: mid-Work, where the bar's button covers PW1;
- `-about`: centred on the pair;
- `-contact`: the closing band;
- `-footer`.
