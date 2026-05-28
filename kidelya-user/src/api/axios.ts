import axios from "axios"
import { load } from "../utils/storage"

const rawBase = import.meta.env.VITE_API_URL || "/api"
const normalizedBase = rawBase.replace(/\/$/, "")
const baseURL = normalizedBase.endsWith("/api")
  ? normalizedBase
  : `${normalizedBase}/api`

const api = axios.create({
  baseURL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = load("token", "")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
