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

async function findUpcomingReleases(limit) {
  const result = await baseRepository.query(
    `SELECT * FROM games
    WHERE release_date IS NOT NULL
      AND release_date >= CURRENT_DATE
    ORDER BY release_date ASC, title ASC
    LIMIT $1`,
    [limit]
  );

  return result.rows.map(mapGameRow);
}

async function findPastReleases(limit) {
  const result = await baseRepository.query(
    `SELECT * FROM games
    WHERE release_date IS NOT NULL
      AND release_date < CURRENT_DATE
    ORDER BY release_date DESC, title ASC
    LIMIT $1`,
    [limit]
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

async function findSimilarById(id, limit) {
  const result = await baseRepository.query(
    `WITH target_game AS (
      SELECT id, studio
      FROM games
      WHERE id = $1
    ),
    target_genres AS (
      SELECT genre_id
      FROM game_genres
      WHERE game_id = $1
    ),
    target_platforms AS (
      SELECT platform_id
      FROM game_platforms
      WHERE game_id = $1
    )
    SELECT
      games.*,
      COUNT(DISTINCT matching_genres.genre_id)::INT AS common_genres,
      COUNT(DISTINCT matching_platforms.platform_id)::INT AS common_platforms,
      CASE
        WHEN games.studio IS NOT NULL
          AND target_game.studio IS NOT NULL
          AND LOWER(games.studio) = LOWER(target_game.studio)
        THEN 1
        ELSE 0
      END AS same_studio
    FROM games
    CROSS JOIN target_game
    LEFT JOIN game_genres matching_genres
      ON matching_genres.game_id = games.id
      AND matching_genres.genre_id IN (SELECT genre_id FROM target_genres)
    LEFT JOIN game_platforms matching_platforms
      ON matching_platforms.game_id = games.id
      AND matching_platforms.platform_id IN (SELECT platform_id FROM target_platforms)
    WHERE games.id != $1
    GROUP BY games.id, target_game.studio
    HAVING
      COUNT(DISTINCT matching_genres.genre_id) > 0
      OR COUNT(DISTINCT matching_platforms.platform_id) > 0
      OR (
        games.studio IS NOT NULL
        AND target_game.studio IS NOT NULL
        AND LOWER(games.studio) = LOWER(target_game.studio)
      )
    ORDER BY
      (
        COUNT(DISTINCT matching_genres.genre_id) * 3
        + COUNT(DISTINCT matching_platforms.platform_id) * 2
        + CASE
          WHEN games.studio IS NOT NULL
            AND target_game.studio IS NOT NULL
            AND LOWER(games.studio) = LOWER(target_game.studio)
          THEN 1
          ELSE 0
        END
      ) DESC,
      games.rating DESC NULLS LAST,
      games.title ASC
    LIMIT $2`,
    [id, limit]
  );

  return result.rows.map((row) => ({
    ...mapGameRow(row),
    similarity: {
      score: row.common_genres * 3 + row.common_platforms * 2 + row.same_studio,
      commonGenres: row.common_genres,
      commonPlatforms: row.common_platforms,
      sameStudio: Boolean(row.same_studio)
    }
  }));
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
  findUpcomingReleases,
  findPastReleases,
  findById,
  findBySlug,
  findSimilarById,
  mapGameRow
};
