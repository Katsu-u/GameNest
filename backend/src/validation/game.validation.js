const { body, param } = require("express-validator");

const GAME_STATUSES = ["unknown", "upcoming", "released"];

const gameIdParam = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Game id must be a positive integer")
    .toInt()
];

const gamePayloadRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title must be 255 characters or less"),
  body("slug")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage("Slug must be 255 characters or less"),
  body("description")
    .optional({ nullable: true })
    .isString()
    .withMessage("Description must be text"),
  body("releaseDate")
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage("Release date must be a valid ISO date"),
  body("coverImageUrl")
    .optional({ nullable: true, checkFalsy: true })
    .isURL({ require_protocol: true })
    .withMessage("Cover image URL must be a valid URL"),
  body("studio")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage("Studio must be 255 characters or less"),
  body("publisher")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage("Publisher must be 255 characters or less"),
  body("status")
    .optional()
    .isIn(GAME_STATUSES)
    .withMessage(`Status must be one of: ${GAME_STATUSES.join(", ")}`),
  body("rating")
    .optional({ nullable: true })
    .isInt({ min: 0, max: 100 })
    .withMessage("Rating must be an integer between 0 and 100")
    .toInt(),
  body("igdbId")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage("IGDB id must be a positive integer")
    .toInt()
];

module.exports = {
  GAME_STATUSES,
  gameIdParam,
  gamePayloadRules
};
