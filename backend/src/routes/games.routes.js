const { Router } = require("express");

const gameController = require("../controller/game.controller");
const asyncHandler = require("../middleware/async-handler");

const router = Router();

router.get("/search", asyncHandler(gameController.searchGames));
router.get("/upcoming", asyncHandler(gameController.getUpcomingGames));
router.get("/recent", asyncHandler(gameController.getRecentlyReleasedGames));

module.exports = router;
