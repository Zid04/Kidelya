import type { Theme, Competence } from "./Taxonomies"

export interface Activity {
  idactivities: number

  title: string
  description?: string | null

  agemin?: number | null
  agemax?: number | null
  duration?: number | null

  season?: string | null
  location?: string | null
  photourl?: string | null

  steps?: string | null
  category?: string | null
  difficulty?: string | null

  credit_price?: number | null
  is_purchasable: boolean
  is_published: boolean
 materials?: string[] | null
  iduser: number

  created_at?: string
  updated_at?: string
   is_owned?: boolean
  has_subscription?: boolean
   themes?: Theme[]
  competences?: Competence[]

  included_in_subscription?: boolean
  included_in_packs?: {
    idpack: number
    name: string
    photourl?: string | null
  }[]
}
