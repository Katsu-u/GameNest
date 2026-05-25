# Jour 8 - Module articles et actu gaming

## Description

Ajouter un module backend pour stocker et exposer des articles gaming, avec la possibilite de relier un article a un jeu.

## A faire

- creer les routes articles
- lister les articles
- consulter un article par id
- lister les articles lies a un jeu
- creer un article
- modifier un article
- supprimer un article
- valider les donnees envoyees par formulaire
- enrichir les donnees de seed
- documenter les endpoints

## Livrables

- `GET /api/articles`
- `GET /api/articles/:id`
- `GET /api/articles/game/:gameId`
- `POST /api/articles`
- `PUT /api/articles/:id`
- `DELETE /api/articles/:id`
- tests backend executables avec `npm test`

## Regles fonctionnelles

- un article doit avoir un titre
- un article doit avoir une URL source valide
- un article peut etre lie a un jeu avec `gameId`
- si le jeu lie n'existe pas, l'API retourne une erreur `404`
- les articles sont tries du plus recent au plus ancien
- la suppression retourne une reponse vide `204`

## Exemple de payload

```json
{
  "title": "Grand Theft Auto VI is now set to launch November 19, 2026",
  "summary": "Official Rockstar Games Newswire update confirming the new GTA VI launch date.",
  "sourceName": "Rockstar Games",
  "sourceUrl": "https://www.rockstargames.com/newswire/article/ak3ak31a49a221/grand-theft-auto-vi-is-now-set-to-launch-november-19-2026",
  "publishedAt": "2025-11-06T00:00:00.000Z",
  "gameId": 4
}
```

## Tests manuels

Depuis `backend/` :

```bash
npm test
npm start
```

Puis appeler :

```text
GET http://localhost:3000/api/articles
GET http://localhost:3000/api/articles/1
GET http://localhost:3000/api/articles/game/1
POST http://localhost:3000/api/articles
PUT http://localhost:3000/api/articles/1
DELETE http://localhost:3000/api/articles/1
```
