const axios = require("axios");

async function forwardRequest(dest, payload) {
  const headers = {};
  if (dest.headers) {
    for (const [k, v] of dest.headers.entries
      ? dest.headers.entries()
      : Object.entries(dest.headers || {})) {
      headers[k] = v;
    }
  }
  if (!headers["Content-Type"]) headers["Content-Type"] = "application/json";
  const config = {
    url: dest.url,
    method: dest.method || "POST",
    headers,
    data: payload,
    timeout: 15000,
  };
  const resp = await axios(config);
  return resp;
}

module.exports = { forwardRequest };
