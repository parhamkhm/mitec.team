import jwt from 'jsonwebtoken';
import { ENV } from '../env.js';
import { Errors } from '../lib/errors.js';
import { findAdminById } from '../db/adminUsersRepo.js';

// A valid signature isn't enough: the account must still exist and the
// token's session version must match, so a password change (which bumps it)
// or a removed account ends the session immediately rather than at expiry.
export async function requireAdmin(req, res, next) {
  const token = req.cookies?.mitec_admin;
  if (!token) return next(Errors.unauthorized());
  let payload;
  try {
    payload = jwt.verify(token, ENV.jwtSecret);
  } catch {
    return next(Errors.unauthorized('نشست منقضی شده است. دوباره وارد شوید.'));
  }
  try {
    const user = await findAdminById(payload.sub);
    if (!user || user.session_version !== payload.sv) {
      return next(Errors.unauthorized('نشست منقضی شده است. دوباره وارد شوید.'));
    }
    req.admin = { sub: user.id, username: user.username };
    next();
  } catch (e) {
    next(e);
  }
}
