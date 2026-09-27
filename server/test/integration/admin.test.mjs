import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, ADMIN } from '../helpers/server.mjs';

let server, api;
before(async () => {
  server = await startServer();
  api = server.api;
});
after(() => server.close());

// -- login / session ------------------------------------------------------

test('login: wrong password and unknown user give the same INVALID_CREDENTIALS', async () => {
  const wrongPassword = await api.post('/admin/login', { username: ADMIN.username, password: 'nope' });
  const unknownUser = await api.post('/admin/login', { username: 'nobody', password: 'nope' });
  for (const res of [wrongPassword, unknownUser]) {
    assert.equal(res.status, 401);
    assert.equal(res.body.error.code, 'INVALID_CREDENTIALS');
    assert.equal(res.headers.get('set-cookie'), null);
  }
});

test('login: missing fields are a VALIDATION_ERROR', async () => {
  const res = await api.post('/admin/login', {});
  assert.equal(res.status, 422);
  assert.deepEqual(Object.keys(res.body.error.fieldErrors).sort(), ['password', 'username']);
});

test('login sets an httpOnly session cookie that /admin/me accepts', async () => {
  const res = await api.post('/admin/login', ADMIN);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('set-cookie'), /mitec_admin=.+HttpOnly/i);
  const cookie = res.headers.get('set-cookie').split(';')[0];
  const me = await api.get('/admin/me', { cookie });
  assert.equal(me.status, 200);
  assert.equal(me.body.username, ADMIN.username);
});

test('admin routes need a valid session', async () => {
  const routes = [
    () => api.get('/admin/me'),
    () => api.get('/admin/pricing'),
    () => api.put('/admin/pricing', { version: 1 }),
    () => api.get('/admin/orders'),
    () => api.patch('/admin/orders/MTC-00001', { status: 'review' }),
    () => api.get('/admin/me', { cookie: 'mitec_admin=not-a-jwt' })
  ];
  for (const call of routes) {
    const res = await call();
    assert.equal(res.status, 401);
    assert.equal(res.body.error.code, 'UNAUTHORIZED');
  }
});

test('logout clears the cookie', async () => {
  const res = await api.post('/admin/logout', {});
  assert.equal(res.status, 200);
  assert.match(res.headers.get('set-cookie'), /mitec_admin=;/);
});

// -- pricing --------------------------------------------------------------

test('PUT /admin/pricing saves a new version that GET /pricing then serves', async () => {
  const cookie = await api.login();
  const current = (await api.get('/admin/pricing', { cookie })).body;
  const edited = { ...current, section: { ...current.section, pagesTitle: 'edited title' } };

  const saved = await api.put('/admin/pricing', edited, { cookie });
  assert.equal(saved.status, 200);
  assert.equal(saved.body.version, current.version + 1);
  assert.ok(saved.body.updatedAt);

  const pub = await api.get('/pricing');
  assert.equal(pub.body.version, current.version + 1);
  assert.equal(pub.body.section.pagesTitle, 'edited title');
});

test('PUT /admin/pricing from a stale version is a 409 carrying the current version', async () => {
  const cookie = await api.login();
  const current = (await api.get('/admin/pricing', { cookie })).body;
  await api.put('/admin/pricing', current, { cookie }); // someone else saves first
  const stale = await api.put('/admin/pricing', current, { cookie });
  assert.equal(stale.status, 409);
  assert.equal(stale.body.error.code, 'VERSION_CONFLICT');
  assert.equal(stale.body.error.currentVersion, current.version + 1);
});

