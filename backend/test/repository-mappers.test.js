const test = require("node:test");
const assert = require("node:assert/strict");

const { gameRepository, articleRepository } = require("../src/repository");
const { gameModel } = require("../src/model");

test("mapGameRow converts a database row to a game object", () => {
  const row = {
    id: "1",
    igdb_id: "1022",
    title: "The Legend of Zelda",
    slug: "the-legend-of-zelda",
    description: "Adventure game",
    release_date: "1986-02-21",
    cover_image_url: "https://example.com/cover.jpg",
    studio: "Nintendo",
    publisher: "Nintendo",
    status: "released",
    rating: 81,
    created_at: "2026-05-21T10:00:00.000Z",
    updated_at: "2026-05-21T10:00:00.000Z"
  };

  assert.deepEqual(gameRepository.mapGameRow(row), {
    id: "1",
    igdbId: "1022",
    title: "The Legend of Zelda",
    slug: "the-legend-of-zelda",
    description: "Adventure game",
    releaseDate: "1986-02-21",
    coverImageUrl: "https://example.com/cover.jpg",
    studio: "Nintendo",
    publisher: "Nintendo",
    status: "released",
    rating: 81,
    createdAt: "2026-05-21T10:00:00.000Z",
    updatedAt: "2026-05-21T10:00:00.000Z"
  });
});

test("mapArticleRow converts a database row to an article object", () => {
  const row = {
    id: "1",
    title: "Article title",
    summary: "Article summary",
    source_name: "GameNest",
    source_url: "https://example.com/article",
    published_at: "2026-05-21T10:00:00.000Z",
    game_id: "1",
    created_at: "2026-05-21T10:00:00.000Z",
    updated_at: "2026-05-21T10:00:00.000Z"
  };

  assert.deepEqual(articleRepository.mapArticleRow(row), {
    id: "1",
    title: "Article title",
    summary: "Article summary",
    sourceName: "GameNest",
    sourceUrl: "https://example.com/article",
    publishedAt: "2026-05-21T10:00:00.000Z",
    gameId: "1",
    createdAt: "2026-05-21T10:00:00.000Z",
    updatedAt: "2026-05-21T10:00:00.000Z"
  });
});

test("toGamePayload normalizes game input before persistence", () => {
  assert.deepEqual(
    gameModel.toGamePayload({
      title: "  The Legend of Zelda: Echoes  ",
      description: "",
      releaseDate: "2026-05-23",
      status: "upcoming",
      rating: 90
    }),
    {
      igdbId: null,
      title: "The Legend of Zelda: Echoes",
      slug: "the-legend-of-zelda-echoes",
      description: null,
      releaseDate: "2026-05-23",
      coverImageUrl: null,
      studio: null,
      publisher: null,
      status: "upcoming",
      rating: 90
    }
  );
});
