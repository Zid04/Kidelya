import { useQuery } from '@tanstack/react-query'
import { getStats } from '../api/statistics'

export function useStatistics() {
  return useQuery({
    queryKey: ['statistics'],
    queryFn: () => getStats(),
  })
}
