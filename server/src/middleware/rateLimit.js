import rateLimit from 'express-rate-limit';
import { ENV } from '../env.js';

const handler = (req, res) => {
  res.status(429).json({ error: { code: 'RATE_LIMITED', message: 'کمی بعد دوباره تلاش کنید.', fieldErrors: null } });
};

// Off only under NODE_ENV=test, where one test file places more orders than
// a real visitor would in a day; production never sets it.
const common = { standardHeaders: true, legacyHeaders: false, handler, skip: () => ENV.nodeEnv === 'test' };

// API_CONTRACT.md item 3: real POST /orders protection must be server-side
// (the front end only has a honeypot + a captcha slot). These windows are
// generous for a real visitor placing one order, tight for a script.
export const orderSubmitLimiter = rateLimit({ ...common, windowMs: 15 * 60 * 1000, max: 5 });
export const orderTrackLimiter = rateLimit({ ...common, windowMs: 15 * 60 * 1000, max: 20 });
export const uploadLimiter = rateLimit({ ...common, windowMs: 15 * 60 * 1000, max: 30 });
export const loginLimiter = rateLimit({ ...common, windowMs: 15 * 60 * 1000, max: 10 });
