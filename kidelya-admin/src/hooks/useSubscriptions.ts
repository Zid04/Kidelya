import { useQuery } from '@tanstack/react-query'
import { getSubscriptions } from '../api/subscriptions'

export function useSubscriptions(params?: any) {
  return useQuery({
    queryKey: ['subscriptions', params],
    queryFn: () => getSubscriptions(params),
  })
}
