import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { startServer, PRICING_JSON } from '../helpers/server.mjs';

let server, api, importPricingFile;
before(async () => {
  server = await startServer();
  api = server.api;
  ({ importPricingFile } = await import('../../src/pricing/importPricing.js'));
});
after(() => server.close());

const tmpFile = (doc) => {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'mitec-pricing-')), 'pricing.json');
  fs.writeFileSync(file, JSON.stringify(doc));
  return file;
};

test('the file already matching the live document (in any key order) is a no-op', async () => {
  // The database seeded from this very file; jsonb has reordered its keys.
  const r = await importPricingFile();
  assert.equal(r.imported, false);
  assert.equal((await api.get('/pricing')).body.version, PRICING_JSON.version);
});

test('a changed file becomes the next live version, whatever version it names', async () => {
  const live = (await api.get('/pricing')).body.version;
  const edited = structuredClone(PRICING_JSON);
  edited.version = 1; // stale on purpose: the database assigns the number
  edited.section.title = 'imported title';

  const r = await importPricingFile(tmpFile(edited));
  assert.deepEqual([r.imported, r.from, r.version], [true, live, live + 1]);

  const pub = (await api.get('/pricing')).body;
  assert.equal(pub.version, live + 1);
  assert.equal(pub.section.title, 'imported title');
  assert.equal((await importPricingFile(tmpFile(edited))).imported, false, 'a second run changes nothing');
});

test('an invalid file is refused and the live document stays', async () => {
  const live = (await api.get('/pricing')).body.version;
  const broken = { ...structuredClone(PRICING_JSON), siteTypes: 'not a list' };
  await assert.rejects(importPricingFile(tmpFile(broken)), (e) => e.code === 'VALIDATION_ERROR');
  assert.equal((await api.get('/pricing')).body.version, live);
});
