import { useForm } from "@inertiajs/react"
import { useRef } from "react"
import Heading from "@/components/heading"
import InputError from "@/components/input-error"
import PasswordInput from "@/components/password-input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function DeleteUser() {
  const passwordInput = useRef<HTMLInputElement>(null)

  const { data, setData, post, processing, errors, reset } = useForm({
    password: "",
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    post("/settings/profile/delete", {
      preserveScroll: true,
      onError: () => passwordInput.current?.focus(),
      onSuccess: () => reset(),
    })
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
          <DialogTrigger asChild>
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
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                />

                <InputError message={errors.password} />
              </div>

              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button
                    variant="secondary"
                    onClick={() => reset()}
                    type="button"
                  >
                    Annuler
                  </Button>
                </DialogClose>

                <Button variant="warning" disabled={processing} type="submit">
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
