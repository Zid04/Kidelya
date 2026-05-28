import api from "../api/axios"

export async function getThemes() {
  const res = await api.get("/themes")
  return res.data
}
