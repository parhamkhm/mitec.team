// Validates + normalizes the POST /orders body (API_CONTRACT.md §2, the
// shape `toApiOrder()` sends). Required fields per the contract:
// site_type, business.name, business.phone.
import { Errors } from '../lib/errors.js';
import { ENV } from '../env.js';
import { isIranMobile, normalizePhone } from '../utils/phone.js';

const str = (v) => (typeof v === 'string' ? v : '');
const strArray = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []);
const int = (v) => (Number.isInteger(v) ? v : null);

export function assertValidOrder(body) {
  const b = body && typeof body === 'object' ? body : {};
  const business = b.business && typeof b.business === 'object' ? b.business : {};
  const fieldErrors = {};

  const siteType = str(b.site_type).trim();
  if (!siteType) fieldErrors.site_type = 'نوع سایت لازم است.';

  const name = str(business.name).trim();
  if (!name) fieldErrors.name = 'نام کسب‌وکار لازم است.';

  const phoneRaw = str(business.phone).trim();
  if (!phoneRaw) {
    fieldErrors.phone = 'شماره موبایل لازم است.';
  } else if (!isIranMobile(phoneRaw)) {
    fieldErrors.phone = 'شماره موبایل معتبر نیست.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw Errors.validation('اطلاعات تماس کامل نیست.', fieldErrors);
  }

  const style = b.style && typeof b.style === 'object' ? b.style : {};
  const assets = b.assets && typeof b.assets === 'object' ? b.assets : {};
  const meta = b.meta && typeof b.meta === 'object' ? b.meta : {};
  const attachments = assertValidAttachments(b.attachments);

  return {
    site_type: siteType,
    pages: int(b.pages),
    addons: strArray(b.addons),
    pricing_version: int(b.pricing_version),
    template: b.template ? str(b.template) : null,
    mixed_description: str(b.mixed_description),
    sections: strArray(b.sections),
    features: strArray(b.features),
    style: { color: style.color ? str(style.color) : null, font: style.font ? str(style.font) : null },
    assets: { has_logo: typeof assets.has_logo === 'boolean' ? assets.has_logo : null, has_content: typeof assets.has_content === 'boolean' ? assets.has_content : null },
    business: {
      name,
      field: str(business.field),
      instagram_or_site: str(business.instagram_or_site),
      references: str(business.references),
      description: str(business.description),
      phone: normalizePhone(phoneRaw)
    },
    attachments,
    meta: { ...meta, locale: meta.locale || 'fa-IR', source: meta.source || 'web-order-builder' }
  };
}

// Shape only: ids as POST /uploads issues them, de-duplicated, at most
// UPLOAD_MAX_FILES. Whether each id was really uploaded and is still free is
// checked against the database when the order is saved (claimUploads).
const UPLOAD_ID = /^f_[0-9a-f]{12}$/;

function assertValidAttachments(value) {
  if (value == null) return [];
  if (!Array.isArray(value)) {
    throw Errors.validation('فایل‌های پیوست نامعتبر است.', { attachments: 'باید فهرست باشد.' });
  }
  const ids = [...new Set(value.map((a) => (a && typeof a === 'object' ? a.id : a)))];
  if (ids.some((id) => typeof id !== 'string' || !UPLOAD_ID.test(id))) {
    throw Errors.validation('فایل‌های پیوست نامعتبر است.', { attachments: 'شناسه‌ی فایل نامعتبر است.' });
  }
  if (ids.length > ENV.uploadMaxFiles) {
    throw Errors.validation('تعداد فایل‌های پیوست زیاد است.', {
      attachments: `حداکثر ${ENV.uploadMaxFiles} فایل.`
    });
  }
  return ids.map((id) => ({ id }));
}

export function assertValidTrackRequest(body) {
  const b = body && typeof body === 'object' ? body : {};
  const code = str(b.code).trim();
  if (!/^MTC-\d{5}$/.test(code)) {
    throw Errors.notFound('سفارشی با این کد پیدا نشد.');
  }
  const phone = b.phone != null ? normalizePhone(str(b.phone).trim()) : null;
  return { code, phone };
}
