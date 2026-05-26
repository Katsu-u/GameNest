import React, { useState, useEffect } from 'react'
import GameCard from './GameCard'
import styles from './components.module.css'
import { fetchGames } from '../services/api'

const PAGE_SIZE = 50

export default function GamesSection({ type, onGameSelect }) {
  const [games, setGames] = useState([])
  const [offset, setOffset] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const isUpcoming = type === 'upcoming'
  const sectionId = isUpcoming ? 'upcoming' : 'games'
  const eyebrow = isUpcoming ? 'Calendrier' : 'IGDB'
  const title = isUpcoming ? 'Sorties a venir' : 'Dernieres sorties'
  const endpoint = isUpcoming ? '/games/upcoming' : '/games/recent'

  const loadGames = async (append = false) => {
    setIsLoading(true)
    try {
      const newOffset = append ? offset : 0
      const data = await fetchGames(endpoint, PAGE_SIZE, newOffset)
      
      setGames(append ? [...games, ...data] : data)
      setOffset(newOffset + PAGE_SIZE)
      
      if (data.length < PAGE_SIZE) {
        setIsComplete(true)
      }
    } catch (error) {
      console.error('Error loading games:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadGames()
  }, [])

  return (
    <section className={styles.section} id={sectionId}>
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      
      {games.length === 0 && !isLoading ? (
        <article className={styles.emptyCard}>Aucun jeu disponible.</article>
      ) : (
        <>
          <div className={styles.grid}>
            {games.map(game => (
              <GameCard 
                key={game.id} 
                game={game}
                onSimilarClick={(id, title) => {
                  onGameSelect?.(id, title)
                  document.querySelector('#similar').scrollIntoView({ behavior: 'smooth' })
                }}
              />
            ))}
          </div>
          {!isComplete && (
            <button 
              className={styles.loadMore}
              disabled={isLoading}
              onClick={() => loadGames(true)}
            >
              {isLoading ? 'Chargement...' : `Charger plus de ${isUpcoming ? 'sorties a venir' : 'dernieres sorties'}`}
            </button>
          )}
          {isComplete && games.length > 0 && (
            <button className={styles.loadMore} disabled>
              {isUpcoming ? 'Toutes les sorties a venir chargees' : 'Toutes les dernieres sorties chargees'}
            </button>
          )}
        </>
      )}
    </section>
  )
}
