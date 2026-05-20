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

module.exports = {
  toGame
};
