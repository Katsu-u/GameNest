const { Router } = require("express");

const articleController = require("../controller/article.controller");
const asyncHandler = require("../middleware/async-handler");
const validateRequest = require("../middleware/validate-request");
const {
  articleGameIdParam,
  articleIdParam,
  articlePayloadRules
} = require("../validation/article.validation");

const router = Router();

router.get("/", asyncHandler(articleController.listArticles));
router.get(
  "/game/:gameId",
  articleGameIdParam,
  validateRequest,
  asyncHandler(articleController.listArticlesByGameId)
);
router.get(
  "/:id",
  articleIdParam,
  validateRequest,
  asyncHandler(articleController.getArticleById)
);
router.post(
  "/",
  articlePayloadRules,
  validateRequest,
  asyncHandler(articleController.createArticle)
);
router.put(
  "/:id",
  articleIdParam,
  articlePayloadRules,
  validateRequest,
  asyncHandler(articleController.updateArticle)
);
router.delete(
  "/:id",
  articleIdParam,
  validateRequest,
  asyncHandler(articleController.deleteArticle)
);

module.exports = router;
