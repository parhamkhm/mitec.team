import multer from 'multer';
import { AppError, Errors } from '../lib/errors.js';

// eslint-disable-next-line no-unused-vars
export function errorHandlerMiddleware(err, req, res, next) {
  if (err instanceof AppError) {
    const body = { error: { code: err.code, message: err.message, fieldErrors: err.fieldErrors ?? null } };
    if (err.code === 'VERSION_CONFLICT') body.error.currentVersion = err.currentVersion;
    return res.status(err.status).json(body);
  }

  if (err instanceof multer.MulterError) {
    const mapped =
      err.code === 'LIMIT_FILE_SIZE'
        ? Errors.fileTooLarge('حجم فایل بیش از حد مجاز است.')
        : Errors.validation('بارگذاری فایل ناموفق بود.');
    return res.status(mapped.status).json({ error: { code: mapped.code, message: mapped.message, fieldErrors: mapped.fieldErrors } });
  }

  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'بدنه‌ی درخواست نامعتبر است.', fieldErrors: null } });
  }

  console.error(err);
  return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'خطایی رخ داد. لطفاً دوباره تلاش کنید.', fieldErrors: null } });
}
