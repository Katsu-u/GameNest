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
GET http://localhost:3000/api/games/upcoming
GET http://localhost:3000/api/games/recent
```

Endpoints CRUD locaux :

```text
GET http://localhost:3000/api/games
GET http://localhost:3000/api/games/:id
POST http://localhost:3000/api/games
PUT http://localhost:3000/api/games/:id
DELETE http://localhost:3000/api/games/:id
```

Endpoints de sorties depuis la base locale :

```text
GET http://localhost:3000/api/games/releases/upcoming
GET http://localhost:3000/api/games/releases/past
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
