// Contract test: runs live server responses through the FRONT END's own
// mapper.js and estimate.js, so a change here that would break the site fails
// in this file rather than in the browser.
//
// Needs a running server and a seeded database:
//   npm run migrate && npm run seed:pricing && npm start
//   npm run test:contract
//
// Override the target with BASE_URL=https://api.example.com npm run test:contract

import { fromApiPricing, fromApiOrder, toApiOrder } from '../../project/src/api/mapper.js';
import { estimate } from '../../project/src/utils/estimate.js';

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:4000';

let failures = 0;
const check = (label, cond, extra = '') => {
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${extra ? ' — ' + extra : ''}`);
  if (!cond) failures++;
};
const section = (t) => console.log(`\n${t}`);

const post = (path, body) =>
  fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

// A phone that is unique per run, so repeated runs never collide.
const testPhone = () => '0912' + String(Date.now()).slice(-7);

try {
  await fetch(`${BASE_URL}/health`);
} catch {
  console.error(`No server at ${BASE_URL}. Start it with \`npm start\` first.`);
  process.exit(1);
}

// -- the pricing document the UI renders ----------------------------------
section('GET /pricing through fromApiPricing()');
const pricingRaw = await (await fetch(`${BASE_URL}/pricing`)).json();
const pricing = fromApiPricing(pricingRaw);
check('normalises without throwing', !!pricing);
check('version is a whole number', Number.isInteger(pricing.version), `v${pricing.version}`);
check(
  'siteTypes present and sorted by order',
  pricing.siteTypes.length > 0 && pricing.siteTypes.every((t, i, a) => i === 0 || a[i - 1].order <= t.order),
  `${pricing.siteTypes.length} types`
);
check(
  'addons present and sorted by order',
  pricing.addons.length > 0 && pricing.addons.every((t, i, a) => i === 0 || a[i - 1].order <= t.order),
  `${pricing.addons.length} addons`
);
check(
  'every addon id a site type offers actually exists',
  pricing.siteTypes.every((t) => t.addons.every((id) => pricing.addons.some((a) => a.id === id)))
);
check('section strings survived the round trip', typeof pricing.section.title === 'string' && pricing.section.title.length > 0);
check('currency intact', !!pricing.currency.unit && pricing.currency.divisor >= 1);

// -- the shared estimate, over the server's own document ------------------
section('estimate() over the served document');
const type = pricing.siteTypes.find((t) => t.active && t.pages.enabled) || pricing.siteTypes[0];
const picked = (type.addons || []).slice(0, 2);
const pages = Math.min(type.base.pagesIncluded + 3, type.pages.max);
const est = estimate(pricing, { siteTypeId: type.id, pages, addonIds: picked });
const expectedPrice =
  type.base.price +
  Math.max(0, pages - type.base.pagesIncluded) * type.pages.pricePerExtra +
  pricing.addons.filter((a) => picked.includes(a.id)).reduce((s, a) => s + a.price, 0);
check('returns a price', typeof est.price === 'number', `price=${est.price}`);
check('returns working days', typeof est.days === 'number', `days=${est.days}`);
check('price matches the documented formula', est.price === expectedPrice, `${est.price} === ${expectedPrice}`);

// -- placing an order, using the mapper the wizard uses -------------------
section('toApiOrder() -> POST /orders -> fromApiOrder()');
const phone = testPhone();
const selection = {
  siteType: type.id,
  pages,
  addons: picked,
  pricingVersion: pricing.version,
  sections: [],
  features: [],
  color: 'green',
  font: 'vazirmatn',
  hasLogo: true,
  hasContent: false,
  business: { name: 'تست قرارداد', phone, field: 'کافه', handle: '@t', refs: '', desc: 'x' },
  uploads: []
};
const payload = toApiOrder(selection, null, pricing.version);
check('toApiOrder carries pricing_version', payload.pricing_version === pricing.version);
const orderRes = await post('/orders', payload);
const orderJson = await orderRes.json();
const order = fromApiOrder(orderJson);
check('server accepted the mapper payload', orderRes.status === 201, `HTTP ${orderRes.status}`);
check('tracking code matches MTC-#####', /^MTC-\d{5}$/.test(order.trackingCode || ''), order.trackingCode);
check('status defaults to received', order.status === 'received', order.status);

// -- tracking --------------------------------------------------------------
section('POST /orders/track -> fromApiOrder()');
const tracked = fromApiOrder(await (await post('/orders/track', { code: order.trackingCode, phone })).json());
check('returns the same order', tracked.trackingCode === order.trackingCode);
check('statusLabel is populated for the UI', typeof tracked.statusLabel === 'string' && tracked.statusLabel.length > 0, tracked.statusLabel);

section('a wrong phone must not reveal that the code exists');
const wrong = await post('/orders/track', { code: order.trackingCode, phone: '09999999999' });
const wrongJson = await wrong.json();
check('responds 404', wrong.status === 404, `HTTP ${wrong.status}`);
check('with NOT_FOUND, not a different code', wrongJson?.error?.code === 'NOT_FOUND', wrongJson?.error?.code);

// -- the error envelope client.js normalises ------------------------------
section('error shape client.js expects');
const errJson = await (await post('/orders', { site_type: type.id, business: { name: 'x', phone: 'bad' } })).json();
check('error.code present', typeof errJson?.error?.code === 'string', errJson?.error?.code);
check('error.message present', typeof errJson?.error?.message === 'string');
check('fieldErrors keyed by field name', !!errJson?.error?.fieldErrors?.phone);

// -- client.js unwraps with `json?.data ?? json` --------------------------
section("no response may carry a stray top-level 'data' key");
for (const [name, res] of [['pricing', pricingRaw], ['order', orderJson]]) {
  check(`${name} response`, !('data' in res));
}

console.log(`\n${failures === 0 ? 'ALL CONTRACT CHECKS PASSED' : failures + ' CHECK(S) FAILED'}`);
process.exit(failures === 0 ? 0 : 1);
