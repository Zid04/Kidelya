import api from "../api/axios"

export async function getCompetences() {
  const res = await api.get("/competences")
  const raw = res.data
  if (Array.isArray(raw?.data)) return raw.data
  if (Array.isArray(raw)) return raw
  return []
}
