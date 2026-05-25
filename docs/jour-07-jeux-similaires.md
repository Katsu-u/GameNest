# Jour 7 - Système de jeux similaires

## Description

Ajouter une route backend capable de proposer des jeux similaires à partir d'un jeu enregistré dans la base locale.

## À faire

- créer un endpoint de similarité
- récupérer le jeu cible
- comparer les jeux sur les genres communs
- comparer les jeux sur les plateformes communes
- prendre en compte le studio commun
- calculer un score de similarité
- trier les résultats par score décroissant
- enrichir les données de seed pour tester la fonctionnalité
- ajouter des tests backend

## Livrables

- `GET /api/games/:id/similar`
- score de similarité retourné avec chaque jeu
- données de seed avec plusieurs jeux, genres et plateformes
- tests backend exécutables avec `npm test`

## Règles fonctionnelles

- le jeu cible n'est jamais retourné dans ses propres recommandations
- un genre commun vaut 3 points
- une plateforme commune vaut 2 points
- un studio commun vaut 1 point
- le paramètre optionnel `limit` permet de réduire le nombre de recommandations
- si le jeu demandé n'existe pas, l'API retourne une erreur `404`

## Exemple de réponse

```json
{
  "data": [
    {
      "id": "2",
      "title": "The Legend of Zelda: Tears of the Kingdom",
      "similarity": {
        "score": 6,
        "commonGenres": 1,
        "commonPlatforms": 1,
        "sameStudio": true
      }
    }
  ]
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
GET http://localhost:3000/api/games/1/similar
GET http://localhost:3000/api/games/1/similar?limit=3
```
