const env = require("../config/env");

function getStatus() {
  return {
    status: "ok",
    app: env.appName,
    environment: env.nodeEnv,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  getStatus
};
