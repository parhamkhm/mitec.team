# Home-page redesign specs

The specs the home page was built from, in the order they were applied. A later spec overrides an earlier
one wherever they disagree; everything a later spec does not mention still holds. The result is described
in `DESIGN.md` (the visual authority) and `PRODUCT.md`. When they and a spec disagree, the docs describe
what was built, and that wins.

| Order | Spec | Covers | Overrides |
|---|---|---|---|
| 1 | `CLAUDE_CODE_MASTER_PROMPT.md` | The "portal" redesign: motion engine, hero, every home section, Quick scope, docs, QA (§18 checklist) | — |
| 2 | `CLAUDE_CODE_PROMPT_V2_LAPTOP.md` | The hero as a laptop, and the intro statement on its screen | Master §6.2 and §7: timeline, geometry, no roll, a laptop instead of the square portal |
| 3 | *Process spotlight* (given in chat, not saved as a file) | Scroll-linked step fill and one forest "spotlight" step in Process | Master §6.6. Documented in `DESIGN.md` §5, "Process steps" |
| 4 | `CLAUDE_CODE_PROMPT_V3_PRICING.md` | Quick scope as a price-and-duration calculator driven by one pricing document | Master §6.8 and §8: prices and working days instead of the catalog's week ranges; page slider and add-ons; data in `src/config/pricing.json` (`docs/pricing-guide.md`) |
| 5 | `CLAUDE_CODE_PROMPT_V4_PRICING_LAYOUT.md` | The calculator's layout: sticky summary card, equal add-on tiles, bottom bar on small screens | V3's layout only; V3's data model and maths are unchanged |

Approved and frozen (do not change without the owner's go-ahead): the hero, the laptop, the intro
statement, the motion engine, the Process spotlight and the pricing data model.
