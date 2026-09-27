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

رمزهای حساب‌های ادمین این ماشین در `server/ADMIN_CREDENTIALS.md` است — فایلی که در `.gitignore` است و
در مخزن نیست. اگر آن فایل را ندارید (مثلاً تازه مخزن را clone کرده‌اید)، `ADMIN_SEED_ACCOUNTS` را در `.env`
خودتان بگذارید و `npm run seed:admin` را اجرا کنید؛ همان دستور رمز کاربرِ موجود را هم به‌روز می‌کند.

سلامت سرویس: `GET /health`.

## تست‌ها

```bash
npm test                     # همه‌ی تست‌ها؛ فقط PostgreSQL لازم است، نه سرور در حال اجرا
```

`test/integration/*.test.mjs` با `node:test` خودِ Node نوشته شده (بدون وابستگی اضافه). هر فایل اپ را داخل همان
پروسه روی یک پورت تصادفی بالا می‌آورد، روی یک دیتابیس جدا (`mitec_test`، اگر نباشد ساخته می‌شود) که قبل از هر
فایل **کاملاً پاک** و دوباره migrate و seed می‌شود. برای همین تست‌ها از اجرا روی دیتابیسی که نامش به `_test` ختم
نشود خودداری می‌کنند. دیتابیس دیگر: `TEST_DATABASE_URL=postgres://…/something_test npm test`.

زیر `NODE_ENV=test` (فقط در تست‌ها) rate limiting و لاگ درخواست‌ها خاموش است و `.env` روی تست اثری ندارد.

### تست قرارداد

```bash
npm run test:contract        # سرور باید در حال اجرا باشد
```

(`npm test` همین فایل را هم روی سرور تست اجرا می‌کند؛ این دستور برای بررسی یک سرور واقعی است.)

`test/contract.test.mjs` پاسخ‌های سرورِ در حال اجرا را از خودِ `mapper.js` و `estimate.js` فرانت‌اند عبور
می‌دهد. یعنی اگر تغییری در سرور شکل داده را طوری عوض کند که سایت بشکند، این تست می‌افتد — نه مرورگر.
غیر از شکل داده، این‌ها را هم بررسی می‌کند: فرمول قیمت، الگوی کد رهگیری، شکل خطاها (`error.code`،
`fieldErrors`)، و این‌که شماره‌ی اشتباه در پیگیری وجودِ سفارش را لو ندهد.

برای تست روی سرور دیگر: `BASE_URL=https://api.example.com npm run test:contract`.

## انتشار روی سرور

سایت در `https://portfolio.chenarcafegallery.info`: nginx فایل‌های `project/` را از `/var/www/portfolio` سرو
می‌کند و `/api/` را (با حذف پیشوند) به همین سرویس روی `127.0.0.1:4000` می‌فرستد، که با pm2 به اسم `mitec-api` اجرا
می‌شود. انتشار نسخه‌ی جدید، روی سرور و بدون sudo:

```bash
bash ~/mitec.team/server/scripts/deploy.sh          # یا نام یک شاخه‌ی دیگر
```

به ترتیب: `git pull --ff-only` (اگر تغییر محلی باشد متوقف می‌شود)، پشتیبان‌گیری، `npm ci` و migrate، ری‌استارت
API و صبر تا `/health` جواب بدهد، و کپی سایت با `USE_MOCK: false`. با اولین خطا متوقف می‌شود.

## پشتیبان‌گیری

`scripts/backup.sh` هر شب دیتابیس (`pg_dump`) و پوشه‌ی فایل‌های آپلودی را در `~/backups` می‌ریزد و ۱۴ نسخه‌ی آخر
را نگه می‌دارد (`KEEP`). تنظیمات را از `server/.env` می‌خواند. فایل‌ها شماره‌ی موبایل مشتری‌ها را دارند، پس فقط
برای همان کاربر قابل خواندن‌اند. خط crontab روی سرور (با `bash` صریح، تا از دست رفتن مجوز اجرای فایل پشتیبان‌گیری
را بی‌صدا متوقف نکند):

```
30 3 * * * bash /home/claude/mitec.team/server/scripts/backup.sh >> /home/claude/backups/mitec-backup.log 2>&1
```

**بازگردانی** — در یک دیتابیس خالی:

