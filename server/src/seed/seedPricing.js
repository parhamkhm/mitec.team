// Seeds pricing_versions with version 1 = the current front-end
// project/src/config/pricing.json, so the admin panel starts from the real
// (or still-placeholder) numbers already on the site instead of an empty
// document. No-ops if a pricing document already exists.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../db/pool.js';
import { getLatestPricing, insertPricingVersion } from '../db/pricingRepo.js';
import { assertValidPricingDocument } from '../validation/pricingSchema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRICING_PATH = path.join(__dirname, '..', '..', '..', 'project', 'src', 'config', 'pricing.json');

async function run() {
  const existing = await getLatestPricing();
  if (existing) {
    console.log(`pricing_versions already has data (current version ${existing.version}); skipping.`);
    return;
  }

  const doc = JSON.parse(fs.readFileSync(PRICING_PATH, 'utf8'));
  assertValidPricingDocument(doc);
  const row = await insertPricingVersion(doc.version, doc);
  console.log(`seeded pricing_versions with version ${row.version} from project/src/config/pricing.json`);
}

run()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
