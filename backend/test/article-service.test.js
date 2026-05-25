const test = require("node:test");
const assert = require("node:assert/strict");

const articleService = require("../src/service/article.service");
const { articleRepository, gameRepository } = require("../src/repository");

test("toArticlePayload normalizes article input before persistence", () => {
  assert.deepEqual(
    articleService.toArticlePayload({
      title: "  Gaming news  ",
      summary: "",
      sourceName: "",
      sourceUrl: "https://example.com/news",
      publishedAt: "",
      gameId: undefined
    }),
    {
      title: "Gaming news",
      summary: null,
      sourceName: null,
      sourceUrl: "https://example.com/news",
      publishedAt: null,
      gameId: null
    }
  );
});

test("createArticle checks that a linked game exists", async () => {
  const originalFindById = gameRepository.findById;
  const originalCreate = articleRepository.create;
  let createdArticle;

  gameRepository.findById = async () => ({ id: 1, title: "Linked Game" });
  articleRepository.create = async (article) => {
    createdArticle = article;
    return { id: 1, ...article };
  };

  try {
    const article = await articleService.createArticle({
      title: "Article test",
      sourceUrl: "https://example.com/article",
      gameId: 1
    });

    assert.equal(createdArticle.gameId, 1);
    assert.equal(article.title, "Article test");
  } finally {
    gameRepository.findById = originalFindById;
    articleRepository.create = originalCreate;
  }
});

test("createArticle returns a 404 when the linked game does not exist", async () => {
  const originalFindById = gameRepository.findById;

  gameRepository.findById = async () => null;

  try {
    await assert.rejects(
      () =>
        articleService.createArticle({
          title: "Article test",
          sourceUrl: "https://example.com/article",
          gameId: 404
        }),
      (error) => {
        assert.equal(error.message, "Linked game not found");
        assert.equal(error.statusCode, 404);
        return true;
      }
    );
  } finally {
    gameRepository.findById = originalFindById;
  }
});

test("deleteArticle returns a 404 when the article does not exist", async () => {
  const originalRemove = articleRepository.remove;

  articleRepository.remove = async () => false;

  try {
    await assert.rejects(
      () => articleService.deleteArticle(404),
      (error) => {
        assert.equal(error.message, "Article not found");
        assert.equal(error.statusCode, 404);
        return true;
      }
    );
  } finally {
    articleRepository.remove = originalRemove;
  }
});
