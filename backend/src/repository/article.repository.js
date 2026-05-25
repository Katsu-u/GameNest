const baseRepository = require("./base.repository");

function mapArticleRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    publishedAt: row.published_at,
    gameId: row.game_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function findAll() {
  const result = await baseRepository.query(
    "SELECT * FROM articles ORDER BY published_at DESC NULLS LAST, id DESC"
  );

  return result.rows.map(mapArticleRow);
}

async function findById(id) {
  const result = await baseRepository.query("SELECT * FROM articles WHERE id = $1", [id]);

  return mapArticleRow(result.rows[0]);
}

async function findByGameId(gameId) {
  const result = await baseRepository.query(
    `SELECT * FROM articles
    WHERE game_id = $1
    ORDER BY published_at DESC NULLS LAST, id DESC`,
    [gameId]
  );

  return result.rows.map(mapArticleRow);
}

async function create(article) {
  const result = await baseRepository.query(
    `INSERT INTO articles (
      title,
      summary,
      source_name,
      source_url,
      published_at,
      game_id
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      article.title,
      article.summary,
      article.sourceName,
      article.sourceUrl,
      article.publishedAt,
      article.gameId
    ]
  );

  return mapArticleRow(result.rows[0]);
}

async function update(id, article) {
  const result = await baseRepository.query(
    `UPDATE articles
    SET
      title = $2,
      summary = $3,
      source_name = $4,
      source_url = $5,
      published_at = $6,
      game_id = $7,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *`,
    [
      id,
      article.title,
      article.summary,
      article.sourceName,
      article.sourceUrl,
      article.publishedAt,
      article.gameId
    ]
  );

  return mapArticleRow(result.rows[0]);
}

async function remove(id) {
  const result = await baseRepository.query(
    "DELETE FROM articles WHERE id = $1 RETURNING id",
    [id]
  );

  return result.rowCount > 0;
}

module.exports = {
  create,
  update,
  remove,
  findAll,
  findById,
  findByGameId,
  mapArticleRow
};
