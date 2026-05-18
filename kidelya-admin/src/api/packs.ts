import api from './axios'

export const getPacks = (params?: any) =>
  api.get('/packs', { params }).then(res => res.data)

export const getPack = (id: number) =>
  api.get(`/packs/${id}`).then(res => res.data)

export const createPack = (data: any) =>
  api.post('/packs', data).then(res => res.data)

export const updatePack = (id: number, data: any) =>
  api.put(`/packs/${id}`, data).then(res => res.data)

export const deletePack = (id: number) =>
  api.delete(`/packs/${id}`)

export const getPackActivities = (id: number) =>
  api.get(`/packs/${id}/activities`).then(res => res.data)

export const attachActivityToPack = (id: number, activityId: number) =>
  api.post(`/packs/${id}/activities`, { activity_id: activityId })

export const detachActivityFromPack = (id: number, activityId: number) =>
  api.delete(`/packs/${id}/activities/${activityId}`)
