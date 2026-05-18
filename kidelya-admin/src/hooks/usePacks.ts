import { useQuery } from '@tanstack/react-query'
import { getPacks } from '../api/packs'

export function usePacks(params?: any) {
  return useQuery({
    queryKey: ['packs', params],
    queryFn: () => getPacks(params),
  })
}
