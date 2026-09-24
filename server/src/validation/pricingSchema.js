// Validates a pricing document against docs/pricing.schema.json, plus the
// three x-rules the schema itself says can't be expressed in JSON Schema
// (see that file's `$comment` and `x-rules`): unique ids, pages.min <= max,
// and siteTypes[].addons referring to real addons[].id entries.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { Errors } from '../lib/errors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = path.join(__dirname, '..', '..', '..', 'docs', 'pricing.schema.json');
const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const validateSchema = ajv.compile(schema);

function duplicateIdErrors(list, basePath) {
  const errors = {};
  const seen = new Map();
  (list || []).forEach((item, i) => {
    if (!item || typeof item.id !== 'string') return;
    if (seen.has(item.id)) {
      errors[`${basePath}/${i}/id`] = `id «${item.id}» تکراری است (اولین بار در ایندکس ${seen.get(item.id)}).`;
    } else {
      seen.set(item.id, i);
    }
  });
  return errors;
}

function checkXRules(doc) {
  let fieldErrors = {};

  fieldErrors = { ...fieldErrors, ...duplicateIdErrors(doc.siteTypes, '/siteTypes') };
  fieldErrors = { ...fieldErrors, ...duplicateIdErrors(doc.addons, '/addons') };

  const addonIds = new Set((doc.addons || []).map((a) => a?.id).filter(Boolean));

  (doc.siteTypes || []).forEach((t, i) => {
    if (!t) return;
    fieldErrors = { ...fieldErrors, ...duplicateIdErrors(t.base?.included, `/siteTypes/${i}/base/included`) };

    if (t.pages && typeof t.pages.min === 'number' && typeof t.pages.max === 'number' && t.pages.min > t.pages.max) {
      fieldErrors[`/siteTypes/${i}/pages/max`] = 'pages.max باید بزرگ‌تر یا مساوی pages.min باشد.';
    }

    (t.addons || []).forEach((addonId, j) => {
      if (!addonIds.has(addonId)) {
        fieldErrors[`/siteTypes/${i}/addons/${j}`] = `id «${addonId}» در فهرست addons وجود ندارد.`;
      }
    });
  });

  return fieldErrors;
}

// Throws Errors.validation() with JSON-pointer fieldErrors (API_CONTRACT.md
// §6's proposed 422 shape) when the document is invalid; otherwise returns
// nothing.
export function assertValidPricingDocument(doc) {
  const schemaValid = validateSchema(doc);
  let fieldErrors = {};

  if (!schemaValid) {
    for (const e of validateSchema.errors) {
      const pointer = e.instancePath || '/';
      const key = e.keyword === 'additionalProperties' ? `${pointer}/${e.params.additionalProperty}` : pointer;
      fieldErrors[key] = e.message;
    }
  }

  fieldErrors = { ...fieldErrors, ...checkXRules(doc) };

  if (Object.keys(fieldErrors).length > 0) {
    throw Errors.validation('سند قیمت‌گذاری نامعتبر است.', fieldErrors);
  }
}
