export interface DashboardUser {
  id: number
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
  id: number
  title: string
  category: string
  age_range: string
  created_at: string
}

export interface DashboardPack {
  id: number
  name: string
  theme: string
  age_range: string
}

export interface DashboardResponse {
  user: DashboardUser
  stats: DashboardStats
  activities: DashboardActivity[]
  recommended_packs: DashboardPack[]
}
