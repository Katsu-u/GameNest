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
