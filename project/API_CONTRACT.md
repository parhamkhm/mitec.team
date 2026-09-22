# API_CONTRACT.md — a *proposal* from the front end

این سند یک **پیشنهاد** است، نه تصمیم. توسعه‌دهنده بک‌اند می‌تواند هر بخشی را تغییر دهد یا رد کند.
اگر مسیرها، نام فیلدها یا ساختار پاسخ متفاوت شد، فقط دو فایل در فرانت‌اند تغییر می‌کند:
`src/config/app.config.js` (مسیرها و URL) و `src/api/mapper.js` (شکل داده).

## Ground rules the front end follows

- فرانت‌اند هیچ فرضی درباره‌ی احراز هویت، توکن، کوکی یا سشن ندارد.
- تنها لایه‌ای که با سرور حرف می‌زند `src/api/` است.
- هر پاسخ در فرانت‌اند به این شکل ثابت نرمال می‌شود:

```json
{ "ok": true,  "data": { }, "error": null }
{ "ok": false, "data": null, "error": { "code": "VALIDATION_ERROR", "message": "…", "fieldErrors": { "phone": "…" } } }
```

خطای شبکه، خطای HTTP و خطای اعتبارسنجی سرور همه به همین شکل تبدیل می‌شوند.

## 1. GET /catalog — optional

اگر پیاده نشود، فرانت‌اند از `src/config/order-catalog.json` استفاده می‌کند.
پاسخ: همان ساختار فایل کاتالوگ (`siteTypes`, `templates`, `sections`, `features`, `colors`, `fonts`, `estimates`).

## 2. POST /orders — submit an order

درخواست (خروجی `toApiOrder()`):

```json
{
  "site_type": "menu",
  "template": "menu-list",
  "mixed_description": "",
  "sections": ["gallery", "faq"],
  "features": ["loyalty", "seo"],
  "style": { "color": "green", "font": "vazirmatn" },
  "assets": { "has_logo": true, "has_content": false },
  "business": {
    "name": "کافه مری",
    "field": "کافه",
    "instagram_or_site": "@mery.cafe",
    "references": "…",
    "description": "…",
    "phone": "09120000000"
  },
  "attachments": [{ "id": "f_ab12cd3" }],
  "meta": { "locale": "fa-IR", "source": "web-order-builder" }
}
```

فیلدهای لازم: `site_type`, `business.name`, `business.phone`.

پاسخ پیشنهادی:

```json
{ "tracking_code": "MTC-48213", "status": "received", "created_at": "2026-03-01T10:00:00Z" }
```

## 3. POST /uploads — file upload

`multipart/form-data` با فیلد `file`. پاسخ پیشنهادی:

```json
{ "id": "f_ab12cd3", "name": "logo.png", "size": 20480, "url": null }
```

محدودیت‌ها در فرانت‌اند از `app.config.js` خوانده می‌شود (حجم و نوع فایل). **لطفاً همان محدودیت‌ها سمت سرور هم اعمال شود.**

## 4. POST /orders/track — tracking by code

```json
{ "code": "MTC-48213", "phone": "09120000000" }
```

`phone` فقط اگر `TRACK_REQUIRES_PHONE` روشن باشد ارسال می‌شود. پاسخ پیشنهادی:

```json
{ "tracking_code": "MTC-48213", "status": "in_design", "status_label": "در مرحله طراحی", "created_at": "…", "estimate_weeks": 3, "notes": "" }
```

## Error codes the UI already handles

| code | UI behaviour |
|---|---|
| `VALIDATION_ERROR` | `fieldErrors` زیر همان فیلد نمایش داده می‌شود |
| `NOT_FOUND` | «سفارشی با این کد پیدا نشد» |
| `FILE_TOO_LARGE`, `UNSUPPORTED_TYPE` | خطا روی فایل |
| `RATE_LIMITED` | پیام «کمی بعد دوباره تلاش کنید» |
| `SERVER_ERROR`, `HTTP_5xx` | امکان تلاش مجدد، انتخاب‌های کاربر حفظ می‌شود |
| `NETWORK_ERROR`, `TIMEOUT` | همان بالا |

## Requirements the front end needs from the back end

1. کد رهگیری یکتا و قابل خواندن (الگوی فعلی فرانت‌اند: `MTC-` + پنج رقم).
2. اعتبارسنجی سمت سرور برای شماره موبایل ایرانی و نوع/حجم فایل.
3. محدودیت نرخ (rate limit) روی `POST /orders` — فرانت‌اند honeypot و جای کپچا دارد، ولی محافظت واقعی سمت سرور است.
4. اعلان ثبت سفارش برای تیم (تلگرام/ایمیل) — کامل سمت بک‌اند.
5. CORS برای دامنه‌ی سایت، اگر API روی دامنه‌ی دیگری است.
