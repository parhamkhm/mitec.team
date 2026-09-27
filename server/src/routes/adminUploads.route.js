// GET /admin/uploads/:id — lets the team open a customer's attached file.
//
// Uploads come from anonymous visitors and their type is whatever the
// browser declared, so the response is locked down: nosniff (helmet) keeps
// the browser from second-guessing the type, a sandboxing CSP means even a
// disguised HTML file can't run as a page on this origin, and only raster
// images are shown inline — everything else is a download.
import fs from 'node:fs';
import path from 'node:path';
import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { Errors } from '../lib/errors.js';
import { ENV } from '../env.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { findUpload } from '../db/uploadsRepo.js';

export const adminUploadsRouter = Router();

const INLINE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);
const UPLOAD_ID = /^f_[0-9a-f]{12}$/;

// RFC 6266 / 5987: an ASCII fallback plus the real (often Persian) name.
function contentDisposition(type, filename) {
  const ascii = filename.replace(/[^\x20-\x7e]|["\\]/g, '_');
  return `${type}; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

adminUploadsRouter.get(
  '/admin/uploads/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const notFound = Errors.notFound('فایل پیدا نشد.');
    if (!UPLOAD_ID.test(req.params.id)) throw notFound;
    const upload = await findUpload(req.params.id);
    if (!upload) throw notFound;

    // storage_path comes from our own database, but never serve anything
    // outside UPLOAD_DIR regardless.
    const root = path.resolve(ENV.uploadDir);
    const file = path.resolve(upload.storage_path);
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) throw notFound;

    const inline = INLINE_TYPES.has(upload.mime_type);
    res.set({
      'Content-Type': upload.mime_type,
      'Content-Disposition': contentDisposition(inline ? 'inline' : 'attachment', upload.filename),
      'Content-Security-Policy': "default-src 'none'; img-src 'self'; sandbox",
      'Cache-Control': 'private, no-store'
    });
    res.sendFile(file);
  })
);
