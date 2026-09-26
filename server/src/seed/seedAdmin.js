// Creates (or updates the password of) each admin account listed in
// ADMIN_SEED_ACCOUNTS ("user:pass,user2:pass2"). Safe to re-run.
import bcrypt from 'bcryptjs';
import { pool } from '../db/pool.js';
import { ENV } from '../env.js';

async function run() {
  if (ENV.adminSeedAccounts.length === 0) {
    console.log('ADMIN_SEED_ACCOUNTS is empty; nothing to seed.');
    return;
  }

  for (const pair of ENV.adminSeedAccounts) {
    const [username, password] = pair.split(':');
    if (!username || !password) {
      console.warn(`skipping malformed entry: "${pair}" (expected username:password)`);
      continue;
    }
    const hash = await bcrypt.hash(password, 12);
    await pool.query(
      `INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)
       ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [username, hash]
    );
    console.log(`seeded admin user: ${username}`);
  }
}

run()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
