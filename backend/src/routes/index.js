const { Router } = require("express");

const healthRoutes = require("./health.routes");
const gamesRoutes = require("./games.routes");

const router = Router();

router.use("/health", healthRoutes);
router.use("/games", gamesRoutes);

module.exports = router;