test('PUT /admin/pricing rejects a document the schema does not allow, and keeps the old one', async () => {
  const cookie = await api.login();
  const current = (await api.get('/admin/pricing', { cookie })).body;
  const missingVersion = await api.put('/admin/pricing', { ...current, version: undefined }, { cookie });
  assert.equal(missingVersion.status, 422);
  // Wrong types in every list the extra (x-rules) checks walk: these used to
  // crash the validator with a 500 instead of being reported.
  const firstType = current.siteTypes[0];
  const broken = [
    { siteTypes: 'not a list' },
    { addons: 'not a list' },
    { siteTypes: ['not an object'] },
    { siteTypes: [{ ...firstType, addons: 'not a list' }] },
    { siteTypes: [{ ...firstType, base: { ...firstType.base, included: 'not a list' } }] }
  ];
  for (const patch of broken) {
    const res = await api.put('/admin/pricing', { ...current, ...patch }, { cookie });
    assert.equal(res.status, 422, JSON.stringify(patch));
    assert.equal(res.body.error.code, 'VALIDATION_ERROR');
  }
  assert.equal((await api.get('/pricing')).body.version, current.version);
});

// -- orders ---------------------------------------------------------------

test('GET /admin/orders lists newest first and filters by status', async () => {
  const cookie = await api.login();
  const first = (await api.order()).body.tracking_code;
  const second = (await api.order()).body.tracking_code;
  await api.patch(`/admin/orders/${first}`, { status: 'review' }, { cookie });

  const all = await api.get('/admin/orders', { cookie });
  assert.equal(all.status, 200);
  const codes = all.body.items.map((o) => o.tracking_code);
  assert.ok(codes.indexOf(second) < codes.indexOf(first));

  const inReview = await api.get('/admin/orders?status=review', { cookie });
  assert.deepEqual(inReview.body.items.map((o) => o.tracking_code), [first]);
  assert.equal(inReview.body.total, 1);
});

test('GET /admin/orders searches code, business name and phone (Persian digits too)', async () => {
  const cookie = await api.login();
  const mk = async (name, phone) =>
    (await api.order({ business: { name, phone } })).body.tracking_code;
  const coffee = await mk('کافه نارنج', '09351112233');
  const shop = await mk('Blue Shop', '09364445566');
  const codesFor = async (q) =>
    (await api.get(`/admin/orders?q=${encodeURIComponent(q)}`, { cookie })).body.items.map((o) => o.tracking_code);

  assert.deepEqual(await codesFor('نارنج'), [coffee]);
  assert.deepEqual(await codesFor('blue'), [shop], 'name search ignores case');
  // "C-12345", not just the digits: a digits-only query also searches phones,
  // and a random code could then match another test order's phone number.
  assert.deepEqual(await codesFor(shop.slice(2)), [shop], 'part of the tracking code');
  assert.deepEqual(await codesFor('4445566'), [shop], 'part of the phone');
  assert.deepEqual(await codesFor('۱۱۱۲۲۳۳'), [coffee], 'phone typed in Persian digits');
  assert.deepEqual(await codesFor('%'), [], '% is literal, not a wildcard');
});

test('GET /admin/orders pages with limit/offset and reports the total', async () => {
  const cookie = await api.login();
  for (let i = 0; i < 3; i++) await api.order({ business: { name: 'paging-test', phone: '09370000000' } });

  const page1 = await api.get('/admin/orders?q=paging-test&limit=2', { cookie });
  const page2 = await api.get('/admin/orders?q=paging-test&limit=2&offset=2', { cookie });
  assert.equal(page1.body.total, 3);
  assert.equal(page1.body.items.length, 2);
  assert.equal(page2.body.items.length, 1);
  assert.equal(page2.body.total, 3);
  assert.deepEqual([page1.body.limit, page1.body.offset], [2, 0]);
  const ids = [...page1.body.items, ...page2.body.items].map((o) => o.id);
  assert.equal(new Set(ids).size, 3, 'no order appears on two pages');
});

test('GET /admin/orders rejects bad paging and unknown statuses (used to be a 500)', async () => {
  const cookie = await api.login();
  for (const qs of ['limit=-5', 'limit=0', 'limit=201', 'limit=abc', 'offset=-1', 'offset=1.5', 'status=shipped']) {
    const res = await api.get(`/admin/orders?${qs}`, { cookie });
    assert.equal(res.status, 422, qs);
    assert.equal(res.body.error.code, 'VALIDATION_ERROR');
  }
});

