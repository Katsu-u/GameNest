const { Router } = require("express");

const articlesRoutes = require("./articles.routes");
const healthRoutes = require("./health.routes");
const gamesRoutes = require("./games.routes");

const router = Router();

router.use("/health", healthRoutes);
router.use("/games", gamesRoutes);
router.use("/articles", articlesRoutes);

module.exports = router;
