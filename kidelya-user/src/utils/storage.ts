export function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function load<T>(key: string, fallback: T): T {
  const item = localStorage.getItem(key)
  if (!item) return fallback

  try {
    return JSON.parse(item) as T
  } catch {
    return fallback
  }
}

export function remove(key: string): void {
  localStorage.removeItem(key)
}
