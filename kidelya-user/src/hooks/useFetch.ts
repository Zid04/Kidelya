import { useEffect, useState } from "react"
import api from "../api/axios"
import { getApiError } from "../utils/api-error"

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    let mounted = true

    api.get(url)
      .then((res) => {
        if (mounted) setData(res.data)
      })
      .catch((err) => {
        if (mounted) setErrors(getApiError(err))
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [url])

  return { data, loading, errors }
}
