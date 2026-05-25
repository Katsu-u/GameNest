const API_URL = "http://localhost:3000/api";

const elements = {
  apiStatus: document.querySelector("#api-status"),
  gamesList: document.querySelector("#games-list"),
  upcomingGames: document.querySelector("#upcoming-games"),
  similarGames: document.querySelector("#similar-games"),
  similarTitle: document.querySelector("#similar-title"),
  articlesList: document.querySelector("#articles-list")
};

async function fetchJson(path) {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

function formatDate(value) {
  if (!value) {
    return "Date inconnue";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

function imageOrFallback(game) {
  return game.coverImageUrl || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80";
}

function renderGameCard(game, options = {}) {
  const similarity = game.similarity
    ? `<span class="badge warm">Score ${game.similarity.score}</span>`
    : "";
  const button = options.hideSimilarButton
    ? ""
    : `<button class="card-action" data-game-id="${game.id}" data-game-title="${game.title}">Voir similaires</button>`;

  return `
    <article class="game-card">
      <img class="cover" src="${imageOrFallback(game)}" alt="Cover de ${game.title}" />
      <div class="card-body">
        <div class="badge-row">
          <span class="badge">${game.status || "unknown"}</span>
          ${similarity}
        </div>
        <h3>${game.title}</h3>
        <p class="meta">
          Sortie : ${formatDate(game.releaseDate)}<br />
          Studio : ${game.studio || "Non renseigne"}<br />
          Note : ${game.rating ?? "N/A"}
        </p>
        ${button}
      </div>
    </article>
  `;
}

function renderGames(games) {
  if (!games.length) {
    elements.gamesList.innerHTML = `<article class="empty-card">Aucun jeu disponible.</article>`;
    return;
  }

  elements.gamesList.innerHTML = games.map((game) => renderGameCard(game)).join("");
}

function renderUpcomingGames(games) {
  if (!games.length) {
    elements.upcomingGames.innerHTML = `<article class="empty-card">Aucune sortie a venir.</article>`;
    return;
  }

  elements.upcomingGames.innerHTML = games
    .map((game) => renderGameCard(game, { hideSimilarButton: true }))
    .join("");
}

function renderSimilarGames(games) {
  if (!games.length) {
    elements.similarGames.innerHTML = `<article class="empty-card">Aucun jeu similaire trouve.</article>`;
    return;
  }

  elements.similarGames.innerHTML = games
    .map((game) => renderGameCard(game, { hideSimilarButton: true }))
    .join("");
}

function renderArticles(articles) {
  if (!articles.length) {
    elements.articlesList.innerHTML = `<article class="empty-card">Aucun article disponible.</article>`;
    return;
  }

  elements.articlesList.innerHTML = articles
    .map(
      (article) => `
        <article class="article-card">
          <p class="eyebrow">${article.sourceName || "Source inconnue"} - ${formatDate(article.publishedAt)}</p>
          <h3>${article.title}</h3>
          <p>${article.summary || "Pas de resume disponible."}</p>
          <a class="article-link" href="${article.sourceUrl}" target="_blank" rel="noreferrer">Lire l'article</a>
        </article>
      `
    )
    .join("");
}

async function loadSimilarGames(gameId, gameTitle) {
  elements.similarTitle.textContent = `Jeux similaires a ${gameTitle}`;
  elements.similarGames.innerHTML = `<article class="empty-card">Chargement des recommandations...</article>`;

  try {
    const similarGames = await fetchJson(`/games/${gameId}/similar`);
    renderSimilarGames(similarGames.data);
    document.querySelector("#similar").scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    elements.similarGames.innerHTML = `<article class="empty-card">Impossible de charger les jeux similaires.</article>`;
  }
}

async function checkApiStatus() {
  try {
    const health = await fetchJson("/health");
    elements.apiStatus.textContent = `API ${health.status}`;
    elements.apiStatus.classList.add("online");
  } catch (error) {
    elements.apiStatus.textContent = "API indisponible";
    elements.apiStatus.classList.add("offline");
  }
}

async function loadHomePage() {
  elements.gamesList.innerHTML = `<article class="empty-card">Chargement des jeux...</article>`;
  elements.upcomingGames.innerHTML = `<article class="empty-card">Chargement des sorties...</article>`;
  elements.articlesList.innerHTML = `<article class="empty-card">Chargement des articles...</article>`;

  try {
    const [games, upcomingGames, articles] = await Promise.all([
      fetchJson("/games"),
      fetchJson("/games/releases/upcoming"),
      fetchJson("/articles")
    ]);

    renderGames(games.data);
    renderUpcomingGames(upcomingGames.data);
    renderArticles(articles.data);
  } catch (error) {
    elements.gamesList.innerHTML = `<article class="empty-card">Erreur de chargement. Verifie que Docker est lance.</article>`;
    elements.upcomingGames.innerHTML = "";
    elements.articlesList.innerHTML = "";
  }
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-game-id]");

  if (!button) {
    return;
  }

  loadSimilarGames(button.dataset.gameId, button.dataset.gameTitle);
});

checkApiStatus();
loadHomePage();
