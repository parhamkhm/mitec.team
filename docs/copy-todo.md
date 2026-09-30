# Copy to-do

The site copy now follows **`docs/copy-final.md`**, the owner's final text, applied in the final copy pass
(branch `copy/final-pass`). That document is the source for every visible string on the home page; this file
lists what is still open, then what the pass resolved.

Where copy lives: section copy in `project/index.html` and `project/src/data/*.json`; everything in the
pricing calculator in `project/src/config/pricing.json` (`section`, `siteTypes`, `addons`), except the strings in
`COPY` at the top of `project/src/scripts/scope.js`: the three fallbacks, the chosen-add-on count, and defaults that a
`section` field of the same name overrides (the two fold buttons and, from Impeccable batch 5, the owner-approved
«جزئیات برآورد» (`breakdown`) with its «{n} صفحه‌ی بیشتر» line (`extraPages`; its first line is the site type's own label), «هر صفحه‌ی بیشتر: از {price}» (`perPage`) and «بدون هزینه‌ی اضافه» (`free`), and the bar's «نمونه» mark (`sampleMark`)).

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
| `index.html` → Testimonials (hidden) and `testimonials.json` | Two sample quotes starting «متن نمونه:» | The section is hidden until real quotes exist. | When real quotes arrive: put them in, remove `hidden` and the «نمونه» badge, and swap `band` / `band--alt` on the sections after it (see the comment in `index.html`). |
| `pricing.json` → first `included` item of ecommerce, menu, catalog, landing, custom | e.g. «فروشگاه اینترنتی / فروش محصول، سبد خرید و پرداخت آنلاین» | Not covered by `copy-final.md`; reused from the order catalog. | Owner to review. |
| `scope.js` → `COPY.picked` | «{n} امکان انتخاب شده» | Final text, but it lives in code because V4 allowed no data change other than `group`. | Move to `section` in `pricing.json` with the next data-model change. |
| `scope.js` → `COPY.error` | «برآورد در دسترس نیست؛ مستقیم در سفارش‌ساز ادامه دهید» | Not in `copy-final.md` (only shows when the pricing document cannot load). Already follows the naming convention. | Owner to confirm. |
| `scope.js` → `COPY.showAllAddons` / `COPY.showFewerAddons` (defaults for the optional `section.showAllAddons` / `showFewerAddons`) | «نمایش همه‌ی امکانات ({n})» / «نمایش کمتر» | New in the V5 calculator layout; the wording comes from that spec, not from `copy-final.md`. Follows the conventions. | Owner to confirm; to change it, set the two fields in `pricing.json`. |
| `index.html` → CTA band | «در سفارش‌ساز، قدم‌به‌قدم نیازتان را مشخص کنید…» | Describes the order builder, which is not built yet (`/order` is a 404). | Recheck against the builder when it exists. |
| `portfolio.json` → `name` | «Mery Coffee Club»، «Karamad MedTech»، «E2 Café» | Since V7 this field is shown: the caption under the Work carousel and each card's accessible name use `name`, as V7 specifies, so the clients' Latin brand names now appear on the page. | Keep the Latin brand names, or set Persian names here (e.g. «کافه مری»), or remove `name` to fall back to the part of `nameFa` before «؛». See `docs/portfolio-guide.md`. |
| `index.html` → Work screenshots | Alt texts «صفحه‌ی اصلی سایت کافه مری» / «صفحه‌ی اصلی فروشگاه تجهیزات پزشکی کارآمد» / «صفحه‌ی اصلی منوی آنلاین کافه E2» | New with the screenshots; not in `copy-final.md` (the first two come from the request; E2's was written to match, from its project title). | Owner to confirm. |
| `index.html` → Work, no-JS list | Three cards written by hand in `.work-list` | The carousel is now built from `portfolio.json`, but the fallback for visitors without JS is still static markup mirroring it: a new project needs an entry in `portfolio.json` **and** a card in `index.html` for them. | Accept, or generate the list at build time if a build step is ever added. |
| `portfolio.json` → `summary` | «منوی آنلاین دوزبانه و باشگاه مشتریان امتیازی» / «فروشگاه اینترنتی با دسته‌بندی فنی و پنل مدیریت» / «منوی QR سبک و سریع، بهینه برای موبایل» | New with the V6 coverflow cards; the wording comes from that spec, not from `copy-final.md`. | Owner to confirm. |
| `work.js` → carousel labels | Card: «{name} — مشاهده‌ی جزئیات پروژه»، side cards «رفتن به پروژه‌ی {name}»؛ cue chip «جزئیات پروژه» / «جزئیات» (touch and phones)؛ controls «پروژه‌ی بعدی»، «پروژه‌ی قبلی»، «رفتن به پروژه‌ی ۲»، «توقف چرخش» / «ادامه‌ی چرخش»، «۳ از ۱۲»؛ on a card's back «نیاز» · «راهکار» · «نتیجه» and «بستن جزئیات»؛ for screen readers «اسلایدر نمونه‌کارها» (the carousel) and «اسلاید» (the current slide) | From the V6 and V7 specs and the card-flip request. The two screen-reader role names are the owner's approved copy (after Impeccable batch 4). | Owner to confirm the rest. |
| `order-catalog.json` (for the future `/order` builder) | Feature and section labels | Written before `copy-final.md`; not reviewed against its conventions. | Review when the builder is built. |
| Proof room stats at 360px | «۱ روز کاری» | At 360px wide the value wraps to two lines, so its label sits one line lower than the other two. Fine from 390px. | Accept, or give the stat values `white-space: nowrap` with a smaller size below ~380px. |

## از Impeccable

Copy flags from the Impeccable reports 02–09 (`docs/impeccable/`), left as they are for the owner's copy pass; no
rewrites are proposed. "Report" is the report's number and where in it the flag is. Flags that later decisions
already settled are not listed: the direct-message path (batch 3), the calculator's new strings (batch 5), «از» on
the total, «پیگیری سفارش» as a tier-3 link, and the hero float cards (decorative, confirmed).

| Section | Report | Current text | Issue |
|---|---|---|---|
| Hero: H1 and sub | 02 · heuristic 2; persona Jordan | «فراتر از طراحی سایت؛ ساخت زیرساخت دیجیتال برای رشد کسب‌وکار شما» / «طراحی سایت، سرویس‌های آنلاین، CRM و اتوماسیون، تحلیل داده و پشتیبانی؛ از اولین ایده تا رشد کسب‌وکارتان، کنار شما هستیم.» | «زیرساخت دیجیتال», Latin «CRM» and six services in one sentence ask a lot of a café owner. |
| Hero: CRM float card (decorative) | 02 · minor | «همین حالا · به CRM اضافه شد» | Latin «CRM» inside a 12–14px RTL caption. |
| Proof: heading | 03 · minor, copy flags | «خودتان ببینید» | Heads a room with nothing to look at (three numbers, no work). |
| Work: E2's tag and title | 03 · minor, copy flags | tag «منوی آنلاین» over the title «منوی آنلاین کافه E2» | The tag repeats the title. |
| Services: heading | 04 · minor, copy flags | «هر آنچه کسب‌وکار شما برای رشد آنلاین لازم دارد» | Category-generic: it could head any agency's services. |
| Services: sub | 04 · minor, copy flags | «از طراحی سایت تا CRM، اتوماسیون، تحلیل داده و پشتیبانی؛ یک تیم، از شروع تا رشد.» | Restates the six card titles. |
| Services, Process, calculator: jargon | 04 · heuristic 2; 09 · heuristic 2 | card 1 «…کاتالوگ و لندینگ؛…»; card 3 «CRM و سیستم‌های مدیریتی»; card 5 «…امنیت و گواهی SSL…»; Process step 4 «…با SSL و آموزش کار با پنل مدیریت.»; the calculator's «لندینگ پیج» and «به نام خودتان، با SSL» | «CRM», «لندینگ» and «SSL» are jargon for café and shop owners (card 3's text glosses CRM well). |
| Services: card links | 09 · MO4 | «شروع پروژه» on four cards, then «بپرسید» and «جزئیات پشتیبانی» | The same link four times in one section; whether the repeats stay is an IA and copy question. |
| Services: card 3's title | 18 · batch 7 (typeset) | «CRM و سیستم‌های مدیریتی» | At 320 it keeps a lone last word («CRM و / سیستم‌های / مدیریتی»): its 172px column beside the chip holds one long word per line. Needs a shorter title. |
| Process: sub | 05 · persona (first-time café owner) | «از اولین گفت‌وگو تا بعد از تحویل، همیشه می‌دانید کار کجاست.» | Promises that you always know where the work is, but never names «پیگیری سفارش». |
| Process: steps 2 and 3 | 05 · heuristic 9 | «…قبل از شروع برنامه‌نویسی تأیید می‌شود.» / «…با نسخه‌ی آزمایشی که در طول کار می‌بینید.» | They imply recourse, but nothing covers revisions or what happens if the client is unhappy. |
| Process: the five steps | 05 · persona (first-time café owner) | (not covered) | "How long?" and "what do I provide, and how much of my time?" are not answered, and nothing points to the calculator's working days. |
| Process: step numbers | 05 · PR5 | «۰۱» … «۰۵» | Whether to keep the leading zero. Batch 7 set the numerals in proportional figures, so the narrow «۰» now sits close to its digit instead of apart, but the zero itself is a copy decision. |
| Process: the step paragraphs, five across | 05 · PR3 (the owner's decision: list, don't rewrite) | «می‌فهمیم کسب‌وکارتان چه می‌کند و سایت باید چه مشکلی را حل کند.» / «ساختار صفحه‌ها و طراحی رابط کاربری؛ قبل از شروع برنامه‌نویسی تأیید می‌شود.» / «ساخت سایت و سرویس‌ها، با نسخه‌ی آزمایشی که در طول کار می‌بینید.» / «راه‌اندازی روی دامنه و هاست خودتان، با SSL و آموزش کار با پنل مدیریت.» / «رفع مشکل، به‌روزرسانی و توسعه‌ی بعدی؛ همراه رشد کسب‌وکارتان.» | On the lit (forest) card a paragraph should keep to two lines. They need 203 / 231 / 221 / 217 / 198px for two lines; the widened row gives 195px at 1280 (all five run to three lines), 212 at 1366 (steps 2–4), 227 at 1440 (step 2) and 236 at 1920 (none). |
| About: title | 06 · copy flags | «تیمی متخصص، از ایده تا رشد کنار شما» | Repeats the hero eyebrow's «تیم متخصص». |
| About: roles | 06 · heuristic 2 | «طراحی رابط کاربری و فرانت‌اند» / «بک‌اند و زیرساخت» | Developer jargon for café and clinic owners. |
| About: Parham's bio | 06 · copy flags | «طراحی رابط کاربری و پیاده‌سازی صفحه‌ها، با تمرکز روی سرعت و تجربه‌ی موبایل.» | Repeats his role. |
| About: Sina's bio | 06 · copy flags | «سرویس‌های اختصاصی، CRM و سیستم‌های مدیریتی، اتوماسیون و تحلیل داده، زیرساخت و امنیت، و پشتیبانی فنی بعد از تحویل.» | A list of services with no voice, out of balance with Parham's. |
| Calculator: CTA | 07 · persona Jordan | «ادامه در سفارش‌ساز» | Doesn't say whether continuing commits the visitor to anything. |
| Calculator: summary card title | 07 · minor | «همیشه شامل می‌شود» | Never names the chosen site type. |
| FAQ: eyebrow and title | 08 · minor, heuristic 8 | «سؤالات متداول» / «پاسخ سؤال‌های رایج» | Both say the same thing. |
| FAQ: the questions | 08 · heuristic 10 | «پروژه چقدر طول می‌کشد؟»، «پرداخت چطور انجام می‌شود؟»، «هاست و دامنه را هم شما تهیه می‌کنید؟»، «بعد از تحویل پشتیبانی دارید؟»، «فقط سایت می‌سازید یا سیستم‌های داخلی کسب‌وکار را هم؟»، «بعد از تحویل، خودم می‌توانم محتوا را تغییر دهم؟»، «لوگو و برند هم طراحی می‌کنید؟» | No question about cost, and no way out to a person at the end. |
| Closing band | 08 · persona (café owner who would rather message) | «مسیر دیجیتال کسب‌وکارتان را از همین‌جا شروع کنید» / «در سفارش‌ساز، قدم‌به‌قدم نیازتان را مشخص کنید. هر جا مطمئن نبودید، گزینه‌ی «نمی‌دانم» هست و ما پیشنهاد می‌دهیم.» | Nothing says how fast the team replies; «۱ روز کاری» appears only in Proof. |
| Section preambles, Services to FAQ | 09 · design verdict | eyebrows «خدمات»، «فرایند کار»، «درباره‌ی ما»، «برآورد سریع»، «سؤالات متداول», each over an H2 and a sub | Every section opens with the same eyebrow → H2 → sub preamble; the eyebrows mostly name the section. |

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
| Instagram link shown as a handle | Link text «اینستاگرام»; the link is https://instagram.com/mitec.team. |
| Hero float cards (`site-copy.json` → `hero.floatCards`: «رتبه‌ی ۱ گوگل»، «سفارش جدید ثبت شد»، «۳۲٪ رشد») awaiting the owner's reading of their figures | Confirmed by the owner as decorative illustration (`aria-hidden`), not factual claims; recorded in `PRODUCT.md` → Evidence on Hand. |
