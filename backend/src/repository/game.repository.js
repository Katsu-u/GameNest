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

module.exports = {
  findAll,
  findById,
  findBySlug,
  mapGameRow
};
