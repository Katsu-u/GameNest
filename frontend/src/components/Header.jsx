import React from 'react'
import styles from './Header.module.css'
import { checkApiStatus as getApiStatus } from '../services/api'

export default function Header({ apiStatus }) {
  const getStatusClass = () => {
    if (!apiStatus) return ''
    return apiStatus.online ? styles.online : styles.offline
  }

  return (
    <header className={styles.hero}>
      <nav className={styles.nav}>
        <span className={styles.brand}>GameNest</span>
        <span className={`${styles.status} ${getStatusClass()}`}>
          {apiStatus ? `API ${apiStatus.status}` : 'API en verification...'}
        </span>
      </nav>

      <section className={styles.heroContent}>
        <p className={styles.eyebrow}>Sorties, recommandations et actus gaming</p>
        <h1>Le hub simple pour suivre les jeux passes et a venir.</h1>
        <p className={styles.heroText}>
          GameNest regroupe les sorties de jeux video, les recommandations
          similaires et les articles lies a la sphere gaming.
        </p>
        <div className={styles.heroActions}>
          <a href="#upcoming" className={`${styles.button} ${styles.primary}`}>Voir les jeux</a>
          <a href="#articles" className={`${styles.button} ${styles.secondary}`}>Lire les articles</a>
        </div>
      </section>
    </header>
  )
}
