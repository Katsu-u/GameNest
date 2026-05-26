import React, { useState, useEffect } from 'react'
import GameCard from './GameCard'
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
    <section className="py-[54px] px-[clamp(20px,5vw,72px)] bg-white/3" id="similar">
      <div className="mb-6">
        <p className="mb-3 text-accent font-extrabold tracking-[0.14em] uppercase text-[0.78rem]">Recommandations</p>
        <h2 id="similar-title">
          {gameTitle ? `Jeux similaires a ${gameTitle}` : 'Jeux similaires'}
        </h2>
      </div>

      {isLoading ? (
        <article className="border border-border bg-bg-surface rounded-[26px] shadow-dark p-[22px] text-text-muted text-center flex items-center justify-center min-h-[120px]">Chargement des recommandations...</article>
      ) : games.length === 0 ? (
        <article className="border border-border bg-bg-surface rounded-[26px] shadow-dark p-[22px] text-text-muted text-center flex items-center justify-center min-h-[120px]">
          {gameId ? 'Impossible de charger les jeux similaires.' : 'Clique sur "Voir similaires" depuis une carte jeu.'}
        </article>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[18px]">
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
