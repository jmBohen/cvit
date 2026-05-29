import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
})

// Interceptor: dodaj token JWT do każdego żądania
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor: przy 401 wyloguj użytkownika
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nie wylogowuj/nie odświeżaj strony, jeśli błąd 401 pochodzi z próby logowania
    if (error.response?.status === 401 && error.config?.url !== '/auth/login') {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default apiClient