test('GET /admin/orders/:code returns the full order with its files, without storage paths', async () => {
  const cookie = await api.login();
  const file = await api.upload('brief.png');
  const code = (await api.order({ attachments: [file] })).body.tracking_code;

  const res = await api.get(`/admin/orders/${code}`, { cookie });
  assert.equal(res.status, 200);
  assert.equal(res.body.tracking_code, code);
  assert.equal(res.body.business_name, 'Test business');
  assert.ok('internal_notes' in res.body && 'quote' in res.body);
  assert.equal(res.body.uploads.length, 1);
  assert.equal(res.body.uploads[0].id, file.id);
  assert.equal(res.body.uploads[0].filename, 'brief.png');
  assert.ok(!('storage_path' in res.body.uploads[0]));

  const unknown = await api.get('/admin/orders/MTC-00000', { cookie });
  assert.equal(unknown.status, 404);
  assert.equal(unknown.body.error.code, 'NOT_FOUND');
  assert.equal((await api.get(`/admin/orders/${code}`)).status, 401);
});

test('PATCH /admin/orders/:code sets status label, estimate and notes', async () => {
  const cookie = await api.login();
  const code = (await api.order()).body.tracking_code;
  const res = await api.patch(`/admin/orders/${code}`, { status: 'in_dev', estimate_weeks: 3 }, { cookie });
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'in_dev');
  assert.equal(res.body.status_label, 'در حال توسعه');
  assert.equal(res.body.estimate_weeks, 3);
});

test('each PATCH that changes something is recorded in the order history', async () => {
  const cookie = await api.login();
  const code = (await api.order()).body.tracking_code;
  const patch = (body) => api.patch(`/admin/orders/${code}`, body, { cookie });

  await patch({ status: 'in_design', estimate_weeks: 4 });
  await patch({ status: 'in_design', internal_notes: 'client wants blue' }); // status unchanged
  await patch({ status: 'in_design' }); // nothing changes: no event
  await patch({ estimate_weeks: null }); // null clears the estimate

  const { body: order } = await api.get(`/admin/orders/${code}`, { cookie });
  assert.equal(order.estimate_weeks, null);
  assert.equal(order.history.length, 3);
  const [first, second, third] = order.history;

  assert.equal(first.admin_username, ADMIN.username);
  assert.deepEqual(first.changes, {
    status: { from: 'received', to: 'in_design' },
    estimate_weeks: { from: null, to: 4 }
  });
  assert.deepEqual(second.changes, { internal_notes: { from: '', to: 'client wants blue' } });
  assert.deepEqual(third.changes, { estimate_weeks: { from: 4, to: null } });
  assert.ok(new Date(first.created_at) <= new Date(third.created_at));
});

test('a PATCH that changes nothing leaves updated_at alone', async () => {
  const cookie = await api.login();
  const code = (await api.order()).body.tracking_code;
  const before = (await api.get(`/admin/orders/${code}`, { cookie })).body.updated_at;
  const res = await api.patch(`/admin/orders/${code}`, { status: 'received', customer_note: '' }, { cookie });
  assert.equal(res.status, 200);
  assert.equal(res.body.updated_at, before);
});

test('PATCH /admin/orders/:code validates its input', async () => {
  const cookie = await api.login();
  const code = (await api.order()).body.tracking_code;
  const cases = [{ status: 'shipped' }, { estimate_weeks: -1 }, { estimate_weeks: 1.5 }, { internal_notes: { x: 1 } }, { customer_note: 5 }];
  for (const body of cases) {
    const res = await api.patch(`/admin/orders/${code}`, body, { cookie });
    assert.equal(res.status, 422, JSON.stringify(body));
    assert.equal(res.body.error.code, 'VALIDATION_ERROR');
  }
  const unknown = await api.patch('/admin/orders/MTC-00000', { status: 'review' }, { cookie });
  assert.equal(unknown.status, 404);
});
