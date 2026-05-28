import api from "./axios"

export type ThemePayload = Record<string, unknown>

export const themesApi = {
  all: () => api.get<unknown>("/themes"),
  create: (data: ThemePayload) => api.post<unknown>("/themes", data),
  one: (id: number) => api.get<unknown>(`/themes/${id}`),
  update: (id: number, data: ThemePayload) =>
    api.put<unknown>(`/themes/${id}`, data),
  delete: (id: number) => api.delete<unknown>(`/themes/${id}`),

  addActivity: (id: number, activityId: number) =>
    api.post<unknown>(`/themes/${id}/activities`, {
      activity_id: activityId,
    }),

  removeActivity: (id: number, activityId: number) =>
    api.delete<unknown>(`/themes/${id}/activities`, {
      data: { activity_id: activityId },
    }),
}
