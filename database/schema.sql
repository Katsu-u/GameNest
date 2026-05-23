CREATE TABLE IF NOT EXISTS games (
  id BIGSERIAL PRIMARY KEY,
  igdb_id BIGINT UNIQUE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  release_date DATE,
  cover_image_url TEXT,
  studio VARCHAR(255),
  publisher VARCHAR(255),
  status VARCHAR(30) NOT NULL DEFAULT 'unknown',
  rating INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS genres (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS platforms (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS articles (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  source_name VARCHAR(160),
  source_url TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  game_id BIGINT REFERENCES games(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS game_genres (
  game_id BIGINT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  genre_id BIGINT NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, genre_id)
);

CREATE TABLE IF NOT EXISTS game_platforms (
  game_id BIGINT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  platform_id BIGINT NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, platform_id)
);

CREATE TABLE IF NOT EXISTS game_tags (
  game_id BIGINT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_games_release_date ON games(release_date);
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
