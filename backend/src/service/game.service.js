const igdbRepository = require("../repository/igdb.repository");
const { gameModel } = require("../model");
const { gameRepository } = require("../repository");

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;
const GAME_FIELDS = [
  "id",
  "name",
  "slug",
  "summary",
  "first_release_date",
  "cover.url",
  "genres.name",
  "platforms.name",
  "involved_companies.company.name",
  "total_rating"
].join(",");

function clampLimit(value) {
  const parsed = Number(value || DEFAULT_LIMIT);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return DEFAULT_LIMIT;
  }

  return Math.min(Math.trunc(parsed), MAX_LIMIT);
}

function escapeSearchTerm(value) {
  return String(value || "").trim().replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function unixNowSeconds() {
  return Math.floor(Date.now() / 1000);
}

function normalizeCoverUrl(url) {
  if (!url) {
    return null;
  }

  const withProtocol = url.startsWith("//") ? `https:${url}` : url;

  return withProtocol.replace("/t_thumb/", "/t_cover_big/");
}

function mapNames(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item) => item.name).filter(Boolean);
}

function mapStudio(involvedCompanies) {
  if (!Array.isArray(involvedCompanies)) {
    return null;
  }

  const company = involvedCompanies.find((item) => item.company?.name);

  return company?.company?.name || null;
}

function mapIgdbGame(game) {
  return gameModel.toGame({
    id: game.id,
    title: game.name,
    slug: game.slug,
    description: game.summary || null,
    releaseDate: game.first_release_date
      ? new Date(game.first_release_date * 1000).toISOString()
      : null,
    coverImageUrl: normalizeCoverUrl(game.cover?.url),
    genres: mapNames(game.genres),
    platforms: mapNames(game.platforms),
    studio: mapStudio(game.involved_companies),
    rating: game.total_rating ? Math.round(game.total_rating) : null
  });
}

function handleDatabaseError(error) {
  if (error.code === "23505") {
    const conflict = new Error("A game with this slug or IGDB id already exists");
    conflict.statusCode = 409;
    throw conflict;
  }

  throw error;
}

async function listSavedGames() {
  return gameRepository.findAll();
}

async function listUpcomingSavedReleases(limit) {
  return gameRepository.findUpcomingReleases(clampLimit(limit));
}

async function listPastSavedReleases(limit) {
  return gameRepository.findPastReleases(clampLimit(limit));
}

async function getSavedGameById(id) {
  const game = await gameRepository.findById(id);

  if (!game) {
    const error = new Error("Game not found");
    error.statusCode = 404;
    throw error;
  }

  return game;
}

async function createSavedGame(payload) {
  try {
    return await gameRepository.create(gameModel.toGamePayload(payload));
  } catch (error) {
    return handleDatabaseError(error);
  }
}

async function updateSavedGame(id, payload) {
  try {
    const game = await gameRepository.update(id, gameModel.toGamePayload(payload));

    if (!game) {
      const error = new Error("Game not found");
      error.statusCode = 404;
      throw error;
    }

    return game;
  } catch (error) {
    return handleDatabaseError(error);
  }
}

async function deleteSavedGame(id) {
  const deleted = await gameRepository.remove(id);

  if (!deleted) {
    const error = new Error("Game not found");
    error.statusCode = 404;
    throw error;
  }
}

function buildSearchQuery(searchTerm, limit) {
  const escapedSearch = escapeSearchTerm(searchTerm);

  if (!escapedSearch) {
    const error = new Error("Search query is required");
    error.statusCode = 400;
    throw error;
  }

  return [
    `search "${escapedSearch}"`,
    `fields ${GAME_FIELDS}`,
    "where version_parent = null",
    `limit ${clampLimit(limit)}`
  ].join("; ") + ";";
}

function buildUpcomingQuery(limit) {
  return [
    `fields ${GAME_FIELDS}`,
    `where first_release_date != null & first_release_date > ${unixNowSeconds()} & version_parent = null`,
    "sort first_release_date asc",
    `limit ${clampLimit(limit)}`
  ].join("; ") + ";";
}

function buildRecentlyReleasedQuery(limit) {
  return [
    `fields ${GAME_FIELDS}`,
    `where first_release_date != null & first_release_date <= ${unixNowSeconds()} & version_parent = null`,
    "sort first_release_date desc",
    `limit ${clampLimit(limit)}`
  ].join("; ") + ";";
}

async function searchGames(searchTerm, limit) {
  const games = await igdbRepository.query("games", buildSearchQuery(searchTerm, limit));

  return games.map(mapIgdbGame);
}

async function getUpcomingGames(limit) {
  const games = await igdbRepository.query("games", buildUpcomingQuery(limit));

  return games.map(mapIgdbGame);
}

async function getRecentlyReleasedGames(limit) {
  const games = await igdbRepository.query("games", buildRecentlyReleasedQuery(limit));

  return games.map(mapIgdbGame);
}

module.exports = {
  listSavedGames,
  listUpcomingSavedReleases,
  listPastSavedReleases,
  getSavedGameById,
  createSavedGame,
  updateSavedGame,
  deleteSavedGame,
  searchGames,
  getUpcomingGames,
  getRecentlyReleasedGames,
  mapIgdbGame,
  buildSearchQuery,
  buildUpcomingQuery,
  buildRecentlyReleasedQuery
};
