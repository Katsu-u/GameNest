# GameNest

GameNest est un site web qui reference les sorties datees, passees et a venir, de jeux video. Le projet s'appuie sur l'API IGDB de Twitch pour afficher les jeux, propose des recommandations de jeux similaires et contient une rubrique d'articles gaming geree manuellement depuis une page admin.

## Fonctionnalites

- Affichage des sorties a venir depuis IGDB.
- Affichage des dernieres sorties depuis IGDB.
- Pagination IGDB avec `limit` et `offset`.
- Slider horizontal avec chargement de jeux supplementaires.
- Recommandations de jeux similaires via IGDB, avec fallback par genres et plateformes.
- Rubrique articles gaming stockee en PostgreSQL.
- Page admin protegee par token pour ajouter et supprimer des articles.
- Backend Express structure en controller / service / repository.
- Lancement complet avec Docker Compose.

## Stack

- Frontend : React, Vite, Tailwind CSS, Nginx.
- Backend : Node.js, Express.
- Base de donnees : PostgreSQL.
- API externe : IGDB via Twitch.
- DevOps : Docker Compose.
- Tests : `node --test` cote backend, `vite build` cote frontend.

## Prerequis

- Docker et Docker Compose.
- Node.js 20+ si vous lancez sans Docker.
- Identifiants IGDB/Twitch :
  - `IGDB_CLIENT_ID`
  - `IGDB_CLIENT_SECRET`

## Configuration

Creer un fichier `.env` a la racine du projet :

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=gamenest
DB_USER=postgres
DB_PASSWORD=postgres

ADMIN_TOKEN=gamenest-admin

IGDB_CLIENT_ID=your_twitch_client_id
IGDB_CLIENT_SECRET=your_twitch_client_secret
```

Le fichier `.env` est ignore par Git. Ne jamais commit les vrais identifiants IGDB.

## Lancement Avec Docker

Depuis la racine du projet :

```bash
docker compose up --build
```

URLs principales :

```text
Frontend : http://localhost:8082
Admin    : http://localhost:8082/admin
Backend  : http://localhost:3000/api/health
```

Pour arreter :

```bash
docker compose down
```

Pour reinitialiser aussi la base PostgreSQL Docker :

```bash
docker compose down -v
docker compose up --build
```

## Lancement Sans Docker

Backend :

```bash
cd backend
npm install
npm start
```

Frontend :

```bash
cd frontend
npm install
npm run dev
```

En mode dev, Vite proxy les routes `/api` vers `http://localhost:3000`.

## Routes Principales

Health :

```text
GET /api/health
```

IGDB :

```text
GET /api/games/search?q=zelda
GET /api/games/upcoming?limit=50&offset=0
GET /api/games/recent?limit=50&offset=0
GET /api/games/igdb/:id/similar?limit=12
```

Jeux sauvegardes localement :

```text
GET /api/games
GET /api/games/:id
POST /api/games
PUT /api/games/:id
DELETE /api/games/:id
GET /api/games/:id/similar
GET /api/games/releases/upcoming
GET /api/games/releases/past
```

Articles :

```text
GET /api/articles
GET /api/articles/:id
GET /api/articles/game/:gameId
POST /api/articles
PUT /api/articles/:id
DELETE /api/articles/:id
```

Les routes `POST`, `PUT` et `DELETE` des articles demandent le header :

```text
x-admin-token: valeur_de_ADMIN_TOKEN
```

## Page Admin

La page admin est disponible ici :

```text
http://localhost:8082/admin
```

Elle permet :

- d'ajouter un article recent manuellement ;
- de supprimer un article existant ;
- de lier optionnellement un article a un jeu local via `gameId`.

Le token saisi dans la page admin doit correspondre a `ADMIN_TOKEN` dans `.env`.

## Tests

Backend :

```bash
cd backend
npm test
```

Frontend :

```bash
cd frontend
npm run build
```

Tests manuels rapides apres `docker compose up --build` :

```bash
curl http://localhost:3000/api/health
curl "http://localhost:3000/api/games/upcoming?limit=5&offset=0"
curl "http://localhost:3000/api/games/recent?limit=5&offset=0"
curl http://localhost:3000/api/articles
```

Test admin avec token :

```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -H "x-admin-token: gamenest-admin" \
  -d '{"title":"Article test","sourceUrl":"https://example.com/article-test"}'
```

## Scenario De Demo

1. Ouvrir `http://localhost:8082`.
2. Montrer les sorties a venir IGDB.
3. Cliquer sur les fleches du slider.
4. Cliquer sur `Charger plus` pour prouver la pagination IGDB.
5. Aller sur les dernieres sorties.
6. Cliquer sur `Voir similaires` sur un jeu.
7. Montrer les recommandations, y compris le fallback si IGDB ne fournit pas de similarites directes.
8. Montrer la rubrique articles.
9. Aller sur `http://localhost:8082/admin`.
10. Ajouter un article avec le token admin.
11. Retourner sur la page publique et verifier que l'article apparait.
12. Revenir dans l'admin et supprimer l'article de test.

## Structure

```text
backend/
  src/
    controller/
    middleware/
    model/
    repository/
    routes/
    service/
    validation/
  test/

frontend/
  src/
    components/
    services/
    styles/

database/
  schema.sql
  seed/001_initial_data.sql

docs/
  jour-01-cadrage.md
  jour-06-sorties-jeux.md
  jour-07-jeux-similaires.md
  jour-08-articles-gaming.md
```

## Depannage

- Si les jeux IGDB ne chargent pas, verifier `IGDB_CLIENT_ID` et `IGDB_CLIENT_SECRET` dans `.env`.
- Si l'admin refuse l'ajout ou la suppression, verifier que le token saisi correspond a `ADMIN_TOKEN`.
- Si les donnees seed ne changent pas, relancer avec `docker compose down -v`.
- Si le frontend semble ne pas prendre les dernieres modifications, relancer `docker compose up --build` et faire un hard refresh navigateur.
