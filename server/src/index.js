import { createApp } from './app.js';
import { ENV } from './env.js';
import { scheduleOrphanUploadCleanup } from './jobs/cleanupUploads.js';

const app = createApp();
app.listen(ENV.port, () => {
  console.log(`mitec-server listening on :${ENV.port} (${ENV.nodeEnv})`);
});
scheduleOrphanUploadCleanup();
