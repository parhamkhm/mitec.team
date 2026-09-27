// `npm run pricing:import` — see src/pricing/importPricing.js.
import { importPricingFile } from '../pricing/importPricing.js';
import { pool } from '../db/pool.js';

try {
  const r = await importPricingFile();
  console.log(
    r.imported
      ? `pricing.json is now live as version ${r.version} (was ${r.from ?? 'none'}).`
      : `pricing.json already matches the live document (version ${r.version}); nothing to do.`
  );
} catch (e) {
  console.error(e.fieldErrors ? `pricing.json is not valid: ${JSON.stringify(e.fieldErrors)}` : e);
  process.exitCode = 1;
} finally {
  await pool.end();
}
