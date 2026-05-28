import { useMutation, useQuery } from "@tanstack/react-query"
import { twoFactorApi } from "@/api/twoFactor"

export const OTP_MAX_LENGTH = 6

/**
 * Récupère QR Code + clé secrète
 */
export async function fetchSetupData() {
  const [qr, secret] = await Promise.all([
    twoFactorApi.qrCode(),
    twoFactorApi.secretKey(),
  ])

  return {
    qrCodeSvg: qr.data.svg,
    manualSetupKey: secret.data.secret,
  }
}

/**
 * Hook principal 2FA
 */
export function useTwoFactor() {
  // Récupération des codes de récupération
  const recoveryCodesQuery = useQuery({
    queryKey: ["2fa-recovery-codes"],
    queryFn: () => twoFactorApi.recoveryCodes(),
    enabled: false,
  })

  // Régénération des codes
  const regenerateMutation = useMutation({
    mutationFn: () => twoFactorApi.regenerate(),
  })

  // Confirmation du code OTP
  const confirmMutation = useMutation({
    mutationFn: (code: string) => twoFactorApi.confirm(code),
  })

  // Activation 2FA
  const enableMutation = useMutation({
    mutationFn: () => twoFactorApi.enable(),
  })

  // Désactivation 2FA
  const disableMutation = useMutation({
    mutationFn: () => twoFactorApi.disable(),
  })

  return {
    recoveryCodesQuery,
    regenerateMutation,
    confirmMutation,
    enableMutation,
    disableMutation,
  }
}
