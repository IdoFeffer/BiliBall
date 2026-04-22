import axios from 'axios'

const BASE_URL =
  import.meta.env.VITE_API_URL || 'https://biliball.onrender.com/api'
  
const getToken = () => localStorage.getItem('token')

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}

export const leagues = {
  create: (data) => api.post('/leagues/create', data),
  join: (data) => api.post('/leagues/join', data),
  getMembers: (leagueId) => api.get(`/leagues/${leagueId}/members`),
  getUserLeague: () => api.get('/leagues/user'),
  getAllLeagues: () => api.get('/leagues/user/all'),
  leave: (leagueId) => api.post(`/leagues/${leagueId}/leave`),
  deleteLeague: (leagueId) => api.delete(`/leagues/${leagueId}`),
}

export const games = {
  add: (data) => api.post('/games', data),
  getLeagueGames: (leagueId) => api.get(`/games/league/${leagueId}`),
  delete: (gameId) => api.delete(`/games/${gameId}`),
  deleteNote: (gameId) => api.patch(`/games/${gameId}/note`),

  getPending: (leagueId) => api.get(`/games/pending/${leagueId}`),
  confirm: (gameId) => api.post(`/games/${gameId}/confirm`),
  reject: (gameId) => api.post(`/games/${gameId}/reject`),
}

export const players = {
  getLeaguePlayers: (leagueId) => api.get(`/players/league/${leagueId}`),
  getStats: (userId, leagueId) =>
    api.get(`/players/${userId}/stats/${leagueId}`),
  getH2H: (user1Id, user2Id, leagueId) =>
    api.get(`/players/h2h/${user1Id}/${user2Id}/${leagueId}`),
}
