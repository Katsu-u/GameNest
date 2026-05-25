const { articleRepository, gameRepository } = require("../repository");

function toArticlePayload(data) {
  return {
    title: String(data.title || "").trim(),
    summary: data.summary || null,
    sourceName: data.sourceName || null,
    sourceUrl: data.sourceUrl,
    publishedAt: data.publishedAt || null,
    gameId: data.gameId ?? null
  };
}

async function assertLinkedGameExists(gameId) {
  if (!gameId) {
    return;
  }

  const game = await gameRepository.findById(gameId);

  if (!game) {
    const error = new Error("Linked game not found");
    error.statusCode = 404;
    throw error;
  }
}

async function listArticles() {
  return articleRepository.findAll();
}

async function listArticlesByGameId(gameId) {
  await assertLinkedGameExists(gameId);

  return articleRepository.findByGameId(gameId);
}

async function getArticleById(id) {
  const article = await articleRepository.findById(id);

  if (!article) {
    const error = new Error("Article not found");
    error.statusCode = 404;
    throw error;
  }

  return article;
}

async function createArticle(payload) {
  const article = toArticlePayload(payload);

  await assertLinkedGameExists(article.gameId);

  return articleRepository.create(article);
}

async function updateArticle(id, payload) {
  const article = toArticlePayload(payload);

  await assertLinkedGameExists(article.gameId);

  const updatedArticle = await articleRepository.update(id, article);

  if (!updatedArticle) {
    const error = new Error("Article not found");
    error.statusCode = 404;
    throw error;
  }

  return updatedArticle;
}

async function deleteArticle(id) {
  const deleted = await articleRepository.remove(id);

  if (!deleted) {
    const error = new Error("Article not found");
    error.statusCode = 404;
    throw error;
  }
}

module.exports = {
  toArticlePayload,
  listArticles,
  listArticlesByGameId,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
};
