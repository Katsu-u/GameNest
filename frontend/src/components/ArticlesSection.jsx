import React, { useState, useEffect } from 'react'
import styles from './components.module.css'
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
    <section className={styles.section} id="articles">
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>Actu gaming</p>
        <h2>Articles recents</h2>
      </div>

      {isLoading ? (
        <article className={styles.emptyCard}>Chargement des articles...</article>
      ) : articles.length === 0 ? (
        <article className={styles.emptyCard}>Aucun article disponible.</article>
      ) : (
        <div className={styles.articleList}>
          {articles.map(article => (
            <article key={article.id} className={styles.articleCard}>
              <p className={styles.eyebrow}>
                {article.sourceName || "Source inconnue"} - {formatDate(article.publishedAt)}
              </p>
              <h3>{article.title}</h3>
              <p>{article.summary || "Pas de resume disponible."}</p>
              <a className={styles.articleLink} href={article.sourceUrl} target="_blank" rel="noreferrer">
                Lire l'article
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
