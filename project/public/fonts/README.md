# Vazirmatn (self-hosted)

| File | Weight | Size |
|---|---|---|
| `vazirmatn-400.woff2` | 400 Regular | 34,780 bytes |
| `vazirmatn-500.woff2` | 500 Medium | 35,220 bytes |
| `vazirmatn-700.woff2` | 700 Bold | 35,280 bytes |
| `vazirmatn-800.woff2` | 800 ExtraBold | 35,228 bytes |

- **Source:** Vazirmatn v33.003, the official release by rastikerdar
  (`https://github.com/rastikerdar/vazirmatn/releases/tag/v33.003`, `fonts/webfonts/Vazirmatn-*.woff2`, about 51KB each).
- **Licence:** SIL Open Font License 1.1 (`OFL.txt`, copied from the release). No Reserved Font Name is declared, so the
  subsets keep the name.
- **Subset:** Google Fonts' `arabic` and `latin` ranges, in one file per weight. Every OpenType layout feature is kept,
  so Persian shaping, marks and kerning are unchanged. Kept among others:
  - Persian digits (۰–۹) and Arabic digits (٠–٩);
  - ZWNJ/ZWJ;
  - «٪ ، ؛ ؟ « »»;
  - Latin-1 and the General Punctuation block.
- **Regenerating** needs fonttools, used at dev time only:

  ```
  python -m fontTools.subset Vazirmatn-Regular.woff2 --layout-features='*' --flavor=woff2 \
    --unicodes=U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0898-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC,U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD \
    --output-file=vazirmatn-400.woff2
  ```

  Run it the same way for Medium (500), Bold (700) and ExtraBold (800).
- **Loading and fallback:** the `@font-face` rules and the metric-matched fallback ("Vazirmatn Fallback", Tahoma scaled
  to Vazirmatn's width and line box) are in `src/styles/tokens.css`. `index.html` preloads 800 only (the H1).
- **Checking new copy:** if new copy uses a character outside these ranges, check it against the subset before
  shipping.
