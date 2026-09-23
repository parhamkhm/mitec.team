# mitec — front end

پرتفولیو و سفارش‌ساز تیم mitec. فارسی، RTL، تم روشن (sage) با باندها و کاشی‌های سبز جنگلی.

## سیستم طراحی

مرجع بصری **`DESIGN.md`** در ریشه‌ی مخزن است؛ قبل از هر کار UI آن را بخوانید. محصول و محدودیت‌هایش
در **`PRODUCT.md`** آمده و مشخصات بازطراحی صفحه‌ی اصلی در **`docs/prompts/`**.

- رنگ‌ها فقط در `src/styles/tokens.css` تعریف می‌شوند (primitive و semantic). کامپوننت‌ها فقط توکن‌های
  `--color-*` را می‌خوانند؛ مقدار hex در فایل کامپوننت خطاست.
- هر ناحیه‌ی تیره `data-surface="dark"` دارد و همه‌ی توکن‌های semantic زیر آن عوض می‌شوند.
- از Mitec Design System (`_ds/…`) فقط مقیاس‌های فاصله، شعاع و حرکت import می‌شوند. رنگ، گرادیان و
  سایه‌ی آن (که بر پایه‌ی سرمه‌ای بود) استفاده نمی‌شود و `_ds_bundle.js` لود نمی‌شود.
- فونت وزیرمتن است (Montserrat و Mulish گلیف فارسی ندارند) و letter-spacing روی متن فارسی صفر است.
- لوگو متنی است و `direction: ltr` دارد تا در صفحه‌ی RTL جابه‌جا نشود.

## اجرا

بیلد لازم نیست؛ فایل‌ها ES Module هستند و باید از طریق سرور اجرا شوند (نه `file://`). از ریشه‌ی مخزن:

```bash
python devserver.py 4173
```

سپس `http://127.0.0.1:4173/` را باز کنید. `devserver.py` هدر `no-store` می‌فرستد تا هر تغییر بدون کش دیده شود.

## صفحه‌ی اصلی

به ترتیب: هیروی «پورتال» (صحنه‌ی جنگلی با یک لپ‌تاپ؛ با اسکرول وارد صفحه‌ی آن می‌شوید، از جمله‌ی
معرفی می‌گذرید و به اتاق روشن Proof با آمار واقعی می‌رسید)، نمونه‌کارها، نظر مشتری‌ها (نمونه)، خدمات،
فرایند، درباره ما، برآورد سریع، سؤالات متداول و باند پایانی.

**حرکت اختیاری است.** همه‌ی قانون‌های حرکت زیر کلاس `html.motion` هستند که فقط وقتی کاربر «کاهش حرکت»
را نخواسته اضافه می‌شود. بدون آن (کاهش حرکت، بدون JS، forced colors) صفحه همان سند ایستا و کامل است.
جزئیات در DESIGN.md §13.

- `src/scripts/motion/engine.js` — تنها حلقه‌ی `requestAnimationFrame` و تنها listener اسکرول صفحه.
  اندازه‌گیری‌ها کش می‌شوند و در هر فریم فقط transform و opacity نوشته می‌شود.
- `portal.js` هیرو، `effects.js` افکت‌های اسکرول بخش‌ها، `reveal.js` ورود یک‌باره‌ی بخش‌ها.
- `src/scripts/scope.js` — برآورد سریع: گزینه‌ها از `getCatalog()`، زمان تقریبی از `src/utils/estimate.js`
  (همان تابعی که سفارش‌ساز هم باید import کند) و انتقال انتخاب به سفارش‌ساز از طریق
  `localStorage['mitec.order.v1']` با شکل `{ selection, step, unsure }`. قیمت فقط وقتی `showPrice`
  روشن است در صفحه می‌آید.

## صفحه‌ها

