# Copy to-do

Copy and translation problems noticed while building the redesign. **Nothing here has been changed**: the
site-wide copy pass is a separate, later task. Each item says where the text lives, what is wrong and a
suggestion, so the pass can go through them in one sitting.

Where copy lives: section copy in `project/index.html` and `project/src/data/*.json`; everything in the
pricing calculator in `project/src/config/pricing.json` (`section`, `siteTypes`, `addons`), except the three
fallback strings and the chosen-add-on count in `COPY` at the top of `project/src/scripts/scope.js`.

## Pricing calculator (Quick scope)

| Where | Text | Problem | Suggestion |
|---|---|---|---|
| `pricing.json` → every `siteTypes[].base` | «پایه» / «پایه‌ی هر سایت» | The subtitle only repeats the title, so the card says «پایه» twice. | Title «پایه‌ی {نوع}» or a subtitle that says what the base is for, e.g. «آنچه در هر سایت هست». |
| `pricing.json` → `section.subtitle` and `section.disclaimer` | «…یک برآورد اولیه است؛ قیمت دقیق در گفت‌وگو مشخص می‌شود.» / «همه‌ی اعداد تقریبی‌اند…» | Both say the same thing; the disclaimer now sits right under the CTA. | Keep one idea per place: subtitle about what the tool does, disclaimer about the next step (the proposal). |
| `pricing.json` → `section.placeholderBadge` | «اعداد نمونه — جایگزین شود» | «جایگزین شود» is an instruction to the owner, but visitors read it. | «اعداد نمونه» only (it disappears once `placeholder` is false anyway). |
| `pricing.json` → `currency.from` on the total | «جمع: از ۲۷ میلیون تومان» | «از» ("from") on a sum can read oddly next to «جمع». | Consider «جمع: حدود ۲۷ میلیون تومان» or drop the label «جمع». Changing it means a data field for the total's prefix (a data-model change, so not done here). |
| `pricing.json` → six add-on `desc` | e.g. «امتیاز و پیگیری مشتری‌های همیشگی» | Drafts written for V3 (the spec gave only three). | Owner to review; keep each under ~45 characters so it fits one line on a 1440px screen (two lines are shown at most). |
| `pricing.json` → type-specific first `included` item of ecommerce, menu, catalog, landing, custom | e.g. «فروشگاه اینترنتی / فروش محصول، سبد خرید و پرداخت آنلاین» | Reused from the order catalog; not reviewed as calculator copy. | Owner to review. |
| `scope.js` → `COPY.picked` | «{n} امکان انتخاب شده» | Lives in code because V4 allowed no data change other than `group`. | Move to `section` in `pricing.json` with the next data-model change. |
| `scope.js` → `COPY.unsure` | «مطمئن نیستید؟ در سفارش‌ساز کمکتان می‌کنیم» | Fine, but it and the CTA both say «سفارش‌ساز», a word visitors may not know. | Consider «فرم سفارش» or explain once. |

## Rest of the home page

| Where | Text | Problem | Suggestion |
|---|---|---|---|
| `index.html` → FAQ «پروژه چقدر طول می‌کشد؟» | «منوی آنلاین یک تا دو هفته، سایت شرکتی دو تا چهار هفته، فروشگاه اینترنتی چهار تا هفت هفته» | Week ranges from the old catalog, which the owner found unrealistic; they also disagree with the calculator's day-based figures a few sections above. | Once real numbers are in `pricing.json`, rewrite this answer to point at the calculator («با برآورد سریع بالای همین صفحه…») or quote the same days. |
| `index.html` → intro statement on the laptop screen (approved, frozen) | «آماده‌ای راهکار دیجیتال کسب‌وکارت رو بسازی؟ / سایتت. سبک خودت. انتخاب‌های تو.» | Informal register («رو»، «تو») while every other line on the site addresses the visitor as «شما». | Decide one register site-wide; the statement is frozen, so this needs the owner's go-ahead. |
| `index.html` → Proof room and Work headings | eyebrow «نمونه‌کارها» twice in a row (Proof room «خودتان ببینید», then Work «سه پروژه تحویل‌شده») | The same eyebrow on two consecutive sections. | Proof room eyebrow e.g. «کارنامه» or «به عدد». |
| `index.html` and `src/data/site-copy.json` → third stat | «۱ روز» / «زمان پاسخ کاری» | «زمان پاسخ کاری» is awkward; the hero already says «ظرف یک روز کاری». | «۱ روز کاری» / «زمان پاسخ». |
| `index.html` → Work, first project | «اسکرین‌شات Mery Club», «Mery Coffee Club», «باشگاه مشتریان کافه مری» | Three names for one client. | One name, e.g. «کافه مری (Mery Coffee Club)». |
| `index.html` → Work tags | «منوی آنلاین»، «باشگاه مشتریان»، «فروشگاهی» | «فروشگاهی» is an adjective among nouns. | «فروشگاه اینترنتی». |
| Site-wide | «صفحه‌ی اصلی»، «جلسه‌ی اولیه»، «همه‌ی» vs «جلسه مشاوره»، «نسخه آزمایشی»، «مشاهده سایت» | Ezafe after a final «ه» is written two ways (the newer pricing copy uses «‌ی», older copy does not). | Pick one convention (Farhangestan: «‌ی» optional) and apply it everywhere. |
| Nav, hero, CTA band, calculator | «سفارش سایت»، «ساخت سفارش من»، «ادامه در سفارش‌ساز»، «سفارش‌ساز» | Four names for the same destination (`/order`). | One noun for the builder and verbs that match it. |
| `index.html` → Services card 2 vs calculator add-ons | «ثبت سفارش»، «نظرات و پیشنهادها» vs add-ons «پرداخت آنلاین»، no reviews add-on | The services list and the add-on list name overlapping features differently. | Align names once the add-on list is final. |
| `index.html` → Testimonials badge | «نمونه — جایگزین شود» and «متن نمونه:» inside the quotes | Owner instructions visible to visitors (same as the pricing badge). | «نمونه» only; remove «متن نمونه:» when real quotes arrive. |
| `index.html` → CTA band | «پنج قدم کوتاه، هر قدم یک انتخاب…» | Describes the order builder, which is not built yet (`/order` is a 404). | Recheck against the builder when it exists. |
| `app.config.js` / `index.html` → Instagram | «@mitec.studio» | Placeholder handle; the domain is mitec.team. | Real handle. |
