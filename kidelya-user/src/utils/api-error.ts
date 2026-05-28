import type { AxiosError } from "axios"

type LaravelValidationErrors = Record<string, string[]>

interface LaravelErrorResponse {
  message?: string
  errors?: LaravelValidationErrors
}

export function getApiError(error: unknown): string[] {
  const err = error as AxiosError<LaravelErrorResponse>

  // Validation Laravel : { errors: { email: ["Le champ email est obligatoire"] } }
  if (err.response?.data?.errors) {
    const validationErrors = err.response.data.errors

    return Object.values(validationErrors)
      .flat()
      .map((msg) => String(msg))
  }

  // Message simple Laravel : { message: "Identifiants invalides" }
  if (err.response?.data?.message) {
    return [String(err.response.data.message)]
  }

  // Erreur réseau
  if (err.message === "Network Error") {
    return ["Impossible de contacter le serveur"]
  }

  return ["Une erreur est survenue"]
}
