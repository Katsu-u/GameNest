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

module.exports = {
  findAll,
  findById,
  mapArticleRow
};
