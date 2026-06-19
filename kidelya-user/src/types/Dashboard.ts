export interface DashboardUser {
  iduser: number
  firstname: string
  lastname: string
  email: string
}

export interface DashboardStats {
  activities_created: number
  activities_favorites: number
  activities_planned: number
  packs_purchased: number
}

export interface DashboardActivity {
  idactivities: number
  title: string
  category: string
  age_range: string
  created_at: string
  photourl?: string | null
}

export interface DashboardPack {
  idpack: number
  title: string
  theme: string
  age_range: string
  illustration?: string | null
}

export interface DashboardResponse {
  user: DashboardUser
  stats: DashboardStats
  activities: DashboardActivity[]
  recommended_packs: DashboardPack[]
}
