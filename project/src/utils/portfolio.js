// mitec — src/data/portfolio.json, fetched once per page and shared: the
// Proof room's project count (home.js), Work (work.js) and the hero's wall of
// work (portal.js) all read the same list. Each caller copies what it needs
// (filter, map), so nobody changes the shared array; if the fetch fails,
// every caller gets the same rejection and falls back on its own.

let pending = null;

export function loadPortfolio() {
  pending ||= fetch(new URL('../data/portfolio.json', import.meta.url)).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  });
  return pending;
}
