export const validators = {
  email: (value: string) => /\S+@\S+\.\S+/.test(value),
  required: (value: any) => value !== null && value !== undefined && value !== '',
  min: (value: string | number, min: number) => String(value).length >= min,
}
