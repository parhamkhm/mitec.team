// Test harness: a fresh, migrated, seeded `*_test` database and the real app
// listening on a random port, per test file (node --test runs each file in
// its own process; package.json runs them one at a time since they share the
// database).
//
// The environment is set here BEFORE the app is imported: env.js reads it at
// import time, and dotenv never overrides a variable that is already set, so
// nothing from server/.env leaks in — no real database, no real SMTP.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgres://mitec:mitec@127.0.0.1:5432/mitec_test';
const dbName = new URL(DATABASE_URL).pathname.slice(1);
// The reset below drops every table. Refuse anything that isn't obviously a
// throwaway test database.
if (!dbName.endsWith('_test')) {
  throw new Error(`Refusing to run tests against "${dbName}": the test database name must end in _test.`);
}

export const UPLOAD_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'mitec-test-uploads-'));
Object.assign(process.env, {
  NODE_ENV: 'test',
  DATABASE_URL,
  JWT_SECRET: 'test-only-secret',
  JWT_EXPIRES_IN: '1h',
  COOKIE_SECURE: 'false',
  ALLOWED_ORIGINS: '',
  ADMIN_SEED_ACCOUNTS: '',
  TRACK_REQUIRES_PHONE: 'true',
  UPLOAD_DIR,
  UPLOAD_MAX_SIZE_MB: '8',
  UPLOAD_MAX_FILES: '5',
  UPLOAD_ORPHAN_HOURS: '24',
  SMTP_HOST: '',
  MAIL_TO: ''
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PRICING_JSON = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', '..', '..', 'project', 'src', 'config', 'pricing.json'), 'utf8')
);

export const ADMIN = { username: 'test-admin', password: 'test-admin-password' };
export const PHONE = '09121234567';

async function createDatabaseIfMissing() {
  const adminUrl = new URL(DATABASE_URL);
  adminUrl.pathname = '/postgres';
  const client = new pg.Client({ connectionString: adminUrl.toString() });
  await client.connect();
  try {
    const { rowCount } = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (!rowCount) await client.query(`CREATE DATABASE "${dbName}"`);
  } finally {
    await client.end();
  }
}

// Empties the test database, applies every migration, seeds the pricing
// document from project/src/config/pricing.json and one admin account.
async function resetDatabase(pool) {
  const { runMigrations } = await import('../../src/db/migrations.js');
  const bcrypt = (await import('bcryptjs')).default;
  const client = await pool.connect();
  try {
    await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
    await runMigrations(client);
    await client.query('INSERT INTO pricing_versions (version, document) VALUES ($1, $2)', [
      PRICING_JSON.version,
      PRICING_JSON
    ]);
    await client.query('INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)', [
      ADMIN.username,
      await bcrypt.hash(ADMIN.password, 4)
    ]);
  } finally {
    client.release();
  }
}

// Starts the app on a random port. Call once per test file (in `before`) and
// `await server.close()` in `after`.
export async function startServer() {
  await createDatabaseIfMissing();
  const { pool } = await import('../../src/db/pool.js');
  await resetDatabase(pool);
  const { createApp } = await import('../../src/app.js');

  const http = createApp().listen(0, '127.0.0.1');
  await new Promise((resolve) => http.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${http.address().port}`;

  return {
    baseUrl,
    pool,
    api: makeClient(baseUrl),
    async close() {
      await new Promise((resolve) => http.close(resolve));
      await pool.end();
      fs.rmSync(UPLOAD_DIR, { recursive: true, force: true });
    }
  };
}

// fetch wrapper: JSON in, { status, body, headers } out, with an optional
// admin cookie.
function makeClient(baseUrl) {
  const request = async (method, url, { json, form, cookie } = {}) => {
    const headers = {};
    if (cookie) headers.cookie = cookie;
    let body;
    if (json !== undefined) {
      headers['content-type'] = 'application/json';
      body = JSON.stringify(json);
    } else if (form) {
      body = form;
    }
    const res = await fetch(`${baseUrl}${url}`, { method, headers, body });
    const text = await res.text();
    let parsed = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = text;
    }
    return { status: res.status, body: parsed, headers: res.headers };
  };

  const api = {
    get: (url, opts) => request('GET', url, opts),
    post: (url, json, opts) => request('POST', url, { ...opts, json }),
    put: (url, json, opts) => request('PUT', url, { ...opts, json }),
    patch: (url, json, opts) => request('PATCH', url, { ...opts, json }),

    async login(creds = ADMIN) {
      const res = await api.post('/admin/login', creds);
      if (res.status !== 200) throw new Error(`login failed: ${res.status} ${JSON.stringify(res.body)}`);
      return res.headers.get('set-cookie').split(';')[0];
    },

    // A minimal valid order; `extra` overrides top-level fields.
    order(extra = {}) {
      return api.post('/orders', {
        site_type: 'corporate',
        business: { name: 'Test business', phone: PHONE },
        ...extra
      });
    },

    // Uploads a 1x1 PNG; returns the upload response body ({ id, name, size, url }).
    async upload(name = 'pixel.png') {
      const form = new FormData();
      form.append('file', new Blob([PNG], { type: 'image/png' }), name);
      const res = await request('POST', '/uploads', { form });
      if (res.status !== 201) throw new Error(`upload failed: ${res.status} ${JSON.stringify(res.body)}`);
      return res.body;
    }
  };
  return api;
}

const PNG = Buffer.from(
  '89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4890000000D49444154789C6360000002000154A24F5D0000000049454E44AE426082',
  'hex'
);
