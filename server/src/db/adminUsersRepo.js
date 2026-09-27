import { pool } from './pool.js';

export const MAX_FAILED_LOGINS = 5;
export const LOCK_MINUTES = 15;

export async function findAdminByUsername(username, client = pool) {
  const { rows } = await client.query('SELECT * FROM admin_users WHERE username = $1', [username]);
  return rows[0] ?? null;
}

export async function findAdminById(id, client = pool) {
  const { rows } = await client.query('SELECT * FROM admin_users WHERE id = $1', [id]);
  return rows[0] ?? null;
}

// Counts a wrong password; the MAX_FAILED_LOGINS-th in a row locks the
// account for LOCK_MINUTES and starts the count again.
export async function recordFailedLogin(id, client = pool) {
  await client.query(
    `UPDATE admin_users SET
       failed_logins = CASE WHEN failed_logins + 1 >= $2 THEN 0 ELSE failed_logins + 1 END,
       locked_until  = CASE WHEN failed_logins + 1 >= $2 THEN now() + make_interval(mins => $3) ELSE locked_until END
     WHERE id = $1`,
    [id, MAX_FAILED_LOGINS, LOCK_MINUTES]
  );
}

export async function recordSuccessfulLogin(id, client = pool) {
  await client.query('UPDATE admin_users SET failed_logins = 0, locked_until = NULL WHERE id = $1', [id]);
}

// Sets a new password hash and bumps session_version, ending every session
// issued before it. Returns the new session_version.
export async function setAdminPassword(id, passwordHash, client = pool) {
  const { rows } = await client.query(
    `UPDATE admin_users SET
       password_hash = $2, session_version = session_version + 1, failed_logins = 0, locked_until = NULL
     WHERE id = $1
     RETURNING session_version`,
    [id, passwordHash]
  );
  return rows[0].session_version;
}
