import api from "./axios"

export type PlanningPayload = Record<string, unknown>

export const planningsApi = {
  all: () => api.get<unknown>("/plannings"),
  create: (data: PlanningPayload) => api.post<unknown>("/plannings", data),
  one: (id: number) => api.get<unknown>(`/plannings/${id}`),
  update: (id: number, data: PlanningPayload) =>
    api.put<unknown>(`/plannings/${id}`, data),
  delete: (id: number) => api.delete<unknown>(`/plannings/${id}`),

  addActivity: (id: number, activityId: number) =>
    api.post<unknown>(`/plannings/${id}/activities`, {
      activity_id: activityId,
    }),

  removeActivity: (id: number, activityId: number) =>
    api.delete<unknown>(`/plannings/${id}/activities`, {
      data: { activity_id: activityId },
    }),

  addChild: (id: number, childId: number) =>
    api.post<unknown>(`/plannings/${id}/children`, {
      child_id: childId,
    }),

  removeChild: (id: number, childId: number) =>
    api.delete<unknown>(`/plannings/${id}/children`, {
      data: { child_id: childId },
    }),

  addGroup: (id: number, groupId: number) =>
    api.post<unknown>(`/plannings/${id}/groups`, {
      group_id: groupId,
    }),

  removeGroup: (id: number, groupId: number) =>
    api.delete<unknown>(`/plannings/${id}/groups`, {
      data: { group_id: groupId },
    }),
}
