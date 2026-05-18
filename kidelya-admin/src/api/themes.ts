import api from './axios'

export const getThemes = () =>
  api.get('/themes').then(res => res.data)

export const getActivityThemes = (id: number) =>
  api.get(`/activities/${id}/themes`).then(res => res.data)

export const attachTheme = (id: number, themeId: number) =>
  api.post(`/activities/${id}/themes`, { theme_id: themeId })

export const detachTheme = (id: number, themeId: number) =>
  api.delete(`/activities/${id}/themes/${themeId}`)
