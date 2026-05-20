const env = require("../config/env");
const igdbAuthService = require("../service/igdb-auth.service");

async function query(endpoint, body) {
  const token = await igdbAuthService.getAccessToken();
  const response = await fetch(`${env.igdb.apiBaseUrl}/${endpoint}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": env.igdb.clientId,
      Authorization: `Bearer ${token}`
    },
    body
  });

  if (!response.ok) {
    const details = await response.text();
    const error = new Error(`IGDB request failed with status ${response.status}`);
    error.statusCode = response.status === 429 ? 429 : 502;
    error.details = details;
    throw error;
  }

  return response.json();
}

module.exports = {
  query
};
