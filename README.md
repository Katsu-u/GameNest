# GameNest

GameNest est un site web qui référence les sorties datées, passées et à venir de jeux vidéo.
Chaque jeu pourra proposer une fiche détaillée, des titres similaires et des liens vers des articles de la sphère gaming.

## État du projet

Le cadrage du jour 1 est disponible ici :

- `docs/jour-01-cadrage.md`

## Stack cible

- `Node.js`
- `Express.js`
- `PostgreSQL`
- `IGDB API via Twitch`
- `HTML / CSS / JavaScript`
- `Docker Compose`

## Backend

Depuis le dossier `backend/` :

```bash
npm install
npm start
```

Endpoint de test :

```text
GET http://localhost:3000/api/health
```

Premiers endpoints IGDB :

```text
GET http://localhost:3000/api/games/search?q=zelda
GET http://localhost:3000/api/games/upcoming?limit=50&offset=0
GET http://localhost:3000/api/games/recent?limit=50&offset=0
GET http://localhost:3000/api/games/igdb/:id/similar
```

Les listes principales de GameNest utilisent IGDB. Le paramètre `limit`
est limité à `50` par appel et `offset` permet de charger les pages
suivantes.

Endpoints CRUD locaux :

```text
GET http://localhost:3000/api/games
GET http://localhost:3000/api/games/:id
POST http://localhost:3000/api/games
PUT http://localhost:3000/api/games/:id
DELETE http://localhost:3000/api/games/:id
GET http://localhost:3000/api/games/:id/similar
```

Endpoints de sorties depuis la base locale :

```text
GET http://localhost:3000/api/games/releases/upcoming
GET http://localhost:3000/api/games/releases/past
```

Ces endpoints locaux servent surtout aux jeux sauvegardés manuellement.
Pour afficher beaucoup de sorties, utiliser les endpoints IGDB ci-dessus.

Endpoints articles / actu gaming :

```text
GET http://localhost:3000/api/articles
GET http://localhost:3000/api/articles/:id
GET http://localhost:3000/api/articles/game/:gameId
POST http://localhost:3000/api/articles
PUT http://localhost:3000/api/articles/:id
DELETE http://localhost:3000/api/articles/:id
```

Pour utiliser IGDB, renseigner les variables Twitch dans `.env` :

```text
IGDB_CLIENT_ID=...
IGDB_CLIENT_SECRET=...
```

## Base de données

Le schéma PostgreSQL est disponible dans `database/schema.sql`.

Initialisation manuelle avec `psql` :

```bash
psql -U postgres -d gamenest -f database/schema.sql
psql -U postgres -d gamenest -f database/seed/001_initial_data.sql
```

## Lancement avec Docker

Depuis la racine du projet :

```bash
docker compose up --build
```

Endpoints de verification :

```text
GET http://localhost:3000/api/health
GET http://localhost:3000/api/games/upcoming?limit=50
GET http://localhost:3000/api/games/recent?limit=50
GET http://localhost:3000/api/articles
```

Pour arreter :

```bash
docker compose down
```

Pour supprimer aussi la base Docker :

```bash
docker compose down -v
```