```bash
gunzip -c ~/backups/mitec-db-YYYYMMDD-HHMMSS.sql.gz | psql "$DATABASE_URL"
tar -xzf ~/backups/mitec-uploads-YYYYMMDD-HHMMSS.tar.gz -C server/uploads
```

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
| `/admin/password` | POST | عوض کردن رمز خود: `{ current_password, new_password }` (حداقل ۱۰ نویسه، حداکثر ۷۲ بایت). بقیه‌ی نشست‌ها تمام می‌شوند و کوکی همین نشست دوباره صادر می‌شود (نیاز به ورود) |
| `/admin/pricing` | GET, PUT | خواندن/ذخیره‌ی کل سند قیمت‌گذاری (نیاز به ورود؛ `PUT` نسخه‌بندی خوش‌بینانه دارد — `409` اگر کس دیگری زودتر ذخیره کرده) |
| `/admin/orders` | GET | فهرست سفارش‌ها، جدیدترین اول (نیاز به ورود؛ فراتر از قرارداد). پارامترها: `status`، `q` (بخشی از کد رهگیری، نام کسب‌وکار یا شماره موبایل — ارقام فارسی هم)، `limit` (۱ تا ۲۰۰، پیش‌فرض ۵۰)، `offset`. پاسخ: `{ items, total, limit, offset }` که `total` تعداد همه‌ی نتایج است |
| `/admin/orders/:trackingCode` | GET | یک سفارش کامل (شامل `quote` و `internal_notes`) به‌همراه `uploads`: فهرست فایل‌های پیوست (`id`, `filename`, `mime_type`, `size_bytes`) و `history`: تاریخچه‌ی تغییرات (نیاز به ورود) |
| `/admin/uploads/:id` | GET | دانلود یک فایل آپلودشده (نیاز به ورود). عکس‌ها (PNG/JPEG/WebP) در مرورگر باز می‌شوند، بقیه دانلود؛ با `nosniff` و CSP `sandbox`، چون نوع فایل را مرورگرِ آپلودکننده اعلام کرده و قابل اعتماد نیست |
| `/admin/orders/:trackingCode` | PATCH | تغییر `status`، `estimate_weeks` (`null` آن را پاک می‌کند)، `customer_note` (در صفحه‌ی پیگیری به مشتری نشان داده می‌شود) و `internal_notes` (فقط برای تیم؛ هرگز در `/orders/track` برنمی‌گردد) (نیاز به ورود) |

## تصمیم‌های گرفته‌شده

- **دیتابیس:** PostgreSQL. `orders`, `pricing_versions` (هر نسخه نگه داشته می‌شود، طبق پیشنهاد §6)، `uploads`, `admin_users`,
  `order_events` (تاریخچه‌ی تغییرات ادمین روی هر سفارش).
- **تاریخچه‌ی سفارش:** هر `PATCH` که واقعاً چیزی را عوض کند یک رویداد ثبت می‌کند: چه کسی، چه زمانی، و مقدار قبلی و جدید
  هر فیلد (`{"status": {"from": "received", "to": "in_design"}}`). `PATCH` بدون تغییر، رویداد و `updated_at` جدید
  نمی‌سازد. تاریخچه در `GET /admin/orders/:trackingCode` به‌صورت `history` (قدیمی‌ترین اول) برمی‌گردد.
- **اعتبارسنجی سند قیمت‌گذاری:** با `docs/pricing.schema.json` (ajv, draft 2020-12) + سه قاعده‌ی `x-rules` که در
  کد بررسی می‌شوند (`src/validation/pricingSchema.js`).
- **احراز هویت ادمین:** یک جدول ساده‌ی کاربر + رمز هش‌شده (bcrypt) + کوکی JWT. برای تیم دو نفره کافی است؛
  حساب‌ها با `npm run seed:admin` از `.env` ساخته می‌شوند، نه از یک پنل ثبت‌نام.
  - هر درخواست ادمین، علاوه بر امضای توکن، وجود حساب و `session_version` آن را در دیتابیس چک می‌کند؛ عوض کردن رمز
    (`POST /admin/password`) این عدد را بالا می‌برد و همه‌ی نشست‌های دیگر فوراً تمام می‌شوند.
  - بعد از ۵ رمز اشتباه پشت‌سرهم، حساب ۱۵ دقیقه قفل می‌شود (`429 RATE_LIMITED`) — جدا از محدودیت هر IP.
    این پاسخ نشان می‌دهد که چنین نام کاربری‌ای وجود دارد؛ برای یک تیم دو نفره پذیرفته‌ایم.
  - برای نام کاربریِ ناموجود هم bcrypt اجرا می‌شود تا زمان پاسخ، وجود یا نبود نام کاربری را لو ندهد.
  - **بازیابی حساب قفل‌شده یا رمز فراموش‌شده:** رمز جدید را در `ADMIN_SEED_ACCOUNTS` بگذارید و `npm run seed:admin` را
    اجرا کنید: رمز عوض، قفل باز و نشست‌های قبلی آن حساب تمام می‌شود.
