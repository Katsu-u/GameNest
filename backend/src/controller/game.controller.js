const gameService = require("../service/game.service");

async function listSavedGames(req, res) {
  const games = await gameService.listSavedGames();

  res.status(200).json({
    data: games
  });
}

async function listUpcomingSavedReleases(req, res) {
  const games = await gameService.listUpcomingSavedReleases(req.query.limit);

  res.status(200).json({
    data: games
  });
}

async function listPastSavedReleases(req, res) {
  const games = await gameService.listPastSavedReleases(req.query.limit);

  res.status(200).json({
    data: games
  });
}

async function getSavedGameById(req, res) {
  const game = await gameService.getSavedGameById(req.params.id);

  res.status(200).json({
    data: game
  });
}

async function listSimilarSavedGames(req, res) {
  const games = await gameService.listSimilarSavedGames(
    req.params.id,
    req.query.limit
  );

  res.status(200).json({
    data: games
  });
}

async function createSavedGame(req, res) {
  const game = await gameService.createSavedGame(req.body);

  res.status(201).json({
    data: game
  });
}

async function updateSavedGame(req, res) {
  const game = await gameService.updateSavedGame(req.params.id, req.body);

  res.status(200).json({
    data: game
  });
}

async function deleteSavedGame(req, res) {
  await gameService.deleteSavedGame(req.params.id);

  res.status(204).send();
}

async function searchGames(req, res) {
  const games = await gameService.searchGames(req.query.q, req.query.limit);

  res.status(200).json({
    data: games
  });
}

async function getUpcomingGames(req, res) {
  const result = await gameService.getUpcomingGames(req.query.limit, req.query.offset);

  res.status(200).json(result);
}

async function getRecentlyReleasedGames(req, res) {
  const result = await gameService.getRecentlyReleasedGames(
    req.query.limit,
    req.query.offset
  );

  res.status(200).json(result);
}

async function getSimilarIgdbGames(req, res) {
  const result = await gameService.getSimilarIgdbGames(
    req.params.id,
    req.query.limit
  );

  res.status(200).json(result);
}

module.exports = {
  listSavedGames,
  listUpcomingSavedReleases,
  listPastSavedReleases,
  getSavedGameById,
  listSimilarSavedGames,
  createSavedGame,
  updateSavedGame,
  deleteSavedGame,
  searchGames,
  getUpcomingGames,
  getRecentlyReleasedGames,
  getSimilarIgdbGames
};
