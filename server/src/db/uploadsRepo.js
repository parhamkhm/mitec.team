import { pool } from './pool.js';
import { Errors } from '../lib/errors.js';

// The files attached to an order, for the admin panel. storage_path stays on
// the server.
export async function listUploadsForOrder(orderId, client = pool) {
  const { rows } = await client.query(
    `SELECT id, filename, mime_type, size_bytes, created_at
       FROM uploads WHERE order_id = $1 ORDER BY created_at, id`,
    [orderId]
  );
  return rows;
}

// Attaches uploads to an order. Every id must exist and not belong to an
// order yet; otherwise nothing is linked and the caller's transaction is
// expected to roll back. FOR UPDATE stops two simultaneous orders from both
// claiming the same file.
export async function claimUploads(ids, orderId, client) {
  if (ids.length === 0) return;

  const { rows } = await client.query(
    'SELECT id FROM uploads WHERE id = ANY($1) AND order_id IS NULL FOR UPDATE',
    [ids]
  );
  if (rows.length !== ids.length) {
    // Same message whether the id never existed or was already used, so the
    // response doesn't reveal which ids other visitors uploaded.
    throw Errors.validation('بعضی از فایل‌های پیوست پیدا نشد. لطفاً دوباره بارگذاری کنید.', {
      attachments: 'فایل پیدا نشد یا قبلاً استفاده شده است.'
    });
  }

  await client.query('UPDATE uploads SET order_id = $2 WHERE id = ANY($1)', [ids, orderId]);
}
