// Not part of API_CONTRACT.md, which only specifies the customer-facing
// shape — but /orders/track is meaningless if status never moves past
// "received", so the admin panel needs a minimal way to update it.
import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { sendOk } from '../lib/respond.js';
import { Errors } from '../lib/errors.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { findOrderByTrackingCode, listOrderEvents, listOrders, updateOrder } from '../db/ordersRepo.js';
import { listUploadsForOrder } from '../db/uploadsRepo.js';
import { withTransaction } from '../db/pool.js';
import { ORDER_STATUSES } from '../constants/orderStatus.js';
import { normalizePhone } from '../utils/phone.js';

export const adminOrdersRouter = Router();

// ?status=  one of ORDER_STATUSES
// ?q=       part of the tracking code, business name or phone number
// ?limit=   1–200 (default 50)   ?offset= 0 or more (default 0)
// → { items, total, limit, offset }; total counts every match, not just this page.
adminOrdersRouter.get(
  '/admin/orders',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { status, q, limit, offset } = parseListQuery(req.query);
    const phoneDigits = /^\d{3,}$/.test(normalizePhone(q)) ? normalizePhone(q) : undefined;
    const { items, total } = await listOrders({ status, q, phoneDigits, limit, offset });
    sendOk(res, { items, total, limit, offset });
  })
);

function parseListQuery(query) {
  const one = (v) => (Array.isArray(v) ? v[0] : v);
  const fieldErrors = {};
  const intIn = (name, raw, min, max, fallback) => {
    if (raw === undefined || raw === '') return fallback;
    const n = Number(raw);
    if (!Number.isInteger(n) || n < min || n > max) {
      fieldErrors[name] = `باید عدد صحیح بین ${min} و ${max} باشد.`;
      return fallback;
    }
    return n;
  };

  const status = one(query.status) || undefined;
  if (status !== undefined && !ORDER_STATUSES.includes(status)) {
    fieldErrors.status = `باید یکی از ${ORDER_STATUSES.join(', ')} باشد.`;
  }
  const q = String(one(query.q) ?? '').trim().slice(0, 100) || undefined;
  const limit = intIn('limit', one(query.limit), 1, 200, 50);
  const offset = intIn('offset', one(query.offset), 0, Number.MAX_SAFE_INTEGER, 0);

  if (Object.keys(fieldErrors).length) throw Errors.validation('پارامترهای جست‌وجو نامعتبر است.', fieldErrors);
  return { status, q, limit, offset };
}

// One order with the metadata of its attached files (download them with
// GET /admin/uploads/:id).
adminOrdersRouter.get(
  '/admin/orders/:trackingCode',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const order = await findOrderByTrackingCode(req.params.trackingCode);
    if (!order) throw Errors.notFound('سفارشی با این کد پیدا نشد.');
    sendOk(res, {
      ...order,
      uploads: await listUploadsForOrder(order.id),
      history: await listOrderEvents(order.id)
    });
  })
);

adminOrdersRouter.patch(
  '/admin/orders/:trackingCode',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { trackingCode } = req.params;
    // customer_note is shown on /track; internal_notes never leaves the admin API.
    const {
      status,
      estimate_weeks: estimateWeeks,
      customer_note: customerNote,
      internal_notes: internalNotes
    } = req.body ?? {};

    if (status !== undefined && !ORDER_STATUSES.includes(status)) {
      throw Errors.validation('وضعیت نامعتبر است.', { status: `باید یکی از ${ORDER_STATUSES.join(', ')} باشد.` });
    }
    // null clears the estimate.
    if (estimateWeeks != null && !(Number.isInteger(estimateWeeks) && estimateWeeks >= 0)) {
      throw Errors.validation('برآورد هفته نامعتبر است.', { estimate_weeks: 'باید عدد صحیح و بزرگ‌تر یا مساوی صفر باشد.' });
    }
    for (const [field, value] of [['customer_note', customerNote], ['internal_notes', internalNotes]]) {
      if (value !== undefined && typeof value !== 'string') {
        throw Errors.validation('یادداشت نامعتبر است.', { [field]: 'باید متن باشد.' });
      }
    }

    const admin = { id: req.admin.sub, username: req.admin.username };
    const updated = await withTransaction((client) =>
      updateOrder(
        trackingCode,
        { status, estimate_weeks: estimateWeeks, customer_note: customerNote, internal_notes: internalNotes },
        admin,
        client
      )
    );
    if (!updated) throw Errors.notFound('سفارشی با این کد پیدا نشد.');
    sendOk(res, updated);
  })
);
