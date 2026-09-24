// POST /uploads — API_CONTRACT.md §3. Mirrors the limits the front end
// already enforces client-side (project/src/config/app.config.js `upload`),
// but the server is the real gate (its own §3 requirement).
import { Router } from 'express';
import multer from 'multer';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import { ENV } from '../env.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { sendOk } from '../lib/respond.js';
import { Errors } from '../lib/errors.js';
import { pool } from '../db/pool.js';
import { uploadLimiter } from '../middleware/rateLimit.js';

fs.mkdirSync(ENV.uploadDir, { recursive: true });

const EXT_BY_MIME = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'application/pdf': '.pdf'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, ENV.uploadDir),
  filename: (req, file, cb) => {
    const id = `f_${crypto.randomBytes(6).toString('hex')}`;
    req.uploadId = id;
    const ext = EXT_BY_MIME[file.mimetype] || path.extname(file.originalname) || '';
    cb(null, `${id}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: ENV.uploadMaxSizeMB * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!ENV.uploadAccept.includes(file.mimetype)) {
      return cb(Errors.unsupportedType('نوع فایل پشتیبانی نمی‌شود.'));
    }
    cb(null, true);
  }
});

export const uploadsRouter = Router();

uploadsRouter.post(
  '/uploads',
  uploadLimiter,
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw Errors.validation('فایلی ارسال نشده است.', { file: 'لازم است.' });

    const id = req.uploadId;
    await pool.query(
      'INSERT INTO uploads (id, filename, mime_type, size_bytes, storage_path) VALUES ($1, $2, $3, $4, $5)',
      [id, req.file.originalname, req.file.mimetype, req.file.size, req.file.path]
    );

    sendOk(res, { id, name: req.file.originalname, size: req.file.size, url: null }, 201);
  })
);
