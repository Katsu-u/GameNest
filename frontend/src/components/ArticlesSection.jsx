import React, { useState, useEffect } from 'react'
import { fetchArticles } from '../services/api'

export default function ArticlesSection() {
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true)
      try {
        const data = await fetchArticles()
        setArticles(data)
      } catch (error) {
        console.error('Error loading articles:', error)
        setArticles([])
      } finally {
        setIsLoading(false)
      }
    }

    loadArticles()
  }, [])

  const formatDate = (value) => {
    if (!value) return "Date inconnue"
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(new Date(value))
  }

  return (
    <section className="py-[54px] px-[clamp(20px,5vw,72px)]" id="articles">
      <div className="mb-6">
        <p className="mb-3 text-accent font-extrabold tracking-[0.14em] uppercase text-[0.78rem]">Actu gaming</p>
        <h2>Articles recents</h2>
      </div>

      {isLoading ? (
        <article className="border border-border bg-bg-surface rounded-[26px] shadow-dark p-[22px] text-text-muted text-center flex items-center justify-center min-h-[120px]">Chargement des articles...</article>
      ) : articles.length === 0 ? (
        <article className="border border-border bg-bg-surface rounded-[26px] shadow-dark p-[22px] text-text-muted text-center flex items-center justify-center min-h-[120px]">Aucun article disponible.</article>
      ) : (
        <div className="grid gap-4">
          {articles.map(article => (
            <article key={article.id} className="border border-border bg-bg-surface rounded-[26px] shadow-dark p-[22px] overflow-hidden">
              <p className="mb-3 text-accent font-extrabold tracking-[0.14em] uppercase text-[0.78rem]">
                {article.sourceName || "Source inconnue"} - {formatDate(article.publishedAt)}
              </p>
              <h3>{article.title}</h3>
              <p className="text-text-muted leading-[1.6]">{article.summary || "Pas de resume disponible."}</p>
              <a className="text-accent font-black transition-opacity duration-200 ease-in-out hover:opacity-80" href={article.sourceUrl} target="_blank" rel="noreferrer">
                Lire l'article
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
