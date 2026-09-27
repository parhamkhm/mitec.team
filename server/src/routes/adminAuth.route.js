import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../env.js';
import {
  findAdminById,
  findAdminByUsername,
  recordFailedLogin,
  recordSuccessfulLogin,
  setAdminPassword
} from '../db/adminUsersRepo.js';
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

const BCRYPT_COST = 12;
const MIN_PASSWORD_LENGTH = 10;
const MAX_PASSWORD_BYTES = 72;
// Compared against when the username doesn't exist; see /admin/login.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', BCRYPT_COST);

// `sv` must match admin_users.session_version for requireAdmin to accept it.
function signSession(id, username, sessionVersion) {
  return jwt.sign({ sub: id, username, sv: sessionVersion }, ENV.jwtSecret, { expiresIn: ENV.jwtExpiresIn });
}

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

    const user = await findAdminByUsername(username);

    // While locked, the password isn't even checked. (This does tell a caller
    // that the username exists; the per-IP limit still applies to them.)
    if (user?.locked_until && new Date(user.locked_until) > new Date()) {
      throw Errors.rateLimited('به‌خاطر چند ورود ناموفق، این حساب موقتاً قفل شده است. کمی بعد دوباره تلاش کنید.');
    }

    // Always run bcrypt, against a dummy hash for an unknown username, so the
    // response time doesn't reveal which usernames exist.
    const valid = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);
    if (!user || !valid) {
      if (user) await recordFailedLogin(user.id);
      throw Errors.invalidCredentials();
    }

    await recordSuccessfulLogin(user.id);
    setAdminCookie(res, signSession(user.id, user.username, user.session_version));
    sendOk(res, { username: user.username });
  })
);

// Change your own password. Ends every other session (session_version is
// bumped) and re-issues this one's cookie so the caller stays signed in.
adminAuthRouter.post(
  '/admin/password',
  loginLimiter,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const current = String(req.body?.current_password ?? '');
    const newPassword = String(req.body?.new_password ?? '');

    const fieldErrors = {};
    if (!current) fieldErrors.current_password = 'لازم است.';
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      fieldErrors.new_password = `حداقل ${MIN_PASSWORD_LENGTH} نویسه.`;
    } else if (Buffer.byteLength(newPassword, 'utf8') > MAX_PASSWORD_BYTES) {
      // bcrypt silently ignores everything past 72 bytes (36 Persian letters).
      fieldErrors.new_password = 'رمز عبور خیلی بلند است.';
    } else if (newPassword === current) {
      fieldErrors.new_password = 'رمز جدید باید با رمز فعلی فرق داشته باشد.';
    }
    if (Object.keys(fieldErrors).length) throw Errors.validation('رمز عبور نامعتبر است.', fieldErrors);

    const user = await findAdminById(req.admin.sub);
    if (!(await bcrypt.compare(current, user.password_hash))) {
      throw Errors.validation('رمز فعلی اشتباه است.', { current_password: 'اشتباه است.' });
    }

    const sessionVersion = await setAdminPassword(user.id, await bcrypt.hash(newPassword, BCRYPT_COST));
    setAdminCookie(res, signSession(user.id, user.username, sessionVersion));
    sendOk(res, { ok: true });
  })
);

adminAuthRouter.post('/admin/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  sendOk(res, { ok: true });
});

adminAuthRouter.get('/admin/me', requireAdmin, (req, res) => {
  sendOk(res, { username: req.admin.username });
});
