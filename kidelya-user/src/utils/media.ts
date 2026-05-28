const rawBase = import.meta.env.VITE_API_URL || "/api"
const appBaseUrl = rawBase.replace(/\/api\/?$/, "").replace(/\/$/, "")

export function mediaUrl(path?: string | null) {
  if (!path) return null

  if (/^(https?:)?\/\//i.test(path) || path.startsWith("data:")) {
    return path
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  return `${appBaseUrl}${normalizedPath}`
}

export function formatPrice(value: number | string | null | undefined) {
  const amount = Number(value ?? 0)

  return `${Number.isFinite(amount) ? amount.toFixed(2) : "0.00"} €`
}
