export function isEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function minLength(text: string, length: number) {
  return text.length >= length
}

export function required(value: string) {
  return value.trim().length > 0
}
