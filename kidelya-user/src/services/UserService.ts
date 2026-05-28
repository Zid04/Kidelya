import api from "../api/axios"
import type { DashboardResponse } from "@/types/Dashboard"

export async function getUserDashboard(): Promise<DashboardResponse> {
  const res = await api.get<DashboardResponse>("/dashboard")
  return res.data
}

export async function getUserProfile() {
  const res = await api.get("/users/me")
  return res.data
}

export async function updateUserProfile(data: {
  firstname: string
  lastname: string
  email: string
}) {
  const res = await api.put("/users/me", data)
  return res.data
}

export async function updateUserPassword(data: {
  current_password: string
  new_password: string
  new_password_confirmation: string
}) {
  const res = await api.put("/users/me/password", data)
  return res.data
}

export async function getUserActivities() {
  const res = await api.get("/users/me/activities")
  return res.data
}

export async function getRecommendedPacks() {
  const res = await api.get("/users/me/recommended-packs")
  return res.data
}

export async function getUserPacks() {
  const res = await api.get("/users/me/packs")
  return res.data
}
