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

// Escapes LIKE's wildcards so a search for "50%" or "a_b" is literal.
const likeEscape = (s) => s.replace(/[\\%_]/g, '\\$&');

// One page of orders, newest first, and how many match in total.
// `q` matches part of the tracking code or business name (case-insensitive),
// or part of the phone number when it is made of digits (already normalised
// to ASCII by the caller, as stored phones are).
export async function listOrders({ status, q, phoneDigits, limit = 50, offset = 0 } = {}, client = pool) {
  const params = [];
  const where = [];
  if (status) {
    params.push(status);
    where.push(`status = $${params.length}`);
  }
  if (q) {
    params.push(`%${likeEscape(q)}%`);
    const text = `$${params.length}`;
    const match = [`tracking_code ILIKE ${text}`, `business_name ILIKE ${text}`];
    if (phoneDigits) {
      params.push(`%${likeEscape(phoneDigits)}%`);
      match.push(`business_phone LIKE $${params.length}`);
    }
    where.push(`(${match.join(' OR ')})`);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const { rows: countRows } = await client.query(`SELECT count(*)::int AS total FROM orders ${whereSql}`, params);
  const { rows } = await client.query(
    `SELECT * FROM orders ${whereSql}
      ORDER BY created_at DESC, id DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );
  return { items: rows, total: countRows[0].total };
}

const EDITABLE = ['status', 'estimate_weeks', 'customer_note', 'internal_notes'];

// Applies an admin's edit and records it in order_events, in the caller's
// transaction. `patch` holds only the fields being set (undefined = leave
// alone; estimate_weeks may be null to clear it). The row is locked FOR UPDATE
// so two admins editing at once each record the correct "from" values.
// Returns the order (unchanged, with no event, if nothing actually differs),
// or null if there is no such order.
export async function updateOrder(trackingCode, patch, admin, client) {
  const { rows } = await client.query('SELECT * FROM orders WHERE tracking_code = $1 FOR UPDATE', [trackingCode]);
  const current = rows[0];
  if (!current) return null;

  const changes = {};
  for (const field of EDITABLE) {
    if (patch[field] !== undefined && patch[field] !== current[field]) {
      changes[field] = { from: current[field], to: patch[field] };
    }
  }
  if (Object.keys(changes).length === 0) return current;

  const next = { ...current, ...Object.fromEntries(Object.entries(changes).map(([f, c]) => [f, c.to])) };
  const { rows: updated } = await client.query(
    `UPDATE orders SET
      status = $2, status_label = $3, estimate_weeks = $4,
      customer_note = $5, internal_notes = $6, updated_at = now()
    WHERE id = $1
    RETURNING *`,
    [current.id, next.status, STATUS_LABELS[next.status], next.estimate_weeks, next.customer_note, next.internal_notes]
  );
  await client.query(
    'INSERT INTO order_events (order_id, admin_user_id, admin_username, changes) VALUES ($1, $2, $3, $4)',
    [current.id, admin.id, admin.username, JSON.stringify(changes)]
  );
  return updated[0];
}

// Oldest first, for a timeline.
export async function listOrderEvents(orderId, client = pool) {
  const { rows } = await client.query(
    `SELECT id, admin_username, changes, created_at
       FROM order_events WHERE order_id = $1 ORDER BY created_at, id`,
    [orderId]
  );
  return rows;
}