- **برآورد قیمت سفارش:** سرور هنگام ثبت سفارش، قیمت و روز کاری را با همان `estimate()` و `fromApiPricing()` فرانت‌اند
  (`src/pricing/quote.js`) و با نسخه‌ی `pricing_version` خود سفارش حساب می‌کند و در ستون `quote` ذخیره می‌کند؛ پس
  تیم دقیقاً همان عددی را می‌بیند که مشتری دید، حتی اگر قیمت‌ها بعداً عوض شده باشند. اگر نسخه‌ی درخواستی وجود نداشته
  باشد، سفارش رد **نمی‌شود**: با نسخه‌ی فعلی قیمت‌گذاری می‌شود و نسخه‌ی درخواستی در `quote.requested_version` می‌ماند.
  برای نوع سایت بی‌قیمت (مثل `unsure`) `quote` خالی (`null`) است. `quote` فقط در API ادمین و ایمیل تیم دیده می‌شود.
  (این کار به Node 22.12 یا بالاتر نیاز دارد، چون فایل‌های فرانت‌اند `package.json` ندارند.)
- **اطلاع‌رسانی سفارش جدید:** ایمیل (SMTP، `src/utils/mailer.js`)؛ اگر ارسال ناموفق شود، ثبت سفارش برای
  مشتری همچنان موفق است (فقط در لاگ سرور دیده می‌شود).
- **rate limiting:** روی `/orders`، `/orders/track`، `/uploads` و `/admin/login` (`express-rate-limit`، در حافظه —
  برای بیش از یک نمونه‌ی سرور پشت لود بالانسر باید به یک store مشترک مثل Redis تغییر کند).
- **فایل‌های آپلودی:** روی دیسک محلی سرور (`UPLOAD_DIR`) با نام تصادفی؛ متادیتا در جدول `uploads`. `url` همیشه
  `null` برگردانده می‌شود — فایل‌ها عمومی سرو نمی‌شوند؛ تیم آن‌ها را از `GET /admin/uploads/:id` (نیاز به ورود) می‌گیرد.
- **پیوست‌های سفارش:** `POST /orders` هر شناسه‌ی `attachments` را با جدول `uploads` چک می‌کند و فایل را به سفارش
  وصل می‌کند (`uploads.order_id`)، همه در یک تراکنش. شناسه‌ای که آپلود نشده یا قبلاً به سفارش دیگری وصل شده،
  کل سفارش را با `422 VALIDATION_ERROR` (`fieldErrors.attachments`) رد می‌کند و هیچ سفارشی ساخته نمی‌شود.
  حداکثر `UPLOAD_MAX_FILES` پیوست.
- **پاک‌سازی فایل‌های بی‌صاحب:** فایلی که بعد از `UPLOAD_ORPHAN_HOURS` ساعت (پیش‌فرض ۲۴) به هیچ سفارشی وصل نشده،
  از دیسک و جدول پاک می‌شود. خود سرور این کار را یک دقیقه بعد از شروع و بعد هر ساعت انجام می‌دهد
  (`src/jobs/cleanupUploads.js`)؛ برای اجرای دستی: `npm run cleanup:uploads`.

## کارهای باقی‌مانده پیش از انتشار

- یک دیتابیس PostgreSQL واقعی (مدیریت‌شده یا روی همان سرور) و مقداردهی `.env` در محیط پروداکشن.
- HTTPS جلوی سرویس (و `COOKIE_SECURE=true`) تا کوکی ادمین امن باشد.
- `SMTP_*` و `MAIL_TO` واقعی برای اطلاع‌رسانی سفارش.
