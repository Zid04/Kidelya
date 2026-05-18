import { useQuery } from '@tanstack/react-query'
import { getActivities } from '../api/activities'

export function useActivities(params: any) {
  return useQuery({
    queryKey: ['activities', params],
    queryFn: () => getActivities(params),
  })
}
