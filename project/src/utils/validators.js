import { toEn } from './persian-digits.js';
import { APP_CONFIG } from '../config/app.config.js';

export const isIranMobile = (v) => /^09\d{9}$/.test(toEn(v).replace(/[\s-]/g, ''));

export const isRequired = (v) => String(v ?? '').trim().length > 0;

export function checkFile(file) {
  const { maxSizeMB, accept } = APP_CONFIG.upload;
  if (!accept.includes(file.type)) return 'نوع فایل پشتیبانی نمی‌شود.';
  if (file.size > maxSizeMB * 1024 * 1024) return `حجم فایل باید کمتر از ${maxSizeMB} مگابایت باشد.`;
  return null;
}
