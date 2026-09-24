# mitec — بک‌اند

پیاده‌سازی «پیشنهاد» فرانت‌اند در `project/API_CONTRACT.md`: Node.js + Express، PostgreSQL.
مطابق آن سند، خیلی از تصمیم‌های شکل داده‌ی این سرویس محلی است؛ اگر چیزی فرق کرد فقط دو فایل در فرانت‌اند
عوض می‌شود: `project/src/config/app.config.js` و `project/src/api/mapper.js`.

## اجرا (محلی)

```bash
cd server
npm install
cp .env.example .env   # مقادیر را پر کنید (حداقل DATABASE_URL و JWT_SECRET)

# یک دیتابیس PostgreSQL بسازید، مثلاً با Docker:
docker run --name mitec-db -e POSTGRES_USER=mitec -e POSTGRES_PASSWORD=mitec -e POSTGRES_DB=mitec -p 5432:5432 -d postgres:16

npm run migrate        # جدول‌ها را می‌سازد
npm run seed:pricing   # نسخه‌ی ۱ قیمت‌گذاری را از project/src/config/pricing.json وارد می‌کند
npm run seed:admin     # حساب‌های ADMIN_SEED_ACCOUNTS در .env را می‌سازد

npm run dev            # http://127.0.0.1:4000
```

سلامت سرویس: `GET /health`.

## وصل کردن فرانت‌اند

در `project/src/config/app.config.js`:

```js
API_BASE_URL: 'http://127.0.0.1:4000',  // یا دامنه‌ی واقعی سرویس در پروداکشن
USE_MOCK: false,
```

مسیرهای `endpoints` همان‌هایی هستند که همین سرویس پیاده کرده (`/catalog`, `/pricing`, `/orders`,
`/uploads`, `/orders/track`) و نیازی به تغییر ندارند. اگر سرویس پشت یک دامنه‌ی دیگر است (CORS)،
دامنه‌ی سایت را به `ALLOWED_ORIGINS` در `.env` اضافه کنید.

## نقشه‌ی مسیرها

| مسیر | روش | توضیح |
|---|---|---|
| `/health` | GET | بررسی سلامت |
| `/catalog` | GET | فایل `order-catalog.json` (اختیاری در قرارداد؛ فرانت‌اند بدون آن هم از نسخه‌ی محلی خودش استفاده می‌کند) |
| `/pricing` | GET | آخرین سند قیمت‌گذاری، بدون احراز هویت |
| `/orders` | POST | ثبت سفارش؛ کد رهگیری تولید می‌کند و ایمیل اطلاع‌رسانی می‌فرستد |
| `/orders/track` | POST | پیگیری با کد + شماره موبایل (`TRACK_REQUIRES_PHONE` در `.env`) |
| `/uploads` | POST | آپلود یک فایل (`multipart/form-data`, فیلد `file`) |
| `/admin/login` | POST | ورود ادمین؛ کوکی `httpOnly` می‌گذارد |
| `/admin/logout` | POST | خروج |
| `/admin/me` | GET | کاربر جاری (نیاز به ورود) |
| `/admin/pricing` | GET, PUT | خواندن/ذخیره‌ی کل سند قیمت‌گذاری (نیاز به ورود؛ `PUT` نسخه‌بندی خوش‌بینانه دارد — `409` اگر کس دیگری زودتر ذخیره کرده) |
| `/admin/orders` | GET | فهرست سفارش‌ها (نیاز به ورود؛ فراتر از قرارداد، برای این‌که پیگیری معنا داشته باشد) |
| `/admin/orders/:trackingCode` | PATCH | تغییر وضعیت/برآورد هفته/یادداشت یک سفارش (نیاز به ورود) |

## تصمیم‌های گرفته‌شده

- **دیتابیس:** PostgreSQL. `orders`, `pricing_versions` (هر نسخه نگه داشته می‌شود، طبق پیشنهاد §6)، `uploads`, `admin_users`.
- **اعتبارسنجی سند قیمت‌گذاری:** با `docs/pricing.schema.json` (ajv, draft 2020-12) + سه قاعده‌ی `x-rules` که در
  کد بررسی می‌شوند (`src/validation/pricingSchema.js`).
- **احراز هویت ادمین:** یک جدول ساده‌ی کاربر + رمز هش‌شده (bcrypt) + کوکی JWT. برای تیم دو نفره کافی است؛
  حساب‌ها با `npm run seed:admin` از `.env` ساخته می‌شوند، نه از یک پنل ثبت‌نام.
- **اطلاع‌رسانی سفارش جدید:** ایمیل (SMTP، `src/utils/mailer.js`)؛ اگر ارسال ناموفق شود، ثبت سفارش برای
  مشتری همچنان موفق است (فقط در لاگ سرور دیده می‌شود).
- **rate limiting:** روی `/orders`، `/orders/track`، `/uploads` و `/admin/login` (`express-rate-limit`، در حافظه —
  برای بیش از یک نمونه‌ی سرور پشت لود بالانسر باید به یک store مشترک مثل Redis تغییر کند).
- **فایل‌های آپلودی:** روی دیسک محلی سرور (`UPLOAD_DIR`) با نام تصادفی؛ متادیتا در جدول `uploads`. `url` همیشه
  `null` برگردانده می‌شود — فایل‌ها عمومی سرو نمی‌شوند (فقط برای بررسی داخلی تیم).

## کارهای باقی‌مانده پیش از انتشار

- یک دیتابیس PostgreSQL واقعی (مدیریت‌شده یا روی همان سرور) و مقداردهی `.env` در محیط پروداکشن.
- HTTPS جلوی سرویس (و `COOKIE_SECURE=true`) تا کوکی ادمین امن باشد.
- `SMTP_*` و `MAIL_TO` واقعی برای اطلاع‌رسانی سفارش.
- اگر لازم شد فایل‌های آپلودی برای تیم قابل دانلود باشند، یک مسیر محافظت‌شده (`requireAdmin`) برای سرو کردن آن‌ها
  اضافه کنید؛ فعلاً عمداً عمومی نیست.
