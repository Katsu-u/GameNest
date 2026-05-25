const API_URL = "http://localhost:3000/api";

const elements = {
  apiStatus: document.querySelector("#api-status"),
  gamesList: document.querySelector("#games-list"),
  upcomingGames: document.querySelector("#upcoming-games"),
  similarGames: document.querySelector("#similar-games"),
  similarTitle: document.querySelector("#similar-title"),
  articlesList: document.querySelector("#articles-list"),
  loadMoreRecent: document.querySelector("#load-more-recent"),
  loadMoreUpcoming: document.querySelector("#load-more-upcoming")
};

const state = {
  recentOffset: 0,
  upcomingOffset: 0,
  pageSize: 50,
  recentGames: [],
  upcomingGames: []
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

async function loadRecentGames({ append = false } = {}) {
  elements.loadMoreRecent.disabled = true;
  elements.loadMoreRecent.textContent = "Chargement...";

  const recentGames = await fetchJson(
    `/games/recent?limit=${state.pageSize}&offset=${state.recentOffset}`
  );

  state.recentGames = append
    ? [...state.recentGames, ...recentGames.data]
    : recentGames.data;
  state.recentOffset += state.pageSize;
  renderGames(state.recentGames);

  elements.loadMoreRecent.disabled = recentGames.data.length < state.pageSize;
  elements.loadMoreRecent.textContent = elements.loadMoreRecent.disabled
    ? "Toutes les dernieres sorties chargees"
    : "Charger plus de dernieres sorties";
}

async function loadUpcomingGames({ append = false } = {}) {
  elements.loadMoreUpcoming.disabled = true;
  elements.loadMoreUpcoming.textContent = "Chargement...";

  const upcomingGames = await fetchJson(
    `/games/upcoming?limit=${state.pageSize}&offset=${state.upcomingOffset}`
  );

  state.upcomingGames = append
    ? [...state.upcomingGames, ...upcomingGames.data]
    : upcomingGames.data;
  state.upcomingOffset += state.pageSize;
  renderUpcomingGames(state.upcomingGames);

  elements.loadMoreUpcoming.disabled = upcomingGames.data.length < state.pageSize;
  elements.loadMoreUpcoming.textContent = elements.loadMoreUpcoming.disabled
    ? "Toutes les sorties a venir chargees"
    : "Charger plus de sorties a venir";
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
    const similarGames = await fetchJson(`/games/igdb/${gameId}/similar?limit=12`);
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
    const articles = await fetchJson("/articles");

    await Promise.all([loadRecentGames(), loadUpcomingGames()]);
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

elements.loadMoreRecent.addEventListener("click", () => {
  loadRecentGames({ append: true });
});

elements.loadMoreUpcoming.addEventListener("click", () => {
  loadUpcomingGames({ append: true });
});

checkApiStatus();
loadHomePage();
