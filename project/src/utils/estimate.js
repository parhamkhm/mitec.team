// mitec — the order estimate, shared by the home page's quick scope and the
// order builder (/order), so both always quote the same range. Pure: the
// same catalog and selection always give the same numbers. The maths is the
// Mitec Order Builder prototype's estimate(), unchanged.

// Only if the catalog carries no estimates at all (as in the prototype).
const FALLBACK = { weeks: [2, 6], price: [15000000, 60000000] };

// selection: { siteType, features: [ids], sections: [ids] }
// returns    { weeks: [min, max], price: [min, max] } — price in tomans
export function estimate(catalog, selection = {}) {
  const base = catalog?.estimates?.[selection.siteType] || catalog?.estimates?.unsure || FALLBACK;
  const weeks = [...base.weeks];
  const price = [...base.price];
  for (const id of selection.features || []) {
    const cost = catalog?.featureCost?.[id];
    if (!cost) continue;
    price[0] += cost[0];
    price[1] += Math.round(cost[0] * 1.6);
    weeks[1] += cost[1];
  }
  const sections = (catalog?.sectionCost || 0) * (selection.sections || []).length;
  price[0] += sections;
  price[1] += Math.round(sections * 1.5);
  return { weeks, price };
}
