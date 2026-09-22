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
- Pricing is intentionally not shown in the wizard summary (`showPrice: false`) at this stage.
- Contact channels: WhatsApp, Telegram, Instagram (placeholder values in `app.config.js`, not yet real).

## Capabilities and Constraints

- Four pages: Home (implemented, `index.html`), Order Builder, Track, 404 — the latter three exist only as `.dc.html` design prototypes, not yet built.
- Built on the Mitec Design System (`_ds/`) with three documented, intentional deviations: Vazirmatn replaces Montserrat/Mulish (no Persian glyphs), a `direction: ltr` override keeps the Latin-built logo from flipping in RTL, and action-colored text uses a darker green ramp (`green-700 → green-600`) to clear WCAG 4.5:1 contrast that the base accent gradient fails at button-label sizes.
- No build step; ES modules served over HTTP (not `file://`).
- Persian language, RTL layout, dark theme — these are load-bearing, not optional.
- Team size (2 people) and directness of access are facts the design/copy should keep truthful, not inflate.

## Brand Commitments

- Name: mitec (styled "mitec team" in places).
- Persian, RTL, dark theme, Vazirmatn typography — binding.
- Mitec Design System is the visual reference system; component and token usage should stay traceable to it.
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
4. Persian/RTL/dark-theme fidelity is a correctness requirement, not a stylistic option.
5. The order builder and tracker are functional tools, not marketing decoration — they must stay usable end to end as pages are built out.
