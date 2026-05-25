const { body, param } = require("express-validator");

const articleIdParam = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Article id must be a positive integer")
    .toInt()
];

const articleGameIdParam = [
  param("gameId")
    .isInt({ min: 1 })
    .withMessage("Game id must be a positive integer")
    .toInt()
];

const articlePayloadRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title must be 255 characters or less"),
  body("summary")
    .optional({ nullable: true })
    .isString()
    .withMessage("Summary must be text"),
  body("sourceName")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 160 })
    .withMessage("Source name must be 160 characters or less"),
  body("sourceUrl")
    .trim()
    .notEmpty()
    .withMessage("Source URL is required")
    .isURL({ require_protocol: true })
    .withMessage("Source URL must be a valid URL"),
  body("publishedAt")
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage("Published date must be a valid ISO date"),
  body("gameId")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage("Game id must be a positive integer")
    .toInt()
];

module.exports = {
  articleIdParam,
  articleGameIdParam,
  articlePayloadRules
};
