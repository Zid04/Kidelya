import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../api/users'

export function useUsers(params?: any) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
  })
}
