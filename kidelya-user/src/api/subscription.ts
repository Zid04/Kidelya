import api from "./axios"

export type SubscriptionPayload = Record<string, unknown>

export const subscriptionsApi = {
  all: () => api.get<unknown>("/subscriptions"),
  one: (id: number) => api.get<unknown>(`/subscriptions/${id}`),

  status: () => api.get<unknown>("/subscriptions/status"),
  plans: () => api.get<unknown>("/subscriptions/plans"),

  subscribe: (data: SubscriptionPayload) =>
    api.post<unknown>("/subscriptions/subscribe", data),

  cancel: () => api.post<unknown>("/subscriptions/cancel"),

  deactivate: (id: number) =>
    api.patch<unknown>(`/subscriptions/${id}/deactivate`),

  renew: (id: number) =>
    api.patch<unknown>(`/subscriptions/${id}/renew`),
}
