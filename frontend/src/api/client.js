import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const TOKEN_KEY = 'tawakkal_tokens' // { access, refresh }

export function getTokens() {
  try {
    return JSON.parse(localStorage.getItem(TOKEN_KEY))
  } catch {
    return null
  }
}

export function setTokens(tokens) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens))
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY)
}

const client = axios.create({ baseURL: API_URL })

client.interceptors.request.use((config) => {
  const tokens = getTokens()
  if (tokens?.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`
  }
  return config
})

let refreshing = null

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    const tokens = getTokens()

    if (error.response?.status === 401 && tokens?.refresh && !original._retry) {
      original._retry = true
      try {
        refreshing =
          refreshing ||
          axios.post(`${API_URL}/auth/token/refresh/`, { refresh: tokens.refresh })
        const { data } = await refreshing
        refreshing = null
        setTokens({ ...tokens, access: data.access })
        original.headers.Authorization = `Bearer ${data.access}`
        return client(original)
      } catch {
        refreshing = null
        clearTokens()
      }
    }
    return Promise.reject(error)
  }
)

export default client

export function getErrorMessage(error) {
  const data = error?.response?.data
  if (!data) return error?.message || 'Something went wrong. Please try again.'
  if (typeof data === 'string') return data
  if (data.detail) return data.detail
  const firstKey = Object.keys(data)[0]
  if (firstKey) {
    const val = data[firstKey]
    return Array.isArray(val) ? val[0] : String(val)
  }
  return 'Something went wrong. Please try again.'
}
