import api from './axios'

export const getActivities = (params: any) =>
  api.get('/activities', { params }).then(res => res.data)

export const getActivity = (id: number) =>
  api.get(`/activities/${id}`).then(res => res.data)

export const createActivity = (data: any) =>
  api.post('/activities', data).then(res => res.data)

export const updateActivity = (id: number, data: any) =>
  api.put(`/activities/${id}`, data).then(res => res.data)

export const deleteActivity = (id: number) =>
  api.delete(`/activities/${id}`)

export const publishActivity = (id: number) =>
  api.patch(`/activities/${id}/publish`)

export const unpublishActivity = (id: number) =>
  api.patch(`/activities/${id}/unpublish`)
