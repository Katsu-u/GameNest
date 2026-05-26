import React, { useState, useEffect, useRef } from 'react'
import GameCard from './GameCard'
import { fetchGames } from '../services/api'

const PAGE_SIZE = 50

export default function GamesSection({ type, onGameSelect }) {
  const [games, setGames] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const isLoadingRef = useRef(false)
  const nextOffsetRef = useRef(0)
  const sliderRef = useRef(null)

  const isUpcoming = type === 'upcoming'
  const sectionId = isUpcoming ? 'upcoming' : 'games'
  const eyebrow = isUpcoming ? 'Calendrier' : 'IGDB'
  const title = isUpcoming ? 'Sorties a venir' : 'Dernieres sorties'
  const endpoint = isUpcoming ? '/games/upcoming' : '/games/recent'

  const mergeUniqueGames = (currentGames, newGames) => {
    const existingIds = new Set(currentGames.map(game => game.id))
    const uniqueNewGames = newGames.filter(game => !existingIds.has(game.id))

    return [...currentGames, ...uniqueNewGames]
  }

  const loadGames = async (append = false) => {
    if (isLoadingRef.current) {
      return
    }

    isLoadingRef.current = true
    setIsLoading(true)
    try {
      const nextOffset = append ? nextOffsetRef.current : 0
      const data = await fetchGames(endpoint, PAGE_SIZE, nextOffset)
      nextOffsetRef.current = nextOffset + PAGE_SIZE

      setGames(currentGames => (
        append ? mergeUniqueGames(currentGames, data) : data
      ))

      if (data.length < PAGE_SIZE) {
        setIsComplete(true)
      } else {
        setIsComplete(false)
      }
    } catch (error) {
      console.error('Error loading games:', error)
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }

  const scrollSlider = (direction) => {
    sliderRef.current?.scrollBy({
      left: direction * sliderRef.current.clientWidth,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    nextOffsetRef.current = 0
    setGames([])
    setIsComplete(false)
    loadGames()
  }, [type])

  return (
    <section className="py-[54px] px-[clamp(20px,5vw,72px)]" id={sectionId}>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-accent font-extrabold tracking-[0.14em] uppercase text-[0.78rem]">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        {games.length > 0 && (
          <div className="flex gap-2">
            <button
              aria-label={`Faire defiler ${title} vers la gauche`}
              className="h-11 w-11 rounded-full border border-border bg-white/7 text-2xl font-black text-text-primary transition-all duration-200 ease-in-out hover:bg-white/12 hover:-translate-y-0.5"
              onClick={() => scrollSlider(-1)}
              type="button"
            >
              ‹
            </button>
            <button
              aria-label={`Faire defiler ${title} vers la droite`}
              className="h-11 w-11 rounded-full border border-border bg-white/7 text-2xl font-black text-text-primary transition-all duration-200 ease-in-out hover:bg-white/12 hover:-translate-y-0.5"
              onClick={() => scrollSlider(1)}
              type="button"
            >
              ›
            </button>
          </div>
        )}
      </div>
      
      {games.length === 0 && !isLoading ? (
        <article className="border border-border bg-bg-surface rounded-[26px] shadow-dark p-[22px] text-text-muted text-center flex items-center justify-center min-h-[120px]">Aucun jeu disponible.</article>
      ) : (
        <>
          <div ref={sliderRef} className="flex gap-[18px] overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth">
            {games.map(game => (
              <div key={game.id} className="flex-none min-w-[230px] basis-[82%] sm:basis-[45%] lg:basis-[calc((100%_-_72px)/5)] snap-start">
                <GameCard
                  game={game}
                  onSimilarClick={(id, title) => {
                    onGameSelect?.(id, title)
                    document.querySelector('#similar').scrollIntoView({ behavior: 'smooth' })
                  }}
                />
              </div>
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
