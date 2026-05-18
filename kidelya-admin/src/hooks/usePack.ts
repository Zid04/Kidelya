import { useQuery } from '@tanstack/react-query'
import { getPack } from '../api/packs'

export function usePack(id: number) {
  return useQuery({
    queryKey: ['pack', id],
    queryFn: () => getPack(id),
    enabled: !!id,
  })
}
