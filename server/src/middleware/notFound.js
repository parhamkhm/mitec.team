export function notFoundMiddleware(req, res) {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'مسیر پیدا نشد.', fieldErrors: null } });
}
