export interface Planning {
  idplanning: number
  title: string
  date: string | null
  start_time: string | null
  end_time: string | null
  description?: string | null
  location?: string | null
  iduser?: number
  idreport?: number | null
  created_at?: string
  updated_at?: string
}
