import api from "./axios"

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/login", { email, password }),

  register: (data: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) => api.post("/register", data),

  logout: () => api.post("/logout"),

  forgotPassword: (email: string) =>
    api.post("/forgot-password", { email }),

  resetPassword: (data: {
    token: string
    email: string
    password: string
    password_confirmation: string
  }) => api.post("/reset-password", data),
}
