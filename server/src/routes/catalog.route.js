// GET /catalog is optional per API_CONTRACT.md §1: if not implemented, the
// front end falls back to its own copy of project/src/config/order-catalog.json.
// We implement it anyway, reading the very same file, so there is exactly one
// source of truth instead of two copies to keep in sync.
import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { asyncHandler } from '../lib/asyncHandler.js';
import { sendOk } from '../lib/respond.js';
import { Errors } from '../lib/errors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, '..', '..', '..', 'project', 'src', 'config', 'order-catalog.json');

export const catalogRouter = Router();

catalogRouter.get(
  '/catalog',
  asyncHandler(async (req, res) => {
    let raw;
    try {
      raw = fs.readFileSync(CATALOG_PATH, 'utf8');
    } catch {
      throw Errors.server('کاتالوگ در دسترس نیست.');
    }
    res.set('Cache-Control', 'public, max-age=300');
    sendOk(res, JSON.parse(raw));
  })
);
