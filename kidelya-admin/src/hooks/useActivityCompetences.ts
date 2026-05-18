import { useQuery } from '@tanstack/react-query'
import { getActivityCompetences } from '../api/competences'

export function useActivityCompetences(id: number) {
  return useQuery({
    queryKey: ['activity-competences', id],
    queryFn: () => getActivityCompetences(id),
    enabled: !!id,
  })
}
