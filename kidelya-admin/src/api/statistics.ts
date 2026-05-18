import api from './axios'

export const getStats = () =>
  api.get('/stats').then(res => res.data)

export const getStatsSummary = () =>
  api.get('/stats/summary').then(res => res.data)
