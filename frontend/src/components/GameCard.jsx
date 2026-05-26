import React from 'react'
import styles from './GameCard.module.css'

export default function GameCard({ game, hideSimilarButton = false, onSimilarClick }) {
  const formatDate = (value) => {
    if (!value) return "Date inconnue"
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(new Date(value))
  }

  const imageOrFallback = (game) => {
    return game.coverImageUrl || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80"
  }

  return (
    <article className={styles.gameCard}>
      <img className={styles.cover} src={imageOrFallback(game)} alt={`Cover de ${game.title}`} />
      <div className={styles.cardBody}>
        <div className={styles.badgeRow}>
          <span className={styles.badge}>{game.status || "unknown"}</span>
          {game.similarity && (
            <span className={`${styles.badge} ${styles.warm}`}>
              Score {game.similarity.score}
            </span>
          )}
        </div>
        <h3>{game.title}</h3>
        <p className={styles.meta}>
          Sortie : {formatDate(game.releaseDate)}<br />
          Studio : {game.studio || "Non renseigne"}<br />
          Note : {game.rating ?? "N/A"}
        </p>
        {!hideSimilarButton && (
          <button 
            className={styles.cardAction}
            onClick={() => onSimilarClick?.(game.id, game.title)}
          >
            Voir similaires
          </button>
        )}
      </div>
    </article>
  )
}
