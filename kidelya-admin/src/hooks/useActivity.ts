import { useQuery } from '@tanstack/react-query'
import { getActivity } from '../api/activities'

export function useActivity(id: number) {
  return useQuery({
    queryKey: ['activity', id],
    queryFn: () => getActivity(id),
    enabled: !!id,
  })
}
