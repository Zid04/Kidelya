import api from "./axios"

export type IdeaPayload = Record<string, unknown>

export const ideasApi = {
  all: () => api.get<unknown>("/ideas"),
  create: (data: IdeaPayload) => api.post<unknown>("/ideas", data),
  one: (id: number) => api.get<unknown>(`/ideas/${id}`),
  update: (id: number, data: IdeaPayload) =>
    api.put<unknown>(`/ideas/${id}`, data),
  delete: (id: number) => api.delete<unknown>(`/ideas/${id}`),
}
