function toGame(data) {
  return {
    id: data.id,
    title: data.title,
    slug: data.slug || null,
    description: data.description || null,
    releaseDate: data.releaseDate || null,
    coverImageUrl: data.coverImageUrl || null,
    genres: Array.isArray(data.genres) ? data.genres : [],
    platforms: Array.isArray(data.platforms) ? data.platforms : [],
    studio: data.studio || null,
    rating: data.rating ?? null
  };
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toGamePayload(data) {
  const title = String(data.title || "").trim();
  const slug = data.slug ? slugify(data.slug) : slugify(title);

  return {
    igdbId: data.igdbId ?? null,
    title,
    slug,
    description: data.description || null,
    releaseDate: data.releaseDate || null,
    coverImageUrl: data.coverImageUrl || null,
    studio: data.studio || null,
    publisher: data.publisher || null,
    status: data.status || "unknown",
    rating: data.rating ?? null
  };
}

module.exports = {
  slugify,
  toGame,
  toGamePayload
};