| طرح اولیه | صفحه | وضعیت |
|---|---|---|
| — | صفحه‌ی اصلی (`/`) | ✅ `index.html` — طبق DESIGN.md؛ `Mitec Home.dc.html` قدیمی است و مرجع بصری نیست |
| `Mitec Order Builder.dc.html` | سفارش‌ساز و صفحه‌ی موفقیت (`/order`, `/order/success`) | ⬜ هنوز فقط طرح؛ لینک‌های `./order/` فعلاً ۴۰۴ می‌دهند |
| `Mitec Track.dc.html` | پیگیری سفارش (`/track`) | ⬜ هنوز فقط طرح؛ لینک‌های `./track/` فعلاً ۴۰۴ می‌دهند |
| `Mitec 404.dc.html` | صفحه‌ی ۴۰۴ | ⬜ هنوز فقط طرح |

فایل‌های `.dc.html` نمونه‌های اولیه‌ی Claude Design هستند و ویرایش نمی‌شوند. لایه‌ی مشترک
(`src/styles/`، `src/api/`، `src/config/`، `src/utils/`) برای هر چهار صفحه نوشته شده است.

## ساختار

```
src/api/      client.js, endpoints.js, mapper.js, mock.js  ← تنها لایه‌ای که با سرور حرف می‌زند
src/config/   app.config.js, order-catalog.json
src/data/     portfolio.json, faq.json, testimonials.json, site-copy.json
src/scripts/  home.js (ورودی صفحه‌ی اصلی), scope.js, motion/ (engine, easing, portal, effects, reveal)
src/styles/   tokens.css, components.css, home.css, portal.css, motion.css
src/utils/    persian-digits.js, validators.js, estimate.js
_ds/…/        سیستم طراحی قبلی؛ فقط spacing، radii و motion آن import می‌شود
public/       sitemap.xml, robots.txt
image-slot.js جای‌گذاری تصویر (drag & drop) در طرح‌های .dc.html
API_CONTRACT.md
```

## وصل کردن به بک‌اند

۱. در `src/config/app.config.js`: `API_BASE_URL` را تنظیم کنید، `USE_MOCK` را `false` کنید،
   مسیرهای `endpoints` را جایگزین کنید و `showPrice`، `TRACK_REQUIRES_PHONE` و
   محدودیت‌های آپلود را مشخص کنید.

۲. اگر نام یا ساختار فیلدهای API فرق دارد، فقط `src/api/mapper.js` را عوض کنید
   (`toApiOrder()` برای درخواست، `fromApiOrder()` برای پاسخ). هیچ کامپوننتی تغییر نمی‌کند.

۳. اگر هدر یا توکنی لازم شد، تابع خالی `authHeaders()` در `src/api/client.js` همان‌جاست.

چهار تابع عمومی: `getCatalog()`, `submitOrder()`, `uploadFile()`, `trackOrder()` — همه با شکل ثابت `{ ok, data, error }`.

## کارهای باقی‌مانده

- صفحه‌های `/order` و `/track` (و ۴۰۴) هنوز ساخته نشده‌اند.
- `public/fonts/` — فایل‌های لوکال وزیرمتن. فونت فعلاً از Google Fonts لود می‌شود؛ **برای انتشار باید لوکال
  شود** (دسترسی از ایران). آیکون‌ها هم از CDN لوسید (jsDelivr) mask می‌شوند — همان‌ها را هم لوکال کنید.
- تصاویر: اسکرین‌شات پروژه‌ها و عکس تیم هنوز `.img-slot` هستند — با `<img>` از `public/images/` جایگزین
  کنید (با `loading="lazy"`، `decoding="async"` و ابعاد مشخص).
- `src/data/testimonials.json` — نظرهای واقعی؛ الان نمونه است و در UI هم «نمونه» برچسب خورده.
- شماره‌ی واتساپ، آیدی تلگرام و اینستاگرام در `app.config.js` و در `index.html`.
- اعداد آمار در `src/data/site-copy.json` — فقط واقعیت، بدون عدد ساختگی.
