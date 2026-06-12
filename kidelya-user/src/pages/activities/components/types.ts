export type Tab = "apercu" | "etapes" | "materiel" | "informations" | "competences"

export interface Activity {
  idactivities: number
  title: string
  description?: string | null
  agemin?: number | null
  agemax?: number | null
  duration?: number | null
  photourl?: string | null
  steps?: Array<{ text: string; image: string | null }> | null
  category?: string | null
  difficulty?: string | null
  season?: string | null
  location?: string | null
  credit_price?: number | null
  created_at?: string
  materials?: string[] | null
  competences?: { idcompetence: number; name: string }[]
  themes?: { idtheme: number; name: string }[]
  packs?: { idpack: number; title: string }[]
  is_owned?: boolean
  has_subscription?: boolean
}

export const DIFF_COLOR: Record<string, string> = {
  facile:    "bg-green-100 text-green-700",
  moyen:     "bg-yellow-100 text-yellow-700",
  difficile: "bg-red-100 text-red-700",
}
