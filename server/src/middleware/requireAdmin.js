import jwt from 'jsonwebtoken';
import { ENV } from '../env.js';
import { Errors } from '../lib/errors.js';

export function requireAdmin(req, res, next) {
  const token = req.cookies?.mitec_admin;
  if (!token) return next(Errors.unauthorized());
  try {
    req.admin = jwt.verify(token, ENV.jwtSecret);
    next();
  } catch {
    next(Errors.unauthorized('نشست منقضی شده است. دوباره وارد شوید.'));
  }
}
