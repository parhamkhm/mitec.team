import { APP_CONFIG } from '../config/app.config.js';

const join = (base, path) => `${base.replace(/\/$/, '')}${path}`;

export const url = (name) => {
  const path = APP_CONFIG.endpoints[name];
  if (!path) throw new Error(`Unknown endpoint: ${name}`);
  return join(APP_CONFIG.API_BASE_URL, path);
};
