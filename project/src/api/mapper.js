// Boundary between the front end's internal shape and the API's shape.
// If the back end renames or restructures anything, ONLY this file changes.

export function toApiOrder(selection, catalog) {
  return {
    site_type: selection.siteType || null,
    template: selection.template || null,
    mixed_description: selection.templateNote || '',
    sections: [...(selection.sections || [])],
    features: [...(selection.features || [])],
    style: { color: selection.color || null, font: selection.font || null },
    assets: { has_logo: selection.hasLogo ?? null, has_content: selection.hasContent ?? null },
    business: {
      name: selection.business?.name || '',
      field: selection.business?.field || '',
      instagram_or_site: selection.business?.handle || '',
      references: selection.business?.refs || '',
      description: selection.business?.desc || '',
      phone: selection.business?.phone || ''
    },
    attachments: selection.uploads || [],
    meta: { catalog_version: catalog?.version || null, locale: 'fa-IR', source: 'web-order-builder' }
  };
}

export function fromApiOrder(api) {
  if (!api) return null;
  return {
    trackingCode: api.tracking_code ?? api.code ?? null,
    status: api.status ?? 'received',
    statusLabel: api.status_label ?? null,
    createdAt: api.created_at ?? null,
    estimateWeeks: api.estimate_weeks ?? null,
    notes: api.notes ?? ''
  };
}
