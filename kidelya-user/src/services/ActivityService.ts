import api from "../api/axios"
import type { Activity } from "@/types/Activity"

// 🔹 Récupérer les activités du user connecté
export async function getMyActivities(): Promise<Activity[]> {
  const res = await api.get<Activity[]>("/users/me/activities")
  return res.data
}

// 🔹 Récupérer une activité du user (pour la page Edit)
export async function getMyActivity(id: number): Promise<Activity> {
  const res = await api.get<Activity>(`/users/me/activities/${id}`)
  return res.data
}

// 🔹 Créer une activité
export async function createActivity(data: FormData | object) {
  const res = await api.post("/activities", data)
  return res.data
}

// 🔹 Modifier une activité
export async function updateActivity(id: number, data: FormData | object) {
  const res = await api.put(`/activities/${id}`, data)
  return res.data
}

// 🔹 Supprimer une activité
export async function deleteActivity(id: number) {
  const res = await api.delete(`/activities/${id}`)
  return res.data
}
export async function getLibraryActivities(): Promise<Activity[]> {
  const res = await api.get("/activities/library")
  return res.data
}
