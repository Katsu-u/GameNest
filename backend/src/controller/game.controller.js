const gameService = require("../service/game.service");

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
  searchGames,
  getUpcomingGames,
  getRecentlyReleasedGames
};
