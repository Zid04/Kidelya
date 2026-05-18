import api from './axios'

export const getSubscriptions = (params?: any) =>
  api.get('/subscriptions', { params }).then(res => res.data)

export const getSubscription = (id: number) =>
  api.get(`/subscriptions/${id}`).then(res => res.data)

export const deactivateSubscription = (id: number) =>
  api.patch(`/subscriptions/${id}/deactivate`)

export const renewSubscription = (id: number) =>
  api.patch(`/subscriptions/${id}/renew`)
