import api from "./axios"

export type ChildPayload = Record<string, unknown>

export const childrenApi = {
  all: () => api.get<unknown>("/children"),
  create: (data: ChildPayload) => api.post<unknown>("/children", data),
  one: (id: number) => api.get<unknown>(`/children/${id}`),
  update: (id: number, data: ChildPayload) =>
    api.put<unknown>(`/children/${id}`, data),
  delete: (id: number) => api.delete<unknown>(`/children/${id}`),
}
