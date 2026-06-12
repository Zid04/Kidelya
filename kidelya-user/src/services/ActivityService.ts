import api from "../api/axios"
import type { Activity } from "@/types/Activity"

// 🔹 Récupérer les activités de l'utilisateur connecté
export async function getMyActivities(): Promise<Activity[]> {
  const res = await api.get("/activities/mine")
  const raw = res.data

  if (Array.isArray(raw?.data)) return raw.data
  if (Array.isArray(raw)) return raw
  return []
}

// 🔹 Récupérer une activité
export async function getMyActivity(id: number): Promise<Activity> {
  const res = await api.get(`/activities/${id}`)
  return res.data.data ?? res.data
}

// 🔹 Créer une activité
export async function createActivity(data: FormData | object) {
  const res = await api.post("/activities", data)
  return res.data
}

// 🔹 Modifier une activité (POST + _method=PUT pour supporter les fichiers multipart)
export async function updateActivity(id: number, data: FormData | object) {
  const res = await api.post(`/activities/${id}`, data)
  return res.data
}

// 🔹 Supprimer une activité
export async function deleteActivity(id: number) {
  const res = await api.delete(`/activities/${id}`)
  return res.data
}

// 🔹 Activités de la bibliothèque
export async function getLibraryActivities(): Promise<Activity[]> {
  const res = await api.get("/activities/library")
  const raw = res.data

  if (Array.isArray(raw?.data)) return raw.data
  if (Array.isArray(raw)) return raw

  return []
}

// 🔹 Détail d'une activité de la bibliothèque
export async function getLibraryActivity(id: number): Promise<Activity> {
  const res = await api.get(`/activities/library/${id}`)
  return res.data.data ?? res.data
}

// 🔹 Créer une session Stripe pour l'achat individuel d'une activité
export async function createActivityCheckout(activityId: number): Promise<string> {
  const res = await api.post("/stripe/activity-checkout", { activity_id: activityId })
  return res.data.url
}

// 🔹 Créer une session Stripe pour l'achat d'un pack
export async function createPackCheckout(packId: number): Promise<string> {
  const res = await api.post("/stripe/checkout", { pack_id: packId })
  return res.data.url
}
