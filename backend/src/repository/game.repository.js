const baseRepository = require("./base.repository");

function mapGameRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    igdbId: row.igdb_id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    releaseDate: row.release_date,
    coverImageUrl: row.cover_image_url,
    studio: row.studio,
    publisher: row.publisher,
    status: row.status,
    rating: row.rating,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function findAll() {
  const result = await baseRepository.query(
    "SELECT * FROM games ORDER BY release_date DESC NULLS LAST, title ASC"
  );

  return result.rows.map(mapGameRow);
}

async function findById(id) {
  const result = await baseRepository.query("SELECT * FROM games WHERE id = $1", [id]);

  return mapGameRow(result.rows[0]);
}

async function findBySlug(slug) {
  const result = await baseRepository.query("SELECT * FROM games WHERE slug = $1", [slug]);

  return mapGameRow(result.rows[0]);
}

async function create(game) {
  const result = await baseRepository.query(
    `INSERT INTO games (
      igdb_id,
      title,
      slug,
      description,
      release_date,
      cover_image_url,
      studio,
      publisher,
      status,
      rating
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`,
    [
      game.igdbId,
      game.title,
      game.slug,
      game.description,
      game.releaseDate,
      game.coverImageUrl,
      game.studio,
      game.publisher,
      game.status,
      game.rating
    ]
  );

  return mapGameRow(result.rows[0]);
}

async function update(id, game) {
  const result = await baseRepository.query(
    `UPDATE games
    SET
      igdb_id = $2,
      title = $3,
      slug = $4,
      description = $5,
      release_date = $6,
      cover_image_url = $7,
      studio = $8,
      publisher = $9,
      status = $10,
      rating = $11,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *`,
    [
      id,
      game.igdbId,
      game.title,
      game.slug,
      game.description,
      game.releaseDate,
      game.coverImageUrl,
      game.studio,
      game.publisher,
      game.status,
      game.rating
    ]
  );

  return mapGameRow(result.rows[0]);
}

async function remove(id) {
  const result = await baseRepository.query(
    "DELETE FROM games WHERE id = $1 RETURNING id",
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
  findBySlug,
  mapGameRow
};
