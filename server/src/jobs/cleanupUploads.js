// Deletes uploads that no order claimed within UPLOAD_ORPHAN_HOURS: a visitor
// uploaded a file in the order builder and never submitted. Without this they
// stay on disk forever.
//
// The row is deleted first, with a single DELETE ... WHERE order_id IS NULL:
// claimUploads locks the same rows FOR UPDATE, so a file an order is
// attaching right now is either claimed first (and skipped here) or deleted
// first (and the order is rejected), never both.
import fs from 'node:fs/promises';
import { ENV } from '../env.js';
import { pool } from '../db/pool.js';

export async function cleanupOrphanUploads({ olderThanHours = ENV.uploadOrphanHours } = {}) {
  const { rows } = await pool.query(
    `DELETE FROM uploads
      WHERE order_id IS NULL AND created_at < now() - make_interval(hours => $1)
      RETURNING id, storage_path`,
    [olderThanHours]
  );
  for (const { id, storage_path: storagePath } of rows) {
    try {
      await fs.unlink(storagePath);
    } catch (e) {
      if (e.code !== 'ENOENT') console.error(`[cleanup] could not delete file for ${id}:`, e.message);
    }
  }
  return rows.length;
}

// Runs once shortly after start, then hourly. unref() so it never keeps the
// process alive on its own.
export function scheduleOrphanUploadCleanup() {
  const run = () =>
    cleanupOrphanUploads()
      .then((n) => n && console.log(`[cleanup] removed ${n} unattached upload(s)`))
      .catch((e) => console.error('[cleanup] failed:', e.message));
  setTimeout(run, 60 * 1000).unref();
  setInterval(run, 60 * 60 * 1000).unref();
}
