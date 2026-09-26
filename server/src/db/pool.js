import pg from 'pg';
import { ENV } from '../env.js';

export const pool = new pg.Pool({ connectionString: ENV.databaseUrl });

export async function query(text, params) {
  return pool.query(text, params);
}
