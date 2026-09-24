// GET/PUT /admin/pricing — API_CONTRACT.md §6.
import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { sendOk } from '../lib/respond.js';
import { Errors } from '../lib/errors.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { getLatestPricing, insertPricingVersion, withPricingLock } from '../db/pricingRepo.js';
import { assertValidPricingDocument } from '../validation/pricingSchema.js';

export const adminPricingRouter = Router();

adminPricingRouter.get(
  '/admin/pricing',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const doc = await getLatestPricing();
    if (!doc) throw Errors.server('سند قیمت‌گذاری موجود نیست.');
    sendOk(res, doc);
  })
);

adminPricingRouter.put(
  '/admin/pricing',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const incoming = req.body;
    if (!incoming || typeof incoming !== 'object' || !Number.isInteger(incoming.version)) {
      throw Errors.validation('سند قیمت‌گذاری نامعتبر است.', { version: 'لازم است.' });
    }

    const saved = await withPricingLock(async (client) => {
      const current = await getLatestPricing(client);
      const currentVersion = current?.version ?? 0;

      if (incoming.version !== currentVersion) {
        throw Errors.versionConflict('نسخه‌ی سند تغییر کرده است. دوباره بارگذاری کنید.', currentVersion);
      }

      const nextVersion = currentVersion + 1;
      const nextDoc = { ...incoming, version: nextVersion, updatedAt: new Date().toISOString() };
      assertValidPricingDocument(nextDoc);

      const row = await insertPricingVersion(nextVersion, nextDoc, client);
      return row.document;
    });

    sendOk(res, saved);
  })
);
