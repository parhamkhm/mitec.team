// mitec — Persian formatting for prices and durations. The currency, its
// divisor, the «from» word and the duration unit all come from the pricing
// document; nothing here knows about tomans or days.

// Persian digits with the Persian separators (٬ thousands, ٫ decimals).
export const faNumber = (n, fractionDigits = 0) =>
  new Intl.NumberFormat('fa-IR', { maximumFractionDigits: fractionDigits }).format(n);

// Fills {name} placeholders in a template from the data: fill('{n} صفحه', { n: '۵' }).
export const fill = (template, vars = {}) =>
  String(template ?? '').replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));

// «از ۲۴ میلیون تومان». Below one divisor unit the whole amount is shown,
// with thousands separators: «از ۸۵۰٬۰۰۰ تومان».
// currency: { unit, divisor, suffix, from } from the pricing document.
export function formatPrice(toman, currency = {}) {
  const { divisor = 1, suffix = '', unit = '', from = '' } = currency;
  const amount = divisor > 1 && toman >= divisor
    ? `${faNumber(toman / divisor, 1)} ${suffix}`
    : `${faNumber(toman)} ${unit}`;
  return [from, amount.trim()].filter(Boolean).join(' ');
}

// «حدود ۱۲ روز کاری». unit: { prefix, label } from the document's display.
export function formatDuration(days, unit = {}) {
  return [unit.prefix, faNumber(days), unit.label].filter(Boolean).join(' ');
}
