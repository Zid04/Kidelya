export interface Pack {
  idpack: number
  title: string
  description?: string | null
  tarification: number | string
  duration: number
  createdby?: number
  illustration?: string | null
  is_published?: boolean
  type?: string | null
  created_at?: string
  updated_at?: string
}

// Options retournées par l'API /public/packs pour alimenter les filtres
export interface PackFilterOptions {
  types: string[]
  seasons: string[]
  age_ranges: string[]
  themes: string[]
}

export interface PackPaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}
