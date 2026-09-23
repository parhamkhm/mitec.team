import { APP_CONFIG } from '../config/app.config.js';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const ok = (data) => ({ ok: true, data, error: null });
const fail = (code, message, fieldErrors = null) => ({ ok: false, data: null, error: { code, message, fieldErrors } });

const digits = '۰۱۲۳۴۵۶۷۸۹';
const fakeCode = () => 'MTC-' + Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join('');

export const mockApi = {
  async getCatalog() {
    await wait(300);
    const res = await fetch(new URL('../config/order-catalog.json', import.meta.url));
    return ok(await res.json());
  },

  async getPricing() {
    await wait(300);
    try {
      const res = await fetch(new URL('../config/pricing.json', import.meta.url));
      if (!res.ok) return fail(`HTTP_${res.status}`, 'برآورد در دسترس نیست.');
      return ok(await res.json());
    } catch (e) {
      return fail('NETWORK_ERROR', 'برآورد در دسترس نیست.');
    }
  },

  async submitOrder(payload) {
    await wait(900);
    if (!payload?.business?.phone) {
      return fail('VALIDATION_ERROR', 'اطلاعات تماس کامل نیست.', { phone: 'شماره موبایل لازم است.' });
    }
    // Sample failure path: any phone ending in 0000 simulates a server error.
    if (/0000$/.test(payload.business.phone)) {
      return fail('SERVER_ERROR', 'ثبت سفارش انجام نشد. لطفاً دوباره تلاش کنید.');
    }
    return ok({ tracking_code: fakeCode(), status: 'received', created_at: new Date().toISOString() });
  },

  async uploadFile(file) {
    await wait(600);
    if (file.size > APP_CONFIG.upload.maxSizeMB * 1024 * 1024) {
      return fail('FILE_TOO_LARGE', 'حجم فایل بیش از حد مجاز است.');
    }
    return ok({ id: 'f_' + Math.random().toString(36).slice(2, 9), name: file.name, size: file.size, url: null });
  },

  async trackOrder(code) {
    await wait(700);
    if (!/^MTC-\d{5}$/.test(code)) return fail('NOT_FOUND', 'سفارشی با این کد پیدا نشد.');
    return ok({ tracking_code: code, status: 'in_design', status_label: 'در مرحله طراحی', created_at: new Date().toISOString(), estimate_weeks: 3, notes: '' });
  }
};
