import { useState } from "react"

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)

      if (!item) {
        return initial
      }

      return JSON.parse(item) as T
    } catch (error) {
      console.error("Erreur localStorage :", error)

      localStorage.removeItem(key)

      return initial
    }
  })

  const update = (newValue: T) => {
    try {
      setValue(newValue)

      localStorage.setItem(key, JSON.stringify(newValue))
    } catch (error) {
      console.error("Erreur sauvegarde localStorage :", error)
    }
  }

  return [value, update] as const
}