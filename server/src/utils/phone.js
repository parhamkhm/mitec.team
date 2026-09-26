// Mirrors project/src/utils/validators.js `isIranMobile` (front end already
// enforces this client-side; API_CONTRACT.md item 2 asks the server to as
// well). Persian digits are normalised to ASCII first.
const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
function toEn(v) {
  return String(v ?? '').replace(/[۰-۹]/g, (d) => String(persianDigits.indexOf(d)));
}

export function normalizePhone(v) {
  return toEn(v).replace(/[\s-]/g, '');
}

export function isIranMobile(v) {
  return /^09\d{9}$/.test(normalizePhone(v));
}
