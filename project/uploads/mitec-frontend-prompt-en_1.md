# Prompt: Design and Build the Front End of the mitec Website

You are a senior UI designer and front-end developer. Your job is to design and build **only the front end** of the portfolio and order-builder website for a team called "mitec". A separate developer is writing the back end, so do not write any server-side code, database, authentication, or back-end logic, and do not hard-code any assumptions about them.

---

## 1. What mitec is

mitec is a two-person web design team in Iran (Parham Movahedi and Sina Alipour). The only target market is Iran, so the entire site is in **Persian (Farsi) and right-to-left (RTL)**.

mitec does **not** create brands or visual identities for clients. Its work is: designing, building, and supporting the website or digital service a client's business needs.

Services:
- **Website design and development:** e-commerce, corporate, online menu (cafés and restaurants), catalog and portfolio, landing pages. UI/UX design is part of this service.
- **Custom business services:** customer loyalty club, reviews and suggestions, booking/reservations, content management panel, order submission, and similar.
- **Technical and support:** SEO, hosting and domain setup, SSL, post-delivery support.

Core message of the site: "The website and online service your business needs, designed, built and supported for you." (Persian copy: «سایت و سرویس آنلاینی که کسب‌وکار شما لازم دارد، طراحی، ساخته و پشتیبانی می‌شود».)

## 2. Goal of the site

Three jobs: build trust, showcase past work, and lead visitors into the **order builder**. The order builder is the heart of the site: the visitor walks through a step-by-step flow to choose and customize the kind of site they need, and feels that exactly what they need is being made for them. Its output is a structured brief submitted to the back end.

## 3. Visual identity

The identity is already decided and must be followed exactly:
- Dark green background `#12312A` with a very subtle grid pattern
- Accent colors: green `#57B79A` and amber `#E0A25C`
- Font: **Vazirmatn**, only the weights actually needed
- Wordmark: "mitec", always lowercase Latin
- Dark theme only; no light mode
- Overall feel: professional, clean, modern, warm; not cluttered. Animations should be subtle and disabled under `prefers-reduced-motion`.

Define colors, spacing, radii, and shadows as design tokens (CSS variables) so they are easy to change.

## 4. Pages and structure

**Home page (`/`), single page with these sections in order:**
1. Sticky header: wordmark, nav links, and an "order a website" button (Persian: «سفارش سایت»); hamburger menu on mobile
2. Hero: strong headline, one-line description, two buttons (primary: «ساخت سفارش من», secondary: «دیدن نمونه‌کارها»)
3. Services: three cards (websites, custom services, technical and support)
4. Portfolio: cards filterable by service tag (e-commerce, online menu, loyalty club, etc.). Each card follows this structure: image or mockup, project name, "business need", "what we built", "result", and a live-site link
5. Process: four to five steps (consultation, design, development, delivery, support)
6. About: introduce Parham and Sina and each one's specialty, with photo placeholders
7. Testimonials: with sample data **clearly marked as placeholder**
8. FAQ: accordion (delivery time, payment, hosting and domain, support)
9. Order CTA and contact: order-builder button plus WhatsApp, Telegram, and Instagram (`@mitec.studio`) links
10. Footer

**Other pages:**
- `/order`: the order builder (wizard), see section 5
- `/order/success`: order confirmation showing a tracking code
- `/track`: order tracking by tracking code
- `/404`

Seed portfolio projects (kept in a separate data file so they can be replaced later): a café website with a customer loyalty club (Mery Club), an online medical-supplies store (Karamad MedTech), and a café menu site (E2). Use placeholder images and mark them with a code comment saying they must be replaced.

## 5. The order builder (most important part)

A five-step wizard with a progress bar. **Each step is one decision only**, and every customization step has a "I don't know yet" or "Skip" option.

**Step 1, Site type:** selectable cards with an icon and a one-line description: e-commerce, corporate, online menu, catalog/portfolio, landing page, custom service, and "Not sure". "Not sure" asks a couple of simple questions and gives a suggestion (simple client-side logic).

**Step 2, Template and style:** several ready-made designs for each site type (placeholder previews). The user picks one or chooses "Mixed, I'll describe it".

**Step 3, Customization:**
- Page sections (gallery, blog, testimonials, FAQ, map, etc.)
- Features (online payment, sign-up and login, loyalty club, chat, SEO, multilingual)
- Primary color and font from a **limited** list (mitec does not do branding; do not build a free-form color picker)
- Whether they already have a logo and content

**Step 4, Business info:** name, field of business, Instagram username or current website, favorite reference sites, a free-text description box, mobile number, and optional file upload (logo, photos). Client-side validation (Iranian mobile number format, file type and size read from config).

**Step 5, Summary and submit:** a summary page of every choice with the ability to go back and edit each part, an estimated timeline and (if enabled in config) a price range, and a submit button.

**Behaviors:**
- **Live preview:** next to the steps (collapsible on mobile), a simple abstract layout of the page that updates with each choice (for example, adding "gallery" makes a gallery block appear).
- **Live price:** toggled by a `showPrice` config flag. If off, show only an approximate timeline.
- **Autosave** selections to `localStorage`, wrapped in try/catch, and restore them when the user returns.
- A "Talk to us" button (WhatsApp and Telegram links) available in every step.
- A honeypot field and a slot for an optional captcha widget (controlled by config) as anti-spam.
- Clear loading, error, and success states. If submission fails, the user's selections must not be lost and they can retry.

