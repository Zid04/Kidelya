import api from './axios'

export const getUsers = (params?: any) =>
  api.get('/users', { params }).then(res => res.data)

export const getUser = (id: number) =>
  api.get(`/users/${id}`).then(res => res.data)

export const updateUser = (id: number, data: any) =>
  api.put(`/users/${id}`, data).then(res => res.data)

export const deleteUser = (id: number) =>
  api.delete(`/users/${id}`)

export const deactivateUser = (id: number) =>
  api.patch(`/users/${id}/deactivate`)
