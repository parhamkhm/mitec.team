// Runs test/contract.test.mjs (the front end's own mapper.js and estimate.js
// against live responses) against an in-process server on the test
// database, so `npm test` covers it without a separately started server.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startServer } from '../helpers/server.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let server;
before(async () => {
  server = await startServer();
});
after(() => server.close());

test('the front end can consume every response (test/contract.test.mjs)', async () => {
  // Asynchronous spawn: the server runs in this process, so a blocking
  // spawnSync would stop it from answering the child's requests.
  const child = spawn(process.execPath, [path.join(__dirname, '..', 'contract.test.mjs')], {
    env: { ...process.env, BASE_URL: server.baseUrl }
  });
  let output = '';
  child.stdout.on('data', (d) => (output += d));
  child.stderr.on('data', (d) => (output += d));
  const code = await new Promise((resolve) => child.on('close', resolve));
  assert.equal(code, 0, output);
});
