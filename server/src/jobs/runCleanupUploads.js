// `npm run cleanup:uploads` — the same cleanup the server runs hourly, once.
import { cleanupOrphanUploads } from './cleanupUploads.js';
import { pool } from '../db/pool.js';

try {
  const n = await cleanupOrphanUploads();
  console.log(`removed ${n} unattached upload(s)`);
} finally {
  await pool.end();
}
