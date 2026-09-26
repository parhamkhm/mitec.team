import 'dotenv/config';

function list(v) {
  return (v || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export const ENV = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins: list(process.env.ALLOWED_ORIGINS),

  databaseUrl: process.env.DATABASE_URL || '',

  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '12h',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  adminSeedAccounts: list(process.env.ADMIN_SEED_ACCOUNTS),

  trackRequiresPhone: process.env.TRACK_REQUIRES_PHONE !== 'false',

  uploadDir: process.env.UPLOAD_DIR || './uploads',
  uploadMaxSizeMB: Number(process.env.UPLOAD_MAX_SIZE_MB || 8),
  uploadMaxFiles: Number(process.env.UPLOAD_MAX_FILES || 5),
  uploadAccept: list(process.env.UPLOAD_ACCEPT || 'image/png,image/jpeg,image/webp,application/pdf'),

  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  },
  mailFrom: process.env.MAIL_FROM || 'mitec <no-reply@mitec.team>',
  mailTo: list(process.env.MAIL_TO)
};

if (ENV.nodeEnv === 'production') {
  const missing = ['databaseUrl', 'jwtSecret'].filter((k) => !ENV[k]);
  if (missing.length) {
    throw new Error(`Missing required environment variables in production: ${missing.join(', ')}`);
  }
}
