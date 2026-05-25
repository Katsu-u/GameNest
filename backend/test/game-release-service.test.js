const test = require("node:test");
const assert = require("node:assert/strict");

const gameService = require("../src/service/game.service");
const { gameRepository } = require("../src/repository");

test("listUpcomingSavedReleases clamps the requested limit", async () => {
  const originalFindUpcomingReleases = gameRepository.findUpcomingReleases;
  let receivedLimit;

  gameRepository.findUpcomingReleases = async (limit) => {
    receivedLimit = limit;
    return [{ id: 1, title: "Future Game" }];
  };

  try {
    const games = await gameService.listUpcomingSavedReleases("200");

    assert.equal(receivedLimit, 50);
    assert.equal(games[0].title, "Future Game");
  } finally {
    gameRepository.findUpcomingReleases = originalFindUpcomingReleases;
  }
});

test("listPastSavedReleases falls back to the default limit", async () => {
  const originalFindPastReleases = gameRepository.findPastReleases;
  let receivedLimit;

  gameRepository.findPastReleases = async (limit) => {
    receivedLimit = limit;
    return [{ id: 2, title: "Past Game" }];
  };

  try {
    const games = await gameService.listPastSavedReleases("invalid");

    assert.equal(receivedLimit, 12);
    assert.equal(games[0].title, "Past Game");
  } finally {
    gameRepository.findPastReleases = originalFindPastReleases;
  }
});

test("listSimilarSavedGames verifies the target game and clamps the limit", async () => {
  const originalFindById = gameRepository.findById;
  const originalFindSimilarById = gameRepository.findSimilarById;
  let receivedId;
  let receivedLimit;

  gameRepository.findById = async () => ({ id: 1, title: "Target Game" });
  gameRepository.findSimilarById = async (id, limit) => {
    receivedId = id;
    receivedLimit = limit;
    return [
      {
        id: 2,
        title: "Similar Game",
        similarity: {
          score: 5,
          commonGenres: 1,
          commonPlatforms: 1,
          sameStudio: false
        }
      }
    ];
  };

  try {
    const games = await gameService.listSimilarSavedGames("1", "999");

    assert.equal(receivedId, "1");
    assert.equal(receivedLimit, 50);
    assert.equal(games[0].similarity.score, 5);
  } finally {
    gameRepository.findById = originalFindById;
    gameRepository.findSimilarById = originalFindSimilarById;
  }
});

test("listSimilarSavedGames returns a 404 when the target game does not exist", async () => {
  const originalFindById = gameRepository.findById;

  gameRepository.findById = async () => null;

  try {
    await assert.rejects(
      () => gameService.listSimilarSavedGames("404"),
      (error) => {
        assert.equal(error.message, "Game not found");
        assert.equal(error.statusCode, 404);
        return true;
      }
    );
  } finally {
    gameRepository.findById = originalFindById;
  }
});
