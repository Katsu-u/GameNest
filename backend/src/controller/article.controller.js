const articleService = require("../service/article.service");

async function listArticles(req, res) {
  const articles = await articleService.listArticles();

  res.status(200).json({
    data: articles
  });
}

async function listArticlesByGameId(req, res) {
  const articles = await articleService.listArticlesByGameId(req.params.gameId);

  res.status(200).json({
    data: articles
  });
}

async function getArticleById(req, res) {
  const article = await articleService.getArticleById(req.params.id);

  res.status(200).json({
    data: article
  });
}

async function createArticle(req, res) {
  const article = await articleService.createArticle(req.body);

  res.status(201).json({
    data: article
  });
}

async function updateArticle(req, res) {
  const article = await articleService.updateArticle(req.params.id, req.body);

  res.status(200).json({
    data: article
  });
}

async function deleteArticle(req, res) {
  await articleService.deleteArticle(req.params.id);

  res.status(204).send();
}

module.exports = {
  listArticles,
  listArticlesByGameId,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
};
