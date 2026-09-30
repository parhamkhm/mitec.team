import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { fromApiPricing } from '../../../project/src/api/mapper.js';
import { estimate } from '../../../project/src/utils/estimate.js';
import { startServer, PRICING_JSON } from '../helpers/server.mjs';

let server, api;
before(async () => {
  server = await startServer();
  api = server.api;
});
after(() => server.close());

const storedOrder = async (code) =>
  (await server.pool.query('SELECT pricing_version, quote FROM orders WHERE tracking_code = $1', [code])).rows[0];

// A site type with a page slider and at least two add-ons, from the real
// pricing document, so the quote exercises every kind of line.
const pricing = fromApiPricing(PRICING_JSON);
const type = pricing.siteTypes.find((t) => t.pages.enabled && t.addons.length >= 2);
const selection = { siteTypeId: type.id, pages: type.pages.min + 2, addonIds: type.addons.slice(0, 2) };
const orderFor = (extra = {}) =>
  api.order({ site_type: selection.siteTypeId, pages: selection.pages, addons: selection.addonIds, ...extra });

test('the stored quote is exactly what the front end\'s estimate() gives', async () => {
  const res = await orderFor({ pricing_version: pricing.version });
  assert.equal(res.status, 201);
  const { pricing_version: version, quote } = await storedOrder(res.body.tracking_code);
  const expected = estimate(pricing, selection);

  assert.equal(version, pricing.version);
  assert.equal(quote.pricing_version, pricing.version);
  assert.equal(quote.price, expected.price);
  assert.equal(quote.days, expected.days);
  assert.equal(quote.pages, expected.pages);
  assert.deepEqual(quote.lines, expected.lines);
  assert.equal(quote.currency_unit, pricing.currency.unit);
  assert.equal(quote.placeholder, pricing.placeholder);
  assert.ok(!('requested_version' in quote));
});

test('the quote is not part of the customer-facing response', async () => {
  const res = await orderFor({ pricing_version: pricing.version });
  assert.deepEqual(Object.keys(res.body).sort(), ['created_at', 'status', 'tracking_code']);
});

test('an order on an older pricing version keeps that version\'s price', async () => {
  const cookie = await api.login();
  const current = (await api.get('/admin/pricing', { cookie })).body;
  const raised = structuredClone(current);
  raised.siteTypes.find((t) => t.id === type.id).base.price += 1_000_000;
  const saved = await api.put('/admin/pricing', raised, { cookie });
  assert.equal(saved.status, 200);

  const onOld = await storedOrder((await orderFor({ pricing_version: current.version })).body.tracking_code);
  const onNew = await storedOrder((await orderFor({ pricing_version: saved.body.version })).body.tracking_code);
  assert.equal(onOld.pricing_version, current.version);
  assert.equal(onNew.quote.price - onOld.quote.price, 1_000_000);
});

test('an unknown pricing version is priced against the current one, not rejected', async () => {
  const res = await orderFor({ pricing_version: 999 });
  assert.equal(res.status, 201);
  const { pricing_version: version, quote } = await storedOrder(res.body.tracking_code);
  const latest = (await server.pool.query('SELECT max(version) AS v FROM pricing_versions')).rows[0].v;
  assert.equal(version, latest);
  assert.equal(quote.requested_version, 999);
});

test('no pricing version given: priced against the current one, no requested_version', async () => {
  const { quote } = await storedOrder((await orderFor()).body.tracking_code);
  assert.ok(quote);
  assert.ok(!('requested_version' in quote));
});

test('a site type with no price ("unsure") is accepted with no quote', async () => {
  const res = await api.order({ site_type: 'unsure' });
  assert.equal(res.status, 201);
  assert.equal((await storedOrder(res.body.tracking_code)).quote, null);
});

test('add-ons the site type does not offer are left out of the quote', async () => {
  const res = await orderFor({ addons: ['not-a-real-addon', selection.addonIds[0]] });
  const { quote } = await storedOrder(res.body.tracking_code);
  const ids = quote.lines.map((l) => l.id);
  assert.ok(!ids.includes('not-a-real-addon'));
  assert.ok(ids.includes(selection.addonIds[0]));
});
