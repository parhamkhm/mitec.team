# mitec — front end

پرتفولیو و سفارش‌ساز تیم mitec. فارسی، RTL، تم تاریک.

## سیستم طراحی

این پروژه روی **Mitec Design System** ساخته شده و همان سیستم مرجع بصری است:

```
_ds/mitec-design-system-43d123c9-3483-4ef5-99d3-fe6170ed1165/
```

هر صفحه در `<helmet>` خودش توکن‌ها و `_ds_bundle.js` را لود می‌کند و از کامپوننت‌های
سیستم استفاده می‌کند — `NavBar`، `SectionHeading`، `Button`، `Card`، `FeatureCard`،
`StatBar`، `LogoStrip`، `KeywordRail`، `GlowRule`، `Tabs`، `Badge`، `Field`، `Input`،
`Alert`، `Icon`، `Logo`. رنگ، فاصله، شعاع و سایه از توکن‌ها می‌آید، نه از مقدار دستی.

**سه انحراف عمدی، هر سه مستند:**

۱. **فونت.** Montserrat و Mulish گلیف فارسی ندارند؛ بنابراین `--font-display` و
   `--font-body` به **وزیرمتن** تغییر داده شده‌اند — همان نقطه‌ای که readme خود سیستم
   طراحی برای جایگزینی فونت معرفی کرده است. بقیه‌ی توکن‌های تایپوگرافی دست‌نخورده‌اند.
۲. **راست‌به‌چپ.** لوگوی سیستم از چند بخش لاتین ساخته شده و در صفحه‌ی RTL جابه‌جا
   می‌شود؛ یک قانون کوچک (`.logo { direction: ltr }` در `src/styles/components.css`)
   آن را سر جایش نگه می‌دارد.
۳. **کنتراست متن روی رنگ اکشن.** متن سفید روی `--grad-accent` بین ۲٫۲۵:۱ و ۳٫۲۳:۱
   می‌افتد. readme سیستم طراحی این را با استناد به استثنای «متن بزرگ» در WCAG قبول
   کرده، اما آن استثنا از ۱۸٫۶۶ پیکسلِ بولد به بالاست و برچسب دکمه‌های این سیستم
   ۱۷، ۱۵ و ۱۳٫۵ پیکسل است؛ پس حد ۴٫۵:۱ اعمال می‌شود و جفت فعلی آن را رد نمی‌کند.
   سطح‌هایی که روی رنگ اکشن **متن** دارند (`.btn--primary`، تب فعال، skip link) از
   جفت تیره‌ترِ همان رمپ زمردی خود سیستم استفاده می‌کنند، `green-700 → green-600`:
   ۸٫۲۵:۱ در حالت عادی و ۵٫۶۲:۱ روی hover. هیچ رنگ تازه‌ای اضافه نشده. مدال‌های
   آیکون، زیرخط منوی فعال و میله‌های نمودار دست‌نخورده‌اند چون گرافیک‌اند نه متن و
   با ۳٫۲۳:۱ از حد ۳:۱ بند ۱.۴.۱۱ رد می‌شوند.

## اجرا

بیلد لازم نیست؛ فایل‌ها ES Module هستند، پس باید از طریق سرور اجرا شوند (نه `file://`):

```bash
npx serve .      # یا: python3 -m http.server
```

## صفحه‌ها

| طرح مرجع | صفحه | وضعیت |
|---|---|---|
| `Mitec Home.dc.html` | صفحه‌ی اصلی (`/`) | ✅ پیاده‌سازی شده → `index.html` |
| `Mitec Order Builder.dc.html` | سفارش‌ساز و صفحه‌ی موفقیت (`/order`, `/order/success`) | ⬜ هنوز فقط طرح |
| `Mitec Track.dc.html` | پیگیری سفارش (`/track`) | ⬜ هنوز فقط طرح |
| `Mitec 404.dc.html` | صفحه‌ی ۴۰۴ | ⬜ هنوز فقط طرح |

لایه‌ی مشترک (`src/styles/components.css`، `src/api/`، `src/config/`، `src/utils/`) برای هر
چهار صفحه نوشته شده، پس سه صفحه‌ی باقی‌مانده فقط به مارک‌آپ و CSS مخصوص خودشان نیاز دارند.

## ساختار

```
_ds/…/        سیستم طراحی (توکن‌ها، styles.css، _ds_bundle.js)
src/api/      client.js, endpoints.js, mapper.js, mock.js  ← تنها لایه‌ای که با سرور حرف می‌زند
src/config/   app.config.js, order-catalog.json
src/data/     portfolio.json, faq.json, testimonials.json, site-copy.json
src/styles/   tokens.css  ← فقط توکن‌های سیستم طراحی را import می‌کند
src/utils/    persian-digits.js, validators.js
public/       fonts, images, favicon, sitemap.xml, robots.txt
image-slot.js جای‌گذاری تصویر (drag & drop) در طرح‌ها
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

## کارهای باقی‌مانده (جایگزینی محتوا)

- `public/fonts/` — فایل‌های لوکال وزیرمتن. طرح‌ها فعلاً فونت را از CDN می‌گیرند؛ **برای انتشار باید لوکال شود** (دسترسی از ایران).
  آیکون‌ها هم از CDN لوسید mask می‌شوند — همان‌ها را هم لوکال کنید.
- تصاویر: جای تصویرها `<image-slot>` است — اسکرین‌شات واقعی پروژه‌ها و عکس تیم را داخلشان بگذارید،
  و برای انتشار با `<img>` معمولی از `public/images/` جایگزین کنید.
- `src/data/testimonials.json` — نظرهای واقعی؛ الان نمونه است و در UI هم «نمونه» برچسب خورده.
- شماره‌ی واتساپ، آیدی تلگرام و اینستاگرام در `app.config.js`.
- اعداد `StatBar` در `src/data/site-copy.json` — فقط واقعیت، بدون عدد ساختگی.
