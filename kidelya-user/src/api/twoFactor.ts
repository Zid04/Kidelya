import api from "./axios"

export const twoFactorApi = {
  // Activer 2FA
  enable: () => api.post("/user/two-factor-auth"),

  // Désactiver 2FA
  disable: () => api.delete("/user/two-factor-auth"),

  // QR Code SVG
  qrCode: () => api.get("/user/two-factor-qr-code"),

  // Clé secrète (setup key)
  secretKey: () => api.get("/user/two-factor-secret-key"),

  // Codes de récupération
  recoveryCodes: () => api.get("/user/two-factor-recovery-codes"),

  // Régénérer les codes de récupération
  regenerate: () => api.post("/user/two-factor-recovery-codes"),

  // Confirmer le code OTP
  confirm: (code: string) =>
    api.post("/user/confirmed-two-factor-authentication", { code }),
}
