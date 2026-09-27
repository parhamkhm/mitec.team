import pg from 'pg';
import { ENV } from '../env.js';

export const pool = new pg.Pool({ connectionString: ENV.databaseUrl });

export async function query(text, params) {
  return pool.query(text, params);
}

// Runs fn(client) inside BEGIN/COMMIT on one pooled connection, rolling back
// if it throws. Everything fn does must go through the client it is given.
export async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
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
