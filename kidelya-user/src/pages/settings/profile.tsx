import { useState } from "react"
import Heading from "@/components/Heading"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/Button"
import InputError from "@/components/InputError"
import DeleteUser from "@/components/DeleteUser"
import { useUser } from "@/hooks/useUser"
import { updateProfile } from "@/api/user"

export default function ProfileSettingsPage() {
  const { user, refreshUser } = useUser()

  const [form, setForm] = useState({
    firstname: user?.firstname ?? "",
    lastname: user?.lastname ?? "",
    email: user?.email ?? "",
  })

  const [errors, setErrors] = useState<{ firstname?: string; lastname?: string; email?: string }>({})
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSaved(false)
    setErrors({})

    try {
      await updateProfile(form)
      await refreshUser()
      setSaved(true)
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as {
          response?: { data?: { errors?: Record<string, string[]> } }
        }
        setErrors(axiosErr.response?.data?.errors || {})
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <Heading
          variant="small"
          title="Informations du profil"
          description="Modifiez vos informations personnelles"
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Firstname */}
          <div className="grid gap-2">
            <Label htmlFor="firstname">Prénom</Label>
            <Input
              id="firstname"
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              required
              placeholder="Votre prénom"
            />
            <InputError message={errors.firstname ?? null} />
 
          </div>

          {/* Lastname */}
          <div className="grid gap-2">
            <Label htmlFor="lastname">Nom</Label>
            <Input
              id="lastname"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              required
              placeholder="Votre nom"
            />
            <InputError message={errors.lastname ?? null} />
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Adresse email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Votre email"
            />
            <InputError message={errors.email ?? null} />
          </div>

          {/* Save */}
          <div className="flex items-center gap-4">
            <Button disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>

            {saved && (
              <p className="text-sm text-green-600">Modifications enregistrées</p>
            )}
          </div>
        </form>
      </div>

      <DeleteUser />
    </div>
  )
}
