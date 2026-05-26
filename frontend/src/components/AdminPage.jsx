import React, { useEffect, useState } from 'react'
import { createArticle, deleteArticle, fetchArticles } from '../services/api'

const fieldClassName = "rounded-2xl border border-border bg-bg-surface-strong px-4 py-3 text-text-primary placeholder:text-text-muted/70 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"

const initialForm = {
  adminToken: sessionStorage.getItem('gamenest-admin-token') || '',
  title: '',
  summary: '',
  sourceName: '',
  sourceUrl: '',
  publishedAt: '',
  gameId: ''
}

export default function AdminPage() {
  const [form, setForm] = useState(initialForm)
  const [articles, setArticles] = useState([])
  const [isLoadingArticles, setIsLoadingArticles] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingArticleId, setDeletingArticleId] = useState(null)
  const [message, setMessage] = useState(null)
  const [hasSavedToken, setHasSavedToken] = useState(
    Boolean(sessionStorage.getItem('gamenest-admin-token'))
  )

  const loadArticles = async () => {
    setIsLoadingArticles(true)
    try {
      const data = await fetchArticles()
      setArticles(data)
    } catch (error) {
      console.error('Error loading articles:', error)
      setArticles([])
    } finally {
      setIsLoadingArticles(false)
    }
  }

  useEffect(() => {
    loadArticles()
  }, [])

  const formatDate = (value) => {
    if (!value) return 'Date inconnue'
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date(value))
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm(currentForm => ({
      ...currentForm,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    const payload = {
      title: form.title,
      summary: form.summary || null,
      sourceName: form.sourceName || null,
      sourceUrl: form.sourceUrl,
      publishedAt: form.publishedAt || new Date().toISOString(),
      gameId: form.gameId ? Number(form.gameId) : null
    }

    try {
      await createArticle(payload, form.adminToken)
      sessionStorage.setItem('gamenest-admin-token', form.adminToken)
      setHasSavedToken(true)
      setForm(currentForm => ({
        ...initialForm,
        adminToken: currentForm.adminToken
      }))
      setMessage({ type: 'success', text: 'Article ajoute avec succes.' })
      await loadArticles()
    } catch (error) {
      console.error('Error creating article:', error)
      setMessage({
        type: 'error',
        text: "Acces refuse ou formulaire invalide. Verifie le token admin, le titre et l'URL."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (article) => {
    if (!window.confirm(`Supprimer l'article "${article.title}" ?`)) {
      return
    }

    setDeletingArticleId(article.id)
    setMessage(null)

    try {
      await deleteArticle(article.id, form.adminToken)
      setArticles(currentArticles => (
        currentArticles.filter(currentArticle => currentArticle.id !== article.id)
      ))
      setMessage({ type: 'success', text: 'Article supprime avec succes.' })
    } catch (error) {
      console.error('Error deleting article:', error)
      setMessage({
        type: 'error',
        text: "Suppression impossible. Verifie le token admin."
      })
    } finally {
      setDeletingArticleId(null)
    }
  }

  const clearSavedToken = () => {
    sessionStorage.removeItem('gamenest-admin-token')
    setHasSavedToken(false)
    setForm(currentForm => ({
      ...currentForm,
      adminToken: ''
    }))
    setMessage({ type: 'success', text: 'Token admin efface pour cette session.' })
  }

  return (
    <main className="flex-grow py-[54px] px-[clamp(20px,5vw,72px)]">
      <div className="mb-8">
        <a className="text-accent font-black" href="/">Retour au site</a>
        <p className="mt-8 mb-3 text-accent-warm font-extrabold tracking-[0.14em] uppercase text-[0.78rem]">Administration</p>
        <h1 className="text-[clamp(2.8rem,8vw,6rem)] leading-[0.95] tracking-[-0.07em] mb-5">Gestion des articles</h1>
        <p className="text-text-muted leading-[1.7] max-w-2xl">
          Cette page permet d'ajouter manuellement une actualite gaming. Les envois sont proteges par un token admin cote backend.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="border border-border bg-bg-surface rounded-[26px] shadow-dark p-[22px] grid gap-4">
        <label className="grid gap-2 text-text-muted font-bold">
          Token admin *
          <input
            className={fieldClassName}
            name="adminToken"
            value={form.adminToken}
            onChange={handleChange}
            required
            type="password"
            placeholder="Token admin"
          />
          <span className="text-sm font-normal text-text-muted">
            {hasSavedToken
              ? 'Un token est deja memorise dans cette session navigateur.'
              : 'Aucun token memorise pour cette session.'}
          </span>
        </label>
        {hasSavedToken && (
          <button
            className="w-fit rounded-full border border-border bg-white/7 py-2.5 px-4 text-text-primary font-black cursor-pointer transition-all duration-200 ease-in-out hover:bg-white/12"
            onClick={clearSavedToken}
            type="button"
          >
            Effacer le token memorise
          </button>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-text-muted font-bold">
            Titre *
            <input
              className={fieldClassName}
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={255}
              placeholder="Titre de l'article"
            />
          </label>

          <label className="grid gap-2 text-text-muted font-bold">
            Source
            <input
              className={fieldClassName}
              name="sourceName"
              value={form.sourceName}
              onChange={handleChange}
              maxLength={160}
              placeholder="Nintendo, Rockstar, IGN..."
            />
          </label>

          <label className="grid gap-2 text-text-muted font-bold md:col-span-2">
            URL source *
            <input
              className={fieldClassName}
              name="sourceUrl"
              value={form.sourceUrl}
              onChange={handleChange}
              required
              type="url"
              placeholder="https://..."
            />
          </label>

          <label className="grid gap-2 text-text-muted font-bold">
            Date de publication
            <input
              className={fieldClassName}
              name="publishedAt"
              value={form.publishedAt}
              onChange={handleChange}
              type="datetime-local"
            />
          </label>

          <label className="grid gap-2 text-text-muted font-bold">
            ID local du jeu lie
            <input
              className={fieldClassName}
              name="gameId"
              value={form.gameId}
              onChange={handleChange}
              type="number"
              min="1"
              placeholder="Optionnel"
            />
          </label>

          <label className="grid gap-2 text-text-muted font-bold md:col-span-2">
            Resume
            <textarea
              className={`${fieldClassName} min-h-[110px]`}
              name="summary"
              value={form.summary}
              onChange={handleChange}
              placeholder="Court resume de l'article"
            />
          </label>
        </div>

        {message && (
          <p className={message.type === 'success' ? 'text-accent font-bold' : 'text-red-300 font-bold'}>
            {message.text}
          </p>
        )}

        <button
          className="w-fit rounded-full py-[13px] px-[18px] text-[#06120c] bg-accent font-black cursor-pointer transition-all duration-200 ease-in-out hover:enabled:-translate-y-0.5 disabled:opacity-45 disabled:cursor-not-allowed"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Ajout en cours...' : "Ajouter l'article"}
        </button>
      </form>

      <section className="mt-10">
        <div className="mb-6">
          <p className="mb-3 text-accent font-extrabold tracking-[0.14em] uppercase text-[0.78rem]">Moderation</p>
          <h2>Articles existants</h2>
        </div>

        {isLoadingArticles ? (
          <article className="border border-border bg-bg-surface rounded-[26px] shadow-dark p-[22px] text-text-muted text-center flex items-center justify-center min-h-[120px]">Chargement des articles...</article>
        ) : articles.length === 0 ? (
          <article className="border border-border bg-bg-surface rounded-[26px] shadow-dark p-[22px] text-text-muted text-center flex items-center justify-center min-h-[120px]">Aucun article disponible.</article>
        ) : (
          <div className="grid gap-4">
            {articles.map(article => (
              <article key={article.id} className="border border-border bg-bg-surface rounded-[26px] shadow-dark p-[22px] grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="mb-3 text-accent font-extrabold tracking-[0.14em] uppercase text-[0.78rem]">
                    {article.sourceName || 'Source inconnue'} - {formatDate(article.publishedAt)}
                  </p>
                  <h3>{article.title}</h3>
                  <p className="text-text-muted leading-[1.6]">{article.summary || 'Pas de resume disponible.'}</p>
                </div>
                <button
                  className="w-fit rounded-full border border-red-400/40 bg-red-500/15 py-3 px-4 text-red-200 font-black cursor-pointer transition-all duration-200 ease-in-out hover:bg-red-500/25 disabled:opacity-45 disabled:cursor-not-allowed"
                  disabled={deletingArticleId === article.id}
                  onClick={() => handleDelete(article)}
                  type="button"
                >
                  {deletingArticleId === article.id ? 'Suppression...' : 'Supprimer'}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
