import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, PHONE } from '../helpers/server.mjs';

let server, api;
before(async () => {
  server = await startServer();
  api = server.api;
});
after(() => server.close());

test('GET /health', async () => {
  const res = await api.get('/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
});

test('POST /orders: a minimal valid order gets a tracking code and status "received"', async () => {
  const res = await api.order();
  assert.equal(res.status, 201);
  assert.match(res.body.tracking_code, /^MTC-\d{5}$/);
  assert.equal(res.body.status, 'received');
  assert.ok(res.body.created_at);
});

test('POST /orders: missing required fields are reported per field', async () => {
  const res = await api.post('/orders', { business: {} });
  assert.equal(res.status, 422);
  assert.equal(res.body.error.code, 'VALIDATION_ERROR');
  assert.deepEqual(Object.keys(res.body.error.fieldErrors).sort(), ['name', 'phone', 'site_type']);
});

test('POST /orders: a phone that is not an Iranian mobile is rejected', async () => {
  const res = await api.order({ business: { name: 'x', phone: '12345' } });
  assert.equal(res.status, 422);
  assert.ok(res.body.error.fieldErrors.phone);
});

test('POST /orders: malformed JSON is a VALIDATION_ERROR, not a 500', async () => {
  const res = await fetch(`${server.baseUrl}/orders`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{not json'
  });
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error.code, 'VALIDATION_ERROR');
});

test('POST /orders/track: the right code and phone return the order', async () => {
  const { body: created } = await api.order();
  const res = await api.post('/orders/track', { code: created.tracking_code, phone: PHONE });
  assert.equal(res.status, 200);
  assert.equal(res.body.tracking_code, created.tracking_code);
  assert.equal(res.body.status, 'received');
  assert.equal(res.body.status_label, 'دریافت شد');
  assert.equal(res.body.notes, '');
});

test('POST /orders/track: a wrong phone and an unknown code give the same NOT_FOUND', async () => {
  const { body: created } = await api.order();
  const wrongPhone = await api.post('/orders/track', { code: created.tracking_code, phone: '09130000000' });
  const unknownCode = await api.post('/orders/track', { code: 'MTC-00000', phone: PHONE });
  const malformed = await api.post('/orders/track', { code: 'nope', phone: PHONE });
  for (const res of [wrongPhone, unknownCode, malformed]) {
    assert.equal(res.status, 404);
    assert.equal(res.body.error.code, 'NOT_FOUND');
  }
  assert.deepEqual(wrongPhone.body, unknownCode.body);
});

test('internal_notes never reach /orders/track; customer_note does, as `notes`', async () => {
  const cookie = await api.login();
  const { body: created } = await api.order();
  const patched = await api.patch(
    `/admin/orders/${created.tracking_code}`,
    { status: 'in_design', customer_note: 'visible to customer', internal_notes: 'TEAM ONLY' },
    { cookie }
  );
  assert.equal(patched.status, 200);
  assert.equal(patched.body.internal_notes, 'TEAM ONLY');

  const tracked = await api.post('/orders/track', { code: created.tracking_code, phone: PHONE });
  assert.equal(tracked.body.notes, 'visible to customer');
  assert.equal(tracked.body.status_label, 'در مرحله طراحی');
  assert.ok(!JSON.stringify(tracked.body).includes('TEAM ONLY'));
  assert.ok(!('internal_notes' in tracked.body));
});

test('the tracking-code retry survives collisions inside the order transaction', async () => {
  const { withTransaction } = await import('../../src/db/pool.js');
  const { createOrder } = await import('../../src/db/ordersRepo.js');
  const { assertValidOrder } = await import('../../src/validation/orderSchema.js');
  const { body: existing } = await api.order();

  const order = assertValidOrder({ site_type: 'corporate', business: { name: 'x', phone: PHONE } });
  const codes = [existing.tracking_code, existing.tracking_code, 'MTC-00001'];
  let calls = 0;
  const row = await withTransaction((client) => createOrder(order, client, () => codes[calls++]));
  assert.equal(row.tracking_code, 'MTC-00001');
  assert.equal(calls, 3);
});
