import rateLimit from 'express-rate-limit';

const handler = (req, res) => {
  res.status(429).json({ error: { code: 'RATE_LIMITED', message: 'کمی بعد دوباره تلاش کنید.', fieldErrors: null } });
};

// API_CONTRACT.md item 3: real POST /orders protection must be server-side
// (the front end only has a honeypot + a captcha slot). These windows are
// generous for a real visitor placing one order, tight for a script.
export const orderSubmitLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false, handler });
export const orderTrackLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false, handler });
export const uploadLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false, handler });
export const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false, handler });
