import api from "./axios"

export type FavoritePayload = Record<string, unknown>

export const favoritesApi = {
  all: () => api.get<unknown>("/favorites"),
  add: (data: FavoritePayload) => api.post<unknown>("/favorites/add", data),
  remove: (data: FavoritePayload) =>
    api.delete<unknown>("/favorites/remove", { data }),
}
