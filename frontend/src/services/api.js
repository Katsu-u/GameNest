const API_URL = "/api"

export async function fetchJson(path) {
  const response = await fetch(`${API_URL}${path}`)
  
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
  
  return response.json()
}

export async function checkApiStatus() {
  try {
    const health = await fetchJson("/health")
    return { online: true, status: health.status }
  } catch (error) {
    return { online: false, status: "indisponible" }
  }
}

export async function fetchGames(endpoint, limit = 50, offset = 0) {
  const response = await fetchJson(`${endpoint}?limit=${limit}&offset=${offset}`)
  return response.data || []
}

export async function fetchArticles() {
  const response = await fetchJson("/articles")
  return response.data || []
}

export async function createArticle(article, adminToken) {
  const response = await fetch(`${API_URL}/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": adminToken
    },
    body: JSON.stringify(article)
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json()
}

export async function deleteArticle(articleId, adminToken) {
  const response = await fetch(`${API_URL}/articles/${articleId}`, {
    method: "DELETE",
    headers: {
      "x-admin-token": adminToken
    }
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
}