**Data-driven:** read all categories, templates, sections, features, prices, and timelines from **a single data file** (`src/config/order-catalog.json`), not from hard-coded values. It should be possible to change the entire wizard by editing this file (or later replacing it with an API response) without touching code.

## 6. Back-end integration (flexible, hands off)

A teammate is writing the back end and its contract may change. Therefore:

1. **All server communication lives in one layer only:** `src/api/` (containing `client.js`, `endpoints.js`, `mapper.js`, `mock.js`). No `fetch` call or API URL anywhere in components or pages.
2. **`src/config/app.config.js`** contains: `API_BASE_URL`, `USE_MOCK` (default `true`), the endpoint map, `showPrice`, `TRACK_REQUIRES_PHONE`, upload limits, and contact links. Changing any route or URL should require editing only this file.
3. **Four public functions** that the rest of the app uses exclusively:
   - `getCatalog()` (optional; otherwise the local data file is used)
   - `submitOrder(payload)`
   - `uploadFile(file)`
   - `trackOrder(code, phone?)`
4. **Mapper layer:** the front end's internal data shape (e.g. `selection.siteType`, `selection.sections[]`, `selection.features[]`) is separate from the API request and response shapes. `toApiOrder()` and `fromApiOrder()` handle conversion, so if field names or structure change, only this file changes.
5. **Normalize responses:** every API function returns one fixed shape: `{ ok, data, error: { code, message, fieldErrors } }`. Network errors, HTTP errors, and server validation errors are all converted to this shape, and the UI works only with it.
6. **Mock adapter:** with `USE_MOCK=true` everything works without a server (with simulated latency, sample success and error cases, and a fake tracking code). Setting it to `false` connects the same functions to `API_BASE_URL`.
7. **Do not assume:** any authentication system, tokens, cookies, sessions, specific response format, or database. If a header or token is ever needed, leave only an empty, documented hook in `client.js`.
8. Create an **`API_CONTRACT.md`** file describing the front end's contract as a *proposal*: each function, its input and output, JSON examples, required fields, and error codes. It is only a suggestion so the back-end developer can modify or reject it. Do not insist on any specific route.

**Do NOT write:** any Node/Express code, SQL, ORM, database models, Telegram bot, admin panel, or notification-sending logic. Those all belong to the back end. If you need something from the back end, record it as a requirement in `API_CONTRACT.md` instead of building it yourself.

## 7. Technical requirements

- **Default stack:** semantic HTML, plain JavaScript with ES Modules and **no framework**, and Tailwind CSS v4 (the same approach used in the team's other projects). If you truly need a small library, state the reason.
- **No external CDN dependencies:** the Vazirmatn font, icons (inline SVG or local files), and all scripts must be **local**. Access to external services can be slow or restricted in Iran.
- **Full RTL:** use `dir="rtl"` and CSS logical properties (`margin-inline-start`, etc.). Use Persian digits (with a utility function for conversion). Use Jalali dates if dates are needed.
- **Mobile-first**, and every page must work from 320px up to desktop, with no horizontal scroll.
- **Accessibility:** sufficient contrast, keyboard navigation, proper `aria` for the wizard and accordion, visible focus.
- **Performance:** WebP or AVIF images with `loading="lazy"` and explicit dimensions, only the needed font weights, and a high Lighthouse score as a target.
- **SEO:** `title` and `meta description` per page, proper heading hierarchy, Open Graph tags (link previews in Telegram and WhatsApp), `sitemap.xml`, `robots.txt`, and `LocalBusiness` schema.

## 8. Output structure

```
mitec-frontend/
├─ index.html
├─ order/index.html
├─ order/success/index.html
├─ track/index.html
├─ 404.html
├─ src/
│  ├─ api/            (client.js, endpoints.js, mapper.js, mock.js)
│  ├─ config/         (app.config.js, order-catalog.json)
│  ├─ data/           (portfolio.json, faq.json, testimonials.json)
│  ├─ components/
│  ├─ pages/
│  ├─ styles/         (tokens.css and styles)
│  └─ utils/          (persian-digits.js, validators.js, etc.)
├─ public/            (fonts, images, favicon, sitemap.xml, robots.txt)
├─ API_CONTRACT.md
└─ README.md          (how to run, structure, how to connect to the back end)
```

In `README.md`, explain in particular how to connect the project to the real back end by editing `app.config.js` and `mapper.js`.

## 9. Content and tone

- Tone: fluent, friendly, professional Persian; short, no slogans.
- **Do not present any fake statistics, testimonials, logos, or clients as real.** Anything that is sample content must be marked with a code comment and (in development mode only) visibly in the UI, so it gets replaced.
- Read site copy from separate data files so it is easy to edit.
- Make no claims about branding or logo design for clients; mitec does not offer those services.

## 10. Working method

Before writing code, briefly outline the page structure and the wizard flow. Then do the **visual design** first (home page and the wizard steps), and then produce the code. If something is ambiguous, pick a reasonable assumption, flag it, and continue.
