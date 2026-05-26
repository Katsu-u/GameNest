const env = require("../config/env");

function requireAdmin(req, res, next) {
  const token = req.get("x-admin-token");

  if (!token || token !== env.adminToken) {
    return res.status(401).json({
      error: "Admin access required"
    });
  }

  return next();
}

module.exports = requireAdmin;
