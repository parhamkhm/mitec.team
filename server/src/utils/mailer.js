import nodemailer from 'nodemailer';
import { ENV } from '../env.js';

let transporter = null;
function getTransporter() {
  if (!ENV.smtp.host || ENV.mailTo.length === 0) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: ENV.smtp.host,
      port: ENV.smtp.port,
      secure: ENV.smtp.secure,
      auth: ENV.smtp.user ? { user: ENV.smtp.user, pass: ENV.smtp.pass } : undefined
    });
  }
  return transporter;
}

// Best-effort: a failed notification must never fail order submission for
// the client (API_CONTRACT.md item 4 — "کامل سمت بک‌اند" — is about the team
// being notified, not about blocking the customer's request).
export async function sendNewOrderEmail(order) {
  const t = getTransporter();
  if (!t) {
    console.warn(`[mailer] SMTP not configured; skipping notification for ${order.tracking_code}`);
    return;
  }
  const lines = [
    `کد رهگیری: ${order.tracking_code}`,
    `نوع سایت: ${order.site_type}`,
    `نام کسب‌وکار: ${order.business_name}`,
    `تلفن: ${order.business_phone}`,
    order.business_field ? `زمینه‌ی فعالیت: ${order.business_field}` : null,
    order.business_handle ? `اینستاگرام/سایت: ${order.business_handle}` : null,
    order.business_desc ? `توضیحات: ${order.business_desc}` : null
  ].filter(Boolean);

  try {
    await t.sendMail({
      from: ENV.mailFrom,
      to: ENV.mailTo.join(', '),
      subject: `سفارش جدید — ${order.tracking_code}`,
      text: lines.join('\n')
    });
  } catch (e) {
    console.error(`[mailer] failed to send notification for ${order.tracking_code}:`, e.message);
  }
}
