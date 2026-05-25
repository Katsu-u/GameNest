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
  const games = await gameService.getUpcomingGames(req.query.limit);

  res.status(200).json({
    data: games
  });
}

async function getRecentlyReleasedGames(req, res) {
  const games = await gameService.getRecentlyReleasedGames(req.query.limit);

  res.status(200).json({
    data: games
  });
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
  getRecentlyReleasedGames
};
