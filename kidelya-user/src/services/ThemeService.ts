import api from "../api/axios"

export async function getThemes() {
  const res = await api.get("/themes")
  const raw = res.data
  if (Array.isArray(raw?.data)) return raw.data
  if (Array.isArray(raw)) return raw
  return []
}
