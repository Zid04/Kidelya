import api from "./axios"

export type CompetencePayload = Record<string, unknown>

export const competencesApi = {
  all: () => api.get<unknown>("/competences"),
  create: (data: CompetencePayload) => api.post<unknown>("/competences", data),
  one: (id: number) => api.get<unknown>(`/competences/${id}`),
  update: (id: number, data: CompetencePayload) =>
    api.put<unknown>(`/competences/${id}`, data),
  delete: (id: number) => api.delete<unknown>(`/competences/${id}`),

  addActivity: (id: number, activityId: number) =>
    api.post<unknown>(`/competences/${id}/activities`, {
      activity_id: activityId,
    }),

  removeActivity: (id: number, activityId: number) =>
    api.delete<unknown>(`/competences/${id}/activities`, {
      data: { activity_id: activityId },
    }),
}
