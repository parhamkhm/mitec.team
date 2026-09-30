// Makes project/src/config/pricing.json the live pricing document, as the
// next version. The live document lives in pricing_versions, not in the file:
// seed:pricing copies the file only into an empty database, so later edits to
// the file (e.g. copy or add-ons changed on a design branch) never reach the
// site on their own. This is the deliberate step that brings them over.
//
// It replaces whatever is live, including prices edited through
// PUT /admin/pricing since, so it is run by hand, never by deploy.sh.
import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { fileURLToPath } from 'node:url';
import { getLatestPricing, insertPricingVersion, withPricingLock } from '../db/pricingRepo.js';
import { assertValidPricingDocument } from '../validation/pricingSchema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PRICING_FILE = path.join(__dirname, '..', '..', '..', 'project', 'src', 'config', 'pricing.json');

// version and updatedAt are assigned on save, so they don't count as content.
const content = ({ version, updatedAt, ...rest }) => rest;

// Returns { imported: false, version } when the file already matches the live
// document, or { imported: true, from, version } after saving it.
export async function importPricingFile(file = PRICING_FILE) {
  const doc = JSON.parse(fs.readFileSync(file, 'utf8'));
  return withPricingLock(async (client) => {
    const current = await getLatestPricing(client);
    // isDeepStrictEqual ignores key order, which jsonb doesn't keep.
    if (current && isDeepStrictEqual(content(current), content(doc))) {
      return { imported: false, version: current.version };
    }
    const version = (current?.version ?? 0) + 1;
    const next = { ...doc, version, updatedAt: new Date().toISOString() };
    assertValidPricingDocument(next);
    await insertPricingVersion(version, next, client);
    return { imported: true, from: current?.version ?? null, version };
  });
}
