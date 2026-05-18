import { useQuery } from '@tanstack/react-query'
import { getActivityThemes } from '../api/themes'

export function useActivityThemes(id: number) {
  return useQuery({
    queryKey: ['activity-themes', id],
    queryFn: () => getActivityThemes(id),
    enabled: !!id,
  })
}
