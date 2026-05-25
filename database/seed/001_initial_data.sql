INSERT INTO genres (name)
VALUES
  ('Adventure'),
  ('Role-playing (RPG)'),
  ('Shooter'),
  ('Strategy'),
  ('Indie')
ON CONFLICT (name) DO NOTHING;

INSERT INTO platforms (name)
VALUES
  ('PC (Microsoft Windows)'),
  ('PlayStation 5'),
  ('Xbox Series X|S'),
  ('Nintendo Switch')
ON CONFLICT (name) DO NOTHING;

INSERT INTO tags (name)
VALUES
  ('Upcoming'),
  ('Recently released'),
  ('IGDB'),
  ('Featured')
ON CONFLICT (name) DO NOTHING;

INSERT INTO games (
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
VALUES (
  1022,
  'The Legend of Zelda',
  'the-legend-of-zelda',
  'Classic adventure game used as seed data for GameNest.',
  '1986-02-21',
  'https://images.igdb.com/igdb/image/upload/t_cover_big/co1uii.jpg',
  'Nintendo',
  'Nintendo',
  'released',
  81
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO games (
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
VALUES
  (
    119388,
    'The Legend of Zelda: Tears of the Kingdom',
    'the-legend-of-zelda-tears-of-the-kingdom',
    'Open-world adventure game used to validate similar game recommendations.',
    '2023-05-12',
    'https://images.igdb.com/igdb/image/upload/t_cover_big/co5vmg.jpg',
    'Nintendo',
    'Nintendo',
    'released',
    96
  ),
  (
    1942,
    'The Witcher 3: Wild Hunt',
    'the-witcher-3-wild-hunt',
    'Role-playing adventure game used to validate genre-based similarity.',
    '2015-05-19',
    'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg',
    'CD Projekt RED',
    'CD Projekt',
    'released',
    93
  ),
  (
    133302,
    'Hollow Knight: Silksong',
    'hollow-knight-silksong',
    'Upcoming indie adventure game used to validate upcoming releases.',
    '2026-09-04',
    'https://images.igdb.com/igdb/image/upload/t_cover_big/co2g7z.jpg',
    'Team Cherry',
    'Team Cherry',
    'upcoming',
    NULL
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO game_genres (game_id, genre_id)
SELECT games.id, genres.id
FROM games
JOIN genres ON genres.name IN ('Adventure')
WHERE games.slug IN (
  'the-legend-of-zelda',
  'the-legend-of-zelda-tears-of-the-kingdom',
  'the-witcher-3-wild-hunt',
  'hollow-knight-silksong'
)
ON CONFLICT DO NOTHING;

INSERT INTO game_genres (game_id, genre_id)
SELECT games.id, genres.id
FROM games
JOIN genres ON genres.name = 'Role-playing (RPG)'
WHERE games.slug IN (
  'the-legend-of-zelda-tears-of-the-kingdom',
  'the-witcher-3-wild-hunt'
)
ON CONFLICT DO NOTHING;

INSERT INTO game_genres (game_id, genre_id)
SELECT games.id, genres.id
FROM games
JOIN genres ON genres.name = 'Indie'
WHERE games.slug = 'hollow-knight-silksong'
ON CONFLICT DO NOTHING;

INSERT INTO game_platforms (game_id, platform_id)
SELECT games.id, platforms.id
FROM games
JOIN platforms ON platforms.name = 'Nintendo Switch'
WHERE games.slug IN (
  'the-legend-of-zelda',
  'the-legend-of-zelda-tears-of-the-kingdom',
  'hollow-knight-silksong'
)
ON CONFLICT DO NOTHING;

INSERT INTO game_platforms (game_id, platform_id)
SELECT games.id, platforms.id
FROM games
JOIN platforms ON platforms.name IN ('PC (Microsoft Windows)', 'PlayStation 5', 'Xbox Series X|S')
WHERE games.slug IN (
  'the-witcher-3-wild-hunt',
  'hollow-knight-silksong'
)
ON CONFLICT DO NOTHING;

INSERT INTO articles (
  title,
  summary,
  source_name,
  source_url,
  published_at
)
VALUES (
  'GameNest seed article',
  'Example article used to validate the articles table.',
  'GameNest',
  'https://example.com/gamenest-seed-article',
  NOW()
)
ON CONFLICT DO NOTHING;
