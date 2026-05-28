import api from "./axios"

export type GroupPayload = Record<string, unknown>

export const groupsApi = {
  all: () => api.get<unknown>("/groups"),
  create: (data: GroupPayload) => api.post<unknown>("/groups", data),
  one: (id: number) => api.get<unknown>(`/groups/${id}`),
  update: (id: number, data: GroupPayload) =>
    api.put<unknown>(`/groups/${id}`, data),
  delete: (id: number) => api.delete<unknown>(`/groups/${id}`),

  addChild: (id: number, childId: number) =>
    api.post<unknown>(`/groups/${id}/children`, { child_id: childId }),

  removeChild: (id: number, childId: number) =>
    api.delete<unknown>(`/groups/${id}/children`, {
      data: { child_id: childId },
    }),
}
