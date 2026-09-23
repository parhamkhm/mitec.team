# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two roughly-equal audiences, both Iranian: (1) small businesses that don't yet have a professional website, and (2) individuals or small teams who need a custom online service or tool built (not just a marketing site). Both groups come to mitec via the order builder, describing what they actually need rather than picking a fixed package.

## Product Purpose

mitec designs, builds, and supports websites and custom online services for clients in Iran. The site itself is the studio's portfolio and the entry point into an order-builder wizard that scopes each engagement to the client's real need, plus an order-tracking flow for work in progress.

## Positioning

Every engagement gets a design built specifically for that client's need — not a template or fixed package — combined with direct, unmediated access to the two people who actually build and support it (no account manager, no outsourcing). The order builder is the mechanism that makes per-client custom scoping practical instead of a sales-call luxury.

## Operating Context

- The order builder wizard (`Mitec Order Builder.dc.html` → `/order`, `/order/success`) is how clients describe their needs and place an order.
- Order tracking (`Mitec Track.dc.html` → `/track`) lets clients check status on an existing order; requires a phone number (`TRACK_REQUIRES_PHONE: true`).
- The backend is being built by a teammate; the frontend talks to it only through `src/api/client.js` / `mapper.js`, currently mocked (`USE_MOCK: true`).
- Pricing is intentionally not shown (`showPrice: false`) at this stage — not in the wizard summary, and not in the home page's quick scope, where no price element exists at all while the flag is off.
- The home page's quick scope is a front door to the order builder: it reads the same catalog (`getCatalog()`), quotes the timeline with the same `src/utils/estimate.js` the builder will import, and hands the choice over in the builder's own saved state (`localStorage['mitec.order.v1']`, shape `{ selection, step, unsure }`).
- Contact channels: WhatsApp, Telegram, Instagram (placeholder values in `app.config.js`, not yet real).

## Capabilities and Constraints

- Four pages: Home (implemented, `index.html`), Order Builder, Track, 404 — the latter three exist only as `.dc.html` design prototypes, not yet built, so every `./order/` and `./track/` link on the home page 404s until they are. The `.dc.html` files are old prototypes, not a visual source; DESIGN.md is.
- Home, in order: a scroll-driven "portal" hero (a forest scene with a laptop; scrolling dives into its screen, past a short intro statement, into the light Proof room with the real stats), Work (three project rows), Testimonials (sample, labelled), Services, Process, About, Quick scope (site type + features → approximate timeline, then on to the order builder), FAQ, closing CTA.
- Motion is an enhancement, never a requirement: it runs only when the visitor has not asked for reduced motion, and without it (or without JS) the page is the complete static document (DESIGN.md §13). No animation library, no WebGL — a small vanilla engine in `src/scripts/motion/`.
- The visual system is defined by DESIGN.md at the repo root: a light sage canvas with deep-forest bands, one action green, and amber as a rare highlight. It replaced the original navy/emerald Mitec Design System, whose colour, gradient and elevation files are no longer imported; only its spacing, radii and motion scales remain. Vazirmatn still replaces Montserrat/Mulish (no Persian glyphs), and `direction: ltr` still keeps the Latin-built logo from flipping in RTL.
- No build step; ES modules served over HTTP (not `file://`).
- Persian language and RTL layout are load-bearing, not optional. The theme is light-first: forest green appears only as bands, media tiles and the footer.
- Team size (2 people) and directness of access are facts the design/copy should keep truthful, not inflate.

## Brand Commitments

- Name: mitec (styled "mitec team" in places).
- Persian, RTL, Vazirmatn typography — binding. The palette must match the studio's Instagram presence (forest `#12312A`, mint `#57B79A`, amber `#E0A25C`); navy and blue are excluded outright.
- DESIGN.md is the visual authority; components read its semantic `--color-*` tokens and never raw hex.
- Team: Parham Movahedi (UI/frontend), Sina Alipour (backend/infrastructure) — named, real people, currently placeholder photos.

## Evidence on Hand

- Real stats (`src/data/site-copy.json`): 3 delivered projects, 2-person team with no middleman, 1 business day response time. No invented numbers are permitted here — the file's own note says so.
- `src/data/testimonials.json` is currently sample content and is labeled as such in the UI; not real testimonials yet.
- Team photos are placeholders pending real photos.
- Contact info (WhatsApp number, Telegram, Instagram) in `app.config.js` is placeholder/TODO, not the real accounts yet.

## Product Principles

1. Design to the specific client's need, every time — no visible templating or fixed packages.
2. Keep the "two people, no middleman" promise legible and truthful in both copy and interaction (e.g. direct contact channels, no fake team scale).
3. Never fabricate proof — stats, testimonials, and numbers must stay real or explicitly marked as placeholder/sample.
4. Persian and RTL fidelity is a correctness requirement, not a stylistic option — including Persian numerals in all user-facing figures.
5. The order builder and tracker are functional tools, not marketing decoration — they must stay usable end to end as pages are built out.
