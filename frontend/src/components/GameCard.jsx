import React from 'react'

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
    <article className="h-full border border-border bg-bg-surface rounded-[26px] shadow-dark overflow-hidden flex flex-col transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-[0_32px_96px_rgba(0,0,0,0.48)]">
      <img className="w-full aspect-[4/5] object-cover bg-bg-surface-strong" src={imageOrFallback(game)} alt={`Cover de ${game.title}`} />
      <div className="p-[18px] flex flex-col gap-2.5 flex-1">
        <div className="flex flex-wrap gap-2">
          <span className="w-fit py-1.5 px-2.5 rounded-full bg-accent/12 text-accent font-extrabold text-[0.78rem]">{game.status || "unknown"}</span>
          {game.similarity && (
            <span className="w-fit py-1.5 px-2.5 rounded-full text-accent-warm bg-accent-warm/12 font-extrabold text-[0.78rem]">
              Score {game.similarity.score}
            </span>
          )}
        </div>
        <h3>{game.title}</h3>
        <p className="text-text-muted text-[0.9rem] leading-[1.5]">
          Sortie : {formatDate(game.releaseDate)}<br />
          Studio : {game.studio || "Non renseigne"}<br />
          Note : {game.rating ?? "N/A"}
        </p>
        {!hideSimilarButton && (
          <button 
            className="mt-auto border-0 rounded-[14px] py-[11px] px-3 text-[#06120c] bg-accent font-black cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-[0_4px_12px_rgba(88,240,167,0.3)] active:scale-98"
            onClick={() => onSimilarClick?.(game.id, game.title)}
          >
            Voir similaires
          </button>
        )}
      </div>
    </article>
  )
}
