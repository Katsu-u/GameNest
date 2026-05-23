const { Router } = require("express");

const gameController = require("../controller/game.controller");
const asyncHandler = require("../middleware/async-handler");
const validateRequest = require("../middleware/validate-request");
const { gameIdParam, gamePayloadRules } = require("../validation/game.validation");

const router = Router();

router.get("/search", asyncHandler(gameController.searchGames));
router.get("/upcoming", asyncHandler(gameController.getUpcomingGames));
router.get("/recent", asyncHandler(gameController.getRecentlyReleasedGames));
router.get("/", asyncHandler(gameController.listSavedGames));
router.get(
  "/:id",
  gameIdParam,
  validateRequest,
  asyncHandler(gameController.getSavedGameById)
);
router.post(
  "/",
  gamePayloadRules,
  validateRequest,
  asyncHandler(gameController.createSavedGame)
);
router.put(
  "/:id",
  gameIdParam,
  gamePayloadRules,
  validateRequest,
  asyncHandler(gameController.updateSavedGame)
);
router.delete(
  "/:id",
  gameIdParam,
  validateRequest,
  asyncHandler(gameController.deleteSavedGame)
);

module.exports = router;
