import { useState, useRef } from "react"
import { useAuth } from "@/context/useAuth"
import { usersApi } from "@/api/user"
import { useMutation } from "@tanstack/react-query"

import Heading from "./Heading"
import InputError from "./InputError"
import PasswordInput from "./password-input"

import { Button } from "./ui/Button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog"
import { Label } from "./ui/label"

export default function DeleteUser() {
  const { user, setUser } = useAuth()
  const passwordInput = useRef<HTMLInputElement>(null)

  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return usersApi.delete(user!.iduser)
    },
    onSuccess: () => {
      setUser(null)
      window.location.href = "/"
    },
    onError: () => {
      setError("Mot de passe incorrect")
      passwordInput.current?.focus()
    },
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    deleteMutation.mutate()
  }

  return (
    <div className="space-y-6">
      <Heading
        variant="small"
        title="Supprimer le compte"
        description="Supprime définitivement votre compte et toutes ses données."
      />

      <div className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="space-y-0.5 text-red-700">
          <p className="font-medium">Attention</p>
          <p className="text-sm">
            Cette action est irréversible. Toutes vos données seront supprimées.
          </p>
        </div>

        <Dialog>
          <DialogTrigger>
            <Button variant="warning">Supprimer mon compte</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Pour confirmer la suppression définitive de votre compte, veuillez
              entrer votre mot de passe.
            </DialogDescription>

            <form onSubmit={submit} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="password" className="sr-only">
                  Mot de passe
                </Label>

                <PasswordInput
                  id="password"
                  name="password"
                  ref={passwordInput}
                  placeholder="Mot de passe"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <InputError message={error} />
              </div>

              <DialogFooter className="gap-2">
                <DialogClose>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      setPassword("")
                      setError(null)
                    }}
                  >
                    Annuler
                  </Button>
                </DialogClose>

                <Button
                  variant="warning"
                  disabled={deleteMutation.isPending}
                  type="submit"
                >
                  Confirmer la suppression
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
