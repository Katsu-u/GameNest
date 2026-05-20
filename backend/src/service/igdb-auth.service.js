const env = require("../config/env");

let cachedToken = null;
let tokenExpiresAt = 0;

function assertIgdbCredentials() {
  if (!env.igdb.clientId || !env.igdb.clientSecret) {
    const error = new Error("IGDB credentials are missing");
    error.statusCode = 503;
    throw error;
  }
}

function isTokenValid() {
  return cachedToken && Date.now() < tokenExpiresAt;
}

async function requestAccessToken() {
  assertIgdbCredentials();

  const url = new URL(env.igdb.oauthTokenUrl);
  url.searchParams.set("client_id", env.igdb.clientId);
  url.searchParams.set("client_secret", env.igdb.clientSecret);
  url.searchParams.set("grant_type", "client_credentials");

  const response = await fetch(url, {
    method: "POST"
  });

  if (!response.ok) {
    const error = new Error("Unable to authenticate with Twitch");
    error.statusCode = 502;
    throw error;
  }

  const payload = await response.json();

  cachedToken = payload.access_token;
  tokenExpiresAt = Date.now() + (payload.expires_in - env.igdb.tokenLeewaySeconds) * 1000;

  return cachedToken;
}

async function getAccessToken() {
  if (isTokenValid()) {
    return cachedToken;
  }

  return requestAccessToken();
}

module.exports = {
  getAccessToken
};
