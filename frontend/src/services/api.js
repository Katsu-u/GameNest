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
