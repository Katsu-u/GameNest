import React, { useState, useEffect } from 'react'
import GameCard from './GameCard'
import styles from './components.module.css'
import { fetchGames } from '../services/api'

export default function SimilarGamesSection({ gameId, gameTitle, onGameSelect }) {
  const [games, setGames] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!gameId) {
      setGames([])
      return
    }

    const loadSimilar = async () => {
      setIsLoading(true)
      try {
        const data = await fetchGames(`/games/igdb/${gameId}/similar`, 12)
        setGames(data)
      } catch (error) {
        console.error('Error loading similar games:', error)
        setGames([])
      } finally {
        setIsLoading(false)
      }
    }

    loadSimilar()
  }, [gameId])

  return (
    <section className={`${styles.section} ${styles.similarSection}`} id="similar">
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>Recommandations</p>
        <h2 id="similar-title">
          {gameTitle ? `Jeux similaires a ${gameTitle}` : 'Jeux similaires'}
        </h2>
      </div>

      {isLoading ? (
        <article className={styles.emptyCard}>Chargement des recommandations...</article>
      ) : games.length === 0 ? (
        <article className={styles.emptyCard}>
          {gameId ? 'Impossible de charger les jeux similaires.' : 'Clique sur "Voir similaires" depuis une carte jeu.'}
        </article>
      ) : (
        <div className={styles.grid}>
          {games.map(game => (
            <GameCard 
              key={game.id} 
              game={game}
              hideSimilarButton={true}
            />
          ))}
        </div>
      )}
    </section>
  )
}
