import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { startServer, ADMIN } from '../helpers/server.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let server, api;
before(async () => {
  server = await startServer();
  api = server.api;
});
after(() => server.close());

const login = (password, username = ADMIN.username) => api.post('/admin/login', { username, password });
const unlock = () =>
  server.pool.query('UPDATE admin_users SET locked_until = NULL, failed_logins = 0 WHERE username = $1', [ADMIN.username]);
const me = (cookie) => api.get('/admin/me', { cookie });
const cookieOf = (res) => res.headers.get('set-cookie').split(';')[0];

test('five wrong passwords in a row lock the account, even for the right password', async () => {
  for (let i = 0; i < 5; i++) assert.equal((await login('wrong')).status, 401);
  const locked = await login(ADMIN.password);
  assert.equal(locked.status, 429);
  assert.equal(locked.body.error.code, 'RATE_LIMITED');
  assert.equal(locked.headers.get('set-cookie'), null);

  // Once the lock has passed, the right password works again.
  await server.pool.query(`UPDATE admin_users SET locked_until = now() - interval '1 second'`);
  assert.equal((await login(ADMIN.password)).status, 200);
  await unlock();
});

test('a successful login resets the count of failures', async () => {
  for (let i = 0; i < 4; i++) await login('wrong');
  assert.equal((await login(ADMIN.password)).status, 200);
  for (let i = 0; i < 4; i++) await login('wrong');
  assert.equal((await login(ADMIN.password)).status, 200, 'four more failures must not lock it');
  await unlock();
});

test('an unknown username is refused the same way and locks nothing', async () => {
  const res = await login('whatever', 'nobody');
  assert.equal(res.status, 401);
  assert.equal(res.body.error.code, 'INVALID_CREDENTIALS');
});

test('a token from before session versions, or for a removed account, is refused', async () => {
  const { rows } = await server.pool.query('SELECT id FROM admin_users WHERE username = $1', [ADMIN.username]);
  const legacy = jwt.sign({ sub: rows[0].id, username: ADMIN.username }, process.env.JWT_SECRET);
  assert.equal((await me(`mitec_admin=${legacy}`)).status, 401);

  const ghost = jwt.sign({ sub: 999999, username: 'ghost', sv: 0 }, process.env.JWT_SECRET);
  assert.equal((await me(`mitec_admin=${ghost}`)).status, 401);
});

test('POST /admin/password validates the new password and the current one', async () => {
  const cookie = await api.login();
  const change = (body) => api.post('/admin/password', body, { cookie });
  const cases = [
    [{ current_password: ADMIN.password, new_password: 'short' }, 'new_password'],
    [{ current_password: ADMIN.password, new_password: ADMIN.password }, 'new_password'],
    [{ current_password: ADMIN.password, new_password: 'ر'.repeat(37) }, 'new_password'], // 74 bytes
    [{ current_password: 'not-the-password', new_password: 'a-good-new-password' }, 'current_password'],
    [{ new_password: 'a-good-new-password' }, 'current_password']
  ];
  for (const [body, field] of cases) {
    const res = await change(body);
    assert.equal(res.status, 422, JSON.stringify(body));
    assert.ok(res.body.error.fieldErrors[field], JSON.stringify(res.body));
  }
  assert.equal((await api.post('/admin/password', cases[0][0])).status, 401, 'needs a session');
});

test('changing the password ends other sessions but keeps this one', async () => {
  const otherDevice = await api.login();
  const thisDevice = await api.login();
  const newPassword = 'a-brand-new-password';

  const res = await api.post('/admin/password', { current_password: ADMIN.password, new_password: newPassword }, { cookie: thisDevice });
  assert.equal(res.status, 200);

  assert.equal((await me(otherDevice)).status, 401, 'the other session is over');
  assert.equal((await me(thisDevice)).status, 401, 'the old cookie of this session is over too');
  assert.equal((await me(cookieOf(res))).status, 200, 'the re-issued cookie works');
  assert.equal((await login(ADMIN.password)).status, 401, 'the old password no longer works');
  assert.equal((await login(newPassword)).status, 200);

  // Put the original password back for the rest of the file.
  await server.pool.query('UPDATE admin_users SET password_hash = $2 WHERE username = $1', [
    ADMIN.username,
    await bcrypt.hash(ADMIN.password, 4)
  ]);
});

test('npm run seed:admin resets the password, unlocks the account and ends its sessions', async () => {
  const session = await api.login();
  for (let i = 0; i < 5; i++) await login('wrong');
  assert.equal((await login(ADMIN.password)).status, 429);

  const child = spawn(process.execPath, [path.join(__dirname, '..', '..', 'src', 'seed', 'seedAdmin.js')], {
    env: { ...process.env, ADMIN_SEED_ACCOUNTS: `${ADMIN.username}:seeded-password-1` }
  });
  let output = '';
  child.stdout.on('data', (d) => (output += d));
  child.stderr.on('data', (d) => (output += d));
  assert.equal(await new Promise((resolve) => child.on('close', resolve)), 0, output);

  assert.equal((await me(session)).status, 401, 'existing sessions end');
  assert.equal((await login('seeded-password-1')).status, 200, 'unlocked, with the new password');
});
