import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startServer, UPLOAD_DIR } from '../helpers/server.mjs';

let server, api;
before(async () => {
  server = await startServer();
  api = server.api;
});
after(() => server.close());

const orderIdOf = async (code) =>
  (await server.pool.query('SELECT id FROM orders WHERE tracking_code = $1', [code])).rows[0].id;
const uploadRow = async (id) => (await server.pool.query('SELECT * FROM uploads WHERE id = $1', [id])).rows[0];
const countOrders = async () => Number((await server.pool.query('SELECT count(*) FROM orders')).rows[0].count);
const assertAttachmentError = (res) => {
  assert.equal(res.status, 422);
  assert.equal(res.body.error.code, 'VALIDATION_ERROR');
  assert.ok(res.body.error.fieldErrors.attachments);
};

test('POST /uploads stores the file and returns { id, name, size, url: null }', async () => {
  const up = await api.upload('logo.png');
  assert.match(up.id, /^f_[0-9a-f]{12}$/);
  assert.equal(up.name, 'logo.png');
  assert.equal(up.url, null);
  const row = await uploadRow(up.id);
  assert.equal(row.order_id, null);
  assert.ok(fs.existsSync(row.storage_path));
});

test('POST /uploads keeps a Persian filename intact (it used to be stored as mojibake)', async () => {
  const up = await api.upload('لوگوی کافه.png');
  assert.equal(up.name, 'لوگوی کافه.png');
  assert.equal((await uploadRow(up.id)).filename, 'لوگوی کافه.png');
});

test('POST /uploads rejects a type that is not accepted', async () => {
  const form = new FormData();
  form.append('file', new Blob(['hello'], { type: 'text/plain' }), 'a.txt');
  const res = await fetch(`${server.baseUrl}/uploads`, { method: 'POST', body: form });
  assert.equal(res.status, 415);
  assert.equal((await res.json()).error.code, 'UNSUPPORTED_TYPE');
});

test('an order links the uploads it attaches (front-end shape, duplicates collapsed)', async () => {
  const a = await api.upload();
  const b = await api.upload();
  const res = await api.order({ attachments: [a, b, a] });
  assert.equal(res.status, 201);
  const orderId = await orderIdOf(res.body.tracking_code);
  assert.equal((await uploadRow(a.id)).order_id, orderId);
  assert.equal((await uploadRow(b.id)).order_id, orderId);
});

test('an upload already attached to one order cannot be attached to another', async () => {
  const a = await api.upload();
  assert.equal((await api.order({ attachments: [a] })).status, 201);
  assertAttachmentError(await api.order({ attachments: [a] }));
});

test('an id that was never uploaded is rejected, with the same message as a taken one', async () => {
  const a = await api.upload();
  await api.order({ attachments: [a] });
  const taken = await api.order({ attachments: [a] });
  const unknown = await api.order({ attachments: [{ id: 'f_000000000000' }] });
  assertAttachmentError(unknown);
  assert.deepEqual(unknown.body, taken.body);
});

test('malformed ids and more than UPLOAD_MAX_FILES are rejected before touching the database', async () => {
  assertAttachmentError(await api.order({ attachments: [{ id: '../../etc/passwd' }] }));
  assertAttachmentError(await api.order({ attachments: 'f_000000000000' }));
  const six = Array.from({ length: 6 }, (_, i) => ({ id: `f_00000000000${i}` }));
  assertAttachmentError(await api.order({ attachments: six }));
});

test('one bad attachment rejects the whole order and links nothing', async () => {
  const fresh = await api.upload();
  const before = await countOrders();
  assertAttachmentError(await api.order({ attachments: [fresh, { id: 'f_000000000000' }] }));
  assert.equal(await countOrders(), before, 'no order row may be left behind');
  assert.equal((await uploadRow(fresh.id)).order_id, null);
  assert.equal((await api.order({ attachments: [fresh] })).status, 201, 'the fresh upload is still usable');
});

test('cleanup deletes unattached uploads older than UPLOAD_ORPHAN_HOURS, row and file', async () => {
  const { cleanupOrphanUploads } = await import('../../src/jobs/cleanupUploads.js');
  const stale = await api.upload();
  const staleAttached = await api.upload();
  const fresh = await api.upload();
  await api.order({ attachments: [staleAttached] });
  await server.pool.query(`UPDATE uploads SET created_at = now() - interval '25 hours' WHERE id = ANY($1)`, [
    [stale.id, staleAttached.id]
  ]);
  const stalePath = (await uploadRow(stale.id)).storage_path;

  const removed = await cleanupOrphanUploads();

  assert.ok(removed >= 1);
  assert.equal(await uploadRow(stale.id), undefined);
  assert.ok(!fs.existsSync(stalePath), 'the file is deleted too');
  assert.ok(await uploadRow(staleAttached.id), 'attached uploads are kept whatever their age');
  assert.ok(await uploadRow(fresh.id), 'recent unattached uploads are kept');
  assert.ok(path.resolve(stalePath).startsWith(path.resolve(UPLOAD_DIR)));
});
