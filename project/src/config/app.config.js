// mitec — single place for every environment-dependent value.
// The back end is written by a teammate; nothing here assumes its shape.

export const APP_CONFIG = {
  API_BASE_URL: '/api',          // change to the real base URL when it exists
  USE_MOCK: true,                // false => the same functions talk to API_BASE_URL

  endpoints: {
    catalog: '/catalog',         // optional; falls back to src/config/order-catalog.json
    pricing: '/pricing',         // the quick-scope pricing document (src/config/pricing.json in mock mode)
    submitOrder: '/orders',
    uploadFile: '/uploads',
    trackOrder: '/orders/track'  // proposal only — see API_CONTRACT.md
  },

  showPrice: false,              // true => price range is shown in the wizard summary
  TRACK_REQUIRES_PHONE: true,

  upload: {
    maxSizeMB: 8,
    accept: ['image/png', 'image/jpeg', 'image/webp', 'application/pdf'],
    maxFiles: 5
  },

  captcha: { enabled: false, provider: null, siteKey: '' },

  contact: {
    whatsapp: 'https://wa.me/989000000000',   // TODO replace with the real number
    telegram: 'https://t.me/mitec_studio',    // TODO replace
    instagram: 'https://instagram.com/mitec.studio'
  },

  timeoutMs: 15000
};
