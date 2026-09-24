// Matches the front end's pattern: `MTC-` + five digits (API_CONTRACT.md
// "Requirements" item 1, and project/src/api/mock.js's /^MTC-\d{5}$/).
export function randomTrackingCode() {
  const digits = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join('');
  return `MTC-${digits}`;
}
