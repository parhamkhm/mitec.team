// Prices an order on the server, with the same code the site quotes with:
// the front end's fromApiPricing() (normalisation) and estimate() (the
// formula). Importing them rather than re-implementing means the team sees
// exactly what the customer saw; test/contract.test.mjs already relies on the
// same imports. (These files have no package.json of their own; Node >= 22
// detects them as ES modules.)
import { fromApiPricing } from '../../../project/src/api/mapper.js';
import { estimate } from '../../../project/src/utils/estimate.js';
import { getLatestPricing, getPricingVersion } from '../db/pricingRepo.js';

// Returns { pricingVersion, quote } for a validated order.
//
// The order is priced against the version it names. If that version doesn't
// exist (it never should: versions are never deleted), the order is still
// accepted and priced against the current version, with the version it asked
// for kept as requested_version — an estimate is not worth losing an order.
export async function quoteOrder(order, client) {
  const requested = order.pricing_version;
  let doc = requested != null ? await getPricingVersion(requested, client) : null;
  const fellBack = !doc;
  if (!doc) doc = await getLatestPricing(client);
  if (!doc) return { pricingVersion: requested, quote: null };

  const pricing = fromApiPricing(doc);
  const est = estimate(pricing, { siteTypeId: order.site_type, pages: order.pages, addonIds: order.addons });
  // estimate() returns no lines for an unknown or inactive site type
  // (e.g. "unsure"): nothing to quote.
  if (est.lines.length === 0) return { pricingVersion: pricing.version, quote: null };

  return {
    pricingVersion: pricing.version,
    quote: {
      pricing_version: pricing.version,
      ...(fellBack && requested != null ? { requested_version: requested } : {}),
      price: est.price,
      days: est.days,
      pages: est.pages,
      lines: est.lines,
      currency_unit: pricing.currency.unit,
      placeholder: pricing.placeholder
    }
  };
}
