import { createApp } from './app.js';
import { ENV } from './env.js';

const app = createApp();
app.listen(ENV.port, () => {
  console.log(`mitec-server listening on :${ENV.port} (${ENV.nodeEnv})`);
});
