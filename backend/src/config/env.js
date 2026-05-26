const fs = require("node:fs");
const path = require("node:path");
const dotenv = require("dotenv");

const envCandidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "..", ".env")
];

const envPath = envCandidates.find((candidate) => fs.existsSync(candidate));

if (envPath) {
  dotenv.config({ path: envPath });
}

module.exports = {
  appName: "gamenest-backend",
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  adminToken: process.env.ADMIN_TOKEN || "gamenest-admin",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    name: process.env.DB_NAME || "gamenest",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres"
  },
  igdb: {
    clientId: process.env.IGDB_CLIENT_ID || "",
    clientSecret: process.env.IGDB_CLIENT_SECRET || "",
    oauthTokenUrl: "https://id.twitch.tv/oauth2/token",
    apiBaseUrl: "https://api.igdb.com/v4",
    tokenLeewaySeconds: 60
  }
};
