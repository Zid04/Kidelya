import { useState } from "react"
import { useAuth } from "@/context/useAuth"
import { usersApi } from "@/api/user"
import api from "@/api/axios"
import PasswordInput from "./password-input"
import InputError from "./InputError"
import { Dialog, DialogTitle, DialogDescription, DialogFooter } from "./ui/Dialog"

export default function DeleteUser() {
  const { user, logout } = useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleOpen = () => {
    setPassword("")
    setError(null)
    setDialogOpen(true)
  }

  const handleClose = () => {
    setDialogOpen(false)
    setPassword("")
    setError(null)
  }

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return

    setLoading(true)
    setError(null)

    try {
      // 1) Vérifier le mot de passe via le login
      await api.post("/login", { email: user?.email, password })
    } catch {
      setError("Mot de passe incorrect. Veuillez réessayer.")
      setLoading(false)
      return
    }

    try {
      // 2) Supprimer le compte
      await usersApi.delete(user!.iduser)
      logout()
    } catch {
      setError("Une erreur est survenue lors de la suppression. Réessayez.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <h3 className="font-black text-red-700">Supprimer le compte</h3>
        <p className="mt-1 text-sm text-red-600">
          Action irréversible — toutes vos données seront définitivement supprimées.
        </p>
        <button
          type="button"
          onClick={handleOpen}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
        >
          Supprimer mon compte
        </button>
      </div>

      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogDescription>
          Entrez votre mot de passe pour confirmer la suppression définitive de votre compte.
        </DialogDescription>

        <form onSubmit={handleDelete} className="mt-5 space-y-4">
          <PasswordInput
            id="delete-password"
            name="delete-password"
            placeholder="Votre mot de passe actuel"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            className="h-11 w-full rounded-xl border border-gray-200"
          />
          {error && <InputError message={error} />}

          <DialogFooter>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !password}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Suppression…" : "Confirmer la suppression"}
            </button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  )
}
