import { APP_CONFIG } from '../config/app.config.js';
import { url } from './endpoints.js';
import { mockApi } from './mock.js';
import { toApiOrder, fromApiOrder } from './mapper.js';

// ---- documented hook, intentionally empty -------------------------------
// If the back end ever needs a token/header, fill this in. Nothing else in
// the app knows about auth, cookies or sessions.
function authHeaders() {
  return {};
}
// ------------------------------------------------------------------------

const ok = (data) => ({ ok: true, data, error: null });
const fail = (code, message, fieldErrors = null) => ({ ok: false, data: null, error: { code, message, fieldErrors } });

async function request(name, { method = 'GET', body, isForm = false } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), APP_CONFIG.timeoutMs);
  try {
    const res = await fetch(url(name), {
      method,
      signal: ctrl.signal,
      headers: { ...(isForm ? {} : { 'Content-Type': 'application/json' }), ...authHeaders() },
      body: isForm ? body : body ? JSON.stringify(body) : undefined
    });
    let json = null;
    try { json = await res.json(); } catch (_) { json = null; }
    if (!res.ok) {
      return fail(json?.error?.code || `HTTP_${res.status}`, json?.error?.message || 'خطا در ارتباط با سرور.', json?.error?.fieldErrors || null);
    }
    return ok(json?.data ?? json);
  } catch (e) {
    return fail(e.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR', 'ارتباط با سرور برقرار نشد.');
  } finally {
    clearTimeout(timer);
  }
}

export async function getCatalog() {
  if (APP_CONFIG.USE_MOCK) return mockApi.getCatalog();
  return request('catalog');
}

export async function submitOrder(selection, catalog) {
  const payload = toApiOrder(selection, catalog);
  const res = APP_CONFIG.USE_MOCK ? await mockApi.submitOrder(payload) : await request('submitOrder', { method: 'POST', body: payload });
  return res.ok ? ok(fromApiOrder(res.data)) : res;
}

export async function uploadFile(file) {
  if (APP_CONFIG.USE_MOCK) return mockApi.uploadFile(file);
  const form = new FormData();
  form.append('file', file);
  return request('uploadFile', { method: 'POST', body: form, isForm: true });
}

export async function trackOrder(code, phone) {
  const res = APP_CONFIG.USE_MOCK ? await mockApi.trackOrder(code, phone) : await request('trackOrder', { method: 'POST', body: { code, phone } });
  return res.ok ? ok(fromApiOrder(res.data)) : res;
}
