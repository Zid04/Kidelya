import { useQuery } from '@tanstack/react-query'
import { getPackActivities } from '../api/packs'

export function usePackActivities(id: number) {
  return useQuery({
    queryKey: ['pack-activities', id],
    queryFn: () => getPackActivities(id),
    enabled: !!id,
  })
}
