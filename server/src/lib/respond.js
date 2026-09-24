// Success responses are the bare resource (matching every example in
// API_CONTRACT.md, e.g. `{ tracking_code, status, created_at }`), not a
// `{ok,data,error}` envelope — the front end's client.js already normalises
// whatever it gets (`json?.data ?? json`) into that shape on its side.
export function sendOk(res, data, status = 200) {
  res.status(status).json(data);
}
