// GET /pricing — public, no auth (API_CONTRACT.md §5).
import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { sendOk } from '../lib/respond.js';
import { Errors } from '../lib/errors.js';
import { getLatestPricing } from '../db/pricingRepo.js';

export const pricingRouter = Router();

pricingRouter.get(
  '/pricing',
  asyncHandler(async (req, res) => {
    const doc = await getLatestPricing();
    if (!doc) throw Errors.server('برآورد در دسترس نیست.');
    res.set('Cache-Control', 'public, max-age=300');
    sendOk(res, doc);
  })
);
