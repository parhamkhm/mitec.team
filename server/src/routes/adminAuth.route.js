import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool.js';
import { ENV } from '../env.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { sendOk } from '../lib/respond.js';
import { Errors } from '../lib/errors.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { loginLimiter } from '../middleware/rateLimit.js';

export const adminAuthRouter = Router();

const COOKIE_NAME = 'mitec_admin';

// Parses simple durations like "12h", "30m", "7d" into milliseconds.
function durationMs(v, fallbackMs) {
  const m = /^(\d+)(s|m|h|d)$/.exec(String(v).trim());
  if (!m) return fallbackMs;
  const n = Number(m[1]);
  const mult = { s: 1000, m: 60000, h: 3600000, d: 86400000 }[m[2]];
  return n * mult;
}
const COOKIE_MAX_AGE = durationMs(ENV.jwtExpiresIn, 12 * 3600000);

function setAdminCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: ENV.cookieSecure,
    sameSite: ENV.cookieSecure ? 'none' : 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/'
  });
}

adminAuthRouter.post(
  '/admin/login',
  loginLimiter,
  asyncHandler(async (req, res) => {
    const username = String(req.body?.username ?? '').trim();
    const password = String(req.body?.password ?? '');
    if (!username || !password) {
      const fieldErrors = {};
      if (!username) fieldErrors.username = 'لازم است.';
      if (!password) fieldErrors.password = 'لازم است.';
      throw Errors.validation('نام کاربری و رمز عبور لازم است.', fieldErrors);
    }

    const { rows } = await pool.query('SELECT id, username, password_hash FROM admin_users WHERE username = $1', [username]);
    const user = rows[0];
    if (!user) throw Errors.invalidCredentials();

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw Errors.invalidCredentials();

    const token = jwt.sign({ sub: user.id, username: user.username }, ENV.jwtSecret, { expiresIn: ENV.jwtExpiresIn });
    setAdminCookie(res, token);
    sendOk(res, { username: user.username });
  })
);

adminAuthRouter.post('/admin/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  sendOk(res, { ok: true });
});

adminAuthRouter.get('/admin/me', requireAdmin, (req, res) => {
  sendOk(res, { username: req.admin.username });
});
