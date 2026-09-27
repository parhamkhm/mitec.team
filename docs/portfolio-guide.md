# Portfolio data — `project/src/data/portfolio.json`

One entry per delivered project. The Work carousel (`project/src/scripts/work.js`) is built from this file and
the Proof room's «پروژه‌ی تحویل‌شده» figure counts its entries, so adding a project needs no code change. The
only hand-kept copy is the no-JS list in `project/index.html` (`.work-list`): add the project there too.

## Fields

| Field | Required | What it is | Where it shows |
|---|---|---|---|
| `id` | yes | Unique, lowercase, e.g. `"mery-club"`. | Internal only. |
| `name` | optional | The project's short display name. | The caption under the carousel and the card's accessible name («{name} — مشاهده‌ی جزئیات پروژه»). If it is missing, the part of `nameFa` before «؛» is used. Today it holds the clients' Latin brand names («Mery Coffee Club», «Karamad MedTech», «E2 Café»), so those are what the caption shows; put a Persian name here to show that instead, or remove the field to fall back to `nameFa`. |
| `nameFa` | yes | The full Persian title, e.g. «کافه مری؛ منوی آنلاین و باشگاه مشتریان». | The title on the card's back (and the name's fallback). |
| `tags` | yes | One or two short labels. | Chips on the card's back. In the caption only when there is no `summary`. |
| `summary` | optional | One short line about the project. | The caption under the carousel (one line on desktop, two on phones), and the no-JS list. |
| `need` / `built` / `result` | yes | The three blocks: «نیاز کسب‌وکار», «راهکار ما», «نتیجه». | The tabs on the card's back, and the no-JS list. |
| `url` | yes | The live site, or `"#"` until the client approves publishing. | «دیدن سایت» on the back; `"#"` shows «لینک سایت بعد از تأیید مشتری منتشر می‌شود.» instead. |
| `image.src960`, `image.src1920` | yes | The home-page screenshot, WebP, 960 and 1920px wide. | The card's face (cropped from the top right into the card) and the bottom sheet. |
| `image.width`, `image.height` | yes | The 1920 file's pixel size. | Reserves the image's space so nothing shifts while it loads. |
| `image.alt` | yes | Persian alt text describing the screenshot. | Screen readers. |
| `image.ambient` | yes | A tiny pre-blurred copy of the screenshot (`{id}-home-ambient.webp`, 480px). No CSS blur is applied. | The band's backdrop behind the carousel, and the card's back. |
| `image.full` | optional | A tall **full-page** screenshot for the "scroll preview". | Hovering or focusing the centre card slowly pans it from top to foot (fine pointers, no reduced motion). Absent: nothing changes. |
| `placeholder` | yes | `true` while the image is a stand-in. | Bookkeeping. |

## `image.full` (scroll preview)

- A full-page capture of the client's home page, **1440px wide**, **WebP, at most 400KB**, e.g.
  `public/images/work/{id}-home-full.webp`.
- It is loaded lazily: only when that project's card first becomes the centre card, never on page load.
- Hovering the card pans it over about 6s; leaving eases it back to the top in 600ms. It uses transforms only.
- Leave the field out for any project without such a capture; no current project has one yet.
