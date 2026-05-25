# Jour 6 - Affichage des sorties passées et à venir

## Description

Ajouter des endpoints backend pour récupérer les jeux enregistrés dans la base locale selon leur date de sortie.

## À faire

- créer une route pour les sorties à venir
- créer une route pour les sorties déjà passées
- trier les sorties à venir de la plus proche à la plus lointaine
- trier les sorties passées de la plus récente à la plus ancienne
- limiter le nombre de résultats retournés
- documenter les routes disponibles
- ajouter des tests sur la logique de limite

## Livrables

- `GET /api/games/releases/upcoming`
- `GET /api/games/releases/past`
- logique repository dédiée aux dates de sortie
- tests backend exécutables avec `npm test`

## Règles fonctionnelles

- une sortie à venir correspond à un jeu avec une `release_date` supérieure ou égale à la date du jour
- une sortie passée correspond à un jeu avec une `release_date` strictement inférieure à la date du jour
- les jeux sans date de sortie ne sont pas affichés dans ces deux listes
- le paramètre optionnel `limit` permet de réduire le nombre de jeux retournés

## Tests manuels

Depuis `backend/` :

```bash
npm test
npm start
```

Puis appeler :

```text
GET http://localhost:3000/api/games/releases/upcoming
GET http://localhost:3000/api/games/releases/past
GET http://localhost:3000/api/games/releases/upcoming?limit=5
GET http://localhost:3000/api/games/releases/past?limit=5
```
