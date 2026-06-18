import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api',
  timeout: 10000,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Nettoyage automatique des réponses Laravel
    if (response.data?.data?.data) {
      response.data = response.data.data
    }
    return response
  },
  (error: AxiosError) => {
    const status = error.response?.status

    if (status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    if (status === 403) {
      console.error('Accès refusé')
    }

    if (status === 422) {
      console.error('Erreur de validation', error.response?.data)
    }

    if (status === 500) {
      console.error('Erreur serveur')
    }

    return Promise.reject(error)
  }
)

export default api
