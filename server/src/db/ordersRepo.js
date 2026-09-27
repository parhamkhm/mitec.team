import { pool } from './pool.js';
import { STATUS_LABELS } from '../constants/orderStatus.js';
import { randomTrackingCode } from '../utils/trackingCode.js';

const UNIQUE_VIOLATION = '23505';

// Generates the tracking code and inserts in one step, retrying when the
// random code collides. Letting the unique index be the arbiter (rather than
// a SELECT first) closes the race where two simultaneous orders both see a
// code as free and one insert then fails.
//
// Each attempt runs under a savepoint: inside a transaction a failed INSERT
// aborts the whole transaction, so without it one collision would fail the
// order instead of retrying. SAVEPOINT is only valid inside a transaction,
// so `client` must be a transaction's client (see withTransaction).
// `nextCode` is only swapped out by tests, to force a collision.
export async function createOrder(order, client, nextCode = randomTrackingCode) {
  for (let attempt = 0; attempt < 10; attempt++) {
    await client.query('SAVEPOINT create_order');
    try {
      const row = await insertOrder(nextCode(), order, client);
      await client.query('RELEASE SAVEPOINT create_order');
      return row;
    } catch (e) {
      await client.query('ROLLBACK TO SAVEPOINT create_order');
      if (e.code === UNIQUE_VIOLATION && e.constraint === 'orders_tracking_code_key') continue;
      throw e;
    }
  }
  throw new Error('Could not generate a unique tracking code after 10 attempts');
}

export async function insertOrder(trackingCode, order, client = pool) {
  const { rows } = await client.query(
    `INSERT INTO orders (
      tracking_code, status, status_label,
      site_type, pages, addons, pricing_version, template, mixed_description,
      sections, features, style, assets,
      business_name, business_field, business_handle, business_refs, business_desc, business_phone,
      attachments, meta, quote
    ) VALUES (
      $1, 'received', $2,
      $3, $4, $5, $6, $7, $8,
      $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18,
      $19, $20, $21
    ) RETURNING *`,
    [
      trackingCode,
      STATUS_LABELS.received,
      order.site_type,
      order.pages,
      JSON.stringify(order.addons),
      order.pricing_version,
      order.template,
      order.mixed_description,
      JSON.stringify(order.sections),
      JSON.stringify(order.features),
      JSON.stringify(order.style),
      JSON.stringify(order.assets),
      order.business.name,
      order.business.field,
      order.business.instagram_or_site,
      order.business.references,
      order.business.description,
      order.business.phone,
      JSON.stringify(order.attachments),
      JSON.stringify(order.meta),
      order.quote ? JSON.stringify(order.quote) : null
    ]
  );
  return rows[0];
}

export async function findOrderByTrackingCode(code, client = pool) {
  const { rows } = await client.query('SELECT * FROM orders WHERE tracking_code = $1', [code]);
  return rows[0] ?? null;
}

export async function listOrders({ status, limit = 50, offset = 0 } = {}, client = pool) {
  const params = [];
  let where = '';
  if (status) {
    params.push(status);
    where = `WHERE status = $${params.length}`;
  }
  params.push(limit, offset);
  const { rows } = await client.query(
    `SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  return rows;
}

export async function updateOrderStatus(
  trackingCode,
  { status, statusLabel, estimateWeeks, customerNote, internalNotes },
  client = pool
) {
  const { rows } = await client.query(
    `UPDATE orders SET
      status = COALESCE($2, status),
      status_label = COALESCE($3, status_label),
      estimate_weeks = COALESCE($4, estimate_weeks),
      customer_note = COALESCE($5, customer_note),
      internal_notes = COALESCE($6, internal_notes),
      updated_at = now()
    WHERE tracking_code = $1
    RETURNING *`,
    [trackingCode, status ?? null, statusLabel ?? null, estimateWeeks ?? null, customerNote ?? null, internalNotes ?? null]
  );
  return rows[0] ?? null;
}
