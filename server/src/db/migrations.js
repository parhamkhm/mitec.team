// Minimal migration runner: applies every src/db/migrations/*.sql file that
// isn't recorded in _migrations yet, in filename order, each in its own
// transaction. Used by `npm run migrate` (migrate.js) and the test setup.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

// Returns the names of the migrations it applied.
export async function runMigrations(client, { log = () => {} } = {}) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  const { rows } = await client.query('SELECT name FROM _migrations');
  const applied = new Set(rows.map((r) => r.name));

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const ran = [];
  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    log(`applying migration: ${file}`);
    await client.query('BEGIN');
    try {
      await client.query(sql);
      await client.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    }
    ran.push(file);
  }
  return ran;
}
