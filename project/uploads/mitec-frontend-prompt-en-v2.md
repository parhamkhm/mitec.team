# Prompt: Design and Build the Front End of the mitec Website

You are a senior UI designer and front-end developer. Your job is to design and build **only the front end** of the portfolio and order-builder website for a team called "mitec". A separate developer is writing the back end, so do not write any server-side code, database, authentication, or back-end logic, and do not hard-code any assumptions about them.

**A style reference image is attached to this prompt. Follow it for the overall look and feel (see section 3).**

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

## 3. Visual direction (follow the attached reference image)

A reference image is attached. **The look and feel of the whole site must match it**: a premium, dark, atmospheric "top-tier digital agency" style. Take its style, composition, and mood, but **not its content**. Specifically, do NOT reuse the "BizNext" name or logo, the Google / Microsoft / Slack / Dropbox logos, the numbers (500+ projects, 98%, 24/7), the "Trusted by 500+ companies" claim, or any of its English copy. All content is mitec's own and in Persian. Where this section conflicts with generic or default styling, this section and the reference image win.

### 3.1 Atmosphere and color

- **Background:** a deep navy blending diagonally into rich emerald green, with soft radial glows behind key elements, faint sweeping light streaks in the corners, a subtle dotted world-map or grid texture, and gentle blurred bokeh circles. It must feel layered and deep, never flat. The page should read as one continuous atmosphere, with sections shifting between slightly lighter and darker variants of the same gradient.
- **Color tokens** (mitec's existing palette is the anchor; the navy is the new extension):
  - Deep navy: `#0A1A2F` and `#0D2238`
  - mitec dark green: `#12312A`
  - Emerald (buttons, badges): about `#1E7F63`, with highlight `#57B79A`
  - Bronze/gold gradient (headline accent, numbers, tagline): `#B8834F` → `#E0A25C` → `#F0C48A`
  - Cream for primary text: `#F4EFE6`; muted text: cream at 60–70% opacity
  - Glass surfaces: white at 8–14% opacity with a 1px border of white at 15–25% opacity and a backdrop blur
- Dark theme only. Define everything as CSS variables (design tokens).

### 3.2 Typography

- Font: **Vazirmatn** (local). Two-tone hero headline: the first line in the bronze/gold gradient, the second line in cream white, both bold and very large.
- Above the headline, a small light-weight eyebrow line flanked by thin horizontal rules. Below the headline, a centered subhead, followed by a thin divider line with a small glowing dot in the middle.
- A letter-spaced tagline row near the bottom in the reference ("Modern · Fast · Secure · Scalable") becomes a row of short Persian words separated by dots and thin lines in bronze: «مدرن · سریع · امن · مقیاس‌پذیر».
- **Persian-specific rules:** never apply `letter-spacing` to Persian text (it breaks letter joining), and do not use italics (they do not exist in Persian). Create emphasis with weight, size, and color contrast instead. Numbers use Persian digits, in gold.

### 3.3 Components

- **Header:** transparent over the gradient, links with a short green underline on the active one, and a pill-shaped emerald CTA with a light-green border and an arrow icon. In RTL the arrow points left.
- **Buttons:** pill-shaped. Primary = emerald gradient fill with a thin light border and a soft green glow on hover. Secondary = glass outline with an icon.
- **Service cards** (the row of four in the reference): rounded 20–28px frosted-glass cards, each with a circular emerald icon badge at the top, a title, a thin divider, and three small dots at the bottom. The hovered or active card turns dark-green glass with a green glow. Cards float with a soft shadow and a slight lift on hover. Layout: four across on desktop, two across on tablet, one or two across on mobile.
- **Stats bar:** a wide glass pill containing three items separated by thin vertical dividers (gold numbers, muted labels), with a CTA button at the end («دریافت مشاوره رایگان»). **Numbers must be real or clearly marked placeholders read from a data file.** Do not invent impressive figures.
- **Trust strip:** instead of big-brand logos, show a strip of mitec's own real project names or logos taken from the portfolio data file.
- **Icons:** one consistent line-icon style, inside circular emerald badges.
- **Shape language:** generous radii (20–28px), thin 1px light borders, soft green glows, layered soft shadows, lots of breathing room.
- **Motion:** subtle fade-up on scroll, gentle glow pulse, slowly floating UI cards. All disabled under `prefers-reduced-motion`.

### 3.4 Hero composition

Center-aligned, following the reference from top to bottom: eyebrow line, two-tone headline, subhead with glowing divider, then a **device mockup scene**, then the row of four service cards overlapping the bottom of the mockup, then the stats bar, then the tagline row.

- **Device mockup:** a laptop (with a phone overlapping a corner) on a light glossy surface with a soft reflection. The laptop screen shows a real mitec portfolio project screenshot in a dark UI, through an image slot that is easy to swap. Small floating UI cards (a chart widget, a few icons) hover near the screen with light parallax.
- Do **not** try to fake the photorealistic desk scene (plant, coffee cup, lamp) in code. Create depth with lighting instead: a glow behind the laptop, surface reflections, blurred bokeh, and a soft vignette. Also leave an optional background-image slot in config so a photo or 3D render can be dropped in later.
- On mobile, the elements stack, the mockup scales down, and the service cards become a 2×2 grid.

### 3.5 Apply the same language everywhere

Every section and every page (including the order builder) uses this language. In the order builder: the wizard sits in a glass panel over the gradient; option cards are glass cards whose selected state is dark-green glass with an emerald glowing border and a check badge; the progress bar is thin with a glowing green fill; the summary panel is glass.

### 3.6 Suggested hero copy (editable, stored in a data file)

- Eyebrow: «طراحی سایت حرفه‌ای»
- Headline line 1 (gold): «سایت و سرویس آنلاینی»
- Headline line 2 (cream): «که کسب‌وکار شما لازم دارد»
- Subhead: «طراحی، ساخت و پشتیبانی، متناسب با نیاز واقعی شما»
- Service cards: «طراحی سایت»، «سرویس‌های اختصاصی»، «سئو و هاست»، «پشتیبانی بعد از تحویل». Do not claim "24/7" support.

### 3.7 Quality bar

It should look like the work of a top agency: cohesive, polished, and unmistakably in the style of the reference. No generic template look, no emoji, no clip art, and no stock-photo dependency.

## 4. Pages and structure

**Home page (`/`), single page with these sections in order:**
1. Sticky header: wordmark, nav links, and an "order a website" button (Persian: «سفارش سایت»); hamburger menu on mobile
2. Hero: composed exactly as in section 3.4 (eyebrow, two-tone headline, subhead, device mockup scene, service cards, stats bar, tagline row) with two buttons (primary: «ساخت سفارش من», secondary: «دیدن نمونه‌کارها»)
3. Services: the four glass cards from the hero appear here in expanded form (websites, custom services, SEO and hosting, post-delivery support), each with a short description and a link into the order builder
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
