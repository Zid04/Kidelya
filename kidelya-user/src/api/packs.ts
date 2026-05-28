import api from "./axios"

export type PackPayload = Record<string, unknown>

export const packsApi = {
  all: () => api.get<unknown>("/packs"),
  create: (data: PackPayload) => api.post<unknown>("/packs", data),
  one: (id: number) => api.get<unknown>(`/packs/${id}`),
  update: (id: number, data: PackPayload) =>
    api.put<unknown>(`/packs/${id}`, data),
  delete: (id: number) => api.delete<unknown>(`/packs/${id}`),

  addActivity: (id: number, activityId: number) =>
    api.post<unknown>(`/packs/${id}/activities`, { activity_id: activityId }),

  removeActivity: (id: number, activityId: number) =>
    api.delete<unknown>(`/packs/${id}/activities`, {
      data: { activity_id: activityId },
    }),

  publish: (id: number) => api.patch<unknown>(`/packs/${id}/publish`),
  unpublish: (id: number) => api.patch<unknown>(`/packs/${id}/unpublish`),
}
