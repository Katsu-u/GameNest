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
