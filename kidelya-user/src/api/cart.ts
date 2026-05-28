import api from "./axios"

export type CartPayload = Record<string, unknown>

export const cartApi = {
  all: () => api.get<unknown>("/cart"),
  add: (data: CartPayload) => api.post<unknown>("/cart/add", data),
  update: (id: number, data: CartPayload) =>
    api.patch<unknown>(`/cart/${id}`, data),
  remove: (id: number) => api.delete<unknown>(`/cart/${id}`),
  clear: () => api.delete<unknown>("/cart"),
}
