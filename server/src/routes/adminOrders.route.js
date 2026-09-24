// Not part of API_CONTRACT.md, which only specifies the customer-facing
// shape — but /orders/track is meaningless if status never moves past
// "received", so the admin panel needs a minimal way to update it.
import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { sendOk } from '../lib/respond.js';
import { Errors } from '../lib/errors.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { listOrders, updateOrderStatus } from '../db/ordersRepo.js';
import { ORDER_STATUSES, STATUS_LABELS } from '../constants/orderStatus.js';

export const adminOrdersRouter = Router();

adminOrdersRouter.get(
  '/admin/orders',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const status = typeof req.query.status === 'string' && ORDER_STATUSES.includes(req.query.status) ? req.query.status : undefined;
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const offset = Number(req.query.offset) || 0;
    const orders = await listOrders({ status, limit, offset });
    sendOk(res, orders);
  })
);

adminOrdersRouter.patch(
  '/admin/orders/:trackingCode',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { trackingCode } = req.params;
    const { status, estimate_weeks: estimateWeeks, notes } = req.body ?? {};

    if (status !== undefined && !ORDER_STATUSES.includes(status)) {
      throw Errors.validation('وضعیت نامعتبر است.', { status: `باید یکی از ${ORDER_STATUSES.join(', ')} باشد.` });
    }
    if (estimateWeeks !== undefined && !(Number.isInteger(estimateWeeks) && estimateWeeks >= 0)) {
      throw Errors.validation('برآورد هفته نامعتبر است.', { estimate_weeks: 'باید عدد صحیح و بزرگ‌تر یا مساوی صفر باشد.' });
    }

    const updated = await updateOrderStatus(trackingCode, {
      status,
      statusLabel: status ? STATUS_LABELS[status] : undefined,
      estimateWeeks,
      notes
    });
    if (!updated) throw Errors.notFound('سفارشی با این کد پیدا نشد.');
    sendOk(res, updated);
  })
);
