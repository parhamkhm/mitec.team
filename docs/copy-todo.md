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
