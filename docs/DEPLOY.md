# Serving the site

For whoever runs the server. The site is static: nginx serves `project/` (on the current host, from
`/var/www/portfolio`, as `server/README.md` describes) and proxies `/api/` to the back end. Nothing is built or
bundled, so the files in the repository are exactly what the browser downloads. This page is about how nginx
serves those files: compression, caching and content types. It changes nothing in `server/`.

The site's own speed work (no third-party requests, a first frame that doesn't move) assumes all three are in place.
Measured on a slow phone profile (Slow 4G, 4× CPU), compression alone moves first paint by about half a second.

## 1. Compression: Brotli, else gzip

Compress every text type: HTML, CSS, JavaScript, JSON and SVG. Uncompressed, `index.html` is about 62KB and
`home.css` about 82KB; gzipped they are about 16KB and 20KB. Brotli saves roughly another 15%.

Don't compress `woff2`, `webp` or other images: they are already compressed.

gzip is built into nginx:

```nginx
gzip on;
gzip_vary on;
gzip_comp_level 6;
gzip_min_length 256;
gzip_types text/css application/javascript text/javascript application/json image/svg+xml;
# text/html is always compressed once gzip is on.
```

Brotli needs the `ngx_brotli` module (not in stock nginx). Where it is installed, add it next to gzip. Browsers that
accept Brotli get it, and the rest get gzip:

```nginx
brotli on;
brotli_comp_level 5;
brotli_types text/html text/css application/javascript text/javascript application/json image/svg+xml;
```

## 2. Cache headers

| What | Header | Why |
|---|---|---|
| `index.html` (and any `.html`) | `Cache-Control: no-cache` | Always revalidated, so a deploy shows at once. `no-cache` still allows a cheap 304. |
| Fonts: `public/fonts/*.woff2` | `Cache-Control: public, max-age=31536000, immutable` | They never change under the same name. **If a font file is ever replaced, give it a new name** (e.g. `vazirmatn-800.v2.woff2`) and update `src/styles/tokens.css`. |
| Hashed assets (a file whose name carries a content hash) | `Cache-Control: public, max-age=31536000, immutable` | None exist today; the rule is for any added later. |
| Everything else: CSS, JS modules, JSON data, images, `public/icons.svg` | `Cache-Control: no-cache` | These names don't change when the content does (there is no build step to fingerprint them), so a long cache would show old files after a deploy. With `no-cache` and ETag / Last-Modified, a repeat visit costs one small 304 per file. |
| `/api/…` | Set by the back end | Pricing and catalogue already send `public, max-age=300`. |

One `map` (in the `http` block) and one line in the `location` that serves the site's files. No new `location`
blocks: a regex location (say, for `\.json$`) would outrank the `/api/` prefix location and catch API requests.

```nginx
# http { … }
map $uri $site_cache {
    ~^/public/fonts/   "public, max-age=31536000, immutable";
    default            "no-cache";
}

# server { … location / { … } }: the block that serves /var/www/portfolio, not the /api/ proxy
add_header Cache-Control $site_cache;
```

Keep `etag on;` (nginx's default). `add_header` in a `location` replaces the ones set at `server` level, so
repeat any security headers there, or keep them all in one shared include.

## 3. Content types

A wrong type breaks things outright:
- a JavaScript module served as `text/plain` or `application/octet-stream` is refused, and the page falls back to its
  static version;
- a font with a wrong type can be refused under `X-Content-Type-Options: nosniff`;
- `public/icons.svg` must be `image/svg+xml`, or the icons that come from it don't draw.

Check that nginx's `mime.types` (usually `/etc/nginx/mime.types`, included in the `http` block) maps these, and add
any missing line inside its `types { }` block. Don't add a second `types { }` block elsewhere: it replaces the
whole table rather than adding to it.

```nginx
    text/html                html htm shtml;
    text/css                 css;
    application/javascript   js;       # text/javascript is also fine
    application/json         json;
    image/svg+xml            svg svgz;
    image/webp               webp;
    font/woff2               woff2;    # older nginx releases lack this one
```

Then, in the `server` block:

```nginx
charset utf-8;
charset_types text/css text/javascript application/javascript application/json image/svg+xml;
```

`charset utf-8` matters: the CSS and JS carry Persian text and comments. `index.html` declares its own charset.

## 4. `no-store` only in development

`devserver.py` sends `Cache-Control: no-store` so edits show on every reload while working locally. **Production must
not send `no-store`:** it disables revalidation and forces every visit to download everything again. Use the headers
in section 2.

## Checking a deploy

```bash
curl -sI -H 'Accept-Encoding: br, gzip' https://portfolio.chenarcafegallery.info/ | grep -iE 'content-(type|encoding)|cache-control|vary'
curl -sI -H 'Accept-Encoding: br, gzip' https://portfolio.chenarcafegallery.info/src/scripts/home.js | grep -iE 'content-(type|encoding)|cache-control'
curl -sI https://portfolio.chenarcafegallery.info/public/fonts/vazirmatn-800.woff2 | grep -iE 'content-type|cache-control'
curl -sI https://portfolio.chenarcafegallery.info/public/icons.svg | grep -iE 'content-type|cache-control'
```

Expected:
- the page: `text/html; charset=utf-8`, `Content-Encoding: br` (or `gzip`), `Cache-Control: no-cache`, `Vary: Accept-Encoding`;
- the module: `text/javascript` (or `application/javascript`), compressed, `no-cache`;
- the font: `font/woff2`, `max-age=31536000, immutable`, not compressed;
- the icons: `image/svg+xml`, `no-cache`.
