import { useQuery } from '@tanstack/react-query'
import { getSubscription } from '../api/subscriptions'

export function useSubscription(id: number) {
  return useQuery({
    queryKey: ['subscription', id],
    queryFn: () => getSubscription(id),
    enabled: !!id,
  })
}
