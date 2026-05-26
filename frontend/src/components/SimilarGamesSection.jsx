import React, { useState, useEffect, useRef } from 'react'
import GameCard from './GameCard'
import { fetchGames } from '../services/api'

export default function SimilarGamesSection({ gameId, gameTitle, onGameSelect }) {
  const [games, setGames] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const sliderRef = useRef(null)

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

  const scrollSlider = (direction) => {
    sliderRef.current?.scrollBy({
      left: direction * sliderRef.current.clientWidth,
      behavior: 'smooth'
    })
  }

  return (
    <section className="py-[54px] px-[clamp(20px,5vw,72px)] bg-white/3" id="similar">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-accent font-extrabold tracking-[0.14em] uppercase text-[0.78rem]">Recommandations</p>
          <h2 id="similar-title">
            {gameTitle ? `Jeux similaires a ${gameTitle}` : 'Jeux similaires'}
          </h2>
        </div>
        {games.length > 0 && (
          <div className="flex gap-2">
            <button
              aria-label="Faire defiler les jeux similaires vers la gauche"
              className="h-11 w-11 rounded-full border border-border bg-white/7 text-2xl font-black text-text-primary transition-all duration-200 ease-in-out hover:bg-white/12 hover:-translate-y-0.5"
              onClick={() => scrollSlider(-1)}
              type="button"
            >
              ‹
            </button>
            <button
              aria-label="Faire defiler les jeux similaires vers la droite"
              className="h-11 w-11 rounded-full border border-border bg-white/7 text-2xl font-black text-text-primary transition-all duration-200 ease-in-out hover:bg-white/12 hover:-translate-y-0.5"
              onClick={() => scrollSlider(1)}
              type="button"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <article className="border border-border bg-bg-surface rounded-[26px] shadow-dark p-[22px] text-text-muted text-center flex items-center justify-center min-h-[120px]">Chargement des recommandations...</article>
      ) : games.length === 0 ? (
        <article className="border border-border bg-bg-surface rounded-[26px] shadow-dark p-[22px] text-text-muted text-center flex items-center justify-center min-h-[120px]">
          {gameId ? 'Impossible de charger les jeux similaires.' : 'Clique sur "Voir similaires" depuis une carte jeu.'}
        </article>
      ) : (
        <div ref={sliderRef} className="flex gap-[18px] overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth">
          {games.map(game => (
            <div key={game.id} className="flex-none min-w-[230px] basis-[82%] sm:basis-[45%] lg:basis-[calc((100%_-_72px)/5)] snap-start">
              <GameCard
                game={game}
                hideSimilarButton={true}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
