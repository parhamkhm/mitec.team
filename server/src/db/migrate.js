// `npm run migrate` — applies pending migrations (see migrations.js).
import { pool } from './pool.js';
import { runMigrations } from './migrations.js';

async function run() {
  const client = await pool.connect();
  try {
    await runMigrations(client, { log: console.log });
    console.log('migrations up to date.');
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
