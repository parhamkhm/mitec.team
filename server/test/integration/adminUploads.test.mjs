import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { startServer } from '../helpers/server.mjs';

let server, api, cookie;
before(async () => {
  server = await startServer();
  api = server.api;
  cookie = await api.login();
});
after(() => server.close());

const download = (id, withCookie = cookie) =>
  fetch(`${server.baseUrl}/admin/uploads/${id}`, { headers: withCookie ? { cookie: withCookie } : {} });

async function uploadAs(bytes, type, name) {
  const form = new FormData();
  form.append('file', new Blob([bytes], { type }), name);
  const res = await fetch(`${server.baseUrl}/uploads`, { method: 'POST', body: form });
  assert.equal(res.status, 201);
  return res.json();
}

test('an image comes back byte for byte, inline, with its (Persian) name and locked-down headers', async () => {
  const up = await api.upload('لوگو.png');
  const res = await download(up.id);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'image/png');
  assert.match(res.headers.get('content-disposition'), /^inline; /);
  assert.match(res.headers.get('content-disposition'), /filename\*=UTF-8''%D9%84%D9%88%DA%AF%D9%88\.png/);
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  assert.match(res.headers.get('content-security-policy'), /sandbox/);
  assert.match(res.headers.get('cache-control'), /no-store/);

  const stored = fs.readFileSync((await server.pool.query('SELECT storage_path FROM uploads WHERE id=$1', [up.id])).rows[0].storage_path);
  assert.deepEqual(Buffer.from(await res.arrayBuffer()), stored);
});

test('anything that is not a raster image is a download, never inline', async () => {
  const pdf = await uploadAs('%PDF-1.4\n%%EOF\n', 'application/pdf', 'brief.pdf');
  const res = await download(pdf.id);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'application/pdf');
  assert.match(res.headers.get('content-disposition'), /^attachment; filename="brief\.pdf"/);
});

test('HTML declared as an image is still served as that image type, sandboxed', async () => {
  // The upload's type is whatever the browser declared; this is the worst case.
  const fake = await uploadAs('<script>alert(1)</script>', 'image/png', 'x.png');
  const res = await download(fake.id);
  assert.equal(res.headers.get('content-type'), 'image/png');
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  assert.match(res.headers.get('content-security-policy'), /default-src 'none'.*sandbox/);
});

test('needs an admin session', async () => {
  const up = await api.upload();
  const res = await download(up.id, null);
  assert.equal(res.status, 401);
});

test('unknown, malformed and missing-on-disk files are a plain 404', async () => {
  const gone = await api.upload();
  const { storage_path: p } = (await server.pool.query('SELECT storage_path FROM uploads WHERE id=$1', [gone.id])).rows[0];
  fs.unlinkSync(p);
  for (const id of ['f_000000000000', '..%2F..%2Fpackage.json', 'nope', gone.id]) {
    const res = await download(id);
    assert.equal(res.status, 404, id);
    assert.equal((await res.json()).error.code, 'NOT_FOUND');
  }
});

test('a storage path outside UPLOAD_DIR is never served', async () => {
  const up = await api.upload();
  await server.pool.query('UPDATE uploads SET storage_path = $2 WHERE id = $1', [up.id, 'package.json']);
  const res = await download(up.id);
  assert.equal(res.status, 404);
});
