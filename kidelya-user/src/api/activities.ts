import api from "./axios"

export type ActivityPayload = Record<string, unknown>

export const activitiesApi = {
  all: () => api.get<unknown>("/activities"),
  create: (data: ActivityPayload) => api.post<unknown>("/activities", data),
  one: (id: number) => api.get<unknown>(`/activities/${id}`),
  update: (id: number, data: ActivityPayload) =>
    api.put<unknown>(`/activities/${id}`, data),
  delete: (id: number) => api.delete<unknown>(`/activities/${id}`),
  publish: (id: number) => api.patch<unknown>(`/activities/${id}/publish`),
  unpublish: (id: number) => api.patch<unknown>(`/activities/${id}/unpublish`),
}
