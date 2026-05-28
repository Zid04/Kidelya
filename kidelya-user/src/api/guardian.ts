import api from "./axios"

export type GuardianPayload = Record<string, unknown>

export const guardiansApi = {
  all: () => api.get<unknown>("/guardians"),
  create: (data: GuardianPayload) => api.post<unknown>("/guardians", data),
  one: (id: number) => api.get<unknown>(`/guardians/${id}`),
  update: (id: number, data: GuardianPayload) =>
    api.put<unknown>(`/guardians/${id}`, data),
  delete: (id: number) => api.delete<unknown>(`/guardians/${id}`),

  addChild: (id: number, childId: number) =>
    api.post<unknown>(`/guardians/${id}/children`, { child_id: childId }),

  removeChild: (id: number, childId: number) =>
    api.delete<unknown>(`/guardians/${id}/children`, {
      data: { child_id: childId },
    }),
}
