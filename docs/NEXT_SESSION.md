# Next session — start here

Stopped on 2026-09-24. `feature/portal-hero` is fast-forwarded into `main` locally: both point at the same commit, the
one that adds this file.

**Not on GitHub yet.** Pushing failed because GitHub rejected both the HTTPS token and the SSH key: the
`gh auth login` in the terminal never finished its browser step. Once signed in, run from the repository root:

```bash
gh auth login -h github.com
```

```bash
git fetch origin
```

```bash
git push origin main
```

```bash
git push -u origin feature/portal-hero
```

```bash
git push --tags
```

`origin/main` had no new commits at the last fetch, so the push is a plain fast-forward. Never force-push.

---

## Read these first, in this order

1. `docs/NEXT_SESSION.md` — this file.
2. `docs/prompts/README.md` — which spec overrides which, and what is frozen.
3. `DESIGN.md` — the visual authority (tokens, recipes, §10 contrast, §13 motion).
4. `PRODUCT.md` — the product brief and constraints.
5. `project/README.md` — how the front end is built, run and structured; open tasks.
6. `docs/DEMO_REPORT.md` — the last build's tour, decisions made for the owner, the §18 results, open questions (§6).
7. For the work you pick up next:
   - **Copy pass:** `docs/copy-todo.md`.
   - **Pricing numbers:** `docs/pricing-guide.md` and `docs/pricing.schema.json`.
   - **`/order` and `/track`:** `project/API_CONTRACT.md` and `project/src/api/*`.
   - **The back end:** `server/README.md` — how to run it and what it decided.
8. The specs, for history and for what not to undo:
   - `docs/prompts/CLAUDE_CODE_MASTER_PROMPT.md`
   - `docs/prompts/CLAUDE_CODE_PROMPT_V2_LAPTOP.md`
   - `docs/prompts/CLAUDE_CODE_PROMPT_V3_PRICING.md`
   - `docs/prompts/CLAUDE_CODE_PROMPT_V4_PRICING_LAYOUT.md`

Run the site with `python devserver.py 4173` from the repository root, then open <http://127.0.0.1:4173/>.

---

## Done

- **Master prompt, phases 0–7:**
  - motion engine;
  - portal hero and Proof room;
  - Work, Testimonials, Services, Process, About, FAQ and CTA band;
  - Quick scope;
  - docs;
  - QA against §18.
- **V2:** the hero as a laptop, with the intro statement on its screen.
- **Process:** scroll-linked step fill and one forest "spotlight" step.
- **V3:** the pricing calculator, driven by one pricing document (`project/src/config/pricing.json`). It covers prices
  and working days, a page slider and add-ons, with a shared `estimate()`, a schema, an owner's guide and a proposed
  admin contract.
- **V4:** the calculator's count-proof layout: a sticky summary card, equal add-on tiles and a bottom bar on small
  screens.
- **Phases 6 and 7 re-run on the current build.** All 14 §18 checks pass. Two fixes came out of the QA: FAQ answers
  readable without JS, and icons visible in forced colours.

Checkpoint tags (local until pushed): `checkpoint/v4-layout`, `checkpoint/phase-6`, `checkpoint/phase-7`.

**Frozen — change only with the owner's go-ahead:**
- the hero;
- the laptop;
- the intro statement;
- the motion engine;
- the Process spotlight;
- the pricing data model.

---

## Left to do

There are **no remaining phases** in the master prompt or in V2–V4. What is left, roughly in order of value:

1. **Owner review.** Go through `docs/DEMO_REPORT.md` §6 with the owner: the JS budget, the intro statement's register,
   «از» on the total, the phone bar, and the 768–1023 checklist columns.
2. **Real pricing numbers.** Every price and duration in `project/src/config/pricing.json` is a placeholder; the full
   list is in `docs/DEMO_REPORT.md` §8. So are the add-ons each site type offers, and six add-on descriptions. When the
   owner has filled them in, set `"placeholder": false`: the «اعداد نمونه» badge disappears. No code changes are needed.
3. **Copy and translation pass.** Work through `docs/copy-todo.md`: the calculator's labels, the FAQ's week ranges that
   contradict the calculator, one name for the order builder, ezafe spelling, the placeholder badges, and so on.
   Nothing there has been changed yet. The intro statement is frozen, so its register needs the owner's decision.
4. **The missing pages.**
   - **`/order` and `/order/success`, the order builder.**
     - It must import `project/src/utils/estimate.js` and read the saved state
       `localStorage['mitec.order.v1'] = { selection: { siteType, pages, addons, … }, step, unsure, pricingVersion }`
       that the home calculator writes.
     - It submits through `submitOrder()` → `toApiOrder()`, which already sends `pages`, `addons` and
       `pricing_version`.
     - Its summary still hides prices while `APP_CONFIG.showPrice` is false.
   - **`/track`:** tracking by code and phone (`TRACK_REQUIRES_PHONE: true`).
   - **404 page.**

   The `.dc.html` files are old prototypes for these pages. They are useful for flow, but they are not a visual source
   and must not be edited; DESIGN.md is the visual source. Until the pages exist, every `./order/` and `./track/` link
   returns 404.
5. **Before launch:**
   - make the fonts (Google Fonts) and icons (jsDelivr) local, because of access from Iran;
   - replace the placeholder images, testimonials and contact links (WhatsApp, Telegram, Instagram);
   - add a favicon;
   - deploy the back end and point the front end at it (see below).

---

## The back end

`server/` implements every endpoint `project/API_CONTRACT.md` proposed — Node.js + Express + PostgreSQL.
Setup, the route map and the decisions behind it are in **`server/README.md`**.

Nothing in the front end has been changed for it. To run the two together, edit
`project/src/config/app.config.js`: set `USE_MOCK: false` and point `API_BASE_URL` at the service
(`http://127.0.0.1:4000` locally). The `endpoints` paths already match, and `mapper.js` needs no edits —
that was checked by running live responses through the front end's own `mapper.js` and `estimate.js`.

Still to do on the back end:

- a real PostgreSQL instance and a filled-in `.env` for production (locally it runs in Docker);
- HTTPS in front of it, with `COOKIE_SECURE=true` so the admin cookie is safe;
- real `SMTP_*` and `MAIL_TO` values — without them new orders are still saved, but the team is only
  notified in the server log;
- the admin panel's UI. The API it needs is already there and versioned: `GET`/`PUT /admin/pricing`
  reject a stale save with `409` and the current version, and every saved version is kept, so an order's
  `pricing_version` can always be resolved back to the numbers the customer actually saw.

Note that `server/` holds the **live** pricing document once it is running: `GET /pricing` serves the
newest row in `pricing_versions`, seeded from `project/src/config/pricing.json`. After that, prices are
edited through the admin API, not by editing the JSON file.

## Working rules the owner has set

- **Commits and publishing:**
  - one commit per step, with a clear message, on a feature branch;
  - push or merge only when asked;
  - never force-push or rewrite history;
  - when publishing, fetch first and merge a moved `origin/main` into the feature branch first;
  - stop on unclear conflicts.
- **What not to commit:** generated files (screenshots, caches, `.impeccable/live` sessions, `Claude outputs/`); add
  them to `.gitignore` instead.
- **Before a push:** serve the site, load the home page, confirm the console is clean and every section renders.
- **Code style:**
  - semantic `--color-*` tokens only, no new hex outside `tokens.css`;
  - one primary button per viewport;
  - action green only on clickable things;
  - Persian digits;
  - letter-spacing 0 on Persian text.
