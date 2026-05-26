import React, { useState, useEffect } from 'react'
import GameCard from './GameCard'
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
    <section className="py-[54px] px-[clamp(20px,5vw,72px)]" id={sectionId}>
      <div className="mb-6">
        <p className="mb-3 text-accent font-extrabold tracking-[0.14em] uppercase text-[0.78rem]">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      
      {games.length === 0 && !isLoading ? (
        <article className="border border-border bg-bg-surface rounded-[26px] shadow-dark p-[22px] text-text-muted text-center flex items-center justify-center min-h-[120px]">Aucun jeu disponible.</article>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[18px]">
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
              className="block w-fit mx-auto mt-[22px] border border-border rounded-full py-[13px] px-[18px] text-text-primary bg-white/7 font-black cursor-pointer transition-all duration-200 ease-in-out hover:enabled:bg-white/12 hover:enabled:-translate-y-0.5 disabled:opacity-45 disabled:cursor-not-allowed"
              disabled={isLoading}
              onClick={() => loadGames(true)}
            >
              {isLoading ? 'Chargement...' : `Charger plus de ${isUpcoming ? 'sorties a venir' : 'dernieres sorties'}`}
            </button>
          )}
          {isComplete && games.length > 0 && (
            <button className="block w-fit mx-auto mt-[22px] border border-border rounded-full py-[13px] px-[18px] text-text-primary bg-white/7 font-black cursor-pointer transition-all duration-200 ease-in-out hover:enabled:bg-white/12 hover:enabled:-translate-y-0.5 disabled:opacity-45 disabled:cursor-not-allowed" disabled>
              {isUpcoming ? 'Toutes les sorties a venir chargees' : 'Toutes les dernieres sorties chargees'}
            </button>
          )}
        </>
      )}
    </section>
  )
}
