import api from './axios'

export const getCompetences = () =>
  api.get('/competences').then(res => res.data)

export const getActivityCompetences = (id: number) =>
  api.get(`/activities/${id}/competences`).then(res => res.data)

export const attachCompetence = (id: number, competenceId: number) =>
  api.post(`/activities/${id}/competences`, { competence_id: competenceId })

export const detachCompetence = (id: number, competenceId: number) =>
  api.delete(`/activities/${id}/competences/${competenceId}`)
