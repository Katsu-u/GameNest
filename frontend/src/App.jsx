import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import GamesSection from './components/GamesSection'
import SimilarGamesSection from './components/SimilarGamesSection'
import ArticlesSection from './components/ArticlesSection'
import Footer from './components/Footer'
import { checkApiStatus } from './services/api'

export default function App() {
  const [apiStatus, setApiStatus] = useState(null)
  const [similarGameId, setSimilarGameId] = useState(null)
  const [similarGameTitle, setSimilarGameTitle] = useState(null)

  useEffect(() => {
    checkApiStatus().then(status => setApiStatus(status))
  }, [])

  const handleGameSelect = (id, title) => {
    setSimilarGameId(id)
    setSimilarGameTitle(title)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header apiStatus={apiStatus} />
      <main className="flex-grow">
        <GamesSection 
          type="upcoming" 
          onGameSelect={handleGameSelect}
        />
        <GamesSection 
          type="recent" 
          onGameSelect={handleGameSelect}
        />
        <SimilarGamesSection 
          gameId={similarGameId} 
          gameTitle={similarGameTitle}
        />
        <ArticlesSection />
      </main>
      <Footer />
    </div>
  )
}
