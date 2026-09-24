# Copy to-do

The site copy now follows **`docs/copy-final.md`**, the owner's final text, applied in the final copy pass
(branch `copy/final-pass`). That document is the source for every visible string on the home page; this file
lists what is still open, then what the pass resolved.

Where copy lives: section copy in `project/index.html` and `project/src/data/*.json`; everything in the
pricing calculator in `project/src/config/pricing.json` (`section`, `siteTypes`, `addons`), except the three
fallback strings and the chosen-add-on count in `COPY` at the top of `project/src/scripts/scope.js`.

Conventions every new string follows (from `copy-final.md`):

- Formal register, «شما», everywhere.
- Ezafe after a final «ه» is always written «ه‌ی» (صفحه‌ی، جلسه‌ی، نسخه‌ی).
- The order builder is «سفارش‌ساز». Buttons that lead to it say «شروع پروژه»; the one exception is the
  calculator's «ادامه در سفارش‌ساز». The tracking page is «پیگیری سفارش».
- Never state the team's size (it may grow). The promise is direct access to the team: no middleman, no
  outsourcing.

## Still open

| Where | Text | Problem | Suggestion |
|---|---|---|---|
| `app.config.js` / `index.html` → contact links | WhatsApp `989000000000`, Telegram `mitec_studio`, Instagram `mitec.studio` | Placeholder numbers and handles (the link texts are final: «واتساپ · تلگرام · اینستاگرام»). | Real number and handles. |
| `index.html` → Testimonials (hidden) and `testimonials.json` | Two sample quotes starting «متن نمونه:» | The section is hidden until real quotes exist. | When real quotes arrive: put them in, remove `hidden` and the «نمونه» badge, and swap `band` / `band--alt` on the sections after it (see the comment in `index.html`). |
| `pricing.json` → first `included` item of ecommerce, menu, catalog, landing, custom | e.g. «فروشگاه اینترنتی / فروش محصول، سبد خرید و پرداخت آنلاین» | Not covered by `copy-final.md`; reused from the order catalog. | Owner to review. |
| `scope.js` → `COPY.picked` | «{n} امکان انتخاب شده» | Final text, but it lives in code because V4 allowed no data change other than `group`. | Move to `section` in `pricing.json` with the next data-model change. |
| `scope.js` → `COPY.error` | «برآورد در دسترس نیست؛ مستقیم در سفارش‌ساز ادامه دهید» | Not in `copy-final.md` (only shows when the pricing document cannot load). Already follows the naming convention. | Owner to confirm. |
| `scope.js` → `COPY.showAllAddons` / `COPY.showFewerAddons` (defaults for the optional `section.showAllAddons` / `showFewerAddons`) | «نمایش همه‌ی امکانات ({n})» / «نمایش کمتر» | New in the V5 calculator layout; the wording comes from that spec, not from `copy-final.md`. Follows the conventions. | Owner to confirm; to change it, set the two fields in `pricing.json`. |
| `index.html` → CTA band | «در سفارش‌ساز، قدم‌به‌قدم نیازتان را مشخص کنید…» | Describes the order builder, which is not built yet (`/order` is a 404). | Recheck against the builder when it exists. |
| `portfolio.json` → `name` | «Mery Coffee Club»، «Karamad MedTech»، «E2 Café» | Latin names kept as data; the page shows only the Persian project titles in Work. | Keep as the clients' Latin brand names, or align when the portfolio is rendered from data. |
| `index.html` → Work | Three project rows written by hand | The Proof stat now counts `portfolio.json`, but the Work rows are still static markup mirroring it: a new project needs an entry in `portfolio.json` **and** a row in `index.html`. | Render Work from `portfolio.json` when the list grows. |
| `order-catalog.json` (for the future `/order` builder) | Feature and section labels | Written before `copy-final.md`; not reviewed against its conventions. | Review when the builder is built. |
| Proof room stats at 360px | «۱ روز کاری» | At 360px wide the value wraps to two lines, so its label sits one line lower than the other two. Fine from 390px. | Accept, or give the stat values `white-space: nowrap` with a smaller size below ~380px. |

## Resolved in the final pass

| Was | Now |
|---|---|
| Four names for `/order` («سفارش سایت»، «ساخت سفارش من»، «سفارش‌ساز»، «شروع سفارش») | «سفارش‌ساز» for the tool, «شروع پروژه» on every button to it (calculator: «ادامه در سفارش‌ساز»). |
| Intro statement on the laptop in the informal register («رو»، «تو») | «آماده‌اید زیرساخت دیجیتال کسب‌وکارتان را بسازید؟» / «سایت شما. سرویس شما. مسیر رشد شما.» (owner's go-ahead to change the frozen text; same word/phrase reveal). |
| Ezafe written two ways | «ه‌ی» everywhere. |
| Hero eyebrow and a Proof stat that stated the team's size | «تیم متخصص · طراحی سایت و راهکارهای دیجیتال»; stat «۰ — واسطه بین شما و تیم». No team size anywhere. |
| Same eyebrow «نمونه‌کارها» on the Proof room and Work | Proof room: «کارنامه‌ی ما». |
| Third stat «۱ روز» / «زمان پاسخ کاری» | «۱ روز کاری» / «زمان پاسخ به درخواست». |
| Three names for one client (Mery) | «کافه مری» on the page (title «کافه مری؛ منوی آنلاین و باشگاه مشتریان»). |
| Project-name strip in the Proof room («پروژه‌های ما: کافه مری · تجهیزات پزشکی کارآمد · کافه E2») | Removed: a hand-kept list of names goes stale as projects are added, and Work is where projects live. The «پروژه‌ی تحویل‌شده» figure is now the number of projects in `portfolio.json`. |
| Work heading «سه پروژه تحویل‌شده» | «پروژه‌هایی که تحویل داده‌ایم», plus a subtitle. |
| Work tag «فروشگاهی» | «فروشگاه اینترنتی». |
| FAQ week ranges contradicting the calculator | The answer points to «برآورد سریع»; two new questions (internal systems, editing content yourself). |
| Services card 2 vs add-on names | Services now six cards; card 2 lists «باشگاه مشتریان، نوبت‌دهی و رزرو، پنل مدیریت محتوا، ثبت سفارش و پرداخت آنلاین», matching the add-ons. |
| Testimonials badge «نمونه — جایگزین شود» visible to visitors | Section hidden; badge «نمونه» for when it returns. |
| Calculator: «پایه» / «پایه‌ی هر سایت» | «همیشه شامل می‌شود» / «بدون هزینه‌ی اضافه». |
| Calculator: subtitle and disclaimer saying the same thing | Subtitle says what the tool does; the disclaimer says what happens next. |
| Calculator badge «اعداد نمونه — جایگزین شود» | «اعداد نمونه». |
| Calculator total «جمع: از ۲۷ میلیون تومان» | «برآورد: از …». The «از» stays (changing it would need a data field). |
| Six drafted add-on descriptions | Final text for all twelve add-ons, including the new CRM, automation and analytics add-ons. |
| «سفارش‌ساز» a word visitors may not know | Kept on purpose as the tool's one name; the CTA band introduces it. |
| Instagram link shown as «@mitec.studio» | Link text «اینستاگرام» (the URL is still a placeholder, above). |
