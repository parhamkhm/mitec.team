# Impeccable pass — guardrails + run order

Paste **section A** at the start of the Claude Code session, before any `/impeccable` command. Then run the commands in **section B** one at a time.

---

## A. Guardrails (paste once, first message of the session)

```
We are about to run an Impeccable design pass on the mitec.team front end. Rules for this whole session:

Context
- Product context: PRODUCT.md (root). Visual system: DESIGN.md (root). DESIGN.md is the source of truth; its rules were decided on purpose. When an Impeccable recommendation conflicts with DESIGN.md, do NOT apply it: list it under "Conflicts with DESIGN.md" in your report so the owner can decide.
- Audience: Iranian small/medium business owners (cafés, shops, clinics, companies). The site is Persian-first, RTL. Main goal: start a project («شروع پروژه» → سفارش‌ساز).

Hard constraints (never break)
- Static HTML + vanilla ES modules + plain CSS, no build step. No React/Tailwind/npm packages/new fonts/CDNs.
- Semantic --color-* tokens only; primitives live in tokens.css. No new hex in component CSS. data-surface="dark" remaps tokens.
- Palette: forest / CTA green / mint / sage, amber only as a rare highlight. No blue/navy in our UI (client screenshots excepted).
- One solid primary button per viewport. CTA green only on clickable things.
- Persian: Vazirmatn, Persian digits, letter-spacing 0, never split Persian words into letters, correct ZWNJ (نیم‌فاصله).
- Motion: transform/opacity only, through the existing engine (src/scripts/motion/*). Full prefers-reduced-motion and no-JS fallbacks.
- Do not change the approved choreography of the portal hero, the Work coverflow logic, or pricing data/estimate.js unless a finding is a real bug (P0/P1).
- Copy text is final (docs/copy-final.md). Flag copy issues; do not rewrite copy.

Workflow
- Branch: design/impeccable-pass, created from copy/final-pass (pull first; merge main in if it has new commits; no rebase, no force). Never push.
- Evaluate commands (critique/audit) change nothing. Save each report to docs/impeccable/<nn>-<command>-<target>.md.
- Refine commands: one command + one target per commit, message "impeccable(<command>): <target> — <summary>". Before/after screenshots at 1440 and 390 into docs/impeccable/shots/.
- Serve with `python devserver.py 4173` and inspect the rendered page in the browser (desktop 1440, laptop 1280×800, tablet 768, phone 390), not only the source.
- After each command, stop and wait for me.
```

---

## B. Run order

### Phase 0: setup
1. `/impeccable init`
   - PRODUCT.md already exists: **update, don't rewrite**. Answer its questions with the audience/goal above.
   - Do **not** run `document` now; it would rewrite DESIGN.md.

### Phase 1: diagnose (no code changes)

2. `/impeccable audit the home page (index.html) at 1440, 1280×800, 768 and 390`
3. Critique each section separately. Section-level critique is deeper than "the whole site".
   - `/impeccable critique the portal hero (first screen + scroll dive)`
   - `/impeccable critique the Proof stats and the Work coverflow section`
   - `/impeccable critique the Services section`
   - `/impeccable critique the Process section`
   - `/impeccable critique the About section`
   - `/impeccable critique the pricing calculator (#scope)`
   - `/impeccable critique the FAQ, closing CTA band and footer`
   - `/impeccable critique the mobile experience of the whole home page at 390px`

→ **Send the reports in `docs/impeccable/` to me.** I'll triage them:
- what is a real problem;
- what conflicts with deliberate brand decisions;
- in what order to fix.

### Phase 2: fix (only the triaged items, one per commit)

Typical order:
4. `harden` / `adapt` / `optimize` for the audit's P0 and P1 items (accessibility, responsive, performance).
5. `typeset` (whole page): Persian heading scale, line lengths, line-height. Check letter-spacing stays 0.
6. `layout` / `distill` / `quieter` only on the sections the critique marked as busy or unbalanced (probably pricing and Services).
7. `clarify` where the critique found confusing wording or UI. It flags only; copy changes go through the owner.
8. `animate` only if the critique found missing feedback states (hover/focus/press). Use the existing engine; no new scroll choreography.

### Phase 3: finish
9. `/impeccable polish the home page`: the final detail pass.
10. `/impeccable audit` again. Compare its scores with the first audit in a table.
11. `/impeccable document`: merge any new decisions into the existing DESIGN.md. Show the diff before committing; never drop existing rules.
12. Optional: `/impeccable hooks on`, so the detector checks future edits.

### Avoid on this project
- `bolder`, `overdrive`, `delight`, `colorize` on the whole site. They push generic "more" and fight the calm brand. Use them only on one element, and only if the critique asks for it.
- `generate` / `shape`: the design is already decided.
- Running any refine command on "the whole site" in one go.
