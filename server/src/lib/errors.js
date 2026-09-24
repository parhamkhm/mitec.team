// Error codes the front end already understands (see API_CONTRACT.md,
// "Error codes the UI already handles", and src/api/client.js). Any code
// not in that table falls back to generic server-error handling in the UI.
export class AppError extends Error {
  constructor(code, message, { status = 400, fieldErrors = null, currentVersion = null } = {}) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.fieldErrors = fieldErrors;
    // Only meaningful for VERSION_CONFLICT: the version the panel must reload.
    this.currentVersion = currentVersion;
  }
}

export const Errors = {
  validation: (message, fieldErrors = null) => new AppError('VALIDATION_ERROR', message, { status: 422, fieldErrors }),
  notFound: (message) => new AppError('NOT_FOUND', message, { status: 404 }),
  fileTooLarge: (message) => new AppError('FILE_TOO_LARGE', message, { status: 413 }),
  unsupportedType: (message) => new AppError('UNSUPPORTED_TYPE', message, { status: 415 }),
  rateLimited: (message) => new AppError('RATE_LIMITED', message, { status: 429 }),
  server: (message = 'خطایی رخ داد. لطفاً دوباره تلاش کنید.') => new AppError('SERVER_ERROR', message, { status: 500 }),
  versionConflict: (message, currentVersion) => new AppError('VERSION_CONFLICT', message, { status: 409, currentVersion }),
  unauthorized: (message = 'ورود لازم است.') => new AppError('UNAUTHORIZED', message, { status: 401 }),
  invalidCredentials: (message = 'نام کاربری یا رمز عبور اشتباه است.') => new AppError('INVALID_CREDENTIALS', message, { status: 401 })
};
