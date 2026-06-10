import api from "./axios"
import type { User } from "@/types/User"

export type UserPayload = Record<string, unknown>

export const usersApi = {
  logout: () => api.post("/logout"),

  all: () => api.get<User[]>("/users"),

  create: (data: UserPayload) =>
    api.post<User>("/users", data),

  me: () => api.get<User>("/users/me"),

  one: (id: number) =>
    api.get<User>(`/users/${id}`),

  update: (id: number, data: UserPayload) =>
    api.put<User>(`/users/${id}`, data),

  delete: (id: number) =>
    api.delete(`/users/${id}`),

  activate: (id: number) =>
    api.patch<User>(`/users/${id}/activate`),

  deactivate: (id: number) =>
    api.patch<User>(`/users/${id}/deactivate`),
}
export async function updateProfile(id: number, data: {
  firstname: string
  lastname: string
  email: string
}) {
  return api.put<User>(`/users/${id}`, data)
}