import { useState } from "react"

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)

      if (!item) {
        return initial
      }

      return JSON.parse(item) as T
    } catch {
      localStorage.removeItem(key)
      return initial
    }
  })

  const update = (newValue: T) => {
    try {
      setValue(newValue)

      localStorage.setItem(key, JSON.stringify(newValue))
    } catch {
    }
  }

  return [value, update] as const
}