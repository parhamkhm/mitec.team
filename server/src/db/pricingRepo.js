import { pool } from './pool.js';

export async function getLatestPricing(client = pool) {
  const { rows } = await client.query('SELECT version, document FROM pricing_versions ORDER BY version DESC LIMIT 1');
  return rows[0]?.document ?? null;
}

export async function insertPricingVersion(version, document, client = pool) {
  const { rows } = await client.query(
    'INSERT INTO pricing_versions (version, document) VALUES ($1, $2) RETURNING version, document',
    [version, document]
  );
  return rows[0];
}

// Serializes concurrent PUT /admin/pricing saves so "read current version,
// then write next version" can't race between two admins. An advisory lock
// is cheaper than SELECT ... FOR UPDATE on a table that may have no rows yet.
const PRICING_LOCK_KEY = 727271;
export async function withPricingLock(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock($1)', [PRICING_LOCK_KEY]);
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
