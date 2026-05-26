import React from 'react'

export default function Header({ apiStatus }) {
  return (
    <header className="min-h-auto gap-16 py-6 px-[clamp(20px,5vw,72px)] flex flex-col relative overflow-hidden min-[721px]:min-h-[72vh]">
      {/* Decorative background circle replacing the hero::after style */}
      <div className="absolute w-[420px] h-[420px] -right-[120px] -bottom-[120px] border border-border rounded-full bg-gradient-to-br from-accent/14 to-transparent pointer-events-none" />

      <nav className="flex flex-col items-start gap-4 min-[721px]:flex-row min-[721px]:justify-between min-[721px]:items-center relative z-10">
        <span className="text-[1.35rem] font-black tracking-[0.08em] uppercase">GameNest</span>
      </nav>

      <section className="w-full max-w-[850px] my-auto relative z-10">
        <p className="mb-3 text-accent font-extrabold tracking-[0.14em] uppercase text-[0.78rem]">Sorties, recommandations et actus gaming</p>
        <h1>Le hub simple pour suivre les jeux passes et a venir.</h1>
        <p className="max-w-[650px] text-text-muted text-[1.15rem] leading-[1.7]">
          GameNest regroupe les sorties de jeux video, les recommandations
          similaires et les articles lies a la sphere gaming.
        </p>
        <div className="flex gap-3 flex-wrap mt-[30px]">
          <a href="#upcoming" className="inline-flex items-center justify-center rounded-full py-[13px] px-[18px] no-underline border border-border font-bold cursor-pointer transition-all duration-200 ease-in-out text-[#06120c] bg-accent hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(88,240,167,0.3)]">Voir les jeux</a>
          <a href="#articles" className="inline-flex items-center justify-center rounded-full py-[13px] px-[18px] no-underline border border-border font-bold cursor-pointer transition-all duration-200 ease-in-out text-text-primary bg-white/6 hover:bg-white/12">Lire les articles</a>
        </div>
      </section>
    </header>
  )
}
