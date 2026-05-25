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

DELETE FROM articles
WHERE source_url LIKE 'https://example.com/%';

DELETE FROM games
WHERE slug = 'hollow-knight-silksong';

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
  'Action-adventure game developed and published by Nintendo, first released in Japan for the Famicom Disk System.',
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
    'Open-world action-adventure game developed and published by Nintendo for Nintendo Switch.',
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
    'Open-world action RPG developed and published by CD Projekt RED.',
    '2015-05-19',
    'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg',
    'CD Projekt RED',
    'CD Projekt',
    'released',
    93
  ),
  (
    NULL,
    'Grand Theft Auto VI',
    'grand-theft-auto-vi',
    'Upcoming open-world action-adventure game developed by Rockstar Games.',
    '2026-11-19',
    NULL,
    'Rockstar Games',
    'Rockstar Games',
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
  'grand-theft-auto-vi'
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
JOIN genres ON genres.name = 'Shooter'
WHERE games.slug = 'grand-theft-auto-vi'
ON CONFLICT DO NOTHING;

INSERT INTO game_platforms (game_id, platform_id)
SELECT games.id, platforms.id
FROM games
JOIN platforms ON platforms.name = 'Nintendo Switch'
WHERE games.slug IN (
  'the-legend-of-zelda',
  'the-legend-of-zelda-tears-of-the-kingdom'
)
ON CONFLICT DO NOTHING;

INSERT INTO game_platforms (game_id, platform_id)
SELECT games.id, platforms.id
FROM games
JOIN platforms ON platforms.name IN ('PC (Microsoft Windows)', 'PlayStation 5', 'Xbox Series X|S')
WHERE games.slug IN (
  'the-witcher-3-wild-hunt'
)
ON CONFLICT DO NOTHING;

INSERT INTO game_platforms (game_id, platform_id)
SELECT games.id, platforms.id
FROM games
JOIN platforms ON platforms.name IN ('PlayStation 5', 'Xbox Series X|S')
WHERE games.slug IN (
  'grand-theft-auto-vi'
)
ON CONFLICT DO NOTHING;

INSERT INTO articles (
  title,
  summary,
  source_name,
  source_url,
  published_at,
  game_id
)
SELECT
  'The Legend of Zelda on Nintendo Famicom 40th Anniversary',
  'Official Nintendo page for the original The Legend of Zelda.',
  'Nintendo',
  'https://www.nintendo.com/jp/famicom/software/zelda1/index.html',
  '2026-02-21T00:00:00Z',
  games.id
FROM games
WHERE games.slug = 'the-legend-of-zelda'
  AND NOT EXISTS (
    SELECT 1
    FROM articles
    WHERE articles.source_url = 'https://www.nintendo.com/jp/famicom/software/zelda1/index.html'
  )
ON CONFLICT DO NOTHING;

INSERT INTO articles (
  title,
  summary,
  source_name,
  source_url,
  published_at,
  game_id
)
SELECT
  articles.title,
  articles.summary,
  articles.source_name,
  articles.source_url,
  articles.published_at::TIMESTAMPTZ,
  games.id
FROM (
  VALUES
    (
      'Tears of the Kingdom launches for Nintendo Switch on May 12, 2023',
      'Official Nintendo news post announcing the title and launch date of Tears of the Kingdom.',
      'Nintendo',
      'https://www.nintendo.com/us/whatsnew/out-of-the-shadows-the-legend-of-zelda-tears-of-the-kingdom-launches-for-nintendo-switch-on-may-12-2023/',
      '2022-09-13T00:00:00Z',
      'the-legend-of-zelda-tears-of-the-kingdom'
    ),
    (
      'Grand Theft Auto VI is now set to launch November 19, 2026',
      'Official Rockstar Games Newswire update confirming the new GTA VI launch date.',
      'Rockstar Games',
      'https://www.rockstargames.com/newswire/article/ak3ak31a49a221/grand-theft-auto-vi-is-now-set-to-launch-november-19-2026',
      '2025-11-06T00:00:00Z',
      'grand-theft-auto-vi'
    ),
    (
      'CD PROJEKT Group summarizes the release of The Witcher 3',
      'Official CD PROJEKT article about the launch and commercial performance of The Witcher 3.',
      'CD PROJEKT',
      'https://www.cdprojekt.com/en/media/news/the-cd-projekt-group-summarizes-the-release-of-the-witcher-3/',
      '2015-08-26T00:00:00Z',
      'the-witcher-3-wild-hunt'
    )
) AS articles(title, summary, source_name, source_url, published_at, game_slug)
JOIN games ON games.slug = articles.game_slug
WHERE NOT EXISTS (
  SELECT 1
  FROM articles existing_articles
  WHERE existing_articles.source_url = articles.source_url
)
ON CONFLICT DO NOTHING;
