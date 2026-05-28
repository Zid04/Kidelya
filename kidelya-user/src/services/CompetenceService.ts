import api from "../api/axios"

export async function getCompetences() {
  const res = await api.get("/competences")
  return res.data
}
