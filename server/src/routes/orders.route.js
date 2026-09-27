import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { sendOk } from '../lib/respond.js';
import { Errors } from '../lib/errors.js';
import { ENV } from '../env.js';
import { assertValidOrder, assertValidTrackRequest } from '../validation/orderSchema.js';
import { createOrder, findOrderByTrackingCode } from '../db/ordersRepo.js';
import { claimUploads } from '../db/uploadsRepo.js';
import { withTransaction } from '../db/pool.js';
import { sendNewOrderEmail } from '../utils/mailer.js';
import { orderSubmitLimiter, orderTrackLimiter } from '../middleware/rateLimit.js';

export const ordersRouter = Router();

// POST /orders — API_CONTRACT.md §2.
ordersRouter.post(
  '/orders',
  orderSubmitLimiter,
  asyncHandler(async (req, res) => {
    const order = assertValidOrder(req.body);
    // The order and its attachments are saved together: if any attachment id
    // is unknown or taken, no order is created.
    const saved = await withTransaction(async (client) => {
      const row = await createOrder(order, client);
      await claimUploads(order.attachments.map((a) => a.id), row.id, client);
      return row;
    });

    // Best-effort; sendNewOrderEmail never throws (it logs and swallows).
    sendNewOrderEmail(saved);

    sendOk(
      res,
      { tracking_code: saved.tracking_code, status: saved.status, created_at: saved.created_at },
      201
    );
  })
);

// POST /orders/track — API_CONTRACT.md §4 (proposal).
ordersRouter.post(
  '/orders/track',
  orderTrackLimiter,
  asyncHandler(async (req, res) => {
    const { code, phone } = assertValidTrackRequest(req.body);
    const order = await findOrderByTrackingCode(code);

    // Never reveal whether the code exists when the phone doesn't match —
    // same NOT_FOUND either way, per API_CONTRACT.md's error-code table.
    const phoneOk = !ENV.trackRequiresPhone || (phone && phone === order?.business_phone);
    if (!order || !phoneOk) throw Errors.notFound('سفارشی با این کد پیدا نشد.');

    sendOk(res, {
      tracking_code: order.tracking_code,
      status: order.status,
      status_label: order.status_label,
      created_at: order.created_at,
      estimate_weeks: order.estimate_weeks,
      // The contract's `notes` is the customer-facing note only —
      // internal_notes must never appear in this response.
      notes: order.customer_note
    });
  })
);
